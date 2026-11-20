import { REPO, REPO_URL, ALL_AREAS } from './content.js';

const API = `https://api.github.com/repos/${REPO}`;
const CACHE_KEY = 'pb-issues-v2';
const CACHE_MS = 5 * 60 * 1000;
const TOKEN_KEY = 'pb-token';

export const labelNames = (issue) => (issue.labels || []).map((l) => (typeof l === 'string' ? l : l.name));
export const withPrefix = (issue, prefix) =>
  labelNames(issue).filter((n) => n.startsWith(prefix)).map((n) => n.slice(prefix.length));

export function columnOf(issue) {
  if (issue.state === 'closed') return 'done';
  const s = withPrefix(issue, 'status:');
  if (s.includes('in-progress')) return 'in-progress';
  if (s.includes('planned')) return 'planned';
  return 'inbox';
}

export function newIssueUrl(template, area) {
  const q = [];
  if (template) q.push(`template=${encodeURIComponent(template)}`);
  if (area) {
    q.push(`labels=${encodeURIComponent('area:' + area.key)}`);
    q.push(`title=${encodeURIComponent(`[${area.name}] `)}`);
    q.push(`area=${encodeURIComponent(area.name)}`);
  }
  return `${REPO_URL}/issues/new?${q.join('&')}`;
}

export const loadToken = () => { try { return sessionStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; } };
export const saveToken = (t) => { try { t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ } };

function headers(token, html = true) {
  const h = { Accept: html ? 'application/vnd.github.full+json' : 'application/vnd.github+json' };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function check(r) {
  if (r.ok) return r;
  const e = new Error(`GitHub API ${r.status}`);
  e.status = r.status;
  try { e.detail = (await r.json()).message; } catch { /* ignore */ }
  throw e;
}

export async function fetchIssues(token, { force = false } = {}) {
  if (!token && !force) {
    try {
      const c = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (c && Date.now() - c.t < CACHE_MS) return { issues: c.issues, cached: true };
    } catch { /* ignore */ }
  }
  let all = [];
  for (let page = 1; page <= 5; page++) {
    const r = await check(await fetch(`${API}/issues?state=all&per_page=100&page=${page}`, { headers: headers(token) }));
    const batch = await r.json();
    all = all.concat(batch.filter((i) => !i.pull_request));
    if (batch.length < 100) break;
  }
  if (!token) { try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), issues: all })); } catch { /* ignore */ } }
  return { issues: all, cached: false };
}

export async function fetchComments(number, token) {
  const r = await check(await fetch(`${API}/issues/${number}/comments?per_page=100`, { headers: headers(token) }));
  return r.json();
}

export async function whoami(token) {
  const [u, repo] = await Promise.all([
    check(await fetch('https://api.github.com/user', { headers: headers(token, false) })).then((r) => r.json()),
    check(await fetch(API, { headers: headers(token, false) })).then((r) => r.json()),
  ]);
  return { login: u.login, avatar: u.avatar_url, canTriage: !!(repo.permissions && (repo.permissions.triage || repo.permissions.push)) };
}

async function write(method, path, body, token) {
  const r = await check(await fetch(`${API}${path}`, {
    method,
    headers: { ...headers(token, false), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }));
  return r.json();
}

export function moveIssue(issue, column, token) {
  const keep = labelNames(issue).filter((n) => !n.startsWith('status:'));
  if (column === 'planned') keep.push('status:planned');
  if (column === 'in-progress') keep.push('status:in-progress');
  return write('PATCH', `/issues/${issue.number}`, { labels: keep, state: column === 'done' ? 'closed' : 'open' }, token);
}

export function createIssue({ type, area, title, body }, token) {
  const labels = [`type:${type.key}`, `area:${area.key}`];
  const prefix = `[${area.name}] `;
  return write('POST', '/issues', { title: title.startsWith('[') ? title : prefix + title, body, labels }, token);
}

export const addComment = (number, body, token) => write('POST', `/issues/${number}/comments`, { body }, token);

export const areaOf = (issue) => {
  const k = withPrefix(issue, 'area:')[0];
  return ALL_AREAS.find((a) => a.key === k);
};

export function ago(iso) {
  const d = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (d < 3600) return `${Math.max(1, Math.round(d / 60))}m ago`;
  if (d < 86400) return `${Math.round(d / 3600)}h ago`;
  if (d < 86400 * 60) return `${Math.round(d / 86400)}d ago`;
  return `${Math.round(d / 86400 / 30)}mo ago`;
}
