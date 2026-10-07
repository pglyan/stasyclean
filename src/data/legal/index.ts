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

/**
 * Число и порядок разделов одинаковы во всех локалях — иначе секции
 * одного документа рассинхронятся между языками молча (тип такой
 * разницы не ловит). Проверка на этапе сборки.
 */
for (const [doc, content] of Object.entries(legalDocs)) {
  const counts = Object.values(content).map((localized) => localized.sections.length);
  if (new Set(counts).size > 1) {
    throw new Error(`Документ «${doc}»: разное число разделов в локалях (${counts.join('/')}).`);
  }
}

export type { LegalContent, LegalDocKey, LegalSection, LegalDocs } from './types';
