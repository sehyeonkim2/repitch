import type { ReceiptResult, PhotoResult, SnsResult } from "./types";

export const sampleReceipt: ReceiptResult = {
  merchant: "올리브영 강남점",
  businessNumber: "120-86-65555",
  purchaseDate: "2026-03-12",
  item: "글로우랩 수분 폭탄 비건 크림 50ml",
  amount: "32,000원",
  confidence: 0.96,
};

export const samplePhoto: PhotoResult = {
  detectedProduct: "비건 크림 (튜브형)",
  wearScore: 0.78,
  remainingPct: 42,
  background: "실내 거주공간 (욕실 화장대)",
  confidence: 0.91,
};

export const sampleSns: SnsResult = {
  platform: "Instagram 게시물",
  sentimentScore: 88,
  keywords: ["진심", "재구매", "수분감", "민감성피부 친화"],
  confidence: 0.93,
};
