import type { UIStrings } from './ru';

/** English interface strings. Must mirror every key of the Russian dictionary. */
export const en = {
  nav: {
    home: 'Home',
    prices: 'Prices',
    services: 'Services',
    about: 'About',
    reviews: 'Reviews',
    faq: 'FAQ',
    contact: 'Contact',
    language: 'Language',
    /** Accessible name of the main navigation — distinct from the menu button. */
    main: 'Main navigation',
  },

  cta: {
    book: 'Book a cleaning',
    telegram: 'Message us on Telegram',
    whatsapp: 'WhatsApp',
    call: 'Call',
    calculate: 'Calculate the price',
    details: 'Learn more',
    allServices: 'All services',
    /** The “back to home” button — used on the 404 page. */
    back: 'Back to home',
    menu: 'Menu',
    close: 'Close',
    /** Короткие подписи для закреплённой панели на телефоне (см. ru.ts). */
    bookShort: 'Book',
    calcShort: 'Calculate',
    orderShort: 'Send',
    order: 'Send request with the quote',
  },

  price: {
    from: 'from',
    hour: 'hour',
    minimum: 'Minimum order',
    popular: 'Most popular choice',
    area: 'Area',
    total: 'Estimated price',
    totalNote: 'The final price is confirmed by our manager on Telegram',
    included: 'What the price covers',
  },

  common: {
    provisional: 'Provisional data',
    /** Skip link for keyboard navigation (base.css, .skip-link). */
    skipToContent: 'Skip to content',
    /** Accessible name of the breadcrumb nav (PageHero.astro). */
    breadcrumb: 'Breadcrumb',
    /** Accessible name of the mobile menu dialog — distinct from the menu button. */
    menuDialog: 'Site menu',
    /** Date label on legal documents (Legal.astro). */
    updated: 'Last updated',
  },

  home: {
    servicesTitle: 'What we clean',
    servicesLead:
      'Four formats — from keeping your home clean on a schedule to cleaning up after a renovation.',
    pricesTitle: 'Prices by area',
    pricesLead:
      'The price does not depend on how many hours the work takes. We fix the amount before we come.',
    calculatorTitle: 'Estimate your cleaning',
    calculatorLead:
      'Pick the area, the format and any extra tasks — you will see the price range in a couple of seconds.',
    includedTitle: 'What is included',
    includedLead: 'The full list of work, with no “and anything else” wording.',
    extrasTitle: 'Additional services',
    extrasLead:
      'They can be added to any cleaning and are agreed separately — exactly as stated in our price list.',
    windowsTitle: 'Window washing',
    windowsLead: 'Charged per sash. For heavily soiled windows the price may be higher.',
    stepsTitle: 'How we work',
    stepsLead: 'Four steps from a Telegram message to payment after you have inspected the work.',
    aboutTitle: 'About us',
    aboutLead:
      'We work in Belgrade, bring all the equipment and products, and stand behind the result.',
    reviewsTitle: 'What clients say',
    reviewsLead: 'Reviews reach us through Telegram and Instagram.',
    areasTitle: 'Where we work',
    areasLead: 'Belgrade, all central and residential districts.',
    /** Note under the district list: coverage is still being confirmed. */
    areasNote: 'The district list is preliminary — we will confirm it when you book.',
    faqTitle: 'Frequently asked questions',
    faqLead: 'The questions we hear most often before a booking.',
    formTitle: 'Send a request',
    formLead: 'Tell us the area, the district and a date that suits you. We reply within the day.',
    contactTitle: 'Get in touch',
    contactLead: 'The fastest way is Telegram.',
  },

  calc: {
    areaLabel: 'Apartment area',
    planLabel: 'Cleaning format',
    extrasLabel: 'Extra tasks',
    hoursLabel: 'How many hours you need',
    resultHint:
      'This is a guide only. We will confirm the exact amount after a couple of quick questions.',
    noExtras: 'No extra tasks selected',
    detailsShow: 'Show details',
    detailsHide: 'Hide details',
    smartHint: 'With smart cleaning you pay by the hour, so the price is based on time.',
    overLimit: 'The area is over {max} — we will quote you individually.',
  },

  form: {
    name: 'Your name',
    contact: 'Phone or Telegram username',
    contactHint: 'One way of reaching you is enough',
    address: 'District',
    addressPlaceholder: 'For example, Vračar',
    date: 'Preferred date',
    time: 'Preferred time',
    timeMorning: '09:00 – 12:00',
    timeAfternoon: '12:00 – 16:00',
    timeEvening: '16:00 – 19:00',
    comment: 'Comment',
    commentPlaceholder: 'Anything important: pets, parking, hard-to-reach areas',
    submit: 'Send via Telegram',
    orDirect: 'or message us directly',
    consent: 'I agree to the processing of my personal data',
    successTitle: 'Your request is ready to send',
    successText: 'We opened Telegram with the message filled in — just press Send.',
    errorName: 'Please add your name so we know how to address you',
    errorContact: 'A phone number or Telegram username is required',
    errorConsent: 'We cannot accept the request without your consent',
    errorOpen: 'We could not open Telegram — use the direct button below',
  },

  footer: {
    services: 'Services',
    navigation: 'Pages',
    contacts: 'Contacts',
    legal: 'Company details',
    privacy: 'Privacy policy',
    terms: 'Terms of service',
    rights: 'All rights reserved',
    disclaimer: 'Prices on this site are for information only and are not a binding offer.',
    pendingLegal: 'Company details will be added before launch',
  },

  /** Before/after comparison block (BeforeAfter.astro). */
  beforeAfter: {
    title: 'Before and after',
    lead: 'The same spot photographed before and after cleaning.',
    before: 'Before',
    after: 'After',
  },

  /** Cookie banner (CookieNotice.astro) — only shown with analytics enabled. */
  cookie: {
    label: 'Cookies',
    text: 'We use technical cookies to run the site. Analytics cookies are only set with your consent.',
    accept: 'Accept',
  },

  /** The 404 page. Buttons reuse cta.back and cta.telegram. */
  notFound: {
    title: 'Page not found',
    lead: 'The link may be outdated or there is a typo in the address.',
  },

  /** Scheme switch in the site header. */
  scheme: {
    toLight: 'Light theme',
    toDark: 'Dark theme',
  },
} satisfies UIStrings;
