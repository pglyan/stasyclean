import type { ThemeEntry } from '../types';
import { urls as manrope } from '../../fonts/manrope.urls';
import { urls as lora } from '../../fonts/lora.urls';

/** Прод-вход темы «Тёплый песок» — см. комментарий в entries/fresh.ts. */
export default {
  id: 'sand',
  fonts: { manrope, lora },
} satisfies ThemeEntry;
