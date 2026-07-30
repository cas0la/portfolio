import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Copy, Check, MapPin } from 'lucide-react'
import { Container } from '@/components/primitives/Container'
import { FadeIn } from '@/components/primitives/FadeIn'
import { PrimaryButton } from '@/components/primitives/Ui'
import { useLocale } from '@/lib/i18n'
import { copyFor, EMAIL, LINKEDIN } from '@/content'

/**
 * Glifo do LinkedIn. O lucide-react 1.x removeu ícones de marca por política de
 * trademark, então o path vem inline. Uso nominativo, só para linkar o perfil.
 */
function LinkedInGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path
        fill="currentColor"
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"
      />
    </svg>
  )
}

/**
 * E-mail com botão de copiar. Clicar num mailto no Mac abre um aplicativo que
 * ninguém usa, então o endereço fica visível e o botão copia. A confirmação troca
 * com um cross-fade curto, sem mover nada de lugar.
 */
function CopyEmail() {
  const { locale } = useLocale()
  const t = copyFor(locale)
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const emailRef = useRef<HTMLSpanElement>(null)
  const copied = state === 'copied'

  /*
   * A versão anterior engolia o erro do clipboard e mostrava "Copiado!" de
   * qualquer jeito. Falso sucesso é o pior estado possível aqui: o visitante sai
   * achando que tem o endereço, cola nada e não volta.
   *
   * Sem permissão de clipboard (ou em contexto não seguro), o caminho de saída é
   * selecionar o endereço na tela, para o Ctrl+C do próprio visitante resolver, e
   * dizer isso.
   */
  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setState('copied')
    } catch {
      setState('failed')
      const node = emailRef.current
      if (node) {
        const range = document.createRange()
        range.selectNodeContents(node)
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }
    setTimeout(() => setState('idle'), 4000)
  }

  return (
    <span className="inline-flex max-w-full flex-col items-start gap-1.5">
      <button
        type="button"
        onClick={copy}
        aria-label={
          state === 'copied'
            ? t.close.copied
            : state === 'failed'
              ? t.close.copyFailed
              : `${t.close.copy}: ${EMAIL}`
        }
        className="group relative inline-flex max-w-full items-center gap-3.5 overflow-hidden rounded-md border border-hairline-strong bg-surface py-2.5 pl-4 pr-3 text-left transition-colors hover:border-royal"
      >
        <span
          ref={emailRef}
          className="min-w-0 truncate text-body-sm font-semibold text-ink sm:text-h3"
        >
          {EMAIL}
        </span>
        <span className="grid size-8 shrink-0 place-items-center text-ink-soft transition-colors group-hover:text-royal">
          <Copy className="size-4" aria-hidden />
        </span>

        {/*
        Confirmação: o rótulo "Copiado!" cobre o e-mail em azul, com fade em vez de
        corte seco. Antes era só um ícone de check trocando de lugar, que dizia
        pouco. `aria-hidden` porque a mudança já é anunciada pelo aria-label do
        botão, e o leitor de tela não deve ouvir a palavra duas vezes.
      */}
        <AnimatePresence>
          {copied && (
            <motion.span
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 grid place-items-center bg-surface"
            >
              <span className="inline-flex items-center gap-2 text-body-sm font-semibold text-royal sm:text-h3">
                <Check className="size-4" aria-hidden />
                {t.close.copied}
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* A falha é dita em texto, não só no `aria-label`: quem vê a tela também
          precisa saber que o endereço ficou selecionado esperando um Ctrl+C.
          `role="status"` anuncia sem roubar o foco do botão. */}
      {state === 'failed' && (
        <span role="status" className="measure text-body-sm text-violet">
          {t.close.copyFailed}
        </span>
      )}
    </span>
  )
}

export function Contact() {
  const { locale } = useLocale()
  const t = copyFor(locale)

  return (
    // `beat` é o intervalo *entre* seções, e não existe seção depois desta, então
    // aqui ele deixava a página terminar em 208px de vazio abaixo da assinatura.
    // O fechamento recebe respiro de bloco, que é o suficiente para o rodapé não
    // encostar na borda.
    <footer id="contact" className="scroll-mt-16 pb-block">
      <Container>
        <FadeIn>
          <h2 className="measure text-h1 font-extrabold text-ink">{t.close.title}</h2>
          <p className="measure mt-3 text-body text-ink-soft">{t.close.lead}</p>
        </FadeIn>

        <FadeIn delay={0.06}>
          <div className="mt-block flex flex-wrap items-center gap-half-gap">
            <PrimaryButton href={t.nav.resumeFile} download>
              {t.close.ctaResume}
            </PrimaryButton>
            <CopyEmail />
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center gap-2.5 rounded-md border border-hairline-strong bg-surface px-5 text-h3 font-semibold text-ink transition-colors hover:border-royal hover:text-royal"
            >
              <LinkedInGlyph className="size-[18px] text-royal" />
              {t.close.linkedin}
            </a>
          </div>
        </FadeIn>

        {/*
          Despedida da carta, depois das ações. Antes era só o primeiro nome em
          itálico, que ficava órfão: nome sozinho não é assinatura, é palavra
          perdida. E ela vinha antes dos botões, o que punha o agradecimento no
          meio do pedido.

          O itálico é de Public Sans, não do display. A Bricolage está carregada
          sem eixo itálico, então `font-display italic` produzia inclinação
          sintetizada pelo browser, que é o defeito que um leitor com olho de
          design nota primeiro numa assinatura.
        */}
        <FadeIn delay={0.1}>
          <p className="mt-block text-h2 font-semibold italic text-ink">
            {t.close.signoff}
          </p>
        </FadeIn>

        <FadeIn delay={0.14}>
          <div className="mt-block flex flex-col gap-2 border-t border-hairline pt-gap text-body-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-violet" aria-hidden />
              {t.close.location}
            </span>
            <span>{t.close.rights}</span>
            <span>{t.close.builtWith}</span>
          </div>
        </FadeIn>
      </Container>
    </footer>
  )
}
