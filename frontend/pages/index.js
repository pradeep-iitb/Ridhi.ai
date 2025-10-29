import { useState } from 'react'

const requiredKeys = [
  { name: 'FIREBASE_API_KEY', label: 'Firebase API Key' },
  { name: 'FIREBASE_AUTH_DOMAIN', label: 'Firebase Auth Domain' },
  { name: 'FIREBASE_PROJECT_ID', label: 'Firebase Project ID' },
  { name: 'FIREBASE_STORAGE_BUCKET', label: 'Firebase Storage Bucket' },
  { name: 'GEMINI_API_KEY', label: 'Gemini API Key' },
  { name: 'DEEPSEEK_API_KEY', label: 'DeepSeek API Key' },
  { name: 'BACKEND_URL', label: 'Backend URL (e.g. http://localhost:4000)' }
]

export default function Home() {
  const [email, setEmail] = useState('')
  const [keys, setKeys] = useState(() => {
    const initial = {}
    requiredKeys.forEach(k => (initial[k.name] = ''))
    return initial
  })
  const [status, setStatus] = useState('')

  async function submitKeys(e) {
    e.preventDefault()
    setStatus('Saving...')
    try {
      const res = await fetch((keys.BACKEND_URL || '/api') + '/save-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, keys })
      })
      const data = await res.json()
      if (res.ok) setStatus('Saved to session on server (demo).')
      else setStatus('Error: ' + (data?.error || res.statusText))
    } catch (err) {
      setStatus('Network error: ' + err.message)
    }
  }

  return (
    <div className="page-root">
      <div className="bg">
        <div className="glass">
          <h1 className="title">Ridhi.ai</h1>
          <p className="subtitle">Unified AI assistant — demo login</p>

          <form onSubmit={submitKeys} className="form">
            <label className="label">Email (demo user)</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input" />

            <details className="keys">
              <summary>Enter API keys / URIs (.env values)</summary>
              {requiredKeys.map(k => (
                <div key={k.name} className="kv">
                  <label>{k.label}</label>
                  <input value={keys[k.name]} onChange={e => setKeys(s => ({ ...s, [k.name]: e.target.value }))} placeholder={k.name} />
                </div>
              ))}
            </details>

            <div className="actions">
              <button className="btn" type="submit">Save keys (demo)</button>
            </div>
            <div className="status">{status}</div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .page-root { height:100vh; font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto; }
        .bg { background: radial-gradient(ellipse at center, #0f172a 0%, #020617 60%); height:100%; display:flex; align-items:center; justify-content:center; }
        .glass { width:min(880px,92%); backdrop-filter: blur(8px) saturate(120%); background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border:1px solid rgba(255,255,255,0.06); border-radius:16px; padding:28px; color:#e6eef8; box-shadow: 0 10px 30px rgba(2,6,23,0.6); }
        .title { font-size:28px; margin:0 0 6px 0 }
        .subtitle { margin:0 0 18px 0; opacity:0.8 }
        .form { display:flex; flex-direction:column; gap:12px }
        .label { font-size:13px; color:#cbd5e1 }
        .input { padding:10px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.04); background:rgba(255,255,255,0.02); color:#e6eef8 }
        details { background: rgba(255,255,255,0.01); padding:10px; border-radius:8px }
        .kv { display:flex; flex-direction:column; gap:6px; margin-top:8px }
        .kv input { width:100% }
        .actions { margin-top:8px }
        .btn { padding:10px 14px; background:linear-gradient(90deg,#7c3aed,#06b6d4); border:none; color:white; border-radius:8px; cursor:pointer }
        .status { margin-top:8px; color:#9fb2d6 }
      `}</style>
    </div>
  )
}
