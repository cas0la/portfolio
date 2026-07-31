import { useLocale } from '@/lib/i18n'
import { copyFor } from '@/content'
import type { Milestone } from '@/content'

/**
 * O painel de evolução do case de destaque: a vida do produto em marcos datados.
 *
 * **Ele já foi uma imagem, e deixou de ser.** A primeira versão era um JPEG de
 * 2100x640 composto fora do site. Ela morria no telefone — a faixa encolhia para
 * cerca de 104px de altura e as cinco estações viravam borrão — e não havia
 * conserto dentro do formato: `object-position` só escolheria qual metade da
 * cronologia sacrificar, e uma segunda arte vertical seria uma peça a manter em
 * sincronia com a primeira para sempre.
 *
 * Como componente, a mesma cronologia é faixa horizontal acima de `lg` e lista
 * vertical abaixo, e cada marco continua legível nas duas. O que se ganhou junto
 * foi semântica: cada estação é `<li>` de uma lista ordenada com `<time>` real, e
 * quem usa leitor de tela navega marco a marco em vez de ouvir um `alt` de cinco
 * linhas.
 *
 * **O que se perdeu, e é honesto registrar:** deixou de existir uma peça
 * exportável. Se o autor quiser a faixa como imagem para LinkedIn ou apresentação,
 * ela vira uma exportação à parte, não a fonte.
 *
 * **Faixa escura, a única da página.** O site é claro de ponta a ponta, e a banda
 * em tinta faz a seção de cases ser o pico visual — que é o que ela deve ser, já
 * que é a seção que sustenta a candidatura. Também é prático: as telas do produto
 * são claras, e sobre papel elas precisariam de borda para se separar do fundo.
 * Sobre tinta, saltam sozinhas.
 */

/**
 * Proporção de largura de cada estação na faixa horizontal.
 *
 * Elas não são iguais, e é a decisão central da peça: **cinco painéis do mesmo
 * tamanho dizem que os cinco momentos pesam igual**, e a história é o contrário.
 * A ideação e os dois rascunhos são nota de rodapé; setembro de 2025 é o assunto.
 */
const SPAN: Record<string, string> = {
  pains: 'lg:flex-[2]',
  single: 'lg:flex-[1]',
  modules: 'lg:flex-[1.9]',
  group: 'lg:flex-[3.4]',
  score: 'lg:flex-[1.5]',
}

/**
 * A mesma hierarquia, no telefone.
 *
 * Abaixo de `lg` a cronologia vira lista, e a primeira versão dava a todas as
 * estações a mesma coluna de arte de 108px ao lado da legenda. Isso apagava a
 * decisão que o `SPAN` toma acima: os três mockups de produção se dividiam em
 * 108px e ficavam com cerca de 40px cada, a lista de dores tinha 88px de texto
 * útil para frases de cinco palavras, e o medidor encolhia enquanto o número
 * dentro dele ficava do mesmo tamanho e transbordava o arco.
 *
 * **Largura igual no telefone é uma afirmação, não um padrão neutro:** ela diz
 * que os cinco momentos pesam o mesmo, que é exatamente o que a faixa horizontal
 * foi desenhada para negar. As três estações com peso ocupam a coluna inteira, a
 * arte por cima da legenda como acima de `lg`; as duas capturas avulsas, que são
 * nota de rodapé nas duas orientações, seguem compactas ao lado do texto.
 */
const WIDE = new Set(['pains', 'modules', 'group', 'score'])

function kindOf(m: Milestone) {
  if (m.pains) return 'pains'
  if (m.modules) return 'modules'
  if (m.score) return 'score'
  return m.shots && m.shots.length > 1 ? 'group' : 'single'
}

/**
 * Uma captura, na moldura do sistema.
 *
 * Proporção `3/5` com recorte pelo topo. Tela de produto tem a identidade no
 * cabeçalho e na primeira ação; recortar pelo centro entregaria o miolo da lista,
 * que é onde todas as telas se parecem.
 */
function Shot({ shot }: { shot: { src: string; alt: string } }) {
  return (
    <img
      src={shot.src}
      alt={shot.alt}
      loading="lazy"
      decoding="async"
      className="evo-shot aspect-[3/5] w-full rounded-md bg-white object-cover object-top"
    />
  )
}

/**
 * O marco de ideação, em tipografia.
 *
 * Era a captura do slide da primeira apresentação interna, e o autor pediu a troca:
 * o slide é verde da marca antiga e punha uma quarta família de cor na peça, ao
 * lado do cinza do lo-fi, do roxo do produto e do royal do painel. Ver o comentário
 * de `Milestone.pains` no conteúdo para o que a troca custa.
 */
function Pains({ items }: { items: string[] }) {
  return (
    <ul className="flex w-full flex-col gap-3">
      {items.map((pain) => (
        <li
          key={pain}
          className="border-l-2 border-violet-lift/60 pl-4 text-body-sm text-white/75"
        >
          {pain}
        </li>
      ))}
    </ul>
  )
}

/**
 * Os módulos no ar num marco, no mesmo desenho das dores e em royal.
 *
 * **A troca de cor é a diferença entre motivo e resultado.** Roxo abre a faixa
 * dizendo o que doía; royal, que é a cor das datas e do que este site trata como
 * feito, diz o que existiu. Sem isso, duas listas idênticas em pontos diferentes
 * da linha pareceriam a mesma informação repetida.
 *
 * `gap-2.5` e não `gap-3`: são cinco itens contra três, e no mesmo bloco de 248px
 * o espaçamento das dores estouraria a altura da estação.
 */
function Modules({ items }: { items: string[] }) {
  return (
    <ul className="flex w-full flex-col gap-2.5">
      {items.map((mod) => (
        <li
          key={mod}
          className="border-l-2 border-royal-lift/60 pl-4 text-body-sm text-white/75"
        >
          {mod}
        </li>
      ))}
    </ul>
  )
}

/**
 * O número que fecha a linha.
 *
 * Desenhado em SVG e tipografado no sistema, e **não** o widget do provedor: o
 * medidor original é verde-água, que não é cor deste site nem deste produto, e era
 * a única peça da composição anterior que não falava a língua da página.
 *
 * O arco é `aria-hidden` porque o valor já está no texto ao lado; anunciar os dois
 * faria o leitor de tela dizer o número duas vezes.
 */
function Score({ score }: { score: NonNullable<Milestone['score']> }) {
  /* -100 a 100 mapeado no semicírculo. O arco de raio 84 mede π·84 ≈ 264; o
     deslocamento é a fração que falta para chegar ao valor.

     `value` é string porque é texto de tela e chega com sinal ("+85"). `Number`
     lê o `+` inicial sem reclamar, então o arco continua certo — mas quem trocar
     o formato precisa manter algo que `Number` saiba ler. */
  const span = Number(score.max) - Number(score.min)
  const fraction = (Number(score.value) - Number(score.min)) / span
  const LENGTH = 264

  /*
   * O número mora dentro do arco, e por isso os dois têm que encolher juntos.
   *
   * O SVG é fluido (`w-full`) e o número era chumbado em 52px: bastava a coluna
   * ficar mais estreita que 196px para o arco descer até debaixo dos algarismos e
   * "+85" transbordar dos dois lados. Era o que acontecia no telefone.
   *
   * A correção é `evo-score` declarar um contêiner e o número ser medido em `cqi`,
   * a mesma unidade que o arco usa implicitamente. 26.5cqi é 52px em 196px — a
   * proporção do desenho aprovado, agora mantida em qualquer largura. Unidade de
   * viewport não serviria: ela não sabe nada da coluna onde o medidor está.
   */
  return (
    <div className="evo-score w-full max-w-[196px]">
      <div className="relative">
        <svg viewBox="0 0 200 108" className="w-full" aria-hidden focusable="false">
          <path
            d="M16 100 A 84 84 0 0 1 184 100"
            fill="none"
            stroke="rgba(255,255,255,.14)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M16 100 A 84 84 0 0 1 184 100"
            fill="none"
            stroke="var(--color-royal-lift)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={LENGTH}
            strokeDashoffset={LENGTH * (1 - fraction)}
          />
        </svg>
        <span className="evo-score-value absolute inset-x-0 bottom-0 text-center font-display font-extrabold leading-none tracking-[-.03em] text-white">
          {score.value}
        </span>
      </div>
      <div className="mt-2 flex justify-between text-body-sm font-semibold text-white/35">
        <span className="tnum">{score.min}</span>
        <span className="tnum">{score.max}</span>
      </div>
    </div>
  )
}

function Art({ milestone }: { milestone: Milestone }) {
  if (milestone.pains) return <Pains items={milestone.pains} />
  if (milestone.modules) return <Modules items={milestone.modules} />
  if (milestone.score) return <Score score={milestone.score} />

  const shots = milestone.shots ?? []
  if (!shots.length) return null

  /* Uma captura só: teto de largura para ela não virar pôster quando a estação
     recebe mais espaço do que precisa. */
  if (shots.length === 1) {
    return (
      <div className="w-full max-w-[124px]">
        <Shot shot={shots[0]} />
      </div>
    )
  }

  /*
   * Três capturas sobrepostas, com a do meio maior e à frente.
   *
   * Sobreposição em vez de três estações separadas porque **são três módulos de um
   * produto só**, e separá-las contaria que o produto virou três coisas. Dentro do
   * grupo, três telas do mesmo tamanho viravam uma mancha; a do meio cresce e sobe
   * para haver uma que se lê primeiro.
   *
   * As margens negativas fazem a sobreposição, e é por isso que o grupo não usa
   * `gap`.
   */
  return (
    <div className="flex w-full items-end">
      <div className="w-[31%] shrink-0 translate-y-3">
        <Shot shot={shots[0]} />
      </div>
      <div className="z-10 -mx-[3.5%] w-[38%] shrink-0">
        <Shot shot={shots[1]} />
      </div>
      <div className="w-[31%] shrink-0 translate-y-3">
        <Shot shot={shots[2]} />
      </div>
    </div>
  )
}

export function EvolutionPanel({ milestones }: { milestones: Milestone[] }) {
  const { locale } = useLocale()
  const t = copyFor(locale)

  return (
    <div className="rounded-lg bg-ink px-gap py-block md:px-block">
      <ol
        aria-label={t.builds.timelineLabel}
        className="flex flex-col gap-block lg:flex-row lg:gap-gap"
      >
        {milestones.map((m) => {
          const kind = kindOf(m)

          return (
            <li
              key={m.iso}
              className={`evo-item ${WIDE.has(kind) ? 'evo-item--wide' : ''} ${SPAN[kind]}`}
            >
              {/*
               * A arte tem altura fixa acima de `lg`, e não `flex-1`. Com `flex-1` a
               * altura de cada arte dependeria da altura da legenda abaixo dela, as
               * legendas têm alturas diferentes, e o trilho deixaria de ser uma linha
               * reta. Altura fixa é o que garante que os cinco nós caiam na mesma
               * horizontal.
               */}
              <div className="evo-art">
                <Art milestone={m} />
              </div>

              <div className="evo-meta">
                {/*
                 * `<time>` com `datetime` real: a data é dado, não enfeite.
                 *
                 * Quando o marco é período, são dois `<time>` e não uma etiqueta
                 * escrita "Set 2025 – Mar 2026": só assim cada extremo continua
                 * sendo uma data que a máquina lê. O travessão fica fora dos dois e
                 * sai da árvore de acessibilidade — quem ouve a linha recebe as duas
                 * datas, e "traço" no meio não acrescenta nada.
                 */}
                <p className="label text-royal-lift">
                  <time dateTime={m.iso}>{m.when}</time>
                  {m.until && (
                    <>
                      <span aria-hidden> – </span>
                      <time dateTime={m.untilIso}>{m.until}</time>
                    </>
                  )}
                </p>
                <h4 className="mt-2 text-h3 font-extrabold text-white">{m.title}</h4>
                {m.note && <p className="mt-1 text-body-sm text-white/55">{m.note}</p>}
                {/* A procedência do número, declarada. O site declara origem em todo
                    número que publica, e NPS sem fonte pesa menos justamente para
                    quem sabe ler NPS. */}
                {m.score && (
                  <p className="mt-1 text-body-sm text-white/40">{m.score.source}</p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
