# #20 close-out check (draft, not posted)

Evidence: `demo/README.md` (Paperwork, served at desk.multiagency.ai), `demo/PROGRESS.md`, `demo/docs/`, `demo/tests/`.

Issue: signed job terms become a payment agent that can only pay what was agreed.

| Part of the issue | Built | How it is known |
|---|---|---|
| Both parties sign one terms hash (NEP-413) | Yes | Real job signed on mainnet by `multiagentic.near` and `buildr.near`, publicly verifiable |
| Terms compile to a per-job agent policy: USDC only, signed payee only, per-payment cap, every payout held for approval | Yes | 1,688 tests; security test shows refusals `payee_not_agreed`, `per_transaction_exceeded` and a held injected payout |
| Live policy checked against signed terms before each payout | Yes | Public Verify page |
| Report, invoice, assessment, approve, settle | Yes in simulation | `demo:e2e`, `demo:browser` |
| Payment on real funds | **No: paused** | PROGRESS.md: funding and payment on the hosted app stay paused pending provider reconciliation |
| Funding recovery | Inert | Answers `platform_recovery_unavailable`; needs a platform read contract (docs/platform-funding-reconciliation-request.md) |
| DAO-owned agency votes on a hire | Local stack only | README table |
| Agent Market hires | Worker live; hiring on local stack | README table |

## Gaps to settle before closing

1. **Real payment is paused.** The core promise (pays only what was agreed) is proven by policy compilation and simulated settlement,
   not by a mainnet payout through Desk. This is the main reason not to close.
2. **Provider reconciliation (platform#81, G14)** blocks re-enabling funding and payment.
3. **Funding recovery** needs the platform to agree to a read contract.
4. **Signed-in worker poll read** is still open on production (`deployment-update-8baf1126.json`).
5. **Not run:** `demo:full`; blank form and token-free acceptance tested but not in a signed-in browser.
6. **Treasury and Paperwork must reaccept the SDK 0.6.0 replacement pair** before the next deploy.

Recommendation: keep #20 open, status in-progress. Split off a follow-up "Desk: re-enable funding and payment after platform#81" and close #20 once one real payout runs end to end.

Draft status comment:
> Terms signing, policy compilation, verify page and approval flow are live and tested (1,688 tests). Real funding and payment are paused
> pending platform#81. Next: re-enable payment, run one real payout, then close.
