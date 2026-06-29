import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import en from './en.json'
import gu from './gu.json'
import hi from './hi.json'

export type Lang = 'en' | 'gu' | 'hi'
export type TranslationKey = keyof typeof en
export type TParams = Record<string, string | number>

export const DICTS: Record<Lang, Record<string, string>> = { en, gu, hi }

export const LANGUAGES: { code: Lang; nativeLabel: string }[] = [
  { code: 'en', nativeLabel: 'English' },
  { code: 'gu', nativeLabel: 'ગુજરાતી' },
  { code: 'hi', nativeLabel: 'हिन्दी' },
]

const STORAGE_KEY = 'if-lang'

/** Pure translation lookup with {token} interpolation. Falls back to English, then the key. */
export function translate(lang: Lang, key: TranslationKey, params?: TParams): string {
  const dict = DICTS[lang] ?? DICTS.en
  let str = dict[key] ?? DICTS.en[key] ?? (key as string)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.split(`{${k}}`).join(String(v))
    }
  }
  return str
}

interface I18nValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TranslationKey, params?: TParams) => string
  /** Polite-live-region message announced after a language change (in the target language). */
  langAnnouncement: string
}

const I18nContext = createContext<I18nValue | null>(null)

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'gu' || saved === 'hi') return saved
  } catch {
    /* localStorage may be unavailable */
  }
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getInitialLang)
  const [langAnnouncement, setLangAnnouncement] = useState('')

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback(
    (key: TranslationKey, params?: TParams) => translate(lang, key, params),
    [lang],
  )

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try {
      window.localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* ignore */
    }
    setLangAnnouncement(translate(l, 'lang.changed'))
  }, [])

  return (
    <I18nContext.Provider value={{ lang, setLang, t, langAnnouncement }}>
      {children}
    </I18nContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
