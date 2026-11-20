// Vision content. The board data itself comes from GitHub issues (see github.js).
export const REPO = 'MultiAgency/product-board';
export const REPO_URL = `https://github.com/${REPO}`;

export const GOAL =
  'We aim to transform ecosystems with organizations reimagined as composable networks of independent agencies that form, operate, and change via the protocol. MultiAgency is a coordination layer for contributors and their AI agents to share opportunities, create value for their communities, and learn together.';

export const STAGES = {
  'in-progress': { name: 'In progress', appearance: 'success' },
  experiment: { name: 'Experiment', appearance: 'moved' },
  planned: { name: 'Planned', appearance: 'new' },
};

export const AREAS = [
  { key: 'dashboard', name: 'Dashboard', stage: 'in-progress', color: '#1f6feb', host: 'multiagency.ai · dev.multiagency.ai',
    summary: 'The dashboard is evolving into a full platform for agencies.',
    points: ['Upgrade everything to v2 (done)', 'Adapt site to build on platform', 'Review improved public pages', 'Edit messaging and copywriting', 'Overhaul documentation'] },
  { key: 'platform', name: 'Platform', stage: 'in-progress', color: '#5e4db2', host: 'api.multiagency.ai · api.dev.multiagency.ai',
    summary: 'A headless engine that recreates scoped authority (policies, grants, caps, freeze) above the NEAR Intents Verifier, where every registered key has full control.' },
  { key: 'treasury', name: 'Treasury', stage: 'in-progress', color: '#1f845a', host: 'treasury.multiagency.ai · treasury.dev.multiagency.ai',
    summary: 'Agents propose rebalancing targets or investment strategies. The owner approves them or delegates to autopilot, with a risk/stabilization agent and a plain-language assistant.' },
  { key: 'desk', name: 'Desk', stage: 'in-progress', color: '#0c8599', host: 'desk.multiagency.ai',
    summary: 'Turns signed job terms into a payment agent that can only pay what was agreed, automating operational processes.' },
  { key: 'near-agencies', name: 'near-agencies', stage: 'experiment', color: '#b65c02', host: 'github.com/MultiAgency/near-agencies',
    summary: 'A self-building kanban system in which AI-native workers join as contributors and claim open GitHub issues.' },
  { key: 'private-ai', name: 'private-ai', stage: 'experiment', color: '#ae4787', host: 'github.com/MultiAgency/private-ai',
    summary: 'A code review service developed on NEAR AI Cloud, with verifiable receipts.' },
  { key: 'discovery', name: 'discovery', stage: 'experiment', color: '#c9372c', host: 'github.com/MultiAgency/discovery',
    summary: 'A survey tool for generating issues based on user and agent feedback.' },
  { key: 'near-extents', name: 'NEAR Extents', stage: 'planned', color: '#8270db', host: 'working title',
    summary: 'New Verifier-level primitives so authority, commitments and approvals live on-chain instead of in a platform.' },
];
export const GENERAL_AREA = { key: 'vision', name: 'Vision / general', color: '#626f86' };
export const ALL_AREAS = [...AREAS, GENERAL_AREA];

export const PRIMITIVES = [
  'Scoped, delegable authority keys to enforce grants on-chain',
  'Persistent commitments with stages and acceptance, beyond one-off intents',
  'Multi-party obligation diff alongside token_diff, with the Message Bus matching capabilities as well as quotes',
  'Approval windows set by the organization for DAOs',
  'On-chain organization lifecycle: create, compose, release',
  'Verifiable roles built on the Verifier’s existing key-to-account mapping',
];

export const TYPES = [
  { key: 'idea', name: 'Idea', template: 'idea.yml', appearance: 'new', blurb: 'Suggest a direction, feature or experiment' },
  { key: 'question', name: 'Question', template: 'question.yml', appearance: 'moved', blurb: 'Ask about product, strategy or protocol design' },
  { key: 'task', name: 'Task', template: 'task.yml', appearance: 'inprogress', blurb: 'A concrete piece of work or spec contribution' },
];

export const COLUMNS = [
  { key: 'inbox', name: 'Inbox', hint: 'New and untriaged' },
  { key: 'planned', name: 'Planned', hint: 'Agreed, not started' },
  { key: 'in-progress', name: 'In progress', hint: 'Being worked on' },
  { key: 'done', name: 'Done', hint: 'Closed issues' },
];
