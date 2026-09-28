import type { Service } from '../types';

export const reno: Service = {
  key: 'reno',
  icon: 'crane',
  name: {
    sr: 'Čišćenje posle renoviranja',
    en: 'Post-renovation cleaning',
    ru: 'Уборка после ремонта',
  },
  lead: {
    sr: 'Uklanjamo građevinsku prašinu, ostatke fugne, lepka i boje.',
    en: 'We remove construction dust, grout residue, adhesive and paint.',
    ru: 'Удаляем строительную пыль, остатки затирки, клея и краски.',
  },
  description: {
    sr: [
      'Posle renoviranja stan traži drugačiji pristup: građevinska prašina prodire u svaki otvor, a ostaci fugne, lepka i boje se ne skidaju običnim sredstvima.',
      'Radimo u fazama — prvo suvo uklanjanje prašine i ostataka, zatim mokro čišćenje površina, sanitarija i stolarije.',
    ],
    en: [
      'After a renovation an apartment needs a different approach: construction dust gets into every gap, and grout, adhesive and paint residue do not come off with ordinary products.',
      'We work in stages — first the dry removal of dust and debris, then wet cleaning of surfaces, sanitary ware and joinery.',
    ],
    ru: [
      'После ремонта квартира требует особого подхода: строительная пыль проникает в каждую щель, а остатки затирки, клея и краски не снимаются обычными средствами.',
      'Работаем поэтапно — сначала сухое удаление пыли и остатков, затем влажная уборка поверхностей, сантехники и столярки.',
    ],
  },
  duration: {
    sr: '6–10 sati, često u dva prolaza',
    en: '6–10 hours, often in two passes',
    ru: '6–10 часов, часто в два прохода',
  },
  priceUnit: 'area',
  minOrder: null,
  highlights: {
    sr: [
      'Uklanjanje fine građevinske prašine sa svih površina',
      'Ostaci fugne, lepka, boje i kreča',
      'Usisivač, merdevine i profesionalna hemija su u ceni',
      'Fiksna cena po kvadraturi',
    ],
    en: [
      'Removal of fine construction dust from all surfaces',
      'Grout, adhesive, paint and whitewash residue',
      'The vacuum cleaner, stepladder and professional products are included',
      'Fixed price by area',
    ],
    ru: [
      'Удаление мелкой строительной пыли со всех поверхностей',
      'Остатки затирки, клея, краски и побелки',
      'Пылесос, стремянка и профессиональная химия входят в цену',
      'Фиксированная цена по площади',
    ],
  },
  notes: {
    sr: [
      'U cenu ulaze profesionalna hemija, usisivač i merdevine.',
      'Cena ne zavisi od trajanja čišćenja.',
      'Usluge iz liste „Dodatne usluge“ dogovaraju se posebno.',
    ],
    en: [
      'The price includes professional products, the vacuum cleaner and a stepladder.',
      'The price does not depend on how long the cleaning takes.',
      'Items from the “Additional services” list are arranged separately.',
    ],
    ru: [
      'В цену входят профессиональная химия, пылесос и стремянка.',
      'Цена не зависит от длительности уборки.',
      'Услуги из списка «Дополнительные услуги» обсуждаются отдельно.',
    ],
  },
};
