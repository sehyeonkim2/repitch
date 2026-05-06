import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TopNav } from "../components/TopNav";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { brands } from "../data/brands";
import { useApp } from "../state/AppContext";
import { llmClient, buildBackupProposal } from "../lib/llmClient";
import { exportElementAsPdf } from "../lib/pdfExport";
import { buildProposalTemplate } from "../data/proposalTemplates";
import type {
  Category,
  ContentFormat,
  ContentType,
  FollowerTier,
  Platform,
  ProposalInput,
  ReachBand,
  SubmittedProposal,
} from "../data/types";

const BRAND_CATEGORIES: Category[] = [
  "뷰티",
  "패션",
  "식품",
  "헬스·피트니스",
  "앱서비스",
  "라이프스타일",
  "전자기기",
];

const FORMATS: ContentFormat[] = ["릴스", "쇼츠", "유튜브 리뷰", "블로그", "틱톡"];
const PLATFORMS: Platform[] = ["Instagram", "YouTube", "TikTok", "Blog", "Twitter"];
const CONTENT_TYPES: ContentType[] = ["정보형", "감성형"];
const FOLLOWER_TIERS: FollowerTier[] = [
  "나노(1만↓)",
  "마이크로(1-10만)",
  "매크로(10-100만)",
  "메가(100만↑)",
];
const REACH_BANDS: ReachBand[] = ["1만 미만", "1~5만", "5~10만", "10~50만", "50만 이상"];

// Demo fallbacks for the 6 auto-injected scores when selectedInfluencer is missing them
const AUTO_FALLBACK = {
  전문성: 4.5,
  신뢰성: 4.8,
  진정성: 4.9,
  스토리텔링: 4.7,
  소비자_몰입: 4.5,
  브랜드_인플루언서_적합도: 4.8,
} as const;

const inferFollowerTier = (followers: number): FollowerTier => {
  if (followers < 10000) return "나노(1만↓)";
  if (followers < 100000) return "마이크로(1-10만)";
  if (followers < 1000000) return "매크로(10-100만)";
  return "메가(100만↑)";
};

const inferContentType = (tone: string): ContentType =>
  tone === "정보전달형" ? "정보형" : "감성형";

const newProposalId = () =>
  `prop_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

const ProposalSection = ({
  heading,
  body,
  loading,
}: {
  heading: string;
  body: string;
  loading: boolean;
}) => (
  <section className={loading ? "opacity-95" : ""}>
    <h3 className="font-headline-md text-headline-md text-primary mb-3 border-b border-surface-variant pb-2">
      {heading}
    </h3>
    <div className="font-body-lg text-body-lg text-on-surface leading-relaxed whitespace-pre-line">
      {body}
    </div>
  </section>
);

const TypingDots = () => (
  <span className="inline-flex items-center gap-1">
    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
    <span
      className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"
      style={{ animationDelay: "0.2s" }}
    />
    <span
      className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"
      style={{ animationDelay: "0.4s" }}
    />
  </span>
);

type RadioChipsProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  name: string;
};

const RadioChips = <T extends string>({ options, value, onChange, name }: RadioChipsProps<T>) => (
  <div className="flex flex-wrap gap-2">
    {options.map((o) => (
      <label
        key={o}
        className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-colors ${
          value === o
            ? "border-primary bg-primary-fixed text-on-primary-fixed-variant"
            : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary"
        }`}
      >
        <input
          type="radio"
          name={name}
          checked={value === o}
          onChange={() => onChange(o)}
          className="sr-only"
        />
        <span className="font-body-md text-body-md">{o}</span>
      </label>
    ))}
  </div>
);

const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="space-y-sm">
    <label className="font-label-sm text-label-sm text-on-surface block">{label}</label>
    {children}
    {hint && (
      <p className="font-caption text-caption text-on-surface-variant">{hint}</p>
    )}
  </div>
);

const STEP_TITLES = ["브랜드 정보", "콘텐츠 설정", "인플루언서 정보", "어필 포인트"];

const ProposalGenerator = () => {
  const navigate = useNavigate();
  const { selectedInfluencer, submitProposal } = useApp();

  const defaultBrand = useMemo(
    () => brands.find((b) => b.category === selectedInfluencer?.category) ?? brands[0],
    [selectedInfluencer],
  );

  // Step state
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 — 브랜드 정보
  const [브랜드명, set브랜드명] = useState(defaultBrand.name);
  const [브랜드_카테고리, set브랜드_카테고리] = useState<Category>(defaultBrand.category);

  // Step 2 — 콘텐츠 설정
  const [콘텐츠_포맷, set콘텐츠_포맷] = useState<ContentFormat>("릴스");
  const [플랫폼, set플랫폼] = useState<Platform>(
    selectedInfluencer?.플랫폼 ?? "Instagram",
  );
  const [콘텐츠유형, set콘텐츠유형] = useState<ContentType>(
    selectedInfluencer?.콘텐츠유형 ?? inferContentType(selectedInfluencer?.tone ?? "감성형"),
  );

  // Step 3 — 인플루언서 정보
  const [팔로워규모, set팔로워규모] = useState<FollowerTier>(
    selectedInfluencer?.팔로워규모 ?? inferFollowerTier(selectedInfluencer?.followers ?? 50000),
  );
  const [예상_도달, set예상_도달] = useState<ReachBand>("5~10만");
  const [보수, set보수] = useState("150만원");

  // Step 4 — 어필 포인트
  const [핵심_키워드_text, set핵심_키워드_text] = useState("보습, 자연성분, 데일리");
  const [타겟_소구점, set타겟_소구점] = useState("20대 여성 피부고민");

  // Resolve brand entity for downstream rendering (templates, KPI display).
  // Pick by exact name match first, then by category, falling back to the first brand.
  const brand = useMemo(() => {
    return (
      brands.find((b) => b.name === 브랜드명) ??
      brands.find((b) => b.category === 브랜드_카테고리) ??
      brands[0]
    );
  }, [브랜드명, 브랜드_카테고리]);

  // Auto-injected scores from selectedInfluencer (with demo fallback)
  const autoScores = useMemo(
    () => ({
      전문성: selectedInfluencer?.전문성 ?? AUTO_FALLBACK.전문성,
      신뢰성: selectedInfluencer?.신뢰성 ?? AUTO_FALLBACK.신뢰성,
      진정성: selectedInfluencer?.진정성 ?? AUTO_FALLBACK.진정성,
      스토리텔링: selectedInfluencer?.스토리텔링 ?? AUTO_FALLBACK.스토리텔링,
      소비자_몰입: selectedInfluencer?.소비자_몰입 ?? AUTO_FALLBACK.소비자_몰입,
      브랜드_인플루언서_적합도:
        selectedInfluencer?.브랜드_인플루언서_적합도 ??
        AUTO_FALLBACK.브랜드_인플루언서_적합도,
    }),
    [selectedInfluencer],
  );

  const [streamedText, setStreamedText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const previewRef = useRef<HTMLDivElement | null>(null);

  if (!selectedInfluencer) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <TopNav view="influencer" />
        <main className="max-w-3xl mx-auto px-margin py-xl text-center">
          <Icon
            name="person_search"
            size={48}
            className="!text-on-surface-variant"
          />
          <h1 className="font-headline-lg text-headline-lg text-on-surface mt-4">
            아직 작성한 역제안서가 없습니다
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 mb-6">
            매칭 화면에서 협업하고 싶은 브랜드를 골라 첫 제안서를 보내보세요.
          </p>
          <Button
            variant="primary"
            icon="explore"
            onClick={() => navigate("/matching")}
          >
            매칭 화면으로 이동
          </Button>
        </main>
      </div>
    );
  }

  const 핵심_키워드 = 핵심_키워드_text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const buildInput = (): ProposalInput => ({
    브랜드명,
    브랜드_카테고리,
    콘텐츠_포맷,
    플랫폼,
    콘텐츠유형,
    팔로워규모,
    예상_도달,
    보수,
    핵심_키워드,
    타겟_소구점,
    ...autoScores,
    influencer: selectedInfluencer,
    brand,
  });

  const stepValid: Record<1 | 2 | 3 | 4, boolean> = {
    1: 브랜드명.trim().length > 0,
    2: true,
    3: 보수.trim().length > 0,
    4: 핵심_키워드.length > 0 && 타겟_소구점.trim().length > 0,
  };
  const allValid = stepValid[1] && stepValid[3] && stepValid[4];

  const handleGenerate = async () => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setGenerating(true);
    setHasGenerated(true);
    setStreamedText("");

    try {
      const stream = llmClient.streamProposal({
        input: buildInput(),
        estimatedReach: selectedInfluencer.estimatedReach,
        estimatedCtr: selectedInfluencer.estimatedCtr,
        signal: ctrl.signal,
      });
      for await (const chunk of stream) {
        if (ctrl.signal.aborted) return;
        setStreamedText((prev) => prev + chunk);
      }
    } catch (err) {
      if ((err as DOMException).name !== "AbortError") {
        console.error(err);
      }
    } finally {
      if (!ctrl.signal.aborted) setGenerating(false);
    }
  };

  const handleBackup = () => {
    abortRef.current?.abort();
    setGenerating(false);
    setHasGenerated(true);
    const text = buildBackupProposal(
      buildInput(),
      selectedInfluencer.estimatedReach,
      selectedInfluencer.estimatedCtr,
    );
    setStreamedText(text);
  };

  const handleExportPdf = async () => {
    if (!previewRef.current) return;
    await exportElementAsPdf(
      previewRef.current,
      `repitch-${selectedInfluencer.handle}-제안서.pdf`,
    );
  };

  const handleSubmit = () => {
    if (!streamedText) return;
    const id = newProposalId();
    const proposal: SubmittedProposal = {
      id,
      createdAt: new Date().toISOString(),
      influencer: selectedInfluencer,
      brand,
      input: buildInput(),
      body: streamedText,
      estimatedReach: selectedInfluencer.estimatedReach,
      estimatedCtr: selectedInfluencer.estimatedCtr,
    };
    submitProposal(proposal);
    navigate(`/proposal/sent/${id}`);
  };

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  // Parse streamed text into sections by H3-style headings
  const renderedSections = useMemo(() => {
    if (!streamedText) return null;
    const lines = streamedText.split("\n");
    const sections: { heading: string; body: string }[] = [];
    let current: { heading: string; body: string } | null = null;
    let title = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (i === 0 && line.startsWith("Re:Pitch")) {
        title = lines[1] ?? "";
        i = 1;
        continue;
      }
      if (/^\d+\./.test(line.trim())) {
        if (current) sections.push(current);
        current = { heading: line.trim(), body: "" };
      } else if (current) {
        current.body += (current.body ? "\n" : "") + line;
      }
    }
    if (current) sections.push(current);
    return { title, sections };
  }, [streamedText]);

  const placeholderTemplate = useMemo(
    () => buildProposalTemplate(buildInput()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [브랜드명, 브랜드_카테고리, 콘텐츠_포맷, 플랫폼, 콘텐츠유형, 팔로워규모, 예상_도달, 보수, 핵심_키워드_text, 타겟_소구점],
  );

  const previewBody = (
    <div
      ref={previewRef}
      className="w-full max-w-[800px] bg-surface-container-lowest shadow-sm rounded-sm p-6 sm:p-12 lg:min-h-[1130px] border border-outline-variant"
    >
      <div className="border-b-2 border-on-surface pb-6 mb-10 text-center">
        <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-2">
          Re:Pitch 역제안서
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {renderedSections?.title || placeholderTemplate.title}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3 text-caption text-on-surface-variant flex-wrap">
          <span className="font-medium text-on-surface">
            @{selectedInfluencer.handle}
          </span>
          <Icon name="arrow_forward" size={16} />
          <span className="font-medium text-on-surface">{브랜드명}</span>
          <span className="text-on-surface-variant">· {브랜드_카테고리}</span>
        </div>
      </div>

      <div className="space-y-10">
        {hasGenerated && renderedSections ? (
          renderedSections.sections.map((s) => (
            <ProposalSection
              key={s.heading}
              heading={s.heading}
              body={s.body}
              loading={generating}
            />
          ))
        ) : (
          <div className="space-y-8">
            {placeholderTemplate.sections.map((s) => (
              <section key={s.heading} className="opacity-30">
                <h3 className="font-headline-md text-headline-md text-primary mb-3 border-b border-surface-variant pb-2">
                  {s.heading}
                </h3>
                <div className="space-y-2">
                  <div className="h-3 bg-surface-container rounded w-3/4" />
                  <div className="h-3 bg-surface-container rounded w-full" />
                  <div className="h-3 bg-surface-container rounded w-5/6" />
                </div>
              </section>
            ))}
          </div>
        )}
        {generating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-caption text-caption text-secondary flex items-center gap-2"
          >
            <TypingDots /> AI가 다음 섹션 작성 중...
          </motion.div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-background text-on-background min-h-screen pt-16">
      <TopNav view="influencer" />

      <main className="max-w-[1920px] mx-auto px-margin py-lg lg:h-[calc(100vh-72px)]">
        <div className="flex flex-col lg:flex-row gap-gutter lg:h-full">
          {/* Left: 4-step wizard */}
          <div className="w-full lg:w-1/3 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-lg flex flex-col lg:h-full lg:overflow-y-auto">
            <div className="mb-md">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                내 역제안서 작성
              </h2>
              <p className="font-caption text-caption text-on-surface-variant mt-1">
                <span className="font-medium text-on-surface">@{selectedInfluencer.handle}</span> · {STEP_TITLES[step - 1]}
              </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-lg">
              {STEP_TITLES.map((title, i) => {
                const n = (i + 1) as 1 | 2 | 3 | 4;
                const isActive = n === step;
                const isDone = n < step;
                return (
                  <button
                    key={title}
                    type="button"
                    onClick={() => setStep(n)}
                    className={`flex-1 h-1.5 rounded-full transition-colors ${
                      isActive
                        ? "bg-primary"
                        : isDone
                          ? "bg-primary/60"
                          : "bg-surface-container"
                    }`}
                    aria-label={`Step ${n}: ${title}`}
                  />
                );
              })}
            </div>

            <div className="space-y-lg flex-grow">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-lg"
                >
                  {step === 1 && (
                    <>
                      <Field label="브랜드명" hint="예: 라운드랩, 나이키, 배달의민족">
                        <input
                          type="text"
                          value={브랜드명}
                          onChange={(e) => set브랜드명(e.target.value)}
                          placeholder="브랜드명을 입력하세요"
                          className="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </Field>
                      <Field label="브랜드 카테고리">
                        <RadioChips
                          name="brand_category"
                          options={BRAND_CATEGORIES}
                          value={브랜드_카테고리}
                          onChange={set브랜드_카테고리}
                        />
                      </Field>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <Field label="콘텐츠 포맷">
                        <RadioChips
                          name="format"
                          options={FORMATS}
                          value={콘텐츠_포맷}
                          onChange={set콘텐츠_포맷}
                        />
                      </Field>
                      <Field label="플랫폼">
                        <RadioChips
                          name="platform"
                          options={PLATFORMS}
                          value={플랫폼}
                          onChange={set플랫폼}
                        />
                      </Field>
                      <Field
                        label="콘텐츠 유형"
                        hint="정보형: 기능·성분 설명 위주 / 감성형: 스토리·무드 위주"
                      >
                        <RadioChips
                          name="content_type"
                          options={CONTENT_TYPES}
                          value={콘텐츠유형}
                          onChange={set콘텐츠유형}
                        />
                      </Field>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <Field label="팔로워 규모">
                        <RadioChips
                          name="follower_tier"
                          options={FOLLOWER_TIERS}
                          value={팔로워규모}
                          onChange={set팔로워규모}
                        />
                      </Field>
                      <Field label="예상 도달" hint="본인 평균 조회수 기준으로 선택">
                        <RadioChips
                          name="reach"
                          options={REACH_BANDS}
                          value={예상_도달}
                          onChange={set예상_도달}
                        />
                      </Field>
                      <Field label="희망 보수" hint="예: 150만원">
                        <input
                          type="text"
                          value={보수}
                          onChange={(e) => set보수(e.target.value)}
                          placeholder="150만원"
                          className="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </Field>
                    </>
                  )}

                  {step === 4 && (
                    <>
                      <Field label="핵심 키워드" hint="쉼표로 구분해서 3개 입력">
                        <input
                          type="text"
                          value={핵심_키워드_text}
                          onChange={(e) => set핵심_키워드_text(e.target.value)}
                          placeholder="보습, 자연성분, 데일리"
                          className="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </Field>
                      <Field label="타겟 소구점" hint="한 문장으로 자유 입력">
                        <input
                          type="text"
                          value={타겟_소구점}
                          onChange={(e) => set타겟_소구점(e.target.value)}
                          placeholder="20대 여성 피부고민"
                          className="w-full h-12 px-4 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                      </Field>

                      <div className="bg-surface-container-low border border-outline-variant rounded-lg p-3 space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon name="auto_awesome" size={16} className="!text-primary" />
                          <span className="font-label-sm text-label-sm text-on-surface">
                            매칭 모델 자동 입력
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-caption text-caption text-on-surface-variant">
                          <span>전문성 {autoScores.전문성.toFixed(1)}</span>
                          <span>신뢰성 {autoScores.신뢰성.toFixed(1)}</span>
                          <span>진정성 {autoScores.진정성.toFixed(1)}</span>
                          <span>스토리텔링 {autoScores.스토리텔링.toFixed(1)}</span>
                          <span>소비자 몰입 {autoScores.소비자_몰입.toFixed(1)}</span>
                          <span>브랜드 적합도 {autoScores.브랜드_인플루언서_적합도.toFixed(1)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="pt-lg mt-auto flex gap-2">
              {step > 1 && (
                <Button
                  variant="ghost"
                  size="lg"
                  icon="arrow_back"
                  onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
                >
                  이전
                </Button>
              )}
              {step < 4 ? (
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  icon="arrow_forward"
                  disabled={!stepValid[step]}
                  onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3 | 4)}
                >
                  다음
                </Button>
              ) : (
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  icon={generating ? "progress_activity" : "auto_awesome"}
                  disabled={generating || !allValid}
                  onClick={handleGenerate}
                >
                  {generating
                    ? "AI 제안서 작성 중..."
                    : hasGenerated
                      ? "다시 생성하기"
                      : "AI 제안서 생성하기"}
                </Button>
              )}
            </div>
          </div>

          {/* Right: A4 preview (desktop) / collapsible on mobile */}
          <div className="w-full lg:w-2/3 bg-surface-container-low rounded-xl flex flex-col lg:h-full border border-outline-variant relative overflow-hidden">
            <div className="min-h-16 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between px-4 sm:px-6 py-2 shrink-0 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {generating ? (
                  <>
                    <TypingDots />
                    <span className="font-caption text-caption text-secondary">
                      typing...
                    </span>
                  </>
                ) : hasGenerated ? (
                  <Badge variant="secondary" icon="check_circle">
                    작성 완료
                  </Badge>
                ) : (
                  <span className="font-caption text-caption text-on-surface-variant">
                    아직 생성된 제안서가 없습니다
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {hasGenerated && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="open_in_full"
                    onClick={() => setPreviewModalOpen(true)}
                    className="lg:!hidden"
                  >
                    전체화면
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  icon="bolt"
                  onClick={handleBackup}
                  title="네트워크 장애 대비 — 즉시 백업 제안서 로드"
                >
                  백업
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon="download"
                  onClick={handleExportPdf}
                  disabled={!streamedText}
                >
                  PDF로 내보내기
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon="send"
                  onClick={handleSubmit}
                  disabled={!streamedText || generating}
                >
                  브랜드에 전송
                </Button>
              </div>
            </div>

            <div className="flex-grow lg:overflow-y-auto p-4 sm:p-8 flex justify-center bg-surface-dim/30">
              {previewBody}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile fullscreen preview modal */}
      <AnimatePresence>
        {previewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background flex flex-col lg:hidden"
          >
            <div className="h-14 border-b border-outline-variant flex items-center justify-between px-4 shrink-0">
              <span className="font-label-sm text-label-sm text-on-surface">
                제안서 미리보기
              </span>
              <Button
                variant="ghost"
                size="sm"
                icon="close"
                onClick={() => setPreviewModalOpen(false)}
              >
                닫기
              </Button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 flex justify-center bg-surface-dim/30">
              {previewBody}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProposalGenerator;
