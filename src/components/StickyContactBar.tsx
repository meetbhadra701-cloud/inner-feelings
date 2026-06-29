import { useRef } from 'react'
import { MessageCircle, Phone, MapPin } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'
import { CONTACT, telHref, mapsHref } from '../lib/contact'
import { buildWhatsAppUrl } from '../lib/whatsapp'
import { useMeasuredHeight } from '../hooks/useMeasuredHeight'

/**
 * Persistent quick-contact bar pinned to the bottom on small screens. Each
 * target is ≥44px with an 8px gap; safe-area padding clears the iOS home
 * indicator. Its height feeds --contactbar-h so content never hides behind it.
 */
export function StickyContactBar() {
  const { t } = useI18n()
  const ref = useRef<HTMLElement>(null)
  useMeasuredHeight(ref, '--contactbar-h')

  const item =
    'flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 px-2 py-2 text-xs font-semibold'

  return (
    <nav
      ref={ref}
      aria-label={t('contact.quickLabel')}
      className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-ink/10 bg-white px-2 pt-1 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] sm:hidden"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      <a
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${t('contact.whatsapp')} ${t('newTab')}`}
        className={`${item} rounded-lg text-ink`}
      >
        <MessageCircle className="h-5 w-5 text-lime-dark" aria-hidden="true" focusable="false" />
        {t('contact.whatsapp')}
      </a>
      <a href={telHref} aria-label={`${t('contact.call')} ${CONTACT.phoneDisplay}`} className={`${item} rounded-lg text-ink`}>
        <Phone className="h-5 w-5 text-lime-dark" aria-hidden="true" focusable="false" />
        {t('contact.call')}
      </a>
      <a
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${t('contact.directionsAria', { address: CONTACT.address })}${t('newTab')}`}
        className={`${item} rounded-lg text-ink`}
      >
        <MapPin className="h-5 w-5 text-lime-dark" aria-hidden="true" focusable="false" />
        {t('contact.directions')}
      </a>
    </nav>
  )
}
