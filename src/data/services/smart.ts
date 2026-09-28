import type { Service } from '../types';

export const smart: Service = {
  key: 'smart',
  icon: 'list',
  name: {
    sr: 'Smart čišćenje',
    en: 'Smart cleaning',
    ru: 'Смарт Клининг',
  },
  lead: {
    sr: 'Vi birate zadatke, naplaćujemo samo sate. Bez doplata po stavci.',
    en: 'You pick the tasks, we charge by the hour only. No per-item surcharges.',
    ru: 'Вы выбираете задачи, мы берём только за часы. Без доплат по позициям.',
  },
  description: {
    sr: [
      'Kod Smart čišćenja sami postavljate listu zadataka koje treba obaviti. Sve ulazi u jednu cenu po satu rada, bez doplata po pojedinačnim stavkama.',
      'Pranje podova, prozora, čišćenje mikrotalasne peći, balkona ili bilo šta drugo — sve je uključeno. Idealno kada vam ne treba cela generalna, već nekoliko konkretnih stvari.',
    ],
    en: [
      'With smart cleaning you write the task list yourself. Everything is covered by one hourly rate, with no per-item surcharges.',
      'Mopping floors, washing windows, cleaning the microwave or the balcony — all included. Ideal when you do not need a full deep clean, just a few specific things.',
    ],
    ru: [
      'Заказывая Смарт Клининг, вы сами ставите клинеру задачи, которые нужно выполнить. Всё входит в единую стоимость за час работы, без дополнительных затрат по позициям.',
      'Мытьё полов, окон, чистка микроволновки, балкона или что-то другое — всё включено. Удобно, когда не нужна полная генеральная уборка, а нужно несколько конкретных вещей.',
    ],
  },
  duration: {
    sr: 'Od 3 sata (minimalna narudžbina)',
    en: 'From 3 hours (minimum order)',
    ru: 'От 3 часов (минимальный заказ)',
  },
  priceUnit: 'hour',
  minOrder: 6000,
  highlights: {
    sr: [
      'Jedna cena po satu, bez doplata po zadatku',
      'Pranje prozora može da uđe u obračun sati',
      'Usisivač i hemija su u ceni',
      'Plaćate tačno onoliko sati koliko vam treba',
    ],
    en: [
      'One hourly rate, no per-task surcharges',
      'Window washing can be included in the hours',
      'The vacuum cleaner and products are included',
      'You pay exactly for the hours you need',
    ],
    ru: [
      'Единая цена за час, без доплат за отдельные задачи',
      'Мытьё окон можно включить в часы',
      'Пылесос и химия входят в цену',
      'Вы платите ровно за столько часов, сколько нужно',
    ],
  },
  notes: {
    sr: [
      'U cenu ulaze profesionalna hemija i sve potrebno za čišćenje, uključujući usisivač.',
      'Minimalna narudžbina je 3 sata.',
      'Zadatke određujete sami, uključujući pranje prozora i stavke iz liste „Dodatne usluge“.',
    ],
    en: [
      'The price includes professional products and everything needed for cleaning, including the vacuum cleaner.',
      'The minimum order is 3 hours.',
      'You define the tasks yourself, including window washing and items from the “Additional services” list.',
    ],
    ru: [
      'В цену входит профессиональная химия и всё необходимое для уборки, включая пылесос.',
      'Минимальный заказ — 3 часа.',
      'Вы сами ставите задачи, включая мытьё окон и задачи из списка «Дополнительные услуги».',
    ],
  },
};
