/**
 * Resolve a public asset path against Vite's base URL so it works both at the
 * site root (local dev / Vercel) and under a subpath (GitHub Pages, e.g.
 * /inner-feelings/). Data URIs and absolute URLs are returned unchanged.
 */
export function asset(path: string): string {
  if (!path) return path
  if (/^(data:|https?:|blob:)/.test(path)) return path
  return import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
}
