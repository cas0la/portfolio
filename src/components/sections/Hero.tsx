import { ChevronDown, MapPin } from 'lucide-react'
import { Container } from '@/components/primitives/Container'
import { FadeIn } from '@/components/primitives/FadeIn'
import { Rich } from '@/components/primitives/Rich'
import { useLocale } from '@/lib/i18n'
import { copyFor } from '@/content'

/**
 * Abertura, centrada, ocupando a dobra inteira menos o header.
 *
 * A hierarquia é papel antes de pessoa: o `h1` é o cargo, e o `h2` é a
 * apresentação com o apelido. A ordem inversa (nome grande, cargo pequeno abaixo)
 * era a versão anterior, e obrigava quem lê em processo seletivo a passar pela
 * saudação para descobrir do que se trata.
 *
 * O que saiu daqui, e por quê:
 *
 * - **A manchete de produto** da primeira versão, que fazia a página ler como
 *   landing page de empresa.
 * - **O botão de currículo**, que existia duas vezes na página. A versão do
 *   fechamento é a que faz sentido, depois de o visitante ter lido algo.
 * - **O espaço reservado do retrato**, que era um slot vazio esperando arquivo e
 *   quebrava a simetria da abertura. O Sobre já tem lugar para foto.
 *
 * O parágrafo usa `@@` (ver `Rich`), o marcador de cursiva com gradiente, porque
 * quem lê o hero em quatro segundos lê só o que está destacado, e o que está
 * destacado precisa somar a proposta: alcance no ciclo todo, IA com projeto real e
 * a origem em pesquisa e craft. Teto de três trechos.
 */
export function Hero() {
  const { locale } = useLocale()
  const t = copyFor(locale)

  return (
    <section id="top" className="relative scroll-mt-16 pb-[112px] md:pb-beat">
      {/*
       * Clarão que faz a passagem para a seção seguinte. Decorativo.
       *
       * Ele atravessa a borda de baixo da seção de propósito: a primeira versão
       * tinha o foco do radial em `50% 100%`, ou seja, o ponto mais claro caía
       * exatamente na borda do elemento e era cortado ali, o que desenhava uma
       * linha horizontal visível. Agora o foco está no centro do próprio bloco e
       * o gradiente termina em transparente antes de qualquer borda, então não há
       * onde cortar. Nenhum ancestral pode ganhar `overflow-hidden`, senão o
       * corte volta.
       *
       * A calibragem mudou junto com o convite a descer. O ponto mais claro agora
       * cai **em cima do convite**, no pé da dobra, que é o pedido do autor: o
       * convite e a luz são a mesma passagem, e antes a luz vinha ~170px acima
       * dele, na altura do parágrafo. Com `h-[560px]` e `-bottom-[72px]`, o foco
       * fica a 208px da borda da seção, que é exatamente onde o `pb-beat` começa,
       * e a parada de 70% do radial leva o gradiente a zero pouco antes da borda.
       */}
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute inset-x-0 -bottom-[72px] h-[560px]"
      />

      {/*
       * Duas faixas: o bloco de texto centrado no espaço que sobra, e o convite
       * ancorado embaixo.
       *
       * `flex-1` no primeiro filho, e não `justify-center` no Container, é o que
       * permite as duas coisas ao mesmo tempo. Com `justify-center` o convite
       * seria só o último item de uma pilha centrada, e ficaria no meio da tela —
       * era o comportamento anterior. E `justify-center` junto com padding
       * assimétrico se anulam: o conteúdo centraliza dentro da caixa já
       * deslocada, então sobra vão morto de um lado.
       *
       * A altura é a dobra menos o header (`py-3.5` mais o conteúdo dele, ~72px),
       * porque o convite só cumpre a função se estiver visível sem rolar. Os 86svh
       * de antes punham o pé do hero abaixo da linha d'água.
       *
       * NOTA: 4.5rem é a altura do header medida, não lida. Se o header mudar de
       * altura, isto e o `scroll-mt-16` das seções saem de sincronia — os dois
       * deveriam ler a mesma variável.
       */}
      <Container className="relative flex min-h-[calc(100svh-4.5rem)] flex-col py-block text-center">
        {/* `hero-measure` no wrapper, não em cada filho: é o que faz título,
            apresentação e parágrafo quebrarem no mesmo eixo. Ver a classe em
            index.css para o problema que ela resolve. */}
        <div className="hero-measure mx-auto flex flex-1 flex-col items-center justify-center">
          {/* O cargo vem em itálico de serifa com gradiente e o resto da frase em
              grotesca de peso 500. O peso baixo é o que deixa o contraste de família
              aparecer: em extrabold, a grotesca engrossava tanto que o itálico ao
              lado lia como corpo menor, e as duas metades da frase brigavam. */}
          <FadeIn immediate>
            <h1 className="text-balance text-display font-medium text-ink">
              <Rich text={t.hero.headline} />
            </h1>
          </FadeIn>

          {/* Apresentação e lugar na mesma linha. Antes eram dois blocos centrados
              pequenos, um debaixo do outro, disputando o mesmo espaço.

              O separador é o ponto médio com o alfinete, e não o hífen do texto
              original: hífen entre uma frase e um topônimo lê como palavra
              composta partida no fim da linha. E o ponto viaja junto do lugar, não
              solto entre os dois blocos — solto, ele era um item de flex por conta
              própria e ficava pendurado no fim da primeira linha quando a linha
              quebrava no telefone. */}
          {/* `text-body-lead` (20px), não `text-h2` (20 a 24px). O autor apontou
              "subtítulo ficou enorme, desequilibra demais", e estava certo: em
              `text-h2` esta linha chegava a 24px, e uma frase inteira nesse corpo
              logo abaixo do display disputa a hierarquia em vez de servi-la. O
              degrau agora vem do corpo (56 → 20 → 16px) e da cor. */}
          <FadeIn immediate delay={0.06}>
            <p className="mt-gap flex flex-wrap items-center justify-center gap-y-2 text-body-lead text-ink">
              <span>{t.hero.greeting}</span>
              <span className="inline-flex items-center gap-2 text-ink-soft">
                <span aria-hidden className="px-2 text-hairline-strong">
                  ·
                </span>
                <MapPin className="size-4 shrink-0 text-violet" aria-hidden />
                {t.hero.location}
              </span>
            </p>
          </FadeIn>

          {/* Sem `.measure` e sem `text-balance`: a largura já vem da coluna do
              hero, e `text-balance` num parágrafo de quatro frases iguala o
              comprimento das linhas ao custo de deixar a última muito curta. Ele
              serve título, não corpo. */}
          <FadeIn immediate delay={0.12}>
            <p className="mt-block text-body text-ink-soft">
              <Rich text={t.hero.lead} />
            </p>
          </FadeIn>
        </div>

        {/*
         * Convite a descer, no pé da dobra: o rótulo e uma seta que sobe e desce
         * devagar (ver `.cue-arrow`).
         *
         * Três versões caíram antes desta. Rótulo com seta solta, que o autor
         * achou pouco atrativa. Seta do lucide sobre um fio de 1px, em que a haste
         * vertical da própria seta (`M12 5v14`) encostava no fio e os dois traços,
         * de espessura e cor diferentes, liam como glitch. E a barra royal de 3px
         * sem glifo, que resolvia o glitch mas era estática e ambígua.
         *
         * O que faz a seta funcionar agora é a posição: no meio da tela ela
         * precisava do fio para dizer "para baixo", no pé da dobra o próprio lugar
         * já diz, e o movimento confirma.
         *
         * O rótulo subiu de `text-body-sm`/`ink-soft` para `text-body`/`ink` quando
         * ele deixou de nomear o destino e passou a dizer por onde começar. Em 14px
         * cinza, uma frase desse tamanho lia como legenda de rodapé, e legenda não
         * convida. Continua sendo link de texto com sublinhado, e não botão: o
         * DESIGN.md reserva botão para o currículo, e o hero convida a descer, não a
         * baixar.
         */}
        <FadeIn immediate delay={0.26}>
          <a
            href="#cases"
            className="group inline-flex flex-col items-center gap-4 text-body text-ink transition-colors hover:text-royal"
          >
            <span className="underline-draw">{t.hero.ctaBuilds}</span>
            {/* 16px de folga, não 8: a seta desce 6px no laço, e com 8px de
                intervalo ela chegava a 2px do sublinhado do rótulo no ponto mais
                baixo, o que lê como colisão. */}
            <ChevronDown
              aria-hidden
              strokeWidth={1.75}
              className="cue-arrow size-6 text-royal transition-colors group-hover:text-violet"
            />
          </a>
        </FadeIn>
      </Container>
    </section>
  )
}
