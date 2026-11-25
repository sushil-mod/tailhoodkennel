/**
 * Cloudflare Pages Function — POST /api/enquiry
 *
 * Receives the website enquiry form, checks Cloudflare Turnstile (anti-spam),
 * then emails the enquiry to the kennel via Resend (https://resend.com).
 *
 * Environment variables (Cloudflare → Pages project → Settings → Variables and Secrets):
 *   RESEND_API_KEY        (secret)  Resend API key
 *   TURNSTILE_SECRET_KEY  (secret)  Turnstile widget secret key
 *   ENQUIRY_TO            (optional) where enquiries go   — default contact@tailhoodkennel.com
 *   ENQUIRY_FROM          (optional) sender shown in inbox — default "Tailhood Website <website@tailhoodkennel.com>"
 */

interface Env {
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  ENQUIRY_TO?: string;
  ENQUIRY_FROM?: string;
}

interface Context {
  request: Request;
  env: Env;
}

const DEFAULT_TO = 'contact@tailhoodkennel.com';
const DEFAULT_FROM = 'Tailhood Website <website@tailhoodkennel.com>';

// Keep in sync with `enquiryInterests` in src/config/site.ts
const INTERESTS = ['Available puppies', 'Upcoming litter', 'General question'] as const;

const LIMITS = {
  name: 100,
  email: 200,
  phone: 40,
  city: 100,
  message: 3000,
} as const;

type Fields = {
  name: string;
  email: string;
  phone: string;
  city: string;
  interest: string;
  message: string;
};

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');
  const reply = (ok: boolean, message: string, status = ok ? 200 : 400) =>
    wantsJson
      ? Response.json({ ok, message }, { status, headers: { 'Cache-Control': 'no-store' } })
      : Response.redirect(new URL(`/contact/?${ok ? 'sent=1' : 'error=1'}`, request.url).toString(), 303);

  if (!env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY) {
    console.error('Enquiry form is not configured: missing RESEND_API_KEY or TURNSTILE_SECRET_KEY');
    return reply(false, 'The enquiry form is not available right now. Please email us instead.', 500);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply(false, 'Invalid form submission.');
  }

  // Honeypot: real visitors never see or fill this field.
  if (str(form.get('company'))) {
    return reply(true, 'Thank you!');
  }

  const fields: Fields = {
    name: oneLine(str(form.get('name'))),
    email: oneLine(str(form.get('email'))),
    phone: oneLine(str(form.get('phone'))),
    city: oneLine(str(form.get('city'))),
    interest: oneLine(str(form.get('interest'))),
    message: str(form.get('message')),
  };

  const invalid = validate(fields);
  if (invalid) return reply(false, invalid);

  // --- Turnstile verification ---
  const token = str(form.get('cf-turnstile-response'));
  if (!token) return reply(false, 'Please complete the security check.');

  const human = await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, request.headers.get('CF-Connecting-IP'));
  if (!human) return reply(false, 'Security check failed. Please try again.', 403);

  // --- Send email via Resend ---
  const sent = await sendEmail(env, fields);
  if (!sent) {
    return reply(false, 'Sorry, we could not send your enquiry. Please try again or email us directly.', 502);
  }

  return reply(true, 'Thank you! Your enquiry has been sent. We will get back to you soon.');
};

/* ------------------------------------------------------------------------ */

function str(v: FormDataEntryValue | null): string {
  return typeof v === 'string' ? v.trim() : '';
}

function oneLine(s: string): string {
  return s.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ');
}

function validate(f: Fields): string | null {
  if (!f.name) return 'Please enter your name.';
  if (!f.email) return 'Please enter your email address.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) return 'Please enter a valid email address.';
  if (!f.message) return 'Please enter a message.';
  if (f.interest && !(INTERESTS as readonly string[]).includes(f.interest)) return 'Please choose a valid option.';
  if (f.phone && !/^[+\d\s().-]{6,}$/.test(f.phone)) return 'Please enter a valid phone number.';

  for (const [key, max] of Object.entries(LIMITS) as [keyof typeof LIMITS, number][]) {
    if (f[key].length > max) return `The ${key} field is too long.`;
  }
  return null;
}

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (!data.success) console.warn('Turnstile failed', data['error-codes']);
    return Boolean(data.success);
  } catch (err) {
    console.error('Turnstile request error', err);
    return false;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendEmail(env: Env, f: Fields): Promise<boolean> {
  const rows: [string, string][] = [
    ['Name', f.name],
    ['Email', f.email],
    ['Phone / WhatsApp', f.phone || '—'],
    ['City', f.city || '—'],
    ['Interested in', f.interest || '—'],
  ];

  const text = [
    'New enquiry from tailhoodkennel.com',
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    'Message:',
    f.message,
    '',
    '— Reply to this email to answer the enquirer directly.',
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;color:#222">
      <h2 style="margin:0 0 12px;color:#9a6b12">New enquiry — Tailhood Kennel</h2>
      <table cellpadding="6" style="border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="color:#777;white-space:nowrap;vertical-align:top">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`,
          )
          .join('')}
      </table>
      <p style="margin:16px 0 6px;color:#777;font-size:14px">Message</p>
      <div style="white-space:pre-wrap;font-size:15px;line-height:1.5;border-left:3px solid #d4a12a;padding-left:12px">${escapeHtml(f.message)}</div>
      <p style="margin-top:20px;color:#999;font-size:12px">Reply to this email to answer ${escapeHtml(f.name)} directly.</p>
    </div>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.ENQUIRY_FROM || DEFAULT_FROM,
        to: [env.ENQUIRY_TO || DEFAULT_TO],
        reply_to: f.email,
        subject: `New enquiry from ${f.name}${f.interest ? ` — ${f.interest}` : ''}`,
        text,
        html,
      }),
    });
    if (!res.ok) {
      console.error('Resend error', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('Resend request error', err);
    return false;
  }
}
