/**
 * robots.txt генерируется на сборке, чтобы адрес карты сайта всегда
 * совпадал с реальным доменом.
 *
 * Прод (stasyclean.com) открыт для индексации. Любая другая площадка
 * (например, предпросмотр на GitHub Pages) закрывается целиком: предпросмотр
 * не должен конкурировать с рабочим сайтом в поиске.
 */

import type { APIRoute } from 'astro';

import { BASE } from '../i18n/routes';

const PROD_ORIGIN = 'https://stasyclean.com';

export const GET: APIRoute = () => {
  const origin = import.meta.env.SITE || PROD_ORIGIN;

  if (origin !== PROD_ORIGIN) {
    return new Response(
      ['# Предпросмотр: индексация полностью закрыта.', 'User-agent: *', 'Disallow: /', ''].join(
        '\n',
      ),
      { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    );
  }

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
