import type { Category } from "./types";

export interface SampleProduct {
  id: string;
  brandName: string;
  productName: string;
  category: Category;
  description: string;
  appealPoints: string[];
  targetCustomer: string;
  cautions?: string;
  thumbnailColor: string;
  createdAt: string;
}

export const defaultSampleProducts: SampleProduct[] = [
  {
    id: "sp_001",
    brandName: "뷰티랩 코리아",
    productName: "퓨어 글로우 세럼",
    category: "뷰티",
    description:
      "비타민C 10% 고농축 함유로 칙칙한 피부톤 개선과 72시간 수분 공급을 동시에 해결하는 올인원 세럼. 비건 인증 원료만 사용.",
    appealPoints: [
      "비타민C 10% 고농축 배합",
      "72시간 지속 수분 케어",
      "자외선 차단 SPF15 포함",
      "비건 인증 · 동물 실험 없음",
    ],
    targetCustomer: "20~30대 피부 톤 개선에 관심 있는 여성",
    thumbnailColor: "#fce4f3",
    createdAt: "2026-04-20T10:00:00Z",
  },
  {
    id: "sp_002",
    brandName: "핏바이트",
    productName: "프리미엄 단백질 스낵 3종 세트",
    category: "헬스·피트니스",
    description:
      "운동 후 빠른 근육 회복을 위한 고단백(20g) 저지방 스낵 3종 구성. 인공색소·인공감미료 Zero, GMP 인증 제조사 생산.",
    appealPoints: [
      "1개당 단백질 20g 함유",
      "인공첨가물 ZERO",
      "초코·바닐라·딸기 3가지 맛",
      "GMP 인증 공장 생산",
    ],
    targetCustomer: "헬스·피트니스에 관심 있는 20~40대 남녀",
    thumbnailColor: "#e0f4ec",
    createdAt: "2026-04-25T10:00:00Z",
  },
  {
    id: "sp_003",
    brandName: "코드플로우",
    productName: "AI 업무 자동화 앱 — 1개월 프리미엄",
    category: "앱서비스",
    description:
      "반복 업무를 노코드로 자동화하는 AI 툴. GPT-4 연동, Slack·Notion 통합 지원. 가입 즉시 1개월 프리미엄 라이선스 제공.",
    appealPoints: [
      "노코드 드래그앤드롭 자동화",
      "GPT-4 기반 AI 어시스턴트",
      "Slack / Notion / Google 통합",
      "월 10만 사용자 · 4.8★ 앱스토어",
    ],
    targetCustomer: "업무 효율화를 원하는 직장인, 프리랜서, 스타트업 팀",
    thumbnailColor: "#e8e8f8",
    createdAt: "2026-05-01T10:00:00Z",
  },
];
