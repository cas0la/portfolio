import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { Container } from '@/components/primitives/Container'
import { useLocale } from '@/lib/i18n'
import { copyFor } from '@/content'

/**
 * Rota que não existe.
 *
 * Ela é curta de propósito. Página de erro que tenta ser útil — busca, lista de
 * links, ilustração — é página de erro que finge que o erro não aconteceu. Aqui a
 * pessoa precisa de duas coisas: saber que o endereço está errado e ter uma porta
 * de volta.
 *
 * `id="top"` porque o pulo de conteúdo do cabeçalho aponta para `#top` em toda
 * rota, e sem ele o link do teclado morreria justo em quem mais precisa dele.
 */
export function NotFound() {
  const { locale } = useLocale()
  const t = copyFor(locale)

  return (
    <section id="top" className="scroll-anchor pb-beat pt-section">
      <Container>
        <h1 className="measure text-h1 font-extrabold text-ink">
          {t.casePage.notFoundTitle}
        </h1>
        <p className="measure mt-3 text-body text-ink-soft">{t.casePage.notFoundBody}</p>
        <Link
          to="/"
          className="group tap-h mt-block inline-flex items-center gap-2 text-h3 font-bold text-royal"
        >
          <ArrowLeft
            className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1"
            aria-hidden
          />
          <span className="case-underline pb-1">{t.casePage.notFoundCta}</span>
        </Link>
      </Container>
    </section>
  )
}
