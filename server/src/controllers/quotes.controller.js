import { saveLead, getLeads } from '../lib/leadStore.js'
import { sendLeadNotification } from '../lib/mailer.js'

const RATES = { classic: 12, premium: 18, permanent: 30, commercial: 0 }

export async function createQuote(req, res) {
  const { name, email, phone = '', address = '', pkg = 'classic', feet = 0, message = '' } = req.body

  // Recalculate on the server — never trust numbers sent by the client.
  const rate = RATES[pkg] ?? 0
  const estimate = rate * Number(feet || 0)

  const saved = await saveLead({
    name, email, phone, address, pkg,
    feet: Number(feet || 0), message, estimate,
    receivedAt: new Date().toISOString(),
  })

  console.log('📥 New lead saved:', saved.id, '-', saved.name)

  // Email the team — best-effort: never block or fail the request on email.
  // (A real CRM webhook could be forwarded here the same way.)
  sendLeadNotification(saved).catch((err) =>
    console.error('✉️  Email notification failed:', err.message)
  )

  res.status(201).json({ message: 'Quote request received', lead: saved })
}

export async function listQuotes(req, res) {
  const leads = await getLeads()
  res.json({ count: leads.length, leads })
}