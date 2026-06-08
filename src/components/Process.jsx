import { STEPS } from '../data/siteContent'

export default function Process() {
  return (
    <section id="process" className="py-[90px]">
      <div className="mx-auto max-w-[1140px] px-6">
        <p className="text-center font-semibold tracking-wide text-gold">Simple Process</p>
        <h2 className="mb-12 mt-2.5 text-center text-[clamp(26px,4vw,40px)] font-extrabold">How It Works</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="p-5 text-center">
              <div className="mx-auto mb-[18px] flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffd166,#f4a836)] text-[22px] font-extrabold text-[#2a1a00] shadow-[0_0_24px_rgba(244,168,54,0.5)]">
                {s.n}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
              <p className="text-slate-400">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}