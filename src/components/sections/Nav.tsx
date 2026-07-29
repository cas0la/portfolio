import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'motion/react'
import { Container } from '@/components/primitives/Container'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: "Let's talk", href: '#contact' },
]

const EASE = [0.16, 1, 0.3, 1] as const

// Cascata leve dos itens do menu ao abrir.
const itemV: Variants = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0 },
}

// Uma barrinha do hambúrguer (posição base via `top`, animação só via transform
// pra não conflitar). As duas convergem pro centro e giram formando o X.
function Bar({ open, base, openY, openRot }: {
  open: boolean
  base: string
  openY: number
  openRot: number
}) {
  return (
    <motion.span
      aria-hidden
      className="absolute left-0 h-[2px] w-5 rounded-full bg-current"
      style={{ top: base }}
      initial={false}
      animate={open ? { y: openY, rotate: openRot } : { y: 0, rotate: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    />
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="relative z-50">
      <Container className="flex items-center justify-between py-6">
        <a
          href="#top"
          onClick={close}
          className="font-display text-xl leading-none tracking-tight text-ink"
        >
          Your Name
        </a>

        {/* Desktop: links inline */}
        <nav className="hidden items-center gap-6 sm:flex sm:gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/resume.pdf"
            download
            className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Résumé
          </a>
        </nav>

        {/* Mobile: hambúrguer animado (morfa pra X) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="inline-flex size-10 items-center justify-center rounded-pill text-ink transition-colors hover:bg-paper-sunken sm:hidden"
        >
          <span aria-hidden className="relative block h-4 w-5">
            <Bar open={open} base="4px" openY={3} openRot={45} />
            <Bar open={open} base="10px" openY={-3} openRot={-45} />
          </span>
        </button>
      </Container>

      {/* Mobile: painel que desce do topo, com fade + slide */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="absolute inset-x-0 top-full sm:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.26, ease: EASE }}
          >
            <Container>
              <motion.div
                className="mb-2 flex flex-col rounded-card border border-line bg-paper-raised p-2 shadow-[0_12px_34px_-14px_rgba(14,20,16,0.28)]"
                initial="hidden"
                animate="show"
                variants={{
                  show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
                }}
              >
                {links.map((l) => (
                  <motion.a
                    key={l.href}
                    variants={itemV}
                    href={l.href}
                    onClick={close}
                    className="rounded-xl px-4 py-3 text-base font-medium text-ink transition-colors hover:bg-paper-sunken"
                  >
                    {l.label}
                  </motion.a>
                ))}
                <motion.a
                  variants={itemV}
                  href="/resume.pdf"
                  download
                  onClick={close}
                  className="rounded-xl px-4 py-3 text-base font-medium text-ink-muted transition-colors hover:bg-paper-sunken"
                >
                  Résumé
                </motion.a>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
