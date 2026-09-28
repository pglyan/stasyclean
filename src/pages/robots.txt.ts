/**
 * robots.txt генерируется на сборке, чтобы адрес карты сайта всегда
 * совпадал с реальным доменом: прод — stasyclean.com,
 * демо-сборка на GitHub Pages — pglyan.github.io/stasyclean/.
 *
 * Демо-стенд закрыт от индексации целиком: это презентационный вариант
 * с временным контентом, он не должен конкурировать с рабочим сайтом.
 */

import type { APIRoute } from 'astro';

import { BASE } from '../i18n/routes';

export const GET: APIRoute = () => {
  const origin = import.meta.env.SITE || 'https://stasyclean.com';
  const isDemo = import.meta.env.PUBLIC_DEMO === 'on';
  // BASE — тот же нормализованный base, что и во всех адресах сайта
  // (src/i18n/routes.ts), поэтому карта сайта не может разъехаться с ссылками.
  const baseUrl = new URL(BASE, origin).href.replace(/\/$/, '');

  const lines = isDemo
    ? [
        '# Демонстрационный стенд: индексация полностью закрыта.',
        '# Рабочая версия сайта будет опубликована на stasyclean.com.',
        'User-agent: *',
        'Disallow: /',
      ]
    : [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${baseUrl}/sitemap-index.xml`,
      ];

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
