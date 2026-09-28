import type { Localized } from './types';

export interface FaqItem {
  id: string;
  question: Localized;
  answer: Localized;
  /** Ответ основан на публичных условиях клиента (наценки, ограничения). */
  fromClientTerms?: boolean;
}

/**
 * FAQ — отвечает на реальные возражения сегмента: «нужно ли что-то готовить»,
 * «а если квартира очень грязная», «можно ли отменить», «кто отвечает за
 * повреждения». Формулировки по наценкам взяты из публичных условий самого
 * StasyClean, чтобы демо не обещало того, чего компания не делает.
 */
export const faq: FaqItem[] = [
  {
    id: 'equipment',
    question: {
      sr: 'Da li treba da obezbedim sredstva i opremu?',
      en: 'Do I need to provide products and equipment?',
      ru: 'Нужно ли предоставлять средства и инвентарь?',
    },
    answer: {
      sr: 'Ne. Usisivač, merdevine, profesionalna hemija i sav inventar donosimo sa sobom i to je već u ceni. Ako želite da koristimo vaša sredstva, recite nam unapred.',
      en: 'No. We bring the vacuum cleaner, stepladder, professional products and all supplies, and that is already included in the price. If you would like us to use your own products, just tell us in advance.',
      ru: 'Нет. Пылесос, стремянка, профессиональная химия и весь инвентарь — мы привозим с собой, и это уже в цене. Если хотите, чтобы использовали ваши средства, скажите заранее.',
    },
  },
  {
    id: 'pets',
    question: {
      sr: 'Imam kućne ljubimce. Da li je to problem?',
      en: 'I have pets. Is that a problem?',
      ru: 'У меня есть домашние животные. Это проблема?',
    },
    answer: {
      sr: 'Nije. Samo nas obavestite unapred — dodelićemo osobu bez alergije na dlaku. Velika količina dlake povećava obim posla i može uticati na cenu.',
      en: 'Not at all. Just let us know in advance — we will assign someone without a pet-hair allergy. A large amount of hair increases the workload and may affect the price.',
      ru: 'Нет. Просто предупредите заранее — направим специалиста без аллергии на шерсть. Большое количество шерсти увеличивает объём работ и может повлиять на цену.',
    },
  },
  {
    id: 'heavy-soil',
    question: {
      sr: 'Stan nije održavan dugo. Da li primate takav posao?',
      en: 'The apartment has not been maintained for a long time. Will you take it?',
      ru: 'Квартира давно не убиралась. Возьмётесь?',
    },
    answer: {
      sr: 'Da. Kod jakog zaprljanja, velike količine dlake ljubimaca ili velike zatrpanosti stvarima cena može biti uvećana od 20% do 50%. Pošaljite nekoliko fotografija i reći ćemo vam tačan iznos unapred.',
      en: 'Yes. For heavy soiling, a lot of pet hair or very cluttered rooms the price may increase by 20% to 50%. Send us a few photos and we will give you the exact amount in advance.',
      ru: 'Да. При сильном загрязнении, большом количестве шерсти животных или значительной загруженности вещами стоимость может быть увеличена от 20% до 50%. Пришлите несколько фото, и мы назовём точную сумму заранее.',
    },
    fromClientTerms: true,
  },
  {
    id: 'gap',
    question: {
      sr: 'Zašto je redovno čišćenje skuplje ako je pauza duža?',
      en: 'Why does regular cleaning cost more after a long gap?',
      ru: 'Почему поддерживающая уборка дороже после долгого перерыва?',
    },
    answer: {
      sr: 'Redovno čišćenje je predviđeno za ritam jednom nedeljno ili jednom u dve nedelje. Ako je pauza duža od 20 dana, obim posla se povećava, pa se cena obračunava sa dodatkom od 20% do 50%.',
      en: 'Regular cleaning is designed for a weekly or fortnightly rhythm. If more than 20 days pass between visits, the workload increases and the price is calculated with a 20% to 50% surcharge.',
      ru: 'Поддерживающая уборка рассчитана на ритм раз в неделю или раз в две недели. Если перерыв более 20 дней, объём работ возрастает, и стоимость рассчитывается с наценкой от 20% до 50%.',
    },
    fromClientTerms: true,
  },
  {
    id: 'staying',
    question: {
      sr: 'Mogu li da budem kod kuće ili da odem?',
      en: 'Can I stay at home or leave?',
      ru: 'Могу ли я быть дома или уйти?',
    },
    answer: {
      sr: 'Oboje je u redu. Mnogi klijenti ostanu kod kuće, drugi odu po svojim obavezama. Ako odlazite, dogovorićemo kako ćemo vam predati stan i primiti uplatu.',
      en: 'Both are fine. Many clients stay at home, others leave to run errands. If you go out, we will agree how to hand the apartment back to you and take payment.',
      ru: 'И так, и так можно. Многие клиенты остаются дома, другие уходят по делам. Если уходите, договоримся, как передадим квартиру и примем оплату.',
    },
  },
  {
    id: 'same-cleaner',
    question: {
      sr: 'Da li mogu da tražim da uvek dolazi ista osoba?',
      en: 'Can I ask for the same person every time?',
      ru: 'Можно, чтобы всегда приходил один и тот же клинер?',
    },
    answer: {
      sr: 'Da. Kod redovnog održavanja možemo da vežemo istog člana tima za vaš stan — tako poznaje vaše navike i ne treba svaki put iznova objašnjavati detalje.',
      en: 'Yes. With regular cleaning we can assign the same team member to your apartment, so they learn your habits and you do not have to explain details again.',
      ru: 'Да. При поддерживающей уборке можем закрепить за вашей квартирой одного клинера — он знает ваши привычки, и каждый раз не нужно объяснять детали заново.',
    },
  },
  {
    id: 'cancel',
    question: {
      sr: 'Kako se otkazuje ili pomera termin?',
      en: 'How do I cancel or reschedule?',
      ru: 'Как отменить или перенести уборку?',
    },
    answer: {
      sr: 'Javite nam što ranije na Telegram i naći ćemo drugi termin. Ako je termin pomeren na vreme, nema nikakvih troškova.',
      en: 'Let us know on Telegram as early as you can and we will find another slot. There is no charge if the appointment is moved in good time.',
      ru: 'Сообщите нам в Telegram как можно раньше, и мы подберём другое время. Если перенести заранее, никаких дополнительных расходов нет.',
    },
  },
  {
    id: 'payment',
    question: { sr: 'Kako se plaća?', en: 'How do I pay?', ru: 'Как происходит оплата?' },
    answer: {
      sr: 'Posle urađenog posla, kada pregledate stan. Gotovina ili transfer na račun; za firme po ugovoru.',
      en: 'After the work is done, once you have checked the apartment. Cash or bank transfer; for companies by contract.',
      ru: 'После выполненной работы, когда примете квартиру. Наличными или переводом; для компаний по договору.',
    },
  },
  {
    id: 'damage',
    question: {
      sr: 'Šta ako se nešto slučajno polomi?',
      en: 'What if something gets broken accidentally?',
      ru: 'Что если что-то случайно повредят?',
    },
    answer: {
      sr: 'Svesni smo da je to ključno pitanje poverenja. Uslove naknade štete fiksiraćemo u ugovoru i objaviti na sajtu pre puštanja u rad.',
      en: 'We know this is the key question of trust. Compensation terms will be fixed in the contract and published on the site before launch.',
      ru: 'Понимаем, что это ключевой вопрос доверия. Условия возмещения ущерба зафиксируем в договоре и опубликуем на сайте до запуска.',
    },
  },
];
