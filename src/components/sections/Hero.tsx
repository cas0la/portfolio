import { MapPin } from 'lucide-react'
import { Container } from '@/components/primitives/Container'
import { FadeIn } from '@/components/primitives/FadeIn'
import { Rich } from '@/components/primitives/Rich'
import { useLocale } from '@/lib/i18n'
import { copyFor } from '@/content'

/**
 * Abertura em primeira pessoa, centrada, ocupando quase uma tela. É o primeiro
 * momento da narrativa e não divide atenção com nada.
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
 * O convite a descer é discreto de propósito: texto pequeno e uma seta fina que
 * se move devagar. A versão anterior usava círculo azul cheio com texto em
 * negrito e competia com o próprio título.
 *
 * O parágrafo usa ênfase colorida (`++royal++` e `==roxo==`, ver `Rich`) porque
 * quem lê o hero em quatro segundos lê só as palavras coloridas, e elas precisam
 * somar a proposta: roadmap, IA e a interface desenhada por ele mesmo. Teto de
 * três trechos coloridos, um deles em roxo. Palavra "construir" saiu do hero:
 * virou buzzword de PM, e o que ela queria dizer agora está em "craft".
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
       * A altura e o deslocamento estão calibrados para o ponto mais claro cair
       * dentro do pé do hero, cerca de 140px acima da borda, e o gradiente já
       * chegar a zero pouco depois dela. Numa versão anterior o foco caía 130px
       * *abaixo* da borda, então a seção seguinte começava dentro da luz e o autor
       * apontou aperto entre o fade e o conteúdo de baixo.
       */}
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute inset-x-0 -bottom-[120px] h-[520px]"
      />

      {/*
       * `justify-center` com `pb-beat` no mesmo elemento se anulavam: o conteúdo
       * centralizava dentro de uma caixa com 160px de padding embaixo, então ele
       * subia e sobrava um vão morto acima da seção seguinte. O respiro entre
       * seções agora é padding da `section`, e aqui o padding é simétrico, que é
       * a única forma de centralizar de verdade.
       */}
      <Container className="relative flex min-h-[86svh] flex-col items-center justify-center py-block text-center">
        <FadeIn immediate>
          <h1 className="text-balance text-display font-extrabold text-ink">
            {t.hero.greeting}
            <span className="text-royal">.</span>
          </h1>
        </FadeIn>

        {/* Assinatura de papel: o cargo e o lugar numa linha só.
            Antes eram dois blocos centrados separados, e o cargo vinha em `text-h2`.
            Grande daquele jeito ele disputava hierarquia com o próprio nome, e a
            versão longa ("em produto digital desde 2016") repetia o que o Sobre já
            conta. Aqui o cargo é a única coisa em `ink`, que é o que o faz ser lido
            em segundo, sem precisar de corpo maior. */}
        <FadeIn immediate delay={0.06}>
          {/* O ponto separador viaja junto do lugar, não solto entre os dois
              blocos. Solto, ele era um item de flex por conta própria e ficava
              pendurado no fim da primeira linha quando a linha quebrava no
              telefone. Agora, se quebrar, ele desce com "Florianópolis". */}
          <p className="mt-4 flex flex-wrap items-center justify-center gap-y-1 text-body">
            <span className="font-semibold text-ink">{t.hero.role}</span>
            <span className="inline-flex items-center gap-1.5 text-ink-soft">
              <span aria-hidden className="px-2.5 text-hairline-strong">
                ·
              </span>
              <MapPin className="size-4 shrink-0 text-violet" aria-hidden />
              {t.hero.location}
            </span>
          </p>
        </FadeIn>

        <FadeIn immediate delay={0.12}>
          <p className="measure mx-auto mt-gap text-balance text-body text-ink-soft">
            <Rich text={t.hero.lead} />
          </p>
        </FadeIn>

        {/*
         * Convite a descer: o rótulo e um fio azul de 2px que desaparece para
         * baixo. Sem glifo nenhum.
         *
         * Duas versões caíram antes desta. A primeira era rótulo pequeno com uma
         * seta solta, e o autor achou pouco atrativa. A segunda punha a seta do
         * lucide sobre um fio de 1px, e a haste vertical da própria seta
         * (`M12 5v14`) encostava no fio: dois traços de espessura e cor
         * diferentes, desalinhados em subpixel, que liam como glitch na tela.
         *
         * Sem glifo o problema deixa de existir, e o fio sozinho já diz que a
         * página continua. O convite virou hover em vez de laço, então o site não
         * tem mais nenhum movimento em loop.
         *
         * O crescimento é `scaleY`, não `height`: o hero é centralizado no eixo
         * vertical, e mudar a altura de um filho recentraria o bloco inteiro a
         * cada hover.
         */}
        <FadeIn immediate delay={0.26}>
          <a
            href="#cases"
            className="group mt-block inline-flex flex-col items-center gap-3.5 text-body-sm text-ink-soft transition-colors hover:text-royal"
          >
            <span className="underline-draw">{t.hero.ctaBuilds}</span>
            <span
              aria-hidden
              className="cue-rail block h-12 w-[3px] origin-top rounded-full transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-[1.4]"
            />
          </a>
        </FadeIn>
      </Container>
    </section>
  )
}
