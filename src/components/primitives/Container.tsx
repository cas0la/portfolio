import type { ReactNode } from 'react'

/**
 * Largura total com padding lateral fluido: ~124px em desktop/notebook,
 * encolhendo no mobile. Sem max-width central: o layout ocupa quase toda a
 * largura. Quebras de linha de texto são controladas por max-width no próprio
 * elemento de texto, não no container.
 */
export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`w-full px-[clamp(1.25rem,_10vw,_124px)] ${className}`}>
      {children}
    </div>
  )
}
