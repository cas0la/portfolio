import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { useLenis } from 'lenis/react'

/*
 * Quem decide onde a página começa depois de cada navegação.
 *
 * Num site de uma página só isso era trabalho do navegador. Com rotas ele passa a
 * ser nosso: React Router troca a árvore sem tocar no scroll, então sem isto
 * abrir a página do case a partir do meio da home cairia no meio da página do
 * case.
 *
 * São dois comportamentos:
 *
 * 1. **Rota nova sem hash** — topo, instantâneo. Rolagem animada aqui seria o
 *    site rolando sozinho por uma tela que a pessoa nem viu ainda.
 * 2. **Rota com hash** (`/#contact`, vindo da página do case) — vai até a seção.
 *
 * O `scrollIntoView` é quem respeita o `scroll-margin-top` da classe
 * `scroll-anchor`, que é onde mora a compensação da altura do cabeçalho. Calcular
 * o offset à mão aqui duplicaria esse número num segundo lugar.
 */

/**
 * Quanto tempo a correção de alvo fica de olho, e de quanto em quanto.
 *
 * **Por que existe correção:** os `FadeIn` da home entram deslocando a altura das
 * seções depois que o salto já aconteceu, e o alvo escorrega debaixo do pé.
 * Chegar em `/#contact` a frio errava o endereço por esse motivo. Reconferir a
 * posição por meio segundo cobre a entrada dos blocos sem prender o scroll.
 */
const SETTLE_MS = 500
const SETTLE_STEP_MS = 100

export function ScrollManager() {
  const { pathname, hash } = useLocation()
  const lenis = useLenis()

  useEffect(() => {
    if (!hash) {
      lenis?.scrollTo(0, { immediate: true })
      window.scrollTo(0, 0)
      return
    }

    const target = document.querySelector(hash)
    if (!target) return

    target.scrollIntoView({ block: 'start' })

    /*
     * A correção se cancela ao primeiro gesto de rolagem da pessoa. Sem isso, quem
     * chegasse pela âncora e começasse a rolar imediatamente seria puxado de volta
     * — o site brigando com a mão de quem usa, que é pior que a âncora errar.
     */
    let cancelled = false
    const stop = () => {
      cancelled = true
    }
    const events = ['wheel', 'touchstart', 'keydown'] as const
    events.forEach((e) => window.addEventListener(e, stop, { passive: true, once: true }))

    const timers: number[] = []
    for (let t = SETTLE_STEP_MS; t <= SETTLE_MS; t += SETTLE_STEP_MS) {
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return
          target.scrollIntoView({ block: 'start' })
        }, t),
      )
    }

    return () => {
      timers.forEach(window.clearTimeout)
      events.forEach((e) => window.removeEventListener(e, stop))
    }
  }, [pathname, hash, lenis])

  return null
}
