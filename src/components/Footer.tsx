import { useI18n } from '../i18n/I18nContext'

export function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-ink/10 bg-white px-4 py-8 text-center sm:px-6">
      <div className="mx-auto max-w-3xl space-y-3">
        <p className="text-sm font-medium text-ink-soft">{t('footer.tagline')}</p>
        <p className="text-xs leading-relaxed text-ink-muted">{t('footer.disclaimer')}</p>
        <p className="text-xs text-ink-muted">{t('footer.rights', { year })}</p>
      </div>
    </footer>
  )
}
