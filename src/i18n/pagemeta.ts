import type { Locale } from './config';
import type { PageKey } from './routes';
import type { Localized } from '../data/types';
import { getService } from '../data/services';
import { site, siteText } from '../data/site';
import { useUI } from './ui';

/**
 * Метаданные страницы для <title>, description и Open Graph.
 *
 * Правило одно: у каждой из 39 страниц свой заголовок и своё описание.
 * Раньше все внутренние страницы отдавали общий заголовок бренда — это
 * и плохой SEO-сигнал, и непонятная выдача в поиске.
 *
 * Заголовки строятся из данных, а не дублируются: название услуги берётся
 * из её карточки, город — из общей константы. Поэтому при переименовании
 * услуги ничего не разъедется.
 */

/** «в Белграде» — вынесено отдельно, потому что повторяется во всех заголовках услуг. */
const citySuffix: Localized = {
  sr: 'u Beogradu',
  en: 'in Belgrade',
  ru: 'в Белграде',
};

/**
 * Отдельные заголовки для двух «денежных» страниц: там важно попасть
 * в формулировки запросов («цена уборки квартиры», «клининг в Белграде»),
 * а не просто назвать раздел.
 */
const overrides: Record<string, { title: Localized; description: Localized }> = {
  prices: {
    title: {
      sr: 'Cene čišćenja stanova u Beogradu — fiksna cena po kvadraturi',
      en: 'Cleaning prices in Belgrade — fixed price by apartment size',
      ru: 'Цены на уборку квартир в Белграде — фиксированная цена по площади',
    },
    description: {
      sr: 'Cenovnik generalnog i redovnog čišćenja po kvadraturi, cene dodatnih usluga i pranja prozora. Cena ne zavisi od trajanja rada, usisivač i hemija su uključeni.',
      en: 'Price list for deep and regular cleaning by apartment size, plus additional services and window washing. Price does not depend on hours, vacuum and products included.',
      ru: 'Прайс генеральной и поддерживающей уборки по площади, стоимость дополнительных услуг и мойки окон. Цена не зависит от длительности, пылесос и химия включены.',
    },
  },
  services: {
    title: {
      sr: 'Usluge čišćenja u Beogradu — generalno, redovno, posle renoviranja',
      en: 'Cleaning services in Belgrade — deep, regular, post-renovation',
      ru: 'Услуги уборки в Белграде — генеральная, поддерживающая, после ремонта',
    },
    description: {
      sr: 'Četiri formata čišćenja: generalno, redovno održavanje, smart čišćenje po satu i čišćenje posle renoviranja. Donosimo svu opremu i hemiju.',
      en: 'Four cleaning formats: deep cleaning, regular upkeep, hourly smart cleaning and post-renovation cleaning. We bring all equipment and products.',
      ru: 'Четыре формата уборки: генеральная, поддерживающая, почасовая «смарт» и уборка после ремонта. Всё оборудование и химию привозим с собой.',
    },
  },
};

export interface PageMeta {
  title: string;
  description: string;
}

export function getPageMeta(locale: Locale, routeKey: PageKey): PageMeta {
  const ui = useUI(locale);

  if (routeKey === 'home') {
    return {
      title: siteText.metaTitle[locale],
      description: siteText.metaDescription[locale],
    };
  }

  const override = overrides[routeKey];
  if (override) {
    return { title: override.title[locale], description: override.description[locale] };
  }

  if (['general', 'regular', 'smart', 'reno'].includes(routeKey)) {
    const service = getService(routeKey as 'general' | 'regular' | 'smart' | 'reno');
    return {
      title: `${service.name[locale]} ${citySuffix[locale]} — ${site.brand}`,
      description: `${service.lead[locale]} ${service.duration[locale]}.`,
    };
  }

  const byKey: Record<string, { title: string; description: string }> = {
    about: { title: ui.home.aboutTitle, description: ui.home.aboutLead },
    reviews: { title: ui.home.reviewsTitle, description: ui.home.reviewsLead },
    faq: { title: ui.home.faqTitle, description: ui.home.faqLead },
    contact: { title: ui.home.contactTitle, description: ui.home.contactLead },
    privacy: { title: ui.footer.privacy, description: ui.footer.disclaimer },
    terms: { title: ui.footer.terms, description: ui.footer.disclaimer },
  };

  const entry = byKey[routeKey] ?? {
    title: siteText.tagline[locale],
    description: siteText.metaDescription[locale],
  };

  return {
    title: `${entry.title} — ${site.brand}`,
    description: entry.description,
  };
}
