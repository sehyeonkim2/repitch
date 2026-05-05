# Re:Pitch — Project Context

Korean reverse-pitch (역제안) influencer marketing platform built for a 14-day startup competition demo. Live at https://repitch.vercel.app/.

## Constraints

- **Backend is fully mocked.** No real API. JSON in `src/data/` + simulated delays in components. Don't introduce real fetch calls without explicit ask.
- **Korean UI.** All user-facing strings are Korean and should sound natural (not textbook). Code/comments are English.
- **Demo over robustness.** Optimize for visual impact and a clear linear flow. Don't add error boundaries, retry logic, or features the demo doesn't need.
- **Multi-actor flow.** The 5 routes alternate between influencer perspective and brand perspective. The `view` prop on `<TopNav>` ('influencer' | 'brand' | 'neutral') drives a colored chip identifying which actor each page represents. Always set it.

## Routes & roles

| Path | View | Notes |
|---|---|---|
| `/` | influencer | AuthDashboard — 영수증/사진/SNS evidence, 40/30/30 weighted score |
| `/matching` | brand | MatchingDashboard — sidebar filters, ranks influencers (correct per docs — brand-side discovery, NOT influencer-side) |
| `/proposal` | influencer | ProposalGenerator — 5 input blocks + streaming A4 preview |
| `/proposal/sent/:id` | influencer | ProposalSent — transit screen, auto-redirects |
| `/brand/inbox/:id` | brand | BrandInbox — proposal review + 수락/거절/협의 |

## Where things live

- **Design tokens** → `src/index.css` `@theme` block. Material 3-style colors (primary `#004ac6`, secondary `#006c49`), Inter typography, custom spacing (`xs`/`sm`/`md`/`lg`/`xl`/`gutter`/`margin`), tier colors.
- **Mock data** → `src/data/` (influencers, brands, evidence samples, proposal templates per category).
- **Business logic** → `src/lib/` (scoring 40/30/30, matching with reasons, mock LLM client, PDF export).
- **Cross-route state** → `src/state/AppContext.tsx`. Resets on hard refresh (acceptable for linear demo).
- **Source-of-truth specs** → `docs/`: 3 PDFs (`0430 회의록` for auth scoring, `IT맵` for bottlenecks/feasibility, untitled `(1).pdf` for the 3-module tech roadmap) + `repitch_team_roles_v2.html` for team task division.

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

- Replace `mockClient` in `src/lib/llmClient.ts` with a `realClient` that calls C's `/proposal/generate` SSE endpoint. The interface (`streamProposal(args): AsyncIterable<string>`) doesn't change.
- Replace `src/data/influencers.ts` (30 entries) with D's full 500-row dataset.
- Extend `src/data/brands.ts` from 5 to the spec'd 10 templates.
- Drop pre-baked PDFs into `public/backup-proposals/` for the demo-network-failure escape hatch.

## Don't

- Don't add features beyond what the demo requires.
- Don't redeploy without `npm run build` first to confirm TS strict passes.
- Don't change the matching dashboard direction without re-reading the source PDFs and getting explicit ack.
- Don't `import jspdf`/`import html2canvas` at module top level anywhere.
- Don't create README/docs files unless asked.
- Don't add `Co-Authored-By: Claude` in commits (per global `~/projects/CLAUDE.md`).
