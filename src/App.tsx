import { useMemo, useState } from 'react'
import type { Department, Product } from './types'
import productsData from './data/products.json'
import { categoriesFor } from './data/catalog'
import { filterProducts } from './lib/products'
import { useI18n } from './i18n/I18nContext'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { DepartmentTabs } from './components/DepartmentTabs'
import { CategoryFilter } from './components/CategoryFilter'
import { ProductGrid } from './components/ProductGrid'
import { ContactSection } from './components/ContactSection'
import { StickyContactBar } from './components/StickyContactBar'
import { Footer } from './components/Footer'

const PRODUCTS = productsData as Product[]

export default function App() {
  const { t, lang, langAnnouncement } = useI18n()
  const [department, setDepartment] = useState<Department>('Men')
  const [category, setCategory] = useState<string | null>(null)

  const categories = categoriesFor(department)
  const visible = useMemo(
    () => filterProducts(PRODUCTS, department, category),
    [department, category],
  )

  const changeDepartment = (d: Department) => {
    setDepartment(d)
    setCategory(null)
  }

  return (
    <>
      <a href="#main" className="skip-link rounded-full bg-ink px-4 py-2 font-semibold text-white focus-on-ink">
        {t('skip.toContent')}
      </a>

      {/* Polite announcement of language changes, in the target language. */}
      <div aria-live="polite" aria-atomic="true" lang={lang} className="sr-only">
        {langAnnouncement}
      </div>

      <Header />

      <main id="main" tabIndex={-1} style={{ paddingBottom: 'var(--contactbar-h)' }}>
        <Hero />

        <section id="collection" aria-labelledby="collection-heading" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 id="collection-heading" className="text-center text-3xl font-bold">
            {t('section.products')}
          </h2>

          <div className="mt-6">
            <DepartmentTabs value={department} onChange={changeDepartment} />
          </div>

          {department === 'Kids' ? (
            <p className="mx-auto mt-5 max-w-xl text-center text-sm text-ink-muted">{t('kids.note')}</p>
          ) : (
            <div className="mt-5">
              <CategoryFilter categories={categories} value={category} onChange={setCategory} />
            </div>
          )}

          <div className="mt-8">
            <ProductGrid products={visible} />
          </div>
        </section>

        <ContactSection />
      </main>

      <Footer />
      <StickyContactBar />
    </>
  )
}
