import type { Department } from '../types'
import { DEPARTMENTS } from '../data/catalog'
import { useI18n, type TranslationKey } from '../i18n/I18nContext'

interface Props {
  value: Department
  onChange: (d: Department) => void
}

/**
 * Single-select department chooser. Implemented as a labeled group of toggle
 * buttons (aria-pressed) rather than the ARIA tabs pattern, because we filter a
 * single shared grid instead of swapping panels. Active state uses an ink fill
 * (non-color-dependent) in addition to aria-pressed.
 */
export function DepartmentTabs({ value, onChange }: Props) {
  const { t } = useI18n()
  return (
    <div role="group" aria-label={t('dept.group')} className="flex justify-center gap-2 sm:gap-3">
      {DEPARTMENTS.map((d) => {
        const active = d.key === value
        return (
          <button
            key={d.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(d.key)}
            className={[
              'min-w-[5.5rem] rounded-full px-5 py-2.5 text-base font-semibold transition-colors',
              active
                ? 'bg-ink text-white focus-on-ink'
                : 'border-2 border-ink/20 text-ink hover:border-ink hover:bg-lime-soft',
            ].join(' ')}
          >
            {t(d.labelKey as TranslationKey)}
          </button>
        )
      })}
    </div>
  )
}
