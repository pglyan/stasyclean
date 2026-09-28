import type { ThemeEntry } from '../types';
import { urls as manrope } from '../../fonts/manrope.urls';
import { urls as lora } from '../../fonts/lora.urls';

/** Прод-вход темы «Глубокий синий» — см. комментарий в entries/fresh.ts. */
export default {
  id: 'trust',
  fonts: { manrope, lora },
} satisfies ThemeEntry;
