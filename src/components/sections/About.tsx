import { useEffect, useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import { Container } from '@/components/primitives/Container'
import { FadeIn } from '@/components/primitives/FadeIn'
import { Rich } from '@/components/primitives/Rich'
import { Pill } from '@/components/primitives/Ui'
import { useLocale } from '@/lib/i18n'
import { copyFor } from '@/content'
import type { InventoryRow, Language, Testimonial } from '@/content'

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
 * 2. **Retrato à esquerda, credenciais à direita.** Eram três colunas, com as
 *    fotos de fora do trabalho na terceira; elas saíram em 30/07/2026 e o que
 *    contavam passou para a ficha que sobe do retrato no hover.
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
 * O retrato: preto e branco em repouso, cor e ficha pessoal no hover.
 *
 * A versão anterior era estática — foto saturada, bloco royal deslocado e a faixa
 * marcadora atravessando. O autor pediu que ela virasse componente com dois
 * estados, e a troca melhora um problema que a estática tinha: **os três gestos
 * gastavam de uma vez todo o vocabulário gráfico do site numa imagem só.**
 * Distribuídos entre repouso e hover, cada estado fica com um gesto.
 *
 * - **Repouso:** foto em preto e branco, gradiente royal→roxo deslocado 8px.
 *   Acromática, ela não disputa com o gradiente, e o conjunto lê como retrato de
 *   credencial, que é o que a coluna ao lado pede. Eram 16px, e a 16px o gradiente
 *   lia como segundo bloco ao lado da foto em vez de sombra colorida dela.
 * - **Hover:** a cor volta, o gradiente cresce para 28px e a faixa sobe do pé com
 *   o nome e o que ele faz fora do trabalho.
 *
 * **A faixa é revelação, não conteúdo escondido.** Tudo que ela mostra existe
 * também em texto na página; ela não é a única via para nenhuma informação. Se um
 * dia ela virar o único lugar onde algo é dito, isso deixa de valer e ela precisa
 * de um gatilho de verdade em vez de hover.
 *
 * **O `<figure>` recebe `tabIndex`** para o mesmo estado existir no teclado. Sem
 * ele, quem navega sem mouse simplesmente nunca veria a faixa — e `:focus-visible`
 * num elemento sem foco possível não faz nada. Não virou botão porque não há ação:
 * anunciar como botão prometeria um clique que não leva a lugar nenhum.
 *
 * Em `prefers-reduced-motion` os estados continuam existindo, só que trocam sem
 * transição. Suprimir o efeito inteiro tiraria informação de quem pediu menos
 * movimento, e não é isso que a preferência pede.
 */
function PortraitSlot({
  photo,
  pending,
  name,
  interestsLabel,
  interests,
}: {
  photo?: { src: string; alt: string }
  pending: string
  name: string
  interestsLabel: string
  interests: { emoji: string; label: string }[]
}) {
  if (!photo) return <PhotoSlot pending={pending} ratio="aspect-[4/5]" />

  return (
    <figure className="portrait-figure group" tabIndex={0}>
      <span aria-hidden className="portrait-gradient" />
      <div className="portrait-frame">
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          className="portrait-shot size-full object-cover"
        />

        {/* A ficha. `aria-hidden` não entra aqui: o conteúdo é real e deve ser
            lido, e ele já está visível para quem chega pelo teclado. */}
        <figcaption className="portrait-card">
          <p className="text-h3 font-extrabold text-white">{name}</p>
          <p className="label mt-2 text-white/55">{interestsLabel}</p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {interests.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 text-body-sm text-white"
              >
                {/* O emoji sai da árvore de acessibilidade: o rótulo ao lado já diz
                    a mesma coisa em palavra, e sem isto o leitor de tela anunciaria
                    "cara de cachorro" antes de "meus cachorros".

                    Corpo em `body`, 16px, ao lado de um rótulo em `body-sm`, 14px.
                    Ele é maior que o texto de propósito: emoji ocupa menos da caixa
                    em do que letra latina, e no mesmo corpo pareceria menor. Era
                    `text-[18px]`, valor fora da rampa escolhido a olho — 16px casa
                    igualmente bem e é um degrau documentado. */}
                <span aria-hidden className="text-body leading-none">
                  {item.emoji}
                </span>
                {item.label}
              </li>
            ))}
          </ul>
        </figcaption>
      </div>
    </figure>
  )
}

/**
 * A altura desta coluna é governada pelo comprimento dos rótulos, não pelo layout.
 *
 * Uma passada tentou resolver por estrutura: as credenciais viraram faixa de
 * largura inteira, com o rótulo à esquerda, e as skills caíram de oito fileiras
 * para duas. O autor recusou — ele quer as três listas na coluna ao lado do
 * retrato, que é onde elas contam como credencial e não como seção própria. **A
 * causa verdadeira era outra**, e é a que ele apontou: rótulos como "Gestão de
 * stakeholders e cliente" tomam a coluna inteira sozinhos, então cada cápsula
 * custava uma fileira. Encurtar o termo resolve sem mover nada.
 *
 * Regra para quem for editar a lista: **numa coluna de cerca de 380px, o teto
 * prático é 20 caracteres**. Acima disso a cápsula não divide fileira com nenhuma
 * outra, e a lista volta a crescer uma linha por item.
 */

/**
 * Lista de credenciais curtas em cápsulas.
 *
 * Antes era uma linha corrida separada por pontos do meio. A troca por cápsula tem
 * um custo real e vale nomear: **a linha corrida cabia em menos altura**, e vinte
 * cápsulas ocupam bem mais espaço vertical do que vinte palavras separadas por
 * ponto. O que se ganha é varredura — cada item vira um alvo com contorno próprio,
 * e quem lê uma lista de skills lê pulando, não lendo em sequência.
 *
 * A `ul` continua sendo lista de verdade, então o leitor de tela anuncia a
 * contagem e navega item a item. Isto melhorou junto: os pontos do meio eram
 * decorativos e obrigavam `aria-hidden`; agora não há nada de decorativo a esconder.
 */
function PillList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <h3 className="label text-ink-soft">{label}</h3>
      <ul className="mt-4 flex flex-wrap gap-2 text-body-sm text-ink">
        {items.map((item) => (
          <Pill key={item} live reserve={item}>
            {item}
          </Pill>
        ))}
      </ul>
    </div>
  )
}

/**
 * Idiomas. A mesma cápsula, com duas informações dentro: o idioma em tinta e o
 * nível apagado ao lado, separados por um ponto do meio.
 *
 * O nível **dentro** da cápsula e não numa segunda linha: "Inglês" sozinho não é
 * credencial, é substantivo. O par é que informa, e o par cabe.
 *
 * A ressalva de escopo do inglês vira nota abaixo do grupo. Ela é a única prosa
 * desta coluna e por isso fica em `ink-soft`, no mesmo corpo das cápsulas — se
 * subisse de tamanho, a ressalva pesaria mais que a credencial que ela qualifica.
 */
function LanguageList({ label, items }: { label: string; items: Language[] }) {
  const notes = items.filter((item) => item.note)

  return (
    <div>
      <h3 className="label text-ink-soft">{label}</h3>
      <ul className="mt-4 flex flex-wrap gap-2 text-body-sm">
        {items.map((item) => (
          <Pill key={item.name} live className="text-ink">
            {item.name}
            <span aria-hidden className="px-2 text-hairline-strong">
              ·
            </span>
            <span className="text-ink-soft">{item.level}</span>
          </Pill>
        ))}
      </ul>
      {notes.map((item) => (
        <p key={item.name} className="mt-4 text-body-sm text-ink-soft">
          {item.note}
        </p>
      ))}
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
  const [scrollable, setScrollable] = useState(false)
  const [dragging, setDragging] = useState(false)

  /*
   * Arrastar para rolar a lista.
   *
   * **Só no mouse.** No toque o arrasto nativo já rola, e um segundo gesto por
   * cima do primeiro brigaria com ele — a lista roubaria o dedo que ia rolar a
   * página, que é justamente a armadilha que o teto de altura evita abaixo de
   * `lg`. `pointerType` é o que separa os dois, e não a largura da tela: laptop
   * com tela sensível ao toque existe e recebe os dois tipos de ponteiro.
   *
   * **O limiar de 4px é a parte que importa.** Sem ele, todo clique com tremor de
   * mão vira arrasto e a seleção de texto morre na lista inteira. Com ele, o
   * gesto só é capturado depois de ficar claro que é um gesto.
   *
   * O custo fica registrado: **arrastar de cima para baixo dentro da lista deixou
   * de selecionar texto** e passou a rolar. Selecionar dentro de uma linha
   * continua funcionando, porque o movimento horizontal nunca cruza o limiar.
   *
   * O estado vivo do arrasto mora num ref e não em `useState`: ele muda a cada
   * `pointermove`, e re-renderizar sete itens a cada quadro para guardar um número
   * que ninguém desenha seria trabalho jogado fora. Só `dragging`, que o CSS lê,
   * é estado.
   */
  const drag = useRef<{ id: number; y: number; top: number; active: boolean } | null>(
    null,
  )

  function onPointerDown(e: React.PointerEvent<HTMLOListElement>) {
    const node = listRef.current
    if (!node || e.pointerType !== 'mouse' || e.button !== 0) return
    if (node.scrollHeight <= node.clientHeight) return
    drag.current = { id: e.pointerId, y: e.clientY, top: node.scrollTop, active: false }
  }

  function onPointerMove(e: React.PointerEvent<HTMLOListElement>) {
    const node = listRef.current
    const state = drag.current
    if (!node || !state || state.id !== e.pointerId) return

    const dy = e.clientY - state.y

    if (!state.active) {
      if (Math.abs(dy) < 4) return
      state.active = true
      /* A captura é o que faz o arrasto sobreviver ao ponteiro sair da lista: sem
         ela, arrastar até a beira e continuar solta o gesto no meio. */
      node.setPointerCapture(e.pointerId)
      /* Os 4px iniciais podem ter começado uma seleção. Limpar aqui evita a lista
         rolar com meia linha grifada atrás. */
      window.getSelection()?.removeAllRanges()
      setDragging(true)
    }

    node.scrollTop = state.top - dy
  }

  function endDrag(e: React.PointerEvent<HTMLOListElement>) {
    const node = listRef.current
    const state = drag.current
    if (!node || !state || state.id !== e.pointerId) return
    if (state.active && node.hasPointerCapture(e.pointerId)) {
      node.releasePointerCapture(e.pointerId)
    }
    drag.current = null
    setDragging(false)
  }

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
    /* O cursor de arrasto só aparece onde há o que arrastar. Prometer o gesto numa
       lista que já cabe inteira seria afordância mentindo. */
    setScrollable(node.scrollHeight > node.clientHeight)
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
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        data-at-end={atEnd}
        data-scrollable={scrollable}
        data-dragging={dragging}
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
              {row.squad && (
                <span className="block text-body-sm text-ink">{row.squad}</span>
              )}
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
         * Bloco 2: o retrato à esquerda, as credenciais à direita.
         *
         * **Eram três colunas e as fotos de fora do trabalho ficavam na terceira.**
         * Elas saíram por decisão do autor em 30/07/2026, e a razão dele foi de
         * conteúdo, não de layout: os arquivos nunca chegaram, e três espaços
         * reservados numa seção já ocupada custavam mais do que rendiam. O que
         * elas contavam — que existe vida fora do trabalho — passou para a ficha
         * que sobe do retrato no hover, que diz o mesmo com o nome junto e sem
         * esperar arquivo nenhum.
         *
         * A saída delas melhorou as credenciais de graça: com duas colunas em vez
         * de três, a lista de cápsulas ganhou perto de 60% mais largura, e as
         * skills que antes tomavam uma fileira cada passaram a dividir linha.
         *
         * **O retrato é a coluna estreita.** Ele é 4:5, e numa coluna larga uma
         * foto 4:5 passa de 600px de altura, o que faria a seção ganhar em altura
         * tudo que a saída das fotos economizou.
         *
         * O conteúdo de `photosLabel`, `photosPending` e `hobbies` continua no
         * arquivo de textos, sem ninguém renderizar. É conteúdo em espera: se as
         * fotos chegarem, o bloco volta.
         */}
        <div className="mt-block grid items-start gap-block lg:mt-[72px] lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:gap-x-[72px]">
          <FadeIn delay={0.16}>
            <PortraitSlot
              photo={t.inventory.portrait}
              pending={t.inventory.portraitPending}
              name={t.inventory.portraitName}
              interestsLabel={t.inventory.interestsLabel}
              interests={t.inventory.interests}
            />
          </FadeIn>

          <FadeIn delay={0.22}>
            <div className="flex flex-col gap-block">
              <PillList label={t.inventory.skillsLabel} items={t.inventory.skills} />
              {/* As soft skills logo abaixo das hard, com tratamento idêntico. O
                  DESIGN.md manda um tratamento só para as três listas de
                  credencial, porque diferenciá-las por cor ou peso inventaria
                  hierarquia entre coisas do mesmo nível. Quem diz de que tipo é
                  cada grupo é o rótulo em caixa-alta acima dele. */}
              <PillList
                label={t.inventory.softSkillsLabel}
                items={t.inventory.softSkills}
              />
              <PillList label={t.inventory.toolsLabel} items={t.inventory.tools} />
              <LanguageList
                label={t.inventory.languagesLabel}
                items={t.inventory.languages}
              />
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
