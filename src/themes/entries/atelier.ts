import type { ThemeEntry } from '../types';
import { urls as playfair } from '../../fonts/playfair-display.urls';
import { urls as manrope } from '../../fonts/manrope.urls';

/**
 * Прод-вход темы «Ателье».
 *
 * Тема везёт два семейства: Playfair Display (заголовки, её главный признак)
 * и Manrope (текст). Lora здесь не нужна, поэтому её файлы в сборку не
 * попадут, даже если заказчик переключит шрифт: список `available`
 * в src/data/themes.ts ограничен этими двумя семействами плюс системным.
 */
export default {
  id: 'atelier',
  fonts: { playfair, manrope },
} satisfies ThemeEntry;
