import React, { useState } from 'react';
import Button from '@atlaskit/button/new';
import Lozenge from '@atlaskit/lozenge';
import { AREAS, GOAL, PRIMITIVES, STAGES } from './content.js';
import { withPrefix } from './github.js';

export function Roadmap({ issues, onOpenIssue, onArea, onCreate }) {
  const [stage, setStage] = useState('all');
  const list = AREAS.filter((a) => stage === 'all' || a.stage === stage);
  return (
    <>
      <div className="page-head">
        <div><h1>Product map</h1><p>Everything MultiAgency is building, by stage. Counts and cards come from the board.</p></div>
        <div className="seg" role="group" aria-label="Filter by stage">
          <button className={stage === 'all' ? 'on' : ''} onClick={() => setStage('all')}>All</button>
          {Object.entries(STAGES).map(([k, s]) => <button key={k} className={stage === k ? 'on' : ''} onClick={() => setStage(k)}>{s.name}</button>)}
        </div>
      </div>
      <div className="grid">
        {list.map((a) => {
          const mine = issues.filter((i) => withPrefix(i, 'area:').includes(a.key));
          const open = mine.filter((i) => i.state === 'open');
          return (
            <article className="pcard" key={a.key} style={{ '--c': a.color }}>
              <div className="pc-h"><h3>{a.name}</h3><Lozenge appearance={STAGES[a.stage].appearance} isBold>{STAGES[a.stage].name}</Lozenge></div>
              <div className="host">{a.host}</div>
              <p>{a.summary}</p>
              {a.points && <ul>{a.points.map((p) => <li key={p}>{p}</li>)}</ul>}
              {open.length > 0 && <ul className="recent">{open.slice(0, 3).map((i) => <li key={i.number}><button className="linkish" onClick={() => onOpenIssue(i.number)}>#{i.number} {i.title}</button></li>)}</ul>}
              <div className="pc-f">
                <button className="linkish" onClick={() => onArea(a.key)}>{open.length} open · {mine.length - open.length} closed</button>
                <Button appearance="subtle" spacing="compact" onClick={() => onCreate(a)}>+ Raise an idea</Button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

export function Vision({ onCreate }) {
  const extents = AREAS.find((a) => a.key === 'near-extents');
  return (
    <div className="vision">
      <div className="page-head"><div><h1>Vision</h1><p>Intentional Systems</p></div></div>
      <section className="hero">
        <h2>Organizations as composable networks of independent agencies.</h2>
        <p>{GOAL}</p>
      </section>
      <div className="two">
        <div className="panel"><h3>Today</h3><p>MultiAgency's core product work is evolving the dashboard into a full-fledged platform for agencies built on NEAR Intents.</p></div>
        <div className="panel"><h3>The proposal</h3><p>New Verifier-level primitives: shared objectives, delegated authority, resources and accountability across multiple parties.</p></div>
      </div>
      <h2 id="extents" className="sec">NEAR Extents <Lozenge appearance="new" isBold>Planned · working title</Lozenge></h2>
      <p>The current Verifier only settles economic intents (transfers, withdrawals, and <code>token_diff</code> swaps that must net to zero), each signed once with a short deadline. Authority is enforced off-chain by our platform, and DAOs can't meet short approval windows. NEAR Extents would close these gaps with new Verifier-level primitives.</p>
      <ol className="prims">{PRIMITIVES.map((p) => <li key={p}>{p}</li>)}</ol>
      <div className="two">
        <div className="panel accent"><h3>Example</h3><p>A DAO grants an agent a 30-day, $5k budget for a scoped job. The Verifier enforces the cap, tracks each stage, and releases payment only on recorded acceptance, with no platform in the middle.</p></div>
        <div className="panel warn"><h3>Design consideration</h3><p>NEAR cross-contract calls don't complete in submission order, so multi-step commitments need explicit sequencing.</p></div>
      </div>
      <p><b>Next:</b> draft spec for review. <Button appearance="primary" onClick={() => onCreate(extents)}>Contribute to the spec</Button></p>
    </div>
  );
}
