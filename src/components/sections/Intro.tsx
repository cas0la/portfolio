import { Container } from '@/components/primitives/Container'
import { FadeIn } from '@/components/primitives/FadeIn'
import { Rich } from '@/components/primitives/Rich'
import { useLocale } from '@/lib/i18n'
import { copyFor } from '@/content'

/**
 * A fala em primeira pessoa que continua a abertura, com os números tecidos no
 * texto.
 *
 * Isto substituiu uma faixa de quatro métricas com divisórias. Aquele padrão é
 * o template de landing page de empresa, e o piso de craft do skill manda
 * recusá-lo. Os números continuam aqui, com a fonte do dado declarada, mas
 * ditos em vez de expostos num painel.
 */
export function Intro() {
  const { locale } = useLocale()
  const t = copyFor(locale)

  return (
    <section>
      <Container className="pb-[112px] md:pb-beat">
        <div className="measure-wide">
          {/* A margem vai no wrapper, não no <p>: cada parágrafo é filho único do
              seu FadeIn, então :first-child casaria em todos eles. */}
          {t.intro.paragraphs.map((para, i) => (
            <FadeIn
              key={para.slice(0, 24)}
              delay={i * 0.06}
              className={i === 0 ? undefined : 'mt-gap'}
            >
              <p className="text-[1.1875rem] leading-[1.7] text-ink-soft">
                <Rich text={para} />
              </p>
            </FadeIn>
          ))}

          <FadeIn delay={0.16}>
            <p className="mt-block text-body-sm text-ink-soft">{t.intro.source}</p>
          </FadeIn>
        </div>
      </Container>
    </section>
  )
}
