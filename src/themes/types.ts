/**
 * Словарь оформления: шрифтовые семейства и адреса их субсетов.
 *
 * Цвета — в src/themes/tokens.ts, параметры стиля — в src/styles/tokens.css,
 * сам набор оформления — в src/theme.ts.
 */

import type { Locale } from '../i18n/config';

/** Шрифтовые семейства. `system` — вариант без веб-шрифтов (ноль загрузки). */
export type FontKind = 'manrope' | 'lora' | 'system';

/** Адреса субсетов одного семейства: локаль → URL готового ассета. */
export type FontUrls = Record<Locale, string>;
