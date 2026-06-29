import { useEffect, type RefObject } from 'react'

/**
 * Keep a CSS custom property in sync with an element's rendered height.
 * Used so sticky-bar heights drive scroll-padding (WCAG 2.4.11 — focused
 * content is never hidden behind a sticky header/footer).
 */
export function useMeasuredHeight(ref: RefObject<HTMLElement>, cssVar: string) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const root = document.documentElement
    const update = () => root.style.setProperty(cssVar, `${el.offsetHeight}px`)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      ro.disconnect()
      root.style.removeProperty(cssVar)
    }
  }, [ref, cssVar])
}
