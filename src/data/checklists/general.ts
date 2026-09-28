import type { Checklist } from './types';

/**
 * Чек-лист генеральной уборки.
 * Дословный состав работ с публичной страницы /генеральная-уборка stasyclean.com.
 */
export const generalChecklist: Checklist = {
  serviceKey: 'general',
  groups: [
    {
      id: 'rooms',
      title: { sr: 'U svim sobama', en: 'In every room', ru: 'Во всех комнатах' },
      items: {
        sr: [
          'Suvo usisavanje podova i tepiha',
          'Suvo usisavanje tapaciranog nameštaja',
          'Uklanjanje prašine sa svih vertikalnih i horizontalnih površina',
          'Uklanjanje prašine sa klime',
          'Brisanje svih kućnih aparata',
          'Brisanje ramova i prozorskih dasaka',
          'Brisanje radijatora, utičnica, prekidača i svetiljki',
          'Brisanje svih stakala i ogledala',
          'Brisanje unutrašnjih vrata i dovratnika',
          'Mokro brisanje podova i letvica',
          'Menjanje posteljine na zahtev',
          'Iznošenje smeća',
        ],
        en: [
          'Dry vacuuming of floors and rugs',
          'Dry vacuuming of upholstered furniture',
          'Dust removal from all vertical and horizontal surfaces',
          'Dust removal from the air conditioner',
          'Wiping all household appliances',
          'Wiping window frames and sills',
          'Wiping radiators, sockets, switches and light fixtures',
          'Wiping all glass and mirrors',
          'Wiping interior doors and door frames',
          'Wet cleaning of floors and skirting boards',
          'Bed linen change on request',
          'Taking out the rubbish',
        ],
        ru: [
          'Сухая уборка пылесосом полов и ковровых покрытий',
          'Сухая очистка пылесосом мягкой мебели',
          'Удаление пыли со всех вертикальных и горизонтальных поверхностей',
          'Удаление пыли с кондиционера',
          'Протираем всю бытовую технику',
          'Протираем рамы, подоконники',
          'Протираем радиаторы, розетки, выключатели, светильники',
          'Протираем все стёкла, зеркала',
          'Протираем межкомнатные двери и проёмы',
          'Влажная уборка пола и плинтуса',
          'Замена постельного белья по запросу',
          'Вынос мусора',
        ],
      },
    },
    {
      id: 'kitchen',
      title: { sr: 'Kuhinja', en: 'Kitchen', ru: 'Кухня' },
      items: {
        sr: [
          'Pranje sudova — jedan sudoper',
          'Brisanje kuhinjskih fronti',
          'Brisanje vratašca ormarića spolja i iznutra',
          'Brisanje pločica i radne ploče',
          'Čišćenje šporeta, rerne, frižidera i mikrotalasne peći spolja',
          'Pranje i dezinfekcija sudopere i slavine',
        ],
        en: [
          'Washing up — one sink load',
          'Wiping the kitchen cabinet fronts',
          'Wiping cabinet doors inside and out',
          'Wiping the splashback and worktop',
          'Cleaning the hob, oven, fridge and microwave on the outside',
          'Washing and disinfecting the sink and tap',
        ],
        ru: [
          'Мойка посуды — одна раковина',
          'Протираем кухонный фасад',
          'Дверки шкафов протираем снаружи и внутри',
          'Протираем фартук, столешницу',
          'Очистка снаружи плиты, духового шкафа, холодильника, микроволновой печи',
          'Мойка и дезинфекция раковины и смесителя',
        ],
      },
      note: {
        sr: 'Police i fioke iznutra su dodatna opcija.',
        en: 'Shelves and drawers inside are an additional option.',
        ru: 'Полки и ящики внутри — дополнительная опция.',
      },
    },
    {
      id: 'bathroom',
      title: { sr: 'Kupatilo', en: 'Bathroom', ru: 'Санузел' },
      items: {
        sr: [
          'Pranje i dezinfekcija kade i tuš kabine, uklanjanje kamenca',
          'Čišćenje i dezinfekcija WC šolje i bidea',
          'Čišćenje i dezinfekcija sanitarne opreme i umivaonika',
          'Čišćenje fugni na podu',
        ],
        en: [
          'Washing and disinfecting the bathtub and shower cabin, removing limescale',
          'Cleaning and disinfecting the toilet and bidet',
          'Cleaning and disinfecting the sanitary ware and basin',
          'Cleaning the floor grout lines',
        ],
        ru: [
          'Моем и дезинфицируем ванну, душевую кабину, удаляем известковый налёт',
          'Очищаем и дезинфицируем унитаз, биде',
          'Очищаем и дезинфицируем сантехнику и раковины',
          'Очищаем межплиточные швы на полу',
        ],
      },
    },
    {
      id: 'extra',
      title: {
        sr: 'Dodatno — po dogovoru',
        en: 'Extra — arranged separately',
        ru: 'Дополнительно — по договорённости',
      },
      items: {
        sr: [
          'Pranje zidnih pločica u kupatilu po celoj visini',
          'Uklanjanje prašine sa plafona i zidova po celoj visini',
          'Pranje lustera',
          'Čišćenje unutrašnjosti ormara, komoda i fioka',
        ],
        en: [
          'Washing bathroom wall tiles at full height',
          'Dust removal from ceilings and walls at full height',
          'Chandelier washing',
          'Cleaning inside wardrobes, chests of drawers and drawers',
        ],
        ru: [
          'Мойка настенной плитки в ванной комнате на всю высоту',
          'Обеспыливание потолков и стен на всю высоту',
          'Мойка люстр',
          'Уборка внутри шкафов, комодов и ящиков',
        ],
      },
    },
  ],
  note: {
    sr: 'Usisivač, merdevine, profesionalna hemija i sve potrebno za čišćenje ulaze u navedenu cenu.',
    en: 'The vacuum cleaner, stepladder, professional products and everything needed are included in the price.',
    ru: 'Пылесос, стремянка, профессиональная химия и всё необходимое для уборки входят в указанную стоимость.',
  },
};
