import { useState } from 'react'

export default function Settings({ onBack }) {
  const [key, setKey] = useState(localStorage.getItem('sc_api_key') || '')
  const [saved, setSaved] = useState(false)
  const [name, setName] = useState(localStorage.getItem('sc_author_name') || '')
  const [show, setShow] = useState(false)

  function save() {
    if (key.trim()) localStorage.setItem('sc_api_key', key.trim())
    else localStorage.removeItem('sc_api_key')
    if (name.trim()) localStorage.setItem('sc_author_name', name.trim())
    else localStorage.removeItem('sc_author_name')
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ maxWidth: 520, margin: '3rem auto', padding: '0 1rem' }}>
      <button
        onClick={onBack}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: '0.85rem',
          display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.5rem'
        }}
      >
        ← Back
      </button>

      <h2 style={{ fontWeight: 700, fontSize: '1.4rem', marginBottom: '0.5rem' }}>Settings</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
        Configure your Anthropic API key and preferences. Everything is stored locally in your browser only.
      </p>

      <Card title="Author" icon="👤">
        <Label>Your name (shown in generated docs)</Label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Drew McTavish"
          style={inputStyle}
        />
      </Card>

      <Card title="Anthropic API Key" icon="🔑" style={{ marginTop: '1rem' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
          Required for AI-powered dynamic interviews. Your key never leaves your browser.
          Get one at <span style={{ color: 'var(--accent)' }}>console.anthropic.com</span>.
        </p>
        <Label>API Key</Label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type={show ? 'text' : 'password'}
            value={key}
            onChange={e => setKey(e.target.value)}
            placeholder="sk-ant-..."
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            onClick={() => setShow(s => !s)}
            style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '0 0.75rem', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap'
            }}
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
        {!key && (
          <p style={{ color: 'var(--yellow)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            Without an API key, the app uses guided fixed questions instead of AI conversation.
          </p>
        )}
        {key && key.startsWith('sk-ant-') && (
          <p style={{ color: 'var(--green)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
            ✓ Key looks valid
          </p>
        )}
      </Card>

      <button
        onClick={save}
        style={{
          marginTop: '1.5rem', width: '100%', padding: '0.75rem',
          background: saved ? 'var(--green)' : 'var(--accent)',
          border: 'none', borderRadius: 'var(--radius)', color: '#fff',
          fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s'
        }}
      >
        {saved ? '✓ Saved' : 'Save Settings'}
      </button>
    </div>
  )
}

function Card({ title, icon, children }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.875rem' }}>
        <span>{icon}</span>
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function Label({ children }) {
  return <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>{children}</div>
}

const inputStyle = {
  width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
  borderRadius: 'var(--radius)', padding: '0.6rem 0.75rem', color: 'var(--text)',
  fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit'
}
