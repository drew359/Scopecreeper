import { useState, useEffect } from 'react'
import { marked } from 'marked'
import { TYPE_LABELS, TYPE_ICONS } from './Interview'

marked.setOptions({ breaks: true, gfm: true })

export default function Output({ output, ticketType, onNew }) {
  const [copied, setCopied] = useState('')
  const [tab, setTab] = useState('preview') // preview | markdown

  const { summary, priority, body } = parseOutput(output)

  function copy(text, key) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(''), 2000)
    })
  }

  const htmlBody = body ? marked.parse(body) : ''

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '1.5rem 0 4rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>{TYPE_ICONS[ticketType]}</span>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{TYPE_LABELS[ticketType]}</span>
          <span style={{
            background: 'var(--green-soft)', border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 4, padding: '0.1rem 0.5rem', fontSize: '0.7rem', color: 'var(--green)'
          }}>✓ Generated</span>
        </div>
        <button
          onClick={onNew}
          style={{
            background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius)',
            color: '#fff', padding: '0.4rem 0.9rem', cursor: 'pointer',
            fontSize: '0.82rem', fontWeight: 600
          }}
        >
          + New Ticket
        </button>
      </div>

      {/* Jira fields panel */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1rem'
      }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
          Jira Fields
        </div>

        {/* Summary */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Summary <span style={{ color: 'var(--red)' }}>*</span>
            </label>
            <CopyBtn
              onCopy={() => copy(summary, 'summary')}
              copied={copied === 'summary'}
              label="Copy Summary"
            />
          </div>
          <div style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '0.65rem 0.875rem',
            fontSize: '0.88rem', color: 'var(--text)', lineHeight: 1.5,
            fontWeight: 500
          }}>
            {summary || <span style={{ color: 'var(--text-dim)' }}>No summary generated</span>}
          </div>
        </div>

        {/* Priority */}
        {priority && (
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Suggested Priority
            </label>
            <PriorityBadge priority={priority} />
          </div>
        )}
      </div>

      {/* Description section */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {['preview', 'markdown'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  background: tab === t ? 'var(--accent-soft)' : 'none',
                  border: tab === t ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                  borderRadius: 6, padding: '0.25rem 0.65rem', cursor: 'pointer',
                  color: tab === t ? 'var(--accent)' : 'var(--text-muted)',
                  fontSize: '0.78rem', fontWeight: tab === t ? 600 : 400
                }}
              >
                {t === 'preview' ? '👁 Preview' : '📝 Markdown'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <CopyBtn
              onCopy={() => copy(body, 'body')}
              copied={copied === 'body'}
              label="Copy Description"
            />
            <CopyBtn
              onCopy={() => copy(`Summary: ${summary}\n\n${body}`, 'all')}
              copied={copied === 'all'}
              label="Copy All"
              accent
            />
          </div>
        </div>

        <div style={{ padding: '1.25rem', minHeight: 300 }}>
          {tab === 'preview' ? (
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: htmlBody }}
            />
          ) : (
            <pre style={{
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap',
              lineHeight: 1.6, margin: 0
            }}>
              {body}
            </pre>
          )}
        </div>
      </div>

      {/* Tip */}
      <div style={{
        marginTop: '1rem', padding: '0.75rem 1rem',
        background: 'var(--accent-soft)', border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 'var(--radius)', fontSize: '0.78rem', color: 'var(--text-muted)',
        display: 'flex', gap: '0.5rem', alignItems: 'flex-start'
      }}>
        <span>💡</span>
        <span>
          Copy <strong style={{ color: 'var(--text)' }}>Summary</strong> into the Jira Summary field, then
          copy <strong style={{ color: 'var(--text)' }}>Description</strong> into the Description body.
          The Markdown will render in Jira's rich text editor when you paste it.
        </span>
      </div>
    </div>
  )
}

function CopyBtn({ onCopy, copied, label, accent }) {
  return (
    <button
      onClick={onCopy}
      style={{
        background: accent ? 'var(--accent)' : 'var(--surface2)',
        border: `1px solid ${accent ? 'transparent' : 'var(--border)'}`,
        borderRadius: 'var(--radius)', padding: '0.3rem 0.7rem', cursor: 'pointer',
        color: copied ? 'var(--green)' : (accent ? '#fff' : 'var(--text-muted)'),
        fontSize: '0.75rem', fontWeight: 600, transition: 'all 0.15s',
        whiteSpace: 'nowrap'
      }}
    >
      {copied ? '✓ Copied!' : label}
    </button>
  )
}

function PriorityBadge({ priority }) {
  const colors = {
    Critical: '#ef4444',
    High: '#f97316',
    Medium: '#eab308',
    Low: '#22c55e',
  }
  const icons = { Critical: '🔴', High: '🟠', Medium: '🟡', Low: '🟢' }
  const p = Object.keys(colors).find(k => priority.toLowerCase().includes(k.toLowerCase())) || 'Medium'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      background: `${colors[p]}20`, border: `1px solid ${colors[p]}40`,
      borderRadius: 4, padding: '0.2rem 0.6rem',
      fontSize: '0.78rem', fontWeight: 600, color: colors[p]
    }}>
      {icons[p]} {p}
    </span>
  )
}

function parseOutput(raw) {
  if (!raw) return { summary: '', priority: '', body: '' }

  let summary = ''
  let priority = ''
  let body = raw

  // Extract TICKET_SUMMARY
  const summaryMatch = raw.match(/TICKET_SUMMARY:\s*(.+)/i)
  if (summaryMatch) {
    summary = summaryMatch[1].trim().replace(/^["']|["']$/g, '')
  }

  // Extract PRIORITY
  const priorityMatch = raw.match(/PRIORITY:\s*(.+)/i)
  if (priorityMatch) {
    priority = priorityMatch[1].trim()
  }

  // Remove the header block from body
  body = raw
    .replace(/^---\s*\n.*?TICKET_SUMMARY:.*?\n.*?PRIORITY:.*?\n---\s*\n/ms, '')
    .replace(/TICKET_SUMMARY:.*\n?/gi, '')
    .replace(/PRIORITY:.*\n?/gi, '')
    .trim()

  return { summary, priority, body }
}
