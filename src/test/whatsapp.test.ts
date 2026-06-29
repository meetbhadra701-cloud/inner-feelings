import { describe, it, expect } from 'vitest'
import { buildWhatsAppUrl } from '../lib/whatsapp'

describe('buildWhatsAppUrl', () => {
  it('targets the correct wa.me number', () => {
    expect(buildWhatsAppUrl()).toMatch(/^https:\/\/wa\.me\/917016326205\?text=/)
  })

  it('URL-encodes the prefilled text (spaces, newlines, ampersands)', () => {
    const url = buildWhatsAppUrl('Cotton Boxers & Briefs')
    expect(url).not.toMatch(/\s/) // no raw spaces
    expect(url).toContain('%20') // spaces encoded
    expect(url).toContain(encodeURIComponent('Cotton Boxers & Briefs'))
    expect(url).toContain('%26') // & encoded
  })

  it('includes the product name when provided', () => {
    const url = buildWhatsAppUrl('Jockey Vest')
    expect(decodeURIComponent(url)).toContain('Jockey Vest')
  })

  it('omits the product line when no name is given', () => {
    expect(decodeURIComponent(buildWhatsAppUrl())).not.toContain('interested in:')
  })
})
