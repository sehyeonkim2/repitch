export type Category = "뷰티" | "패션" | "식품" | "IT/앱서비스";
export type AgeBucket = "10대" | "20대" | "30대" | "40대 이상";
export type Tone = "정보전달형" | "유머형" | "감성형";
export type ContentFormat = "릴스" | "쇼츠" | "블로그";
export type BudgetTier = "100만원 미만" | "100~300만원" | "300~500만원" | "500~1000만원" | "1000만원 이상";
export type FollowerBand = "전체" | "나노 (1만 미만)" | "마이크로 (1~10만)" | "미드 (10~50만)" | "메가 (50만+)";

export interface Influencer {
  id: string;
  handle: string;
  bio: string;
  category: Category;
  followers: number;
  engagementRate: number;
  audienceAge: AgeBucket;
  tone: Tone;
  avatarUrl: string;
  verified: boolean;
  recentGrowth: number;
  topHashtags: string[];
}

export interface Brand {
  id: string;
  name: string;
  category: Category;
  targetAge: AgeBucket;
  tone: Tone;
  budgetTier: BudgetTier;
  product: string;
  systemPromptHint: string;
}

export interface MatchingFilters {
  category: Category | "전체";
  age: AgeBucket | "전체";
  tone: Tone | "전체";
  budget: BudgetTier | "전체";
  followers: FollowerBand;
}

export interface MatchedInfluencer extends Influencer {
  matchScore: number;
  reasons: string[];
  estimatedReach: number;
  estimatedCtr: number;
}

export type EvidenceType = "receipt" | "photo" | "sns";
export type EvidenceStatus = "idle" | "loading" | "done";

export interface ReceiptResult {
  merchant: string;
  businessNumber: string;
  purchaseDate: string;
  item: string;
  amount: string;
  confidence: number;
}

export interface PhotoResult {
  detectedProduct: string;
  wearScore: number;
  remainingPct: number;
  background: string;
  confidence: number;
}

export interface SnsResult {
  platform: string;
  sentimentScore: number;
  keywords: string[];
  confidence: number;
}

export interface ProposalInput {
  format: ContentFormat;
  keywords: string[];
  target: string;
  scheduledAt: string;
  fee: number;
  influencer: Influencer;
  brand: Brand;
}

export interface SubmittedProposal {
  id: string;
  createdAt: string;
  influencer: Influencer;
  brand: Brand;
  input: ProposalInput;
  body: string;
  estimatedReach: number;
  estimatedCtr: number;
}
