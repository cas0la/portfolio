import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'motion/react'
import { Download } from 'lucide-react'
import { Container } from '@/components/primitives/Container'
import { LangPlate } from '@/components/LangPlate'
import { useLocale } from '@/lib/i18n'
import { copyFor } from '@/content'

const EASE = [0.22, 1, 0.36, 1] as const

const itemV: Variants = {
  hidden: { opacity: 0, y: -6 },
  show: { opacity: 1, y: 0 },
}

/** Uma barra do hambúrguer. As duas convergem e giram formando o X. */
function Bar({
  open,
  base,
  openY,
  openRot,
}: {
  open: boolean
  base: string
  openY: number
  openRot: number
}) {
  return (
    <motion.span
      aria-hidden
      className="absolute left-0 h-[1.5px] w-4 rounded-full bg-current"
      style={{ top: base }}
      initial={false}
      animate={open ? { y: openY, rotate: openRot } : { y: 0, rotate: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    />
  )
}

/**
 * Cabeçalho. O menu é o de menos: o que importa é o botão de currículo e o
 * seletor de idioma, e os dois ficam visíveis em qualquer largura, fora do
 * hambúrguer.
 */
export function Nav() {
  const [open, setOpen] = useState(false)
  const { locale } = useLocale()
  const t = copyFor(locale)
  const close = () => setOpen(false)

  const links = [
    { label: t.nav.builds, href: '#cases' },
    { label: t.nav.inventory, href: '#about' },
    { label: t.nav.contact, href: '#contact' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-page/85 backdrop-blur-md">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-gap focus:top-2 focus:z-50 focus:rounded-sm focus:bg-surface focus:px-3 focus:py-1.5 focus:text-body-sm focus:font-semibold focus:shadow-soft"
      >
        {t.nav.skipToContent}
      </a>

      <Container className="flex items-center justify-between gap-gap py-3.5">
        <a
          href="#top"
          onClick={close}
          className="whitespace-nowrap font-display text-body-sm font-extrabold tracking-tight text-ink sm:text-h3"
        >
          Lucas Casanova
        </a>

        <div className="flex items-center gap-2.5">
          <nav className="hidden items-center gap-gap md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-body-sm font-medium text-ink-soft transition-colors hover:text-royal"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <LangPlate />

          <a
            href={t.nav.resumeFile}
            download
            className="hidden h-9 items-center gap-2 rounded-pill border border-hairline-strong bg-surface px-3.5 text-body-sm font-semibold text-ink transition-colors hover:border-royal hover:text-royal sm:inline-flex"
          >
            <Download className="size-4" aria-hidden />
            {t.nav.resume}
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="tap inline-flex size-9 items-center justify-center rounded-pill border border-hairline text-ink transition-colors hover:border-hairline-strong md:hidden"
          >
            <span aria-hidden className="relative block h-3.5 w-4">
              <Bar open={open} base="3px" openY={3} openRot={45} />
              <Bar open={open} base="9px" openY={-3} openRot={-45} />
            </span>
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="absolute inset-x-0 top-full md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: EASE }}
          >
            <Container>
              <motion.div
                className="mb-2 flex flex-col rounded-lg border border-hairline bg-surface p-2 shadow-soft"
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
                    className="rounded-sm px-3 py-3 text-h3 font-semibold text-ink transition-colors hover:bg-page"
                  >
                    {l.label}
                  </motion.a>
                ))}
                <motion.a
                  variants={itemV}
                  href={t.nav.resumeFile}
                  download
                  onClick={close}
                  className="flex items-center gap-2 rounded-sm px-3 py-3 text-h3 font-semibold text-royal transition-colors hover:bg-royal-wash"
                >
                  <Download className="size-4" aria-hidden />
                  {t.nav.resume}
                </motion.a>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
