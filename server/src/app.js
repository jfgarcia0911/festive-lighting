import express from 'express'
import cors from 'cors'
import quotesRouter from './routes/quotes.routes.js'

const app = express()

// --- Middleware ---
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json()) // parse JSON request bodies

// --- Routes ---
app.use('/api', quotesRouter)
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// --- 404 fallback ---
app.use((req, res) => res.status(404).json({ error: 'Not found' }))

export default app