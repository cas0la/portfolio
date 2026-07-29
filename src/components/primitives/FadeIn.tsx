import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { ease, duration } from '@/lib/motion'

type FadeInProps = {
  children: ReactNode
  /** atraso em segundos (use com stagger nas listas) */
  delay?: number
  /** deslocamento vertical inicial em px */
  y?: number
  className?: string
}

/**
 * Entrada padrão do projeto: fade + subida sutil, dispara ao entrar na viewport.
 * Respeita prefers-reduced-motion (renderiza estático). Anima só opacity e transform.
 */
export function FadeIn({ children, delay = 0, y = 16, className }: FadeInProps) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: duration.base, ease: ease.entrance, delay }}
    >
      {children}
    </motion.div>
  )
}
