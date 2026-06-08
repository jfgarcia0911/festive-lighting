import { useState } from 'react'
import Button from './ui/Button'

const LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#process', label: 'How It Works' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-900/70 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1140px] items-center justify-between px-6">
        <a href="#home" onClick={close} className="flex items-center gap-2 text-lg font-extrabold">
          <span className="text-gold">✦</span> Festive Lighting Pros
        </a>

        <button onClick={() => setOpen(!open)} aria-label="Menu" className="text-2xl md:hidden">
          {open ? '✕' : '☰'}
        </button>

        <nav
          className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-[68px] flex-col gap-4 border-b border-white/10 bg-navy-800 p-5
                      md:static md:flex md:flex-row md:items-center md:gap-7 md:border-0 md:bg-transparent md:p-0`}
        >
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={close} className="font-medium text-slate-400 transition hover:text-slate-100">
              {l.label}
            </a>
          ))}
          <Button as="a" href="#quote" variant="small" onClick={close}>Get a Quote</Button>
        </nav>
      </div>
    </header>
  )
}