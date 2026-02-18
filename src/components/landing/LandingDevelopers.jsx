import { useEffect, useRef } from 'react'
import { Bookmark, Mail, MessageSquare } from 'lucide-react'

const developers = [
  {
    name: 'SEENIVASAN VENKATESAN',
    email: 'seenivasan@renterz.dev',
    image: 'https://ui-avatars.com/api/?name=Seenivasan+Venkatesan&background=0f766e&color=ffffff&size=256',
  },
  {
    name: 'PRASANTH KUMAR',
    email: 'prasanth@renterz.dev',
    image: 'https://ui-avatars.com/api/?name=Prasanth+Kumar&background=1d4ed8&color=ffffff&size=256',
  },
  {
    name: 'AKSHAYA RAJASEKAR',
    email: 'akshaya@renterz.dev',
    image: 'https://ui-avatars.com/api/?name=Akshaya+Rajasekar&background=7c3aed&color=ffffff&size=256',
  },
  {
    name: 'ANUSHA',
    email: 'anusha@renterz.dev',
    image: 'https://ui-avatars.com/api/?name=Anusha&background=be123c&color=ffffff&size=256',
  },
]

export default function LandingDevelopers() {
  const cardRefs = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    )

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="mt-6">
      <h3 className="text-2xl font-bold">Developer Team</h3>
      <p className="mt-2 text-sm text-soft">Contact points for implementation, API onboarding, and UI customization.</p>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {developers.map((dev, index) => (
          <article
            key={dev.name}
            ref={(el) => {
              cardRefs.current[index] = el
            }}
            className="developer-card-reveal group relative overflow-hidden rounded-[24px] border border-base bg-transparent shadow-[0_24px_60px_rgba(15,23,42,0.12)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(15,23,42,0.2)]"
            style={{ '--reveal-delay': `${index * 90}ms` }}
          >
            <div className="relative overflow-hidden rounded-[24px]">
              <img
                src={dev.image}
                alt={dev.name}
                className="h-[360px] w-full object-cover transition duration-500 ease-out group-hover:scale-105"
                loading="lazy"
              />

              <button
                type="button"
                aria-label={`Save ${dev.name}`}
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/40"
              >
                <Bookmark size={16} />
              </button>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-4 pb-4 pt-16 text-white transition duration-300 ease-out group-hover:pb-5">
                <h4 className="text-lg font-semibold leading-tight">{dev.name}</h4>
                <div className="mt-4 flex items-center gap-2">
                  <a
                    href={`mailto:${dev.email}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-[var(--primary)] py-2.5 text-sm font-semibold text-white transition hover:bg-[#7160b8]"
                  >
                    <Mail size={14} />
                    Get In Touch
                  </a>
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[var(--primary-soft)] text-white backdrop-blur-sm transition hover:bg-[var(--primary)]"
                    aria-label={`Message ${dev.name}`}
                  >
                    <MessageSquare size={16} />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
