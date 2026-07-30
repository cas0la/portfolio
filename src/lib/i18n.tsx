import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { copyFor } from '@/content'

export type Locale = 'pt' | 'en'

const STORAGE_KEY = 'lc.locale'

/** Mapa de idioma para o atributo lang do documento. */
const HTML_LANG: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en',
}

/** Primeira visita: respeita o idioma do navegador, com português como padrão. */
function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'pt'

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === 'pt' || saved === 'en') return saved

  const preferred = window.navigator.languages ?? [window.navigator.language]
  for (const tag of preferred) {
    if (!tag) continue
    if (tag.toLowerCase().startsWith('pt')) return 'pt'
    if (tag.toLowerCase().startsWith('en')) return 'en'
  }
  return 'pt'
}

type LocaleContextValue = {
  locale: Locale
  setLocale: (next: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  // O atributo lang precisa acompanhar a escolha: leitor de tela troca de voz
  // por causa dele, e o navegador decide hifenização com ele.
  //
  // Título e description também: as duas versões existem em `content`, e antes
  // nada as consumia, então com o site em inglês a aba e o resultado de busca
  // continuavam em português.
  //
  // O que isto **não** resolve: robô de preview de link (LinkedIn, WhatsApp,
  // Slack) não executa JS, então ele sempre lê as tags estáticas do
  // `index.html`. É por isso que as tags Open Graph de lá são neutras de idioma.
  // Prévia por idioma exigiria prerender, que não está no escopo desta rodada.
  useEffect(() => {
    const t = copyFor(locale)
    document.documentElement.lang = HTML_LANG[locale]
    document.title = t.meta.title

    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute('content', t.meta.description)
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // navegação privada sem storage: a escolha vale só para esta sessão
    }
  }, [])

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale precisa estar dentro de <LocaleProvider>')
  return ctx
}
