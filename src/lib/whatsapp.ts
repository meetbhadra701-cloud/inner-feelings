import { CONTACT } from './contact'

/**
 * Build a wa.me deep link with a friendly, URL-encoded prefilled message.
 * When a product name is supplied, the message references it so the shop knows
 * what the customer is asking about. No prices are ever included.
 */
export function buildWhatsAppUrl(productName?: string, greeting?: string): string {
  const base = greeting ?? 'Hello Inner Feelings! I saw your collection online and would like some help.'
  const text = productName
    ? `${base}\n\nI'm interested in: ${productName}`
    : base
  return `https://wa.me/${CONTACT.phoneE164}?text=${encodeURIComponent(text)}`
}
