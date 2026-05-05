# Re:Pitch

Korean reverse-pitch (역제안) influencer marketing platform with authenticity authentication. Built for a startup competition demo.

**Live:** https://repitch.vercel.app/

## What it does

Demo flow (~3 minutes):

1. **인증** — Influencer proves real product use via 영수증 OCR + 실사용 사진 + SNS 후기 (40/30/30 weighted scoring → Bronze/Silver/Gold tier → "Re:Pitch Certified Real User" mark)
2. **AI 매칭** — Brand-side dashboard ranks influencers by category / 타겟 연령 / 톤앤매너 / 예산 / 팔로워 규모
3. **제안서 작성** — Influencer authors 역제안서 to the requesting brand, with streaming AI generation + PDF export
4. **브랜드 수신** — Brand reviews and chooses 수락 / 거절 / 협의

## Quick start

```bash
npm install
npm run dev      # localhost:5173
npm run build    # tsc -b && vite build
npm run lint
```

## Tech stack

- **Vite 8** + **React 19** + **TypeScript 6** (strict)
- **Tailwind CSS v4** with `@theme` tokens (no `tailwind.config.js`)
- **react-router-dom 7**, **framer-motion 12**
- **jspdf + html2canvas** for PDF export (lazy-loaded)
- Vercel deployment

## Routes

| Path | Component | Perspective |
|---|---|---|
| `/` | `AuthDashboard` | 인플루언서 뷰 |
| `/matching` | `MatchingDashboard` | 브랜드 담당자 뷰 |
| `/proposal` | `ProposalGenerator` | 인플루언서 뷰 |
| `/proposal/sent/:id` | `ProposalSent` | 인플루언서 뷰 (transit) |
| `/brand/inbox/:id` | `BrandInbox` | 브랜드 담당자 뷰 |

## Project structure

```
src/
  components/    TopNav · Card · Badge · Button · Gauge · Icon
  data/          influencers (30) · brands (5) · authEvidenceSamples · proposalTemplates
  lib/           scoring · matching · llmClient · pdfExport
  pages/         5 route components
  state/         AppContext (cross-route state, resets on refresh)
  index.css      @theme tokens (colors, typography, spacing)
docs/            requirements PDFs + team role plan
public/          favicon, icons
```

## Backend

Fully mocked — no real API. Mock JSON in `src/data/`, simulated delays in page components.

The LLM client at `src/lib/llmClient.ts` exposes `streamProposal()` returning an `AsyncIterable<string>`. Currently uses `mockClient` (templated streaming). Swap to a real Claude/GPT-4o endpoint by replacing the `llmClient` export.

## Design tokens

Defined in `src/index.css` under `@theme`. Trustworthy Blue `#004ac6` primary, Emerald Green `#006c49` secondary, surface scale, Inter typography, 8px-grid spacing, 12px corner radius default. Source spec: `docs/`.

## License

Private — competition project.
