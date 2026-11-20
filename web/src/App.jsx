import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '@atlaskit/button/new';
import Avatar from '@atlaskit/avatar';
import Textfield from '@atlaskit/textfield';
import { ALL_AREAS, REPO, REPO_URL, TYPES } from './content.js';
import { columnOf, fetchIssues, loadToken, moveIssue, saveToken, whoami, withPrefix, labelNames } from './github.js';
import Board from './Board.jsx';
import Drawer from './Drawer.jsx';
import { ConnectDialog, CreateDialog } from './Dialogs.jsx';
import { Roadmap, Vision } from './Views.jsx';

const VIEWS = [['board', 'Board'], ['roadmap', 'Product map'], ['vision', 'Vision & NEAR Extents']];

export default function App() {
  const [view, setView] = useState(() => (location.hash.slice(1) || 'board'));
  const [issues, setIssues] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: '', note: '' });
  const [area, setArea] = useState('all');
  const [type, setType] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createArea, setCreateArea] = useState(null);
  const [connectOpen, setConnectOpen] = useState(false);
  const [token, setToken] = useState(loadToken());
  const [me, setMe] = useState(null);
  const [toast, setToast] = useState(null);
  const [navOpen, setNavOpen] = useState(false);

  const flash = useCallback((msg, tone = 'info') => {
    setToast({ msg, tone, id: Date.now() });
  }, []);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 4500); return () => clearTimeout(t); } }, [toast]);

  useEffect(() => {
    const h = () => setView(location.hash.slice(1) || 'board');
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);
  const go = (v) => { location.hash = v; setNavOpen(false); };

  const load = useCallback(async (force = false) => {
    setStatus((s) => ({ ...s, loading: true, error: '' }));
    try {
      const { issues: list, cached } = await fetchIssues(token, { force });
      setIssues(list);
      setStatus({ loading: false, error: '', note: cached ? 'Showing issues from the last few minutes.' : '' });
    } catch (e) {
      const limited = e.status === 403 || e.status === 429;
      setStatus({
        loading: false,
        error: limited
          ? 'GitHub is rate-limiting anonymous requests from this network. Connect GitHub, or try again in a few minutes.'
          : 'Could not load issues from GitHub right now.',
        note: '',
      });
    }
  }, [token]);
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!token) { setMe(null); return; }
    whoami(token).then(setMe).catch(() => { setMe(null); setToken(''); saveToken(''); flash('That token was rejected by GitHub.', 'error'); });
  }, [token, flash]);

  const connect = (t) => { saveToken(t); setToken(t); setConnectOpen(false); flash('Connected to GitHub for this browser tab.', 'success'); };
  const disconnect = () => { saveToken(''); setToken(''); setMe(null); flash('Disconnected. The token was forgotten.'); };

  const canWrite = !!me;

  const onMove = useCallback(async (issue, column) => {
    if (columnOf(issue) === column) return;
    if (!me || !me.canTriage) { flash('Moving cards needs a GitHub token with write access to this repo.', 'error'); return; }
    const before = issues;
    const applied = { ...issue, state: column === 'done' ? 'closed' : 'open',
      labels: [...issue.labels.filter((l) => !l.name.startsWith('status:')),
        ...(column === 'planned' ? [{ name: 'status:planned' }] : column === 'in-progress' ? [{ name: 'status:in-progress' }] : [])] };
    setIssues((list) => list.map((i) => (i.number === issue.number ? applied : i)));
    try {
      await moveIssue(issue, column, token);
      flash(`Moved #${issue.number} to ${column === 'done' ? 'Done' : column === 'inbox' ? 'Inbox' : column === 'planned' ? 'Planned' : 'In progress'}.`, 'success');
    } catch (e) {
      setIssues(before);
      flash(`Could not move the card (${e.detail || e.message}).`, 'error');
    }
  }, [issues, me, token, flash]);

  const filtered = useMemo(() => issues.filter((i) => {
    if (area !== 'all' && !withPrefix(i, 'area:').includes(area)) return false;
    if (type !== 'all' && !withPrefix(i, 'type:').includes(type)) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!`${i.title} ${i.body || ''} ${labelNames(i).join(' ')}`.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [issues, area, type, query]);

  const counts = useMemo(() => {
    const m = {};
    issues.filter((i) => i.state === 'open').forEach((i) => withPrefix(i, 'area:').forEach((a) => { m[a] = (m[a] || 0) + 1; }));
    return m;
  }, [issues]);
  const openTotal = issues.filter((i) => i.state === 'open').length;

  const openCreate = (a = null) => { setCreateArea(a); setCreateOpen(true); };
  const selectedIssue = selected ? issues.find((i) => i.number === selected) : null;

  return (
    <div className="app">
      <header className="nav">
        <button className="burger" aria-label="Toggle menu" onClick={() => setNavOpen((o) => !o)}>☰</button>
        <a className="logo" href="#board" onClick={() => go('board')}>
          <span className="mark" aria-hidden="true"><svg viewBox="0 0 32 32" width="22" height="22"><path d="M8 22V10l8 8 8-8v12" stroke="#fff" strokeWidth="3" fill="none" strokeLinejoin="round" /></svg></span>
          <span>MultiAgency</span><b>Product Board</b>
        </a>
        <nav className="tabs" aria-label="Views">
          {VIEWS.map(([k, label]) => (
            <a key={k} href={`#${k}`} className={view === k ? 'on' : ''} onClick={() => go(k)}>{label}</a>
          ))}
        </nav>
        <div className="spacer" />
        <div className="search">
          <Textfield isCompact placeholder="Search issues" aria-label="Search issues" value={query}
            onChange={(e) => { setQuery(e.target.value); if (view !== 'board') go('board'); }} />
        </div>
        <Button appearance="primary" onClick={() => openCreate()}>Create</Button>
        {me ? (
          <button className="me" onClick={disconnect} title={`Connected as ${me.login}. Click to disconnect.`}>
            <Avatar src={me.avatar} name={me.login} size="small" />
          </button>
        ) : (
          <Button appearance="subtle" onClick={() => setConnectOpen(true)}>Connect GitHub</Button>
        )}
      </header>

      <div className="shell">
        <aside className={`side ${navOpen ? 'open' : ''}`}>
          <div className="proj">
            <span className="proj-ic">M</span>
            <div><strong>Product Board</strong><small>{REPO}</small></div>
          </div>
          <div className="side-h">Views</div>
          {VIEWS.map(([k, label]) => (
            <a key={k} href={`#${k}`} className={`side-i ${view === k ? 'on' : ''}`} onClick={() => go(k)}>{label}</a>
          ))}
          <div className="side-h">Areas</div>
          <button className={`side-i ${area === 'all' ? 'on' : ''}`} onClick={() => { setArea('all'); go('board'); }}>
            <span>All areas</span><em>{openTotal}</em>
          </button>
          {ALL_AREAS.map((a) => (
            <button key={a.key} className={`side-i ${area === a.key ? 'on' : ''}`} onClick={() => { setArea(a.key); go('board'); }}>
              <i className="dot" style={{ background: a.color }} /><span>{a.name}</span><em>{counts[a.key] || 0}</em>
            </button>
          ))}
          <div className="side-foot">
            <a href={REPO_URL} target="_blank" rel="noreferrer">Open repo on GitHub ↗</a>
          </div>
        </aside>

        <main className="main">
          {status.error && <div className="banner err" role="alert">{status.error} <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">Open issues on GitHub</a></div>}
          {view === 'board' && (
            <>
              <div className="page-head">
                <div>
                  <h1>{area === 'all' ? 'Board' : ALL_AREAS.find((a) => a.key === area)?.name}</h1>
                  <p>{canWrite ? 'Drag cards between columns to update the issue on GitHub.' : 'Live from GitHub issues. Connect GitHub to drag cards, comment and create issues in place.'}</p>
                </div>
                <div className="head-actions">
                  <div className="seg" role="group" aria-label="Filter by type">
                    <button className={type === 'all' ? 'on' : ''} onClick={() => setType('all')}>All</button>
                    {TYPES.map((t) => <button key={t.key} className={type === t.key ? 'on' : ''} onClick={() => setType(t.key)}>{t.name}s</button>)}
                  </div>
                  <Button onClick={() => load(true)} isDisabled={status.loading}>{status.loading ? 'Loading…' : 'Refresh'}</Button>
                </div>
              </div>
              {status.note && <div className="banner">{status.note}</div>}
              <Board issues={filtered} loading={status.loading && !issues.length} canWrite={canWrite && me.canTriage}
                onOpen={(n) => setSelected(n)} onMove={onMove} onCreate={() => openCreate(ALL_AREAS.find((a) => a.key === area) || null)}
                empty={!status.loading && !status.error && !issues.length} />
            </>
          )}
          {view === 'roadmap' && <Roadmap issues={issues} onOpenIssue={setSelected} onArea={(k) => { setArea(k); go('board'); }} onCreate={openCreate} />}
          {view === 'vision' && <Vision onCreate={openCreate} />}
        </main>
      </div>

      {selectedIssue && <Drawer issue={selectedIssue} token={token} canWrite={canWrite} me={me} onClose={() => setSelected(null)}
        onChanged={() => load(true)} flash={flash} />}
      {createOpen && <CreateDialog area={createArea} token={token} canWrite={canWrite} onClose={() => setCreateOpen(false)}
        onCreated={(n) => { setCreateOpen(false); flash(`Created issue #${n}.`, 'success'); load(true); }} flash={flash} />}
      {connectOpen && <ConnectDialog onClose={() => setConnectOpen(false)} onConnect={connect} />}
      {toast && <div className={`toast ${toast.tone}`} role="status" key={toast.id}>{toast.msg}</div>}
    </div>
  );
}
