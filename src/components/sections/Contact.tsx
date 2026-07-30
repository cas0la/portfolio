import { useEffect, useRef, useState } from 'react'
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
 * Cópia pelo caminho antigo, para quando a Clipboard API não existe.
 *
 * `navigator.clipboard` só existe em contexto seguro. `localhost` conta como
 * seguro, mas `http://` num IP de rede local não — e é assim que se abre o site no
 * telefone para conferir. Nesse cenário a API moderna simplesmente não está lá, e
 * sem esta função o botão dizia "não consegui copiar" quando copiar era possível.
 *
 * `execCommand` é deprecado e retorna um booleano de verdade, que é justamente o
 * que interessa aqui: ele diz se copiou. Enquanto não houver substituto para
 * contexto não seguro, ele fica.
 */
/**
 * Quanto tempo a confirmação de cópia fica na tela, em ms.
 *
 * Era 4000, e o autor apontou que durava demais. Dois motivos para 2000 ser melhor
 * que qualquer valor mais alto: "Copiado!" são duas palavras, que se leem em bem
 * menos de um segundo; e enquanto a placa está lá ela cobre parte do endereço, ou
 * seja, o preço de manter a confirmação é esconder o conteúdo.
 *
 * O efeito colateral que importa: em 4s a saída acontecia depois de o olho já ter
 * deixado o botão, então a placa parecia sumir de uma vez, mesmo com o mesmo fade
 * da entrada. Em 2s as duas pontas do movimento caem na mesma olhada.
 */
const COPY_FEEDBACK_MS = 2000

/**
 * Fade da placa de confirmação, um objeto só para entrada e saída.
 *
 * Ele é compartilhado de propósito, e não duplicado em `initial`/`exit`: o autor
 * pediu que o desaparecimento fizesse a mesma transição da aparição, e a única
 * forma de isso não sair de sincronia numa edição futura é não haver dois valores
 * para divergirem.
 */
const COPY_FADE = { duration: 0.22, ease: [0.22, 1, 0.36, 1] } as const

function copyByExecCommand(text: string): boolean {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  /* Fora da tela, mas não `display: none` nem `visibility: hidden`: elemento
     invisível desses dois jeitos não é selecionável, e sem seleção não há cópia. */
  area.style.position = 'fixed'
  area.style.top = '0'
  area.style.left = '-9999px'
  document.body.appendChild(area)
  area.select()

  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  document.body.removeChild(area)
  return ok
}

/**
 * E-mail com botão de copiar. Clicar num mailto no Mac abre um aplicativo que
 * ninguém usa, então o endereço fica visível e o botão copia.
 *
 * A regra deste componente: **"Copiado!" só aparece quando alguma coisa relatou
 * sucesso.** Falso sucesso é o pior estado possível aqui — o visitante sai achando
 * que tem o endereço, cola nada e não volta.
 */
function CopyEmail() {
  const { locale } = useLocale()
  const t = copyFor(locale)
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const emailRef = useRef<HTMLSpanElement>(null)
  const resetTimer = useRef<number | undefined>(undefined)
  const copied = state === 'copied'

  /* O temporizador vive num ref e é cancelado antes de cada tentativa. Solto como
     estava, dois cliques em menos de quatro segundos deixavam o primeiro
     `setTimeout` derrubar a confirmação do segundo, e o rótulo sumia no meio. */
  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  function selectEmail() {
    const node = emailRef.current
    if (!node) return
    const range = document.createRange()
    range.selectNodeContents(node)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

  /*
   * Duas tentativas, e o estado sai do resultado delas, nunca de otimismo.
   *
   * 1. Clipboard API, se existir. Ela rejeita quando a permissão é negada, e o
   *    `catch` cobre também o caso de `navigator.clipboard` ser `undefined`.
   * 2. `execCommand`, que funciona em contexto não seguro e devolve booleano.
   *
   * Só se as duas falharem é que vira `failed`, e aí o caminho de saída é deixar o
   * endereço selecionado na tela para o Ctrl+C do próprio visitante resolver, e
   * dizer isso em texto visível.
   */
  async function copy() {
    window.clearTimeout(resetTimer.current)

    let ok = false
    try {
      await navigator.clipboard.writeText(EMAIL)
      ok = true
    } catch {
      ok = false
    }
    if (!ok) ok = copyByExecCommand(EMAIL)

    setState(ok ? 'copied' : 'failed')
    if (!ok) selectEmail()

    resetTimer.current = window.setTimeout(() => setState('idle'), COPY_FEEDBACK_MS)
  }

  return (
    <span className="inline-flex max-w-full flex-col items-start gap-1.5">
      <button
        type="button"
        onClick={copy}
        /* O nome do botão descreve a ação e não muda com o resultado. Antes ele
           virava "Copiado!" e depois "não consegui copiar", e nesses estados o
           controle perdia o nome que diz o que ele faz — quem chegasse nele pela
           navegação por elementos ouviria um relato, não um botão. O resultado é
           trabalho da região `role="status"`. */
        aria-label={`${t.close.copy}: ${EMAIL}`}
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
          Confirmação: "Copiado!" encostado na direita do campo, sobre uma placa
          branca que **não** atravessa o campo inteiro e se desfaz em fade na
          direção do e-mail.

          A versão anterior era `inset-0` com fundo branco chapado: cobria o
          endereço todo, e por um instante o campo ficava sem e-mail nenhum, o que
          lê como se o conteúdo tivesse sido apagado em vez de copiado. Mantendo o
          e-mail visível à esquerda, a confirmação vira anotação sobre o que
          continua ali.

          O fade é gradiente na própria placa (`.copy-plate`), não `mask`: em
          `mask-image` o texto do rótulo desbotaria junto, e o que precisa desbotar
          é só o fundo.

          `aria-hidden` porque a região `role="status"` abaixo é quem anuncia. Sem
          isso o leitor de tela ouviria a palavra duas vezes.
        */}
        <AnimatePresence>
          {copied && (
            <motion.span
              aria-hidden
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={COPY_FADE}
              className="copy-plate absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {/* Os 4px são o `p-1`: a placa branca sobra 4px em volta do rótulo,
                  o suficiente para ele não encostar no e-mail que passa por baixo. */}
              <span className="inline-flex items-center gap-2 rounded-sm bg-surface p-1 text-body-sm font-semibold text-royal sm:text-h3">
                <Check className="size-4" aria-hidden />
                {t.close.copied}
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/*
        Anúncio único dos dois desfechos, para leitor de tela.

        Antes, o sucesso só existia no `aria-label` do botão. Mudar `aria-label` de
        um elemento que já está em foco não é anunciado de forma confiável em
        nenhum leitor — então quem não vê a tela clicava e não recebia confirmação
        nenhuma. `role="status"` tem `aria-live="polite"` implícito e fala sem
        roubar o foco do botão.
      */}
      <span role="status" className="sr-only">
        {state === 'copied' ? t.close.copied : state === 'failed' ? t.close.copyFailed : ''}
      </span>

      {/* A falha também é dita em texto visível: quem vê a tela precisa saber que o
          endereço ficou selecionado esperando um Ctrl+C. `aria-hidden` para não
          duplicar o que a região de status já anunciou. */}
      {state === 'failed' && (
        <span aria-hidden className="measure text-body-sm text-violet">
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
    <footer id="contact" className="scroll-anchor pb-block">
      <Container>
        <FadeIn>
          <h2 className="measure text-h1 font-extrabold text-ink">{t.close.title}</h2>
          <p className="measure mt-3 text-body text-ink-soft">{t.close.lead}</p>
        </FadeIn>

        <FadeIn delay={0.06}>
          <div className="mt-block flex flex-wrap items-center gap-snug">
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

          O itálico é de Public Sans, não do display. A Schibsted Grotesk está carregada
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
