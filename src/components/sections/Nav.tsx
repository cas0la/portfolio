import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
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
 * Um item do menu, que muda de natureza conforme a rota.
 *
 * Na home as seções existem na página, então o link é âncora crua e quem faz a
 * rolagem suave é o Lenis, que trata `#` sozinho (`anchors: true`).
 *
 * Fora da home a mesma seção está em **outro documento**, e âncora crua não teria
 * onde pousar. Aí vira `Link` do roteador para `/#seção`: a troca acontece sem
 * recarregar o site, e o `ScrollManager` leva até a seção depois que a home monta.
 *
 * O `motion` não entra aqui: quem anima é o painel do menu mobile, e ele passa o
 * `variants` no elemento que envolve este.
 */
function NavItem({
  hash,
  atHome,
  onNavigate,
  className,
  children,
}: {
  hash: string
  atHome: boolean
  onNavigate: () => void
  className: string
  children: ReactNode
}) {
  if (atHome) {
    return (
      <a href={hash} onClick={onNavigate} className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link to={`/${hash}`} onClick={onNavigate} className={className}>
      {children}
    </Link>
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
  const barRef = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const atHome = pathname === '/'

  // Trocar de rota com o menu aberto deixava o painel montado por cima da página
  // nova. Fechar aqui cobre também o botão de voltar do navegador, que não passa
  // pelo `onClick` de link nenhum.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  /*
   * Publica a altura real do cabeçalho em `--header-h`, que é de onde saem o
   * `scroll-margin-top` das seções e a altura do hero.
   *
   * O cabeçalho é a única coisa que sabe quanto ele mede, e antes ninguém
   * perguntava: as seções chumbavam 64px e o hero chumbava 72px, os dois
   * discordando da barra de verdade. Era isso que fazia a seção grudar embaixo do
   * cabeçalho ao chegar pela âncora do menu.
   *
   * `ResizeObserver` e não uma medida única: a barra muda de altura ao trocar de
   * idioma (os rótulos do menu têm comprimentos diferentes), ao cruzar o
   * breakpoint em que o botão de currículo sai, e quando o nome quebra em duas
   * linhas numa tela estreita.
   *
   * **O alvo é a barra, não o `<header>`.** O painel do menu mobile vive dentro do
   * mesmo `<header>`, então medir o elemento inteiro faria a altura saltar toda vez
   * que o menu abrisse, e com ela o ponto de parada de todas as âncoras da página.
   * O `ref` está num invólucro que contém só a barra.
   */
  useEffect(() => {
    const node = barRef.current
    if (!node) return

    const sync = () => {
      document.documentElement.style.setProperty('--header-h', `${node.offsetHeight}px`)
    }

    sync()
    const observer = new ResizeObserver(sync)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const links = [
    { label: t.nav.builds, hash: '#cases' },
    { label: t.nav.inventory, hash: '#about' },
    { label: t.nav.contact, hash: '#contact' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-page/85 backdrop-blur-md">
      {/* Toda rota carrega um `id="top"` na primeira seção, então o pulo de
          conteúdo continua sendo âncora crua em qualquer página. */}
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-gap focus:top-2 focus:z-50 focus:rounded-sm focus:bg-surface focus:px-3 focus:py-1.5 focus:text-body-sm focus:font-semibold focus:shadow-soft"
      >
        {t.nav.skipToContent}
      </a>

      {/* O invólucro existe para o `ResizeObserver` ter um alvo que é só a barra.
          Medir o `<header>` incluiria o painel do menu mobile, que é filho dele. */}
      <div ref={barRef}>
        <Container className="flex items-center justify-between gap-gap py-4">
          <NavItem
            hash="#top"
            atHome={atHome}
            onNavigate={close}
            className="brand-sweep whitespace-nowrap font-display text-body-sm font-extrabold tracking-tight sm:text-h3"
          >
            Lucas Casanova
          </NavItem>

          {/*
           * O espaçamento entre os três grupos do lado direito: links, seletor de
           * idioma e currículo.
           *
           * Era `gap-2.5`, 10px, e o autor apontou que ficava grudado. **A causa é
           * hierárquica, não de gosto:** os links do menu têm 24px entre si, então
           * com 10px a separação *entre grupos* era menor que a separação *dentro*
           * de um grupo, e os cinco alvos liam como uma fileira só.
           *
           * Agora cresce com a largura: 8px no telefone, onde a barra tem 375px e
           * não sobra folga; 24px a partir de `md`, que empata com o intervalo dos
           * links; e 32px a partir de `lg`, onde a separação entre grupos passa a
           * ser maior que a interna, que é o que faz eles lerem como três coisas.
           *
           * Os três valores estão na grade de 8px. O `py` da barra entrou junto:
           * era `py-3.5`, 14px, um dos valores que o DESIGN.md proíbe.
           */}
          <div className="flex items-center gap-2 md:gap-gap lg:gap-8">
            <nav className="hidden items-center gap-gap md:flex">
              {links.map((l) => (
                <NavItem
                  key={l.hash}
                  hash={l.hash}
                  atHome={atHome}
                  onNavigate={close}
                  className="text-body-sm font-medium text-ink-soft transition-colors hover:text-royal"
                >
                  {l.label}
                </NavItem>
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
      </div>

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
                {/* O invólucro `motion.div` existe porque o item agora pode ser um
                    `Link` do roteador, e `motion.a` animaria a tag errada. A
                    animação é do item, não do elemento clicável. */}
                {links.map((l) => (
                  <motion.div key={l.hash} variants={itemV}>
                    <NavItem
                      hash={l.hash}
                      atHome={atHome}
                      onNavigate={close}
                      className="block rounded-sm px-3 py-3 text-h3 font-semibold text-ink transition-colors hover:bg-page"
                    >
                      {l.label}
                    </NavItem>
                  </motion.div>
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
