import { motion } from 'motion/react'
import { useLocale, type Locale } from '@/lib/i18n'
import { copyFor } from '@/content'

/*
 * Seletor de idioma com bandeira e texto alternativo, pt-BR e en.
 *
 * Cada bandeira é SVG com role="img" e <title>, que é o texto alternativo lido
 * por leitor de tela. Bandeira sozinha nunca é rótulo suficiente de idioma, por
 * isso o código (PT / EN) aparece ao lado, e o botão carrega aria-label
 * descritivo. O indicador do ativo desliza entre os dois, que é o único
 * movimento aqui.
 */

function FlagBR({ title }: { title: string }) {
  return (
    <svg viewBox="0 0 28 20" className="h-[13px] w-[19px] shrink-0 rounded-[2px]" role="img">
      <title>{title}</title>
      <defs>
        {/* A faixa branca precisa ser recortada pelo círculo. Sem o clip ela
            escapa do globo e, em 19px de largura, lê como bandeira quebrada. */}
        <clipPath id="flag-br-globe">
          <circle cx="14" cy="10" r="4.4" />
        </clipPath>
      </defs>
      <rect width="28" height="20" fill="#009B3A" />
      <polygon points="14,2.4 25.4,10 14,17.6 2.6,10" fill="#FEDF00" />
      <circle cx="14" cy="10" r="4.4" fill="#002776" />
      <path
        d="M8 11.3a8 8 0 0 1 12 -1.1"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        clipPath="url(#flag-br-globe)"
      />
    </svg>
  )
}

function FlagUS({ title }: { title: string }) {
  const stripe = 20 / 13
  return (
    <svg viewBox="0 0 28 20" className="h-[13px] w-[19px] shrink-0 rounded-[2px]" role="img">
      <title>{title}</title>
      <rect width="28" height="20" fill="#FFFFFF" />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} y={i * 2 * stripe} width="28" height={stripe} fill="#B22234" />
      ))}
      <rect width="11.6" height={stripe * 7} fill="#3C3B6E" />
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={1.7 + col * 2.85}
            cy={1.7 + row * 3.3}
            r="0.6"
            fill="#FFFFFF"
          />
        )),
      )}
    </svg>
  )
}

export function LangPlate({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useLocale()
  const t = copyFor(locale)

  const options: { value: Locale; code: string; alt: string; flag: typeof FlagBR }[] = [
    { value: 'pt', code: t.lang.pt, alt: t.lang.ptAlt, flag: FlagBR },
    { value: 'en', code: t.lang.en, alt: t.lang.enAlt, flag: FlagUS },
  ]

  return (
    <div
      className={`inline-flex items-center rounded-pill border border-hairline bg-surface p-1 ${className}`}
      role="group"
      aria-label={t.lang.label}
    >
      {options.map(({ value, code, alt, flag: Flag }) => {
        const active = value === locale
        return (
          <button
            key={value}
            type="button"
            onClick={() => setLocale(value)}
            aria-label={alt}
            aria-current={active ? 'true' : undefined}
            className="tap-h relative inline-flex items-center justify-center gap-1.5 rounded-pill px-2.5 py-1"
          >
            {active && (
              <motion.span
                layoutId="lang-active"
                aria-hidden
                className="absolute inset-0 rounded-pill bg-royal-wash"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            {/* `relative` é obrigatório: o indicador ativo acima é absoluto e é
                irmão anterior, e elemento posicionado pinta acima de conteúdo em
                fluxo. Sem isto o fundo do chip ativo cobre a bandeira. */}
            <span className="relative flex">
              <Flag title={alt} />
            </span>
            <span
              className={`relative text-[0.8125rem] font-semibold transition-colors ${
                active ? 'text-royal-deep' : 'text-ink-soft'
              }`}
            >
              {code}
            </span>
          </button>
        )
      })}
    </div>
  )
}
