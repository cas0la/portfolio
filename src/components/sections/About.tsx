import { useState, type ReactNode } from 'react'
import { Mail, Check } from 'lucide-react'
import { Container } from '@/components/primitives/Container'
import { FadeIn } from '@/components/primitives/FadeIn'
import { tools } from '@/lib/tools'
import { socials } from '@/lib/socials'
import { PhotoCarousel } from '@/components/PhotoCarousel'

// Sua experiência. Sem datas, só Now/Prev. Adicione ou remova itens à vontade.
const experience = [
  { period: 'Now', role: 'Your Role', company: 'Current Company' },
  { period: 'Prev.', role: 'Previous Role', company: 'Previous Company' },
  { period: 'Prev.', role: 'Earlier Role', company: 'Earlier Company' },
]

// Fotos "off the clock". Coloque as suas em /public/assets/off e liste aqui.
const offClockPhotos = [
  '/assets/off/off-1.svg',
  '/assets/off/off-2.svg',
  '/assets/off/off-3.svg',
]

const EMAIL = 'you@example.com'

// Botão de e-mail com copy-to-clipboard: clica, copia, e o ícone vira check
// com preenchimento do accent, reseta em 1.8s.
function CopyEmailIcon() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      // navegadores sem clipboard API: mantém só o feedback visual
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Email copied' : `Copy ${EMAIL}`}
      title="Email"
      className={`inline-flex size-9 items-center justify-center rounded-pill border transition-colors ${
        copied
          ? 'border-lime bg-lime text-lime-ink'
          : 'border-line text-ink-muted hover:border-forest hover:text-forest'
      }`}
    >
      {copied ? <Check className="size-4" /> : <Mail className="size-4" />}
    </button>
  )
}

function Card({
  label,
  className = '',
  children,
}: {
  label?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={`rounded-card bg-paper-raised p-6 shadow-[0_2px_12px_-8px_rgba(14,20,16,0.18)] ${className}`}
    >
      {label && <span className="label mb-4 block !text-ink-subtle">{label}</span>}
      {children}
    </div>
  )
}

export function About() {
  return (
    <section id="about" className="scroll-mt-24 py-20 md:py-28">
      <Container>
        <FadeIn>
          <span className="label !text-ink-subtle">About</span>
        </FadeIn>

        <div className="mt-6 grid items-stretch gap-4 md:grid-cols-3">
          {/* Esquerda — textos (background preenche até a base) */}
          <FadeIn className="flex flex-col gap-4">
            <Card>
              <h2 className="font-display text-h2 leading-[0.95] text-ink">
                A bit about me.
              </h2>
              <p className="mt-4 text-ink-muted">
                A short introduction. Say who you are, what you do, and the kind
                of work you care about the most.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="inline-flex size-9 items-center justify-center rounded-pill border border-line text-ink-muted transition-colors hover:border-forest hover:text-forest"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      role="img"
                      aria-hidden
                      className="size-4 fill-current"
                    >
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
                <CopyEmailIcon />
              </div>
            </Card>

            <Card
              label="My background"
              className="flex flex-1 flex-col justify-center"
            >
              <div className="space-y-4 text-ink-muted">
                <p>
                  This is your story. Share how you got into your work, the path
                  that led you here, and what keeps you going. Keep it personal
                  and honest, it is what makes a portfolio memorable.
                </p>
                <p>
                  Talk about your craft, your process, or the kind of problems
                  you love solving. A couple of short paragraphs is plenty.
                </p>
              </div>
            </Card>
          </FadeIn>

          {/* Centro — foto preenche o topo, tool stack na base */}
          <FadeIn className="flex flex-col gap-4" delay={0.06}>
            <div className="relative min-h-[340px] flex-1 overflow-hidden rounded-card bg-paper-sunken shadow-[0_2px_12px_-8px_rgba(14,20,16,0.18)]">
              <img
                src="/assets/portrait-placeholder.svg"
                alt="Your photo"
                className="absolute inset-0 size-full object-cover"
              />
              <div className="absolute inset-x-4 bottom-4 flex flex-col items-start gap-2">
                <span className="rounded-pill bg-paper-raised/90 px-3 py-1.5 text-sm text-ink shadow-sm backdrop-blur">
                  Hi! 👋
                </span>
                <span className="rounded-pill bg-paper-raised/90 px-3 py-1.5 text-sm text-ink shadow-sm backdrop-blur">
                  I'm Your Name
                </span>
                <span className="rounded-pill bg-lime px-3 py-1.5 text-sm font-medium text-lime-ink shadow-sm">
                  Let's build something ✌️
                </span>
              </div>
            </div>

            <Card label="Tool stack">
              <div className="flex flex-wrap gap-3">
                {tools.map((t) => (
                  <div key={t.name} className="group relative">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-ink">
                      <svg
                        viewBox="0 0 24 24"
                        role="img"
                        aria-label={t.name}
                        className="size-6 fill-white"
                      >
                        <path d={t.path} />
                      </svg>
                    </div>
                    {/* balãozinho com o nome, sobe no hover */}
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-pill bg-ink px-2.5 py-1 text-xs font-medium text-paper opacity-0 shadow-sm transition-all duration-200 group-hover:-translate-x-1/2 group-hover:translate-y-0 group-hover:opacity-100">
                      {t.name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </FadeIn>

          {/* Direita — experiência no topo, carrossel de fotos até a base */}
          <FadeIn className="flex flex-col gap-4" delay={0.12}>
            <Card label="Experience">
              <ul className="flex flex-col gap-5">
                {experience.map((e) => (
                  <li key={e.role}>
                    <span className="label !text-ink-subtle">{e.period}</span>
                    <p className="mt-1 text-ink">{e.role}</p>
                    <p className="text-sm text-ink-muted">{e.company}</p>
                  </li>
                ))}
              </ul>
            </Card>

            <Card label="Off the clock" className="flex flex-1 flex-col">
              <PhotoCarousel photos={offClockPhotos} />
            </Card>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}
