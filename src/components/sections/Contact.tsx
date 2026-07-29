import { useState } from 'react'
import { Copy, Check, Download } from 'lucide-react'
import { Container } from '@/components/primitives/Container'
import { FadeIn } from '@/components/primitives/FadeIn'
import { socials } from '@/lib/socials'

const EMAIL = 'you@example.com'

function CopyEmail() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      // navegadores sem clipboard API: ignora, mantém o feedback visual
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Email copied' : `Copy ${EMAIL}`}
      className="group inline-flex items-center gap-3 font-display text-h2 text-ink transition-colors hover:text-forest"
    >
      {EMAIL}
      <span
        className={`inline-flex size-9 shrink-0 items-center justify-center rounded-pill border transition-colors ${
          copied
            ? 'border-lime bg-lime text-lime-ink'
            : 'border-line-strong text-ink-muted group-hover:border-forest group-hover:text-forest'
        }`}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </span>
    </button>
  )
}

export function Contact() {
  return (
    <footer id="contact" className="scroll-mt-20 py-20 md:py-32">
      <Container>
        <FadeIn>
          <span className="label !text-ink-subtle">Contact</span>
          <h2 className="mt-6 max-w-xl text-balance font-display text-h1 text-ink">
            Let's build something that feels right.
          </h2>
          <p className="mt-5 max-w-xl text-body-lg text-ink-muted">
            Open to product and UI design projects.
          </p>
          <a
            href="/resume.pdf"
            download
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-pill border border-line-strong px-6 text-sm font-semibold text-ink transition-colors hover:bg-paper-sunken"
          >
            Download résumé
            <Download className="size-4" />
          </a>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="mt-10">
            <CopyEmail />
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="mt-12 flex flex-wrap items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
                className="inline-flex size-11 items-center justify-center rounded-pill border border-line text-ink-muted transition-colors hover:border-forest hover:text-forest"
              >
                <svg
                  viewBox="0 0 24 24"
                  role="img"
                  aria-hidden
                  className="size-5 fill-current"
                >
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </FadeIn>

        <div className="mt-20 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="label !text-ink-subtle">© 2026 Your Name</span>
          <span className="label !text-ink-subtle">
            Imagined by me, coded by AI.
          </span>
        </div>
      </Container>
    </footer>
  )
}
