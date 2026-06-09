// Single place that knows how to talk to the backend.
// - Local dev: defaults to the Express server on :4000.
// - Production: set VITE_API_URL to the deployed API origin (e.g. Vercel +
//   Render split). Leave it empty to call a same-origin /api (single-service
//   deploy where one server hosts both the site and the API).
const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.PROD ? '' : 'http://localhost:4000')

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
