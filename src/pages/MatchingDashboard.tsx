import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TopNav } from "../components/TopNav";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Icon } from "../components/Icon";
import { rankInfluencers } from "../lib/matching";
import { influencers } from "../data/influencers";
import { useApp } from "../state/AppContext";
import type {
  AgeBucket,
  BudgetTier,
  Category,
  FollowerBand,
  MatchedInfluencer,
  MatchingFilters,
  Tone,
} from "../data/types";

const CATEGORIES: Array<Category | "전체"> = [
  "전체",
  "뷰티",
  "패션",
  "식품",
  "헬스·피트니스",
  "라이프스타일",
  "전자기기",
  "앱서비스",
];
const AGES: Array<AgeBucket | "전체"> = [
  "전체",
  "10대",
  "20대",
  "30대",
  "40대 이상",
];
const TONES: Array<Tone | "전체"> = [
  "전체",
  "정보전달형",
  "유머형",
  "감성형",
];
const BUDGETS: Array<BudgetTier | "전체"> = [
  "전체",
  "100만원 미만",
  "100~300만원",
  "300~500만원",
  "500~1000만원",
  "1000만원 이상",
];
const FOLLOWER_BANDS: FollowerBand[] = [
  "전체",
  "나노 (1만 미만)",
  "마이크로 (1~10만)",
  "미드 (10~50만)",
  "메가 (50만+)",
];

const initialFilters: MatchingFilters = {
  category: "뷰티",
  age: "20대",
  tone: "감성형",
  budget: "전체",
  followers: "전체",
};

const FilterSelect = <T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) => (
  <div>
    <label className="block font-label-sm text-label-sm text-on-surface mb-2">
      {label}
    </label>
    <div className="relative">
      <select
        className="w-full h-12 appearance-none bg-surface-container-lowest border border-outline-variant rounded-lg pl-4 pr-10 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-body-md text-body-md text-on-surface cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <Icon
        name="expand_more"
        className="!absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none"
      />
    </div>
  </div>
);

const InfluencerCard = ({
  inf,
  onRequest,
  onSave,
}: {
  inf: MatchedInfluencer;
  onRequest: (inf: MatchedInfluencer) => void;
  onSave: () => void;
}) => {
  const reachLabel = inf.estimatedReach.toLocaleString("ko-KR");
  const followerLabel = inf.followers.toLocaleString("ko-KR");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Card accent="secondary" className="p-lg flex flex-col h-full">
        <div className="flex justify-between items-start mb-md">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-surface-container-high shrink-0 bg-surface-container">
              <img
                src={inf.avatarUrl}
                alt={inf.handle}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                {inf.handle}
                {inf.verified && (
                  <Icon name="verified" filled className="!text-secondary" />
                )}
              </h3>
              <p className="font-caption text-caption text-on-surface-variant">
                {inf.bio}
              </p>
            </div>
          </div>
          <Badge variant="match-score">매칭 적합도 {inf.matchScore}점</Badge>
        </div>

        <div className="flex gap-6 mb-md pb-md border-b border-surface-variant">
          <div>
            <p className="font-caption text-caption text-on-surface-variant mb-1">
              팔로워
            </p>
            <p className="font-headline-md text-headline-md text-on-surface">
              {followerLabel}명
            </p>
          </div>
          <div className="w-px bg-surface-variant" />
          <div>
            <p className="font-caption text-caption text-on-surface-variant mb-1">
              평균 참여율
            </p>
            <p className="font-headline-md text-headline-md text-on-surface">
              {inf.engagementRate}%
            </p>
          </div>
        </div>

        <div className="bg-surface p-4 rounded-lg mb-md border border-surface-variant/50">
          <h4 className="font-label-sm text-label-sm text-on-surface mb-3 flex items-center gap-2">
            <Icon name="trending_up" className="!text-primary" />
            예상 캠페인 성과 지표
          </h4>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
                <Icon name="group" size={18} />
              </div>
              <div>
                <p className="font-caption text-caption text-on-surface-variant">
                  예상 도달
                </p>
                <p className="font-body-md text-body-md font-semibold text-on-surface">
                  {reachLabel}명
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
                <Icon name="ads_click" size={18} />
              </div>
              <div>
                <p className="font-caption text-caption text-on-surface-variant">
                  예상 CTR
                </p>
                <p className="font-body-md text-body-md font-semibold text-on-surface">
                  {inf.estimatedCtr}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-md flex-1">
          <h4 className="font-label-sm text-label-sm text-on-surface mb-3">
            AI 추천 사유
          </h4>
          <ul className="space-y-2">
            {inf.reasons.map((r) => (
              <li
                key={r}
                className="flex items-start gap-2 font-body-md text-body-md text-on-surface-variant"
              >
                <Icon
                  name="check_circle"
                  filled
                  className="!text-secondary mt-0.5"
                  size={20}
                />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3">
          <Button
            variant="primary"
            fullWidth
            icon="send"
            onClick={() => onRequest(inf)}
          >
            제안서 요청하기
          </Button>
          <Button
            variant="secondary"
            icon="bookmark_add"
            onClick={onSave}
            aria-label="저장"
          />
        </div>
      </Card>
    </motion.div>
  );
};

const MatchingDashboard = () => {
  const navigate = useNavigate();
  const { selectInfluencer } = useApp();
  const [filters, setFilters] = useState<MatchingFilters>(initialFilters);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(false);

  const ranked = useMemo(
    () => rankInfluencers(filters, influencers, 8),
    [filters],
  );

  const handleRequest = (inf: MatchedInfluencer) => {
    selectInfluencer(inf);
    navigate("/proposal");
  };

  const handleReset = () => setFilters(initialFilters);

  return (
    <div className="bg-surface-container-low text-on-background min-h-screen pt-16">
      <TopNav view="brand" />

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Mobile drawer backdrop */}
        {drawerOpen && (
          <div
            className="lg:hidden fixed inset-0 top-16 bg-black/40 z-20"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
        )}

        <aside
          className={`bg-surface-container-lowest h-[calc(100vh-64px)] w-72 fixed left-0 top-16 overflow-y-auto border-r border-outline-variant flex flex-col p-lg space-y-md z-30 transition-transform duration-200 ${
            drawerOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-1">
                브랜드 타겟 설정
              </h2>
              <p className="font-caption text-caption text-on-surface-variant">
                조건을 바꾸면 추천 인플루언서가 즉시 재정렬됩니다.
              </p>
            </div>
            <button
              type="button"
              className="lg:hidden p-1 rounded-md hover:bg-surface-container-low text-on-surface-variant"
              onClick={() => setDrawerOpen(false)}
              aria-label="필터 닫기"
            >
              <Icon name="close" size={20} />
            </button>
          </div>
          <div className="space-y-md">
            <FilterSelect
              label="카테고리"
              value={filters.category}
              options={CATEGORIES}
              onChange={(v) => setFilters((p) => ({ ...p, category: v }))}
            />
            <FilterSelect
              label="타겟 연령"
              value={filters.age}
              options={AGES}
              onChange={(v) => setFilters((p) => ({ ...p, age: v }))}
            />
            <FilterSelect
              label="원하는 톤앤매너"
              value={filters.tone}
              options={TONES}
              onChange={(v) => setFilters((p) => ({ ...p, tone: v }))}
            />
            <FilterSelect
              label="예산 구간"
              value={filters.budget}
              options={BUDGETS}
              onChange={(v) => setFilters((p) => ({ ...p, budget: v }))}
            />
            <FilterSelect
              label="팔로워 규모"
              value={filters.followers}
              options={FOLLOWER_BANDS}
              onChange={(v) => setFilters((p) => ({ ...p, followers: v }))}
            />
            <Button variant="ghost" fullWidth onClick={handleReset}>
              필터 초기화
            </Button>
          </div>
        </aside>

        <main className="flex-1 lg:ml-72 p-lg bg-surface-container-low min-h-screen">
          <header className="mb-lg flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                AI 추천 인플루언서 Top 매칭
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                선택하신 조건에 기반해 {ranked.length}명의 최적 파트너를 찾았습니다.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                icon="tune"
                onClick={() => setDrawerOpen(true)}
                className="lg:!hidden"
              >
                필터 보기
              </Button>
              <Badge variant="secondary" icon="auto_awesome">
                실시간 AI 매칭
              </Badge>
            </div>
          </header>

          {ranked.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-on-surface-variant">
              <Icon name="search_off" size={48} />
              <p className="mt-4 font-body-md text-body-md">
                조건에 맞는 인플루언서를 찾지 못했습니다.
              </p>
              <Button variant="ghost" onClick={handleReset} className="mt-3">
                필터 초기화
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-gutter">
              <AnimatePresence mode="popLayout">
                {ranked.map((inf) => (
                  <InfluencerCard
                    key={inf.id}
                    inf={inf}
                    onRequest={handleRequest}
                    onSave={() =>
                      setSavedIds((prev) => {
                        const next = new Set(prev);
                        if (next.has(inf.id)) next.delete(inf.id);
                        else next.add(inf.id);
                        return next;
                      })
                    }
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {savedIds.size > 0 && (
            <p className="mt-6 font-caption text-caption text-on-surface-variant">
              관심 저장 {savedIds.size}명
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default MatchingDashboard;
