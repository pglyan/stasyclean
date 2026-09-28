import type { LegalContent } from './types';

/**
 * Uslovi pružanja usluga (srpski, latinica).
 * Ogledalo terms.ru.ts. Doplate i ograničenja su preuzeti iz javnog cenovnika
 * klijenta, da sajt ne obećava uslove kojih nema.
 */

export const termsSr: LegalContent = {
  updated: '2026-09-27',
  updatedLabel: 'Ažurirano',
  sections: [
    {
      title: 'Opšte odredbe',
      paragraphs: [
        'StasyClean pruža usluge čišćenja stanova i kuća u Beogradu. U nastavku je opisan način naručivanja, obračuna cene, plaćanja i otkazivanja, kao i granice onoga što usluga obuhvata.',
      ],
    },
    {
      title: 'Zahtev i cena',
      paragraphs: [
        'Zahtev se šalje putem Telegrama ili forme na sajtu. Cena se obračunava prema kvadraturi prostora i izabranom paketu i fiksira se pre početka radova.',
        'Cena ne zavisi od toga koliko sati rad traje. Dodatne usluge i pranje prozora dogovaraju se posebno i plaćaju se dodatno.',
      ],
    },
    {
      title: 'Doplate',
      paragraphs: ['Cena može biti uvećana od 20% do 50% u sledećim slučajevima:'],
      list: [
        'jako zaprljanje stana;',
        'velika količina dlake kućnih ljubimaca;',
        'velika zatrpanost prostora stvarima;',
        'pauza duža od 20 dana između redovnih čišćenja.',
      ],
    },
    {
      title: 'Šta usluga obuhvata',
      paragraphs: [
        'Kompletan spisak radova objavljen je u ček-listi za svaki vid čišćenja. Usisivač, merdevine, profesionalna hemija i sav inventar ulaze u cenu — nije potrebno da obezbedite svoju opremu.',
      ],
    },
    {
      title: 'Plaćanje',
      paragraphs: [
        'Plaćanje se vrši posle obavljenih radova, kada pregledate i prihvatite rezultat. Mogući su gotovina i transfer na račun; za firme je moguće fakturisanje po ugovoru.',
      ],
    },
    {
      title: 'Otkazivanje i pomeranje',
      paragraphs: [
        'Javite nam o otkazivanju ili pomeranju što ranije: ako se planovi promene na vreme, dodatna naknada se ne obračunava. Ako je član tima već stigao, dalje zakazivanje je po prethodnom dogovoru.',
      ],
    },
    {
      title: 'Odgovornost',
      paragraphs: [
        'Odgovorni smo za bezbednost vaše imovine; postupak naknade štete utvrđuje se ugovorom. Unapred nas obavestite o površinama koje zahtevaju posebno postupanje: mermer, prirodno drvo, visokosjajne površine.',
      ],
    },
    {
      title: 'Izmene uslova',
      paragraphs: [
        'Aktuelna verzija uslova objavljena je na ovoj stranici. O bitnim izmenama obaveštavamo na sajtu.',
      ],
    },
  ],
};
