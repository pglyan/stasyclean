import type { Checklist } from './types';

/**
 * Чек-лист уборки после ремонта.
 *
 * ВНИМАНИЕ: клиент НЕ публиковал состав работ для этой услуги — в прайсе
 * есть только цена по площади. Чек-лист составлен по рыночной практике
 * (сравнение с rakun-cleaning.com и shinecleaning.rs) и помечен
 * provisional: он показывается с пометкой «предварительно»,
 * а перед запуском должен быть согласован с клиентом.
 */
export const renoChecklist: Checklist = {
  serviceKey: 'reno',
  groups: [
    {
      id: 'dust',
      title: { sr: 'Prašina i ostaci', en: 'Dust and debris', ru: 'Пыль и остатки' },
      items: {
        sr: [
          'Suvo uklanjanje fine građevinske prašine sa svih površina',
          'Uklanjanje ostataka fugne, lepka i gipsa',
          'Skidanje fleka od boje i kreča sa podova i stolarije',
          'Čišćenje radijatora, utičnica i prekidača od prašine',
        ],
        en: [
          'Dry removal of fine construction dust from all surfaces',
          'Removal of grout, adhesive and plaster residue',
          'Removing paint and whitewash marks from floors and joinery',
          'Cleaning dust from radiators, sockets and switches',
        ],
        ru: [
          'Сухое удаление мелкой строительной пыли со всех поверхностей',
          'Удаление остатков затирки, клея и штукатурки',
          'Снятие следов краски и побелки с полов и столярки',
          'Очистка от пыли радиаторов, розеток и выключателей',
        ],
      },
    },
    {
      id: 'surfaces',
      title: {
        sr: 'Površine i sanitarije',
        en: 'Surfaces and sanitary ware',
        ru: 'Поверхности и сантехника',
      },
      items: {
        sr: [
          'Mokro čišćenje podova i letvica, u dva prolaza',
          'Čišćenje stakala, ramova i prozorskih dasaka',
          'Čišćenje sanitarija od građevinskih ostataka',
          'Uklanjanje zaštitnih folija i nalepnica',
        ],
        en: [
          'Wet cleaning of floors and skirting boards, in two passes',
          'Cleaning glass, frames and window sills',
          'Cleaning sanitary ware from construction residue',
          'Removing protective film and stickers',
        ],
        ru: [
          'Влажная уборка полов и плинтусов в два прохода',
          'Уборка стёкол, рам и подоконников',
          'Очистка сантехники от строительных остатков',
          'Удаление защитных плёнок и наклеек',
        ],
      },
    },
  ],
  note: {
    sr: 'Sastav radova je privremen i biće potvrđen sa klijentom pre puštanja sajta u rad.',
    en: 'The scope of work is provisional and will be confirmed with the client before launch.',
    ru: 'Состав работ предварительный и будет подтверждён с клиентом до запуска сайта.',
  },
};
