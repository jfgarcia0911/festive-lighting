import Button from './ui/Button'

const BULB_COLORS = ['#ffd166', '#ef476f', '#06d6a0', '#fb8500']
const STATS = [['2,500+', 'Homes Lit'], ['4.9★', 'Avg Rating'], ['100%', 'Satisfaction']]

export default function Hero() {
  const bulbs = Array.from({ length: 28 })

  return (
    <section
      id="home"
      className="relative overflow-hidden py-24 text-center"
      style={{ background: 'radial-gradient(1200px 500px at 50% -10%, rgba(244,168,54,0.18), transparent 60%), linear-gradient(180deg, #0a1530, #060d20)' }}
    >
      {/* starfield */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ backgroundImage: 'radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,.8), transparent), radial-gradient(2px 2px at 70% 20%, rgba(255,255,255,.6), transparent), radial-gradient(1.5px 1.5px at 40% 60%, rgba(255,255,255,.7), transparent), radial-gradient(1.5px 1.5px at 85% 50%, rgba(255,255,255,.5), transparent), radial-gradient(2px 2px at 15% 70%, rgba(255,255,255,.6), transparent)' }}
      />

      {/* string lights */}
      <div className="absolute left-0 right-0 top-0 flex justify-between px-3" aria-hidden="true">
        {bulbs.map((_, i) => {
          const color = BULB_COLORS[i % 4]
          return (
            <span
              key={i}
              className="mt-2 h-3 w-3 animate-twinkle rounded-full"
              style={{ background: color, boxShadow: `0 0 12px 3px ${color}`, animationDelay: `${(i % 7) * 0.3}s` }}
            />
          )
        })}
      </div>

      <div className="relative z-10 mx-auto max-w-[1140px] px-6">
        <p className="mb-4 font-semibold tracking-wide text-gold">✨ Holiday & Permanent Lighting Experts</p>
        <h1 className="text-[clamp(34px,6vw,60px)] font-extrabold leading-[1.08]">
          Illuminate Joy,<br />One Home at a Time
        </h1>
        <p className="mx-auto mb-8 mt-5 max-w-[620px] text-lg text-slate-400">
          Professional installation, maintenance, and takedown of stunning holiday and year-round lighting for homes and businesses.
        </p>
        <div className="flex flex-wrap justify-center gap-3.5">
          <Button as="a" href="#quote" variant="gold">Get a Free Quote</Button>
          <Button as="a" href="#gallery" variant="ghost">See Our Work</Button>
        </div>
        <div className="mt-14 flex flex-wrap justify-center gap-10">
          {STATS.map(([n, label]) => (
            <div key={label} className="flex flex-col">
              <strong className="text-[26px] text-gold">{n}</strong>
              <span className="text-sm text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}