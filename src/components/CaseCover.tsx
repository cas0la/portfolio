import { Image as ImageIcon } from 'lucide-react'
import { copyFor, type Build } from '@/content'
import { useLocale } from '@/lib/i18n'

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

/**
 * Capa de case em construção.
 *
 * **Ela ocupa o 16:10 inteiro, ao contrário da reserva vazia abaixo.** A faixa
 * curta existe para não deixar buraco cinza na página; esta capa não é buraco, é
 * conteúdo — ela diz em que estado o trabalho está. Encolhê-la para 96px faria o
 * card parecer inacabado, que é exatamente o que a marca de estado veio evitar.
 *
 * O tramado é `repeating-linear-gradient` em fio de cabelo, não listra de obra em
 * amarelo e preto: a piada de tapume duraria uma visita e brigaria com a paleta
 * inteira. A 45° e a 12px de passo, ele lê como superfície preparada — a hachura
 * de um desenho técnico antes do acabamento — e some assim que a arte real
 * entrar.
 *
 * O numeral do passo vem junto porque ele já é o vocabulário dos cases (`01`,
 * `02`, `03`) e dá âncora visual ao centro, que sem ele seria um rótulo pequeno
 * boiando em 330px de altura.
 */
function ConstructionCover({ build }: { build: Build }) {
  const { locale } = useLocale()
  const t = copyFor(locale)

  return (
    <div className="relative grid aspect-[16/10] w-full place-items-center overflow-hidden rounded-lg border border-hairline bg-surface-soft">
      <div aria-hidden className="case-hatch absolute inset-0" />
      <div className="relative flex flex-col items-center gap-3">
        <span className="font-display text-num font-extrabold text-hairline-strong">
          {build.step}
        </span>
        <span className="label text-ink-soft">{t.builds.coverConstruction}</span>
      </div>
    </div>
  )
}

export function CaseCover({
  build,
  interactive = false,
}: {
  build: Build
  /** aplica o leve zoom no hover, quando o case inteiro é um link */
  interactive?: boolean
}) {
  if (!build.cover && build.wip) return <ConstructionCover build={build} />

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
