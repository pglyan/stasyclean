import type { ThemeEntry } from '../types';
import { urls as nunito } from '../../fonts/nunito.urls';
import { urls as manrope } from '../../fonts/manrope.urls';

/**
 * Прод-вход темы «Милота».
 *
 * Nunito — и заголовки, и текст: характер темы держится на одном округлом
 * семействе. Manrope оставлена как второй вариант шрифта в панели, поэтому
 * её файлы тоже попадают в бюджет сборки (когда тема выбрана).
 */
export default {
  id: 'mila',
  fonts: { nunito, manrope },
} satisfies ThemeEntry;
