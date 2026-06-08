// Rejects bad submissions before they reach the controller.
// In production you might swap this for a library like Zod.
export function validateQuote(req, res, next) {
  const { name, email } = req.body
  const errors = []

  if (!name || !name.trim()) errors.push('Name is required.')
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email is required.')
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors })
  }
  next()
}