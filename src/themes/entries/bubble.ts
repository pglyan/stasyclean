import type { ThemeEntry } from '../types';
import { urls as comfortaa } from '../../fonts/comfortaa.urls';
import { urls as manrope } from '../../fonts/manrope.urls';

/**
 * Прод-вход темы «Голубая свежесть».
 *
 * Comfortaa — заголовки (характер темы держится на округлой геометрии),
 * Manrope — текст и второй вариант заголовков в панели, поэтому её файлы
 * тоже попадают в бюджет сборки. Остальные семейства тема не разрешает
 * в `available`, и в её сборку они не попадут.
 */
export default {
  id: 'bubble',
  fonts: { comfortaa, manrope },
} satisfies ThemeEntry;
