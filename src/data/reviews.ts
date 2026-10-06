import type { Localized } from './types';
import type { ServiceKey } from '../i18n/routes';

export interface Review {
  id: string;
  /** Имя клиента — не переводится. */
  name: string;
  serviceKey: ServiceKey;
  /** ISO-дата, чтобы «август 2026» выглядело свежо и проверяемо. */
  date: string;
  rating: number;
  text: Localized;
  initials: string;
}

/**
 * ВНИМАНИЕ: это тексты-заготовки, а не настоящие отзывы клиентов.
 *
 * У клиента нет опубликованных отзывов на сайте — они живут в Instagram и
 * Telegram. Выдумывать реальные отзывы нельзя, поэтому здесь показан
 * каркас блока: тексты подобраны так, чтобы проверять вёрстку разной длины.
 * В интерфейсе блок выводится с явной пометкой «пример оформления», а
 * перед запуском тексты заменяются на настоящие (с разрешения авторов).
 */
export const reviewsAreSample = true;

export const reviews: Review[] = [
  {
    id: 'r1',
    name: 'Марина',
    initials: 'М',
    serviceKey: 'general',
    date: '2026-08-18',
    rating: 5,
    text: {
      sr: 'Uselili smo se u stan posle renoviranja i nismo znali odakle da počnemo. Tim je došao sa svim svojim, uključujući merdevine. Za jedan dan stan je bio spreman za život.',
      en: 'We moved into an apartment after renovation and did not know where to start. The team arrived with everything of their own, including a stepladder. In one day the place was ready to live in.',
      ru: 'Заехали в квартиру после ремонта и не знали, с чего начать. Команда приехала со всем своим, включая стремянку. За один день квартира была готова к жизни.',
    },
  },
  {
    id: 'r2',
    name: 'Дмитрий',
    initials: 'Д',
    serviceKey: 'regular',
    date: '2026-09-02',
    rating: 5,
    text: {
      sr: 'Uzimamo redovno održavanje dva puta mesečno. Najviše cenim to što ne moramo ništa da pripremamo — ni usisivač ni hemiju.',
      en: 'We have regular cleaning twice a month. What I value most is that we do not have to prepare anything — not even a vacuum cleaner or products.',
      ru: 'Берём поддерживающую уборку два раза в месяц. Больше всего ценю, что нам не нужно ничего готовить — ни пылесос, ни химию.',
    },
  },
  {
    id: 'r3',
    name: 'Olga',
    initials: 'O',
    serviceKey: 'smart',
    date: '2026-09-14',
    rating: 5,
    text: {
      sr: 'Smart čišćenje mi odgovara jer sama odredim listu: prozori, rerna i balkon. Sve u jednoj ceni, bez doplata po stavci.',
      en: 'Smart cleaning suits me because I set the list myself: windows, oven and the balcony. All in one price, with no per-item surcharges.',
      ru: 'Смарт Клининг удобен тем, что список задач я задаю сама: окна, духовка и балкон. Всё в одной цене, без доплат по позициям.',
    },
  },
  {
    id: 'r4',
    name: 'Ana',
    initials: 'A',
    serviceKey: 'regular',
    date: '2026-07-27',
    rating: 4,
    text: {
      sr: 'Pauza je bila duža od tri nedelje pa je cena bila uvećana, ali su nam to unapred rekli i objasnili zašto. Sve ostalo je bilo bez zamerke.',
      en: 'The gap was longer than three weeks so the price was higher, but they told us in advance and explained why. Everything else was faultless.',
      ru: 'Перерыв был больше трёх недель, поэтому цена оказалась выше, но нам об этом сказали заранее и объяснили, почему. В остальном без замечаний.',
    },
  },
];
