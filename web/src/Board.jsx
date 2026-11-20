import React, { useEffect, useRef, useState } from 'react';
import Lozenge from '@atlaskit/lozenge';
import Avatar from '@atlaskit/avatar';
import Button from '@atlaskit/button/new';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { draggable, dropTargetForElements, monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { COLUMNS, TYPES } from './content.js';
import { ago, areaOf, columnOf, withPrefix } from './github.js';

function Card({ issue, canWrite, onOpen }) {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    if (!canWrite || !ref.current) return undefined;
    return draggable({
      element: ref.current,
      getInitialData: () => ({ number: issue.number }),
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
    });
  }, [canWrite, issue.number]);

  const area = areaOf(issue);
  const type = TYPES.find((t) => withPrefix(issue, 'type:').includes(t.key));
  return (
    <article ref={ref} className={`card ${dragging ? 'dragging' : ''} ${canWrite ? 'can-drag' : ''}`}
      tabIndex={0} role="button" aria-label={`Open issue ${issue.number}: ${issue.title}`}
      onClick={() => onOpen(issue.number)} onKeyDown={(e) => { if (e.key === 'Enter') onOpen(issue.number); }}>
      {area && <span className="stripe" style={{ background: area.color }} />}
      <div className="card-t">{issue.title}</div>
      <div className="card-tags">
        {type && <Lozenge appearance={type.appearance}>{type.name}</Lozenge>}
        {area && <span className="area-tag" style={{ '--c': area.color }}>{area.name}</span>}
      </div>
      <div className="card-f">
        <span className="num">#{issue.number}</span>
        {issue.comments > 0 && <span title="Comments">💬 {issue.comments}</span>}
        <span className="when">{ago(issue.updated_at)}</span>
        <span className="who">{issue.user && <Avatar src={issue.user.avatar_url} name={issue.user.login} size="xsmall" />}</span>
      </div>
    </article>
  );
}

function Column({ col, items, canWrite, onOpen }) {
  const ref = useRef(null);
  const [over, setOver] = useState(false);
  useEffect(() => {
    if (!ref.current) return undefined;
    return dropTargetForElements({
      element: ref.current,
      getData: () => ({ column: col.key }),
      canDrop: () => canWrite,
      onDragEnter: () => setOver(true),
      onDragLeave: () => setOver(false),
      onDrop: () => setOver(false),
    });
  }, [col.key, canWrite]);
  return (
    <section className={`col ${over ? 'over' : ''}`} ref={ref} aria-label={col.name}>
      <header className="col-h">
        <h2>{col.name}</h2><span className="count">{items.length}</span>
      </header>
      <div className="col-b">
        {items.map((i) => <Card key={i.number} issue={i} canWrite={canWrite} onOpen={onOpen} />)}
        {!items.length && <div className="col-empty">{col.hint}</div>}
      </div>
    </section>
  );
}

export default function Board({ issues, loading, canWrite, onOpen, onMove, onCreate, empty }) {
  useEffect(() => monitorForElements({
    onDrop({ source, location }) {
      const target = location.current.dropTargets[0];
      if (!target) return;
      const issue = issues.find((i) => i.number === source.data.number);
      if (issue) onMove(issue, target.data.column);
    },
  }), [issues, onMove]);

  const byCol = {};
  COLUMNS.forEach((c) => { byCol[c.key] = []; });
  issues.forEach((i) => byCol[columnOf(i)].push(i));
  COLUMNS.forEach((c) => byCol[c.key].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));

  if (loading) return <div className="board">{COLUMNS.map((c) => <section className="col skel" key={c.key}><header className="col-h"><h2>{c.name}</h2></header><div className="col-b"><div className="sk" /><div className="sk" /></div></section>)}</div>;
  return (
    <>
      {empty && (
        <div className="empty-state">
          <h3>The board is ready for its first issue</h3>
          <p>Every card here is a GitHub issue. Share an idea about the platform, a question about NEAR Extents, or a task you want to pick up.</p>
          <Button appearance="primary" onClick={onCreate}>Create the first issue</Button>
        </div>
      )}
      <div className="board">
        {COLUMNS.map((c) => <Column key={c.key} col={c} items={byCol[c.key]} canWrite={canWrite} onOpen={onOpen} />)}
      </div>
    </>
  );
}
