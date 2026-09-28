import type { LegalContent } from './types';

/**
 * Terms of service (English).
 * Mirror of terms.ru.ts. The surcharges and limits repeat the client’s
 * published price list verbatim so the site never promises more than
 * the company actually offers.
 */

export const termsEn: LegalContent = {
  updated: '2026-09-27',
  updatedLabel: 'Last updated',
  sections: [
    {
      title: 'General',
      paragraphs: [
        'StasyClean provides apartment and house cleaning services in Belgrade. Below we describe how to book, how the price is calculated, how payment and cancellation work, and what the service does and does not include.',
      ],
    },
    {
      title: 'Request and price',
      paragraphs: [
        'Requests are placed on Telegram or through the form on this site. The price is calculated from the area of the property and the chosen plan, and is fixed before work begins.',
        'The price does not depend on how many hours the cleaning takes. Additional services and window washing are agreed separately and charged on top.',
      ],
    },
    {
      title: 'Surcharges',
      paragraphs: ['The price may increase by 20% to 50% in the following cases:'],
      list: [
        'heavy soiling of the apartment;',
        'a large amount of pet hair;',
        'rooms heavily cluttered with belongings;',
        'more than 20 days between regular cleanings.',
      ],
    },
    {
      title: 'What the service includes',
      paragraphs: [
        'The full list of work is published in the checklist for each type of cleaning. The vacuum cleaner, stepladder, professional products and all supplies are included in the price — you do not need to provide any equipment.',
      ],
    },
    {
      title: 'Payment',
      paragraphs: [
        'Payment is made after the work is completed and you have accepted the result. Cash and bank transfer are both possible; companies can be invoiced under a contract.',
      ],
    },
    {
      title: 'Cancellation and rescheduling',
      paragraphs: [
        'Please tell us about a cancellation or change as early as you can: there is no extra charge if plans change in good time. If the cleaner has already arrived, any further booking is by prior arrangement.',
      ],
    },
    {
      title: 'Liability',
      paragraphs: [
        'We are responsible for the safety of your property; the compensation procedure is set out in the contract. Please tell us in advance about surfaces that need special care: marble, natural wood, high-gloss finishes.',
      ],
    },
    {
      title: 'Changes to these terms',
      paragraphs: [
        'The current version is published on this page. We will announce material changes on the site.',
      ],
    },
  ],
};
