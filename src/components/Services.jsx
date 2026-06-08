import { SERVICES } from '../data/siteContent'

export default function Services() {
  return (
    <section id="services" className="py-[90px]">
      <div className="mx-auto max-w-[1140px] px-6">
        <p className="text-center font-semibold tracking-wide text-gold">What We Do</p>
        <h2 className="mb-12 mt-2.5 text-center text-[clamp(26px,4vw,40px)] font-extrabold">
          Lighting Solutions for Every Space
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {SERVICES.map((s) => (
            <article
              key={s.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
            >
              <div className="mb-4 text-4xl">{s.icon}</div>
              <h3 className="mb-2.5 text-xl font-semibold">{s.title}</h3>
              <p className="text-slate-400">{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}