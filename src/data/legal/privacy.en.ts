import type { LegalContent } from './types';

/**
 * Privacy policy (English).
 * Mirror of privacy.ru.ts: same section order so the three languages can be
 * compared line by line. TEMPLATE — must be reviewed by a lawyer before launch.
 */

export const privacyEn: LegalContent = {
  updated: '2026-09-27',
  updatedLabel: 'Last updated',
  sections: [
    {
      title: 'Who processes your data',
      paragraphs: [
        'The data controller is StasyClean, a cleaning service operating in Belgrade. The controller’s full details (legal name, address, PIB and company registration number) will be published in this section before the site goes live.',
      ],
    },
    {
      title: 'What data we collect',
      paragraphs: [
        'We only process the data you provide yourself when you contact us through the form, Telegram or WhatsApp:',
      ],
      list: [
        'the name we should address you by;',
        'your phone number or Telegram username;',
        'the district where the cleaning is needed;',
        'your preferred date and time;',
        'a comment with details: area, pets, special requests.',
      ],
    },
    {
      title: 'Why we process it',
      paragraphs: [
        'The only purpose is to quote the cleaning, agree on a date and time, and get back to you about your request. We do not use your data for advertising, do not build profiles and do not sell it.',
      ],
    },
    {
      title: 'Legal basis',
      paragraphs: [
        'The legal basis is your consent, given by ticking the relevant box in the form, together with the steps necessary to enter into and perform the service agreement under the Serbian Personal Data Protection Act (Official Gazette of the Republic of Serbia no. 87/2018).',
      ],
    },
    {
      title: 'Who receives the data',
      paragraphs: [
        'Your data is not shared with third parties for marketing or any other purpose. Please note that if you message us on Telegram or WhatsApp, processing also happens under those services’ own rules, which we do not control. The site itself never sends your data to third-party servers: the buttons simply open the chat.',
      ],
    },
    {
      title: 'How long we keep it',
      paragraphs: [
        'Requests that did not lead to an agreement are deleted within 6 months. Data relating to completed orders is kept to the extent required for accounting and tax records.',
      ],
    },
    {
      title: 'Your rights',
      paragraphs: [
        'You may request access to your data, ask for it to be corrected or deleted, withdraw your consent and object to processing. Just message us on Telegram. If you believe your rights have been infringed, you may contact the Serbian Commissioner for Information of Public Importance and Personal Data Protection.',
      ],
    },
    {
      title: 'Cookies and local storage',
      paragraphs: [
        'This site loads no third-party analytics, advertising pixels or tracking systems. Technical cookies are not used to identify visitors.',
        'Your light/dark scheme choice (and cookie consent, if given) is stored in your browser’s local storage. That data never leaves your browser and is removed when you clear site data.',
      ],
    },
    {
      title: 'Changes to this policy',
      paragraphs: [
        'The current version is always published on this page; the date of the last update is shown above.',
      ],
    },
  ],
};
