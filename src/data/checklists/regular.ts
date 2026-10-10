import type { Checklist } from './types';

/**
 * Чек-лист поддерживающей уборки.
 *
 * Источник — бриф клиента (docs/client-brief.md). В отличие от остальных
 * услуг здесь состав работ различается по тарифам, поэтому пункты заданы
 * парами Стандарт/Премиум (itemsByPlan): клиент видит, что именно
 * добавляет Премиум. Опечатки брифа нормализованы.
 */
export const regularChecklist: Checklist = {
  serviceKey: 'regular',
  groups: [
    {
      id: 'rooms',
      title: { sr: 'U svim sobama', en: 'In every room', ru: 'Во всех комнатах' },
      itemsByPlan: {
        sr: {
          standard: [
            'Suvo usisavanje podova i tepiha',
            'Brisanje slobodnih horizontalnih površina do 1.8 m',
            'Brisanje kvaka na vratima',
            'Brisanje utičnica i prekidača',
            '—',
            'Čišćenje svetiljki do 1.8 m',
            'Poliranje stakala i ogledala',
            'Menjanje posteljine — na zahtev',
            'Mokro brisanje podova i letvica',
            'Zamena kesa i iznošenje smeća',
          ],
          premium: [
            'Suvo usisavanje podova i tepiha',
            'Mokro brisanje svih otvorenih horizontalnih površina do 1.8 m',
            'Brisanje vratnih krila, dovratnika i kvaka',
            'Brisanje utičnica i prekidača',
            'Brisanje radijatora i grejnih tela',
            'Čišćenje svetiljki do 1.8 m',
            'Poliranje stakala i ogledala',
            'Menjanje posteljine',
            'Mokro brisanje podova i letvica',
            'Zamena kesa i iznošenje smeća',
          ],
        },
        en: {
          standard: [
            'Dry vacuuming of floors and rugs',
            'Wiping free horizontal surfaces up to 1.8 m',
            'Wiping door handles',
            'Wiping sockets and switches',
            '—',
            'Cleaning light fixtures up to 1.8 m',
            'Polishing glass and mirrors',
            'Bed linen change — on request',
            'Washing floors and skirting boards',
            'Replacing bin liners and taking out the rubbish',
          ],
          premium: [
            'Dry vacuuming of floors and rugs',
            'Wiping all open horizontal surfaces up to 1.8 m',
            'Wiping door leaves, frames and handles',
            'Wiping sockets and switches',
            'Wiping radiators and heating appliances',
            'Cleaning light fixtures up to 1.8 m',
            'Polishing glass and mirrors',
            'Bed linen change',
            'Washing floors and skirting boards',
            'Replacing bin liners and taking out the rubbish',
          ],
        },
        ru: {
          standard: [
            'Сухая очистка пылесосом пола и ковровых покрытий',
            'Влажная уборка свободных горизонтальных поверхностей до 1.8 м',
            'Протирка дверных ручек',
            'Протирка розеток и выключателей',
            '—',
            'Очистка осветительных приборов до 1.8 м',
            'Полировка стёкол и зеркал',
            'Замена постельного белья — по запросу',
            'Влажная уборка пола и плинтусов',
            'Замена мусорных пакетов и вынос мусора',
          ],
          premium: [
            'Сухая очистка пылесосом пола и ковровых покрытий',
            'Влажная уборка всех открытых горизонтальных поверхностей до 1.8 м',
            'Протирка дверных полотен, наличников и дверных ручек',
            'Протирка розеток и выключателей',
            'Протирка радиаторов и отопительных приборов',
            'Очистка осветительных приборов до 1.8 м',
            'Полировка стёкол и зеркал',
            'Замена постельного белья',
            'Влажная уборка пола и плинтусов',
            'Замена мусорных пакетов и вынос мусора',
          ],
        },
      },
    },
    {
      id: 'kitchen',
      title: { sr: 'Kuhinja', en: 'Kitchen', ru: 'Кухня' },
      itemsByPlan: {
        sr: {
          standard: [
            'Brisanje kuhinjskih fronti do 1.8 m — lokalno',
            'Brisanje kuhinjskih fronti i radne ploče',
            'Pranje sudova (jedan sudoper)',
            'Brisanje trpezarijskog stola',
            'Čišćenje ploče za kuvanje',
            'Brisanje frižidera, mikrotalasne i rerne spolja',
            '—',
            'Pranje i dezinfekcija sudopere i slavine',
          ],
          premium: [
            'Brisanje kuhinjskih fronti do 1.8 m — u celosti',
            'Brisanje kuhinjskih fronti i radne ploče',
            'Pranje sudova (jedan sudoper)',
            'Brisanje trpezarijskog stola',
            'Čišćenje ploče za kuvanje',
            'Brisanje frižidera, mikrotalasne i rerne spolja',
            'Brisanje svih kućnih aparata spolja',
            'Pranje i dezinfekcija sudopere i slavine',
          ],
        },
        en: {
          standard: [
            'Wiping kitchen fronts up to 1.8 m — locally',
            'Wiping kitchen fronts and the worktop',
            'Washing up (one sink)',
            'Wiping the dining table',
            'Cleaning the hob',
            'Wiping the fridge, microwave and oven on the outside',
            '—',
            'Washing and disinfecting the sink and tap',
          ],
          premium: [
            'Wiping kitchen fronts up to 1.8 m — fully',
            'Wiping kitchen fronts and the worktop',
            'Washing up (one sink)',
            'Wiping the dining table',
            'Cleaning the hob',
            'Wiping the fridge, microwave and oven on the outside',
            'Wiping all household appliances on the outside',
            'Washing and disinfecting the sink and tap',
          ],
        },
        ru: {
          standard: [
            'Протирка фасада кухни до 1.8 м — локально',
            'Протирка кухонного фасада и столешницы',
            'Мытьё посуды (одна раковина)',
            'Протирка обеденного стола',
            'Очистка варочной панели',
            'Протирка холодильника, СВЧ-печи и духовки снаружи',
            '—',
            'Мытьё и дезинфекция раковины и смесителя',
          ],
          premium: [
            'Протирка фасада кухни до 1.8 м — полностью',
            'Протирка кухонного фасада и столешницы',
            'Мытьё посуды (одна раковина)',
            'Протирка обеденного стола',
            'Очистка варочной панели',
            'Протирка холодильника, СВЧ-печи и духовки снаружи',
            'Протирка всей бытовой техники снаружи',
            'Мытьё и дезинфекция раковины и смесителя',
          ],
        },
      },
    },
    {
      id: 'bathroom',
      title: { sr: 'Kupatilo', en: 'Bathroom', ru: 'Ванная комната' },
      itemsByPlan: {
        sr: {
          standard: [
            'Pranje, dezinfekcija i suvo brisanje tuš kabine i kade — brzo',
            'Pranje i dezinfekcija WC šolje i bidea',
            '—',
            'Pranje i dezinfekcija umivaonika i slavine',
          ],
          premium: [
            'Pranje, dezinfekcija i suvo brisanje tuš kabine i kade — detaljno',
            'Pranje i dezinfekcija WC šolje i bidea',
            'Brisanje čaša i posuda na umivaoniku',
            'Pranje i dezinfekcija umivaonika i slavine',
          ],
        },
        en: {
          standard: [
            'Washing, disinfecting and drying the shower cabin and bathtub — quick',
            'Washing and disinfecting the toilet and bidet',
            '—',
            'Washing and disinfecting the basin and tap',
          ],
          premium: [
            'Washing, disinfecting and drying the shower cabin and bathtub — detailed',
            'Washing and disinfecting the toilet and bidet',
            'Wiping glasses and containers on the basin',
            'Washing and disinfecting the basin and tap',
          ],
        },
        ru: {
          standard: [
            'Мытьё, дезинфекция и сухая протирка душевой кабины и ванны — быстро',
            'Мытьё и дезинфекция унитаза и биде',
            '—',
            'Мытьё и дезинфекция раковины и смесителя',
          ],
          premium: [
            'Мытьё, дезинфекция и сухая протирка душевой кабины и ванны — детально',
            'Мытьё и дезинфекция унитаза и биде',
            'Протирка стаканов и ёмкостей на раковине',
            'Мытьё и дезинфекция раковины и смесителя',
          ],
        },
      },
    },
  ],
  note: {
    sr: 'Usisivač, profesionalna hemija i sve potrebno za čišćenje ulaze u navedenu cenu.',
    en: 'The vacuum cleaner, professional products and everything needed are included in the price.',
    ru: 'Пылесос, профессиональная химия и всё необходимое для уборки входят в указанную стоимость.',
  },
};
