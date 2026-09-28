import type { Service } from '../types';

export const general: Service = {
  key: 'general',
  icon: 'sparkles',
  name: {
    sr: 'Generalno čišćenje',
    en: 'Deep cleaning',
    ru: 'Генеральная уборка',
  },
  lead: {
    sr: 'Dubinsko čišćenje svih prostorija, uključujući teško dostupna mesta.',
    en: 'Deep cleaning of every room, including hard-to-reach places.',
    ru: 'Глубокая уборка всех помещений, включая труднодоступные места.',
  },
  description: {
    sr: [
      'Generalno čišćenje je kompletno i dubinsko čišćenje svih prostorija. Potrebno je kada treba ukloniti nagomilane naslage prašine i prljavštine na mestima koja redovno održavanje ne pokriva.',
      'Preporučujemo ga dva puta godišnje, pre useljenja ili iseljenja iz stana, kao i pre dolaska bebe u kuću.',
    ],
    en: [
      'Deep cleaning is a complete, thorough clean of every room. It is what you need when accumulated dust and grime must be removed from places that regular cleaning does not reach.',
      'We recommend it twice a year, before moving in or out of an apartment, and before a baby arrives.',
    ],
    ru: [
      'Генеральная уборка — это комплексная и глубокая чистка всех помещений. Она необходима, чтобы избавиться от накопившейся грязи и пыли в труднодоступных местах, куда не попадает внимание при поддерживающей уборке.',
      'Проводить такую уборку рекомендуется два раза в год, перед заселением или выселением из квартиры, а также перед рождением ребёнка.',
    ],
  },
  duration: {
    sr: '4–8 sati, zavisno od kvadrature i stanja',
    en: '4–8 hours, depending on area and condition',
    ru: '4–8 часов, в зависимости от площади и состояния',
  },
  priceUnit: 'area',
  minOrder: null,
  highlights: {
    sr: [
      'Usisivač, merdevine i profesionalna hemija su u ceni',
      'Fiksna cena po kvadraturi, ne zavisi od trajanja',
      'Radimo u paru na većim kvadraturama',
      'Plaćanje posle urađenog posla',
    ],
    en: [
      'The vacuum cleaner, stepladder and professional products are included',
      'Fixed price by area, independent of how long it takes',
      'We work in pairs on larger apartments',
      'Payment after the work is done',
    ],
    ru: [
      'Пылесос, стремянка и профессиональная химия входят в цену',
      'Фиксированная цена по площади, не зависит от длительности',
      'На больших площадях работаем вдвоём',
      'Оплата после выполненной работы',
    ],
  },
  notes: {
    sr: [
      'U cenu ulaze profesionalna hemija i sve potrebno za čišćenje, uključujući usisivač i merdevine.',
      'Cena ne zavisi od trajanja čišćenja.',
      'Usluge iz liste „Dodatne usluge“ i pranje prozora dogovaraju se posebno.',
      'Kod jakog zaprljanja stana, velike količine dlake kućnih ljubimaca ili velike zatrpanosti stvarima, cena može biti uvećana od 20% do 50%.',
    ],
    en: [
      'The price includes professional products and everything needed for cleaning, including the vacuum cleaner and stepladder.',
      'The price does not depend on how long the cleaning takes.',
      'Items from the “Additional services” list and window washing are arranged separately.',
      'For heavily soiled apartments, large amounts of pet hair or very cluttered rooms, the price may increase by 20% to 50%.',
    ],
    ru: [
      'В цену входят профессиональная химия и всё необходимое для уборки, включая пылесос и стремянку.',
      'Цена не зависит от длительности уборки.',
      'Услуги из списка «Дополнительные услуги» и мойка окон обсуждаются отдельно.',
      'При сильном загрязнении квартиры, большом количестве шерсти животных или значительной загруженности вещами стоимость может быть увеличена от 20% до 50%.',
    ],
  },
};
