export type Department = 'Men' | 'Women' | 'Kids'

export interface Product {
  id: string
  department: Department
  /** Stable category key, matches CategoryDef.key (e.g. "mens-boxers"). */
  category: string
  brand: string
  name: string
  description: string
  /** Path under /public, e.g. "/images/jockey-boxer-8008.jpg", or a data URI placeholder. */
  image: string
}

export interface CategoryDef {
  key: string
  /** i18n key for the localized category label. */
  labelKey: string
}

export interface DepartmentDef {
  key: Department
  /** i18n key for the localized department label. */
  labelKey: string
  categories: CategoryDef[]
}
