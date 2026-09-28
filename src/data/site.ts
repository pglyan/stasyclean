import type { Localized } from './types';

/**
 * Данные о компании.
 *
 * ВАЖНО: значения `null` означают «требуется от клиента» — на живом сайте
 * это юридически обязательные реквизиты, которых сейчас нет ни на
 * stasyclean.com, ни в открытом доступе. В демо-стенде вместо них
 * выводится пометка-заглушка, чтобы заказчик видел, где это будет.
 */
export const site = {
  brand: 'StasyClean',

  /** Название компании для JSON-LD и футера. Требуется уточнить правовую форму. */
  legalName: null as string | null,

  domain: 'stasyclean.com',
  /** Год основания — требуется подтвердить. В объявлении на poisk.rs от 30.05.2024 работа уже велась. */
  foundedYear: null as number | null,

  /** Телефон отсутствует на текущем сайте. */
  phone: null as string | null,
  /** Email отсутствует на текущем сайте. */
  email: null as string | null,

  telegram: 'stasy_clean',
  telegramUrl: 'https://t.me/stasy_clean',
  instagram: 'stasy_clean',
  instagramUrl: 'https://www.instagram.com/stasy_clean',

  /** Юридические реквизиты Республики Сербия — обязательны, требуются от клиента. */
  legal: {
    pib: null as string | null,
    mb: null as string | null,
    address: null as string | null,
  },

  /** География работы. Подтверждено: Белград. Нови-Сад — заявлен у большинства конкурентов. */
  cities: ['Beograd'] as string[],
  /** Районы Белграда для блока «где мы работаем» — требуется подтвердить список выезда. */
  districts: [
    'Vračar',
    'Stari grad',
    'Savski venac',
    'Novi Beograd',
    'Zemun',
    'Dorćol',
    'Palilula',
    'Voždovac',
    'Zvezdara',
    'Čukarica',
    'Rakovica',
    'Bežanija',
  ] as string[],

  rating: {
    value: 4.9,
    count: null as number | null,
    /** Отзывы есть только в Instagram и Telegram — требуется собрать на сайт. */
    verified: false,
  },
} as const;

/** Тексты шапки/футера и метаданные — по локалям. */
export const siteText = {
  tagline: {
    sr: 'Profesionalno čišćenje stanova i kuća u Beogradu',
    en: 'Professional apartment and house cleaning in Belgrade',
    ru: 'Профессиональная уборка квартир и домов в Белграде',
  } satisfies Localized,

  metaTitle: {
    sr: 'StasyClean — čišćenje stanova i kuća u Beogradu | Generalno i redovno održavanje',
    en: 'StasyClean — apartment and house cleaning in Belgrade | Deep and regular cleaning',
    ru: 'StasyClean — уборка квартир и домов в Белграде | Генеральная и поддерживающая уборка',
  } satisfies Localized,

  metaDescription: {
    sr: 'Profesionalno generalno i redovno čišćenje stanova u Beogradu. Donosimo svu opremu i hemiju, uključujući usisivač. Fiksna cena po kvadraturi, bez iznenađenja.',
    en: 'Professional deep and regular apartment cleaning in Belgrade. We bring all equipment and products, including the vacuum cleaner. Fixed price by area, no surprises.',
    ru: 'Профессиональная генеральная и поддерживающая уборка квартир в Белграде. Привозим всё оборудование и химию, включая пылесос. Фиксированная цена по площади, без сюрпризов.',
  } satisfies Localized,

  /** Короткий оффер для первого экрана. */
  heroTitle: {
    sr: 'Čistoća koju donosimo sa sobom. Bukvalno.',
    en: 'We bring the clean with us. Literally.',
    ru: 'Чистота, которую мы привозим с собой. Буквально.',
  } satisfies Localized,

  heroLead: {
    sr: 'Generalno i redovno održavanje stanova u Beogradu. Usisivač, merdevine, profesionalna hemija i sav inventar — već su u ceni. Vama ne treba ništa da pripremate.',
    en: 'Deep and regular apartment cleaning in Belgrade. The vacuum cleaner, stepladder, professional products and all supplies are already included. You do not need to prepare anything.',
    ru: 'Генеральная и поддерживающая уборка квартир в Белграде. Пылесос, стремянка, профессиональная химия и весь инвентарь — уже в цене. Вам не нужно ничего готовить.',
  } satisfies Localized,

  /** Обещание по времени ответа — в демо это заглушка, требуется согласовать с клиентом. */
  responsePromise: {
    sr: 'Odgovaramo na Telegram u toku dana',
    en: 'We reply on Telegram during the day',
    ru: 'Отвечаем в Telegram в течение дня',
  } satisfies Localized,

  footerNote: {
    sr: 'Fiksna cena po kvadraturi. Cena ne zavisi od trajanja rada.',
    en: 'Fixed price by area. The price does not depend on how long the work takes.',
    ru: 'Фиксированная цена по площади. Цена не зависит от длительности уборки.',
  } satisfies Localized,
} as const;

/** Пометка о предварительном характере демо-контента. */
export const demoNotice = {
  sr: 'Demo prikaz: tekstovi, fotografije i cene su privremeni i služe za izbor stila.',
  en: 'Demo preview: copy, photos and prices are provisional and used for style selection.',
  ru: 'Демонстрационная версия: тексты, фото и цены предварительные и служат для выбора стиля.',
} satisfies Localized;
