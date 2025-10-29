import { useEffect, useState } from 'react'
import { initFirebaseClient } from '../lib/firebaseClient'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'

export default function Home() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [user, setUser] = useState(null)
  const [{ auth, googleProvider }, setAuth] = useState({ auth: null, googleProvider: null })

  useEffect(() => {
    const c = initFirebaseClient()
    setAuth(c)
    if (c.configured && c.auth) {
      const unsubscribe = onAuthStateChanged(c.auth, u => {
        setUser(u)
      })
      return () => unsubscribe()
    } else {
      setStatus('Firebase not configured. Please create frontend/.env.local with NEXT_PUBLIC_FIREBASE_* values.')
    }
  }, [])

  async function handleSignUp(e) {
    e?.preventDefault()
    if (!auth) return setStatus('Firebase not configured — cannot create account')
    setStatus('Creating account...')
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      setStatus('Account created — signed in')
    } catch (err) {
      setStatus('Error: ' + err.message)
    }
  }

  async function handleSignIn(e) {
    e?.preventDefault()
    if (!auth) return setStatus('Firebase not configured — cannot sign in')
    setStatus('Signing in...')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setStatus('Signed in')
    } catch (err) {
      setStatus('Error: ' + err.message)
    }
  }

  async function handleGoogle() {
    if (!auth || !googleProvider) return setStatus('Firebase not configured — cannot use Google sign-in')
    setStatus('Signing in with Google...')
    try {
      await signInWithPopup(auth, googleProvider)
      setStatus('Signed in with Google')
    } catch (err) {
      setStatus('Error: ' + err.message)
    }
  }

  async function handleSignOut() {
    if (!auth) return setStatus('Not signed in')
    await signOut(auth)
    setStatus('Signed out')
  }

  async function sendTokenToServer() {
    if (!auth || !auth.currentUser) return setStatus('No signed-in user or Firebase not configured')
    setStatus('Sending token to server...')
    try {
      const token = await auth.currentUser.getIdToken()
      const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token })
      })
      const data = await res.json()
      setStatus('Server response: ' + JSON.stringify(data))
    } catch (err) {
      setStatus('Error: ' + err.message)
    }
  }

  if (user) {
    return (
      <div className="page-root">
        <div className="bg">
          <div className="glass">
            <h1 className="title">Ridhi.ai</h1>
            <p className="subtitle">Welcome, {user.email || user.displayName}</p>
            <div style={{ marginTop: 12 }}>
              <button className="btn" onClick={sendTokenToServer}>Send ID token to backend (verify)</button>
              <button className="btn" style={{ marginLeft: 8, background: 'transparent', border: '1px solid rgba(255,255,255,0.08)' }} onClick={handleSignOut}>Sign out</button>
            </div>
            <div className="status">{status}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-root">
      <div className="bg">
        <div className="glass">
          <h1 className="title">Ridhi.ai</h1>
          <p className="subtitle">Sign in or create an account</p>

          <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="form">
            <label className="label">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="input" />
            <label className="label">Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="password" type="password" className="input" />

            <div className="actions">
              <button className="btn" type="submit">{mode === 'signin' ? 'Sign in' : 'Create account'}</button>
              <button type="button" className="btn" style={{ marginLeft: 8, background: 'linear-gradient(90deg,#06b6d4,#7c3aed)' }} onClick={handleGoogle}>Sign in with Google</button>
            </div>

            <div style={{ marginTop: 8 }}>
              <button type="button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="link">{mode === 'signin' ? 'Create account' : 'Have an account? Sign in'}</button>
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
        .actions { margin-top:8px }
        .btn { padding:10px 14px; background:linear-gradient(90deg,#7c3aed,#06b6d4); border:none; color:white; border-radius:8px; cursor:pointer }
        .link { background:none;border:none;color:#9fb2d6;cursor:pointer }
        .status { margin-top:8px; color:#9fb2d6 }
      `}</style>
    </div>
  )
}
