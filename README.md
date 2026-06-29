# Inner Feelings — web brochure

A fast, mobile-first, multilingual **showcase website** for Inner Feelings, a multi-brand
innerwear & clothing shop in Ahmedabad. It is a brochure only — **no prices, no cart, no
online ordering**. Customers visit the store, call/WhatsApp, or arrange Porter delivery by phone.

- **Languages:** English, ગુજરાતી (Gujarati), हिन्दी (Hindi) — switchable in the header, remembered on the device.
- **Tagline:** *your inner secret* · **10+ years in business.**
- **Tech:** Vite + React + TypeScript + Tailwind CSS + Framer Motion + Radix UI.
- **Accessibility:** built to WCAG 2.2 AA (semantic HTML, keyboard operable, visible focus, alt text, reduced-motion support).

## Run locally

```bash
npm install
npm run dev        # start dev server (http://localhost:5173)
npm run build      # typecheck + production build to dist/
npm run preview    # preview the production build
npm test           # unit tests
npm run lint       # lint
```

## For the shop owner — two things you can update

### 1. Your logo
A placeholder logo (`public/logo.jpg`) is already wired in. To use a different file, drop it
into `public/` and change **one line** in [`src/lib/config.ts`](src/lib/config.ts):

```ts
export const LOGO_SRC = '/logo.jpg'   // e.g. change to '/logo.png' or '/logo.svg'
```

### 2. Your own product photos
The example products were gathered from the brands you stock (Jockey, U.S. Polo Assn.,
Van Heusen, Enamor) to show the *kind* of stock available. **When you have your own photos,
replace them:** edit the data in [`scripts/build-data.mjs`](scripts/build-data.mjs) (names,
descriptions, image URLs) and run `node scripts/build-data.mjs`, **or** edit
[`src/data/products.json`](src/data/products.json) directly and drop matching images into
`public/images/`. Any product with an empty `image` shows a tasteful branded placeholder.

## Trademark note

Brand names, product names, and images shown belong to their respective owners and are used
only to represent stock available in-store. Please replace them with your own product photos
when you can.

## Contact details

Phone/WhatsApp **+91 70163 26205** · Email **dipnilbhanushali@gmail.com** ·
Shop No. 3, Ground Floor, Utsav Elegance, Bhuyangdev Crossroad, Sola Road, Ahmedabad 380061.
These live in [`src/lib/contact.ts`](src/lib/contact.ts).

## Deploy (Vercel)

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com), **Add New → Project → Import** this repo.
3. Vercel auto-detects Vite (build `npm run build`, output `dist`). Click **Deploy**.
4. You'll get a live `…vercel.app` link. A branded domain can be added later via a CNAME record.

Security headers (CSP, HSTS, X-Frame-Options, etc.) are configured in [`vercel.json`](vercel.json).
