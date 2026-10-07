import type { LegalContent } from './types';

/**
 * Politika privatnosti (srpski, latinica).
 * Ogledalo privacy.ru.ts — isti redosled odeljaka u sva tri jezika.
 * ŠABLON: tekst mora da pregleda pravnik pre puštanja sajta u rad.
 */

export const privacySr: LegalContent = {
  updated: '2026-09-27',
  sections: [
    {
      title: 'Ko obrađuje vaše podatke',
      paragraphs: [
        'Rukovalac podacima o ličnosti je StasyClean, servis za čišćenje koji radi u Beogradu. Potpuni podaci o rukovaocu (naziv, adresa, PIB i matični broj) biće objavljeni u ovom odeljku pre puštanja sajta u rad.',
      ],
    },
    {
      title: 'Koje podatke prikupljamo',
      paragraphs: [
        'Obrađujemo samo podatke koje nam sami saopštite prilikom kontakta preko forme, Telegrama ili WhatsApp-a:',
      ],
      list: [
        'ime po kojem želite da vam se obraćamo;',
        'telefon ili korisničko ime na Telegramu;',
        'deo grada u kojem je potrebno čišćenje;',
        'željeni datum i vreme;',
        'komentar sa detaljima: kvadratura, kućni ljubimci, posebne želje.',
      ],
    },
    {
      title: 'Zašto ih obrađujemo',
      paragraphs: [
        'Jedina svrha je obračun cene čišćenja, dogovor o datumu i vremenu i kontakt sa vama povodom vašeg zahteva. Podatke ne koristimo za reklamiranje, ne pravimo profile i ne prodajemo ih.',
      ],
    },
    {
      title: 'Pravni osnov',
      paragraphs: [
        'Pravni osnov obrade je vaša saglasnost, koju dajete označavanjem odgovarajućeg polja u formi, kao i radnje neophodne za zaključenje i izvršenje ugovora o pružanju usluga, u skladu sa Zakonom o zaštiti podataka o ličnosti („Službeni glasnik RS“, br. 87/2018).',
      ],
    },
    {
      title: 'Kome se podaci prosleđuju',
      paragraphs: [
        'Podaci se ne prosleđuju trećim licima u marketinške ili druge svrhe. Imajte u vidu da, ako nam pišete preko Telegrama ili WhatsApp-a, obrada se odvija i po pravilima tih servisa na koje ne možemo da utičemo. Sajt sam po sebi ne šalje vaše podatke na tuđe servere: dugmad samo otvaraju razgovor.',
      ],
    },
    {
      title: 'Koliko dugo ih čuvamo',
      paragraphs: [
        'Zahtevi koji nisu doveli do zaključenja ugovora brišu se u roku od 6 meseci. Podaci o izvršenim poslovima čuvaju se u obimu potrebnom za računovodstvenu i poresku evidenciju.',
      ],
    },
    {
      title: 'Vaša prava',
      paragraphs: [
        'Možete da zatražite pristup svojim podacima, njihovo ispravljanje ili brisanje, da povučete saglasnost i da uložite prigovor na obradu. Dovoljno je da nam pišete na Telegramu. Ako smatrate da su vaša prava prekršena, možete se obratiti Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti.',
      ],
    },
    {
      title: 'Kolačići i lokalno skladište',
      paragraphs: [
        'Sajt ne učitava analitiku trećih strana, reklamne piksele niti sisteme za praćenje. Tehnički kolačići se ne koriste za identifikaciju posetilaca.',
        'Izbor svetle ili tamne sheme (i saglasnost za kolačiće, ako je data) čuva se u lokalnom skladištu pregledača. Ti podaci ne napuštaju vaš pregledač i brišu se zajedno sa podacima sajta.',
      ],
    },
    {
      title: 'Izmene politike',
      paragraphs: [
        'Aktuelna verzija je uvek objavljena na ovoj stranici, a datum poslednjeg ažuriranja naveden je iznad.',
      ],
    },
  ],
};
