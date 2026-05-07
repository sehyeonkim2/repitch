# Re:Pitch — Project Context

> Personal working notes. Read this first when picking the project up after a break, or when an AI session opens the repo fresh. `CLAUDE.md` covers the technical conventions; this doc covers everything else — who's involved, what's done, what's pending, and the off-record context that shapes decisions.

## Who I am here

I'm the actual author of the frontend code in this repo, but I'm **not on the official team roster**.

The team's frontend lead — call them **A** — is a friend of mine who can't code. I deliver A's portion off-record. The other team members interact with A as if A is the one doing the work; I'm invisible to them.

What that means in practice:
- Team-side messages go A → me → I draft a reply → A forwards it. "We" in team-facing communication always means A.
- I never communicate directly with the team.
- Repo (`imurodl/repitch`) and Vercel project are under my account.
- When in doubt about scope or commitment, I default to **bounded involvement** — finish A's deliverables, hand off cleanly, don't take on others' work.

## The team

5 people, 14-day startup-competition demo, no backend on `main` (mock-only).

| Role | Domain | Status |
|---|---|---|
| **A** | Frontend lead (on paper) | My friend, doesn't code. I deliver A's work. |
| **B** | Frontend support | Light involvement so far. |
| **C** | Backend (FastAPI + Claude API), `/proposal/generate` SSE endpoint, file-upload endpoints for auth | Working on it. Not yet deployed publicly. |
| **D** | Dummy data, demo scenarios, QA, deck prep | Delivered the influencer dataset and the team-roles + UI-spec HTML files in `docs/`. |
| **E** | ML / XGBoost matching engine | Delivered `docs/matching_result.json` and `docs/AI_매칭엔진_정확도_리포트.md`. Already integrated into the live demo. |

If a doc in `docs/` references a role letter and you can't tell who, see `docs/repitch_team_roles_v2.html`.

## What this project is

Re:Pitch — Korean reverse-pitch (역제안) influencer marketing platform demo built for a 14-day startup competition. Live at https://repitch.vercel.app/ (auto-deploys from `main`).

The pitch in one paragraph: instead of brands hunting influencers, **influencers who already use a product propose campaigns to the brand**. Authenticity is enforced through three evidence types (영수증 OCR / 실사용 사진 / SNS 후기 — 40/30/30 weighted score → "Re:Pitch Certified Real User" badge). An XGBoost matching engine scores brand–influencer fit; Claude API generates the proposal text in the influencer's tone. See `docs/제목 없는 문서 (1).pdf` for the canonical 3-module roadmap.

## Constraints that shape every decision

- **Demo over robustness.** No error boundaries, retry logic, defensive fallbacks. The demo runs once, on a projector, in front of judges.
- **Mock only on `main`.** All data comes from `src/data/*.json` + `src/data/*.ts`. No real fetch calls, ever, on `main`. Real backend integration lives on `backend-ready`.
- **Korean UI, English code.** All user-facing strings in Korean and natural-sounding (not textbook). Code, comments, commit messages in English.
- **Mobile-first.** Phone-frame layout (`MobileShell` 440px max width). Desktop is a centered phone card on a muted background — looks intentional on a projector.
- **Pure mono theme.** No accent colors. Black on white, grayscale surfaces. Matches the logo wordmark.

## Current status

Done:
- All 7 routes work end-to-end on the mock demo: RoleSelect → AuthDashboard → ProposalGenerator wizard → ProposalSent → MatchingDashboard (brand) → BrandInbox → CampaignDashboard.
- 500 influencers, 10 brand templates (one per category × 7 + 3 variety).
- E's XGBoost output (top-30 with 매칭스코어 + 추천이유) is the source of truth for the matching dashboard. Grounds the "AI 매칭 정확도 99%" pitch claim.
- Pure mono theme + logo favicon.
- Service-layer scaffold for backend integration on `backend-ready` branch — `src/lib/api/` with mock/real toggle gated by `VITE_DISABLE_MOCK`. Rebased onto current `main`, force-pushed.

Pending (in roughly this order):
- **C's backend deploy.** Blocked on C's side — she needs to deploy her FastAPI server somewhere reachable (Railway/Render/Fly) or share an `ngrok` URL. Once she does, integration is two env vars + a `git merge backend-ready` (see `## 백엔드 연동` in `README.md`).
- **Pre-baked PDFs in `public/backup-proposals/`.** Escape hatch for a network-failure demo moment — pre-rendered proposal PDFs per brand category that the UI can load instantly if the LLM stream fails. Standing TODO from `CLAUDE.md`.
- **Pitch defense for the cold-start critique.** `docs/인플루언서_광고_역제안_플랫폼_IT맵_.pdf` flags the model's biggest contradiction — startup brands rarely have influencers already using their product. The doc proposes a "선체험 후제안" (sample-first, then propose) pivot. Demo flow doesn't reflect this. Need a one-sentence answer ready for when judges ask.

## When the backend is ready

See the **`## 백엔드 연동`** section in `README.md` — 4 steps, ~5 minutes. Don't redo the analysis; just follow the steps.

## Don'ts (extends `CLAUDE.md` and global `~/.claude/CLAUDE.md`)

- Don't write any teammate's real name or my friend's name into a file in this repo. Roles A/B/C/D/E only.
- Don't auto-commit or auto-deploy. Wait for an explicit "commit" / "push" / "deploy" ask.
- Don't reintroduce the hand-rolled matching heuristic — E's data is the source of truth, and the heuristic was deleted on purpose.
- Don't break the mock-only invariant on `main`. Real network calls live on `backend-ready`.
- Don't add `Co-Authored-By: Claude` lines.
- Don't add features the demo doesn't need (per `CLAUDE.md` and global instructions).

## When picking up fresh

1. `git fetch && git status` — local often lags behind what's deployed.
2. `git log --oneline -10` — see recent shipped work.
3. `git log main..backend-ready` — see the queued integration commit.
4. Read `CLAUDE.md` and this file before making decisions.
5. If working on something user-facing, run `npm run dev` and click through the flow. TS check passing ≠ feature working.
