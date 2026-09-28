import type { ThemeEntry } from '../types';
import { urls as manrope } from '../../fonts/manrope.urls';

/**
 * Прод-вход темы «Бетон и бумага».
 *
 * Самый лёгкий вход в проекте: тема держится на вёрстке, а не на шрифте —
 * ей хватает Manrope и системного моноширинного. Другие семейства в
 * `available` не перечислены, значит их woff2 в сборку не уедут.
 */
export default {
  id: 'zine',
  fonts: { manrope },
} satisfies ThemeEntry;
