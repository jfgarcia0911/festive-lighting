import express from 'express'
import cors from 'cors'
import quotesRouter from './routes/quotes.routes.js'

const app = express()

// Allowed browser origins — comma-separated in CLIENT_ORIGIN for production
// (e.g. your Vercel URL), falling back to the local Vite dev server.
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

// An origin is allowed if it sends no Origin header (same-origin / curl), is
// explicitly listed in CLIENT_ORIGIN, or is any Vercel deployment — the latter
// covers the production URL plus all preview/branch URLs without reconfiguring.
function isAllowedOrigin(origin) {
  if (!origin) return true
  if (allowedOrigins.includes(origin)) return true
  try {
    return new URL(origin).hostname.endsWith('.vercel.app')
  } catch {
    return false
  }
}

// --- Middleware ---
app.use(cors({ origin: (origin, cb) => cb(null, isAllowedOrigin(origin)) }))
app.use(express.json()) // parse JSON request bodies

// --- Routes ---
app.use('/api', quotesRouter)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// --- 404 fallback ---
app.use((req, res) => res.status(404).json({ error: 'Not found' }))

export default app