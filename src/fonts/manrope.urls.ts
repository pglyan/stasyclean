/**
 * Адреса субсетов Manrope для предзагрузки.
 *
 * Браузеру нужен ровно один файл шрифта заголовков — тот, чей алфавит
 * соответствует локали страницы: сербскому нужен latin-ext (č ć ž š đ),
 * английскому latin, русскому cyrillic. Список формируется на сборке,
 * поэтому адреса приходят уже с хешем и с базовым путём текущей сборки.
 *
 * Модуль намеренно разделён по семействам: тема импортирует только те,
 * которые объявила, и в прод-сборку не попадают woff2 «на всякий случай».
 */

import latin from '../assets/fonts/manrope-latin.woff2?url';
import latinExt from '../assets/fonts/manrope-latin-ext.woff2?url';
import cyrillic from '../assets/fonts/manrope-cyrillic.woff2?url';

import type { FontUrls } from '../themes/types';

export const urls: FontUrls = {
  sr: latinExt,
  en: latin,
  ru: cyrillic,
};
