import { Link } from 'react-router-dom'

const COLS = [
  { title: 'Services', links: [['#services', 'Holiday Lighting'], ['#services', 'Permanent Lighting'], ['#services', 'Commercial']] },
  { title: 'Company', links: [['#gallery', 'Gallery'], ['#process', 'How It Works'], ['#quote', 'Get a Quote']] },
  { title: 'Contact', links: [['tel:+10000000000', '(000) 000-0000'], ['mailto:hello@festivelighting.pro', 'hello@festivelighting.pro']] },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-800 pt-14">
      <div className="mx-auto grid max-w-[1140px] grid-cols-1 gap-10 px-6 md:grid-cols-[1.3fr_2fr]">
        <div>
          <a href="#home" className="flex items-center gap-2 text-lg font-extrabold">
            <span className="text-gold">✦</span> Festive Lighting Pros
          </a>
          <p className="mt-2.5 text-slate-400">Illuminate Joy, one home at a time.</p>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {COLS.map((c) => (
            <div key={c.title}>
              <h4 className="mb-3.5 text-[15px] font-semibold">{c.title}</h4>
              {c.links.map(([href, label]) => (
                <a key={label} href={href} className="mb-2 block text-slate-400 transition hover:text-gold">{label}</a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1140px] flex-wrap justify-between gap-3 border-t border-white/10 px-6 py-[22px] text-sm text-slate-400">
        <span>© 2026 Festive Lighting Pros. All rights reserved.</span>
        <span className="flex items-center gap-4">
          <Link to="/admin" className="transition hover:text-gold">Admin Dashboard</Link>
          <span>Built with React ⚛️ + Tailwind 🎨</span>
        </span>
      </div>
    </footer>
  )
}