import { useState } from 'react'

export default function AppPage() {
  const [messages, setMessages] = useState([ { from: 'system', text: 'Welcome to Ridhi.ai — this is a demo chat stub.' } ])
  const [input, setInput] = useState('')

  function send() {
    if (!input.trim()) return
    setMessages(m => [...m, { from: 'you', text: input }])
    setInput('')
    // Demo bot reply — replace with real AI call later
    setTimeout(() => setMessages(m => [...m, { from: 'ridhi', text: 'This is a demo response. Integrate Gemini/DeepSeek backend to power real replies.' }]), 700)
  }

  return (
    <div style={{ padding: 24, color: '#e6eef8' }}>
      <h2>Ridhi.ai — Chat (Demo)</h2>
      <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 10, minHeight: 240 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, color: '#9fb2d6' }}>{m.from}</div>
            <div style={{ marginTop: 4 }}>{m.text}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message" style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.04)', background: 'transparent', color: '#e6eef8' }} />
        <button onClick={send} style={{ padding: '10px 14px', borderRadius: 8, background: 'linear-gradient(90deg,#7c3aed,#06b6d4)', color: 'white', border: 'none' }}>Send</button>
      </div>
    </div>
  )
}
