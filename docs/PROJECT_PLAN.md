# Tailhood Kennel — project plan

## About the business
- **Name:** Tailhood Kennel (logo wordmark: "TAILHOOD — GOLDEN RETRIEVER")
- **Domain:** tailhoodkennel.com (registered on Cloudflare)
- **Offering:** Golden Retriever puppy sales and breeding
- **Contact details:** not yet decided. Add them in `src/config/site.ts` when ready.
- **Launch date:** not set, so the page deliberately has no countdown.

## Phase 1: coming-soon page (done)
A single-screen, animated landing page:
- Logo badge with a gold glow halo and a light sweep across the gold
- "COMING SOON" / *Something golden is on its way*, then a sub-line and "Website launching soon"
- Background: diagonal satin bands, a warm glow, floating gold bokeh, a looping paw-print trail, and a gold frame that draws itself
- No JavaScript is shipped. All animation is CSS and SVG, and it turns off for visitors who set "reduce motion".
- 404 page in the same style ("This pup wandered off")
- SEO: title, description, canonical, Open Graph and Twitter cards (1200×630 share image), Organization JSON-LD, robots.txt, web manifest, favicons
- Cloudflare `_headers`: long-term caching for hashed assets, plus basic security headers

## Brand
| Token       | Value     | Use                       |
| ----------- | --------- | ------------------------- |
| `--ink-0`   | `#0b0b0b` | page background           |
| `--ink-2`   | `#161616` | satin highlight bands     |
| `--gold-100`| `#ffe9a8` | brightest highlight       |
| `--gold-200`| `#f7d774` | light gold, links         |
| `--gold-400`| `#d4a12a` | main gold, lines, paws    |
| `--gold-600`| `#9a6b12` | deep gold, gradient ends  |
| `--cream`   | `#f3e6c4` | body text                 |

- **Display font:** Cinzel (headlines) **Body font:** Poppins (letter-spaced caps for small labels)
- **Style:** luxury gold on black, taken from the framed logo (thin gold border, diagonal corner accents)

## Asset inventory (`src/assets/brand/`, `public/`)
| File | Source | Purpose |
| --- | --- | --- |
| `tailhood-logo.png` (2000px, transparent) | `Tailhood-Logo PNG.png` (8192px) | main web logo; Astro converts it to WebP |
| `tailhood-logo-framed.jpg` (2048px) | `Tailhood-Logo.jpg.jpeg` | social posts, future use |
| `tailhood-badge.png` (512px) | crop of the dog disc | 404 page, small avatars |
| `tailhood-logo-original.pdf` | original PDF | archive |
| `public/og-image.jpg` (1200×630) | composed | link previews on WhatsApp, Instagram and Facebook |
| `public/favicon.ico`, `favicon-32.png` | dog disc | browser tab |
| `public/apple-touch-icon.png`, `icon-192/512.png` | dog disc in a gold ring | home-screen icons |

## Tech decisions
- **Astro 7, static output.** No server or adapter is needed, and Cloudflare Pages serves plain files.
- **Node 24 LTS** (`.nvmrc`). Astro 7.4.7+ is required to pick up security fixes, and it needs Node ≥ 22.23.4.
- **No animation library.** CSS and SVG are enough, which keeps the page weight to about 70 KB plus fonts.
- **Decorative randomness is seeded** (`src/lib/random.ts`), so builds are deterministic.

## Roadmap
### Phase 2: full website
- **Home:** hero, about the kennel, why Tailhood
- **Puppies:** available litters (photos, age, gender, status: available, reserved or sold)
- **Our Goldens:** parent dogs, pedigree, health clearances (hips, elbows, eyes, heart)
- **Gallery:** photos and videos
- **About:** our story, how we raise puppies, what's included (vaccinations, deworming, microchip, papers)
- **FAQ and puppy enquiry**
- **Contact:** WhatsApp button, phone, email, Instagram, map or location
- Consider Astro content collections (Markdown/JSON) so puppies and litters can be updated without touching code

### Nice-to-haves
- "Notify me" or enquiry form: Cloudflare Pages Function + D1, protected with Turnstile
- Cloudflare Email Routing: `hello@tailhoodkennel.com` forwarding to the owner's inbox
- Cloudflare Web Analytics (free, no cookies)
- Google Business Profile linked to the site
