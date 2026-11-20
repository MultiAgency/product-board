import React, { useEffect, useRef, useState } from 'react';
import Button from '@atlaskit/button/new';
import Lozenge from '@atlaskit/lozenge';
import Avatar from '@atlaskit/avatar';
import Textarea from '@atlaskit/textarea';
import { TYPES } from './content.js';
import { addComment, ago, areaOf, columnOf, fetchComments, labelNames, withPrefix } from './github.js';

const COLUMN_LOZENGE = {
  inbox: ['Inbox', 'default'], planned: ['Planned', 'new'], 'in-progress': ['In progress', 'inprogress'], done: ['Done', 'success'],
};

// GitHub returns pre-sanitized HTML (the same rendering github.com shows). Open links in a new tab.
function Html({ html }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.querySelectorAll('a').forEach((a) => { a.target = '_blank'; a.rel = 'noreferrer noopener'; });
  }, [html]);
  return <div ref={ref} className="md" dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Drawer({ issue, token, canWrite, me, onClose, onChanged, flash }) {
  const [comments, setComments] = useState(null);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    setComments(null);
    if (!issue.comments) { setComments([]); return undefined; }
    fetchComments(issue.number, token).then((c) => live && setComments(c)).catch(() => live && setComments([]));
    return () => { live = false; };
  }, [issue.number, issue.comments, token]);

  useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);

  const [colName, colAppearance] = COLUMN_LOZENGE[columnOf(issue)];
  const area = areaOf(issue);
  const type = TYPES.find((t) => withPrefix(issue, 'type:').includes(t.key));

  const send = async () => {
    if (!draft.trim()) return;
    setBusy(true);
    try {
      await addComment(issue.number, draft.trim(), token);
      setDraft('');
      flash('Comment posted.', 'success');
      onChanged();
    } catch (e) { flash(`Could not post the comment (${e.detail || e.message}).`, 'error'); }
    setBusy(false);
  };

  return (
    <div className="overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={`Issue ${issue.number}`}>
        <header className="dr-h">
          <span className="num">#{issue.number}</span>
          <div className="spacer" />
          <Button appearance="subtle" href={issue.html_url} target="_blank" rel="noreferrer">Open on GitHub ↗</Button>
          <button className="x" onClick={onClose} aria-label="Close">✕</button>
        </header>
        <div className="dr-b">
          <h2>{issue.title}</h2>
          <div className="meta">
            <Lozenge appearance={colAppearance} isBold>{colName}</Lozenge>
            {type && <Lozenge appearance={type.appearance}>{type.name}</Lozenge>}
            {area && <span className="area-tag" style={{ '--c': area.color }}>{area.name}</span>}
          </div>
          <div className="people">
            {issue.user && <><Avatar src={issue.user.avatar_url} name={issue.user.login} size="small" /> <span><b>{issue.user.login}</b> opened {ago(issue.created_at)}</span></>}
          </div>
          <h3>Description</h3>
          {issue.body_html ? <Html html={issue.body_html} /> : <p className="muted">No description.</p>}
          {labelNames(issue).length > 0 && <div className="lbls">{labelNames(issue).map((n) => <span key={n} className="lbl">{n}</span>)}</div>}
          <h3>Comments {comments ? `(${comments.length})` : ''}</h3>
          {comments === null && <p className="muted">Loading comments…</p>}
          {comments && comments.map((c) => (
            <div className="cmt" key={c.id}>
              <Avatar src={c.user.avatar_url} name={c.user.login} size="small" />
              <div><div className="cmt-h"><b>{c.user.login}</b> <span className="muted">{ago(c.created_at)}</span></div><Html html={c.body_html || ''} /></div>
            </div>
          ))}
          {comments && !comments.length && <p className="muted">No comments yet.</p>}
          {canWrite ? (
            <div className="composer">
              <Textarea placeholder={`Comment as ${me.login}…`} value={draft} onChange={(e) => setDraft(e.target.value)} minimumRows={3} />
              <Button appearance="primary" isDisabled={busy || !draft.trim()} onClick={send}>{busy ? 'Posting…' : 'Comment'}</Button>
            </div>
          ) : (
            <div className="composer"><Button appearance="primary" href={`${issue.html_url}#issuecomment-new`} target="_blank" rel="noreferrer">Comment on GitHub ↗</Button><span className="muted"> or connect GitHub to comment here.</span></div>
          )}
        </div>
      </aside>
    </div>
  );
}
