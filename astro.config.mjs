// @ts-check
import { defineConfig } from 'astro/config';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: 'https://tailhoodkennel.com',
  // Fully static output — deploys as plain files to Cloudflare Pages.
  output: 'static',
  build: {
    // Single small page: inline CSS to avoid a render-blocking request.
    inlineStylesheets: 'always',
  },
});
