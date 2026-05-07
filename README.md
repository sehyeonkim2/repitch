# Re:Pitch

진정성 인증 기반 역제안(역제안서) 인플루언서 마케팅 플랫폼. 창업경진대회 데모 버전입니다.

**라이브 데모:** https://repitch.vercel.app/

## 핵심 컨셉

기존 인플루언서 마케팅의 흐름을 뒤집습니다. 브랜드가 인플루언서를 찾는 것이 아니라, **실제로 제품을 사용 중인 인플루언서가 브랜드에 직접 광고를 역제안**합니다. 진정성을 AI로 검증하기 때문에 광고비 대비 효율이 높고, 가짜 인플루언서를 원천 차단합니다.

## 데모 플로우 (약 3분)

1. **역할 선택** — 시작 화면에서 인플루언서 / 기업 진입 분기
2. **인증** — 인플루언서가 영수증 OCR + 실사용 사진 + SNS 후기로 진짜 사용자임을 증명 (40/30/30 가중합 → Bronze/Silver/Gold 등급 → "Re:Pitch Certified Real User" 마크 부여)
3. **AI 매칭** — 브랜드 측 대시보드에서 카테고리·타겟 연령·톤앤매너·예산·팔로워 규모로 인플루언서 추천 순위 산출
4. **제안서 작성** — 인플루언서가 요청받은 브랜드에 4스텝 위저드로 역제안서 작성. 스트리밍 AI 생성 + PDF 내보내기 지원
5. **브랜드 수신** — 브랜드가 제안서 검토 후 수락 / 거절 / 협의 요청
6. **캠페인 성과** — 수락 시 30일치 합성 지표(조회/좋아요/댓글)와 콘텐츠 카드를 보여주는 대시보드 진입

## 빠른 시작

```bash
npm install
npm run dev      # localhost:5173
npm run build    # tsc -b && vite build
npm run lint
```

## 기술 스택

- **Vite 8** + **React 19** + **TypeScript 6** (strict)
- **Tailwind CSS v4** — `@theme` 토큰 시스템 (`tailwind.config.js` 미사용)
- **react-router-dom 7**, **framer-motion 12**
- **jspdf + html2canvas** — PDF 내보내기 (lazy-load)
- **Vercel** 배포

## 라우트

| 경로 | 컴포넌트 | 역할 |
|---|---|---|
| `/` | `RoleSelect` | 시작 화면 (역할 선택) |
| `/influencer/auth` | `AuthDashboard` | 인플루언서 뷰 |
| `/influencer/proposal` | `ProposalGenerator` | 인플루언서 뷰 (4스텝 위저드) |
| `/influencer/proposal/sent/:id` | `ProposalSent` | 인플루언서 뷰 (전송 중) |
| `/brand/matching` | `MatchingDashboard` | 브랜드 담당자 뷰 |
| `/brand/inbox/:id` | `BrandInbox` | 브랜드 담당자 뷰 |
| `/brand/campaign/:id` | `CampaignDashboard` | 브랜드 담당자 뷰 (성과 대시보드) |

## 디렉토리 구조

```
src/
  components/    MobileShell · MobileHeader · BottomTabBar · StickyAction · Card · Badge · Button · Gauge · Icon
  data/          influencers (500명) · brands (5개) · authEvidenceSamples · proposalTemplates · campaignMetrics
  lib/           scoring · matching · llmClient · pdfExport
  pages/         7개 라우트 컴포넌트
  state/         AppContext (라우트 간 상태, 새로고침 시 초기화)
  index.css      @theme 토큰 정의 (컬러 / 타이포그래피 / 스페이싱)
docs/            요구사항 PDF + 팀 역할 분배 문서
public/          로고 · 파비콘
```

## 백엔드

전부 목(mock) 처리되어 있습니다. 실제 API 호출은 없고, `src/data/`의 JSON과 컴포넌트 안의 시뮬레이션 딜레이로 동작합니다.

`src/lib/llmClient.ts`의 `streamProposal()`이 `AsyncIterable<string>`을 반환합니다. 현재는 `mockClient`(템플릿 기반 스트리밍)를 사용하지만, 실제 Claude / GPT-4o 엔드포인트가 준비되면 `llmClient` export만 교체하면 됩니다.

## 디자인 시스템

`src/index.css`의 `@theme` 블록에 모든 토큰이 정의되어 있습니다. 로고 워드마크에 맞춘 순수 흑백 모노 팔레트 (`#000000` 프라이머리·세컨더리, 그레이스케일 surface 스케일), Material 3 스타일의 surface 스케일, Inter 타이포그래피, 8px 그리드 스페이싱, 기본 12px 모서리 곡률. 원본 스펙은 `docs/`에서 확인할 수 있습니다.

## 라이선스

비공개 — 창업경진대회 출품 프로젝트.
