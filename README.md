# Intentional Systems

Today, MultiAgency’s core product work is evolving the dashboard into a full-fledged platform that supports agencies built on NEAR Intents.

We’re proposing new Verifier-level primitives: shared objectives, delegated authority, resources and accountability across multiple parties.

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
Today the Verifier only settles economic intents (transfers, withdrawals, and token_diff swaps that must net to zero), each signed once with a short deadline. Authority is enforced off-chain by our platform, and DAOs can’t meet short approval windows. MultiAgency intends to close these gaps with new Verifier-level primitives:

- Scoped, delegable authority keys to enforce grants on-chain
- Persistent commitments with stages and acceptance, beyond one-off intents
- Multi-party obligation diff alongside token_diff, with the Message Bus matching capabilities as well as quotes
- Approval windows set by the organization for DAOs
- On-chain organization lifecycle: create, compose, release
- Verifiable roles built on the Verifier’s existing key-to-account mapping

**Example:** a DAO grants an agent a 30-day, $5k budget for a scoped job. The Verifier enforces the cap, tracks each stage, and releases payment only on recorded acceptance, with no platform in the middle.

***Important design consideration:** NEAR cross-contract calls don’t complete in submission order, so multi-step commitments need explicit sequencing.*

**Next:** draft spec for review

GOAL
We aim to transform ecosystems with organizations reimagined as composable networks of independent agencies that form, operate, and change via the protocol. MultiAgency is a coordination layer for contributors and their AI agents to share opportunities, create value for their communities, and learn together.

Please let us know any ideas or questions in the product-board repo.
