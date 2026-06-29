import { useEffect, useRef, useState } from 'react'
import type { Product } from '../types'
import { ProductCard } from './ProductCard'
import { ProductModal } from './ProductModal'
import { useI18n } from '../i18n/I18nContext'

interface Props {
  products: Product[]
}

export function ProductGrid({ products }: Props) {
  const { t } = useI18n()
  const [selected, setSelected] = useState<Product | null>(null)

  // Polite live region: always mounted, updated in place, debounced, and
  // suppressed on the very first render so it doesn't announce on page load.
  const [announcement, setAnnouncement] = useState('')
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const id = setTimeout(() => {
      const count = products.length
      setAnnouncement(
        count === 0
          ? t('results.none')
          : count === 1
            ? t('results.countOne')
            : t('results.count', { count }),
      )
    }, 400)
    return () => clearTimeout(id)
  }, [products, t])

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {products.length === 0 ? (
        <p className="py-12 text-center text-ink-muted">{t('results.none')}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={setSelected} />
          ))}
        </ul>
      )}

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  )
}
