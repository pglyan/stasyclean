import type { UIStrings } from './ru';

/** Tekstovi interfejsa na srpskom (latinica). Moraju pokriti sve ključeve ruskog rečnika. */
export const sr = {
  nav: {
    home: 'Početna',
    prices: 'Cene',
    services: 'Usluge',
    about: 'O nama',
    reviews: 'Utisci',
    faq: 'Pitanja',
    contact: 'Kontakt',
    language: 'Jezik',
    /** Pristupačno ime glavne navigacije — različito od dugmeta za meni. */
    main: 'Glavna navigacija',
  },

  cta: {
    book: 'Zakaži čišćenje',
    telegram: 'Piši nam na Telegram',
    whatsapp: 'WhatsApp',
    call: 'Pozovi',
    calculate: 'Izračunaj cenu',
    details: 'Detaljnije',
    allServices: 'Sve usluge',
    /** Dugme „na početnu“ — koristi se na stranici 404. */
    back: 'Na početnu',
    menu: 'Meni',
    close: 'Zatvori',
    /** Kratke oznake za fiksiranu traku na telefonu (vidi ru.ts). */
    bookShort: 'Zakaži',
    calcShort: 'Izračunaj',
    orderShort: 'Pošalji',
    order: 'Pošalji zahtev sa procenom',
  },

  price: {
    from: 'od',
    hour: 'sat',
    minimum: 'Minimalna narudžbina',
    popular: 'Najčešći izbor',
    area: 'Kvadratura',
    total: 'Procena cene',
    totalNote: 'Konačnu cenu potvrđuje menadžer na Telegramu',
    included: 'Šta je u ceni',
  },

  common: {
    provisional: 'Privremeni podaci',
    /** Skip link za tastaturu (base.css, .skip-link). */
    skipToContent: 'Preskoči na sadržaj',
    /** Pristupačno ime navigacije „mrvice“ (PageHero.astro). */
    breadcrumb: 'Navigacija',
    /** Pristupačno ime mobilnog menija — različito od dugmeta za meni. */
    menuDialog: 'Meni sajta',
    /** Oznaka datuma u zaglavlju pravnih dokumenata (Legal.astro). */
    updated: 'Ažurirano',
  },

  home: {
    servicesTitle: 'Šta čistimo',
    servicesLead: 'Četiri formata — od redovnog održavanja do čišćenja posle renoviranja.',
    pricesTitle: 'Cene po kvadraturi',
    pricesLead: 'Cena ne zavisi od toga koliko sati rad traje. Iznos fiksiramo pre izlaska.',
    calculatorTitle: 'Izračunajte svoje čišćenje',
    calculatorLead:
      'Izaberite kvadraturu, format i dodatne zadatke — procenu cene vidite za nekoliko sekundi.',
    includedTitle: 'Šta ulazi u čišćenje',
    includedLead: 'Kompletan spisak radova, bez formulacije „i ostalo“.',
    extrasTitle: 'Dodatne usluge',
    extrasLead:
      'Mogu se dodati na svako čišćenje i dogovaraju se posebno — kako piše u našem cenovniku.',
    windowsTitle: 'Pranje prozora',
    windowsLead: 'Obračunava se po krilu. Kod jakog zaprljanja cena može biti viša.',
    stepsTitle: 'Kako radimo',
    stepsLead: 'Četiri koraka od poruke na Telegramu do plaćanja posle prijema radova.',
    aboutTitle: 'O nama',
    aboutLead: 'Radimo u Beogradu, donosimo svu opremu i hemiju i odgovorni smo za rezultat.',
    reviewsTitle: 'Šta kažu klijenti',
    reviewsLead: 'Utisci nam stižu preko Telegrama i Instagrama.',
    areasTitle: 'Gde radimo',
    areasLead: 'Beograd, svi centralni i stambeni delovi grada.',
    /** Napomena ispod spiska delova grada: pokrivenost se još potvrđuje. */
    areasNote: 'Spisak delova grada je privremen — potvrđujemo pri zakazivanju.',
    faqTitle: 'Česta pitanja',
    faqLead: 'Odgovaramo na ono što se najčešće pita pre zakazivanja.',
    formTitle: 'Pošaljite zahtev',
    formLead: 'Napišite kvadraturu, deo grada i željeni datum. Odgovaramo u toku dana.',
    contactTitle: 'Kontaktirajte nas',
    contactLead: 'Najbrži način je Telegram.',
  },

  calc: {
    areaLabel: 'Kvadratura stana',
    planLabel: 'Format čišćenja',
    extrasLabel: 'Dodatni zadaci',
    hoursLabel: 'Koliko sati vam treba',
    resultHint: 'Ovo je samo orijentir. Tačan iznos kažemo posle nekoliko kratkih pitanja.',
    noExtras: 'Dodatni zadaci nisu izabrani',
    detailsShow: 'Prikaži detalje',
    detailsHide: 'Sakrij detalje',
    smartHint: 'Kod Smart čišćenja plaćate po satu, pa se cena računa po vremenu.',
    overLimit: 'Kvadratura je veća od {max} — obračun radimo individualno.',
  },

  form: {
    name: 'Kako se zovete',
    contact: 'Telefon ili korisničko ime na Telegramu',
    contactHint: 'Dovoljan je jedan način kontakta',
    address: 'Deo grada',
    addressPlaceholder: 'Na primer, Vračar',
    date: 'Željeni datum',
    time: 'Željeno vreme',
    timeMorning: '09:00 – 12:00',
    timeAfternoon: '12:00 – 16:00',
    timeEvening: '16:00 – 19:00',
    comment: 'Komentar',
    commentPlaceholder: 'Želje, specifičnosti stana, kućni ljubimci',
    submit: 'Pošalji na Telegram',
    orDirect: 'ili nam pišite direktno',
    consent: 'Slažem se sa obradom ličnih podataka',
    successTitle: 'Zahtev je spreman za slanje',
    successText: 'Otvorili smo Telegram sa popunjenom porukom — ostaje samo da pritisnete Pošalji.',
    errorName: 'Napišite ime da znamo kako da vam se obratimo',
    errorContact: 'Potreban je telefon ili korisničko ime na Telegramu',
    errorConsent: 'Bez saglasnosti ne možemo da primimo zahtev',
    errorOpen: 'Nismo mogli da otvorimo Telegram — koristite dugme ispod',
  },

  footer: {
    services: 'Usluge',
    navigation: 'Stranice',
    contacts: 'Kontakt',
    legal: 'Podaci o firmi',
    privacy: 'Politika privatnosti',
    terms: 'Uslovi korišćenja',
    rights: 'Sva prava zadržana',
    disclaimer: 'Cene na sajtu su informativne i ne predstavljaju obavezujuću ponudu.',
    pendingLegal: 'Podaci o firmi biće dodati pre puštanja sajta u rad',
  },

  /** Blok poređenja „pre / posle“ (BeforeAfter.astro). */
  beforeAfter: {
    title: 'Pre i posle',
    lead: 'Isti ugao snimljen pre i posle čišćenja.',
    before: 'Pre',
    after: 'Posle',
  },

  /** Baner za kolačiće (CookieNotice.astro) — prikazuje se samo uz analitiku. */
  cookie: {
    label: 'Kolačići',
    text: 'Koristimo tehničke kolačiće za rad sajta. Analitičke kolačiće uvodimo samo uz vašu saglasnost.',
    accept: 'Prihvati',
  },

  /** Stranica 404. Dugmad koriste cta.back i cta.telegram. */
  notFound: {
    title: 'Stranica nije pronađena',
    lead: 'Moguće je da je link zastareo ili da u adresi postoji greška.',
  },

  /** Prekidač sheme u zaglavlju sajta. */
  scheme: {
    toLight: 'Svetla tema',
    toDark: 'Tamna tema',
  },
} satisfies UIStrings;
