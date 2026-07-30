import { useEffect, useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { Container } from '@/components/primitives/Container'
import { FadeIn } from '@/components/primitives/FadeIn'
import { Rich } from '@/components/primitives/Rich'
import { useLocale } from '@/lib/i18n'
import { copyFor } from '@/content'
import type { InventoryRow, Testimonial } from '@/content'

/**
 * Sobre.
 *
 * Esta seção lia chapada porque optava por fora dos dois dispositivos mais fortes
 * do sistema: o display em peso cheio e o ponto final colorido. O título deixou de
 * ser a palavra genérica "Sobre mim" e passou a ser a própria afirmação, em escala
 * de display, promovida literalmente do parágrafo que já vivia aqui. A navegação
 * já rotula esta âncora como "Sobre", que é onde a palavra genérica fazia sentido.
 *
 * Três blocos, na ordem que o autor pediu:
 *
 * 1. **Trajetória à esquerda, linha do tempo à direita**, no mesmo bloco. A prosa
 *    conta a migração de design para produto; a linha do tempo dá o mesmo percurso
 *    em dados, para quem prefere varrer a olho. São a mesma informação em dois
 *    formatos, lado a lado de propósito — o avaliador escolhe por qual entra.
 * 2. **Credenciais à esquerda, retrato ao centro, fotos à direita.** As três
 *    listas são credencial, não narrativa, e por isso ficam juntas numa coluna só.
 * 3. **Relatos de terceiros**, a subseção nova.
 *
 * O que eu **não** copiei do template original: lá cada bloco era um cartão com
 * sombra, e fileira de cartões iguais é justamente o que o DESIGN.md recusa. Aqui a
 * coluna é a estrutura e o fio de cabelo é a separação.
 *
 * A prosa fica em coluna de metade da página e não de um terço porque abaixo disso
 * ela cai para cerca de 52 caracteres por linha, abaixo do piso de 65 a 75 que o
 * corpo precisa. É por isso que o primeiro bloco tem duas colunas e o segundo tem
 * três: a largura vem do que cada conteúdo exige, não de uma grade fixa.
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
function DotList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <h3 className="label text-ink-soft">{label}</h3>
      <ul className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm text-ink">
        {items.map((item, i) => (
          <li key={item} className="flex items-center gap-2">
            <span>{item}</span>
            {i < items.length - 1 && (
              <span aria-hidden className="text-hairline-strong">
                ·
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Linha do tempo de experiência: o ano à esquerda e, à direita, três níveis de
 * informação empilhados — posição e nível, squad, empresa.
 *
 * A hierarquia é de peso e de cor, não de tamanho: `ink` em 600 no cargo, `ink`
 * normal no squad, `ink-soft` na empresa. Três corpos diferentes numa entrada de
 * quatro linhas faria cada item ler como um bloco próprio, e são seis deles.
 *
 * A etiqueta "Agora" fica no ano e não no cargo. Ela responde "quando", que é a
 * pergunta da coluna onde ela está.
 */
function Timeline({
  label,
  nowLabel,
  rows,
}: {
  label: string
  nowLabel: string
  rows: InventoryRow[]
}) {
  const listRef = useRef<HTMLOListElement>(null)
  const [atEnd, setAtEnd] = useState(false)

  /*
   * Diz se a rolagem chegou ao fim, para o esmaecido sair de cena.
   *
   * A margem de 2px absorve o arredondamento: em zoom não inteiro e em telas de
   * densidade fracionária, `scrollTop + clientHeight` fica meio pixel abaixo de
   * `scrollHeight` mesmo com a barra encostada embaixo, e sem a folga o esmaecido
   * nunca sairia.
   *
   * Uma lista que não rola conta como "no fim", e é isso que faz o esmaecido não
   * aparecer abaixo de `lg`, onde o CSS remove a altura máxima e não há rolagem.
   */
  function syncEnd() {
    const node = listRef.current
    if (!node) return
    setAtEnd(node.scrollHeight - node.scrollTop - node.clientHeight <= 2)
  }

  /* `ResizeObserver` e não só o evento de scroll: a lista muda de altura ao trocar
     de idioma e ao cruzar o breakpoint, e nos dois casos nenhum scroll acontece —
     sem isto, o esmaecido ficaria preso no estado da largura anterior. */
  useEffect(() => {
    const node = listRef.current
    if (!node) return
    syncEnd()
    const observer = new ResizeObserver(syncEnd)
    observer.observe(node)
    return () => observer.disconnect()
  }, [rows])

  return (
    <div>
      <h3 id="timeline-label" className="label text-ink-soft">
        {label}
      </h3>
      {/*
       * `tabIndex={0}` não é enfeite: uma região que rola e não contém nada
       * focável é inalcançável pelo teclado sem ele, e aí quem navega sem mouse
       * simplesmente não vê os últimos cargos. Com ele, a lista recebe foco e as
       * setas rolam. O `role`/`aria-labelledby` é o que faz esse ponto de parada
       * novo se anunciar como alguma coisa, em vez de como um foco sem nome.
       */}
      <ol
        ref={listRef}
        onScroll={syncEnd}
        data-at-end={atEnd}
        className="timeline-scroll scroll-slim mt-4 flex flex-col border-t border-hairline"
        tabIndex={0}
        role="group"
        aria-labelledby="timeline-label"
      >
        {rows.map((row) => (
          <li
            key={`${row.role}-${row.org}`}
            className="flex flex-col gap-1 border-b border-hairline py-4 sm:flex-row sm:gap-gap"
          >
            {/* Largura fixa no ano para os sete alinharem numa coluna, e `tnum`
                para os dígitos não dançarem entre "2025" e "2023–2025". */}
            <div className="flex shrink-0 items-baseline gap-2 sm:w-[104px] sm:flex-col sm:items-start sm:gap-1">
              <span className="tnum text-body-sm text-ink-soft">{row.when}</span>
              {row.current && (
                <span className="label rounded-pill bg-royal-wash px-2 py-0.5 text-royal">
                  {nowLabel}
                </span>
              )}
            </div>
            <div className="min-w-0">
              {/* O cargo em itálico de serifa. É a segunda voz do sistema fazendo o
                  trabalho que ela faz melhor: separar sem precisar de mais peso nem
                  de mais corpo. Antes era grotesca 600, e numa lista de sete o peso
                  repetido sete vezes vira mancha em vez de hierarquia. */}
              <span className="accent block text-h3 text-ink">{row.role}</span>
              {row.squad && <span className="block text-body-sm text-ink">{row.squad}</span>}
              <span className="block text-body-sm text-ink-soft">{row.org}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

/**
 * Relatos de terceiros.
 *
 * **Sem aspas decorativas gigantes e sem cartão com sombra.** Os dois são o
 * vocabulário de depoimento de landing page, e o que este bloco precisa é o
 * contrário: parecer registro, não vitrine. A estrutura é `blockquote` de verdade
 * com `cite`, e a separação é o fio de cabelo do sistema.
 *
 * O fio royal à esquerda tem 2px, dentro do teto de 1px que o DESIGN.md impõe a
 * traço estrutural — este não é estrutura, é marca de citação, que é o uso
 * clássico da barra vertical em texto corrido.
 */
function Quote({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="border-t border-hairline pt-gap">
      <blockquote className="text-body text-ink">
        <p>{testimonial.quote}</p>
      </blockquote>
      <figcaption className="label mt-3 text-ink-soft">{testimonial.source}</figcaption>
    </figure>
  )
}

/**
 * O relato que abre o bloco, em escala de display e em itálico de serifa.
 *
 * O bloco lia chapado por uma razão que o `bolder` nomeia bem: **ele optava por
 * fora dos movimentos mais fortes do próprio sistema.** Eram cinco itens idênticos,
 * mesmo fio à esquerda, mesmo corpo de 16px — a fileira de blocos iguais que o
 * DESIGN.md recusa —, e nenhum deles usava a segunda família, que existe no
 * sistema justamente para ser a outra voz.
 *
 * A amplificação é uma só e é completa: um relato sobe para corpo de display na
 * Newsreader itálica, e os outros quatro descem para um grupo silencioso embaixo.
 * Se os cinco subissem juntos, o bloco ficaria mais chapado, não menos.
 *
 * **Sem aspas decorativas gigantes, sem moldura e sem sombra.** A citação é dita
 * pelo corpo e pela família, que é como tipografia editorial faz. As aspas do texto
 * são as tipográficas de verdade, dentro do conteúdo.
 *
 * A medida é `max-w-[52rem]` e não `measure`: `ch` acompanha o corpo da fonte, e a
 * 56px uma medida de 66ch daria mais de 1800px. Aqui a linha precisa quebrar em
 * duas ou três, que é o que faz uma citação grande ler como citação e não como
 * manchete.
 */
function FeaturedQuote({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="max-w-[52rem]">
      <blockquote className="accent text-balance text-display text-ink">
        <p>{`“${testimonial.quote}”`}</p>
      </blockquote>
      <figcaption className="label mt-gap text-violet">{testimonial.source}</figcaption>
    </figure>
  )
}

export function About() {
  const { locale } = useLocale()
  const t = copyFor(locale)
  const hobbies = t.inventory.hobbies ?? []
  /* O primeiro marcado abre o bloco; todo o resto forma o grupo de baixo, inclusive
     um segundo marcado por engano. Ver o comentário de `Testimonial.featured`. */
  const featured = t.inventory.testimonials.find((item) => item.featured)
  const rest = t.inventory.testimonials.filter((item) => item !== featured)

  return (
    <section id="about" className="scroll-anchor pb-[112px] md:pb-beat">
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

        {/*
         * Bloco 1: a trajetória em prosa à esquerda, a mesma trajetória em dados à
         * direita.
         *
         * Duas colunas de largura igual, e não uma estreita ao lado de uma larga: a
         * prosa precisa de 65 caracteres por linha para ler bem, e a linha do tempo
         * precisa de espaço para o cargo não quebrar em duas linhas. Nenhuma das
         * duas é acessório da outra.
         *
         * `items-start` porque as duas colunas têm alturas diferentes e devem
         * alinhar pelo topo. Esticar a mais curta para acompanhar a mais alta é o
         * que transformaria isto em fileira de cartões.
         */}
        <div className="mt-block grid items-start gap-block lg:mt-[72px] lg:grid-cols-2 lg:gap-x-[72px]">
          <FadeIn delay={0.06}>
            <div className="flex flex-col gap-gap">
              {t.inventory.story.map((para) => (
                <p key={para.slice(0, 24)} className="text-body text-ink-soft">
                  <Rich text={para} />
                </p>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.12}>
            <Timeline
              label={t.inventory.experienceLabel}
              nowLabel={t.inventory.nowLabel}
              rows={t.inventory.rows}
            />
          </FadeIn>
        </div>

        {/*
         * Bloco 2: credenciais à esquerda, retrato ao centro, fotos à direita.
         *
         * As três listas ficam empilhadas numa coluna só, e não espalhadas numa
         * faixa horizontal como antes, porque agora dividem a linha com o retrato.
         * São o mesmo tipo de conteúdo — credencial curta, não narrativa — e
         * separá-las em três colunas só faria sentido se não houvesse mais nada
         * disputando a linha.
         *
         * O retrato é o do meio e a coluna dele é a mais larga: é uma foto 4:5, e
         * numa coluna estreita ela vira selo. Com o `PhotoSlot` em modo de espera,
         * porém, a diferença some — a proporção final não é reservada de propósito.
         */}
        <div className="mt-block grid items-start gap-block lg:mt-[72px] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.8fr)] lg:gap-x-[72px]">
          <FadeIn delay={0.16}>
            <div className="flex flex-col gap-block">
              <DotList label={t.inventory.skillsLabel} items={t.inventory.skills} />
              <DotList label={t.inventory.toolsLabel} items={t.inventory.tools} />
              <DotList label={t.inventory.languagesLabel} items={t.inventory.languages} />
            </div>
          </FadeIn>

          <FadeIn delay={0.22}>
            <PhotoSlot
              photo={t.inventory.portrait}
              pending={t.inventory.portraitPending}
              ratio="aspect-[4/5]"
            />
          </FadeIn>

          <FadeIn delay={0.28}>
            <h3 className="label text-ink-soft">{t.inventory.photosLabel}</h3>
            <div className="mt-4 flex flex-col gap-gap">
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
         * Bloco 3: o que dizem sobre trabalhar com ele.
         *
         * É a única parte do site que não é a voz dele, e por isso abre com fio de
         * cabelo e título próprio: a mudança de quem fala precisa ser visível antes
         * de a primeira palavra ser lida.
         *
         * A linha sob o título diz do que a seção trata, e **não** de onde os
         * relatos vêm. A versão anterior declarava a procedência (avaliação 360 da
         * Nexfar, mar–jun 2026) e o autor preferiu trocar. O custo é conhecido e a
         * decisão é dele: relato sem origem declarada carrega menos peso, porque o
         * leitor não tem como distinguir avaliação interna de recomendação pedida.
         * Se um dia a procedência voltar, o lugar dela é uma nota no pé do bloco, não
         * o subtítulo — ali ela informa sem roubar a abertura.
         */}
        <FadeIn delay={0.34}>
          <div className="mt-block border-t border-hairline pt-block lg:mt-[72px]">
            <h3 className="text-h1 font-extrabold text-ink">
              {t.inventory.testimonialsTitle}
            </h3>
            <p className="measure mt-4 text-body-sm text-ink-soft">
              {t.inventory.testimonialsNote}
            </p>

            {featured && (
              <div className="mt-block">
                <FeaturedQuote testimonial={featured} />
              </div>
            )}

            {/* Os demais em duas colunas, com fio no topo de cada um. Fio em cima e
                não à esquerda: à esquerda, quatro barras verticais viram quatro
                cartões sem fundo, que é o padrão que esta seção acabou de sair. */}
            <div className="mt-block grid gap-block md:grid-cols-2 lg:gap-x-[72px]">
              {rest.map((testimonial) => (
                <Quote key={testimonial.quote.slice(0, 32)} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  )
}
