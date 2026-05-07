import type {
  Influencer,
  MatchedInfluencer,
  MatchingFilters,
  FollowerBand,
} from "../data/types";
import { eMatchingResults } from "../data/matchingResults";

const followerBand = (followers: number): FollowerBand => {
  if (followers < 10_000) return "나노 (1만 미만)";
  if (followers < 100_000) return "마이크로 (1~10만)";
  if (followers < 500_000) return "미드 (10~50만)";
  return "메가 (50만+)";
};

const matchesFilters = (inf: Influencer, filters: MatchingFilters): boolean => {
  if (filters.category !== "전체" && inf.category !== filters.category) return false;
  if (filters.age !== "전체" && inf.audienceAge !== filters.age) return false;
  if (filters.tone !== "전체" && inf.tone !== filters.tone) return false;
  if (filters.followers !== "전체" && followerBand(inf.followers) !== filters.followers)
    return false;
  return true;
};

export interface RankResult {
  items: MatchedInfluencer[];
  relaxed: boolean;
}

export const rankInfluencers = (
  filters: MatchingFilters,
  dataset: Influencer[],
): RankResult => {
  const byId = new Map(dataset.map((inf) => [inf.id, inf]));

  const all: MatchedInfluencer[] = [];
  for (const e of eMatchingResults) {
    const id = `inf_${String(e.ID).padStart(3, "0")}`;
    const inf = byId.get(id);
    if (!inf) continue;
    all.push({
      ...inf,
      // Overlay E's ML feature values so downstream auto-injected scores in
      // ProposalGenerator match what produced the matching score.
      전문성: e.전문성,
      신뢰성: e.신뢰성,
      진정성: e.진정성,
      스토리텔링: e.스토리텔링,
      소비자_몰입: e.소비자_몰입,
      브랜드_인플루언서_적합도: e.브랜드_인플루언서_적합도,
      matchScore: Math.round(e.매칭스코어 * 100),
      reasons: e.추천이유,
      estimatedReach: e.예상도달수,
      estimatedCtr: e.예상전환율,
    });
  }

  const filtered = all.filter((inf) => matchesFilters(inf, filters));
  if (filtered.length < 3) return { items: all, relaxed: true };
  return { items: filtered, relaxed: false };
};
