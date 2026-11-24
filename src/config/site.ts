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
    email: '',
    instagram: '',
  },
} as const;
