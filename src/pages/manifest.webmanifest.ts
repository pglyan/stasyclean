import type { APIRoute } from 'astro';
import { site, siteText } from '../data/site';
import { asset, BASE } from '../i18n/routes';
import { brandHex } from '../themes/brand';
import { lightTokens } from '../themes/tokens';

/**
 * manifest.webmanifest — собирается из данных сайта и токенов темы.
 *
 * Раньше это был статический файл в public/ с захардкоженными цветами
 * (#12a87b на #ffffff) и сербскими текстами — он разъезжался и с палитрой
 * (src/themes/tokens.ts), и со словарями. Теперь источник тот же, что
 * у страницы: brand/name/description из src/data/site.ts, цвета — из
 * токенов темы. Имя и описание — на языке по умолчанию (sr):
 * manifest не локализуется браузерами.
 */
export const GET: APIRoute = () => {
  const palette = lightTokens;

  return new Response(
    JSON.stringify({
      name: `${site.brand} — ${siteText.tagline.sr}`,
      short_name: site.brand,
      description: siteText.metaDescription.sr,
      start_url: BASE,
      scope: BASE,
      display: 'standalone',
      background_color: palette.bg,
      theme_color: brandHex(palette),
      icons: [{ src: asset('favicon.svg'), sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
};
