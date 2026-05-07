// Mirrored from docs/matching_result.json (E's XGBoost output, 2026-05).
// If E re-runs the model, replace src/data/matchingResults.json with the new
// canonical from docs/.
import raw from "./matchingResults.json";

interface EMatchingResult {
  ID: number;
  매칭스코어: number;
  협업성사여부: number;
  추천이유: string[];
  팔로워규모: string;
  플랫폼: string;
  콘텐츠유형: string;
  예상도달수: number;
  예상도달률: number;
  예상좋아요율: number;
  예상전환율: number;
  전문성: number;
  신뢰성: number;
  진정성: number;
  스토리텔링: number;
  소비자_몰입: number;
  브랜드_인플루언서_적합도: number;
  분류정확도: number;
}

const toInfluencerId = (numericId: number): string =>
  `inf_${String(numericId).padStart(3, "0")}`;

export const eMatchingResults: EMatchingResult[] = raw as EMatchingResult[];

export const eMatchingByInfluencerId: Map<string, EMatchingResult> = new Map(
  eMatchingResults.map((r) => [toInfluencerId(r.ID), r]),
);
