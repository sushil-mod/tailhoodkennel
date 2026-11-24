# Tailhood Kennel — tailhoodkennel.com

The "coming soon" page for **Tailhood Kennel**, which breeds Golden Retrievers.
Built with [Astro](https://astro.build) as a fully static site and deployed on Cloudflare Pages.

## Requirements

- **Node.js 24** (this repo includes `.nvmrc`). Astro 7 needs Node 22.23.4 or newer.
  - With nvm-windows: `nvm use 24.22.3`

## Commands

| Command           | What it does                                |
| ----------------- | ------------------------------------------- |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Local dev server at http://localhost:4321   |
| `npm run build`   | Build the static site into `dist/`          |
| `npm run preview` | Serve the built `dist/` locally             |

## Editing content

- **Text, title, description and contact details** live in [`src/config/site.ts`](src/config/site.ts).
  Fill in `whatsapp`, `phone`, `email` or `instagram` there, and buttons for them appear in the footer automatically.
- **Page layout and copy:** [`src/pages/index.astro`](src/pages/index.astro)
- **Colours, fonts and shared animations:** [`src/styles/global.css`](src/styles/global.css)

## Project structure

```
public/                    static files copied as-is (favicons, og-image, robots, _headers)
src/assets/brand/          logo masters (transparent PNG, framed JPG, badge, original PDF)
src/components/            Logo, Backdrop (Particles + PawTrail + GoldFrame), ContactSlot
src/config/site.ts         site settings and contact details
src/layouts/BaseLayout     <head>: SEO, Open Graph, favicons, fonts
src/pages/                 index (coming soon) and 404
docs/PROJECT_PLAN.md       brand notes, decisions and roadmap
```

## Deploying to Cloudflare Pages

1. Push this repo to GitHub.
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git** and pick the repo.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION` = `24`
4. After the first deploy, open **Custom domains** and add `tailhoodkennel.com` and `www.tailhoodkennel.com`.
   DNS records are created automatically because the domain is on Cloudflare.
5. Optional: add a **Redirect Rule** sending `www.tailhoodkennel.com/*` to `https://tailhoodkennel.com/$1` (301).

Every push to the main branch redeploys automatically. Other branches get preview URLs.
