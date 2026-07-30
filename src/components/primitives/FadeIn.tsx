import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type FadeInProps = {
  children: ReactNode
  /** atraso em segundos, para escalonar uma lista */
  delay?: number
  /** anima na montagem, sem esperar entrar na viewport (use acima da dobra) */
  immediate?: boolean
  className?: string
}

const DISTANCE = 14
const DURATION = 0.42
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Entrada suave: fade e subida curta.
 *
 * Duas decisões deliberadas aqui, as duas por robustez:
 *
 * 1. Animação em CSS, não em JS. Uma versão anterior usava animação em JS e
 *    travava no primeiro frame, deixando o hero inteiro invisível.
 * 2. Estilo inline, não classe. As regras de atributo em `@layer components`
 *    chegavam pela metade no navegador (o `transition` valia, o estado final
 *    não), e estilo inline não depende da cascata.
 *
 * Em qualquer caminho de falha o elemento fica visível: sem JS, sem
 * IntersectionObserver ou com o efeito não executado, nenhum estilo é aplicado.
 * Animação de entrada é decorativa e não pode ser capaz de esconder conteúdo.
 */
export function FadeIn({ children, delay = 0, immediate = false, className }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'idle' | 'pending' | 'in'>('idle')

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Quem pede menos movimento, e navegador sem IntersectionObserver, recebem o
    // conteúdo direto no lugar.
    if (prefersReducedMotion()) return
    if (!immediate && typeof IntersectionObserver === 'undefined') return

    setState('pending')

    if (immediate) {
      // Dois frames de folga: o estado inicial precisa ser pintado antes de a
      // transição começar, senão o navegador pula direto para o final.
      let inner = 0
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setState('in'))
      })
      return () => {
        cancelAnimationFrame(outer)
        cancelAnimationFrame(inner)
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('in')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    )
    io.observe(node)
    return () => io.disconnect()
  }, [immediate])

  const style: CSSProperties | undefined =
    state === 'idle'
      ? undefined
      : {
          opacity: state === 'in' ? 1 : 0,
          transform: state === 'in' ? 'none' : `translateY(${DISTANCE}px)`,
          transition: `opacity ${DURATION}s ${EASE} ${delay}s, transform ${DURATION}s ${EASE} ${delay}s`,
          willChange: state === 'pending' ? 'opacity, transform' : undefined,
        }

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
