import { Image as ImageIcon } from 'lucide-react'
import type { Build } from '@/content'

/*
 * Capa de case.
 *
 * As capas serão imagens feitas pelo Lucas. Enquanto os arquivos não existem,
 * cada case mostra um placeholder calmo, que se assume placeholder em vez de
 * fingir ser arte. Uma versão anterior trazia composições autorais em SVG por
 * case; elas saíram porque capa autoral minha competiria com a capa real dele.
 *
 * Para ligar uma capa: exporte em 16:10 (por exemplo 1600x1000), solte em
 * `public/assets/cases/` e preencha `cover` no item do case em
 * `src/content/index.ts`, com `src` e `alt` nos dois idiomas. O `alt` descreve o
 * que a imagem mostra; se ela for puramente decorativa, use string vazia.
 */

export function CaseCover({
  build,
  interactive = false,
}: {
  build: Build
  /** aplica o leve zoom no hover, quando o case inteiro é um link */
  interactive?: boolean
}) {
  /*
   * Sem arquivo, a reserva não é 16:10, é uma faixa curta.
   *
   * Reservar a proporção final para cinco cases deixava cerca de 1.500px dos
   * 6.000px da página como caixa cinza vazia, e um site pronto passava a ler como
   * wireframe justo para o público que rola a página inteira. A faixa mantém o
   * lugar reconhecível e devolve o ritmo da página para o espaçamento, que é quem
   * deveria estar carregando ele.
   *
   * Quando o `cover` chegar, a proporção definitiva volta sozinha.
   */
  if (!build.cover) {
    return (
      <div className="grid h-24 w-full place-items-center rounded-lg bg-surface-soft">
        <ImageIcon className="size-6 text-hairline-strong" aria-hidden />
      </div>
    )
  }

  return (
    // Proporção travada em 16:10. Sem max-height: combinada com aspect-ratio ela
    // encolhe a largura da caixa em vez de recortar, e sobra vão morto ao lado.
    <div className="aspect-[16/10] w-full overflow-hidden rounded-lg bg-surface-soft">
      <img
        src={build.cover.src}
        alt={build.cover.alt}
        loading="lazy"
        decoding="async"
        className={`size-full object-cover ${
          interactive
            ? 'transition-transform duration-700 ease-out group-hover:scale-[1.03]'
            : ''
        }`}
      />
    </div>
  )
}
