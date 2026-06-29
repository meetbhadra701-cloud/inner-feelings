import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X, MessageCircle, Phone } from 'lucide-react'
import type { Product } from '../types'
import { brandPlaceholder } from '../lib/products'
import { buildWhatsAppUrl } from '../lib/whatsapp'
import { telHref } from '../lib/contact'
import { useI18n } from '../i18n/I18nContext'

interface Props {
  product: Product | null
  onClose: () => void
}

/**
 * Accessible product detail dialog. Radix supplies focus trap, focus return,
 * Esc-to-close and scroll lock; we add Title/Description and a labeled close
 * button. forceMount + AnimatePresence lets the exit animation play without
 * breaking Radix's focus return.
 */
export function ProductModal({ product, onClose }: Props) {
  const { t } = useI18n()
  const reduce = useReducedMotion()
  const open = product !== null
  // Retain the last product so content stays rendered through the exit animation.
  const [shown, setShown] = useState<Product | null>(product)
  useEffect(() => {
    if (product) setShown(product)
  }, [product])

  const fallback = shown ? brandPlaceholder(shown.brand) : ''
  const [src, setSrc] = useState('')
  useEffect(() => {
    if (shown) setSrc(shown.image || brandPlaceholder(shown.brand))
  }, [shown])

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && shown && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby="product-desc">
              {/* Static wrapper holds the centering transform; the inner motion
                  element owns the animated transform so the two never clash. */}
              <div className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6"
                >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full bg-ink/90 px-2.5 py-1 text-xs font-semibold text-white">
                    {shown.brand}
                  </span>
                  <Dialog.Close
                    aria-label={t('modal.close')}
                    className="rounded-full p-1.5 text-ink hover:bg-lime-soft"
                  >
                    <X className="h-5 w-5" aria-hidden="true" focusable="false" />
                  </Dialog.Close>
                </div>

                <div className="mt-3 overflow-hidden rounded-xl bg-lime-soft">
                  <img
                    src={src || fallback}
                    onError={() => src !== fallback && setSrc(fallback)}
                    alt={`${shown.brand} ${shown.name}`}
                    className="mx-auto max-h-72 w-full object-contain"
                  />
                </div>

                <Dialog.Title className="mt-4 text-xl font-bold">{shown.name}</Dialog.Title>
                <Dialog.Description id="product-desc" className="mt-1 text-ink-muted">
                  {shown.description}
                </Dialog.Description>

                <p className="mt-3 rounded-lg bg-lime-soft px-3 py-2 text-sm text-ink-soft">
                  {t('modal.howToBuy')}
                </p>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <a
                    href={buildWhatsAppUrl(shown.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t('card.enquireAria', { name: shown.name })}${t('newTab')}`}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-lime px-4 py-3 font-semibold text-ink transition-colors hover:bg-lime-dark"
                  >
                    <MessageCircle className="h-5 w-5" aria-hidden="true" focusable="false" />
                    {t('modal.enquire')}
                  </a>
                  <a
                    href={telHref}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-3 font-semibold text-ink transition-colors hover:bg-lime-soft"
                  >
                    <Phone className="h-5 w-5" aria-hidden="true" focusable="false" />
                    {t('modal.call')}
                  </a>
                </div>
                </motion.div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
