import type { Localized } from './types';
import type { IconName } from '../components/ui/icons';

export interface Step {
  id: string;
  title: Localized;
  text: Localized;
}

/**
 * «Как мы работаем» — 4 шага.
 * Логика взята из практики рынка (rakun-cleaning.com, ratecleaning.com):
 * фиксация цены до выезда и оплата после приёмки работы.
 */
export const steps: Step[] = [
  {
    id: 'request',
    title: { sr: 'Zahtev', en: 'Request', ru: 'Заявка' },
    text: {
      sr: 'Pišete nam na Telegram: kvadratura, vrsta čišćenja, željeni datum i deo grada.',
      en: 'You message us on Telegram: the area, the type of cleaning, the date you want and your part of town.',
      ru: 'Пишете нам в Telegram: метраж, вид уборки, удобная дата и район.',
    },
  },
  {
    id: 'quote',
    title: { sr: 'Obračun', en: 'Quote', ru: 'Расчёт' },
    text: {
      sr: 'Razjašnjavamo detalje i dajemo fiksnu cenu pre izlaska. Bez naknadnih iznenađenja.',
      en: 'We clarify the details and give a fixed price before the visit. No surprises afterwards.',
      ru: 'Уточняем детали и называем фиксированную цену до выезда. Без сюрпризов потом.',
    },
  },
  {
    id: 'clean',
    title: { sr: 'Čišćenje', en: 'Cleaning', ru: 'Уборка' },
    text: {
      sr: 'Član tima dolazi u dogovoreno vreme sa svojim usisivačem, hemijom i inventarom.',
      en: 'The team member arrives at the agreed time with their own vacuum cleaner, products and supplies.',
      ru: 'Клинер приезжает в назначенное время со своим пылесосом, химией и инвентарём.',
    },
  },
  {
    id: 'payment',
    title: { sr: 'Plaćanje', en: 'Payment', ru: 'Оплата' },
    text: {
      sr: 'Plaćate posle posla, kada pregledate urađeno. Gotovina ili transfer.',
      en: 'You pay after the work, once you have checked it. Cash or bank transfer.',
      ru: 'Платите после уборки, когда примете работу. Наличными или переводом.',
    },
  },
];

/** Отличительные свойства компании — из публичного описания клиента. */
export interface Usp {
  id: string;
  icon: IconName;
  title: Localized;
  text: Localized;
}

export const usps: Usp[] = [
  {
    id: 'equipment',
    icon: 'box',
    title: {
      sr: 'Sva oprema je u ceni',
      en: 'All equipment included',
      ru: 'Всё оборудование включено',
    },
    text: {
      sr: 'Usisivač, merdevine, profesionalna hemija i sav inventar donosimo sa sobom. Vama ne treba ništa da pripremate.',
      en: 'We bring the vacuum cleaner, stepladder, professional products and all supplies. You do not need to prepare anything.',
      ru: 'Пылесос, стремянка, профессиональная химия и весь инвентарь — привозим с собой. Вам не нужно ничего готовить.',
    },
  },
  {
    id: 'chemistry',
    icon: 'drop',
    title: {
      sr: 'Profesionalna hemija',
      en: 'Professional products',
      ru: 'Профессиональная химия',
    },
    text: {
      sr: 'Koristimo sredstva koja su bezbedna za zdravlje i za površine u stanu.',
      en: 'We use products that are safe for your health and for the surfaces in your home.',
      ru: 'Используем средства, безопасные для здоровья и для поверхностей в квартире.',
    },
  },
  {
    id: 'fixed-price',
    icon: 'tag',
    title: {
      sr: 'Fiksna cena po kvadraturi',
      en: 'Fixed price by area',
      ru: 'Фиксированная цена по площади',
    },
    text: {
      sr: 'Cena ne zavisi od toga koliko sati rad traje. Znate iznos pre nego što počnemo.',
      en: 'The price does not depend on how many hours the work takes. You know the amount before we start.',
      ru: 'Цена не зависит от того, сколько часов идёт работа. Вы знаете сумму до начала.',
    },
  },
  {
    id: 'experience',
    icon: 'medal',
    title: { sr: 'Veliko iskustvo', en: 'Years of experience', ru: 'Большой опыт' },
    text: {
      sr: 'Radimo u Beogradu i znamo kako izgledaju stanovi i koje površine traže poseban pristup.',
      en: 'We work in Belgrade and know how local apartments are built and which surfaces need special care.',
      ru: 'Работаем в Белграде и знаем, как устроены квартиры и какие поверхности требуют особого подхода.',
    },
  },
  {
    id: 'personal',
    icon: 'heart',
    title: { sr: 'Individualan pristup', en: 'Personal approach', ru: 'Персональный подход' },
    text: {
      sr: 'Slušamo šta vam je važno i prilagođavamo redosled rada vašim navikama.',
      en: 'We listen to what matters to you and adjust the order of work to your habits.',
      ru: 'Слушаем, что для вас важно, и подстраиваем порядок работ под ваши привычки.',
    },
  },
];
