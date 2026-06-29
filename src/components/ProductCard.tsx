import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import type { Product } from '../types'
import { brandPlaceholder } from '../lib/products'
import { asset } from '../lib/asset'
import { buildWhatsAppUrl } from '../lib/whatsapp'
import { useI18n } from '../i18n/I18nContext'

interface Props {
  product: Product
  onOpen: (product: Product) => void
}

export function ProductCard({ product, onOpen }: Props) {
  const { t } = useI18n()
  const fallback = brandPlaceholder(product.brand)
  const [src, setSrc] = useState(product.image ? asset(product.image) : fallback)

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card"
    >
      <button
        type="button"
        onClick={() => onOpen(product)}
        aria-label={t('card.viewDetailsAria', { name: product.name })}
        className="group relative block aspect-square w-full overflow-hidden bg-lime-soft"
      >
        <img
          src={src}
          onError={() => src !== fallback && setSrc(fallback)}
          alt={`${product.brand} ${product.name}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-2 top-2 rounded-full bg-ink/90 px-2.5 py-1 text-xs font-semibold text-white">
          {product.brand}
        </span>
      </button>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-semibold leading-snug">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{product.description}</p>
        <div className="mt-4 flex items-center gap-2">
          <a
            href={buildWhatsAppUrl(product.name)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${t('card.enquireAria', { name: product.name })}${t('newTab')}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-lime px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-lime-dark"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" focusable="false" />
            {t('card.enquire')}
          </a>
          <button
            type="button"
            onClick={() => onOpen(product)}
            className="rounded-full border border-ink/20 px-3 py-2 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-lime-soft"
          >
            {t('card.viewDetails')}
          </button>
        </div>
      </div>
    </motion.li>
  )
}
