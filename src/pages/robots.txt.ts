/**
 * robots.txt генерируется на сборке, чтобы адрес карты сайта всегда
 * совпадал с реальным доменом: stasyclean.com.
 */

import type { APIRoute } from 'astro';

import { BASE } from '../i18n/routes';

export const GET: APIRoute = () => {
  const origin = import.meta.env.SITE || 'https://stasyclean.com';
  // BASE — тот же нормализованный base, что и во всех адресах сайта
  // (src/i18n/routes.ts), поэтому карта сайта не может разъехаться с ссылками.
  const baseUrl = new URL(BASE, origin).href.replace(/\/$/, '');

  const lines = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${baseUrl}/sitemap-index.xml`,
  ];

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
