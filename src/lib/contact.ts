/** Single source of truth for the shop's contact details. */
export const CONTACT = {
  /** E.164 without "+" for wa.me; with "+" for tel:. */
  phoneE164: '917016326205',
  phoneDisplay: '+91 70163 26205',
  email: 'dipnilbhanushali@gmail.com',
  address: 'Shop No. 3, Ground Floor, Utsav Elegance, Bhuyangdev Crossroad, Sola Road, Ahmedabad 380061',
} as const

/** tel: href using the display number's digits. */
export const telHref = `tel:+${CONTACT.phoneE164}`

/** mailto: href. */
export const mailtoHref = `mailto:${CONTACT.email}`

/** Google Maps directions link for the shop address. */
export const mapsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  'Inner Feelings, ' + CONTACT.address,
)}`
