import { useState, useEffect, useRef } from 'react'
import { FIXED_QUESTIONS } from '../data/questions'
import { generateOutput } from '../lib/ai'

export default function Interview({ ticketType, apiKey, onComplete, onCancel }) {
  const [messages, setMessages] = useState([]) // { role: 'ai'|'user', text: string }
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState('interview') // interview | generating
  const [fixedIndex, setFixedIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // question -> answer map for fixed mode
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  const useAI = !!apiKey
  const fixedQuestions = FIXED_QUESTIONS[ticketType] || []
  const isFixedDone = !useAI && fixedIndex >= fixedQuestions.length

  useEffect(() => {
    // Initial greeting
    const greeting = useAI
      ? null // AI will generate first message
      : {
          role: 'ai',
          text: fixedQuestions[0]?.question || "Let's get started. Tell me about your ticket.",
        }

    if (useAI) {
      startAIConversation()
    } else {
      setMessages([{ role: 'ai', text: greeting.text }])
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function startAIConversation() {
    setLoading(true)
    try {
      const firstMsg = await callAI([], ticketType, 'start')
      setMessages([{ role: 'ai', text: firstMsg }])
    } catch (err) {
      setMessages([{ role: 'ai', text: getFallbackQuestion(ticketType, 0) }])
    }
    setLoading(false)
  }

  async function callAI(history, type, action = 'continue') {
    const systemPrompt = buildSystemPrompt(type, action)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: history.length
          ? history
          : [{ role: 'user', content: `I need to create a Jira ${TYPE_LABELS[type]} ticket. Please start the interview.` }],
      }),
    })
    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err?.error?.message || `API error ${response.status}`)
    }
    const data = await response.json()
    return data.content[0].text
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg = { role: 'user', text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)

    if (!useAI) {
      // Fixed question mode
      const newAnswers = { ...answers, [fixedQuestions[fixedIndex]?.id || fixedIndex]: text }
      setAnswers(newAnswers)
      const next = fixedIndex + 1

      if (next >= fixedQuestions.length) {
        setFixedIndex(next)
        // All questions answered, generate output
        setTimeout(() => generateTicket(newMessages, newAnswers), 300)
      } else {
        setFixedIndex(next)
        setTimeout(() => {
          setMessages(m => [...m, { role: 'ai', text: fixedQuestions[next].question }])
          inputRef.current?.focus()
        }, 400)
      }
      return
    }

    // AI mode
    setLoading(true)
    try {
      const history = newMessages.map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text,
      }))

      // Check if AI wants to generate output
      const response = await callAI(history, ticketType, 'continue')

      if (response.includes('READY_TO_GENERATE') || newMessages.filter(m => m.role === 'user').length >= 8) {
        const cleanResponse = response.replace('READY_TO_GENERATE', '').trim()
        if (cleanResponse) setMessages(m => [...m, { role: 'ai', text: cleanResponse }])
        setTimeout(() => generateTicket(newMessages, {}), 500)
      } else {
        setMessages(m => [...m, { role: 'ai', text: response }])
        inputRef.current?.focus()
      }
    } catch (err) {
      setMessages(m => [...m, { role: 'ai', text: `Sorry, there was an error: ${err.message}. Let's continue — could you give me more context?` }])
    }
    setLoading(false)
  }

  async function generateTicket(msgHistory, fixedAnswers) {
    setPhase('generating')

    const transcript = msgHistory
    const author = localStorage.getItem('sc_author_name') || ''

    try {
      let output
      if (useAI) {
        output = await generateOutput(apiKey, ticketType, transcript, author)
      } else {
        output = await generateOutputFixed(ticketType, fixedAnswers, fixedQuestions, author)
      }
      onComplete(output, transcript)
    } catch (err) {
      // Fallback: generate basic output from transcript
      const fallback = buildFallbackOutput(ticketType, transcript, fixedAnswers, fixedQuestions)
      onComplete(fallback, transcript)
    }
  }

  async function generateOutputFixed(type, answersMap, questions, author) {
    if (!apiKey) {
      return buildFallbackOutput(type, [], answersMap, questions)
    }
    return generateOutput(apiKey, type, [], author, answersMap, questions)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (phase === 'generating') {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '60vh', gap: '1rem'
      }}>
        <div style={{
          width: 48, height: 48, border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Generating your Jira ticket...
        </p>
      </div>
    )
  }

  const userMsgCount = messages.filter(m => m.role === 'user').length
  const canGenerate = useAI ? userMsgCount >= 3 : isFixedDone || userMsgCount >= 3

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)' }}>
      {/* Progress / header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 0 0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1rem' }}>{TYPE_ICONS[ticketType]}</span>
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{TYPE_LABELS[ticketType]}</span>
          {!useAI && (
            <span style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 4, padding: '0.1rem 0.4rem', fontSize: '0.7rem', color: 'var(--text-dim)'
            }}>
              {Math.min(fixedIndex, fixedQuestions.length)}/{fixedQuestions.length} questions
            </span>
          )}
          {useAI && (
            <span style={{
              background: 'var(--accent-soft)', border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 4, padding: '0.1rem 0.4rem', fontSize: '0.7rem', color: 'var(--accent)'
            }}>
              ✨ AI interview
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {canGenerate && (
            <button
              onClick={() => generateTicket(messages, answers)}
              style={{
                background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius)',
                color: '#fff', padding: '0.35rem 0.75rem', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 600
              }}
            >
              Generate →
            </button>
          )}
          <button
            onClick={onCancel}
            style={{
              background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              color: 'var(--text-muted)', padding: '0.35rem 0.65rem', cursor: 'pointer', fontSize: '0.8rem'
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '1rem' }}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
        {isFixedDone && !loading && (
          <div style={{
            background: 'var(--green-soft)', border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 'var(--radius)', padding: '0.75rem 1rem', margin: '0.5rem 0',
            fontSize: '0.85rem', color: 'var(--green)'
          }}>
            ✓ All questions answered! Click <strong>Generate →</strong> to create your ticket.
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!isFixedDone && (
        <div style={{
          display: 'flex', gap: '0.5rem', padding: '0.75rem 0 1rem',
          borderTop: '1px solid var(--border)'
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer... (Enter to send, Shift+Enter for newline)"
            rows={2}
            style={{
              flex: 1, background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '0.65rem 0.9rem', color: 'var(--text)',
              fontSize: '0.9rem', resize: 'none', outline: 'none', fontFamily: 'inherit',
              lineHeight: 1.5
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            style={{
              background: input.trim() && !loading ? 'var(--accent)' : 'var(--surface2)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              color: input.trim() && !loading ? '#fff' : 'var(--text-dim)',
              padding: '0 1rem', cursor: input.trim() && !loading ? 'pointer' : 'default',
              fontSize: '1rem', transition: 'all 0.15s', alignSelf: 'stretch'
            }}
          >
            ↑
          </button>
        </div>
      )}
    </div>
  )
}

function MessageBubble({ msg }) {
  const isAI = msg.role === 'ai'
  return (
    <div style={{
      display: 'flex', gap: '0.6rem', alignItems: 'flex-start',
      marginBottom: '0.75rem', animation: 'fadeIn 0.2s ease',
      flexDirection: isAI ? 'row' : 'row-reverse'
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: isAI ? 'var(--accent-soft)' : 'var(--surface2)',
        border: `1px solid ${isAI ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem'
      }}>
        {isAI ? '🎯' : '👤'}
      </div>
      <div style={{
        maxWidth: '80%', background: isAI ? 'var(--surface)' : 'var(--surface2)',
        border: `1px solid ${isAI ? 'var(--border)' : 'rgba(99,102,241,0.2)'}`,
        borderRadius: isAI ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
        padding: '0.65rem 0.875rem', fontSize: '0.88rem', lineHeight: 1.55,
        color: isAI ? 'var(--text-muted)' : 'var(--text)'
      }}>
        {msg.text}
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: 'var(--accent-soft)', border: '1px solid rgba(99,102,241,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem'
      }}>🎯</div>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '4px 12px 12px 12px', padding: '0.65rem 1rem',
        display: 'flex', gap: '4px', alignItems: 'center'
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--text-dim)',
            animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
          }} />
        ))}
      </div>
    </div>
  )
}

function buildSystemPrompt(type, action) {
  const label = TYPE_LABELS[type]
  if (action === 'start') {
    return `You are ScopeCreeper, an expert product manager and business analyst who helps teams write great Jira tickets.

Your job is to interview the user to gather everything needed to write a high-quality ${label} ticket.

Start with a warm, concise opening question that gets them talking about the feature/work they need.
Ask one question at a time. Keep questions short and conversational.
After 4-6 exchanges where you have enough information, respond with READY_TO_GENERATE at the start of your message (optionally with a brief closing message).

Important info to gather for a ${label}:
${TYPE_REQUIREMENTS[type]}

Be direct, friendly, and professional. No fluff.`
  }

  return `You are ScopeCreeper, an expert PM interviewing a user to gather info for a Jira ${label} ticket.

Continue the interview. Ask one focused follow-up question based on their last answer.
Probe for specifics — who, what, why, constraints, edge cases, affected users/systems.

If you now have enough information (usually after 5-8 user responses), start your message with READY_TO_GENERATE and give a brief, friendly wrap-up message.

Info needed for a ${label}:
${TYPE_REQUIREMENTS[type]}`
}

function getFallbackQuestion(type, index) {
  const q = FIXED_QUESTIONS[type]?.[index]
  return q?.question || "Tell me what you're working on."
}

function buildFallbackOutput(type, messages, answers, questions) {
  const pairs = questions.map(q => {
    const answer = answers[q.id] || 'Not provided'
    return `### ${q.label}\n${answer}`
  })

  const userMessages = messages.filter(m => m.role === 'user').map(m => `- ${m.text}`)

  return `# ${TYPE_LABELS[type]} Ticket

*Generated by ScopeCreeper*

---

${pairs.join('\n\n')}

${userMessages.length ? `\n## Additional Context\n${userMessages.join('\n')}` : ''}

---
*Review and edit before pasting into Jira.*`
}

export const TYPE_LABELS = {
  epic: 'Epic / PRD',
  story: 'User Story',
  bug: 'Bug Report',
  task: 'Task',
  spike: 'Spike / Research',
  template: 'Template Change',
}

export const TYPE_ICONS = {
  epic: '🗺️',
  story: '📖',
  bug: '🐛',
  task: '✅',
  spike: '🔬',
  template: '🎨',
}

const TYPE_REQUIREMENTS = {
  epic: `- High-level overview and background
- Business objectives and success metrics
- Scope (what's in and out)
- Key stakeholders and owners
- Deliverables breakdown
- Dependencies and constraints
- Timeline / priority`,

  story: `- User role and what they want to achieve
- Why they want it (the business value)
- Acceptance criteria (specific, testable)
- Edge cases and error states
- UI/UX considerations
- Definition of done`,

  bug: `- Steps to reproduce
- Expected behaviour
- Actual behaviour
- Environment (browser, device, version)
- Severity / business impact
- Affected users or brands
- Screenshots or logs if mentioned`,

  task: `- What needs to be done and why
- Technical approach or implementation notes
- Specific deliverables / checklist items
- Definition of done
- Dependencies on other work`,

  spike: `- The question or problem being investigated
- Why this research is needed
- Timebox (how long to spend)
- Expected outputs / deliverables
- Success criteria`,

  template: `- Which template(s) are affected
- Current behaviour / state
- Desired change
- Which brands or variants are impacted
- Any OBP/config settings involved
- Visual references if mentioned`,
}
