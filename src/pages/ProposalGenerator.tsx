import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  ContentFormat,
  ProposalInput,
  SubmittedProposal,
} from "../data/types";

const FORMATS: ContentFormat[] = ["릴스", "쇼츠", "블로그"];

const TARGET_OPTIONS = [
  "민감성 피부를 가진 20대",
  "수분 부족 지성 피부 30대",
  "안티에이징 관심 40대",
  "실용 트렌드 추구 20대",
  "Z세대 트렌드 추구층",
  "워킹맘 30대",
  "직장인 PM/디자이너",
];

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

const ProposalGenerator = () => {
  const navigate = useNavigate();
  const { selectedInfluencer, submitProposal } = useApp();

  const defaultBrand = useMemo(
    () =>
      brands.find((b) => b.category === selectedInfluencer?.category) ?? brands[0],
    [selectedInfluencer],
  );

  const [brandId, setBrandId] = useState(defaultBrand.id);
  const brand = useMemo(
    () => brands.find((b) => b.id === brandId) ?? defaultBrand,
    [brandId, defaultBrand],
  );

  const [format, setFormat] = useState<ContentFormat>("릴스");
  const [keywords, setKeywords] = useState<string[]>([
    "수분감",
    "비건",
    "성분",
  ]);
  const [keywordInput, setKeywordInput] = useState("");
  const [target, setTarget] = useState(TARGET_OPTIONS[0]);
  const [scheduledAt, setScheduledAt] = useState("");
  const [fee, setFee] = useState(1500000);

  const [streamedText, setStreamedText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
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
            아직 들어온 제안서 요청이 없습니다
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 mb-6">
            매칭에서 브랜드가 인플루언서에게 제안서를 요청하면, 인플루언서가 이 화면에서 역제안서를 작성합니다.
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

  const buildInput = (): ProposalInput => ({
    format,
    keywords,
    target,
    scheduledAt,
    fee,
    influencer: selectedInfluencer,
    brand,
  });

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

  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      setKeywords((prev) =>
        prev.includes(keywordInput.trim()) ? prev : [...prev, keywordInput.trim()],
      );
      setKeywordInput("");
    } else if (e.key === "Backspace" && !keywordInput && keywords.length > 0) {
      setKeywords((prev) => prev.slice(0, -1));
    }
  };

  const removeKeyword = (k: string) =>
    setKeywords((prev) => prev.filter((x) => x !== k));

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

  // Show greyed placeholder sections matching the actual template before generation
  const placeholderTemplate = useMemo(
    () => buildProposalTemplate(buildInput()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [format, brand.id, keywords, target, scheduledAt, fee],
  );

  return (
    <div className="bg-background text-on-background min-h-screen pt-16">
      <TopNav view="influencer" />

      <main className="max-w-[1920px] mx-auto px-margin py-lg h-[calc(100vh-72px)]">
        <div className="flex flex-col lg:flex-row gap-gutter h-full">
          {/* Left: form */}
          <div className="w-full lg:w-1/3 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-lg flex flex-col h-full overflow-y-auto">
            <div className="mb-md">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                내 역제안서 작성
              </h2>
              <p className="font-caption text-caption text-on-surface-variant mt-1">
                <span className="font-medium text-on-surface">@{selectedInfluencer.handle}</span>으로 활동 중 →
                {" "}<span className="font-medium text-primary">{brand.name}</span>의 제안 요청에 응답
              </p>
            </div>

            <div className="space-y-lg flex-grow">
              <div className="space-y-sm">
                <label className="font-label-sm text-label-sm text-on-surface block">
                  요청 받은 브랜드
                </label>
                <div className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant shrink-0">
                    <Icon name="domain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-label-sm text-label-sm text-on-surface truncate">
                      {brand.name}
                    </div>
                    <div className="font-caption text-caption text-on-surface-variant truncate">
                      {brand.product} · {brand.category}
                    </div>
                  </div>
                  <Icon name="lock" size={18} className="!text-outline" />
                </div>
                {brands.length > 1 && (
                  <details className="font-caption text-caption text-on-surface-variant">
                    <summary className="cursor-pointer hover:text-primary">
                      다른 브랜드로 시뮬레이션 (데모용)
                    </summary>
                    <select
                      className="w-full h-10 mt-2 bg-surface-container-lowest border border-outline-variant rounded-lg px-3 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value)}
                    >
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} · {b.product}
                        </option>
                      ))}
                    </select>
                  </details>
                )}
              </div>

              <div className="space-y-sm">
                <label className="font-label-sm text-label-sm text-on-surface block">
                  콘텐츠 포맷
                </label>
                <div className="flex flex-wrap gap-sm">
                  {FORMATS.map((f) => (
                    <label
                      key={f}
                      className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border transition-colors ${
                        format === f
                          ? "border-primary bg-primary-fixed text-on-primary-fixed-variant"
                          : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary"
                      }`}
                    >
                      <input
                        type="radio"
                        name="format"
                        checked={format === f}
                        onChange={() => setFormat(f)}
                        className="sr-only"
                      />
                      <span className="font-body-md text-body-md">{f}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-sm">
                <label className="font-label-sm text-label-sm text-on-surface block">
                  핵심 소구점 키워드
                </label>
                <div className="p-3 bg-surface-container-lowest border border-outline-variant rounded-lg flex flex-wrap gap-2 focus-within:border-primary transition-colors min-h-[52px]">
                  {keywords.map((k) => (
                    <span
                      key={k}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container rounded-full font-caption text-caption text-on-surface"
                    >
                      {k}
                      <button
                        onClick={() => removeKeyword(k)}
                        className="text-outline hover:text-error"
                        type="button"
                        aria-label={`${k} 제거`}
                      >
                        <Icon name="close" size={14} />
                      </button>
                    </span>
                  ))}
                  <input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleKeywordKeyDown}
                    placeholder="키워드 입력 후 엔터"
                    className="flex-grow min-w-[120px] bg-transparent border-none focus:ring-0 outline-none font-body-md text-body-md p-0"
                  />
                </div>
              </div>

              <div className="space-y-sm">
                <label className="font-label-sm text-label-sm text-on-surface block">
                  강조할 타겟
                </label>
                <select
                  className="w-full h-12 bg-surface-container-lowest border border-outline-variant rounded-lg px-4 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary appearance-none"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                >
                  {TARGET_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-sm">
                <label className="font-label-sm text-label-sm text-on-surface block">
                  예상 게시 일정
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full h-12 pl-4 pr-10 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                  <Icon
                    name="calendar_today"
                    className="!absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
                  />
                </div>
              </div>

              <div className="space-y-sm">
                <label className="font-label-sm text-label-sm text-on-surface block">
                  희망 보수
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={100000}
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                    className="w-full h-12 pl-4 pr-12 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary text-right"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-body-md text-body-md text-on-surface-variant">
                    원
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-lg mt-auto">
              <Button
                variant="primary"
                fullWidth
                size="lg"
                icon={generating ? "progress_activity" : "auto_awesome"}
                disabled={generating || keywords.length === 0}
                onClick={handleGenerate}
              >
                {generating
                  ? "AI 제안서 작성 중..."
                  : hasGenerated
                    ? "다시 생성하기"
                    : "AI 제안서 생성하기"}
              </Button>
            </div>
          </div>

          {/* Right: A4 preview */}
          <div className="w-full lg:w-2/3 bg-surface-container-low rounded-xl flex flex-col h-full border border-outline-variant relative overflow-hidden">
            <div className="h-16 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between px-6 shrink-0">
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
              <div className="flex gap-2">
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
                  브랜드에 전송하기
                </Button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-8 flex justify-center bg-surface-dim/30">
              <div
                ref={previewRef}
                className="w-full max-w-[800px] bg-surface-container-lowest shadow-sm rounded-sm p-12 min-h-[1130px] border border-outline-variant"
              >
                <div className="border-b-2 border-on-surface pb-6 mb-10 text-center">
                  <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-2">
                    Re:Pitch 역제안서
                  </h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {renderedSections?.title || placeholderTemplate.title}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-3 text-caption text-on-surface-variant">
                    <span className="font-medium text-on-surface">
                      @{selectedInfluencer.handle}
                    </span>
                    <Icon name="arrow_forward" size={16} />
                    <span className="font-medium text-on-surface">
                      {brand.name}
                    </span>
                    <span className="text-on-surface-variant">
                      · {brand.category}
                    </span>
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProposalGenerator;
