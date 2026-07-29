import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useAnimate, type Transition } from 'motion/react'

// Letter swap no hover: cada letra troca na vertical, em ordem aleatória.
// Portado do componente do Framer (Originkit) pro stack Vite/motion — herda a
// fonte/cor do elemento pai. Feito pra texto de UMA linha (os nomes dos cases).
//
//   • forward  — toca uma vez no hover-enter (com latch pra não sobrepor runs)
//   • pingpong — forward no enter, reverse no leave
//
// As classes .letter-N / .letter-secondary-N são miradas pelo useAnimate, que
// escopa pelo ref — várias instâncias na página não colidem.

type Props = {
  text: string
  className?: string
  mode?: 'forward' | 'pingpong'
  reverse?: boolean
  staggerDuration?: number
  transition?: Transition
}

export function LetterSwap({
  text,
  className,
  mode = 'pingpong',
  reverse = false,
  staggerDuration = 0.05,
  transition = { type: 'spring', duration: 0.7 },
}: Props) {
  const [scope, animate] = useAnimate()
  const [blocked, setBlocked] = useState(false)

  const shuffleArray = (arr: number[]): number[] => {
    const a = [...arr]
    a.sort(() => Math.random() - 0.5)
    return a
  }
  const mergeDelay = (i: number): Transition => ({
    ...transition,
    delay: i * staggerDuration,
  })

  const debouncedStart = useRef<(() => void) | null>(null)
  const debouncedEnd = useRef<(() => void) | null>(null)
  const timers = useRef<{
    startTimer: ReturnType<typeof setTimeout> | null
    startTrailing: boolean
    endTimer: ReturnType<typeof setTimeout> | null
    endTrailing: boolean
  }>({ startTimer: null, startTrailing: false, endTimer: null, endTrailing: false })

  useEffect(() => {
    // Só letras reais entram no stagger — espaços são pulados.
    const letterIdxs: number[] = []
    for (let k = 0; k < text.length; k++) {
      if (text[k] !== ' ') letterIdxs.push(k)
    }
    const count = letterIdxs.length

    const runForward = () => {
      if (blocked || count === 0) return
      setBlocked(true)
      const order = shuffleArray(letterIdxs)
      for (let i = 0; i < order.length; i++) {
        const idx = order[i]
        const isLast = i === order.length - 1
        animate(`.letter-${idx}`, { y: reverse ? '100%' : '-100%' }, mergeDelay(i)).then(
          () => animate(`.letter-${idx}`, { y: 0 }, { duration: 0 }),
        )
        animate(`.letter-secondary-${idx}`, { top: '0%' }, mergeDelay(i)).then(() =>
          animate(
            `.letter-secondary-${idx}`,
            { top: reverse ? '-100%' : '100%' },
            { duration: 0 },
          ).then(() => {
            if (isLast) setBlocked(false)
          }),
        )
      }
    }

    const runPingStart = () => {
      if (count === 0) return
      const order = shuffleArray(letterIdxs)
      for (let i = 0; i < order.length; i++) {
        const idx = order[i]
        animate(`.letter-${idx}`, { y: reverse ? '100%' : '-100%' }, mergeDelay(i))
        animate(`.letter-secondary-${idx}`, { top: '0%' }, mergeDelay(i))
      }
    }

    const runPingEnd = () => {
      if (count === 0) return
      const order = shuffleArray(letterIdxs)
      for (let i = 0; i < order.length; i++) {
        const idx = order[i]
        animate(`.letter-${idx}`, { y: 0 }, mergeDelay(i))
        animate(
          `.letter-secondary-${idx}`,
          { top: reverse ? '-100%' : '100%' },
          mergeDelay(i),
        )
      }
    }

    const wait = 100
    const t = timers.current
    const startBody = mode === 'pingpong' ? runPingStart : runForward
    const endBody = runPingEnd

    debouncedStart.current = () => {
      if (!t.startTimer) {
        startBody()
        t.startTimer = setTimeout(() => {
          if (t.startTrailing) startBody()
          t.startTrailing = false
          t.startTimer = null
        }, wait)
      } else {
        t.startTrailing = true
      }
    }
    debouncedEnd.current = () => {
      if (!t.endTimer) {
        endBody()
        t.endTimer = setTimeout(() => {
          if (t.endTrailing) endBody()
          t.endTrailing = false
          t.endTimer = null
        }, wait)
      } else {
        t.endTrailing = true
      }
    }

    return () => {
      if (t.startTimer) clearTimeout(t.startTimer)
      if (t.endTimer) clearTimeout(t.endTimer)
      t.startTimer = null
      t.endTimer = null
      t.startTrailing = false
      t.endTrailing = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, mode, reverse, staggerDuration, transition, animate, blocked])

  const letters = useMemo(() => [...text], [text])
  const secondaryRestingTop = reverse ? '-100%' : '100%'

  return (
    <span
      ref={scope}
      className={className}
      onMouseEnter={() => debouncedStart.current?.()}
      onMouseLeave={mode === 'pingpong' ? () => debouncedEnd.current?.() : undefined}
      style={{ display: 'inline-flex', position: 'relative', overflow: 'hidden' }}
    >
      <span className="sr-only">{text}</span>
      {letters.map((letter, i) => (
        <span
          key={i}
          aria-hidden
          style={{ whiteSpace: 'pre', position: 'relative', display: 'flex' }}
        >
          <motion.span
            className={`letter-${i}`}
            style={{ position: 'relative', top: 0, paddingBottom: '0.12em' }}
          >
            {letter}
          </motion.span>
          <motion.span
            className={`letter-secondary-${i}`}
            style={{ position: 'absolute', left: 0, right: 0, top: secondaryRestingTop }}
          >
            {letter}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
