import React, { useEffect, useState } from 'react';
import Button from '@atlaskit/button/new';
import Textfield from '@atlaskit/textfield';
import Textarea from '@atlaskit/textarea';
import { ALL_AREAS, REPO_URL, TYPES } from './content.js';
import { createIssue, newIssueUrl } from './github.js';

function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="overlay center" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <header><h2>{title}</h2><button className="x" onClick={onClose} aria-label="Close">✕</button></header>
        {children}
      </div>
    </div>
  );
}

export function CreateDialog({ area: initialArea, token, canWrite, onClose, onCreated, flash }) {
  const [type, setType] = useState(TYPES[0]);
  const [area, setArea] = useState(initialArea || ALL_AREAS[ALL_AREAS.length - 1]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!title.trim()) return;
    setBusy(true);
    try {
      const issue = await createIssue({ type, area, title: title.trim(), body }, token);
      onCreated(issue.number);
    } catch (e) { flash(`Could not create the issue (${e.detail || e.message}).`, 'error'); setBusy(false); }
  };

  return (
    <Modal title="Create issue" onClose={onClose} wide>
      <div className="form">
        <label>Type</label>
        <div className="types">
          {TYPES.map((t) => (
            <button key={t.key} className={type.key === t.key ? 'on' : ''} onClick={() => setType(t)}>
              <b>{t.name}</b><small>{t.blurb}</small>
            </button>
          ))}
        </div>
        <label htmlFor="area">Area</label>
        <select id="area" value={area.key} onChange={(e) => setArea(ALL_AREAS.find((a) => a.key === e.target.value))}>
          {ALL_AREAS.map((a) => <option key={a.key} value={a.key}>{a.name}</option>)}
        </select>
        <label htmlFor="t">Title</label>
        <Textfield id="t" autoFocus placeholder="What is this about?" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label htmlFor="b">Description</label>
        <Textarea id="b" minimumRows={6} placeholder="Add context. Markdown works." value={body} onChange={(e) => setBody(e.target.value)} />
      </div>
      <footer>
        {canWrite ? (
          <>
            <Button appearance="subtle" onClick={onClose}>Cancel</Button>
            <Button appearance="primary" isDisabled={busy || !title.trim()} onClick={submit}>{busy ? 'Creating…' : 'Create'}</Button>
          </>
        ) : (
          <>
            <span className="muted">You'll finish on GitHub with your own account.</span>
            <Button appearance="primary" href={newIssueUrl(type.template, area)} target="_blank" rel="noreferrer" onClick={onClose}>Continue on GitHub ↗</Button>
          </>
        )}
      </footer>
    </Modal>
  );
}

export function ConnectDialog({ onClose, onConnect }) {
  const [t, setT] = useState('');
  return (
    <Modal title="Connect GitHub" onClose={onClose}>
      <div className="form">
        <p>Paste a fine-grained personal access token to drag cards, comment and create issues right here. Without it the board is read-only and creating an issue opens GitHub.</p>
        <ol className="steps">
          <li>Create a <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer">fine-grained token</a> limited to <b>MultiAgency/product-board</b>.</li>
          <li>Under repository permissions, set <b>Issues</b> to <b>Read and write</b>. Nothing else.</li>
          <li>Paste it below.</li>
        </ol>
        <Textfield type="password" autoComplete="off" placeholder="github_pat_…" value={t} onChange={(e) => setT(e.target.value)} aria-label="Personal access token" />
        <p className="muted small">The token stays in this browser tab (session storage), is sent only to api.github.com, and is forgotten when you disconnect or close the tab. Anyone with <b>triage</b> access to the repo can move cards. You can also <a href={`${REPO_URL}/issues/new/choose`} target="_blank" rel="noreferrer">skip this and use GitHub directly</a>.</p>
      </div>
      <footer>
        <Button appearance="subtle" onClick={onClose}>Cancel</Button>
        <Button appearance="primary" isDisabled={!t.trim()} onClick={() => onConnect(t.trim())}>Connect</Button>
      </footer>
    </Modal>
  );
}
