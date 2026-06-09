// Emails a "new lead" notification to the team via Resend (https://resend.com).
// Fully env-driven and degrades gracefully: if RESEND_API_KEY or NOTIFY_EMAIL
// isn't set, it logs and skips — so lead capture (and live demos) never break.
const RESEND_API_KEY = process.env.RESEND_API_KEY
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL
// Resend lets you send from this shared address with no domain setup. Swap in
// your own verified domain later (e.g. "Festive Lighting Pros <leads@yourdomain.com>").
const FROM_EMAIL = process.env.FROM_EMAIL || 'Festive Lighting Pros <onboarding@resend.dev>'

const PKG_LABELS = {
  classic: 'Classic Holiday',
  premium: 'Premium Holiday',
  permanent: 'Permanent Lighting',
  commercial: 'Commercial / Events',
}

const row = (label, value) =>
  `<tr>
     <td style="padding:8px 0;color:#64748b;font-size:13px;width:130px;vertical-align:top">${label}</td>
     <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:600">${value || '—'}</td>
   </tr>`

function buildHtml(lead, estimateText, pkg) {
  return `
  <div style="font-family:Inter,Segoe UI,Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden">
    <div style="background:linear-gradient(135deg,#0a1530,#060d20);padding:22px 26px">
      <h1 style="margin:0;color:#ffd166;font-size:18px">✦ New Quote Request</h1>
      <p style="margin:6px 0 0;color:#94a3b8;font-size:13px">A customer just requested a quote on the website.</p>
    </div>
    <div style="padding:22px 26px;background:#ffffff">
      <div style="background:#fff7e6;border:1px solid #f4a836;border-radius:10px;padding:14px 16px;margin-bottom:18px">
        <span style="color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.04em">Instant estimate</span><br>
        <strong style="color:#b45309;font-size:24px">${estimateText}</strong>
      </div>
      <table style="width:100%;border-collapse:collapse">
        ${row('Name', lead.name)}
        ${row('Email', `<a href="mailto:${lead.email}" style="color:#b45309">${lead.email}</a>`)}
        ${row('Phone', lead.phone)}
        ${row('Address', lead.address)}
        ${row('Package', pkg)}
        ${row('Roofline', lead.feet ? `${lead.feet} ft` : '—')}
        ${row('Message', lead.message)}
        ${row('Received', new Date(lead.receivedAt).toLocaleString('en-US'))}
      </table>
      <p style="margin:20px 0 0;color:#64748b;font-size:13px">Just reply to this email to respond to ${lead.name || 'the customer'} directly.</p>
    </div>
  </div>`
}

function buildText(lead, estimateText, pkg) {
  return [
    'New Quote Request',
    '',
    `Name:     ${lead.name || '—'}`,
    `Email:    ${lead.email || '—'}`,
    `Phone:    ${lead.phone || '—'}`,
    `Address:  ${lead.address || '—'}`,
    `Package:  ${pkg}`,
    `Roofline: ${lead.feet ? `${lead.feet} ft` : '—'}`,
    `Estimate: ${estimateText}`,
    `Message:  ${lead.message || '—'}`,
    `Received: ${new Date(lead.receivedAt).toLocaleString('en-US')}`,
  ].join('\n')
}

export async function sendLeadNotification(lead) {
  if (!RESEND_API_KEY || !NOTIFY_EMAIL) {
    console.log('✉️  Email not configured (set RESEND_API_KEY + NOTIFY_EMAIL) — skipping notification.')
    return
  }

  const estimateText = Number(lead.estimate) > 0
    ? `$${Number(lead.estimate).toLocaleString()}`
    : 'Custom quote'
  const pkg = PKG_LABELS[lead.pkg] || lead.pkg

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [NOTIFY_EMAIL],
      reply_to: lead.email, // replies go straight to the customer
      subject: `🎄 New quote request — ${lead.name || 'Website'} (${estimateText})`,
      html: buildHtml(lead, estimateText, pkg),
      text: buildText(lead, estimateText, pkg),
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Resend responded ${res.status}: ${detail}`)
  }
  console.log('✉️  Lead notification emailed to', NOTIFY_EMAIL)
}
