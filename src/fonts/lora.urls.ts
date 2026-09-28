/**
 * Адреса субсетов Lora для предзагрузки. Логика та же, что у Manrope:
 * один файл под алфавит локали, остальные подтянутся сами, если встретятся.
 */

import latin from '../assets/fonts/lora-latin.woff2?url';
import latinExt from '../assets/fonts/lora-latin-ext.woff2?url';
import cyrillic from '../assets/fonts/lora-cyrillic.woff2?url';

import type { FontUrls } from '../themes/types';

export const urls: FontUrls = {
  sr: latinExt,
  en: latin,
  ru: cyrillic,
};
