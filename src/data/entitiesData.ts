export interface KeyEntity {
  id: string;
  slug: string;
  name: string;
  type: 'Engineer' | 'Designer' | 'Coachbuilder / Design House' | 'Founder / Visionary';
  nationality: string;
  countryCode: string;
  yearsActive: string;
  roleTitle: string;
  avatarUrl: string;
  coverImageUrl?: string;
  biographyIt: string;
  biographyEn: string;
  companyInfoIt?: string;
  companyInfoEn?: string;
  keyAchievementsIt: string[];
  keyAchievementsEn: string[];
  associatedVehicleSlugs: string[];
}

export interface WorldwideAuctionEvent {
  id: string;
  slug: string;
  title: string;
  organizer: string;
  eventType: 'Auction' | 'Concours d’Elegance' | 'Rally / Race' | 'Motor Show';
  location: string;
  countryCode: string;
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Catalog Published' | 'In Progress' | 'Completed';
  estimatedLotsCount?: number;
  expectedVolumeEurM?: number;
  imageUrl: string;
  featuredCarSlugs: string[];
  featuredCarsNames: string[];
  descriptionIt: string;
  descriptionEn: string;
  officialWebsiteUrl?: string;
}

export const KEY_ENTITIES: KeyEntity[] = [
  {
    id: 'ent-nicola-materazzi',
    slug: 'nicola-materazzi',
    name: 'Nicola Materazzi',
    type: 'Engineer',
    nationality: 'Italiana',
    countryCode: 'IT',
    yearsActive: '1939 - 2022',
    roleTitle: 'Ingegnere Capo & Padre di F40, 288 GTO e Bugatti EB110',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop',
    biographyIt: `Nicola Materazzi (Caselle in Pittari, 28 gennaio 1939 – 23 agosto 2022) è stato uno dei più celebri e geniali ingegneri automobilistici della storia. Definito a livello globale come il "Padre della Ferrari F40", fu il pioniere assoluto dei motori turbo da competizione in Lancia (sulla Stratas Gr. 5 Turbo) e successivamente in Ferrari, dove progettò i leggendari propulsori V8 Biturbo della 288 GTO e della F40. Nel 1991 assunse la direzione tecnica della Bugatti a Campogalliano, affinando il telaio e il motore V12 Quad-Turbo della EB110.`,
    biographyEn: `Nicola Materazzi (1939 – 2022) was a legendary Italian mechanical engineer globally revered as the "Father of the Ferrari F40". Pioneer of turbocharging in motorsport with Lancia Stratos Turbo, he joined Ferrari to design the V8 Twin-Turbo powertrains of the 288 GTO and F40. In 1991 he became Technical Director at Bugatti Automobili in Campogalliano, perfecting the Quad-Turbo V12 powertrain and chassis of the Bugatti EB110 GT and SS.`,
    companyInfoIt: `Ha lavorato ai vertici tecnici di Lancia Reparto Corse, Ferrari S.p.A. (Maranello), Cagiva, Bugatti Automobili S.p.A. (Campogalliano) e Edonis B.Engineering.`,
    companyInfoEn: `Held senior technical positions at Lancia Racing, Ferrari S.p.A., Cagiva, Bugatti Automobili S.p.A., and B.Engineering Edonis.`,
    keyAchievementsIt: [
      'Progettazione completa e sviluppo telaistico/motoristico della Ferrari F40',
      'Sviluppo del motore V8 Twin-Turbo F120A della Ferrari 288 GTO e F40',
      'Direzione Tecnica Bugatti Automobili S.p.A. per lo sviluppo della Bugatti EB110 GT / SS',
      'Progettazione del motore Lancia Stratos Gr. 5 Turbo da competizione'
    ],
    keyAchievementsEn: [
      'Chief Engineering & Technical direction for the Ferrari F40',
      'Engine architecture design for the Ferrari 288 GTO V8 Twin-Turbo',
      'Technical Direction at Bugatti Automobili for the EB110 Quad-Turbo V12',
      'Lancia Stratos Group 5 Turbo engine development'
    ],
    associatedVehicleSlugs: ['ferrari-f40', 'porsche-959-komfort', 'mclaren-f1', 'bugatti-eb110-gt']
  },
  {
    id: 'ent-pininfarina',
    slug: 'pininfarina',
    name: 'Pininfarina S.p.A.',
    type: 'Coachbuilder / Design House',
    nationality: 'Italiana',
    countryCode: 'IT',
    yearsActive: '1930 - Presente',
    roleTitle: 'Storico Carrozziere & Centro Stile Iconico Automobilistico',
    avatarUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&auto=format&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop',
    biographyIt: `Fondata nel 1930 a Torino da Battista "Pinin" Farina, Pininfarina rappresenta il simbolo mondiale dell'eleganza, dell'aerodinamica e dello stile automobilistico italiano. La carrozzeria ha firmato oltre sessanta modelli storici per la Ferrari (dalla 250 GTO alla Testarossa, F40, 288 GTO, Enzo e 458 Italia), oltre a capolavori per Alfa Romeo, Lancia, Maserati e Peugeot. Oggi Pininfarina è anche costruttore indipendente della Hypercar elettrica Battista.`,
    biographyEn: `Founded in 1930 in Turin by Battista "Pinin" Farina, Pininfarina is the world’s premier automotive design house and coachbuilder. Responsible for shaping over 60 iconic Ferrari models (including 250 GTO, Testarossa, 288 GTO, F40, Enzo, and 458 Italia), as well as legendary Alfa Romeo, Lancia, and Maserati bodyworks.`,
    companyInfoIt: `Società quotata in borsa specializzata in car design, prototipazione rapida, ingegnerizzazione di carrozzeria e galleria del vento proprietaria a Grugliasco (Torino).`,
    companyInfoEn: `Specialized automotive design house, rapid prototyping facility, and owner of full-scale wind tunnel in Grugliasco, Italy.`,
    keyAchievementsIt: [
      'Design di oltre 60 modelli Ferrari da produzione e serie speciali fuoriserie',
      'Inaugurazione della prima galleria del vento automobilistica a scala 1:1 in Italia (1972)',
      'Disegno delle icone Ferrari F40, Testarossa, 288 GTO, Daytona e Dino 246 GT',
      'Creazione della Hypercar Pininfarina Battista (1.900 CV)'
    ],
    keyAchievementsEn: [
      'Styling of over 60 iconic Ferrari production and coachbuilt models',
      'Pioneered full-scale automotive wind tunnel testing in Italy (1972)',
      'Designed Ferrari F40, Testarossa, 288 GTO, Daytona, and Dino 246 GT',
      'Creation of the Pininfarina Battista Electric Hypercar'
    ],
    associatedVehicleSlugs: ['ferrari-f40', 'mclaren-f1', 'bugatti-eb110-gt', 'porsche-959-komfort']
  },
  {
    id: 'ent-marcello-gandini',
    slug: 'marcello-gandini',
    name: 'Marcello Gandini',
    type: 'Designer',
    nationality: 'Italiana',
    countryCode: 'IT',
    yearsActive: '1938 - 2024',
    roleTitle: 'Maestro del Wedge Design & Creatore di Miura, Countach e Stratos',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1200&auto=format&fit=crop',
    biographyIt: `Marcello Gandini (Torino, 26 agosto 1938 – Rivoli, 13 marzo 2024) è considerato uno dei più influenti designer automobilistici di tutti i tempi. Durante il suo periodo come capo del design alla Carrozzeria Bertone, inventò il linguaggio formale "Wedge" (a cuneo) e le celebri portiere a forbice, tracciando le linee monumentali della Lamborghini Miura, della Lamborghini Countach, della Lancia Stratos HF, della Alfa Romeo Montreal e della Bugatti EB110.`,
    biographyEn: `Marcello Gandini (1938 – 2024) was one of the most influential car designers in history. As chief designer at Stile Bertone, he invented the iconic "Wedge Shape" automotive era and scissor doors, giving life to the Lamborghini Miura, Countach, Lancia Stratos HF, Alfa Romeo Montreal, and original Bugatti EB110 prototype.`,
    companyInfoIt: `Capo Stile Bertone (1965 - 1979) e successivamente designer indipendente con la Clusone Stile.`,
    companyInfoEn: `Chief Designer at Bertone (1965–1979) and later independent design consultant.`,
    keyAchievementsIt: [
      'Disegno della Lamborghini Miura (1966), la prima supercar a motore centrale posteriore',
      'Invenzione dello stile a cuneo e portiere a forbice con la Lamborghini Countach (1971)',
      'Design della leggendaria Lancia Stratos HF da rally',
      'Progettazione della scocca e stile iniziale della Bugatti EB110'
    ],
    keyAchievementsEn: [
      'Designed the Lamborghini Miura (1966), the world’s first mid-engine supercar',
      'Pioneered wedge geometry and scissor doors with the Lamborghini Countach',
      'Designed the legendary Lancia Stratos HF rally weapon',
      'Styling concept for Bugatti EB110 GT'
    ],
    associatedVehicleSlugs: ['bugatti-eb110-gt', 'ferrari-f40', 'porsche-959-komfort']
  },
  {
    id: 'ent-gordon-murray',
    slug: 'gordon-murray',
    name: 'Gordon Murray',
    type: 'Engineer',
    nationality: 'Sudafricana / Britannica',
    countryCode: 'GB',
    yearsActive: '1946 - Presente',
    roleTitle: 'Ingegnere F1 e Progettista della McLaren F1 e Gordon Murray Automotive',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200&auto=format&fit=crop',
    biographyIt: `Professor Gordon Murray CBE è un leggendario progettista di Formula 1 (Brabham e McLaren con cui vinse 5 campionati del mondo) e il creatore della celeberrima McLaren F1 (1992), considerata la più grande supercar aspirata della storia con posto di guida centrale a 3 sedili e monoscocca in fibra di carbonio. Oggi guida Gordon Murray Automotive (GMA) producendo le supercar analogiche T.50 e T.33.`,
    biographyEn: `Professor Gordon Murray CBE is a legendary Formula 1 designer (Brabham & McLaren) and creator of the iconic 1992 McLaren F1 road car. Pioneer of carbon fiber monocoques and central driving position layout, he currently leads Gordon Murray Automotive (GMA) crafting the T.50 and T.33 analog supercars.`,
    companyInfoIt: `Direttore Tecnico Brabham F1, McLaren Cars, e Fondatore di Gordon Murray Automotive.`,
    companyInfoEn: `Technical Director at Brabham F1, McLaren Cars, and Founder of Gordon Murray Automotive.`,
    keyAchievementsIt: [
      'Progettazione della McLaren F1 (3 posti, motore BMW V12 aspirato, 386 km/h)',
      'Vittoria alla 24 Ore di Le Mans 1995 al debutto con la McLaren F1 GTR',
      'Creazione della monoscocca in carbonio iStream e della GMA T.50 con ventola aerodinamica'
    ],
    keyAchievementsEn: [
      'Designed the 1992 McLaren F1 road car with central seating position',
      'Outright 24 Hours of Le Mans victory on debut with the McLaren F1 GTR (1995)',
      'Development of Gordon Murray Automotive T.50 & T.33 analog hypercars'
    ],
    associatedVehicleSlugs: ['mclaren-f1', 'ferrari-f40', 'porsche-959-komfort']
  }
];

export const UPCOMING_AUCTIONS: WorldwideAuctionEvent[] = [
  {
    id: 'auc-monterey-2025',
    slug: 'rm-sothebys-monterey-2025',
    title: "RM Sotheby's Monterey Car Week Auction",
    organizer: "RM Sotheby's",
    eventType: 'Auction',
    location: 'Monterey, California (USA)',
    countryCode: 'US',
    startDate: '2025-08-14',
    endDate: '2025-08-16',
    status: 'Catalog Published',
    estimatedLotsCount: 160,
    expectedVolumeEurM: 185,
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop',
    featuredCarSlugs: ['ferrari-f40', 'mclaren-f1', 'porsche-959-komfort'],
    featuredCarsNames: ['1989 Ferrari F40 Non-Cat', '1995 McLaren F1 GTR', '1988 Porsche 959 Sport'],
    descriptionIt: 'L’evento d’asta d’epoca più importante e prestigioso al mondo durante la Monterey Car Week. Asta di riferimento per le supercar iconiche degli anni ’80 e ’90.',
    descriptionEn: 'The flagship collector car auction of Monterey Car Week, featuring record-setting European supercars and rare blue-chip classics.',
    officialWebsiteUrl: 'https://rmsothebys.com'
  },
  {
    id: 'auc-pebble-2025',
    slug: 'gooding-pebble-beach-2025',
    title: 'Gooding & Company Pebble Beach Auctions',
    organizer: 'Gooding & Company',
    eventType: 'Auction',
    location: 'Pebble Beach, California (USA)',
    countryCode: 'US',
    startDate: '2025-08-15',
    endDate: '2025-08-16',
    status: 'Upcoming',
    estimatedLotsCount: 135,
    expectedVolumeEurM: 140,
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop',
    featuredCarSlugs: ['mclaren-f1', 'ferrari-f40'],
    featuredCarsNames: ['1997 McLaren F1 Road Car', '1991 Bugatti EB110 GT Prototype'],
    descriptionIt: 'Asta ufficiale del Concorso d’Eleganza di Pebble Beach con concentrazione record di vetture Classiche certificate e Youngtimer da collezione.',
    descriptionEn: 'Official auction house of the Pebble Beach Concours d’Elegance featuring top-tier historic sports cars.',
    officialWebsiteUrl: 'https://goodingco.com'
  },
  {
    id: 'auc-zoute-2025',
    slug: 'bonhams-zoute-sale-2025',
    title: 'Bonhams The Zoute Sale',
    organizer: 'Bonhams Cars',
    eventType: 'Auction',
    location: 'Knokke-Heist (Belgio)',
    countryCode: 'BE',
    startDate: '2025-10-05',
    endDate: '2025-10-05',
    status: 'Upcoming',
    estimatedLotsCount: 95,
    expectedVolumeEurM: 32,
    imageUrl: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800&auto=format&fit=crop',
    featuredCarSlugs: ['bugatti-eb110-gt', 'porsche-959-komfort'],
    featuredCarsNames: ['1994 Bugatti EB110 GT', '1992 Porsche 959 Late Re-issue'],
    descriptionIt: 'L’asta autunnale di riferimento in Europa continentale, situata nella rinomata località balneare belga con focus su supercar da collezione e vetture storiche omologate.',
    descriptionEn: 'Premier continental European autumn auction located in coastal Belgium with top supercar lots.',
    officialWebsiteUrl: 'https://bonhams.com'
  },
  {
    id: 'auc-retromobile-2026',
    slug: 'artcurial-retromobile-2026',
    title: 'Artcurial Motorcars Rétromobile Paris',
    organizer: 'Artcurial Motorcars',
    eventType: 'Auction',
    location: 'Parigi, Porte de Versailles (Francia)',
    countryCode: 'FR',
    startDate: '2026-02-06',
    endDate: '2026-02-08',
    status: 'Upcoming',
    estimatedLotsCount: 180,
    expectedVolumeEurM: 55,
    imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop',
    featuredCarSlugs: ['ferrari-f40', 'bugatti-eb110-gt'],
    featuredCarsNames: ['1990 Ferrari F40 Classiche', '1995 Bugatti EB110 Super Sport'],
    descriptionIt: 'L’asta ufficiale del salone Rétromobile di Parigi. Celebre per collezioni private inedite, scoperte di fienile (Barn Finds) e vetture sportive francesi ed italiane.',
    descriptionEn: 'The official auction of Rétromobile Paris salon, famous for rare single-owner collections and barn finds.',
    officialWebsiteUrl: 'https://artcurial.com'
  },
  {
    id: 'auc-villa-deste-2026',
    slug: 'concorso-villa-deste-2026',
    title: "Concorso d'Eleganza Villa d'Este & RM Sotheby's Sale",
    organizer: "RM Sotheby's / BMW Group",
    eventType: 'Concours d’Elegance',
    location: 'Cernobbio, Lago di Como (Italia)',
    countryCode: 'IT',
    startDate: '2026-05-22',
    endDate: '2026-05-24',
    status: 'Upcoming',
    estimatedLotsCount: 50,
    expectedVolumeEurM: 65,
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop',
    featuredCarSlugs: ['ferrari-f40', 'mclaren-f1', 'porsche-959-komfort'],
    featuredCarsNames: ['1987 Ferrari F40 Prototype', '1996 McLaren F1 LM Specification'],
    descriptionIt: 'Il concorso d’eleganza più celebre e affascinante d’Europa sulle sponde del Lago di Como con asta esclusiva ad inviti curata da RM Sotheby’s.',
    descriptionEn: 'The most exclusive concours d’elegance in Europe hosted at Villa d’Este, Lake Como.',
    officialWebsiteUrl: 'https://concorsodeleganzavilladeste.com'
  }
];
