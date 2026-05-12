import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileHeader } from "../components/MobileHeader";
import { Icon } from "../components/Icon";
import { Button } from "../components/Button";
import { useApp } from "../state/AppContext";

interface AnalysisResult {
  strengths: string[];
  contentTypes: string[];
  recommendedCategories: string[];
}

interface ReelsPlan {
  id: string;
  concept: string;
  hook: string;
  scriptFlow: string[];
  hashtags: string[];
}

const SAMPLE_ANALYSIS: AnalysisResult = {
  strengths: ["진정성 있는 일상 공유", "높은 저장률 콘텐츠", "20대 여성 핵심 팬덤"],
  contentTypes: ["브이로그형 리뷰", "비포&애프터", "루틴 공유"],
  recommendedCategories: ["뷰티", "라이프스타일", "헬스·피트니스"],
};

const SAMPLE_PLANS: ReelsPlan[] = [
  {
    id: "plan_1",
    concept: "7일 스킨케어 루틴 챌린지",
    hook: "'나 솔직히 이거 써보기 전까지는 몰랐어…' (3초 클로즈업 + 비포 피부)",
    scriptFlow: [
      "D-1: 현재 피부 고민 솔직 공개",
      "D-3: 제품 사용 중간 변화",
      "D-7: 드라마틱 비포애프터 공개",
    ],
    hashtags: ["#스킨케어루틴", "#피부변화", "#7일챌린지", "#뷰티리뷰", "#glowup"],
  },
  {
    id: "plan_2",
    concept: "언박싱 & 첫 느낌 솔직 리뷰",
    hook: "'이 가격에 이 퀄리티? 진짜야?' (제품 패키지 클로즈업)",
    scriptFlow: [
      "패키지 언박싱 리액션",
      "텍스처·향 솔직 평가",
      "즉석 피부 적용 후기",
    ],
    hashtags: ["#언박싱", "#솔직리뷰", "#뷰티추천", "#신제품", "#코스메틱"],
  },
];

const StudioPage = () => {
  const { submittedProposals } = useApp();
  const [snsHandle, setSnsHandle] = useState("");
  const [followers, setFollowers] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(SAMPLE_ANALYSIS);
  const [plans, setPlans] = useState<ReelsPlan[]>(SAMPLE_PLANS);
  const [sendModalPlanId, setSendModalPlanId] = useState<string | null>(null);
  const [sentPlanId, setSentPlanId] = useState<string | null>(null);
  const [regeneratingIds, setRegeneratingIds] = useState<Set<string>>(new Set());

  const matchedBrands = Object.values(submittedProposals).map((p) => p.brand);
  const hasMatches = matchedBrands.length > 0;

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setPlans([]);
    setTimeout(() => {
      setAnalysisResult(SAMPLE_ANALYSIS);
      setPlans(SAMPLE_PLANS);
      setIsAnalyzing(false);
    }, 1800);
  };

  const handleSend = (planId: string, _brandName: string) => {
    setSendModalPlanId(null);
    setSentPlanId(planId);
    setTimeout(() => setSentPlanId(null), 2500);
  };

  const handleRegenerate = (planId: string) => {
    setRegeneratingIds((prev) => new Set([...prev, planId]));
    setTimeout(() => {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === planId ? { ...p, id: `${planId}_r${Date.now()}` } : p,
        ),
      );
      setRegeneratingIds((prev) => {
        const next = new Set(prev);
        next.delete(planId);
        return next;
      });
    }, 1400);
  };

  return (
    <div className="flex flex-col min-h-full bg-surface-container-low">
      <MobileHeader title="Studio" view="influencer" />

      <main className="flex-1 px-4 py-4 pb-24 space-y-4">
        {/* ① 계정 분석 */}
        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="manage_accounts" size={20} className="!text-on-surface" />
            <span className="font-label-sm text-label-sm text-on-surface">계정 분석</span>
          </div>
          <input
            className="w-full h-11 px-4 rounded-2xl bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface"
            placeholder="SNS 계정 핸들 (예: @my_account)"
            value={snsHandle}
            onChange={(e) => setSnsHandle(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className="h-11 px-4 rounded-2xl bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface"
              placeholder="팔로워 수 (예: 42000)"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
            />
            <input
              className="h-11 px-4 rounded-2xl bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm text-on-surface"
              placeholder="대표 키워드"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
          <Button
            variant="primary"
            fullWidth
            icon="auto_awesome"
            onClick={handleAnalyze}
          >
            {isAnalyzing ? "AI 분석 중…" : "분석 시작"}
          </Button>
        </div>

        {/* Analyzing indicator */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 flex flex-col items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full border-4 border-on-surface/20 border-t-on-surface animate-spin" />
            <p className="text-[12px] text-on-surface-variant">콘텐츠 패턴 분석 중…</p>
          </motion.div>
        )}

        {/* ① 분석 결과 */}
        {analysisResult && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 space-y-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon name="insights" size={20} className="!text-on-surface" />
              <span className="font-label-sm text-label-sm text-on-surface">분석 결과</span>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-on-surface-variant mb-1.5">강점 키워드</p>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.strengths.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-full bg-on-surface text-surface text-[11px] font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-on-surface-variant mb-1.5">잘 터지는 콘텐츠 유형</p>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.contentTypes.map((c) => (
                  <span key={c} className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface text-[11px]">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold text-on-surface-variant mb-1.5">추천 타겟 브랜드 카테고리</p>
              <div className="flex flex-wrap gap-1.5">
                {analysisResult.recommendedCategories.map((c) => (
                  <span key={c} className="px-2.5 py-1 rounded-full border border-on-surface/30 text-on-surface text-[11px]">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ② 릴스 기획안 */}
        {plans.length > 0 && !isAnalyzing && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon name="video_library" size={18} className="!text-on-surface" />
              <span className="font-label-sm text-label-sm text-on-surface">릴스 기획안</span>
            </div>
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-on-surface-variant">기획안 {idx + 1}</span>
                    <p className="font-label-sm text-label-sm text-on-surface mt-0.5">{plan.concept}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
                    릴스
                  </span>
                </div>

                <div className="bg-surface-container-low rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-on-surface-variant mb-1">🎬 훅 (첫 3초)</p>
                  <p className="text-[12px] text-on-surface leading-relaxed">{plan.hook}</p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-on-surface-variant mb-1.5">스크립트 흐름</p>
                  <div className="space-y-1">
                    {plan.scriptFlow.map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-on-surface text-surface text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-[12px] text-on-surface leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-semibold text-on-surface-variant mb-1.5">해시태그</p>
                  <p className="text-[11px] text-on-surface-variant/80 leading-relaxed">
                    {plan.hashtags.join(" ")}
                  </p>
                </div>

                {/* ③ 액션 버튼 */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="ghost"
                    fullWidth
                    icon={regeneratingIds.has(plan.id) ? "progress_activity" : "refresh"}
                    disabled={regeneratingIds.has(plan.id)}
                    onClick={() => handleRegenerate(plan.id)}
                  >
                    {regeneratingIds.has(plan.id) ? "생성 중…" : "다시 출력하기"}
                  </Button>
                  <Button
                    variant="secondary"
                    fullWidth
                    icon="send"
                    onClick={() => setSendModalPlanId(plan.id)}
                  >
                    기업에게 전송
                  </Button>
                </div>

                {sentPlanId === plan.id && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-[12px] text-primary font-medium"
                  >
                    기획안을 전송했습니다 ✓
                  </motion.p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Send modal */}
      <AnimatePresence>
        {sendModalPlanId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-on-surface/30 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setSendModalPlanId(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-3xl w-full max-w-[440px] p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-1 rounded-full bg-outline-variant mx-auto mb-5" />
              <h3 className="font-headline-md text-headline-md text-on-surface mb-4">기업 선택</h3>

              {hasMatches ? (
                <div className="space-y-2">
                  {matchedBrands.map((brand) => (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => handleSend(sendModalPlanId!, brand.name)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low active:bg-surface-container-high transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-on-surface flex items-center justify-center shrink-0">
                        <span className="text-surface font-bold text-sm">{brand.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-label-sm text-label-sm text-on-surface">{brand.name}</p>
                        <p className="text-caption text-on-surface-variant">{brand.category}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon name="business_center" size={40} className="!text-on-surface-variant mb-3" />
                  <p className="font-label-sm text-label-sm text-on-surface mb-1">
                    아직 매칭된 기업이 없어요
                  </p>
                  <p className="text-caption text-on-surface-variant max-w-[220px] mx-auto">
                    먼저 Samples에서 역제안서를 보내 매칭을 시작해보세요!
                  </p>
                </div>
              )}

              <Button
                variant="ghost"
                fullWidth
                className="mt-4"
                onClick={() => setSendModalPlanId(null)}
              >
                닫기
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudioPage;
