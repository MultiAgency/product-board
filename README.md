# Intentional Systems

Today, MultiAgency’s core product work is evolving the dashboard into a full-fledged platform that supports agencies built on NEAR.

We're building companion contracts to the NEAR Intents Verifier for shared objectives, delegated authority, resources and accountability across multiple parties.

IN PROGRESS

**Dashboard:** multiagency.ai / dev.multiagency.ai
- Upgrade everything to v2 ✅
- Adapt site to build on platform
- Review improved public pages
- Edit messaging/copywriting
- Overhaul documentation

**Platform:** api.multiagency.ai / api.dev.multiagency.ai
—> headless engine that recreates scoped authority (policies, grants, caps, freeze) above the NEAR Intents Verifier, where every registered key has full control.

**Applications:**

treasury.multiagency.ai / treasury.dev.multiagency.ai
—> agents propose rebalancing targets or investment strategies, and the owner approves them or delegates to autopilot (with a risk/stabilization agent and a plain-language assistant)

desk.multiagency.ai
—> turns signed job terms into a payment agent that can only pay what was agreed (automating operational processes)

EXPERIMENTS

near-agencies, self-building kanban system in which AI-native workers join as contributors and claim open GitHub issues

private-ai, code review service developed on NEAR AI Cloud with verifiable receipts

discovery, survey tool for generating issues based on user/agent feedback

PLANNED

**NEAR Extents (working title):**
The Verifier settles economic intents: transfers, withdrawals and token_diff swaps that must net to zero. We can extend this to social outcomes that need commitments from multiple parties, e.g. *"I have USDC on NEAR, I want an event organized in NYC."*

Each objective is its own contract at a predictable address (NEP-616), holds resources as balances on intents.near, and settles through standard transfers. DAOs fund and judge objectives through ordinary proposals (e.g. Trezu custom templates).

**Key Considerations:**
1. **How the outcome is judged.** The contract can't see the real world, so everything depends on a measurable spec and an evaluator people can trust: the City Node DAO overseeing the agency.
2. **Risk spread over time.** Splitting work into milestones, each its own objective, spreads the risk and gets money to the people doing the work sooner.
3. **Composition.** The sponsor names one agency, which breaks the work into sub-objectives. Each sub-objective requires its contributors to commit, and is set to end before its parent's deadline.

**Example:** our Sputnik DAO funds a 30-day, $5k objective for a scoped job. Contributors commit on-chain, the evaluator attests with a hash of its written review, and payment releases only on an achieved verdict. Otherwise funds return to the DAO.

**Status:** objective contract built (fund, commit, attest, close; unit-tested)

**Next:** e2e test on testnet against Tidepool's Verifier, then in a sandbox with mainnet intents.near and Sputnik DAO code, along with a spec for review

GOAL
We aim to transform ecosystems with organizations reimagined as composable networks of independent agencies that form, operate, and change via the protocol. MultiAgency is a coordination layer for contributors and their AI agents to share opportunities, create value for their communities, and learn together.

Please let us know any ideas or questions in the product-board repo.
