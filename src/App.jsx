import { useState } from 'react'
import Landing from './components/Landing'
import Interview from './components/Interview'
import Output from './components/Output'
import Settings from './components/Settings'

export default function App() {
  const [screen, setScreen] = useState('landing')
  const [ticketType, setTicketType] = useState(null)
  const [transcript, setTranscript] = useState([])
  const [generatedOutput, setGeneratedOutput] = useState(null)

  const apiKey = localStorage.getItem('sc_api_key') || ''

  function startInterview(type) {
    setTicketType(type)
    setTranscript([])
    setGeneratedOutput(null)
    setScreen('interview')
  }

  function handleOutputReady(output, fullTranscript) {
    setGeneratedOutput(output)
    setTranscript(fullTranscript)
    setScreen('output')
  }

  function reset() {
    setScreen('landing')
    setTicketType(null)
    setTranscript([])
    setGeneratedOutput(null)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header onSettings={() => setScreen('settings')} onHome={reset} />
      <main style={{ flex: 1, padding: '0 1rem' }}>
        {screen === 'landing' && <Landing onStart={startInterview} hasApiKey={!!apiKey} onSettings={() => setScreen('settings')} />}
        {screen === 'settings' && <Settings onBack={() => setScreen('landing')} />}
        {screen === 'interview' && (
          <Interview
            ticketType={ticketType}
            apiKey={apiKey}
            onComplete={handleOutputReady}
            onCancel={reset}
          />
        )}
        {screen === 'output' && (
          <Output
            output={generatedOutput}
            ticketType={ticketType}
            transcript={transcript}
            onNew={reset}
          />
        )}
      </main>
    </div>
  )
}

function Header({ onSettings, onHome }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0.875rem 1.5rem', borderBottom: '1px solid var(--border)',
      background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10
    }}>
      <button onClick={onHome} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '0.5rem'
      }}>
        <span style={{ fontSize: '1.2rem' }}>🎯</span>
        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', letterSpacing: '-0.3px' }}>
          ScopeCreeper
        </span>
      </button>
      <button
        onClick={onSettings}
        style={{
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', color: 'var(--text-muted)',
          padding: '0.35rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem',
          display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.15s'
        }}
      >
        ⚙️ Settings
      </button>
    </header>
  )
}
