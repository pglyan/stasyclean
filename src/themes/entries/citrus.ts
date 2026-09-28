import type { ThemeEntry } from '../types';
import { urls as manrope } from '../../fonts/manrope.urls';
import { urls as lora } from '../../fonts/lora.urls';

/** Прод-вход темы «Цитрусовая энергия» — см. комментарий в entries/fresh.ts. */
export default {
  id: 'citrus',
  fonts: { manrope, lora },
} satisfies ThemeEntry;
