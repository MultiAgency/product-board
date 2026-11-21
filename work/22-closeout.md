# #22 close-out check (draft, not posted)

Evidence: `extents/README.md` Status section, `extents/sandbox/tests/`, `extents/e2e/`.

| "Done when" item | Testnet (Tidepool) | Sandbox (mainnet intents.near + Sputnik code) |
|---|---|---|
| Achieved: commit, attest with review hash, paid by share | Yes (10 scenarios, 170/170 checks, 2026-11-20) | Yes (`lifecycle.rs`) |
| Not committed: achieved refused until all delivered | Yes ("not all contributors have delivered") | Yes |
| Failed: refunds sponsor / funding DAO | Yes | Yes (`dao_sponsors_and_evaluates_by_proposal`) |
| Expired: `ob_close` refunds and account deletes itself | Yes | Yes |
| auth_call: commit and attest via signed intent | Yes | Yes |
| Q: deposit needed at deploy for 1-yocto payouts? | No: zero-balance instance works at protocol 88; StateInit deposit refunded in full | n/a |
| Q: gas with 10 contributors | 210 Tgas attest budget, 53.7 burned; by intent 295.6 forwarded, 58.5 burned | `gas.rs` |
| README status lists only what was shown on-chain | Mostly: release/cancel/withdraw are labeled unit/sandbox-only | |

## Gaps to settle before closing

1. **Dead evidence link.** README links to `e2e/results/30a94195…/RESULTS.md`. Locally `e2e/results/` holds only a note
   saying dumps were removed and generated dirs are git-ignored. Transaction evidence is therefore not in the repo.
   Fix: re-run `extents-e2e` and attach the generated RESULTS.md to the issue, or reword the README link.
2. **Published build lacks release, cancel, withdraw.** They have never run on testnet (README says so). Decide whether
   #22 covers them; if yes, republish and re-run.
3. **Only the sandbox runs against mainnet Verifier code**; testnet uses Tidepool's same-version build. Matches the issue.

Recommendation: close #22 once gap 1 is fixed; open a follow-up for gap 2 if wanted.

Draft closing comment:
> E2E complete on Tidepool testnet (10 scenarios, 170/170) and in the local sandbox against mainnet intents.near and agency
> DAO code. Open questions answered: no deploy deposit needed; 10 contributors settle in one `ob_attest` at 210 Tgas.
> Not covered on-chain: release, cancel, withdraw (unit + sandbox only). Results: <link>.
