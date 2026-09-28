import type { FontKind, FontUrls, ThemeEntry } from '../types';
import fresh from './fresh';
import trust from './trust';
import citrus from './citrus';
import sand from './sand';
import nordic from './nordic';
import atelier from './atelier';
import mila from './mila';
import bubble from './bubble';
import sorbet from './sorbet';
import zine from './zine';

/**
 * Демонстрационный вход тем.
 *
 * Алиас `@theme` ведёт сюда при PUBLIC_DEMO=on. Задача файла — отдать
 * Base.astro адреса шрифтов для предзагрузки по любой теме, которую
 * заказчик выберет в панели: в демо в бандле лежат все семейства,
 * поэтому можно предзагружать субсет выбранного шрифта сразу.
 *
 * id здесь — 'all': в демо тема меняется в браузере, а не на сборке,
 * поэтому «текущая тема» известна только из data-skin на <html>.
 */
const entries = [fresh, trust, citrus, sand, nordic, atelier, mila, bubble, sorbet, zine];

const fonts: Partial<Record<FontKind, FontUrls>> = {};

for (const entry of entries) {
  for (const [kind, urls] of Object.entries(entry.fonts)) {
    fonts[kind as FontKind] = urls;
  }
}

export default {
  id: 'all',
  fonts,
} satisfies ThemeEntry;
