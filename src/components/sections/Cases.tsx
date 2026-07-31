import type { ReactNode } from 'react'
import { ArrowRight, ArrowUpRight, Image as ImageIcon } from 'lucide-react'
import { Container } from '@/components/primitives/Container'
import { FadeIn } from '@/components/primitives/FadeIn'
import { RoleByline, OpenNote, Pill, StatPill } from '@/components/primitives/Ui'
import { CaseCover } from '@/components/CaseCover'
import { EvolutionPanel } from '@/components/EvolutionPanel'
import { useLocale } from '@/lib/i18n'
import { copyFor, type Build } from '@/content'

/*
 * Os cases, com capa. As capas serão imagens feitas pelo Lucas; até os arquivos
 * existirem, cada case mostra placeholder (ver CaseCover.tsx).
 *
 * A seção perdeu as divisórias: sem fio fechando bloco e sem faixa de fundo
 * alternada, a página lê como um scroll contínuo em vez de caixas empilhadas.
 */

/**
 * A abertura do case principal.
 *
 * **A capa em imagem saiu.** Ela era um JPEG de 2100x640 composto fora do site, e
 * no telefone encolhia para cerca de 104px de altura, onde as cinco estações da
 * cronologia viravam borrão. No lugar entrou o `EvolutionPanel`, que é a mesma
 * peça em HTML e reflui para vertical. Ver o comentário lá para o que a troca
 * custou.
 *
 * O `cover` continua existindo no tipo `Build` e continua servindo aos cases
 * secundários, que usam `CaseCover` em 16:10. Só o destaque tem painel.
 */
function MainOpening({ build }: { build: Build }) {
  if (build.milestones) return <EvolutionPanel milestones={build.milestones} />
  if (build.cover) return <CaseCover build={build} />

  return (
    <div className="grid aspect-[2100/640] w-full place-items-center rounded-lg bg-ink">
      <ImageIcon className="size-8 text-white/25" aria-hidden />
    </div>
  )
}

/** Uma fileira de cápsulas com rótulo. */
function PillRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="label text-ink-soft">{label}</h4>
      <ul className="mt-4 flex flex-wrap gap-2 text-body-sm text-ink">{children}</ul>
    </div>
  )
}

/**
 * Case principal: capa de destaque com o título, as cápsulas de papel e de
 * resultado, três linhas de texto e o botão para a página interna.
 *
 * **Os módulos saíram daqui.** Eles eram três blocos com número grande, e no
 * desenho que o autor pediu esse trabalho passou para as cápsulas de destaque, que
 * dizem o mesmo em uma fileira. Manter os dois seria dar duas vezes a mesma prova
 * e alongar de novo o bloco que ele quer curto. Os `pieces` continuam no conteúdo,
 * intactos, esperando a página interna — que é onde um módulo pode ser explicado
 * em vez de anunciado.
 *
 * **A nota de pendência também saiu daqui**, pela mesma lógica: ela promete a
 * decisão e o custo, e agora existe um botão que leva exatamente a isso. Nota de
 * "ainda falta" logo acima do botão que resolve a falta é ruído.
 */
function MainCase({ build }: { build: Build }) {
  const { locale } = useLocale()
  const t = copyFor(locale)

  return (
    <article>
      {/*
       * O título antes da faixa, e este é o terceiro lugar em que ele mora.
       *
       * Primeiro ele ficou **dentro** da capa, sob um véu, e saiu porque o véu
       * disputava com a arte e no telefone ficava ilegível. Depois foi para
       * **debaixo** da faixa, e o autor apontou o que estava errado nisso: o
       * painel é a prova, e ela chegava antes do assunto. Quem lê encontrava cinco
       * marcos datados de um produto que ainda não tinha nome.
       *
       * Em cima resolve os dois problemas de uma vez. O título fica em texto de
       * verdade, sem véu e sem aposta na imagem, e a faixa passa a responder a uma
       * pergunta que já foi feita em vez de abrir uma.
       *
       * `.case-scrim` continua removida do CSS. Não recriar.
       */}
      <div>
        <RoleByline>{build.tag}</RoleByline>
        <h3 className="mt-3 text-display font-extrabold text-ink">{build.name}</h3>
        {build.org && <p className="mt-1 text-h3 text-ink-soft">{build.org}</p>}
      </div>

      <div className="mt-gap">
        <MainOpening build={build} />
      </div>

      <div className="mt-block grid gap-block lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-x-[72px]">
        <div className="flex flex-col gap-gap">
          {build.roles && (
            <PillRow label={t.builds.rolesLabel}>
              {build.roles.map((role) => (
                <Pill key={role}>{role}</Pill>
              ))}
            </PillRow>
          )}

          {build.highlights && (
            <PillRow label={t.builds.highlightsLabel}>
              {build.highlights.map((item) => (
                <StatPill
                  key={item.value}
                  value={item.value}
                  label={item.label}
                  measured={item.measured}
                />
              ))}
            </PillRow>
          )}
        </div>

        {/* O texto e o botão numa coluna só, e o botão logo abaixo das três
            linhas: o convite tem que estar no fim da leitura que o motiva. */}
        <div>
          <p className="text-body-lead text-ink">{build.body}</p>
          {build.page && <CaseCta href={build.page}>{t.builds.openFull}</CaseCta>}
        </div>
      </div>
    </article>
  )
}

/**
 * O gatilho do case: rótulo em escala de título e um fio que troca de lugar no
 * hover. O movimento inteiro vive em `.case-underline`, onde está comentado.
 *
 * Era um botão royal chapado de 56px, e o autor pediu algo mais atrativo e menos
 * pesado. **A força saiu do preenchimento e foi para o corpo do texto:** em
 * `text-h2` peso 800 e royal cheio, o gatilho continua sendo o elemento mais alto
 * da coluna sem precisar de um retângulo de cor.
 *
 * O fio é do elemento inteiro e passa por baixo do rótulo **e** da seta. Passando
 * só sob o texto, ele terminaria antes da seta e o conjunto leria como duas coisas
 * soltas em vez de um alvo só.
 *
 * `tap-h` porque em tela de toque um link de texto não tem altura própria: sem ele
 * o alvo seria a caixa da linha, cerca de 30px, abaixo do piso de 44.
 */
function CaseCta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="group tap-h mt-block inline-flex items-center text-h2 font-extrabold text-royal"
    >
      <span className="case-underline inline-flex items-center gap-3 pb-2">
        {children}
        <ArrowRight
          className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden
        />
      </span>
    </a>
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
            {build.org && (
              <span className="font-normal text-ink-soft"> · {build.org}</span>
            )}
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
            liam como seções soltas.

            O intervalo cresceu em 31/07/2026, a pedido do autor: 72→96 no telefone
            e 96→144 acima de `md`. O case principal ganhou altura nesta rodada
            (título acima da faixa, sete cápsulas, parágrafo maior), e a folga que
            bastava para o bloco anterior deixou os cases seguintes encostados nele.
            **144px continua abaixo de `beat`**, então a separação cresce sem que o
            grupo se parta em duas seções, que é o erro que o comentário acima
            registra. Múltiplo de 8, pela regra de escala. */}
        <div className="mt-section grid gap-x-block gap-y-[72px] md:mt-36 md:grid-cols-2 md:gap-y-section">
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
