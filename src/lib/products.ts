import type { Product } from '../types'

/**
 * Filter products by department and (optionally) a category key.
 * Passing `null`/`undefined` for category returns all products in the department.
 */
export function filterProducts(
  products: Product[],
  department: string,
  categoryKey?: string | null,
): Product[] {
  return products.filter((p) => {
    if (p.department !== department) return false
    if (categoryKey && p.category !== categoryKey) return false
    return true
  })
}

/** Brand initials, e.g. "Van Heusen" → "VH", "Jockey" → "J". */
export function brandInitials(brand: string): string {
  const parts = brand.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * A tasteful, self-contained (no network) placeholder: brand initials on a
 * black→lime gradient. Used when a product has no image or its image fails.
 */
export function brandPlaceholder(brand: string): string {
  const initials = brandInitials(brand)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A0A0A"/>
      <stop offset="100%" stop-color="#1C1C1C"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#g)"/>
  <circle cx="200" cy="170" r="92" fill="#BFD400"/>
  <text x="200" y="170" font-family="Poppins, system-ui, sans-serif" font-size="86" font-weight="700" fill="#0A0A0A" text-anchor="middle" dominant-baseline="central">${initials}</text>
  <text x="200" y="312" font-family="Poppins, system-ui, sans-serif" font-size="26" font-weight="600" fill="#BFD400" text-anchor="middle">${brand}</text>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
