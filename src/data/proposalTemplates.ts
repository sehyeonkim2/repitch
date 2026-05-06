import type { Category, ProposalInput } from "./types";

export interface ProposalSection {
  heading: string;
  body: string;
}

export interface ProposalTemplate {
  title: string;
  sections: ProposalSection[];
}

const formatHashtags = (kw: string[]) => kw.map((k) => `#${k.trim()}`).join(" ");

const beautyTemplate = (input: ProposalInput): ProposalTemplate => ({
  title: `${input.브랜드명} ${input.콘텐츠_포맷} 캠페인`,
  sections: [
    {
      heading: "1. 기획 의도",
      body: `최근 ${input.타겟_소구점}에서 '클린 뷰티'와 '즉각적인 수분 공급'에 대한 니즈가 급증하고 있습니다. 본 제안은 이러한 트렌드를 반영하여, ${input.브랜드명}의 핵심 강점인 ${input.핵심_키워드.slice(0, 2).join("·")}을 시각적으로 극대화하는 ${input.콘텐츠_포맷} 콘텐츠 기획입니다.

단순한 제품 리뷰를 넘어, 일상 속 페인 포인트를 공감되게 연출하고, 사용 직후의 극적인 비포/애프터를 ${input.콘텐츠유형 === "감성형" ? "감각적인 무드로" : "정확한 수치와 함께"} ${input.콘텐츠_포맷} 포맷으로 풀어내어 시청자의 자발적 공유와 구매 전환을 유도하고자 합니다.`,
    },
    {
      heading: "2. 타겟팅 전략",
      body: `· 메인 타겟: ${input.타겟_소구점}
· 페르소나: 잦은 트러블과 속건조로 고민하며, 성분을 꼼꼼히 따지는 '스마트 컨슈머'
· 소구 포인트: 화장대 위 여러 단계의 스킨케어를 단 하나로 끝낼 수 있는 편리함과 안전성 강조
· 해시태그 전략: ${formatHashtags(input.핵심_키워드)}`,
    },
    {
      heading: "3. 기대 효과 (KPI)",
      body: `· 예상 도달: 약 {{REACH}}명 (${input.팔로워규모} 인플루언서 ${input.플랫폼} 평균 기준)
· 예상 좋아요율: 평균 4.2%
· 예상 CTR: {{CTR}}%
· 진정성 ${input.진정성.toFixed(1)}/5.0 · 브랜드 적합도 ${input.브랜드_인플루언서_적합도.toFixed(1)}/5.0`,
    },
    {
      heading: "4. 보수 및 일정",
      body: `· 희망 보수: ${input.보수}
· 추가 옵션: 고정 인쇄용 스틸 컷 3종 별도 제공 가능`,
    },
  ],
});

const fashionTemplate = (input: ProposalInput): ProposalTemplate => ({
  title: `${input.브랜드명} ${input.콘텐츠_포맷} 룩북 캠페인`,
  sections: [
    {
      heading: "1. 기획 의도",
      body: `${input.브랜드명}의 디테일과 핏의 차별점을, 일상 룩 4가지로 변주하여 보여주는 ${input.콘텐츠_포맷} 룩북 콘텐츠입니다. 단순 신상품 소개가 아닌 'Day-in-Life' 형식으로 자연스러운 착장을 노출해 광고 거부감을 최소화합니다.`,
    },
    {
      heading: "2. 타겟팅 전략",
      body: `· 메인 타겟: ${input.타겟_소구점}
· 페르소나: 트렌드보다 본인의 스타일이 확립된 직장인/대학생
· 소구 포인트: ${input.핵심_키워드.slice(0, 3).join(" / ")}
· 해시태그 전략: ${formatHashtags(input.핵심_키워드)}`,
    },
    {
      heading: "3. 기대 효과 (KPI)",
      body: `· 예상 도달: 약 {{REACH}}명 (${input.팔로워규모} · ${input.플랫폼})
· 예상 저장률: 3.5% (본인 코디 참고용)
· 예상 CTR: {{CTR}}%
· 스토리텔링 ${input.스토리텔링.toFixed(1)}/5.0 · 소비자 몰입 ${input.소비자_몰입.toFixed(1)}/5.0`,
    },
    {
      heading: "4. 보수 및 일정",
      body: `· 희망 보수: ${input.보수}
· 추가 제공: 후속 스토리 3종, 사용 권한 6개월`,
    },
  ],
});

const foodTemplate = (input: ProposalInput): ProposalTemplate => ({
  title: `${input.브랜드명} ${input.콘텐츠_포맷} 시식 캠페인`,
  sections: [
    {
      heading: "1. 기획 의도",
      body: `자취·1인 가구가 ${input.브랜드명}을 '5분 컷'으로 만들어 먹는 일상을 ${input.콘텐츠_포맷}로 담아냅니다. 조리 과정의 시간 압박을 ${input.콘텐츠유형 === "감성형" ? "따뜻한 무드로" : "정직한 타임랩스로"} 연출해 광고가 아닌 '실사용 후기' 인상을 줍니다.`,
    },
    {
      heading: "2. 타겟팅 전략",
      body: `· 메인 타겟: ${input.타겟_소구점}
· 페르소나: 자취 3년차, 외식비 부담을 줄이고 싶은 직장인
· 소구 포인트: ${input.핵심_키워드.slice(0, 3).join(" / ")}
· 해시태그 전략: ${formatHashtags(input.핵심_키워드)}`,
    },
    {
      heading: "3. 기대 효과 (KPI)",
      body: `· 예상 도달: 약 {{REACH}}명 (${input.팔로워규모})
· 예상 좋아요율: 5.0%
· 예상 CTR: {{CTR}}%
· 진정성 ${input.진정성.toFixed(1)}/5.0 · 전문성 ${input.전문성.toFixed(1)}/5.0`,
    },
    {
      heading: "4. 보수 및 일정",
      body: `· 희망 보수: ${input.보수}
· 추가 제공: 시식 라이브 1회 (월 1회 한정 진행)`,
    },
  ],
});

const appTemplate = (input: ProposalInput): ProposalTemplate => ({
  title: `${input.브랜드명} ${input.콘텐츠_포맷} 사용 시연`,
  sections: [
    {
      heading: "1. 기획 의도",
      body: `${input.브랜드명}이 실제 업무에서 절약하는 시간을 Before/After 형식의 ${input.콘텐츠_포맷} 시연으로 보여줍니다. 추상적인 '좋다' 대신 구체적 워크플로우를 ${input.콘텐츠유형 === "정보형" ? "수치 중심으로" : "스토리 중심으로"} 전달해 의사결정자의 신뢰를 빠르게 확보합니다.`,
    },
    {
      heading: "2. 타겟팅 전략",
      body: `· 메인 타겟: ${input.타겟_소구점}
· 페르소나: 회의가 많은 PM·디자이너·운영팀 매니저
· 소구 포인트: ${input.핵심_키워드.slice(0, 3).join(" / ")}
· 해시태그 전략: ${formatHashtags(input.핵심_키워드)}`,
    },
    {
      heading: "3. 기대 효과 (KPI)",
      body: `· 예상 도달: 약 {{REACH}}명 (${input.팔로워규모} · ${input.플랫폼})
· 예상 댓글률: 2.4% (실제 도입 문의 포함)
· 예상 CTR: {{CTR}}%
· 신뢰성 ${input.신뢰성.toFixed(1)}/5.0 · 브랜드 적합도 ${input.브랜드_인플루언서_적합도.toFixed(1)}/5.0`,
    },
    {
      heading: "4. 보수 및 일정",
      body: `· 희망 보수: ${input.보수}
· 추가 제공: 후속 라이브 Q&A 세션 1회`,
    },
  ],
});

const lifestyleTemplate = (input: ProposalInput): ProposalTemplate => ({
  title: `${input.브랜드명} ${input.콘텐츠_포맷} 라이프 캠페인`,
  sections: [
    {
      heading: "1. 기획 의도",
      body: `${input.브랜드명}이 일상에 자연스럽게 스며드는 모습을 ${input.콘텐츠_포맷}로 풀어냅니다. 제품 자체보다 '이 제품을 쓰는 라이프스타일'에 공감하게 만드는 것이 핵심이며, ${input.핵심_키워드.slice(0, 2).join("·")}을 중심으로 무드를 잡아갑니다.`,
    },
    {
      heading: "2. 타겟팅 전략",
      body: `· 메인 타겟: ${input.타겟_소구점}
· 소구 포인트: ${input.핵심_키워드.slice(0, 3).join(" / ")}
· 해시태그 전략: ${formatHashtags(input.핵심_키워드)}`,
    },
    {
      heading: "3. 기대 효과 (KPI)",
      body: `· 예상 도달: 약 {{REACH}}명 (${input.팔로워규모} · ${input.플랫폼})
· 예상 좋아요율: 4.0%
· 예상 CTR: {{CTR}}%
· 스토리텔링 ${input.스토리텔링.toFixed(1)}/5.0 · 소비자 몰입 ${input.소비자_몰입.toFixed(1)}/5.0`,
    },
    {
      heading: "4. 보수 및 일정",
      body: `· 희망 보수: ${input.보수}
· 추가 제공: 캠페인 종료 후 베스트 컷 5종 별도 제공`,
    },
  ],
});

const fitnessTemplate = (input: ProposalInput): ProposalTemplate => ({
  title: `${input.브랜드명} ${input.콘텐츠_포맷} 루틴 캠페인`,
  sections: [
    {
      heading: "1. 기획 의도",
      body: `${input.브랜드명}을 실제 운동 루틴에 녹여내는 ${input.콘텐츠_포맷} 콘텐츠입니다. ${input.콘텐츠유형 === "정보형" ? "기능·효능을 운동 과학 기반으로 풀어내" : "감각적인 무드로 동기부여를 자극해"} ${input.타겟_소구점}의 행동 변화를 유도합니다.`,
    },
    {
      heading: "2. 타겟팅 전략",
      body: `· 메인 타겟: ${input.타겟_소구점}
· 소구 포인트: ${input.핵심_키워드.slice(0, 3).join(" / ")}
· 해시태그 전략: ${formatHashtags(input.핵심_키워드)}`,
    },
    {
      heading: "3. 기대 효과 (KPI)",
      body: `· 예상 도달: 약 {{REACH}}명 (${input.팔로워규모})
· 예상 저장률: 4.5% (운동 루틴 참고용)
· 예상 CTR: {{CTR}}%
· 전문성 ${input.전문성.toFixed(1)}/5.0 · 진정성 ${input.진정성.toFixed(1)}/5.0`,
    },
    {
      heading: "4. 보수 및 일정",
      body: `· 희망 보수: ${input.보수}
· 추가 제공: 운동 챌린지 라이브 1회 진행 가능`,
    },
  ],
});

const electronicsTemplate = (input: ProposalInput): ProposalTemplate => ({
  title: `${input.브랜드명} ${input.콘텐츠_포맷} 실사용 리뷰`,
  sections: [
    {
      heading: "1. 기획 의도",
      body: `${input.브랜드명}을 ${input.타겟_소구점} 환경에서 ${input.팔로워규모} 인플루언서가 직접 사용하며, 스펙 시트로는 알 수 없는 실사용 디테일을 ${input.콘텐츠_포맷}로 풀어냅니다. ${input.콘텐츠유형 === "정보형" ? "성능·배터리·가성비를 정량적으로" : "디자인·감성을 무드 컷 중심으로"} 전달합니다.`,
    },
    {
      heading: "2. 타겟팅 전략",
      body: `· 메인 타겟: ${input.타겟_소구점}
· 소구 포인트: ${input.핵심_키워드.slice(0, 3).join(" / ")}
· 해시태그 전략: ${formatHashtags(input.핵심_키워드)}`,
    },
    {
      heading: "3. 기대 효과 (KPI)",
      body: `· 예상 도달: 약 {{REACH}}명 (${input.플랫폼})
· 예상 좋아요율: 3.8%
· 예상 CTR: {{CTR}}%
· 신뢰성 ${input.신뢰성.toFixed(1)}/5.0 · 브랜드 적합도 ${input.브랜드_인플루언서_적합도.toFixed(1)}/5.0`,
    },
    {
      heading: "4. 보수 및 일정",
      body: `· 희망 보수: ${input.보수}
· 추가 제공: 비교 리뷰 컷 별도 제작 가능`,
    },
  ],
});

export const buildProposalTemplate = (input: ProposalInput): ProposalTemplate => {
  const map: Record<Category, (i: ProposalInput) => ProposalTemplate> = {
    뷰티: beautyTemplate,
    패션: fashionTemplate,
    식품: foodTemplate,
    앱서비스: appTemplate,
    라이프스타일: lifestyleTemplate,
    "헬스·피트니스": fitnessTemplate,
    전자기기: electronicsTemplate,
  };
  return map[input.브랜드_카테고리](input);
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
