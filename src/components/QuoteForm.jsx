import { useState } from 'react'
import { PACKAGES } from '../data/siteContent'
import { submitQuote } from '../lib/api'
import Button from './ui/Button'

const BLANK = { name: '', email: '', phone: '', address: '', pkg: 'classic', feet: '', message: '' }

// Shared input + label styles, defined once to keep the form markup clean.
const FIELD = 'rounded-[10px] border border-white/10 bg-black/25 px-3.5 py-3 text-[15px] text-slate-100 transition focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20'
const LABEL = 'text-[13px] font-semibold text-slate-400'

export default function QuoteForm() {
  const [form, setForm] = useState(BLANK)
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(null) // the lead the server returned

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const rate = PACKAGES[form.pkg].rate
  const feet = Number(form.feet) || 0
  const estimate = rate * feet

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      // The server recalculates the estimate itself, so we just send the inputs.
      const lead = await submitQuote(form)
      setSaved(lead)
      setStatus('done')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  const reset = () => { setForm(BLANK); setSaved(null); setStatus('idle'); setError('') }

  if (status === 'done') {
    const finalEstimate = saved?.estimate ?? estimate
    return (
      <section id="quote" className="py-[90px]">
        <div className="mx-auto max-w-[540px] px-6 text-center">
          <div className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#06d6a0,#04b88a)] text-4xl font-extrabold text-[#04211a] shadow-[0_0_30px_rgba(6,214,160,0.5)]">
            ✓
          </div>
          <h2 className="mb-2.5 text-[28px] font-bold">Thank you, {(saved?.name || form.name).split(' ')[0] || 'friend'}!</h2>
          <p className="mb-6 text-slate-400">
            Your request is in. A lighting specialist will contact you within 24 hours
            {finalEstimate > 0 ? ` about your ~$${finalEstimate.toLocaleString()} estimate` : ''}.
          </p>
          <Button as="button" variant="gold" onClick={reset}>
            Submit Another Request
          </Button>
        </div>
      </section>
    )
  }

  const sending = status === 'sending'

  return (
    <section id="quote" className="py-[90px]">
      <div className="mx-auto grid max-w-[1140px] grid-cols-1 items-start gap-12 px-6 lg:grid-cols-2">
        {/* intro + live estimate */}
        <div>
          <p className="font-semibold tracking-wide text-gold">Get Started</p>
          <h2 className="mb-[18px] mt-2.5 text-[clamp(26px,4vw,40px)] font-extrabold">Request Your Free Quote</h2>
          <p className="text-slate-400">Fill out the form and see an instant ballpark estimate. No payment info, no obligation.</p>

          <div className="mt-7 flex flex-col gap-1 rounded-2xl border border-gold/30 bg-[linear-gradient(135deg,rgba(244,168,54,0.15),rgba(6,214,160,0.1))] p-[22px]">
            <span className="text-sm text-slate-400">Instant estimate</span>
            <strong className="text-[40px] leading-none text-gold">
              {rate === 0 ? 'Custom' : `$${estimate.toLocaleString()}`}
            </strong>
            <small className="text-slate-400">
              {rate === 0 ? "We'll tailor a commercial quote for you" : `${PACKAGES[form.pkg].label} · ${feet} ft × $${rate}/ft`}
            </small>
          </div>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-7">
          <div className="flex flex-col gap-1.5">
            <label className={LABEL}>Full Name *</label>
            <input name="name" value={form.name} onChange={update} required placeholder="Juan Dela Cruz" className={FIELD} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Email *</label>
              <input type="email" name="email" value={form.email} onChange={update} required placeholder="you@email.com" className={FIELD} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Phone</label>
              <input name="phone" value={form.phone} onChange={update} placeholder="0917 000 0000" className={FIELD} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={LABEL}>Property Address</label>
            <input name="address" value={form.address} onChange={update} placeholder="123 Maple St" className={FIELD} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Lighting Package</label>
              <select name="pkg" value={form.pkg} onChange={update} className={FIELD}>
                {Object.entries(PACKAGES).map(([key, v]) => (
                  <option key={key} value={key}>{v.label}{v.rate ? ` ($${v.rate}/ft)` : ''}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL}>Roofline (feet)</label>
              <input type="number" name="feet" min="0" value={form.feet} onChange={update} placeholder="120" className={FIELD} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={LABEL}>Anything else?</label>
            <textarea name="message" rows="3" value={form.message} onChange={update} placeholder="Tell us about your vision..." className={`${FIELD} resize-y`} />
          </div>

          {status === 'error' && (
            <p className="rounded-[10px] border border-festive-red/40 bg-festive-red/10 px-3.5 py-3 text-sm text-festive-red" role="alert">
              {error}
            </p>
          )}

          <Button as="button" type="submit" variant="gold" full disabled={sending} className={sending ? 'pointer-events-none opacity-70' : ''}>
            {sending ? 'Sending…' : 'Request My Free Quote →'}
          </Button>
        </form>
      </div>
    </section>
  )
}