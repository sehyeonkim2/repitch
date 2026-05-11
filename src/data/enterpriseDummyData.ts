export type AdStatus = "진행중" | "검토중" | "완료";

export interface TimelineStep {
  label: string;
  done: boolean;
  date?: string;
}

export interface DummyAd {
  id: string;
  influencerName: string;
  influencerHandle: string;
  influencerAvatar: string;
  influencerFollowers: number;
  influencerChannel: string;
  productName: string;
  brandName: string;
  startDate: string;
  endDate: string;
  budget: string;
  contentFormat: string;
  status: AdStatus;
  timeline: TimelineStep[];
  kpi: {
    views: number;
    ctr: number;
    conversion: number;
    roi: number;
  };
}

export const dummyAds: DummyAd[] = [
  {
    id: "ad_001",
    influencerName: "김글로우",
    influencerHandle: "glowkim_beauty",
    influencerAvatar: "https://i.pravatar.cc/160?u=glowkim_beauty",
    influencerFollowers: 420000,
    influencerChannel: "Instagram",
    productName: "퓨어 글로우 세럼",
    brandName: "뷰티랩 코리아",
    startDate: "2026-04-28",
    endDate: "2026-05-18",
    budget: "150만원",
    contentFormat: "릴스 3편 + 스토리 5회",
    status: "진행중",
    timeline: [
      { label: "계약 완료", done: true, date: "04.28" },
      { label: "제품 발송", done: true, date: "04.30" },
      { label: "콘텐츠 제작", done: true, date: "05.07" },
      { label: "업로드", done: false },
      { label: "완료", done: false },
    ],
    kpi: { views: 182000, ctr: 3.8, conversion: 2.1, roi: 340 },
  },
  {
    id: "ad_002",
    influencerName: "민데일리",
    influencerHandle: "daily_min_life",
    influencerAvatar: "https://i.pravatar.cc/160?u=daily_min_life",
    influencerFollowers: 87000,
    influencerChannel: "Instagram",
    productName: "프리미엄 단백질 스낵",
    brandName: "핏바이트",
    startDate: "2026-05-01",
    endDate: "2026-05-21",
    budget: "70만원",
    contentFormat: "릴스 2편 + 스토리 3회",
    status: "검토중",
    timeline: [
      { label: "계약 완료", done: true, date: "05.01" },
      { label: "제품 발송", done: true, date: "05.03" },
      { label: "콘텐츠 제작", done: false },
      { label: "업로드", done: false },
      { label: "완료", done: false },
    ],
    kpi: { views: 54000, ctr: 4.9, conversion: 3.2, roi: 280 },
  },
  {
    id: "ad_003",
    influencerName: "테크노아",
    influencerHandle: "noir_tech",
    influencerAvatar: "https://i.pravatar.cc/160?u=inf_001",
    influencerFollowers: 133000,
    influencerChannel: "YouTube",
    productName: "AI 업무 자동화 앱",
    brandName: "코드플로우",
    startDate: "2026-04-15",
    endDate: "2026-05-05",
    budget: "300만원",
    contentFormat: "유튜브 리뷰 1편",
    status: "완료",
    timeline: [
      { label: "계약 완료", done: true, date: "04.15" },
      { label: "제품 발송", done: true, date: "04.16" },
      { label: "콘텐츠 제작", done: true, date: "04.24" },
      { label: "업로드", done: true, date: "04.30" },
      { label: "완료", done: true, date: "05.05" },
    ],
    kpi: { views: 98000, ctr: 5.2, conversion: 4.1, roi: 520 },
  },
];

export const enterpriseKpi = {
  totalViews: 334000,
  avgCtr: 4.6,
  avgConversion: 3.1,
  totalRoi: 380,
};
