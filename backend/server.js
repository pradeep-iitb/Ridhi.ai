const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// In-memory store for demo only. Do NOT use in production.
let sessionKeys = {}

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

app.get('/', (req, res) => res.json({ ok: true, message: 'Ridhi.ai backend running (demo)' }))

app.listen(port, () => console.log(`Ridhi.ai backend listening on http://localhost:${port}`))
