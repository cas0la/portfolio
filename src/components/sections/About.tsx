import { ImagePlus } from 'lucide-react'
import { Container } from '@/components/primitives/Container'
import { FadeIn } from '@/components/primitives/FadeIn'
import { Rich } from '@/components/primitives/Rich'
import { useLocale } from '@/lib/i18n'
import { copyFor } from '@/content'

/**
 * Sobre.
 *
 * Esta seção lia chapada porque optava por fora dos dois dispositivos mais fortes
 * do sistema: o display em peso cheio e o ponto final colorido. O título deixou de
 * ser a palavra genérica "Sobre mim" e passou a ser a própria afirmação, em escala
 * de display, promovida literalmente do parágrafo que já vivia aqui. A navegação
 * já rotula esta âncora como "Sobre", que é onde a palavra genérica fazia sentido.
 *
 * O layout mudou depois que o autor apontou que a experiência junto das fotos
 * estava desequilibrada, e pediu o template original como referência: três
 * colunas, um retrato principal e fotos de hobby.
 *
 * O que eu **não** copiei do template: lá cada bloco era um cartão com sombra, e
 * fileira de cartões iguais é justamente o que o DESIGN.md recusa. Aqui a coluna é
 * a estrutura e o fio de cabelo é a separação.
 *
 * Por que a história ficou fora da grade: dentro de uma coluna de um terço, o
 * parágrafo cai para cerca de 52 caracteres por linha, abaixo do piso de 65 a 75
 * que o corpo precisa para ler bem. Ela fica acima, em `measure`, e a grade abaixo
 * carrega o que é naturalmente estreito: retrato, lista de cargos, fotos e listas
 * curtas.
 *
 * As colunas têm alturas diferentes de propósito. É grade editorial, alinhada pelo
 * topo, não fileira de cartões de mesma altura.
 */

/**
 * Espaço de foto que se assume espaço de foto. Enquanto o arquivo não existe, diz
 * em primeira pessoa o que vai entrar ali. Sem foto de banco de imagens no lugar,
 * e sem caminho de arquivo na tela: a instrução de onde soltar o arquivo vive no
 * comentário do conteúdo, não na página.
 */
function PhotoSlot({
  photo,
  pending,
  ratio,
}: {
  photo?: { src: string; alt: string }
  pending: string
  ratio: string
}) {
  if (photo) {
    return (
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        className={`${ratio} w-full rounded-lg object-cover`}
      />
    )
  }

  /*
   * Sem arquivo, o espaço não reserva a proporção final: vira uma linha com ícone
   * e a frase. Reservando 4:5 e 4:3 de verdade, esta seção sozinha punha mais de
   * uma tela de telefone de cinza na página, e a seção cujo assunto é a pessoa
   * ficava sendo a mais vazia do site.
   */
  return (
    <div className="flex w-full items-center gap-3 rounded-lg bg-surface-soft px-gap py-5">
      <ImagePlus className="size-5 shrink-0 text-hairline-strong" aria-hidden />
      <p className="text-body-sm text-ink-soft">{pending}</p>
    </div>
  )
}

/**
 * Lista curta separada por ponto. Ferramentas e idiomas usam a mesma, porque são
 * a mesma coisa: item curto que quebra linha sozinho. O ponto é decorativo e sai
 * da árvore de acessibilidade, então o leitor de tela ouve a lista, não os pontos.
 */
function DotList({
  label,
  items,
  note,
}: {
  label: string
  items: string[]
  note?: string
}) {
  return (
    <div>
      <h3 className="label text-ink-soft">{label}</h3>
      <ul className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-body-sm text-ink">
        {items.map((item, i) => (
          <li key={item} className="flex items-center gap-2.5">
            <span>{item}</span>
            {i < items.length - 1 && (
              <span aria-hidden className="text-hairline-strong">
                ·
              </span>
            )}
          </li>
        ))}
      </ul>
      {note && <p className="mt-2 text-body-sm text-ink-soft">{note}</p>}
    </div>
  )
}

export function About() {
  const { locale } = useLocale()
  const t = copyFor(locale)
  const hobbies = t.inventory.hobbies ?? []

  return (
    <section id="about" className="scroll-mt-16 pb-[112px] md:pb-beat">
      <Container>
        {/*
         * O ponto final colorido é a assinatura do sistema, herdada do hero. Aqui
         * ele é roxo, que é a cor de elemento pequeno.
         *
         * Duas correções nesta frase. Ela estava em `text-display`, o maior corpo
         * do site, maior que o título dos Cases e maior que o nome do produto que
         * ele conduziu, para uma afirmação de capacidade. E o texto repetia quase
         * literal o primeiro parágrafo da segunda dobra, que existia na época e foi
         * removida depois. Agora ela está em `text-h1` e diz
         * o assunto real desta seção, promovido do parágrafo logo abaixo, que é a
         * regra: a frase sai do texto da seção, nunca é afirmação nova.
         */}
        <FadeIn>
          <h2 className="measure-wide text-h1 font-extrabold text-ink">
            {t.inventory.statement}
            <span className="text-violet">.</span>
          </h2>
        </FadeIn>

        <FadeIn delay={0.06}>
          <div className="measure mt-block flex flex-col gap-gap lg:mt-[72px]">
            {t.inventory.story.map((para) => (
              <p key={para.slice(0, 24)} className="text-body text-ink-soft">
                <Rich text={para} />
              </p>
            ))}
          </div>
        </FadeIn>

        <div className="mt-block grid gap-block md:grid-cols-2 lg:mt-[72px] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.2fr)_minmax(0,0.85fr)]">
          {/* Retrato principal */}
          <FadeIn delay={0.1}>
            <PhotoSlot
              photo={t.inventory.portrait}
              pending={t.inventory.portraitPending}
              ratio="aspect-[4/5]"
            />
          </FadeIn>

          {/* Experiência */}
          <FadeIn delay={0.16}>
            <h3 className="label text-ink-soft">{t.inventory.experienceLabel}</h3>
            <ul className="mt-3.5 flex flex-col border-t border-hairline">
              {t.inventory.rows.map((row) => (
                <li
                  key={`${row.role}-${row.org}`}
                  className="flex items-baseline gap-gap border-b border-hairline py-3.5"
                >
                  <span className="label w-12 shrink-0 pt-0.5 text-violet">{row.when}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-h3 font-semibold text-ink">{row.role}</span>
                    <span className="block text-body-sm text-ink-soft">{row.org}</span>
                  </span>
                  <span className="tnum shrink-0 text-body-sm text-ink-soft">{row.span}</span>
                </li>
              ))}
            </ul>
          </FadeIn>

          {/* Fotos fora do trabalho */}
          <FadeIn delay={0.22}>
            <h3 className="label text-ink-soft">{t.inventory.photosLabel}</h3>
            <div className="mt-3.5 flex flex-col gap-gap">
              {/* Dois espaços porque duas fotos já contam que há vida fora do
                  trabalho sem virar galeria. O retrato é o principal; estas são
                  as adicionais. */}
              {t.inventory.photosPending.map((pending, i) => (
                <PhotoSlot
                  key={pending}
                  photo={hobbies[i]}
                  pending={pending}
                  ratio="aspect-[4/3]"
                />
              ))}
            </div>
          </FadeIn>
        </div>

        {/*
         * Ferramentas e idiomas fecham a seção numa faixa horizontal.
         *
         * Ferramentas estava sozinha no pé de uma coluna e ficava órfã: rótulo
         * pequeno e uma linha de texto pendurados embaixo de um bloco alto. As duas
         * são listas curtas do mesmo tipo, credencial em vez de narrativa, então
         * pertencem ao mesmo lugar. Idiomas deixou de ser frase corrida e passou ao
         * tratamento de item separado por ponto, igual a ferramentas, porque duas
         * listas irmãs com desenho diferente na mesma faixa não têm justificativa.
         */}
        <FadeIn delay={0.28}>
          <div className="mt-block grid gap-block border-t border-hairline pt-block md:grid-cols-2 lg:mt-[72px] lg:grid-cols-3">
            <DotList label={t.inventory.toolsLabel} items={t.inventory.tools} />
            <DotList
              label={t.inventory.dataLabel}
              items={t.inventory.data}
              note={t.inventory.dataNote}
            />
            <DotList label={t.inventory.languagesLabel} items={t.inventory.languages} />
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
