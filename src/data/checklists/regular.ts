import type { Checklist } from './types';

/**
 * Чек-лист поддерживающей уборки.
 * Дословный состав работ с публичной страницы /поддерживающая-уборка stasyclean.com.
 */
export const regularChecklist: Checklist = {
  serviceKey: 'regular',
  groups: [
    {
      id: 'rooms',
      title: { sr: 'U svim sobama', en: 'In every room', ru: 'Во всех комнатах' },
      items: {
        sr: [
          'Suvo usisavanje',
          'Brisanje površina do visine ispružene ruke',
          'Brisanje radijatora, utičnica i prekidača',
          'Brisanje unutrašnjih vrata',
          'Menjanje posteljine na zahtev',
          'Poliranje stakala i ogledala',
          'Pranje podova i letvica',
          'Zamena kesa za smeće',
          'Iznošenje smeća',
        ],
        en: [
          'Dry vacuuming',
          'Wiping surfaces up to arm’s reach',
          'Wiping radiators, sockets and switches',
          'Wiping interior doors',
          'Bed linen change on request',
          'Polishing glass and mirrors',
          'Washing floors and skirting boards',
          'Replacing bin liners',
          'Taking out the rubbish',
        ],
        ru: [
          'Сухая уборка пылесосом',
          'Протираем поверхности на высоту вытянутой руки',
          'Протираем все радиаторы, розетки, выключатели',
          'Протираем межкомнатные двери',
          'Замена постельного белья по запросу',
          'Натирка стёкол и зеркал',
          'Моем полы и плинтус',
          'Производим замену мусорных пакетов',
          'Выносим мусор',
        ],
      },
    },
    {
      id: 'kitchen',
      title: { sr: 'Kuhinja', en: 'Kitchen', ru: 'Кухня' },
      items: {
        sr: [
          'Brisanje kuhinjskih fronti spolja',
          'Brisanje pločica i radne ploče',
          'Pranje sudova — jedan sudoper',
          'Pranje sudopere i slavine',
          'Brisanje šporeta, rerne, frižidera i mikrotalasne peći',
        ],
        en: [
          'Wiping the kitchen cabinet fronts on the outside',
          'Wiping the splashback and worktop',
          'Washing up — one sink load',
          'Washing the sink and tap',
          'Wiping the hob, oven, fridge and microwave',
        ],
        ru: [
          'Протираем фасад кухни снаружи',
          'Протираем фартук и столешницу',
          'Моем посуду — одну раковину',
          'Мойка раковины и смесителя',
          'Протираем плиту, духовой шкаф, холодильник, микроволновую печь',
        ],
      },
    },
    {
      id: 'bathroom',
      title: { sr: 'Kupatilo', en: 'Bathroom', ru: 'Санузел' },
      items: {
        sr: [
          'Pranje kade i tuš kabine',
          'Čišćenje i dezinfekcija WC šolje i bidea',
          'Čišćenje i dezinfekcija sanitarne opreme i umivaonika',
        ],
        en: [
          'Washing the bathtub and shower cabin',
          'Cleaning and disinfecting the toilet and bidet',
          'Cleaning and disinfecting the sanitary ware and basin',
        ],
        ru: [
          'Моем ванну и душевую кабину',
          'Очищаем и дезинфицируем унитаз, биде',
          'Очищаем и дезинфицируем сантехнику и раковину',
        ],
      },
    },
  ],
  note: {
    sr: 'Usisivač, profesionalna hemija i sve potrebno za čišćenje ulaze u navedenu cenu.',
    en: 'The vacuum cleaner, professional products and everything needed are included in the price.',
    ru: 'Пылесос, профессиональная химия и всё необходимое для уборки входят в указанную стоимость.',
  },
};
