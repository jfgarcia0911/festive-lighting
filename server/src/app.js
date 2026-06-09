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

// --- Middleware ---
app.use(cors({
  // Allow listed origins, plus same-origin / tools that send no Origin header.
  origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)),
}))
app.use(express.json()) // parse JSON request bodies

// --- Routes ---
app.use('/api', quotesRouter)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// --- 404 fallback ---
app.use((req, res) => res.status(404).json({ error: 'Not found' }))

export default app