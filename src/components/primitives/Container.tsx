import type { ReactNode } from 'react'

/**
 * Container de leitura. Teto de 1280px, centrado, com respiro lateral de 24px no
 * telefone e 48px acima de md.
 *
 * O template original era de largura total sem teto. O requisito de leitura
 * limpa pede medida controlada: linha longa demais é o jeito mais rápido de
 * tornar texto denso cansativo.
 *
 * O respiro vem da classe `container-pad` (em index.css) e não de utilitários,
 * porque ele precisa respeitar `env(safe-area-inset-*)` com media query. Feito em
 * estilo inline, ele anulava o padding maior do desktop, já que inline não tem
 * breakpoint.
 *
 * Histórico que vale guardar: uma versão usava `px-stud`, token que foi
 * renomeado, e as classes viraram inválidas. O container ficou sem padding
 * nenhum, e isso só aparecia abaixo de 1280px de viewport, porque acima disso o
 * próprio teto de largura cria a margem.
 */
export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`container-pad mx-auto w-full max-w-[1280px] ${className}`}>
      {children}
    </div>
  )
}
