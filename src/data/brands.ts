import type { Brand } from "./types";

export const brands: Brand[] = [
  {
    id: "brand_glow",
    name: "글로우랩",
    category: "뷰티",
    targetAge: "20대",
    tone: "감성형",
    budgetTier: "300~500만원",
    product: "수분 폭탄 비건 크림",
    systemPromptHint:
      "20대 여성 민감성 피부 타겟. 수분감과 비건 인증을 시각적으로 극대화하는 클린 뷰티 톤.",
  },
  {
    id: "brand_thread",
    name: "쓰레드코",
    category: "패션",
    targetAge: "20대",
    tone: "정보전달형",
    budgetTier: "100~300만원",
    product: "친환경 셀비지 데님",
    systemPromptHint:
      "데님 소재의 차별점, 워싱 디테일, 핏 비교 등 정보 위주의 시각적 콘텐츠 권장.",
  },
  {
    id: "brand_bowl",
    name: "보울키친",
    category: "식품",
    targetAge: "30대",
    tone: "유머형",
    budgetTier: "100~300만원",
    product: "1인용 프리미엄 밀키트",
    systemPromptHint:
      "1인 가구의 자취 페인포인트를 유머러스하게 풀고, 5분 조리 비주얼을 강조.",
  },
  {
    id: "brand_loop",
    name: "루프AI",
    category: "앱서비스",
    targetAge: "30대",
    tone: "정보전달형",
    budgetTier: "500~1000만원",
    product: "AI 회의록 자동화 앱",
    systemPromptHint:
      "직장인 생산성 시간 절약 ROI 강조. Before/After 회의록 비교 시연.",
  },
  {
    id: "brand_petal",
    name: "페탈비건",
    category: "뷰티",
    targetAge: "30대",
    tone: "감성형",
    budgetTier: "100~300만원",
    product: "비건 디저트 향수 스틱",
    systemPromptHint:
      "여성 30대 일상 향 변화에 대한 정서적 욕구 자극. 시향 후기 형식 권장.",
  },
];
