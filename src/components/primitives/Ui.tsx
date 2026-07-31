import type { ReactNode } from 'react'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/*
 * Primitivas de interface. Fio de cabelo de 1px separa, canto mole dá forma, e
 * sombra suave só aparece onde há elevação de verdade.
 *
 * Saíram daqui, por deixarem a página com cara de landing page de empresa em vez
 * de portfólio de uma pessoa: a sobrancelha de seção com tracinho em caixa-alta,
 * e a etiqueta em pílula roxa. No lugar da etiqueta entrou a assinatura de papel,
 * que diz o mesmo em voz mais baixa.
 */

/**
 * Assinatura de papel: qual foi o papel dele naquele trabalho.
 *
 * Caixa-alta com tracking em roxo, precedida de um fio curto. É mais gráfica que
 * o texto em caixa-baixa que estava aqui antes, e continua fora da pílula
 * colorida, que o autor recusou por soar como badge de SaaS.
 */
export function RoleByline({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span aria-hidden className="h-px w-5 shrink-0 bg-violet" />
      <span className="label text-violet">{children}</span>
    </span>
  )
}

/**
 * Ação primária: o gradiente royal para roxo, reservado ao download do currículo.
 * Sobe 1px no hover, o suficiente para responder sem chamar atenção.
 */
export function PrimaryButton({
  href,
  download,
  children,
  className = '',
}: {
  href: string
  download?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      download={download}
      className={cn(
        'grad-royal-violet group inline-flex h-12 items-center gap-2.5 rounded-md px-6',
        'text-h3 font-semibold text-white shadow-soft',
        'transition-all duration-200 hover:-translate-y-px hover:shadow-lift',
        'active:translate-y-0 active:shadow-soft',
        className,
      )}
    >
      {children}
      <ArrowDown
        className="size-[18px] shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
        aria-hidden
      />
    </a>
  )
}

/** Ação secundária: superfície branca com fio de cabelo. */
export function SecondaryButton({
  href,
  children,
  className = '',
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={href}
      className={cn(
        'group inline-flex h-12 items-center gap-2.5 rounded-md border border-hairline-strong',
        'bg-surface px-6 text-h3 font-semibold text-ink',
        'transition-all duration-200 hover:-translate-y-px hover:border-royal hover:text-royal',
        'active:translate-y-0',
        className,
      )}
    >
      {children}
      <ArrowRight
        className="size-[18px] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
        aria-hidden
      />
    </a>
  )
}

/**
 * A cápsula do sistema. Nasceu nas credenciais do Sobre e virou primitiva quando o
 * case principal passou a precisar dela: duas listas de cápsulas com aparência
 * própria em seções vizinhas seriam duas linguagens para a mesma coisa.
 *
 * Ela é `<li>` porque só existe dentro de lista. Cápsula solta é botão que não
 * clica.
 *
 * **Branca com fio de cabelo, nunca colorida.** Pílula pintada como classificação
 * é o tell corporativo que o DESIGN.md recusa desde a primeira rodada, e é
 * justamente num case que ela apareceria primeiro. O que distingue uma cápsula de
 * número de uma cápsula de papel é a tipografia, não o fundo.
 */
export function Pill({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <li
      className={cn(
        'rounded-pill border border-hairline-strong bg-surface px-4 py-2',
        className,
      )}
    >
      {children}
    </li>
  )
}

/**
 * A cápsula de destaque: um número em royal e, opcionalmente, a unidade ao lado.
 *
 * Mesmo desenho da `Pill`, mesma altura, mesmo fio. A diferença é onde a cor está
 * — no algarismo, que é a prova, e não no fundo, que seria enfeite. Isto repete o
 * componente `count` que os módulos do case já usavam, e é de propósito: o
 * vocabulário para "aqui tem um número medido" é um só na página inteira.
 *
 * `value` aceita texto sem número ("E2E", "SaaS B2B"). Nesse caso ele fica em
 * tinta e não em royal: royal aqui significa medição, e gastar a cor num rótulo
 * de escopo tiraria dela exatamente o que faz o número saltar.
 */
export function StatPill({ value, label }: { value: string; label?: string }) {
  const measured = /\d/.test(value)

  return (
    <Pill>
      <span className={cn('font-extrabold', measured ? 'tnum text-royal' : 'text-ink')}>
        {value}
      </span>
      {label && <span className="ml-2 text-ink-soft">{label}</span>}
    </Pill>
  )
}

/**
 * Nota do que ainda não existe, dita em primeira pessoa. Um fio à esquerda basta
 * para marcar que é nota, não afirmação sobre o trabalho.
 */
export function OpenNote({ children }: { children: ReactNode }) {
  return (
    <p className="border-l border-hairline-strong pl-3.5 text-body-sm italic text-ink-soft">
      {children}
    </p>
  )
}
