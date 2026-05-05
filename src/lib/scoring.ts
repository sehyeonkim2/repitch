import type { EvidenceStatus } from "../data/types";

export type Tier = "Bronze" | "Silver" | "Gold" | "None";

export interface ScoreBreakdown {
  receiptScore: number;
  photoScore: number;
  snsScore: number;
  total: number;
  tier: Tier;
  certified: boolean;
}

const RECEIPT_BASE = 92;
const PHOTO_BASE = 86;
const SNS_BASE = 88;

export const RECEIPT_WEIGHT = 0.4;
export const PHOTO_WEIGHT = 0.3;
export const SNS_WEIGHT = 0.3;

export const computeAuthScore = (status: {
  receipt: EvidenceStatus;
  photo: EvidenceStatus;
  sns: EvidenceStatus;
}): ScoreBreakdown => {
  const r = status.receipt === "done" ? RECEIPT_BASE : 0;
  const p = status.photo === "done" ? PHOTO_BASE : 0;
  const s = status.sns === "done" ? SNS_BASE : 0;
  const total = Math.round(r * RECEIPT_WEIGHT + p * PHOTO_WEIGHT + s * SNS_WEIGHT);
  const tier: Tier =
    total === 0 ? "None" : total >= 80 ? "Gold" : total >= 50 ? "Silver" : "Bronze";
  const certified = tier === "Silver" || tier === "Gold";
  return {
    receiptScore: r,
    photoScore: p,
    snsScore: s,
    total,
    tier,
    certified,
  };
};

export const tierColor = (tier: Tier): string => {
  switch (tier) {
    case "Gold":
      return "text-tier-gold";
    case "Silver":
      return "text-tier-silver";
    case "Bronze":
      return "text-tier-bronze";
    default:
      return "text-on-surface-variant";
  }
};

export const tierBgClass = (tier: Tier): string => {
  switch (tier) {
    case "Gold":
      return "bg-tier-gold/10 border-tier-gold/30 text-tier-gold";
    case "Silver":
      return "bg-tier-silver/10 border-tier-silver/30 text-tier-silver";
    case "Bronze":
      return "bg-tier-bronze/10 border-tier-bronze/30 text-tier-bronze";
    default:
      return "bg-surface-container border-outline-variant text-on-surface-variant";
  }
};
