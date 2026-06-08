import { GALLERY } from '../data/siteContent'

const TILE_BG = ['bg-[#13224d]', 'bg-[#1a1740]', 'bg-[#0f2a3a]']

export default function Gallery() {
  return (
    <section id="gallery" className="bg-navy-800 py-[90px]">
      <div className="mx-auto max-w-[1140px] px-6">
        <p className="text-center font-semibold tracking-wide text-gold">Our Work</p>
        <h2 className="mb-12 mt-2.5 text-center text-[clamp(26px,4vw,40px)] font-extrabold">Recent Installations</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((g, i) => (
            <figure
              key={g.label}
              className={`group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-white/10 ${TILE_BG[i % 3]}`}
            >
              <span className="text-6xl drop-shadow-[0_0_16px_rgba(255,209,102,0.5)] transition group-hover:scale-[1.15]">
                {g.emoji}
              </span>
              <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-[linear-gradient(to_top,rgba(0,0,0,0.7),transparent)] p-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-gold">{g.tag}</span>
                <strong className="text-base">{g.label}</strong>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}