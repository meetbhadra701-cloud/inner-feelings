import { useRef } from 'react'
import { MapPin } from 'lucide-react'
import { LOGO_SRC } from '../lib/config'
import { asset } from '../lib/asset'
import { useI18n } from '../i18n/I18nContext'
import { useMeasuredHeight } from '../hooks/useMeasuredHeight'
import { LanguageSwitcher } from './LanguageSwitcher'

export function Header() {
  const { t } = useI18n()
  const headerRef = useRef<HTMLElement>(null)
  useMeasuredHeight(headerRef, '--header-h')

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 border-b border-ink/10 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2.5 sm:px-6">
        <a
          href="#main"
          aria-label={t('header.home')}
          className="flex shrink-0 items-center gap-2"
        >
          <img src={asset(LOGO_SRC)} alt={t('brand.name')} className="h-10 w-10 rounded object-contain" />
          <span className="text-lg font-bold tracking-tight">Inner Feelings</span>
        </a>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-lime px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-lime-dark"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" focusable="false" />
            {t('header.visitContact')}
          </a>
        </div>
      </div>
    </header>
  )
}
