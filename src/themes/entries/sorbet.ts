import type { ThemeEntry } from '../types';
import { urls as nunito } from '../../fonts/nunito.urls';
import { urls as manrope } from '../../fonts/manrope.urls';

/**
 * Прод-вход темы «Сорбет».
 *
 * Nunito — заголовки (округлая геометрия линии), Manrope — текст и второй
 * вариант заголовков в панели. Оба семейства уже везёт «Милота», так что
 * новой теме не нужен ни один новый файл шрифта.
 */
export default {
  id: 'sorbet',
  fonts: { nunito, manrope },
} satisfies ThemeEntry;
