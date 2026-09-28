import type { LegalDocs } from './types';

import { privacySr } from './privacy.sr';
import { privacyEn } from './privacy.en';
import { privacyRu } from './privacy.ru';

import { termsSr } from './terms.sr';
import { termsEn } from './terms.en';
import { termsRu } from './terms.ru';

/**
 * Юридические документы.
 *
 * Каждый документ разложен по локалям, а порядок разделов во всех трёх
 * версиях одинаков — это позволяет сравнивать языковые версии построчно
 * и сразу видеть расхождения при правках.
 *
 * Тексты — шаблоны, требуют проверки юристом.
 */
export const legalDocs: LegalDocs = {
  privacy: { sr: privacySr, en: privacyEn, ru: privacyRu },
  terms: { sr: termsSr, en: termsEn, ru: termsRu },
};

export type { LegalContent, LegalDocKey, LegalSection, LegalDocs } from './types';
