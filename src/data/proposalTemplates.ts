import type { Category, ProposalInput } from "./types";

export interface ProposalSection {
  heading: string;
  body: string;
}

export interface ProposalTemplate {
  title: string;
  sections: ProposalSection[];
}

const formatNumber = (n: number) => n.toLocaleString("ko-KR");

const beautyTemplate = (input: ProposalInput): ProposalTemplate => ({
  title: `${input.brand.product} ${input.format} 캠페인`,
  sections: [
    {
      heading: "1. 기획 의도",
      body: `최근 ${input.target}에서 '클린 뷰티'와 '즉각적인 수분 공급'에 대한 니즈가 급증하고 있습니다. 본 제안은 이러한 트렌드를 반영하여, ${input.brand.name}의 신제품 ${input.brand.product}이 가진 핵심 강점인 ${input.keywords.slice(0, 2).join("·")}을 시각적으로 극대화하는 ${input.format} 콘텐츠 기획입니다.

단순한 제품 리뷰를 넘어, 일상 속 페인 포인트를 공감되게 연출하고, 사용 직후의 극적인 비포/애프터를 감각적인 ${input.format} 포맷으로 풀어내어 시청자의 자발적 공유와 구매 전환을 유도하고자 합니다.`,
    },
    {
      heading: "2. 타겟팅 전략",
      body: `· 메인 타겟: ${input.target}
· 페르소나: 잦은 트러블과 속건조로 고민하며, 성분을 꼼꼼히 따지는 '스마트 컨슈머'
· 소구 포인트: 화장대 위 여러 단계의 스킨케어를 단 하나로 끝낼 수 있는 ${input.brand.product}의 편리함과 안전성 강조
· 해시태그 전략: ${input.keywords.map((k) => `#${k}`).join(" ")}`,
    },
    {
      heading: "3. 기대 효과 (KPI)",
      body: `· 예상 도달: 약 {{REACH}}명
· 예상 좋아요율: 평균 4.2%
· 예상 CTR: {{CTR}}%
· 예상 저장률: 1.8%
· 캠페인 종료 후 1주일 내 브랜드 검색량 32% 상승 예측`,
    },
    {
      heading: "4. 보수 및 일정",
      body: `· 게시 예정일: ${input.scheduledAt || "협의"}
· 희망 보수: ${formatNumber(input.fee)}원 (편집·소품 비용 포함)
· 추가 옵션: 고정 인쇄용 스틸 컷 3종 별도 제공 가능`,
    },
  ],
});

const fashionTemplate = (input: ProposalInput): ProposalTemplate => ({
  title: `${input.brand.product} ${input.format} 룩북 캠페인`,
  sections: [
    {
      heading: "1. 기획 의도",
      body: `${input.brand.name}의 ${input.brand.product}이 가진 디테일과 핏의 차별점을, 일상 룩 4가지로 변주하여 보여주는 ${input.format} 룩북 콘텐츠입니다. 단순 신상품 소개가 아닌 'Day-in-Life' 형식으로 자연스러운 착장을 노출해 광고 거부감을 최소화합니다.`,
    },
    {
      heading: "2. 타겟팅 전략",
      body: `· 메인 타겟: ${input.target}
· 페르소나: 트렌드보다 본인의 스타일이 확립된 직장인/대학생
· 소구 포인트: ${input.keywords.slice(0, 3).join(" / ")}
· 해시태그 전략: ${input.keywords.map((k) => `#${k}`).join(" ")}`,
    },
    {
      heading: "3. 기대 효과 (KPI)",
      body: `· 예상 도달: 약 {{REACH}}명
· 예상 저장률: 3.5% (본인 코디 참고용)
· 예상 CTR: {{CTR}}%
· 캠페인 후 2주간 상세페이지 체류시간 +28%`,
    },
    {
      heading: "4. 보수 및 일정",
      body: `· 게시 예정일: ${input.scheduledAt || "협의"}
· 희망 보수: ${formatNumber(input.fee)}원
· 추가 제공: 후속 스토리 3종, 사용 권한 6개월`,
    },
  ],
});

const foodTemplate = (input: ProposalInput): ProposalTemplate => ({
  title: `${input.brand.product} ${input.format} 시식 캠페인`,
  sections: [
    {
      heading: "1. 기획 의도",
      body: `자취·1인 가구가 ${input.brand.product}을 '5분 컷'으로 만들어 먹는 일상을 ${input.format}로 담아냅니다. 조리 과정의 시간 압박을 ${input.brand.tone === "유머형" ? "유머러스하게" : "정직하게"} 연출해 광고가 아닌 '실사용 후기' 인상을 줍니다.`,
    },
    {
      heading: "2. 타겟팅 전략",
      body: `· 메인 타겟: ${input.target}
· 페르소나: 자취 3년차, 외식비 부담을 줄이고 싶은 직장인
· 소구 포인트: ${input.keywords.slice(0, 3).join(" / ")}
· 해시태그 전략: ${input.keywords.map((k) => `#${k}`).join(" ")}`,
    },
    {
      heading: "3. 기대 효과 (KPI)",
      body: `· 예상 도달: 약 {{REACH}}명
· 예상 좋아요율: 5.0%
· 예상 CTR: {{CTR}}%
· 캠페인 후 7일 내 단품 구매 전환율 +15%`,
    },
    {
      heading: "4. 보수 및 일정",
      body: `· 게시 예정일: ${input.scheduledAt || "협의"}
· 희망 보수: ${formatNumber(input.fee)}원
· 추가 제공: 시식 라이브 1회 (월 1회 한정 진행)`,
    },
  ],
});

const itTemplate = (input: ProposalInput): ProposalTemplate => ({
  title: `${input.brand.product} ${input.format} 사용 시연`,
  sections: [
    {
      heading: "1. 기획 의도",
      body: `${input.brand.name}의 ${input.brand.product}이 실제 업무에서 절약하는 시간을 Before/After 형식의 ${input.format} 시연으로 보여줍니다. 추상적인 'AI 좋다' 대신 구체적 워크플로우를 ${input.brand.tone}으로 전달해 의사결정자의 신뢰를 빠르게 확보합니다.`,
    },
    {
      heading: "2. 타겟팅 전략",
      body: `· 메인 타겟: ${input.target}
· 페르소나: 회의가 많은 PM·디자이너·운영팀 매니저
· 소구 포인트: ${input.keywords.slice(0, 3).join(" / ")}
· 해시태그 전략: ${input.keywords.map((k) => `#${k}`).join(" ")}`,
    },
    {
      heading: "3. 기대 효과 (KPI)",
      body: `· 예상 도달: 약 {{REACH}}명
· 예상 댓글률: 2.4% (실제 도입 문의 포함)
· 예상 CTR: {{CTR}}%
· 캠페인 후 7일 가입 전환율 +12%`,
    },
    {
      heading: "4. 보수 및 일정",
      body: `· 게시 예정일: ${input.scheduledAt || "협의"}
· 희망 보수: ${formatNumber(input.fee)}원
· 추가 제공: 후속 라이브 Q&A 세션 1회`,
    },
  ],
});

export const buildProposalTemplate = (input: ProposalInput): ProposalTemplate => {
  const map: Record<Category, (i: ProposalInput) => ProposalTemplate> = {
    뷰티: beautyTemplate,
    패션: fashionTemplate,
    식품: foodTemplate,
    "IT/앱서비스": itTemplate,
  };
  return map[input.brand.category](input);
};

export const renderProposalText = (template: ProposalTemplate, reach: number, ctr: number): string => {
  const head = `Re:Pitch 역제안서\n${template.title}\n\n`;
  const body = template.sections
    .map((s) => `${s.heading}\n${s.body}`)
    .join("\n\n")
    .replaceAll("{{REACH}}", reach.toLocaleString("ko-KR"))
    .replaceAll("{{CTR}}", ctr.toFixed(1));
  return head + body;
};
