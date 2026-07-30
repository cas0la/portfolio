import type { ReactNode } from 'react'

/*
 * Destaque dentro de parágrafo.
 *
 * O texto do site vive em `src/content/index.ts` como string simples, para
 * continuar traduzível e fácil de revisar. Para dar ênfase em um trecho sem
 * quebrar isso, as strings aceitam três marcadores, e cada um quer dizer uma
 * coisa diferente:
 *
 * - `**trecho**` — ênfase de tinta. É a prova: número, período, resultado
 *   medido. Fica em `ink` porque número colorido ao lado de número colorido lê
 *   como painel de métrica, e o DESIGN.md proíbe faixa de métrica.
 * - `++trecho++` — afirmação sobre o papel de Product Manager, em royal. É o que
 *   o visitante precisa levar do parágrafo se ler só as palavras coloridas.
 * - `==trecho==` — o que vem da origem em design, em roxo. Segunda voz, sempre
 *   em minoria dentro do parágrafo.
 * - `@@trecho@@` — palavra-chave do hero, em itálico de serifa pintado com o gradiente
 *   royal → roxo. **Só no hero.** É o marcador mais caro da página: muda família,
 *   peso e cor de uma vez, então dois deles fora da abertura já fariam a página
 *   ler como texto promocional. Teto de três por parágrafo, como os outros.
 *
 * Por que cor aqui não lê como link, apesar do risco: link nesta página é texto
 * em `ink` com sublinhado (`underline-draw`) ou é controle com moldura. Trecho
 * colorido, em peso 600 e sem sublinhado, não coincide com nenhum dos dois, e o
 * cursor continua de texto no hover, o que mata a leitura de link no primeiro
 * segundo. O que sustenta a regra é a disciplina de quantidade: no máximo três
 * trechos coloridos por parágrafo, e o roxo aparecendo menos que o azul.
 */

type Emphasis = { open: string; close: string; className: string }

const EMPHASIS: Emphasis[] = [
  { open: '**', close: '**', className: 'font-semibold text-ink' },
  { open: '++', close: '++', className: 'font-semibold text-royal' },
  { open: '==', close: '==', className: 'font-semibold text-violet' },
  { open: '@@', close: '@@', className: 'accent grad-text' },
]

const PATTERN = /(\*\*[^*]+\*\*|\+\+[^+]+\+\+|==[^=]+==|@@[^@]+@@)/g

export function Rich({ text }: { text: string }): ReactNode {
  return text.split(PATTERN).map((part, i) => {
    const match = EMPHASIS.find(
      (e) => part.startsWith(e.open) && part.endsWith(e.close) && part.length > e.open.length * 2,
    )

    if (!match) return part

    return (
      <strong key={i} className={match.className}>
        {part.slice(match.open.length, -match.close.length)}
      </strong>
    )
  })
}
