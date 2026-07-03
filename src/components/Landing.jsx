const TICKET_TYPES = [
  {
    id: 'epic',
    icon: '🗺️',
    label: 'Epic / PRD',
    desc: 'Large feature or initiative requiring full scope documentation, objectives, and breakdown',
    color: '#8b5cf6',
    tags: ['Overview', 'Objectives', 'Scope', 'Deliverables'],
  },
  {
    id: 'story',
    icon: '📖',
    label: 'User Story',
    desc: 'Feature from a user perspective with acceptance criteria and definition of done',
    color: '#6366f1',
    tags: ['User Story', 'Acceptance Criteria', 'DoD'],
  },
  {
    id: 'bug',
    icon: '🐛',
    label: 'Bug Report',
    desc: 'Defect with reproduction steps, expected vs actual behaviour, and severity',
    color: '#ef4444',
    tags: ['Steps to Reproduce', 'Expected vs Actual', 'Severity'],
  },
  {
    id: 'task',
    icon: '✅',
    label: 'Task / Sub-task',
    desc: 'Technical work item with clear description, checklist, and acceptance criteria',
    color: '#22c55e',
    tags: ['Description', 'Checklist', 'Definition of Done'],
  },
  {
    id: 'spike',
    icon: '🔬',
    label: 'Spike / Research',
    desc: 'Investigation or research task with clear questions, timebox, and expected outputs',
    color: '#f59e0b',
    tags: ['Questions', 'Timebox', 'Outputs'],
  },
  {
    id: 'template',
    icon: '🎨',
    label: 'Template Change',
    desc: 'Visual or copy change to an existing template, email, or UI component',
    color: '#06b6d4',
    tags: ['Current State', 'Desired Change', 'Brands/Variants'],
  },
]

import mascot from '../assets/mascot.svg'

export default function Landing({ onStart, hasApiKey, onSettings }) {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 0 4rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <img
          src={mascot}
          alt="Scopecreeper mascot"
          style={{ width: 120, height: 'auto', marginBottom: '1rem', filter: 'drop-shadow(0 8px 24px rgba(59,130,246,0.35))' }}
        />
        <h1 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800,
          letterSpacing: '-1px', lineHeight: 1.15, marginBottom: '0.75rem'
        }}>
          What kind of ticket are<br />
          <span style={{ color: 'var(--accent)' }}>we scoping today?</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
          Pick a ticket type and I'll interview you — then generate Jira-ready content you can paste straight in.
        </p>
        {!hasApiKey && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)',
            borderRadius: 'var(--radius)', padding: '0.4rem 0.9rem',
            color: 'var(--yellow)', fontSize: '0.8rem'
          }}>
            ⚠️ No API key set — using guided questions only.{' '}
            <button onClick={onSettings} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--yellow)', textDecoration: 'underline', fontSize: '0.8rem', padding: 0
            }}>Add key</button>
          </div>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
        gap: '1rem'
      }}>
        {TICKET_TYPES.map(t => (
          <TicketCard key={t.id} type={t} onStart={onStart} />
        ))}
      </div>
    </div>
  )
}

function TicketCard({ type, onStart }) {
  return (
    <button
      onClick={() => onStart(type.id)}
      style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '1.25rem',
        cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s',
        display: 'flex', flexDirection: 'column', gap: '0.75rem',
        position: 'relative', overflow: 'hidden'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = type.color
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.background = 'var(--surface2)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.background = 'var(--surface)'
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: type.color, borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <span style={{ fontSize: '1.4rem' }}>{type.icon}</span>
        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>{type.label}</span>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.5 }}>{type.desc}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: 'auto' }}>
        {type.tags.map(tag => (
          <span key={tag} style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 4, padding: '0.15rem 0.5rem',
            fontSize: '0.7rem', color: 'var(--text-dim)'
          }}>{tag}</span>
        ))}
      </div>
    </button>
  )
}
