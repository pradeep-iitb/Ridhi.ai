const express = require('express')
const cors = require('cors')
const admin = require('firebase-admin')
const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// In-memory store for demo only. Do NOT use in production.
let sessionKeys = {}

// Initialize Firebase Admin if service account JSON provided in env (as JSON string)
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
    console.log('Firebase admin initialized')
  } catch (err) {
    console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', err.message)
  }
}

app.post('/save-keys', (req, res) => {
  const { email, keys } = req.body || {}
  if (!keys) return res.status(400).json({ error: 'Missing keys payload' })
  sessionKeys[email || 'anon'] = keys
  return res.json({ ok: true })
})

app.get('/keys', (req, res) => {
  const email = req.query.email || 'anon'
  return res.json({ keys: sessionKeys[email] || null })
})

app.post('/verify-token', async (req, res) => {
  const { idToken } = req.body || {}
  if (!idToken) return res.status(400).json({ error: 'Missing idToken' })
  if (!admin.apps.length) {
    return res.json({ ok: false, message: 'Firebase admin not configured on server. Set FIREBASE_SERVICE_ACCOUNT_JSON in backend env.' })
  }
  try {
    const decoded = await admin.auth().verifyIdToken(idToken)
    return res.json({ ok: true, uid: decoded.uid, claims: decoded })
  } catch (err) {
    return res.status(401).json({ ok: false, error: err.message })
  }
})

app.get('/', (req, res) => res.json({ ok: true, message: 'Ridhi.ai backend running (demo)' }))

app.listen(port, () => console.log(`Ridhi.ai backend listening on http://localhost:${port}`))
