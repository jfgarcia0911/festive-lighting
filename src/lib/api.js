// Single place that knows how to talk to the backend.
// Override the base URL in production with a VITE_API_URL env var.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// POST a new quote request. Returns the saved lead (with the server-side
// recalculated estimate) or throws an Error with a user-friendly message.
export async function submitQuote(lead) {
  let res
  try {
    res = await fetch(`${API_URL}/api/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })
  } catch {
    throw new Error("Can't reach the server. Please make sure the API is running.")
  }

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    // The backend returns { error, details: [...] } on validation failure.
    throw new Error(data.details?.join(' ') || data.error || 'Something went wrong. Please try again.')
  }
  return data.lead
}

// GET all captured leads for the admin dashboard → { count, leads }.
export async function fetchQuotes() {
  let res
  try {
    res = await fetch(`${API_URL}/api/quotes`)
  } catch {
    throw new Error("Can't reach the server. Please make sure the API is running.")
  }
  if (!res.ok) throw new Error('Failed to load leads.')
  return res.json()
}
