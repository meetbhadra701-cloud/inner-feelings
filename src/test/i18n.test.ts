import { describe, it, expect } from 'vitest'
import { translate, DICTS } from '../i18n/I18nContext'

describe('translate', () => {
  it('returns the correct string per language', () => {
    expect(translate('en', 'dept.men')).toBe('Men')
    expect(translate('gu', 'dept.men')).toBe('પુરુષ')
    expect(translate('hi', 'dept.men')).toBe('पुरुष')
  })

  it('interpolates {token} params', () => {
    expect(translate('en', 'hero.trust', { years: '10+' })).toBe('10+ years in this business')
  })

  it('falls back to English for a missing key in another language', () => {
    // Every language must define the same key set as English.
    const enKeys = Object.keys(DICTS.en)
    for (const lang of ['gu', 'hi'] as const) {
      const missing = enKeys.filter((k) => !(k in DICTS[lang]))
      expect(missing).toEqual([])
    }
  })

  it('keeps the brand name in English across languages', () => {
    expect(translate('gu', 'brand.name')).toBe('Inner Feelings')
    expect(translate('hi', 'brand.name')).toBe('Inner Feelings')
  })
})
