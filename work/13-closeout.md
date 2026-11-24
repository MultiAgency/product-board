# #13 close-out check (draft, not posted)

Evidence: `platform/README.md` (How it works, Not done yet), `platform/docs/enforcement.md`, `platform/docs/mainnet-log.md`,
`platform/docs/platform-production.md`, `platform/test/`.

Issue: a headless engine that recreates scoped authority (policies, grants, caps, freeze) above the NEAR Intents Verifier.

| Part of the issue | Built | How it is known |
|---|---|---|
| Headless host | Yes: `platform` package, `/apps/v1` through `@multiagency/sdk` | Running on api.multiagency.ai since 2026-11-07; api.dev for development |
| Policies (#8, closed) | Yes: owner-signed policy with a mandate digest (`src/mandate.ts`) | Offline tests; digest recorded on every plan and money action |
| Grants (#9, closed) | Yes: owner issues a grant inside the policy (`src/grants.ts`) | Offline and stack tests |
| Caps (#10, closed) | Yes: per-asset caps and a USD budget window (`src/budget-window.ts`) | Monthly-cap refusal observed on mainnet 2026-10-13; own concurrent sends tested offline (`test/spending-limits-race.test.ts`) |
| Freeze (#11, closed) | Yes (wallet owners) | Stack tested; DAO owners cannot freeze in time (platform#20) |
| Both hosts in step (#12, closed) | Yes | `docs/platform-staging.md`, `docs/platform-production.md` |

## Gaps to settle before closing

1. **Strict cumulative caps and atomic USD budget are unproven against other senders.** They rest on the provider.
   `docs/enforcement.md` states this itself. Decide whether #13 means "built" (yes) or "proven" (not yet).
2. **No app credential issued on production yet.** App access runs on api.multiagency.ai but nothing uses it there
   (`docs/platform-production.md`). Treasury production config does not set up Treasury agents either (`deploy/platform.json`).
3. **DAO freeze** needs the DAO vote to pass inside the intent's 600 seconds (platform#20).
4. **Duplicated money paths.** Payables and the treasury prototype carry their own copies (both now archived per the repo list).
   README still says "Not yet" for the single-owner goal.
5. **Open platform issues:** #97 (structured cause on `not_executable`), #94 (simulator version history), #81 (G14 reconcile
   after a lost provider response).

Recommendation: the engine exists and runs, so #13 can move to "shipped, hardening tracked in platform#97, #94, #81".
Do not close until gap 2 is decided: either issue a production app credential or state that production use is pending.

Draft closing comment:
> The headless engine is live on api.multiagency.ai (since 2026-11-07) and api.dev.multiagency.ai. Policies, grants, caps and
> freeze (#8 to #12) are shipped. Not proven: strict cumulative caps against other senders (provider-side, see
> platform/docs/enforcement.md). Follow-ups: platform#20 (DAO freeze), #81, #94, #97. Production app credential still to be issued.
