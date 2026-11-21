# #4 public pages review (draft findings)

Method: fetched HTML with curl on 2026-11-21 and read the server-rendered text. These are single-page apps, so a 200 can
hide a client-side "not found"; I did not render pages in a browser. Treat link results as a first pass.

## Links
- multiagency.ai: all 15 internal routes (/, /apply, /contact, /dashboard, /docs, /register, /sign-in, /treasury, /work and
  six /work/* pages) return 200. External links (GitHub dashboard repo, X, nearn.io, trezu.app) return 200.
- api.multiagency.ai returns 404 at the root (21 bytes). Probably expected for a headless API, but the README lists it as a
  product surface, so give it a landing/health response or docs link.
- treasury.multiagency.ai and desk.multiagency.ai load but their server HTML has no readable text (titles only).

## Accuracy and fit with the platform story
1. Landing message is the old agency-billing story: "Agencies run transparent client work on chain." It never mentions the
   platform (policies, grants, caps, freeze), Desk, or the "composable networks of agencies" goal in the README. (#5 owns the fix.)
2. "Launch your own Agency" card lists Website, Treasury, Projects, Dashboard under "Coming soon", yet Treasury is live at
   treasury.multiagency.ai and in the nav.
3. Naming mismatch: the product is "Desk" in the README and issue #20, but the page at desk.multiagency.ai is titled
   "Paperwork"; the treasury app is titled "Agentic Treasury". Pick one name each.
4. Nav shows "Main / Mainnet / Test / Testnet" as separate items. Looks like a network switch rendered as duplicated labels;
   confirm in a browser.
5. Work list shows six projects; "pay.everything.dev" appears under slug `payments-plugin`. Confirm the display name.

## Docs page (/docs)
Covers Entity, Contributors, Services agreement, Work order, Trezu, NEARN only. Missing: platform, Treasury app, Desk,
NEAR Extents, and a glossary for policy, grant, cap, freeze. This is the scope of #6.

## Suggested next steps
- Rewrite hero and "coming soon" copy (#5), fix naming (3), add API landing (api 404).
- Open #6 with the missing-topics list above.
- Re-run this review in a real browser for SPA 404s and the nav duplication.
