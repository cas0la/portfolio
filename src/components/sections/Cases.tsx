import { ArrowUpRight } from 'lucide-react'
import { Container } from '@/components/primitives/Container'
import { FadeIn } from '@/components/primitives/FadeIn'
import { RoleByline, OpenNote } from '@/components/primitives/Ui'
import { CaseCover } from '@/components/CaseCover'
import { Rich } from '@/components/primitives/Rich'
import { useLocale } from '@/lib/i18n'
import { copyFor, type Build } from '@/content'

/*
 * Os cases, com capa. As capas serão imagens feitas pelo Lucas; até os arquivos
 * existirem, cada case mostra placeholder (ver CaseCover.tsx).
 *
 * A seção perdeu as divisórias: sem fio fechando bloco e sem faixa de fundo
 * alternada, a página lê como um scroll contínuo em vez de caixas empilhadas.
 */

/** Case principal: capa grande em cima, e o texto com os módulos embaixo. */
function MainCase({ build }: { build: Build }) {
  const { locale } = useLocale()
  const t = copyFor(locale)

  return (
    <article>
      {/* Capa ao lado do texto, e não acima dele: em largura total a capa de
          16:10 passaria de 700px de altura e engoliria o primeiro viewport da
          seção. */}
      <div className="grid items-center gap-block lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <CaseCover build={build} />

        <div>
          <RoleByline>{build.tag}</RoleByline>
          <h3 className="mt-3 text-h1 font-extrabold text-ink">{build.name}</h3>
          {build.org && <p className="mt-1 text-h3 text-ink-soft">{build.org}</p>}
          <p className="mt-gap text-body text-ink-soft">{build.body}</p>
          {build.pending && (
            <div className="mt-gap">
              <OpenNote>{build.pending}</OpenNote>
            </div>
          )}
        </div>
      </div>

      {/* Os três módulos lado a lado, um por coluna: ocupa a largura toda e lê
          como uma linha de fatos em vez de lista estreita com metade vazia. */}
      <div className="mt-block">
        <h4 className="label text-ink-soft">{t.builds.piecesLabel}</h4>
        <ul className="mt-gap grid gap-gap sm:grid-cols-2 lg:grid-cols-3 lg:gap-block">
          {build.pieces?.map((piece) => (
            <li key={piece.name} className="border-t border-hairline pt-gap">
              {/* O número vem primeiro e grande: ele é a prova, e antes estava
                  apagado em corpo pequeno, o que deixava o texto dominar. */}
              {piece.count && (
                <p className="flex items-baseline gap-2">
                  <span className="tnum text-num font-extrabold text-royal">
                    {piece.count.value}
                  </span>
                  <span className="text-body-sm text-ink-soft">{piece.count.unit}</span>
                </p>
              )}
              <h5 className="mt-2.5 text-h3 font-semibold text-ink">{piece.name}</h5>
              <p className="mt-1.5 text-body-sm text-ink-soft">
                <Rich text={piece.detail} />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

/** Case secundário: capa, papel, título e uma linha. A capa é o que puxa o olho. */
function CaseCard({ build }: { build: Build }) {
  const { locale } = useLocale()
  const t = copyFor(locale)
  const linked = Boolean(build.href)

  const inner = (
    <>
      <CaseCover build={build} interactive={linked} />

      <div className="mt-gap">
        <RoleByline>{build.tag}</RoleByline>
        <h3 className="mt-2.5 flex items-start justify-between gap-3 text-h2 font-bold text-ink">
          <span className="min-w-0">
            <span className={linked ? 'underline-draw' : undefined}>{build.name}</span>
            {build.org && <span className="font-normal text-ink-soft"> · {build.org}</span>}
          </span>
          {linked && (
            <ArrowUpRight
              className="mt-1 size-5 shrink-0 text-royal transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          )}
        </h3>
        <p className="mt-2 text-body-sm text-ink-soft">{build.body}</p>
        {build.pending && (
          <div className="mt-3">
            <OpenNote>{build.pending}</OpenNote>
          </div>
        )}
      </div>
    </>
  )

  if (!linked) return <div>{inner}</div>

  return (
    <a
      href={build.href}
      target="_blank"
      rel="noreferrer"
      className="group block"
      aria-label={`${build.name}. ${t.builds.openCase} (${t.builds.newTab})`}
    >
      {inner}
    </a>
  )
}

export function Cases() {
  const { locale } = useLocale()
  const t = copyFor(locale)

  const main = t.builds.items.find((b) => b.tier === 'highlight')
  const rest = t.builds.items.filter((b) => b.tier !== 'highlight')

  return (
    <section id="cases" className="scroll-anchor pb-[112px] md:pb-beat">
      <Container>
        <FadeIn>
          <h2 className="text-h1 font-extrabold text-ink">{t.builds.title}</h2>
          <p className="measure mt-3 text-body text-ink-soft">{t.builds.lead}</p>
        </FadeIn>

        {main && (
          <FadeIn delay={0.06} className="mt-[56px] block md:mt-block">
            <MainCase build={main} />
          </FadeIn>
        )}

        {/* `beat` aqui era erro de escala: é o intervalo entre assuntos, e o case
            principal e os quatro seguintes são o mesmo assunto. Com ele os cases
            liam como seções soltas. `section` mantém a separação sem cortar o
            grupo. */}
        <div className="mt-[72px] grid gap-x-block gap-y-[72px] md:mt-section md:grid-cols-2 md:gap-y-section">
          {rest.map((build, i) => (
            <FadeIn key={build.id} delay={(i % 2) * 0.06}>
              <CaseCard build={build} />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  )
}
