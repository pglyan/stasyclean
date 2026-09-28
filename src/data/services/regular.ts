import type { Service } from '../types';

export const regular: Service = {
  key: 'regular',
  icon: 'calendar',
  name: {
    sr: 'Redovno održavanje',
    en: 'Regular cleaning',
    ru: 'Поддерживающая уборка',
  },
  lead: {
    sr: 'Održavanje čistoće po utvrđenom ritmu — nedeljno ili dvonedeljno.',
    en: 'Keeping your home clean on a fixed rhythm — weekly or fortnightly.',
    ru: 'Поддержание чистоты по установленному графику — раз в неделю или две.',
  },
  description: {
    sr: [
      'Redovno održavanje služi da sačuva nivo čistoće koji je već postignut. Sprečava ponovno nagomilavanje prašine i prljavštine, pa prostor uvek izgleda sveže.',
      'Preporučujemo uključivanje jednom nedeljno, a ne ređe od dva puta mesečno. Kod pauze duže od 20 dana obim posla se povećava, pa se cena obračunava sa dodatkom.',
    ],
    en: [
      'Regular cleaning maintains the level of cleanliness you have already reached. It stops dust and grime from building up again, so the space always feels fresh.',
      'We recommend weekly cleaning, and no less often than twice a month. If more than 20 days pass between visits, the workload grows and the price is calculated with a surcharge.',
    ],
    ru: [
      'Поддерживающая уборка предназначена для регулярного поддержания чистоты в помещении. Она позволяет сохранить достигнутый уровень чистоты и предотвращает накопление грязи и пыли.',
      'Рекомендуется проводить поддерживающую уборку каждую неделю и не реже двух раз в месяц. Если перерыв между уборками более 20 дней, стоимость может рассчитываться с наценкой.',
    ],
  },
  duration: {
    sr: '2–4 sata, zavisno od kvadrature',
    en: '2–4 hours, depending on area',
    ru: '2–4 часа, в зависимости от площади',
  },
  priceUnit: 'area',
  minOrder: null,
  highlights: {
    sr: [
      'Usisivač, hemija i inventar su u ceni',
      'Fiksna cena po kvadraturi, bez obračuna po satu',
      'Možete zadržati istog člana tima koji poznaje vaše navike',
      'Pogodno za porodice sa decom i kućnim ljubimcima',
    ],
    en: [
      'The vacuum cleaner, products and supplies are included',
      'Fixed price by area, no hourly billing',
      'You can keep the same team member who knows your habits',
      'Suitable for families with children and pets',
    ],
    ru: [
      'Пылесос, химия и инвентарь входят в цену',
      'Фиксированная цена по площади, без расчёта по часам',
      'Можно закрепить одного клинера, который знает ваши привычки',
      'Подходит для семей с детьми и животными',
    ],
  },
  notes: {
    sr: [
      'Usisivač, profesionalna hemija i sve potrebno za čišćenje ulaze u navedenu cenu.',
      'Cena ne zavisi od trajanja čišćenja.',
      'Usluge iz liste „Dodatne usluge“ i pranje prozora dogovaraju se posebno.',
      'Kod jakog zaprljanja, velike količine dlake kućnih ljubimaca ili velike zatrpanosti stvarima, cena može biti uvećana od 20% do 50%.',
      'Ako nemate usisivač, možemo ga doneti — 1.000 RSD.',
    ],
    en: [
      'The vacuum cleaner, professional products and everything needed are included in the price.',
      'The price does not depend on how long the cleaning takes.',
      'Items from the “Additional services” list and window washing are arranged separately.',
      'For heavy soiling, large amounts of pet hair or very cluttered rooms, the price may increase by 20% to 50%.',
      'If you do not own a vacuum cleaner we can bring one — 1,000 RSD.',
    ],
    ru: [
      'Пылесос, профессиональная химия и всё необходимое для уборки входят в указанную стоимость.',
      'Цена не зависит от длительности уборки.',
      'Услуги из списка «Дополнительные услуги» и мойка окон обсуждаются отдельно.',
      'При сильном загрязнении, большом количестве шерсти животных или значительной загруженности вещами стоимость может быть увеличена от 20% до 50%.',
      'Если своего пылесоса нет, можем привезти свой — 1 000 RSD.',
    ],
  },
};
