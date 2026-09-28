import type { ThemeEntry } from '../types';
import { urls as manrope } from '../../fonts/manrope.urls';
import { urls as lora } from '../../fonts/lora.urls';

/**
 * Прод-вход темы «Свежая мята».
 *
 * Алиас `@theme` указывает сюда, когда тема выбрана в design.config.json.
 * Импортируются адреса только тех семейств, которые тема объявила в
 * `available` (src/data/themes.ts) — остальные woff2 в сборку не попадут.
 * Сам CSS темы подключается отдельным алиасом `@skin`.
 */
export default {
  id: 'fresh',
  fonts: { manrope, lora },
} satisfies ThemeEntry;
