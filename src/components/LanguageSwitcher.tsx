import { LANGUAGES, useI18n } from '../i18n/I18nContext'

/**
 * Three fixed languages → a labeled group of buttons (better than a <select>
 * for a small fixed set). The active language carries aria-current plus a
 * non-color cue (ink fill), and each button sets `lang` so native names are
 * pronounced correctly. The change is announced via the App's live region.
 */
export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n()
  return (
    <div role="group" aria-label={t('lang.label')} className="flex items-center gap-1">
      {LANGUAGES.map(({ code, nativeLabel }) => {
        const active = code === lang
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-current={active ? 'true' : undefined}
            onClick={() => setLang(code)}
            className={[
              'rounded-full px-3 py-1.5 text-sm font-semibold transition-colors',
              active
                ? 'bg-ink text-white focus-on-ink'
                : 'border border-ink/30 text-ink hover:border-ink hover:bg-lime-soft',
            ].join(' ')}
          >
            {nativeLabel}
          </button>
        )
      })}
    </div>
  )
}
