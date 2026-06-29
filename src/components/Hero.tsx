import { motion } from 'framer-motion'
import { BadgeCheck, ArrowDown, MessageCircle } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { YEARS_IN_BUSINESS } from '../lib/config'

export function Hero() {
  const { t } = useI18n()
  return (
    <section className="relative overflow-hidden bg-lime-soft">
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-lime/40" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-lime/30" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative mx-auto max-w-3xl px-5 py-14 text-center sm:py-20"
      >
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white sm:text-sm">
          <BadgeCheck className="h-4 w-4 text-lime" aria-hidden="true" focusable="false" />
          {t('hero.trust', { years: YEARS_IN_BUSINESS })}
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">Inner Feelings</h1>
        <p className="mt-3 text-xl font-medium text-ink-soft sm:text-2xl">{t('hero.tagline')}</p>
        <p className="mx-auto mt-5 max-w-xl text-base text-ink-muted sm:text-lg">
          {t('hero.subtitle')}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#collection"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.03] focus-on-ink"
          >
            <ArrowDown className="h-5 w-5" aria-hidden="true" focusable="false" />
            {t('hero.ctaBrowse')}
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-6 py-3 font-semibold text-ink transition-colors hover:bg-lime"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" focusable="false" />
            {t('hero.ctaContact')}
          </a>
        </div>
      </motion.div>
    </section>
  )
}
