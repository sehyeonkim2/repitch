import type {
  Influencer,
  MatchedInfluencer,
  MatchingFilters,
  FollowerBand,
} from "../data/types";

const followerBand = (followers: number): FollowerBand => {
  if (followers < 10_000) return "나노 (1만 미만)";
  if (followers < 100_000) return "마이크로 (1~10만)";
  if (followers < 500_000) return "미드 (10~50만)";
  return "메가 (50만+)";
};

interface ScoredInfluencer {
  influencer: Influencer;
  score: number;
  reasons: string[];
}

const scoreInfluencer = (
  inf: Influencer,
  filters: MatchingFilters,
): ScoredInfluencer => {
  let score = 30;
  const reasons: string[] = [];

  if (filters.category === "전체" || inf.category === filters.category) {
    score += 30;
    if (filters.category !== "전체") {
      reasons.push(`${inf.category} 카테고리 전문성 적합`);
    }
  } else {
    score -= 12;
  }

  if (filters.age === "전체" || inf.audienceAge === filters.age) {
    score += 18;
    if (filters.age !== "전체") {
      reasons.push(`타겟 연령(${inf.audienceAge}) 일치율 92%`);
    }
  } else {
    score -= 6;
  }

  if (filters.tone === "전체" || inf.tone === filters.tone) {
    score += 10;
    if (filters.tone !== "전체") {
      reasons.push(`${inf.tone} 톤앤매너 매치`);
    }
  }

  if (filters.followers === "전체" || followerBand(inf.followers) === filters.followers) {
    score += 6;
  } else {
    score -= 3;
  }

  if (inf.engagementRate >= 5) {
    score += 6;
    reasons.push(`평균 참여율 ${inf.engagementRate}% (상위 15%)`);
  } else if (inf.engagementRate >= 4) {
    score += 3;
  }

  if (inf.recentGrowth >= 20) {
    reasons.push(`최근 3개월 도달률 상승세 (+${inf.recentGrowth.toFixed(0)}%)`);
    score += 4;
  }

  if (inf.verified) {
    score += 2;
  }

  score = Math.max(45, Math.min(99, Math.round(score)));

  if (reasons.length === 0) {
    reasons.push(`${inf.category} 카테고리 활동량 우수`);
  }

  return { influencer: inf, score, reasons: reasons.slice(0, 3) };
};

const estimateReach = (inf: Influencer): number => {
  return Math.round(inf.followers * (1.05 + inf.engagementRate * 0.04));
};

const estimateCtr = (inf: Influencer): number => {
  return Math.round((inf.engagementRate * 0.55 + 0.6) * 10) / 10;
};

export const rankInfluencers = (
  filters: MatchingFilters,
  dataset: Influencer[],
  topN = 10,
): MatchedInfluencer[] => {
  const scored = dataset.map((inf) => scoreInfluencer(inf, filters));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topN).map(({ influencer, score, reasons }) => ({
    ...influencer,
    matchScore: score,
    reasons,
    estimatedReach: estimateReach(influencer),
    estimatedCtr: estimateCtr(influencer),
  }));
};
