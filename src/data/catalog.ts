import type { DepartmentDef } from '../types'

/**
 * Department → Category structure for the shop. Category `key` values are stable
 * identifiers used by products.json and the filter UI; `labelKey` points at the
 * i18n dictionary so labels translate across English / Gujarati / Hindi.
 */
export const DEPARTMENTS: DepartmentDef[] = [
  {
    key: 'Men',
    labelKey: 'dept.men',
    categories: [
      { key: 'men-undergarments', labelKey: 'cat.undergarments' },
      { key: 'men-tshirts-full', labelKey: 'cat.tshirtsFull' },
      { key: 'men-tshirts-half', labelKey: 'cat.tshirtsHalf' },
      { key: 'men-boxers', labelKey: 'cat.boxers' },
      { key: 'men-shorts', labelKey: 'cat.shorts' },
      { key: 'men-night-pajamas', labelKey: 'cat.nightPajamas' },
      { key: 'men-joggers', labelKey: 'cat.joggers' },
      { key: 'men-gym-wear', labelKey: 'cat.gymWear' },
      { key: 'men-thermals', labelKey: 'cat.thermals' },
      { key: 'men-accessories', labelKey: 'cat.accessories' },
    ],
  },
  {
    key: 'Women',
    labelKey: 'dept.women',
    categories: [
      { key: 'women-undergarments', labelKey: 'cat.undergarments' },
      { key: 'women-lingerie', labelKey: 'cat.lingerie' },
      { key: 'women-tshirts-full', labelKey: 'cat.tshirtsFull' },
      { key: 'women-tshirts-half', labelKey: 'cat.tshirtsHalf' },
      { key: 'women-shorts', labelKey: 'cat.shorts' },
      { key: 'women-night-pajamas', labelKey: 'cat.nightPajamas' },
      { key: 'women-tracks', labelKey: 'cat.tracks' },
      { key: 'women-yoga-wear', labelKey: 'cat.yogaWear' },
      { key: 'women-gym-wear', labelKey: 'cat.gymWear' },
      { key: 'women-coord-sets', labelKey: 'cat.coordSets' },
      { key: 'women-thermals', labelKey: 'cat.thermals' },
      { key: 'women-accessories', labelKey: 'cat.accessories' },
    ],
  },
  {
    key: 'Kids',
    labelKey: 'dept.kids',
    categories: [
      { key: 'kids-socks', labelKey: 'cat.socks' },
    ],
  },
]

export const DEPARTMENT_KEYS = DEPARTMENTS.map((d) => d.key)

/** Look up the category definitions for a department. */
export function categoriesFor(department: string) {
  return DEPARTMENTS.find((d) => d.key === department)?.categories ?? []
}
