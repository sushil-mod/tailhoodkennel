/**
 * Central site settings. Edit this file to update copy and contact details —
 * no other files need to change.
 */
export const site = {
  name: 'Tailhood Kennel',
  breed: 'Golden Retriever',
  url: 'https://tailhoodkennel.com',
  title: 'Tailhood Kennel | Golden Retriever Puppies — Coming Soon',
  description:
    'Tailhood Kennel — healthy, well-raised Golden Retriever puppies. Our new website is coming soon to tailhoodkennel.com.',
  themeColor: '#0b0b0b',

  /**
   * Contact details. Leave a value as an empty string to hide it.
   * As soon as any value is filled in, it appears in the page footer.
   *   whatsapp:  full number with country code, digits only, e.g. '919876543210'
   *   phone:     as you want it dialled, e.g. '+91 98765 43210'
   *   email:     e.g. 'hello@tailhoodkennel.com'
   *   instagram: handle without @, e.g. 'tailhoodkennel'
   */
  contact: {
    whatsapp: '',
    phone: '',
    email: 'contact@tailhoodkennel.com',
    instagram: '',
  },

  /**
   * Cloudflare Turnstile SITE key (public — safe to commit).
   * Cloudflare dashboard → Turnstile → "Tailhood enquiry" widget → Site Key.
   * - Production builds use the real key (only works on the widget's hostnames).
   * - `npm run dev` uses Cloudflare's always-pass TEST key so the form works on localhost.
   * - Override either with the PUBLIC_TURNSTILE_SITE_KEY env var at build time.
   */
  turnstileSiteKey:
    import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ||
    (import.meta.env.DEV ? '1x00000000000000000000AA' : '0x4AAAAAAGSOjA1X6Qe16fCG'),

  /** Options for "Interested in" — keep in sync with functions/api/enquiry.ts */
  enquiryInterests: ['Available puppies', 'Upcoming litter', 'General question'],
} as const;
