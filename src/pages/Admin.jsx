import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PACKAGES } from '../data/siteContent'
import { fetchQuotes } from '../lib/api'

const money = (n) => `$${Number(n || 0).toLocaleString()}`

const pkgLabel = (key) => PACKAGES[key]?.label || key

// A small colored pill per package so rows scan quickly.
const PKG_STYLES = {
  classic: 'bg-festive-green/15 text-festive-green',
  premium: 'bg-gold/15 text-gold',
  permanent: 'bg-sky-400/15 text-sky-300',
  commercial: 'bg-festive-red/15 text-festive-red',
}

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-[13px] font-semibold text-slate-400">{label}</p>
      <p className="mt-1.5 text-[28px] font-extrabold leading-none text-slate-100">{value}</p>
      {sub && <p className="mt-1.5 text-xs text-slate-500">{sub}</p>}
    </div>
  )
}

export default function Admin() {
  const [leads, setLeads] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [pkgFilter, setPkgFilter] = useState('all')

  // Newest first.
  function applyData(data) {
    const sorted = [...(data.leads || [])].sort(
      (a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)
    )
    setLeads(sorted)
    setStatus('ready')
  }

  // Manual refresh / retry — fine to flip to the loading state synchronously here.
  async function load() {
    setStatus('loading')
    setError('')
    try {
      applyData(await fetchQuotes())
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  // Initial fetch on mount. State starts as 'loading', so we only set state
  // once the request settles (avoids cascading renders inside the effect).
  useEffect(() => {
    let active = true
    fetchQuotes()
      .then((data) => { if (active) applyData(data) })
      .catch((err) => {
        if (!active) return
        setError(err.message)
        setStatus('error')
      })
    return () => { active = false }
  }, [])

  const stats = useMemo(() => {
    const total = leads.length
    const pipeline = leads.reduce((sum, l) => sum + Number(l.estimate || 0), 0)
    const quoted = leads.filter((l) => Number(l.estimate) > 0).length
    const commercial = leads.filter((l) => l.pkg === 'commercial').length
    return { total, pipeline, avg: quoted ? Math.round(pipeline / quoted) : 0, commercial }
  }, [leads])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return leads.filter((l) => {
      if (pkgFilter !== 'all' && l.pkg !== pkgFilter) return false
      if (!q) return true
      return [l.name, l.email, l.phone, l.address]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    })
  }, [leads, query, pkgFilter])

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-navy-900/80 backdrop-blur-md">
        <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="text-gold">✦</span>
            <div>
              <h1 className="text-base font-extrabold leading-none">Leads Dashboard</h1>
              <p className="text-xs text-slate-500">Festive Lighting Pros · Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={load}
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
            >
              ↻ Refresh
            </button>
            <Link to="/" className="text-sm font-medium text-slate-400 transition hover:text-slate-100">
              ← Back to site
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Leads" value={stats.total} sub="all-time captured" />
          <StatCard label="Pipeline Value" value={money(stats.pipeline)} sub="sum of estimates" />
          <StatCard label="Avg. Estimate" value={money(stats.avg)} sub="quoted leads only" />
          <StatCard label="Commercial" value={stats.commercial} sub="custom-quote requests" />
        </div>

        {/* Controls */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, phone, address…"
            className="w-full rounded-[10px] border border-white/10 bg-black/25 px-3.5 py-2.5 text-[15px] text-slate-100 transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 sm:max-w-[360px]"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPkgFilter('all')}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${pkgFilter === 'all' ? 'bg-gold text-[#2a1a00]' : 'border border-white/10 text-slate-300 hover:bg-white/5'}`}
            >
              All
            </button>
            {Object.keys(PACKAGES).map((key) => (
              <button
                key={key}
                onClick={() => setPkgFilter(key)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${pkgFilter === key ? 'bg-gold text-[#2a1a00]' : 'border border-white/10 text-slate-300 hover:bg-white/5'}`}
              >
                {PACKAGES[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* Table / states */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
          {status === 'loading' && (
            <div className="px-6 py-16 text-center text-slate-400">Loading leads…</div>
          )}

          {status === 'error' && (
            <div className="px-6 py-16 text-center">
              <p className="text-festive-red">{error}</p>
              <button onClick={load} className="mt-4 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5">
                Try again
              </button>
            </div>
          )}

          {status === 'ready' && visible.length === 0 && (
            <div className="px-6 py-16 text-center text-slate-400">
              {leads.length === 0
                ? 'No leads yet. Submit the quote form on the site to see one appear here.'
                : 'No leads match your filters.'}
            </div>
          )}

          {status === 'ready' && visible.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-[13px] text-slate-400">
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Contact</th>
                    <th className="px-4 py-3 font-semibold">Address</th>
                    <th className="px-4 py-3 font-semibold">Package</th>
                    <th className="px-4 py-3 text-right font-semibold">Roofline</th>
                    <th className="px-4 py-3 text-right font-semibold">Estimate</th>
                    <th className="px-4 py-3 font-semibold">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((l) => (
                    <tr key={l.id} className="border-b border-white/5 transition hover:bg-white/5">
                      <td className="px-4 py-3 font-semibold text-slate-100">
                        {l.name || '—'}
                        {l.message && (
                          <p className="mt-0.5 max-w-[220px] truncate text-xs font-normal text-slate-500" title={l.message}>
                            “{l.message}”
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        <a href={`mailto:${l.email}`} className="text-slate-200 hover:text-gold">{l.email}</a>
                        {l.phone && <p className="text-xs text-slate-500">{l.phone}</p>}
                      </td>
                      <td className="px-4 py-3 text-slate-400">{l.address || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${PKG_STYLES[l.pkg] || 'bg-white/10 text-slate-300'}`}>
                          {pkgLabel(l.pkg)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-300">{l.feet ? `${l.feet} ft` : '—'}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gold">
                        {Number(l.estimate) > 0 ? money(l.estimate) : 'Custom'}
                      </td>
                      <td className="px-4 py-3 text-slate-400">{formatDate(l.receivedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {status === 'ready' && visible.length > 0 && (
          <p className="mt-3 text-xs text-slate-500">
            Showing {visible.length} of {leads.length} {leads.length === 1 ? 'lead' : 'leads'}.
          </p>
        )}
      </main>
    </div>
  )
}
