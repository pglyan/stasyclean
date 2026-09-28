/**
 * Адреса субсетов Nunito для предзагрузки.
 * Логика та же, что у Manrope: один файл под алфавит локали.
 */

import latin from '../assets/fonts/nunito-latin.woff2?url';
import latinExt from '../assets/fonts/nunito-latin-ext.woff2?url';
import cyrillic from '../assets/fonts/nunito-cyrillic.woff2?url';

import type { FontUrls } from '../themes/types';

export const urls: FontUrls = {
  sr: latinExt,
  en: latin,
  ru: cyrillic,
};
