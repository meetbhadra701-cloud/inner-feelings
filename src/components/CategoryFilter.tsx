import { Check } from 'lucide-react'
import type { CategoryDef } from '../types'
import { useI18n, type TranslationKey } from '../i18n/I18nContext'

interface Props {
  categories: CategoryDef[]
  /** null = "All". */
  value: string | null
  onChange: (categoryKey: string | null) => void
}

/**
 * Single-select category chips. Toggle buttons with aria-pressed in a labeled
 * group; the active chip shows an ink fill + check icon so state never relies on
 * the lime color alone.
 */
export function CategoryFilter({ categories, value, onChange }: Props) {
  const { t } = useI18n()

  const chip = (active: boolean) =>
    [
      'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors',
      active
        ? 'bg-ink text-white focus-on-ink'
        : 'border border-ink/20 text-ink hover:border-ink hover:bg-lime-soft',
    ].join(' ')

  return (
    <div role="group" aria-label={t('cat.group')} className="flex flex-wrap justify-center gap-2">
      <button type="button" aria-pressed={value === null} onClick={() => onChange(null)} className={chip(value === null)}>
        {value === null && <Check className="h-4 w-4" aria-hidden="true" focusable="false" />}
        {t('cat.all')}
      </button>
      {categories.map((c) => {
        const active = c.key === value
        return (
          <button
            key={c.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(c.key)}
            className={chip(active)}
          >
            {active && <Check className="h-4 w-4" aria-hidden="true" focusable="false" />}
            {t(c.labelKey as TranslationKey)}
          </button>
        )
      })}
    </div>
  )
}
