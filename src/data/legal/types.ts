import type { Locale } from '../../i18n/config';

/** Раздел юридического документа: заголовок, абзацы и необязательный список. */
export interface LegalSection {
  title: string;
  paragraphs: string[];
  list?: string[];
}

export interface LegalContent {
  /** ISO-дата последнего обновления. */
  updated: string;
  /** Локализованная подпись «Обновлено» / «Ažurirano» / «Last updated». */
  updatedLabel: string;
  sections: LegalSection[];
}

export type LegalDocKey = 'privacy' | 'terms';

export type LegalDocs = Record<LegalDocKey, Record<Locale, LegalContent>>;
