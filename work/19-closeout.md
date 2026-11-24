# #19 close-out check (draft, not posted)

Evidence: `treasury/README.md`, `treasury/docs/`, merged treasury PRs #162 to #270, `platform/docs/mainnet-log.md`.

Issue: agents propose rebalancing or strategies; the owner approves or delegates to autopilot; with a risk/stabilization agent and a plain-language assistant.

| Part of the issue | Board task | Built | Evidence |
|---|---|---|---|
| Agents propose strategies | #14 (closed) | Yes: `watch` proposer, `packages/core` strategy engine | 1,316 unit tests |
| Owner approval | #15 (closed) | Yes: NEP-413 signature (wallet) or DAO vote | Mainnet 2026-11-07 (wallet), 2026-11-14 (DAO proposals #74 to #76) |
| Autopilot within limits | #16 (closed) | Yes: grant bound to one saved strategy | Stack tests |
| Risk and stabilization agent | #17 (closed) | Yes: forward risk report, proposes or recommends only (ADR 5) | Backtest on a synthetic placeholder |
| Plain-language assistant | #18 (closed) | Yes: `docs/assistant.md`, no key, sends nothing | Tests |
| Freeze | | Wallet owners yes | DAO freeze not possible via the app (platform#20) |

## Gaps to settle before closing

1. **Stabilization backtest runs on synthetic data** until real history loads (README). Say so in the close-out.
2. **DAO-owned agents cannot freeze** through the app. Only `autopilot/stop` ends the schedule.
3. **Production platform config does not set up Treasury agents** (`platform/deploy/platform.json`), while the live host
   `treasury.multiagency.ai` reports mainnet use. Confirm production is configured before claiming production readiness.
4. **First DAO execution was refused** by pre-trade checks (cost limit 0.5%), then worked at 2.5%. Fine, but note it.
5. **Open treasury issue #251:** independent audit-check freshness alerts (production readiness).
6. **Treasury must reaccept the SDK 0.6.0 replacement pair** (demo PROGRESS.md), so its earlier CI is not relabeled.

Recommendation: #19 is an umbrella over #14 to #18, all closed. Close it once gaps 1 and 3 are stated in the comment, and keep #251 open as the follow-up.

Draft closing comment:
> All five parts (#14 to #18) are shipped in MultiAgency/treasury. Wallet and DAO owners have approved real mainnet swaps through the app
> (2026-11-07, 2026-11-14). Caveats: the stabilization backtest uses synthetic history, DAO owners cannot freeze through the app yet
> (platform#20). Follow-up: treasury#251.
