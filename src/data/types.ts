export type Category =
  | "뷰티"
  | "패션"
  | "식품"
  | "헬스·피트니스"
  | "라이프스타일"
  | "전자기기"
  | "앱서비스";
export type AgeBucket = "10대" | "20대" | "30대" | "40대 이상";
export type Tone = "정보전달형" | "유머형" | "감성형";
export type ContentFormat = "릴스" | "쇼츠" | "유튜브 리뷰" | "블로그" | "틱톡";
export type BudgetTier = "100만원 미만" | "100~300만원" | "300~500만원" | "500~1000만원" | "1000만원 이상";
export type FollowerBand = "전체" | "나노 (1만 미만)" | "마이크로 (1~10만)" | "미드 (10~50만)" | "메가 (50만+)";

export type ContentType = "정보형" | "감성형";
export type Platform = "Instagram" | "YouTube" | "TikTok" | "Blog" | "Twitter";
export type FollowerTier =
  | "나노(1만↓)"
  | "마이크로(1-10만)"
  | "매크로(10-100만)"
  | "메가(100만↑)";
export type ReachBand =
  | "1만 미만"
  | "1~5만"
  | "5~10만"
  | "10~50만"
  | "50만 이상";

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
  // E의 XGBoost 매칭 모델 피처 (1.0 ~ 5.0 리커트)
  전문성?: number;
  신뢰성?: number;
  진정성?: number;
  인지도?: number;
  브랜드_인플루언서_적합도?: number;
  스토리텔링?: number;
  독창성?: number;
  시각적_품질?: number;
  소비자_몰입?: number;
  광고태도?: number;
  구매의도?: number;
  콘텐츠유형?: ContentType;
  플랫폼?: Platform;
  팔로워규모?: FollowerTier;
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
  // Step 1 — 브랜드 정보
  브랜드명: string;
  브랜드_카테고리: Category;
  // Step 2 — 콘텐츠 설정
  콘텐츠_포맷: ContentFormat;
  플랫폼: Platform;
  콘텐츠유형: ContentType;
  // Step 3 — 인플루언서 정보
  팔로워규모: FollowerTier;
  예상_도달: ReachBand;
  보수: string;
  // Step 4 — 어필 포인트
  핵심_키워드: string[];
  타겟_소구점: string;
  // Auto-injected (E 모델 피처, selectedInfluencer에서 채움)
  전문성: number;
  신뢰성: number;
  진정성: number;
  스토리텔링: number;
  소비자_몰입: number;
  브랜드_인플루언서_적합도: number;
  // Linked entities for downstream rendering
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
