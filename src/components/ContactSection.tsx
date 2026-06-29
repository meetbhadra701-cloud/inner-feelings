import { motion } from 'framer-motion'
import { MessageCircle, Phone, Mail, MapPin, Truck, Store, Info } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { CONTACT, telHref, mailtoHref, mapsHref } from '../lib/contact'
import { buildWhatsAppUrl } from '../lib/whatsapp'

export function ContactSection() {
  const { t } = useI18n()

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-24 bg-ink px-4 py-14 text-white sm:px-6"
    >
      <div className="mx-auto max-w-4xl">
        <h2 id="contact-heading" className="text-center text-3xl font-bold">
          {t('contact.title')}
        </h2>
        <p className="mt-2 text-center text-white/70">{t('contact.subtitle')}</p>

        {/* How to buy */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="mt-8 grid gap-4 sm:grid-cols-2"
        >
          <div className="rounded-2xl bg-white/5 p-5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-lime">
              <Store className="h-5 w-5" aria-hidden="true" focusable="false" />
              {t('howToBuy.title')}
            </h3>
            <p className="mt-2 text-sm text-white/80">{t('howToBuy.visitLine')}</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-5">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-lime">
              <Truck className="h-5 w-5" aria-hidden="true" focusable="false" />
              {t('howToBuy.porterTitle')}
            </h3>
            <p className="mt-2 text-sm text-white/80">{t('howToBuy.porterLine')}</p>
          </div>
        </motion.div>

        <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-white/60">
          <Info className="h-4 w-4 shrink-0" aria-hidden="true" focusable="false" />
          {t('howToBuy.noPrices')}
        </p>

        {/* Contact methods — visible number/email are the link text (Label in Name). */}
        <div className="on-ink mt-8 grid gap-3 sm:grid-cols-3">
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t('contact.whatsapp')} ${t('newTab')}`}
            className="flex items-center justify-center gap-2 rounded-full bg-lime px-4 py-3 font-semibold text-ink transition-colors hover:bg-lime-dark"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" focusable="false" />
            {t('contact.whatsapp')}
          </a>
          <a
            href={telHref}
            className="flex items-center justify-center gap-2 rounded-full border border-white/30 px-4 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Phone className="h-5 w-5" aria-hidden="true" focusable="false" />
            {CONTACT.phoneDisplay}
          </a>
          <a
            href={mailtoHref}
            className="flex items-center justify-center gap-2 rounded-full border border-white/30 px-4 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          >
            <Mail className="h-5 w-5" aria-hidden="true" focusable="false" />
            {CONTACT.email}
          </a>
        </div>

        {/* Address */}
        <div className="on-ink mt-8 rounded-2xl bg-white/5 p-5 text-center">
          <h3 className="flex items-center justify-center gap-2 text-lg font-semibold text-lime">
            <MapPin className="h-5 w-5" aria-hidden="true" focusable="false" />
            {t('contact.addressLabel')}
          </h3>
          <address className="mt-2 not-italic text-white/85">{CONTACT.address}</address>
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t('contact.directionsAria', { address: CONTACT.address })}${t('newTab')}`}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 font-semibold text-ink transition-colors hover:bg-lime"
          >
            <MapPin className="h-5 w-5" aria-hidden="true" focusable="false" />
            {t('contact.directions')}
          </a>
        </div>
      </div>
    </section>
  )
}
