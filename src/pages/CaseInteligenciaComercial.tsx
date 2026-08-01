import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Container } from '@/components/primitives/Container'
import { FadeIn } from '@/components/primitives/FadeIn'
import { Rich } from '@/components/primitives/Rich'
import { RoleByline, Pill, StatPill } from '@/components/primitives/Ui'
import { useLocale } from '@/lib/i18n'
import { copyFor, type Piece } from '@/content'
import { NotFound } from '@/pages/NotFound'

/*
 * A página interna do case do Inteligência Comercial.
 *
 * **Ela existe para pagar uma dívida com endereço.** O gatilho "Ver o case
 * completo" apontava para `/cases/inteligencia-comercial` desde a rodada anterior
 * e devolvia 404 — era dívida declarada, com prazo, e o prazo era esta rodada.
 *
 * A regra que organiza a página: **ela não repete a home, ela continua a home.**
 * O que a home dá é o resumo — quem conduziu, de onde veio o produto, sete
 * cápsulas e a faixa de evolução. O que só existe aqui é o que não cabia lá: os
 * três módulos explicados um a um, com o número que cada um sustenta, e o custo da
 * decisão.
 *
 * O painel de evolução **reaparece**, e isso é escolha e não descuido. Ele é a
 * espinha cronológica do case, e a pessoa que chega por link direto — de um
 * currículo, de uma mensagem — nunca viu a home. Repetir custa altura; não repetir
 * custaria a leitura inteira de quem entra por aqui.
 *
 * O conteúdo vem todo de `builds.items`, pelo `id`. Não há um segundo objeto de
 * conteúdo para esta página: duplicar a narrativa garantiria que uma das duas
 * versões envelhecesse sozinha.
 */

/**
 * A tira de evolução da interface: a mesma tela em cinco momentos.
 *
 * **Rola na horizontal em vez de quebrar em grade.** Cinco telas em duas fileiras
 * perderiam a comparação, que é a única coisa que a peça faz — a quinta ficaria
 * embaixo da primeira, longe justamente do passo com que ela contrasta. Rolagem
 * mantém a ordem numa linha só em qualquer largura, e o contêiner rola sozinho
 * para o corpo da página nunca rolar na horizontal.
 *
 * **As cinco cabem na largura, e é isso que manda no tamanho de cada uma.** A
 * versão anterior fixava a largura do item e a quinta tela morria cortada na borda
 * do contêiner: quem não arrastasse via quatro versões e concluiria que são quatro.
 * Numa peça cujo argumento é a comparação, a última é a que fecha a frase.
 *
 * Por isso o item é `flex-1` com piso de `min-width`, e não largura fixa. Acima do
 * piso as cinco dividem a linha e aparecem juntas; abaixo dele, no telefone, o piso
 * vence e a tira volta a rolar, porque tela de produto espremida em 60px não
 * compara nada.
 *
 * A proporção é `390/844` nas cinco, o viewport do aparelho. Proporção igual é o
 * que torna a comparação honesta: com alturas diferentes, a tela mais alta pareceria
 * a mais completa por ocupar mais papel.
 */
function UiEvolution({
  data,
}: {
  data: NonNullable<ReturnType<typeof copyFor>['builds']['items'][number]['uiEvolution']>
}) {
  // O intervalo encolhe no telefone: com 48px entre itens, quatro intervalos
  // gastavam 192px dos 342px disponíveis, e sobrava menos de uma tela e meia
  // visível por arrasto numa peça cujo argumento é a comparação.
  return (
    <ul className="ui-eva mt-block flex snap-x snap-mandatory items-start gap-gap overflow-x-auto pb-2 md:gap-block">
      {data.steps.map((step) => (
        <li key={step.version} className="ui-eva-item snap-start">
          <img
            src={step.src}
            alt={step.alt}
            loading="lazy"
            decoding="async"
            className="ui-eva-shot aspect-[390/844] w-full rounded-md bg-white object-cover object-top"
          />
          {/* O rótulo embaixo, não em cima: quem varre a tira lê as imagens
              primeiro e só desce para o nome quando alguma prende a atenção. */}
          <p className="label mt-4 text-royal">{step.version}</p>
          <p className="mt-2 text-body-sm text-ink-soft">{step.change}</p>
        </li>
      ))}
    </ul>
  )
}

/**
 * A jornada do módulo em telas: um slider que anda sozinho e aceita ser dirigido.
 *
 * **A troca deixou de ser presa ao scroll.** A primeira versão trocava a tela
 * conforme a decisão cruzava o meio da janela, e a rolagem do leitor virava o
 * controle de reprodução: quem lia rápido pulava estados, quem parava para reler via
 * a tela congelada. O autor pediu o contrário, e é o certo — o ritmo da jornada é do
 * produto, não da velocidade de leitura de quem visita.
 *
 * **Anda sozinho e obedece.** O avanço automático mostra que existe sequência sem
 * exigir nada de quem só quer ler o texto ao lado; os pontos e as setas devolvem o
 * controle a quem quiser parar numa tela. Qualquer toque no controle **encerra** o
 * avanço automático em definitivo, e não por alguns segundos: retomar sozinho depois
 * de a pessoa ter escolhido uma tela é o comportamento que faz carrossel ser odiado.
 *
 * Só toca quando está à vista, e não toca para quem pediu menos movimento
 * (`prefers-reduced-motion`), caso em que o slider nasce parado e inteiramente
 * manual.
 */
/*
 * **7,4s por tela, e não 5,2s.** O intervalo anterior foi calibrado contra a tela
 * sozinha, e ele não é o tempo de olhar uma captura: é o tempo de ler o parágrafo
 * ao lado, olhar para a tela e voltar. Com 5,2s a jornada trocava no meio desse
 * percurso, e quem tinha acabado de baixar o olho encontrava outra coisa.
 *
 * O número desconta a passagem: 900ms dos 7,4s são transição, então cada tela fica
 * parada cerca de 6,5s.
 */
const SLIDE_MS = 7400

/* Abaixo disto o gesto é tremor de mão, não intenção de trocar de tela. */
const SWIPE_MIN_PX = 40

function ModuleJourney({
  screens,
  labels,
}: {
  screens: NonNullable<Piece['screens']>
  labels: { prev: string; next: string }
}) {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [taken, setTaken] = useState(false)
  const [focusIndex, setFocusIndex] = useState<number | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<{ x: number; y: number; id: number } | null>(null)

  /*
   * A janela mostra três pontos, ou todos quando são menos que três, e desliza
   * para manter em vista o ponto que importa. O deslocamento tenta deixá-lo no
   * meio (`- 1`) e é limitado às duas pontas, então no primeiro e no último a
   * janela para em vez de mostrar vazio ao lado da fileira.
   *
   * Quem manda é o ponto em foco, e só na falta dele o ponto ativo: navegando por
   * teclado, o foco anda antes de a tela trocar, e é o foco que precisa
   * permanecer visível.
   */
  const windowSize = Math.min(3, screens.length)
  const anchor = focusIndex ?? active
  const windowOffset = Math.min(
    Math.max(anchor - 1, 0),
    Math.max(screens.length - windowSize, 0),
  )

  /* Toca só enquanto o palco está à vista. Slider rodando fora da tela gasta
     bateria para ninguém e chega no meio da sequência quando a pessoa enfim rola
     até ele. */
  useEffect(() => {
    const node = stageRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setPlaying(entry.isIntersecting),
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!playing || taken || screens.length < 2) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % screens.length),
      SLIDE_MS,
    )
    return () => window.clearInterval(id)
  }, [playing, taken, screens.length])

  function goTo(index: number) {
    setTaken(true)
    setActive((index + screens.length) % screens.length)
  }

  /*
   * **No dedo, o arrasto substitui as setas.** Duas setas de 44px ao lado de seis
   * pontos de 44px não cabem numa coluna de telefone, e era essa fileira que
   * empurrava a página inteira para o lado. Em vez de espremer os alvos abaixo do
   * piso de toque, o gesto que a moldura de telefone já convida assume o trabalho
   * e as setas saem — elas continuam inteiras no mouse, que não tem arrasto.
   *
   * O custo fica registrado: **arrastar não se anuncia.** Quem não tentar depende
   * dos pontos, que continuam sendo botões com rótulo e alcançam qualquer tela —
   * inclusive por leitor de tela, que é o que impede a saída das setas de custar
   * navegação a alguém.
   *
   * A separação é por `pointerType` e não por largura, como na linha do tempo do
   * Sobre: laptop com tela sensível ao toque recebe os dois tipos de ponteiro, e
   * quem chega pelo dedo ganha o gesto sem que o mouse perca as setas.
   */
  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === 'mouse') return
    dragRef.current = { x: e.clientX, y: e.clientY, id: e.pointerId }
  }

  function onPointerUp(e: React.PointerEvent) {
    const start = dragRef.current
    dragRef.current = null
    if (!start || start.id !== e.pointerId) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    // Um arrasto mais vertical que horizontal é alguém rolando a página com o
    // dedo em cima da tela, e trocar de slide ali seria roubo de gesto.
    if (Math.abs(dx) < SWIPE_MIN_PX || Math.abs(dx) <= Math.abs(dy)) return
    goTo(active + (dx < 0 ? 1 : -1))
  }

  return (
    <div ref={stageRef} className="mj-stage">
      <div
        className="mj-device"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragRef.current = null
        }}
      >
        <div className="mj-frame relative">
          {screens.map((screen, i) => (
            <img
              key={screen.src}
              src={screen.src}
              /* Só a tela ativa tem nome acessível. As outras são a mesma jornada
               repetida para quem ouve a página, e a legenda abaixo já anuncia o
               passo em região viva. */
              alt={i === active ? screen.alt : ''}
              aria-hidden={i === active ? undefined : true}
              loading="lazy"
              decoding="async"
              className="mj-shot w-full bg-white"
              data-active={i === active ? 'true' : undefined}
            />
          ))}
        </div>
      </div>

      <p className="mj-caption mt-gap text-body-sm text-ink" aria-live="polite">
        {screens[active].caption}
      </p>

      {/* Os controles ficam **abaixo da legenda**, não sobre a tela. Seta em cima de
          captura de produto some no fundo claro e obriga a pintar uma pastilha, que
          é moldura de player onde deveria haver prova de trabalho. */}
      {/* `items-start` e não `items-center`: com o contador abaixo dos pontos, o
          centro do bloco desce e as setas desceriam junto, saindo da altura da
          fileira que elas comandam. A janela carrega a altura da seta, então
          alinhados pelo topo os três ficam no mesmo eixo. */}
      <div className="mt-gap flex items-start justify-center gap-3">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          className="mj-arrow"
          aria-label={labels.prev}
        >
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
        </button>

        <div>
          <div
            className="mj-dots-window"
            style={{ ['--mj-window' as string]: windowSize }}
          >
            <ol
              className="mj-dots"
              style={{ transform: `translateX(calc(var(--mj-slot) * -${windowOffset}))` }}
            >
              {screens.map((screen, i) => (
                <li key={screen.src}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    /* O foco arrasta a janela sem trocar a tela. Sem isto, quem
                       navega por teclado passaria por botões recortados fora da
                       janela: o foco existiria num alvo que ninguém vê. */
                    onFocus={() => setFocusIndex(i)}
                    onBlur={() => setFocusIndex(null)}
                    className="mj-dot-hit"
                    aria-label={screen.caption}
                    aria-current={i === active ? 'true' : undefined}
                  >
                    <span
                      className="mj-dot"
                      data-active={i === active ? 'true' : undefined}
                    />
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <span className="mj-count tnum mt-2 text-body-sm text-ink-soft">
            {active + 1}/{screens.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => goTo(active + 1)}
          className="mj-arrow"
          aria-label={labels.next}
        >
          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

/**
 * A lista de números de um bloco: um líder opcional e os apoios abaixo dele.
 *
 * **Existe porque era o mesmo JSX três vezes.** Os módulos, o método e a prova
 * desenhavam listas de resultado com as mesmas strings de classe copiadas — três
 * cópias que só continuariam iguais por vigilância, e que já tinham começado a
 * divergir (a prova ganhou `text-body-sm` explícito na fonte, o método não).
 *
 * **O defeito que ela conserta é horizontal, não vertical.** O autor disse que a
 * legenda parecia desalinhada da informação, e a suspeita óbvia era baseline. As
 * baselines estavam perfeitas: 0,0px de diferença, medido. O que estava torto era o
 * eixo x — o numeral era `shrink-0` numa fileira flex, então **cada legenda começava
 * onde aquele numeral por acaso tinha terminado**. Na prova, as bordas esquerdas
 * caíam em 469, 454, 394 e 543px a 1920px: 149px de ziguezague numa lista de quatro
 * linhas, e a linha da fonte herdava o mesmo x, virando uma escada de oito degraus.
 *
 * Daí `subgrid`. A coluna dos numerais é dimensionada uma vez, no `<ul>`, pelo mais
 * largo de todos (`max-content`), e cada `<li>` se pendura nessa mesma trilha em vez
 * de negociar a própria. **Um x só para todas as legendas**, sem largura fixa
 * chutada e sem quebrar quando o conteúdo mudar de idioma.
 *
 * Abaixo de `sm` a grade é abandonada de propósito e a lista volta a empilhar. Numa
 * coluna de 178px, `15 → 200+` empurrava a legenda 145px para a direita e sobrava
 * espaço para nada: a legenda quebrava em quatro linhas. Duas colunas só existem
 * quando há largura para duas colunas.
 *
 * **O líder fica fora da grade.** Ele é a afirmação do bloco e não uma linha da
 * tabela; dentro da grade, o corpo de display dele definiria a coluna dos numerais e
 * jogaria todas as legendas de apoio para bem longe do próprio número.
 */
function ResultList({
  results,
  className = 'mt-block',
}: {
  results: NonNullable<Piece['results']>
  className?: string
}) {
  const lead = results.find((result) => result.lead)
  const rest = results.filter((result) => result !== lead)

  return (
    <div className={className}>
      {lead && (
        <div>
          <p className="font-display text-display font-extrabold leading-none text-royal">
            <ResultValue result={lead} />
          </p>
          <p className="measure mt-snug text-body text-ink">{lead.unit}</p>
          {lead.source && <ResultSource>{lead.source}</ResultSource>}
        </div>
      )}

      {rest.length > 0 && (
        <ul
          className={`flex flex-col gap-snug sm:grid sm:grid-cols-[max-content_1fr] sm:gap-x-gap ${
            lead ? 'mt-gap' : ''
          }`}
        >
          {rest.map((result) => (
            <li
              key={result.value + result.unit}
              /* `sm:gap-x-gap` repetido aqui de propósito. Um `subgrid` herda as
                 calhas do pai, mas só enquanto não declarar as próprias — e o
                 `gap-tight` que separa número de legenda no telefone é uma
                 declaração, então sem esta linha a calha de 24px viraria os 8px do
                 empilhamento. */
              className="flex flex-col gap-tight sm:col-span-full sm:grid sm:grid-cols-subgrid sm:items-baseline sm:gap-x-gap"
            >
              {/* **Os apoios são tinta, não royal.** Antes cada número da lista saía
                  em royal, e o resultado era que a cor deixava de destacar: o olho
                  compara massa de tinta colorida, e `15 → 200+` a 36px mede 171px
                  contra os 92px do `+85` a 56px — o apoio tinha 1,86× a tinta do
                  líder. Um acento por bloco é o que faz o acento significar algo.

                  `.tnum` saiu daqui. Figura tabular só compra alinhamento em coluna
                  alinhada à direita, e esta é alinhada à esquerda: era `font-feature-settings`
                  ligado sem nada em troca. */}
              <span className="font-display text-num font-extrabold text-ink">
                <ResultValue result={result} />
              </span>
              <span className="measure text-body text-ink-soft">
                {result.unit}
                {result.source && <ResultSource>{result.source}</ResultSource>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/**
 * O valor de um resultado, dito uma vez para o olho e outra para o ouvido.
 *
 * **Os dois carregam a mesma medida por motivos opostos.** A versão visível precisa
 * dos sinais — `~` diz aproximado, `→` diz virou, `+` diz pelo menos — e é justamente
 * deles que o leitor de tela faz sopa: `~200` sai como "til 200" e `15 → 200+` como
 * "15 seta para a direita 200 mais". A versão falada é a mesma medida por extenso, e
 * ela vem do conteúdo (`spoken`), nunca montada aqui: transformar sinal em palavra é
 * decisão de idioma, e esta página existe em dois.
 *
 * Onde `spoken` falta, ou onde ele repete o que já está escrito, sai só um nó — um
 * `sr-only` duplicando o texto visível faria o leitor de tela dizer o número duas
 * vezes.
 */
function ResultValue({ result }: { result: NonNullable<Piece['results']>[number] }) {
  const spoken = result.spoken && result.spoken !== result.value ? result.spoken : null
  if (!spoken) return <>{result.value}</>

  return (
    <>
      <span aria-hidden>{result.value}</span>
      <span className="sr-only">{spoken}</span>
    </>
  )
}

/**
 * A procedência de um número.
 *
 * **Distinção por tamanho, nunca por transparência.** A primeira versão usava
 * `ink-soft/70`, que dá 3,0:1 sobre o papel — abaixo do piso de 4,5:1. A segunda
 * corrigiu o contraste subindo para `ink-soft` cheio, e com isso a fonte ficou
 * tipograficamente idêntica à legenda que ela acompanha: mesmo corpo de 14px, mesma
 * cor, mesmo peso, em cinco das seis ocorrências. Duas informações diferentes com a
 * mesma voz.
 *
 * A escala `label` (12px) resolve as duas: a fonte é menor que a legenda, e
 * `ink-soft` cheio mantém 5,54:1. `tracking-normal` desfaz o entreletras de 0,09em da
 * escala, que existe para versalete e não para "Power BI, ago/2026".
 */
function ResultSource({ children }: { children: string }) {
  return (
    <span className="mt-tight block text-label tracking-normal text-ink-soft">
      {children}
    </span>
  )
}

/**
 * Um módulo, com a jornada que o originou e os números que ele sustenta.
 *
 * **O nome subiu de `h3` para `h2` e o fio ganhou ar acima.** Enquanto o módulo era
 * uma definição de duas linhas com um número no fim, corpo de `h3` era proporcional
 * ao que ele carregava. Com a jornada dentro, cada módulo passou a ser um trecho
 * longo de leitura, e três trechos longos separados por um título pequeno leem como
 * um texto só — o leitor perde onde um acaba e o outro começa.
 *
 * O numeral em roxo fica. Ele é vocabulário desta página desde antes, e a régua de
 * craft que desaconselha numeral de seção vale para sequência sem informação: aqui
 * ele conta quantos módulos existem, que é o número que a seção inteira afirma.
 */
function PieceCard({
  piece,
  index,
  labels,
}: {
  piece: Piece
  index: number
  labels: { prev: string; next: string }
}) {
  return (
    <li className="border-t border-hairline pt-block">
      {/* **A grade abraça o módulo inteiro, e não só as decisões.** O palco é
          `sticky`, e sticky só anda dentro do próprio pai: preso à caixa das
          decisões, ele descolava assim que os números começavam. Com o pai sendo o
          módulo todo, a tela entra junto com o nome, acompanha a leitura inteira e
          solta no fim — que é o comportamento que o autor pediu. */}
      <div className="grid gap-block lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-section">
        <div className="min-w-0">
          {/* O numeral entrou para dentro do título e passou a herdar o corpo dele. Solto
          ao lado, em corpo de rótulo, ele lia como marca d'água de gabarito; no
          mesmo corpo do nome, o par vira uma coisa só.

          **Os três níveis estavam colapsando, e o motivo era mecânico.** `text-h2`
          e `text-h3` resolvem os dois em 20px abaixo de 1024px, então o nome do
          módulo e o título da decisão saíam do mesmo tamanho, com o mesmo peso e o
          mesmo numeral roxo na frente — três sinais idênticos para dois níveis
          diferentes. Agora o módulo sobe para `h1` e a decisão desce para corpo em
          negrito, o que abre dois degraus inteiros entre eles; e a decisão ganha
          fio à esquerda, que é o único traço estrutural do sistema, para dizer por
          desenho que ela está dentro do módulo e não ao lado dele. */}
          <h3 className="text-h1 font-extrabold text-ink">
            <span className="tnum mr-4 text-violet">
              {String(index + 1).padStart(2, '0')}
            </span>
            {piece.name}
          </h3>

          <p className="measure mt-3 text-body text-ink-soft">
            <Rich text={piece.detail} />
          </p>

          {/* A jornada entre a definição e os números, porque é ela que explica por que
          os números importam. Em tinta cheia e não em `ink-soft`: é o texto que o
          módulo tem de mais próprio, e ler mais claro que a definição acima é o
          que diz isso sem precisar de rótulo. */}
          {piece.journey && (
            <div className="mt-gap flex flex-col gap-gap">
              {piece.journey.map((paragraph) => (
                <p key={paragraph} className="measure text-body-lead text-ink">
                  <Rich text={paragraph} />
                </p>
              ))}
            </div>
          )}

          {/* A lista virou `ul`. Enquanto as decisões tinham numeral, `ol` dizia a
              verdade para quem ouve a página; sem ele, ordenar continuaria
              anunciando "item 1 de 3" para três decisões que não são etapas. */}
          {piece.decisions && (
            <ul className="mt-block flex flex-col gap-block">
              {piece.decisions.map((decision) => (
                <li key={decision.title} className="border-l border-hairline pl-gap">
                  {/* **O numeral da decisão virou ponto, a pedido do autor.** Ele
                      era `01`, `02`, `03` em roxo e `tnum`, exatamente o mesmo
                      tratamento do numeral do módulo logo acima — dois numerais
                      idênticos, um dentro do outro, dizem que estão no mesmo
                      nível, e a leitura tropeça procurando a relação entre eles.

                      Ponto e não letra: A/B/C ainda afirma sequência, e as três
                      decisões de um módulo são paralelas, não etapas. O que
                      carrega o "isto está dentro do módulo" continua sendo o fio
                      à esquerda, que não mudou.

                      Alinhado por `items-baseline`, sem número mágico: a caixa
                      vazia do ponto tem a base na linha do texto, então ele cai
                      dentro da altura-x sem depender de `vertical-align`
                      calibrado a olho. */}
                  <h4 className="measure flex items-baseline gap-2 text-body font-bold text-ink">
                    <span aria-hidden className="decision-dot shrink-0" />
                    <span>{decision.title}</span>
                  </h4>
                  <p className="measure mt-2 text-body text-ink-soft">{decision.body}</p>
                </li>
              ))}
            </ul>
          )}

          {/* Os números ficam **depois** da explicação, e não em cima dela: o módulo
          precisa ser entendido antes de ser medido. Invertido, a página vira
          painel de métrica, que é o que o DESIGN.md recusa desde a primeira
          rodada.

          Empilhados em coluna e não numa fileira de três: a unidade de cada um é
          uma frase ("poupada por cotação, de 50 a 100 itens"), e frase em coluna
          de grade quebra em três linhas enquanto o número ao lado fica sozinho.

          **Quem sai em corpo de display é quem foi marcado, e não quem chegou
          primeiro.** A régua era `i === 0`, posicional, e regra posicional faz
          afirmação que ninguém escreveu: o Catálogo Digital tem um resultado só e
          por isso ganhava a mesma voz do NPS do case inteiro. Hoje o campo `lead`
          diz quem lidera, e módulo de número único não leva nenhum. Ver a nota do
          campo em `content/index.ts`. */}
          {piece.results && <ResultList results={piece.results} />}
        </div>

        {piece.screens && <ModuleJourney screens={piece.screens} labels={labels} />}
      </div>
    </li>
  )
}

export function CaseInteligenciaComercial() {
  const { locale } = useLocale()
  const t = copyFor(locale)
  const build = t.builds.items.find((b) => b.id === 'nf-next-ic')

  // Conteúdo removido do `content` não pode derrubar a rota inteira em tela
  // branca: sem o case, o endereço deixou de existir e é isso que a página diz.
  if (!build) return <NotFound />

  // As cápsulas que descrevem o escopo, sem as que carregam número medido. Ver a
  // nota junto ao bloco que as desenha.
  const traits = build.highlights?.filter((item) => !item.measured) ?? []

  /*
   * O topo encolheu de `block`/`section` para `gap`/`block`. O cabeçalho é fixo e já
   * reserva a própria altura, então o respiro de seção aqui virava respiro em cima de
   * respiro e o gatilho de voltar nascia longe demais do alto da janela — num link de
   * retorno, distância do topo lê como se ele não fosse a primeira coisa disponível.
   */

  return (
    <article id="top" className="scroll-anchor pb-beat pt-gap md:pt-block">
      <Container>
        <FadeIn>
          {/* A volta fica no topo e é a primeira coisa tabulável do conteúdo.
              Rodapé de página longa é tarde demais para quem já entendeu que
              entrou no lugar errado. */}
          <Link
            to="/#cases"
            className="group tap-h inline-flex items-center gap-2 text-body-sm font-semibold text-ink-soft transition-colors hover:text-royal"
          >
            <ArrowLeft
              className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1"
              aria-hidden
            />
            {t.casePage.back}
          </Link>

          <div className="mt-block">
            <RoleByline>{build.tag}</RoleByline>
            <h1 className="mt-3 text-display font-extrabold text-ink">{build.name}</h1>
            {build.org && <p className="mt-1 text-h3 text-ink-soft">{build.org}</p>}
          </div>

          <p className="measure mt-gap text-body-lead text-ink">{build.body}</p>
        </FadeIn>

        {/* Papéis e resultados juntos, numa faixa só. Na home eles dividem a
            atenção com o parágrafo em duas colunas; aqui o parágrafo já foi lido,
            então as duas fileiras podem correr a largura inteira. */}
        <FadeIn delay={0.06}>
          <div className="mt-section flex flex-col gap-gap">
            {build.roles && (
              <div>
                <h2 className="label text-ink-soft">{t.builds.rolesLabel}</h2>
                <ul className="mt-4 flex flex-wrap gap-2 text-body-sm text-ink">
                  {build.roles.map((role) => (
                    <Pill key={role}>{role}</Pill>
                  ))}
                </ul>
              </div>
            )}

            {/* **Só as cápsulas de escopo, sem as medidas.** Na home elas são o
                resumo inteiro do case e os números precisam estar ali. Aqui a prova
                vem logo abaixo, em corpo de display e com fonte declarada — e a
                mesma medida dita duas vezes em duas vozes não reforça, divide: a
                cápsula de 14px diz o número antes, mais baixo, e sem procedência,
                então quando ele reaparece grande já foi lido. Filtro na página, não
                no conteúdo: `Cases.tsx` come o mesmo dado e não muda. */}
            {traits.length > 0 && (
              <div>
                <h2 className="label text-ink-soft">{t.builds.highlightsLabel}</h2>
                <ul className="mt-4 flex flex-wrap gap-2 text-body-sm text-ink">
                  {traits.map((item) => (
                    <StatPill key={item.value} value={item.value} label={item.label} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </FadeIn>

        {/* **A prova subiu para cá, e é a segunda coisa da página.** O leitor típico
            chega por link direto de um currículo e decide em segundos se continua;
            no fim da página, o único bloco capaz de segurá-lo só era encontrado por
            quem já estava convencido.

            Ela cabe aqui porque não depende de nada acima dela: cada linha carrega a
            própria procedência, e é justamente por serem de origens diferentes —
            pesquisa, operação e produto instrumentado — que elas se sustentam sem os
            módulos terem sido lidos ainda. */}
        {build.proof && (
          <FadeIn delay={0.06}>
            <section className="mt-section lg:mt-beat">
              <h2 className="measure text-h1 font-extrabold text-ink">
                {build.proof.title}
              </h2>
              <p className="measure mt-gap text-body-lead text-ink">{build.proof.lead}</p>
              <ResultList results={build.proof.results} />
            </section>
          </FadeIn>
        )}

        {/*
         * A FAIXA DE EVOLUÇÃO SAIU DAQUI, e continua viva na home.
         *
         * Ela era a espinha cronológica desta página, e o argumento para repeti-la
         * era quem chega por link direto. O que a derrubou foi outra coisa: ela
         * datava marcos e, ao datá-los, dispensava a página de contar ideação,
         * jornada e ciclo de vida em prosa — a cronologia parecia a narrativa
         * inteira quando era só o índice dela.
         *
         * **O que ficou órfão está listado para o autor**: as quatro dores da
         * ideação, os dois rascunhos de interface, o lançamento de mai/2025 com os
         * cinco módulos do deck, e a janela de produção com as 5 operações. O NPS com
         * a fonte, a virada de 15 para mais de 200 usuários e a contagem de operações
         * deixaram de ser órfãos: vivem no bloco de prova, que agora abre a página.
         *
         * `Build.milestones` **fica no conteúdo**, porque a home ainda desenha a
         * faixa. Ver `Cases.tsx`.
         */}

        {/* Logo depois da faixa porque as duas contam tempo, e nesta ordem: a
            faixa diz quando cada coisa aconteceu, a tira mostra o que aconteceu
            com a tela. Invertido, a comparação chegaria antes de existir uma
            linha do tempo onde encaixá-la. */}
        {build.uiEvolution && (
          <FadeIn delay={0.06}>
            <section className="mt-section lg:mt-beat">
              <h2 className="measure text-h1 font-extrabold text-ink">
                {build.uiEvolution.title}
              </h2>
              <p className="measure mt-gap text-body-lead text-ink">
                {build.uiEvolution.lead}
              </p>
              <UiEvolution data={build.uiEvolution} />
            </section>
          </FadeIn>
        )}

        {/* A seção de origem saía aqui, entre a cronologia e os módulos. Ela caiu
            quando as jornadas passaram a viver dentro do módulo que explicam — ver
            a nota no lugar do campo `origin`, em `content/index.ts`. */}
        {build.pieces && (
          <FadeIn delay={0.06}>
            <section className="mt-section lg:mt-beat">
              <h2 className="text-h1 font-extrabold text-ink">
                {t.casePage.piecesTitle}
              </h2>

              {/* Empilhados e separados por fio, não em três colunas de cartão. A
                  grade de três daria a cada módulo a mesma largura e a mesma
                  altura, que é a fileira de cartões iguais que o contrato de
                  direção recusa — e ainda apertaria a explicação, que é a única
                  coisa que esta página tem a mais que a home. */}
              <ul className="mt-block flex flex-col gap-section lg:gap-beat">
                {build.pieces.map((piece, i) => (
                  <PieceCard
                    key={piece.name}
                    piece={piece}
                    index={i}
                    labels={{
                      prev: t.casePage.journeyPrev,
                      next: t.casePage.journeyNext,
                    }}
                  />
                ))}
              </ul>

              <p className="mt-gap text-body-sm text-ink-soft">
                {t.casePage.numbersSource}
              </p>
            </section>
          </FadeIn>
        )}

        {/* O método, depois dos módulos e antes do custo. A ordem é o argumento:
            o que eu construí, como eu continuei decidindo o que construir, e o que
            essa decisão custou. Antes dos módulos ele seria método sem objeto. */}
        {/* A convergência vem logo depois dos módulos porque é o que eles têm em
            comum, e antes do método porque é resultado de decisão e não de processo.
            Ler os três módulos e só então descobrir que eles desembocam no mesmo
            lugar é a ordem certa: a informação não faz sentido antes de existirem
            três coisas para convergir. */}
        {build.convergence && (
          <FadeIn delay={0.06}>
            <section className="mt-section lg:mt-beat">
              <h2 className="measure text-h1 font-extrabold text-ink">
                {build.convergence.title}
              </h2>
              <div className="mt-gap flex flex-col gap-gap">
                {build.convergence.body.map((paragraph) => (
                  <p key={paragraph} className="measure text-body-lead text-ink">
                    <Rich text={paragraph} />
                  </p>
                ))}
              </div>

              {/* Os três em fio à esquerda, o mesmo desenho das decisões: são itens
                  dentro de um argumento, não três cartões equivalentes. */}
              <ul className="mt-block flex flex-col gap-gap">
                {build.convergence.items.map((item) => (
                  <li
                    key={item.name}
                    className="measure border-l border-hairline pl-gap text-body"
                  >
                    <span className="font-bold text-ink">{item.name}</span>
                    <span className="text-ink-soft"> — {item.detail}</span>
                  </li>
                ))}
              </ul>
            </section>
          </FadeIn>
        )}

        {build.discovery && (
          <FadeIn delay={0.06}>
            <section className="mt-section lg:mt-beat">
              <h2 className="measure text-h1 font-extrabold text-ink">
                {build.discovery.title}
              </h2>
              <div className="mt-gap flex flex-col gap-gap">
                {build.discovery.body.map((paragraph) => (
                  <p key={paragraph} className="measure text-body-lead text-ink">
                    <Rich text={paragraph} />
                  </p>
                ))}
              </div>

              {build.discovery.results && (
                <ResultList results={build.discovery.results} />
              )}
            </section>
          </FadeIn>
        )}

        {/* O custo da decisão. **Só aparece quando existir texto** — seção com
            título e sem conteúdo seria a promessa quebrada em tamanho de título,
            pior que a ausência. Enquanto o `tradeoff` estiver vazio, a página
            termina no convite abaixo. */}
        {/* A PROVA SAIU DAQUI e subiu para logo depois do cabeçalho. Ela fechava a
            página, entre o método e o custo, e o argumento era de narrativa: os
            números valem mais depois de o leitor saber o que foi construído. O que
            derrubou isso foi a leitura real — quem chega por link de currículo
            decide em segundos se continua, e a prova era a única coisa da página
            capaz de segurar essa pessoa. Enterrada a três rolagens de distância, ela
            só era encontrada por quem já tinha sido convencido. */}

        {build.tradeoff && (
          <FadeIn delay={0.06}>
            <section className="mt-section lg:mt-beat">
              <h2 className="text-h1 font-extrabold text-ink">
                {t.casePage.tradeoffTitle}
              </h2>
              <div className="mt-gap flex flex-col gap-gap">
                {build.tradeoff.map((paragraph) => (
                  <p key={paragraph} className="measure text-body-lead text-ink">
                    <Rich text={paragraph} />
                  </p>
                ))}
              </div>
            </section>
          </FadeIn>
        )}

        <FadeIn delay={0.06}>
          <section className="mt-section lg:mt-beat">
            <h2 className="measure text-h1 font-extrabold text-ink">
              {t.casePage.closingTitle}
            </h2>
            <p className="measure mt-3 text-body text-ink-soft">
              {t.casePage.closingBody}
            </p>
            <Link
              to="/#contact"
              className="group tap-h mt-block inline-flex items-center text-h2 font-extrabold text-royal"
            >
              <span className="case-underline inline-flex items-center gap-3 pb-2">
                {t.casePage.closingCta}
                <ArrowRight
                  className="size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden
                />
              </span>
            </Link>
          </section>
        </FadeIn>
      </Container>
    </article>
  )
}
