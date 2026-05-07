# Re:Pitch — Project Context

Korean reverse-pitch (역제안) influencer marketing platform built for a 14-day startup competition demo. Live at https://repitch.vercel.app/.

## Constraints

- **Backend is fully mocked.** No real API. JSON in `src/data/` + simulated delays in components. Don't introduce real fetch calls without explicit ask.
- **Korean UI.** All user-facing strings are Korean and should sound natural (not textbook). Code/comments are English.
- **Demo over robustness.** Optimize for visual impact and a clear linear flow. Don't add error boundaries, retry logic, or features the demo doesn't need.
- **Mobile-first phone-frame layout.** `MobileShell` wraps the app in a max-w-[440px] phone-shaped card on ≥640px (full-bleed below). All pages use `MobileHeader` (sticky top) and, where relevant, `StickyAction` (sticky bottom) + `BottomTabBar` (per-role tabs).
- **Multi-actor flow.** The user picks a role on `/` (RoleSelect splash), then routes split into `/influencer/*` and `/brand/*`. `MobileHeader`'s `view` prop ('influencer' | 'brand') renders a small role chip. Always set it.

## Routes & roles

| Path | View | Notes |
|---|---|---|
| `/` | neutral | RoleSelect splash — choose 인플루언서 / 기업 |
| `/influencer/auth` | influencer | AuthDashboard — 영수증/사진/SNS evidence, 40/30/30 weighted score |
| `/influencer/proposal` | influencer | ProposalGenerator — 4-step wizard + streaming A4 preview |
| `/influencer/proposal/sent/:id` | influencer | ProposalSent — transit screen, auto-redirects to `/` |
| `/brand/matching` | brand | MatchingDashboard — filter modal, ranks influencers (brand-side discovery, NOT influencer-side) |
| `/brand/inbox/:id` | brand | BrandInbox — proposal review + 수락/거절/협의 |
| `/brand/campaign/:id` | brand | CampaignDashboard — 30-day synthetic metrics + content cards (Recharts) |

## Where things live

- **Design tokens** → `src/index.css` `@theme` block. Grayscale + electric-blue accent matching the logo (primary `#2563eb`, secondary `#000000`, tier colors are a grayscale gradient — gold = darkest). Inter typography, custom spacing (`xs`/`sm`/`md`/`lg`/`xl`/`gutter`/`margin`).
- **Mock data** → `src/data/` (500 influencers, 5 brand templates, evidence samples, per-category proposal templates, deterministic synthetic campaign metrics).
- **Business logic** → `src/lib/` (scoring 40/30/30, matching with reasons, mock LLM client, lazy PDF export).
- **Cross-route state** → `src/state/AppContext.tsx`. Resets on hard refresh (acceptable for linear demo).
- **Source-of-truth specs** → `docs/`:
  - `제목 없는 문서 (1).pdf` — 3-module tech roadmap; canonical for what's actually built (auth scoring weights, dataset spec, matching/proposal stack).
  - `TalkFile_repitch_ui_spec.html.html` — canonical 4-step proposal-wizard UI spec; the `AUTO_FALLBACK` demo values in `ProposalGenerator.tsx` come from here.
  - `인플루언서_광고_역제안_플랫폼_IT맵_.pdf` — architecture, data domain, bottlenecks, feasibility analysis (B+); pitch-deck content.
  - `AI_매칭엔진_정확도_리포트.md` — E's slide-ready accuracy numbers (99% matching, KPI RMSEs); grounds the pitch claim.
  - `matching_result.json` — E's XGBoost output, top-30 ranked influencers with `매칭스코어`/`추천이유`/KPI predictions; consumed by `src/data/matchingResults.ts`.
  - `repitch_team_roles_v2.html` — 5-person × 14-day task division.
  - `0430 회의록 .pdf` — auth-scoring brainstorm; **superseded** by the 로드맵 (KakaoTalk/DM evidence was swapped for SNS-link analysis, which is what's implemented). Keep for historical context only.

## Conventions

- Functional components; explicit prop typing.
- Tailwind utility classes only; no styled-components.
- **Use design-token classes** (`bg-primary`, `text-on-surface`, `font-headline-md`) over Tailwind defaults (`bg-blue-600`, `text-gray-900`).
- Material Symbols Outlined for icons via `<Icon name="...">`.

## Known gotchas

- **Tailwind v4 + custom spacing collision.** `--spacing-md: 16px` hijacks `max-w-md` to 16px. Use `max-w-[28rem]` (or other arbitrary values) for modals and width caps. Same applies to other `max-w-{tshirt}` names if you redefine the matching `--spacing-*` value.
- **PDF libs are lazy-loaded.** `jspdf` and `html2canvas` are dynamically imported inside `src/lib/pdfExport.ts`. Don't move the imports to module scope — it'd inflate the main bundle from ~435 KB back to ~1 MB.
- **Vercel project name** is `repitch` (renamed from `frontend`). Production alias: `repitch.vercel.app`. Custom subdomains under `imurodl.me` aren't currently configured for this project.
- **The matching dashboard is brand-side by design.** This contradicts a common gut reaction that the whole 역제안 flow should be influencer-driven, but the source PDFs (Phase 2 of the roadmap) explicitly specify "브랜드 조건 입력 → 추천 인플루언서 리스트". The proposal page is influencer-side; that's where the 역제안 part lives.

## When real backend arrives

- Replace `mockClient` in `src/lib/llmClient.ts` with a `realClient` that calls C's `/proposal/generate` SSE endpoint. The interface (`streamProposal(args): AsyncIterable<string>`) doesn't change. A `backend-ready` branch already exists with a service-layer toggle scaffold.
- `src/data/influencers.ts` already has the full 500-row dataset.
- Extend `src/data/brands.ts` from 5 to the spec'd 10 templates.
- Drop pre-baked PDFs into `public/backup-proposals/` for the demo-network-failure escape hatch.

## Don't

- Don't add features beyond what the demo requires.
- Don't redeploy without `npm run build` first to confirm TS strict passes.
- Don't change the matching dashboard direction without re-reading the source PDFs and getting explicit ack.
- Don't `import jspdf`/`import html2canvas` at module top level anywhere.
- Don't create README/docs files unless asked.
- Don't add `Co-Authored-By: Claude` in commits (per global `~/projects/CLAUDE.md`).
