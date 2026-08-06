import { 
  VehicleVariant, 
  Manufacturer, 
  GraphEntity, 
  GraphRelationship, 
  DataAssertion 
} from '../types';

export const MANUFACTURERS: Manufacturer[] = [
  { id: 'm-ferrari', slug: 'ferrari', official_name: 'Ferrari S.p.A.', country_code: 'IT', founded_year: 1939, active: true, logo_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=200&auto=format&fit=crop' },
  { id: 'm-porsche', slug: 'porsche', official_name: 'Dr. Ing. h.c. F. Porsche AG', country_code: 'DE', founded_year: 1931, active: true, logo_url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=200&auto=format&fit=crop' },
  { id: 'm-lamborghini', slug: 'lamborghini', official_name: 'Automobili Lamborghini S.p.A.', country_code: 'IT', founded_year: 1963, active: true, logo_url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=200&auto=format&fit=crop' },
  { id: 'm-lancia', slug: 'lancia', official_name: 'Lancia & C. Fabbrica Automobili', country_code: 'IT', founded_year: 1906, active: true, logo_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&auto=format&fit=crop' },
  { id: 'm-bmw', slug: 'bmw', official_name: 'Bayerische Motoren Werke AG', country_code: 'DE', founded_year: 1916, active: true, logo_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&auto=format&fit=crop' },
  { id: 'm-mercedes', slug: 'mercedes-benz', official_name: 'Mercedes-Benz AG', country_code: 'DE', founded_year: 1926, active: true, logo_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=200&auto=format&fit=crop' },
  { id: 'm-jaguar', slug: 'jaguar', official_name: 'Jaguar Cars Ltd.', country_code: 'GB', founded_year: 1922, active: true, logo_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=200&auto=format&fit=crop' },
  { id: 'm-mclaren', slug: 'mclaren', official_name: 'McLaren Automotive', country_code: 'GB', founded_year: 1985, active: true, logo_url: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=200&auto=format&fit=crop' },
  { id: 'm-bugatti', slug: 'bugatti', official_name: 'Bugatti Automobili S.p.A. / Bugatti SAS', country_code: 'FR', founded_year: 1909, active: true, logo_url: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=200&auto=format&fit=crop' },
  { id: 'm-alfa', slug: 'alfa-romeo', official_name: 'Alfa Romeo Automobiles S.p.A.', country_code: 'IT', founded_year: 1910, active: true, logo_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&auto=format&fit=crop' },
  { id: 'm-aston', slug: 'aston-martin', official_name: 'Aston Martin Lagonda Ltd', country_code: 'GB', founded_year: 1913, active: true, logo_url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=200&auto=format&fit=crop' },
  { id: 'm-maserati', slug: 'maserati', official_name: 'Maserati S.p.A.', country_code: 'IT', founded_year: 1914, active: true, logo_url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=200&auto=format&fit=crop' }
];

export const HERO_VEHICLES: VehicleVariant[] = [
  {
    id: 'v-ferrari-f40',
    generation_id: 'gen-f40',
    manufacturer_id: 'm-ferrari',
    manufacturer_name: 'Ferrari',
    model_name: 'F40',
    slug: 'ferrari-f40',
    variant_name: 'F40 Berlinetta (Non-Cat / Non-Adjustable)',
    tier: 'Hero',
    category: 'Supercar',
    market_code: 'EUR-SPEC',
    model_year_from: 1987,
    model_year_to: 1992,
    steering_side: 'LHD',
    body_style: 'Berlinetta',
    limited_edition: true,
    numbered_series: true,
    production_total: 1311,
    original_list_price_eur: 210000,
    data_status: 'demo',
    hero_image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop'
    ],
    engine: {
      id: 'eng-f120a',
      manufacturer_id: 'm-ferrari',
      engine_code: 'F120A',
      family_name: 'Ferrari Twin-Turbo V8',
      architecture: '90° V8',
      cylinders: 8,
      displacement_cc: 2936,
      aspiration: 'Twin-Turbocharged',
      fuel_type: 'Petrol',
      power_kw: 352,
      power_hp: 478,
      torque_nm: 577,
      compression_ratio: '7.7:1',
      redline_rpm: 7750
    },
    transmission: {
      id: 'trans-f40-5m',
      name: '5-Speed Dog-Leg Manual',
      type: 'Manual',
      gears: 5,
      manufacturer: 'Ferrari / ZF',
      drivetrain: 'RWD',
      differential_type: 'Mechanical Limited Slip (40%)'
    },
    specs: {
      kerb_weight_kg: 1250,
      dry_weight_kg: 1100,
      length_mm: 4358,
      width_mm: 1970,
      height_mm: 1124,
      wheelbase_mm: 2450,
      top_speed_kph: 324,
      acceleration_0_100: 4.1,
      power_to_weight_hp_ton: 434,
      fuel_capacity_l: 120
    },
    scores: {
      collector_score: {
        overall_score: 98,
        rarity_weight: 92,
        historical_relevance: 100,
        desirability: 99,
        originality_typical: 95,
        technical_relevance: 97,
        brand_recognizability: 100,
        community_culture: 98
      },
      investment_score: {
        overall_score: 94,
        market_trend: 95,
        liquidity: 92,
        supply_scarcity: 88,
        international_demand: 99,
        inverse_volatility: 91,
        inverse_maintenance_cost: 82,
        comparable_stability: 96
      },
      rarity_score: 89,
      confidence_level: 'High'
    },
    current_median_price_eur: 2850000,
    price_change_1y_pct: 12.4,
    price_change_3y_pct: 48.2,
    liquidity_score: 88,
    volatility_score: 18,
    avg_days_on_market: 42,
    history_it: 'Progettata per celebrare il 40° anniversario della casa di Maranello e ultima vettura approvata personalmente da Enzo Ferrari prima della sua scomparsa nel 1988. Costruita con pannelli in Kevlar, carbonio e Nomex, la F40 rappresenta la quintessenza della supercar analogica spinta all’estremo.',
    history_en: 'Built to celebrate Ferrari’s 40th anniversary and the last car personally approved by Enzo Ferrari before his death in 1988. Featuring Kevlar, carbon fiber, and Nomex body panels, the F40 remains the ultimate raw, analog twin-turbo supercar.',
    designers: [
      { id: 'p-fioravanti', full_name: 'Leonardo Fioravanti', nationality: 'IT', role: 'Designer', biography_it: 'Storico designer Pininfarina responsabile della linea iconica della F40, della 288 GTO e della Daytona.', biography_en: 'Legendary Pininfarina designer responsible for the F40, 288 GTO, and Daytona body designs.' }
    ],
    engineers: [
      { id: 'p-materazzi', full_name: 'Nicola Materazzi', nationality: 'IT', role: 'Engineer', biography_it: 'Padre ingegneristico della F40 e della 288 GTO, pioniere della sovralimentazione in Ferrari.', biography_en: 'Chief engineer of the F40 and 288 GTO, known as the father of Ferrari turbocharging.' }
    ],
    production_site: 'Maranello, Modena (IT)',
    known_issues: [
      { component: 'Serbatoi flessibili carburante (Fuel Bladders)', description_it: 'Necessitano di sostituzione obbligatoria ogni 10 anni secondo specifiche di omologazione.', description_en: 'Mandatory rubber fuel bladder replacement required every 10 years.', estimated_fix_cost_eur: '22,000 - 30,000', severity: 'High' },
      { component: 'Cinghie di distribuzione', description_it: 'Sostituzione periodica ogni 3-5 anni con smontaggio e controllo gioco valvole.', description_en: 'Engine timing belt replacement required every 3-5 years.', estimated_fix_cost_eur: '8,500 - 14,000', severity: 'High' }
    ],
    maintenance_complexity: 'High',
    annual_est_maintenance_eur: 18500,
    youtube_video_ids: ['3MDT46C_Y18', 'm0S4C2j1_Xk'],
    
    production_breakdown_notes_it: 'La Ferrari F40 è stata prodotta in un totale di 1.311 esemplari ufficiali tra il 1987 e il 1992 (fino al 1996 includendo le ultime varianti da gara). Tutti i 1.311 modelli stradali di serie hanno lasciato lo stabilimento di Maranello rigorosamente in un unico colore ufficiale: il Rosso Corsa (FER 300/6). Le vetture oggi avvistabili in altre tinte (Giallo Modena, Nero, Blu) sono il risultato di riverniciature post-vendita o di commesse speciali realizzate da Pininfarina per clienti d’élite come il Sultano del Brunei.',
    production_breakdown_notes_en: 'The Ferrari F40 was produced in 1,311 official factory units between 1987 and 1992 (extending to 1996 for racing derivatives). Every single factory road car left Maranello exclusively in Rosso Corsa (FER 300/6). Any other colors seen today are post-factory repaints or Pininfarina coachbuilt commissions for elite buyers like the Sultan of Brunei.',
    
    factory_colors: [
      {
        color_name: 'Rosso Corsa (FER 300/6)',
        color_code: 'FER 300/6',
        hex_code: '#d60000',
        is_standard_factory: true,
        notes_it: 'Unico colore ufficiale di fabbrica per tutti i 1.311 esemplari di serie. Lo strato di vernice acrilica era steso in spessore ultrasottile per risparmiare peso, lasciando intravedere la trama della fibra di carbonio e Kevlar sottostante.',
        notes_en: 'Sole official factory color for all 1,311 production road cars. Extremely thin paint coat designed for weight savings, exposing Kevlar/carbon weave in direct light.'
      },
      {
        color_name: 'Fuoriserie Pininfarina / Commesse VIP (Giallo Modena, Nero, Grigio, Blu)',
        color_code: 'CUSTOM-PININ',
        hex_code: '#facc15',
        is_standard_factory: false,
        notes_it: 'Commesse speciali realizzate da Pininfarina per il Sultano del Brunei (tra cui 7 esemplari con guida a destra RHD, F40 LM RHD grigio opaco e allestimenti interni in pelle custom).',
        notes_en: 'Special coachbuilt orders completed by Pininfarina for the Sultan of Brunei (including 7 RHD conversions and a matte gray RHD F40 LM with custom leather interior).'
      }
    ],

    variant_editions: [
      {
        name: 'Modelli di Pre-Serie / Prototipi',
        production_count: '~8 esemplari',
        years: '1987',
        power_hp: 478,
        description_it: 'Prototipi allestiti prima del debutto per i collaudi su strada e le omologazioni. Derivavano direttamente dal programma di sviluppo della 288 GTO Evoluzione.',
        description_en: 'Pre-production prototypes built for road testing and homologation, directly evolving from the 288 GTO Evoluzione test mules.',
        key_features: ['Derivazione 288 GTO Evoluzione', 'Finestrini in plexiglass con scorrevoli', 'Dettagli aerodinamici sperimentali']
      },
      {
        name: 'F40 Stradale Euro "Non-Cat / Non-Adjustable"',
        production_count: '~600 esemplari',
        years: '1987 - 1989',
        power_hp: 478,
        description_it: 'La versione stradale più pura e ricercata dai collezionisti, priva di marmitte catalitiche e dotata di sospensioni fisse tradizionali.',
        description_en: 'The purest and most desirable road specification, without catalytic converters and featuring conventional fixed-rate suspension.',
        key_features: ['Senza catalizzatore', 'Sospensioni fisse tradizionali', 'Peso ridotto a circa 1.100 kg a secco', 'Finestrini rigidi o scorrevoli in plexiglass']
      },
      {
        name: 'F40 Stradale Euro "Cat / Sospensioni Regolabili"',
        production_count: '~470 esemplari',
        years: '1990 - 1992',
        power_hp: 478,
        description_it: 'Evoluzione introdotta per rispettare le normative antinquinamento, con catalizzatori allo scarico e sistema elettronico di regolazione altezza sospensioni a 3 livelli.',
        description_en: 'Later European production run equipped with catalytic converters and 3-stage electronic ride-height adjustable suspension.',
        key_features: ['Marmitte catalitiche d’ispezione', 'Sospensioni elettroniche sollevabili', 'Vetri discendenti in cristallo']
      },
      {
        name: 'F40 US-Spec',
        production_count: '213 esemplari',
        years: '1990 - 1992',
        power_hp: 478,
        description_it: 'Versione modificata per l’omologazione negli Stati Uniti. Riconoscibile per i paraurti neri maggiorati sul muso e sul retrotreno e le luci di ingombro (side markers).',
        description_en: 'US market homologation spec with prominent black rubber bumper fascia, side marker lights, and aluminum fuel cells.',
        key_features: ['Fascioni paraurti neri prominenti', 'Luci side markers USA', 'Serbatoi in alluminio integrati', 'Sedili comfort rinforzati']
      },
      {
        name: 'F40 LM (Le Mans)',
        production_count: '19 esemplari',
        years: '1989 - 1996',
        power_hp: 720,
        is_racing: true,
        description_it: 'Sviluppata da Michelotto per gare Endurance e IMSA. Peso ridotto a 1.050 kg, alettone posteriore regolabile in carbonio, fari fissi in plexiglass e motore spinto oltre 720 CV.',
        description_en: 'Extreme racing version built by Michelotto for IMSA GTO and Le Mans. 1,050 kg kerb weight, 720+ HP, fixed plexiglass headlights, and adjustable rear wing.',
        key_features: ['Motore F120B da 720 CV', 'Fari fissi integrati', 'Peso 1.050 kg', 'Alettone posteriore regolabile in carbonio']
      },
      {
        name: 'F40 GT',
        production_count: '7 esemplari',
        years: '1992 - 1994',
        power_hp: 560,
        is_racing: true,
        description_it: 'Variante da competizione allestita da Michelotto per il Campionato Italiano Supercar. Potenza elevata a 560 CV, freni Brembo da gara e sospensioni ricalibrate.',
        description_en: 'Competition version prepared by Michelotto for the Italian Supercar Championship with 560 HP and upgraded Brembo race brakes.',
        key_features: ['Omologazione CSAI Supercar', 'Freni Brembo maggiorati', 'Assetto e barre antirollio da gara']
      },
      {
        name: 'F40 GTE',
        production_count: '6 esemplari',
        years: '1994 - 1996',
        power_hp: 660,
        is_racing: true,
        description_it: 'Evoluzione finale per il campionato BPR Global GT Series. Cambio sequenziale a 6 marce, carreggiate allargate, freni in carbonio e propulsore portato fino a 3.5 litri.',
        description_en: 'Final racing evolution for the BPR Global GT Series featuring a 6-speed sequential gearbox, wider tracks, and carbon brakes.',
        key_features: ['Cambio sequenziale a 6 marce', 'Cilindrata portata fino a 3.5L', 'Freni in carbonio-ceramica', 'Aero GTE esasperata']
      }
    ],
    price_history: [
      { year: 2021, period: '2021-Q1', median_price_eur: 1850000, average_price_eur: 1900000, lower_quartile_eur: 1700000, upper_quartile_eur: 2050000 },
      { year: 2022, period: '2022-Q1', median_price_eur: 2200000, average_price_eur: 2300000, lower_quartile_eur: 2000000, upper_quartile_eur: 2500000 },
      { year: 2023, period: '2023-Q1', median_price_eur: 2550000, average_price_eur: 2600000, lower_quartile_eur: 2350000, upper_quartile_eur: 2800000 },
      { year: 2024, period: '2024-Q1', median_price_eur: 2750000, average_price_eur: 2800000, lower_quartile_eur: 2500000, upper_quartile_eur: 3100000 },
      { year: 2025, period: '2025-Q1', median_price_eur: 2850000, average_price_eur: 2920000, lower_quartile_eur: 2650000, upper_quartile_eur: 3200000 }
    ],
    auctions: [
      { id: 'auc-f40-1', variant_id: 'v-ferrari-f40', auction_house_name: "RM Sotheby's", auction_event_name: 'Monterey 2024', lot_number: '142', auction_date: '2024-08-17', country_code: 'US', estimate_low_eur: 2600000, estimate_high_eur: 3000000, hammer_price_eur: 2900000, sale_price_eur: 3245000, sold: true, mileage_km: 9400, chassis_number_masked: 'ZFFGJ34B000085***' },
      { id: 'auc-f40-2', variant_id: 'v-ferrari-f40', auction_house_name: 'Gooding & Company', auction_event_name: 'Pebble Beach 2023', lot_number: '038', auction_date: '2023-08-19', country_code: 'US', estimate_low_eur: 2400000, estimate_high_eur: 2800000, hammer_price_eur: 2700000, sale_price_eur: 3020000, sold: true, mileage_km: 4100, chassis_number_masked: 'ZFFGJ34B000088***' }
    ],
    listings: [
      { id: 'list-f40-1', partner_dealer_id: 'dlr-rome', partner_dealer_name: 'Autosport Classic Roma', dealer_city: 'Roma', dealer_country: 'IT', dealer_verified: true, variant_id: 'v-ferrari-f40', title: '1989 Ferrari F40 Non-Cat Non-Adjustable Classiche Certified', description_it: 'Esemplare immacolato con certificato Ferrari Classiche, soli 8.200 km da nuova. Serbatoi sostituiti nel 2024.', description_en: 'Immaculate European specimen with Ferrari Classiche certification, only 8,200 km from new.', price_eur: 2950000, mileage_km: 8200, registration_year: 1989, chassis_number_masked: 'ZFFGJ34B000084***', condition_grade: 'Mint / Concours', exterior_color: 'Rosso Corsa', interior_color: 'Stoffa Rossa Nomex', transmission_type: 'Manual', published_at: '2025-01-12', status: 'active', image_urls: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop'] }
    ],
    historical_events: [
      { id: 'ev-f40-launch', title_it: 'Presentazione ufficiale a Maranello', title_en: 'Official Unveiling at Maranello', description_it: 'Presentata da Enzo Ferrari l’21 luglio 1987.', description_en: 'Unveiled by Enzo Ferrari on July 21, 1987.', event_date: '1987-07-21', event_type: 'Launch', country_code: 'IT' }
    ]
  },
  {
    id: 'v-porsche-959',
    generation_id: 'gen-959',
    manufacturer_id: 'm-porsche',
    manufacturer_name: 'Porsche',
    model_name: '959',
    slug: 'porsche-959-komfort',
    variant_name: '959 Komfort',
    tier: 'Hero',
    category: 'Supercar',
    market_code: 'EUR-SPEC',
    model_year_from: 1986,
    model_year_to: 1988,
    steering_side: 'LHD',
    body_style: 'Coupe',
    limited_edition: true,
    numbered_series: true,
    production_total: 292,
    original_list_price_eur: 215000,
    data_status: 'demo',
    hero_image_url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop'
    ],
    engine: {
      id: 'eng-p959',
      manufacturer_id: 'm-porsche',
      engine_code: 'M959/50',
      family_name: 'Porsche Flat-6 Sequential Turbo',
      architecture: 'Flat-6 Air/Water Cooled',
      cylinders: 6,
      displacement_cc: 2849,
      aspiration: 'Twin-Turbocharged',
      fuel_type: 'Petrol',
      power_kw: 331,
      power_hp: 450,
      torque_nm: 500,
      compression_ratio: '8.3:1',
      redline_rpm: 7800
    },
    transmission: {
      id: 'trans-p959-6m',
      name: '6-Speed Manual G64 (Gelände + 5 speed)',
      type: 'Manual',
      gears: 6,
      manufacturer: 'Porsche / PSK',
      drivetrain: 'AWD',
      differential_type: 'Porsche Steuer-Kupplung (PSK) Active AWD'
    },
    specs: {
      kerb_weight_kg: 1450,
      length_mm: 4260,
      width_mm: 1840,
      height_mm: 1280,
      wheelbase_mm: 2300,
      top_speed_kph: 317,
      acceleration_0_100: 3.7,
      power_to_weight_hp_ton: 310,
      fuel_capacity_l: 85
    },
    scores: {
      collector_score: {
        overall_score: 97,
        rarity_weight: 96,
        historical_relevance: 99,
        desirability: 96,
        originality_typical: 94,
        technical_relevance: 100,
        brand_recognizability: 97,
        community_culture: 96
      },
      investment_score: {
        overall_score: 92,
        market_trend: 91,
        liquidity: 88,
        supply_scarcity: 95,
        international_demand: 94,
        inverse_volatility: 93,
        inverse_maintenance_cost: 75,
        comparable_stability: 95
      },
      rarity_score: 94,
      confidence_level: 'High'
    },
    current_median_price_eur: 2100000,
    price_change_1y_pct: 8.5,
    price_change_3y_pct: 34.0,
    liquidity_score: 82,
    volatility_score: 14,
    avg_days_on_market: 54,
    history_it: 'Sviluppata inizialmente per il Gruppo B nei rally, la 959 ha introdotto la trazione integrale attiva regolata da computer, turbocompressori sequenziali e sospensioni idrauliche ad altezza variabile.',
    history_en: 'Originally developed for Group B rally racing, the 959 introduced computer-controlled active AWD, sequential twin turbochargers, and hydraulic height-adjustable suspension.',
    designers: [
      { id: 'p-lapine', full_name: 'Anatole Lapine', nationality: 'DE', role: 'Designer', biography_it: 'Capo del design Porsche autore della 928 e dello stile aerodinamico della 959.', biography_en: 'Chief designer at Porsche who led the aerodynamic development of the 959.' }
    ],
    engineers: [
      { id: 'p-bez', full_name: 'Dr. Ulrich Bez', nationality: 'DE', role: 'Engineer', biography_it: 'Ingegnere capo del progetto 959 e futuro CEO di Aston Martin.', biography_en: 'Lead project engineer for the 959 and later CEO of Aston Martin.' }
    ],
    production_site: 'Zuffenhausen, Stuttgart (DE)',
    known_issues: [
      { component: 'Sistema di trazione integrata PSK', description_it: 'Sensori di pressione e centralina idraulica requisiscono competenze specialistiche Porsche Motorsport.', description_en: 'Complex PSK hydraulic control unit requires specialist Porsche Motorsport servicing.', estimated_fix_cost_eur: '25,000 - 40,000', severity: 'High' }
    ],
    maintenance_complexity: 'Very High',
    annual_est_maintenance_eur: 24000,
    youtube_video_ids: ['Q1c6l4mH1B8'],

    production_breakdown_notes_it: 'La Porsche 959 è stata prodotta in un totale di 337 esemplari tra il 1986 e il 1993: 292 vetture di serie (237 Komfort e 29 Sport/S), 37 prototipi e pre-serie, e 8 esemplari speciali riassemblati nel 1992/93 dalla fabbrica di Zuffenhausen con componenti e scocche di riserva.',
    production_breakdown_notes_en: 'The Porsche 959 saw a total production of 337 units between 1986 and 1993: 292 customer road cars (237 Komfort and 29 Sport), 37 prototypes/pre-series, and 8 late factory-built cars in 1992/93.',

    factory_colors: [
      { color_name: 'Guards Red (Indischrot)', hex_code: '#cc0000', is_standard_factory: true, notes_it: 'Colore iconico di lancio presente su circa il 35% della produzione.' },
      { color_name: 'Grand Prix White (Grandprixweiß)', hex_code: '#f8f9fa', is_standard_factory: true, notes_it: 'Tinta classica motorsport Porsche con interni in pelle coordinata.' },
      { color_name: 'Silver Metallic (Silbermetallic)', hex_code: '#c0c0c0', is_standard_factory: true, notes_it: 'Colore argento metallizzato ad alto contrasto aerodinamico.' },
      { color_name: 'Dark Blue / Metallic Black', hex_code: '#002040', is_standard_factory: true, notes_it: 'Tinte scure metallizzate speciali su ordinazione d’epoca.' }
    ],

    variant_editions: [
      {
        name: '959 Prototipi & Pre-serie (V/F-Series)',
        production_count: '37 esemplari',
        years: '1983 - 1985',
        power_hp: 450,
        description_it: 'Muli di prova aerodinamica e collaudi per il sistema di trazione integrale PSK in condizioni estreme.',
        description_en: 'Development test mules built to refine active AWD logic and high-speed stability.'
      },
      {
        name: '959 Komfort',
        production_count: '237 esemplari',
        years: '1986 - 1988',
        power_hp: 450,
        description_it: 'La versione di serie con dotazione di lusso: sospensioni idrauliche ad altezza e taratura regolabile, climatizzatore automatico, sedili in pelle ed insonorizzazione.',
        description_en: 'Standard luxury customer spec featuring hydraulic height-adjustable suspension, leather seats, and full sound insulation.'
      },
      {
        name: '959 Sport (S)',
        production_count: '29 esemplari',
        years: '1986 - 1988',
        power_hp: 450,
        description_it: 'Variante alleggerita di 100 kg. Sospensioni sportive fisse con ammortizzatori Bilstein, roll-bar posteriore integrato imbottito, priva di aria condizionata e alzacristalli elettrici.',
        description_en: '100 kg lighter road-legal track version with fixed sports suspension, rear roll cage, and cloth sport seats.'
      },
      {
        name: '959 Rally Paris-Dakar (Type 953/959)',
        production_count: '6 esemplari',
        years: '1985 - 1986',
        power_hp: 400,
        is_racing: true,
        description_it: 'Vettura da gara raid rialzata con serbatoi supplementari. Conquistò il 1° e 2° posto assoluto alla Parigi-Dakar 1986 con René Metge e Jacky Ickx.',
        description_en: 'High-clearance rally raid machine that claimed a legendary 1-2 victory at the 1986 Paris-Dakar Rally.'
      },
      {
        name: '959 Late Factory Re-issue',
        production_count: '8 esemplari',
        years: '1992 - 1993',
        power_hp: 450,
        description_it: 'Ultimi 8 esemplari assemblati a mano nel reparto Porsche Exclusive nel 1992/93 da scocche ricambio per collezionisti facoltosi.',
        description_en: 'Final 8 cars assembled by Porsche Exclusive in 1992/93 using remaining spare chassis shells.'
      }
    ],
    price_history: [
      { year: 2021, period: '2021-Q1', median_price_eur: 1550000, average_price_eur: 1600000, lower_quartile_eur: 1400000, upper_quartile_eur: 1750000 },
      { year: 2023, period: '2023-Q1', median_price_eur: 1850000, average_price_eur: 1900000, lower_quartile_eur: 1700000, upper_quartile_eur: 2050000 },
      { year: 2025, period: '2025-Q1', median_price_eur: 2100000, average_price_eur: 2150000, lower_quartile_eur: 1950000, upper_quartile_eur: 2300000 }
    ],
    auctions: [],
    listings: [],
    historical_events: []
  },
  {
    id: 'v-mclaren-f1',
    generation_id: 'gen-mclaren-f1',
    manufacturer_id: 'm-mclaren',
    manufacturer_name: 'McLaren',
    model_name: 'F1',
    slug: 'mclaren-f1',
    variant_name: 'F1 Road Car',
    tier: 'Hero',
    category: 'Hypercar',
    market_code: 'GLOBAL',
    model_year_from: 1992,
    model_year_to: 1998,
    steering_side: 'Both', // Central driving position
    body_style: 'Three-Seater Coupe',
    limited_edition: true,
    numbered_series: true,
    production_total: 106,
    original_list_price_eur: 750000,
    data_status: 'demo',
    hero_image_url: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1621135802920-133df287f89c?w=1200&auto=format&fit=crop'
    ],
    engine: {
      id: 'eng-bmw-s70',
      manufacturer_id: 'm-bmw',
      engine_code: 'BMW S70/2 V12',
      family_name: 'BMW M V12',
      architecture: '60° V12',
      cylinders: 12,
      displacement_cc: 6064,
      aspiration: 'Naturally Aspirated',
      fuel_type: 'Petrol',
      power_kw: 461,
      power_hp: 627,
      torque_nm: 650,
      redline_rpm: 7500
    },
    transmission: {
      id: 'trans-mclaren-6m',
      name: '6-Speed Transverse Manual',
      type: 'Manual',
      gears: 6,
      manufacturer: 'Weismann',
      drivetrain: 'RWD'
    },
    specs: {
      kerb_weight_kg: 1138,
      length_mm: 4288,
      width_mm: 1820,
      height_mm: 1140,
      wheelbase_mm: 2718,
      top_speed_kph: 386.4,
      acceleration_0_100: 3.2,
      power_to_weight_hp_ton: 550,
      fuel_capacity_l: 90
    },
    scores: {
      collector_score: {
        overall_score: 100,
        rarity_weight: 99,
        historical_relevance: 100,
        desirability: 100,
        originality_typical: 98,
        technical_relevance: 100,
        brand_recognizability: 100,
        community_culture: 100
      },
      investment_score: {
        overall_score: 99,
        market_trend: 98,
        liquidity: 95,
        supply_scarcity: 100,
        international_demand: 100,
        inverse_volatility: 98,
        inverse_maintenance_cost: 60,
        comparable_stability: 98
      },
      rarity_score: 99,
      confidence_level: 'High'
    },
    current_median_price_eur: 20500000,
    price_change_1y_pct: 15.1,
    price_change_3y_pct: 62.0,
    liquidity_score: 90,
    volatility_score: 10,
    avg_days_on_market: 30,
    history_it: 'Creata da Gordon Murray con telaio monoscocca interamente in fibra di carbonio e vano motore rivestito in foglia d’oro 24k. Detiene ancora il record mondiale come auto aspirata di produzione più veloce del mondo (386,4 km/h). Vincitrice assoluta della 24 Ore di Le Mans 1995.',
    history_en: 'Designed by Gordon Murray featuring a full carbon-fiber monocoque and 24k gold leaf engine bay heat shielding. Still holds the world record as the fastest naturally aspirated production car in history (386.4 km/h / 240.1 mph). Winner of the 1995 24 Hours of Le Mans.',
    designers: [
      { id: 'p-murray', full_name: 'Gordon Murray', nationality: 'GB', role: 'Designer', biography_it: 'Progettista leggendario di F1 e creatore della McLaren F1 e della GMA T.50.', biography_en: 'Legendary F1 designer and creator of the McLaren F1 and GMA T.50.' },
      { id: 'p-stevens', full_name: 'Peter Stevens', nationality: 'GB', role: 'Designer', biography_it: 'Stilista della carrozzeria esterna della McLaren F1 e della Jaguar XJR-15.', biography_en: 'Exterior stylist of the McLaren F1 and Jaguar XJR-15.' }
    ],
    engineers: [
      { id: 'p-rosche', full_name: 'Paul Rosche', nationality: 'DE', role: 'Engineer', biography_it: 'Capo dei motori BMW M, progettista del V12 S70/2.', biography_en: 'BMW M engine chief and designer of the atmospheric S70/2 V12.' }
    ],
    production_site: 'Woking, Surrey (GB)',
    known_issues: [
      { component: 'Cella di sicurezza serbatoio carburante', description_it: 'Revisione o sostituzione quinquennale direttamente in McLaren Special Operations (MSO).', description_en: '5-year mandatory fuel cell service directly handled by MSO.', estimated_fix_cost_eur: '80,000 - 120,000', severity: 'High' }
    ],
    maintenance_complexity: 'Very High',
    annual_est_maintenance_eur: 55000,
    youtube_video_ids: ['3Xo_P6H4Fco'],

    production_breakdown_notes_it: 'La McLaren F1 è stata prodotta in un totale di soli 106 esemplari tra il 1992 e il 1998 a Woking. La produzione si articola in 64 vetture stradali di serie, 5 prototipi stradali (XP1-XP5), 28 varianti da competizione GTR, 5 F1 LM (serie celebrativa per la vittoria a Le Mans), 3 F1 GT (omologazione Longtail) e 1 prototipo LM (XP1 LM).',
    production_breakdown_notes_en: 'The McLaren F1 saw a total production of just 106 chassis between 1992 and 1998 in Woking: 64 road production cars, 5 road prototypes (XP1-XP5), 28 GTR race cars, 5 F1 LM specials, 3 F1 GT road cars, and 1 LM prototype (XP1 LM).',

    factory_colors: [
      { color_name: 'Magnesium Silver', hex_code: '#d1d5db', is_standard_factory: true, notes_it: 'Colore di presentazione ufficiale e scelto personalmente da Gordon Murray per i test ad alta velocità.' },
      { color_name: 'Papaya Orange (Historic McLaren Orange)', hex_code: '#ff6600', is_standard_factory: true, notes_it: 'Tinta storica McLaren usata esclusivamente per le 5 F1 LM e la XP1 LM.' },
      { color_name: 'Jet Black / Genesis Blue / Cobalt Metallic', hex_code: '#1e293b', is_standard_factory: true, notes_it: 'Verniciature individuali personalizzate su specifica MSO per i 64 clienti stradali.' }
    ],

    variant_editions: [
      {
        name: 'Prototipi Stradali XP (XP1, XP2, XP3, XP4, XP5)',
        production_count: '5 esemplari',
        years: '1992 - 1993',
        power_hp: 627,
        description_it: 'Prototipi di sviluppo guidati da Gordon Murray. XP5 è l’esemplare che registrò il record del mondo di velocità a 386.4 km/h sul circuito di Ehra-Lessien.',
        description_en: 'Road testing prototypes. XP5 achieved the legendary 386.4 km/h (240.1 mph) world record at Ehra-Lessien.'
      },
      {
        name: 'F1 Road Car (Stradale Standard)',
        production_count: '64 esemplari',
        years: '1993 - 1998',
        power_hp: 627,
        description_it: 'Versione stradale con posto di guida centrale triposto, vano motore in foglia d’oro 24k e telaio monoscocca interamente in fibra di carbonio.',
        description_en: 'Standard customer road specification featuring central driver position, 24k gold leaf engine bay lining, and full carbon chassis.'
      },
      {
        name: 'F1 GTR 1995 & 1996 (Racing Spec)',
        production_count: '28 esemplari',
        years: '1995 - 1996',
        power_hp: 600,
        is_racing: true,
        description_it: 'Sviluppata per i clienti privati per correre nella categoria GT1. Conquistò una clamorosa vittoria assoluta alla 24 Ore di Le Mans 1995.',
        description_en: 'Customer GT1 race car that scored an astonishing overall victory at the 1995 24 Hours of Le Mans.'
      },
      {
        name: 'F1 LM (Le Mans)',
        production_count: '5 esemplari + 1 XP1 LM',
        years: '1996',
        power_hp: 680,
        description_it: 'Costruita per celebrare le 5 F1 GTR arrivate al traguardo a Le Mans 1995. Peso ridotto a 1.062 kg, motore V12 privo di strozzature da gara da 680 CV, colore Papaya Orange.',
        description_en: 'Ultra-exclusive series celebrating Le Mans victory. 1,062 kg dry weight, unrestricted 680 HP V12, and iconic Papaya Orange paint.'
      },
      {
        name: 'F1 GT (Longtail Stradale)',
        production_count: '3 esemplari (1 XP GT + 2 serie)',
        years: '1997',
        power_hp: 627,
        description_it: 'Variante "Longtail" con coda allungata e frontale aerodinamico ampliato creata per omologare la nuova F1 GTR ’97 alle regole FIA GT.',
        description_en: 'Extended tail road car built to homologate the revised aerodynamic bodywork for the 1997 FIA GT championship.'
      },
      {
        name: 'F1 GTR 1997 "Longtail"',
        production_count: '10 esemplari',
        years: '1997',
        power_hp: 600,
        is_racing: true,
        description_it: 'Evoluzione estrema della GTR da gara con carrozzeria Longtail allungata, cambio sequenziale Xtrac e carico aerodinamico incrementato.',
        description_en: 'Final evolution race car featuring extended Longtail aero, Xtrac sequential gearbox, and massive downforce.'
      }
    ],
    price_history: [
      { year: 2021, period: '2021-Q1', median_price_eur: 16000000, average_price_eur: 16500000, lower_quartile_eur: 15000000, upper_quartile_eur: 18000000 },
      { year: 2025, period: '2025-Q1', median_price_eur: 20500000, average_price_eur: 21000000, lower_quartile_eur: 19000000, upper_quartile_eur: 23000000 }
    ],
    auctions: [],
    listings: [],
    historical_events: []
  },
  {
    id: 'v-lancia-delta-evo',
    generation_id: 'gen-lancia-delta',
    manufacturer_id: 'm-lancia',
    manufacturer_name: 'Lancia',
    model_name: 'Delta HF Integrale',
    slug: 'lancia-delta-hf-integrale-evoluzione',
    variant_name: 'Evoluzione I (Evo 1) 16V',
    tier: 'Hero',
    category: 'Youngtimer',
    market_code: 'EUR-SPEC',
    model_year_from: 1991,
    model_year_to: 1992,
    steering_side: 'LHD',
    body_style: '5-Door Hatchback',
    limited_edition: true,
    numbered_series: false,
    production_total: 5171,
    original_list_price_eur: 32000,
    data_status: 'demo',
    hero_image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop'
    ],
    engine: {
      id: 'eng-lampredi-20t',
      manufacturer_id: 'm-lancia',
      engine_code: 'Lampredi 2.0 16V Turbo',
      family_name: 'Fiat Lampredi DOHC',
      architecture: 'Inline-4',
      cylinders: 4,
      displacement_cc: 1995,
      aspiration: 'Turbocharged',
      fuel_type: 'Petrol',
      power_kw: 154,
      power_hp: 210,
      torque_nm: 304,
      redline_rpm: 6500
    },
    transmission: {
      id: 'trans-delta-5m',
      name: '5-Speed Manual 4WD',
      type: 'Manual',
      gears: 5,
      manufacturer: 'Lancia / Ferguson',
      drivetrain: 'AWD',
      differential_type: 'Epicyclic center differential with Ferguson viscous coupling (47/53 split)'
    },
    specs: {
      kerb_weight_kg: 1300,
      length_mm: 3900,
      width_mm: 1770,
      height_mm: 1365,
      wheelbase_mm: 2480,
      top_speed_kph: 220,
      acceleration_0_100: 5.7,
      power_to_weight_hp_ton: 161,
      fuel_capacity_l: 57
    },
    scores: {
      collector_score: {
        overall_score: 93,
        rarity_weight: 85,
        historical_relevance: 98,
        desirability: 96,
        originality_typical: 88,
        technical_relevance: 92,
        brand_recognizability: 95,
        community_culture: 97
      },
      investment_score: {
        overall_score: 89,
        market_trend: 92,
        liquidity: 91,
        supply_scarcity: 84,
        international_demand: 90,
        inverse_volatility: 88,
        inverse_maintenance_cost: 80,
        comparable_stability: 90
      },
      rarity_score: 82,
      confidence_level: 'High'
    },
    current_median_price_eur: 115000,
    price_change_1y_pct: 11.2,
    price_change_3y_pct: 42.0,
    liquidity_score: 91,
    volatility_score: 22,
    avg_days_on_market: 28,
    history_it: 'Dominatrice assoluta del Campionato Mondiale Rally WRC per 6 titoli costruttori consecutivi (1987-1992). La versione Evoluzione I presentava carreggiate allargate, bombature aggressive sui passaruota e spoiler posteriore regolabile.',
    history_en: 'Undisputed champion of the World Rally Championship with 6 consecutive Constructors titles (1987-1992). The Evoluzione I featured wider track dimensions, aggressive box flares, and an adjustable roof spoiler.',
    designers: [
      { id: 'p-giugiaro', full_name: 'Giorgetto Giugiaro', nationality: 'IT', role: 'Designer', biography_it: 'Fondatore di Italdesign e stilista della Lancia Delta originaria.', biography_en: 'Founder of Italdesign and creator of the original Lancia Delta body.' }
    ],
    engineers: [
      { id: 'p-lampredi', full_name: 'Aurelio Lampredi', nationality: 'IT', role: 'Engineer', biography_it: 'Ingegnere leggendario creatore del bialbero Lampredi.', biography_en: 'Legendary engine designer and creator of the Lampredi twin-cam engine.' }
    ],
    production_site: 'Chivasso, Torino (IT)',
    known_issues: [
      { component: 'Incrinature telaio montanti A', description_it: 'Ispezionare i punti di saldatura dei duomi e montanti anteriori soggetti a torsioni rigide.', description_en: 'Inspect front chassis pillars and strut towers for stress cracks.', estimated_fix_cost_eur: '4,000 - 8,000', severity: 'Medium' }
    ],
    maintenance_complexity: 'Moderate',
    annual_est_maintenance_eur: 4200,
    youtube_video_ids: ['d0Ew_W2p0M8'],

    production_breakdown_notes_it: 'La Lancia Delta HF Integrale nelle sue varie evoluzioni (4WD, 8V, 16V, Evo 1, Evo 2) è stata prodotta in oltre 44.000 esemplari totali. La sola serie Evoluzione I (1991-1992) ammonta a 5.171 vetture di serie, affiancata dalle celebri edizioni limitate numerate (Martini 5, Martini 6, Verde Derby, Club Italia).',
    production_breakdown_notes_en: 'Total Lancia Delta HF Integrale production across all evolutions exceeds 44,000 units. The Evoluzione I (1991-1992) accounts for 5,171 standard cars plus highly sought-after numbered special series (Martini 5, Martini 6, Verde Derby, Club Italia).',

    factory_colors: [
      { color_name: 'Rosso Monza / Bianco Corsa', hex_code: '#cc0000', is_standard_factory: true, notes_it: 'Colori standard di lancio ufficiali Lancia rally.' },
      { color_name: 'Livrea Martini Racing (Martini 5 & 6)', hex_code: '#0284c7', is_standard_factory: true, notes_it: 'Fasce Martini Racing ufficiali applicate sulle fiancate delle edizioni celebrative WRC.' },
      { color_name: 'Verde Derby / Giallo Ginestra / Blu Madres', hex_code: '#15803d', is_standard_factory: true, notes_it: 'Tinte speciali esclusive per le edizioni limitate della serie Evoluzione.' }
    ],

    variant_editions: [
      {
        name: 'Delta HF 4WD',
        production_count: '9.982 esemplari',
        years: '1986 - 1987',
        power_hp: 165,
        description_it: 'La prima Delta a trazione integrale permanente con differenziale centrale Ferguson, capostipite del mito WRC.',
        description_en: 'The original 4WD Delta that laid the foundation for Lancia’s World Rally Championship reign.'
      },
      {
        name: 'Delta HF Integrale 8V',
        production_count: '9.841 esemplari',
        years: '1987 - 1989',
        power_hp: 185,
        description_it: 'Introduzione dei passaruota bombati e dell’intercooler maggiorato per dominare il Gruppo A.',
        description_en: 'Introduced wide box flared arches and larger intercooler for Group A competition.'
      },
      {
        name: 'Delta HF Integrale 16V',
        production_count: '12.860 esemplari',
        years: '1989 - 1991',
        power_hp: 200,
        description_it: 'Nuova testata a 16 valvole con rigonfiamento centrale sul cofano e ripartizione di coppia al 47% ant / 53% post.',
        description_en: '16-valve cylinder head, raised bonnet bulge, and rear-biased torque split.'
      },
      {
        name: 'Delta HF Integrale Evoluzione I (Evo 1) 16V',
        production_count: '5.171 esemplari',
        years: '1991 - 1992',
        power_hp: 210,
        description_it: 'Carreggiate extra-large (+54mm ant / +60mm post), spoiler regolabile sul tetto, sospensioni rinforzate e freni potenziati.',
        description_en: 'Widest track dimensions (+54mm front / +60mm rear), 3-position adjustable roof wing, and upgraded brakes.'
      },
      {
        name: 'Serie Speciali Evo 1 (Martini 5 & Martini 6)',
        production_count: '400 (Martini 5) + 310 (Martini 6)',
        years: '1992',
        power_hp: 210,
        description_it: 'Edizioni numerate per festeggiare il 5° e 6° Titolo Mondiale Costruttori WRC consecutivo, con livrea Martini Racing e sedili Recaro in ecopelle o Alcantara.',
        description_en: 'Numbered limited editions celebrating Lancia’s 5th and 6th consecutive WRC titles with Martini liveries.'
      },
      {
        name: 'Delta HF Integrale Evoluzione II (Evo 2) Kat',
        production_count: '4.223 esemplari',
        years: '1993 - 1994',
        power_hp: 215,
        description_it: 'Motore catalizzato con controllo elettronico Marelli IAW, cerchi in lega da 16" e sedili anatomici Recaro alti in Alcantara.',
        description_en: 'Catalyzed 215 HP edition with 16" wheels, high-back Recaro Alcantara bucket seats, and refined electronics.'
      }
    ],
    price_history: [
      { year: 2021, period: '2021-Q1', median_price_eur: 78000, average_price_eur: 82000, lower_quartile_eur: 68000, upper_quartile_eur: 92000 },
      { year: 2025, period: '2025-Q1', median_price_eur: 115000, average_price_eur: 122000, lower_quartile_eur: 98000, upper_quartile_eur: 138000 }
    ],
    auctions: [],
    listings: [],
    historical_events: []
  },
  {
    id: 'v-bugatti-eb110-gt',
    generation_id: 'gen-eb110',
    manufacturer_id: 'm-bugatti',
    manufacturer_name: 'Bugatti',
    model_name: 'EB110',
    slug: 'bugatti-eb110-gt',
    variant_name: 'EB110 GT',
    tier: 'Hero',
    category: 'Hypercar',
    market_code: 'EUR-SPEC',
    model_year_from: 1991,
    model_year_to: 1995,
    steering_side: 'LHD',
    body_style: 'Coupe',
    limited_edition: true,
    numbered_series: true,
    production_total: 95,
    original_list_price_eur: 285000,
    data_status: 'demo',
    hero_image_url: 'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=1200&auto=format&fit=crop',
    gallery_images: ['https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=1200&auto=format&fit=crop'],
    engine: {
      id: 'eng-b110-q35',
      manufacturer_id: 'm-bugatti',
      engine_code: '3.5 V12 60V Quad-Turbo',
      family_name: 'Campogalliano V12',
      architecture: '60° V12',
      cylinders: 12,
      displacement_cc: 3500,
      aspiration: 'Quad-Turbocharged',
      fuel_type: 'Petrol',
      power_kw: 412,
      power_hp: 560,
      torque_nm: 611,
      redline_rpm: 8250
    },
    transmission: {
      id: 'trans-eb110-6m',
      name: '6-Speed Manual AWD',
      type: 'Manual',
      gears: 6,
      manufacturer: 'Bugatti / Aerospatiale',
      drivetrain: 'AWD'
    },
    specs: {
      kerb_weight_kg: 1620,
      length_mm: 4400,
      width_mm: 1940,
      height_mm: 1125,
      wheelbase_mm: 2550,
      top_speed_kph: 342,
      acceleration_0_100: 3.4,
      power_to_weight_hp_ton: 345,
      fuel_capacity_l: 120
    },
    scores: {
      collector_score: {
        overall_score: 96,
        rarity_weight: 97,
        historical_relevance: 95,
        desirability: 96,
        originality_typical: 95,
        technical_relevance: 98,
        brand_recognizability: 97,
        community_culture: 94
      },
      investment_score: {
        overall_score: 93,
        market_trend: 94,
        liquidity: 86,
        supply_scarcity: 98,
        international_demand: 95,
        inverse_volatility: 91,
        inverse_maintenance_cost: 72,
        comparable_stability: 94
      },
      rarity_score: 97,
      confidence_level: 'High'
    },
    current_median_price_eur: 2150000,
    price_change_1y_pct: 14.8,
    price_change_3y_pct: 51.0,
    liquidity_score: 82,
    volatility_score: 16,
    avg_days_on_market: 48,
    history_it: 'Nata nello stabilimento di Campogalliano voluta da Romano Artioli per far rinascere Bugatti. Telaio monoscocca in carbonio Aerospatiale, 4 turbocompressori e trazione integrale permanente.',
    history_en: 'Born at the Campogalliano facility under Romano Artioli to revive Bugatti. Featured an Aerospatiale carbon monocoque chassis, quad turbochargers, and permanent all-wheel drive.',
    designers: [
      { id: 'p-gandini', full_name: 'Marcello Gandini', nationality: 'IT', role: 'Designer', biography_it: 'Geniale creatore della Miura, Countach, Stratos ed EB110.', biography_en: 'Genius designer of the Miura, Countach, Stratos, and original EB110 concept.' }
    ],
    engineers: [
      { id: 'p-materazzi-eb110', full_name: 'Nicola Materazzi', nationality: 'IT', role: 'Engineer', biography_it: 'Riprogettò il telaio in carbonio e affinò il motore quad-turbo.', biography_en: 'Redesigned the carbon chassis and perfected the quad-turbo V12.' }
    ],
    production_site: 'Campogalliano, Modena (IT)',
    known_issues: [
      { component: 'Manutenzione 4 turbocompressori IHI', description_it: 'Sincronizzazione della pressione di sovralimentazione richiede strumentazione dedicata.', description_en: 'Quad turbo pressure synchronization requires specialized Campogalliano factory tooling.', estimated_fix_cost_eur: '18,000 - 32,000', severity: 'High' }
    ],
    maintenance_complexity: 'Very High',
    annual_est_maintenance_eur: 22000,
    youtube_video_ids: ['x3U1fB8Vp9k'],
    price_history: [
      { year: 2021, period: '2021-Q1', median_price_eur: 1350000, average_price_eur: 1400000, lower_quartile_eur: 1200000, upper_quartile_eur: 1550000 },
      { year: 2025, period: '2025-Q1', median_price_eur: 2150000, average_price_eur: 2200000, lower_quartile_eur: 1950000, upper_quartile_eur: 2400000 }
    ],
    auctions: [],
    listings: [],
    historical_events: []
  },
  {
    id: 'v-bmw-m3-e30-sport-evo',
    generation_id: 'gen-bmw-e30',
    manufacturer_id: 'm-bmw',
    manufacturer_name: 'BMW',
    model_name: 'M3',
    slug: 'bmw-m3-e30-sport-evolution',
    variant_name: 'M3 Sport Evolution (Evo 3)',
    tier: 'Hero',
    category: 'Homologation Special',
    market_code: 'EUR-SPEC',
    model_year_from: 1990,
    model_year_to: 1990,
    steering_side: 'LHD',
    body_style: '2-Door Coupe',
    limited_edition: true,
    numbered_series: true,
    production_total: 600,
    original_list_price_eur: 43000,
    data_status: 'demo',
    hero_image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop',
    gallery_images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop'],
    engine: {
      id: 'eng-bmw-s14b25',
      manufacturer_id: 'm-bmw',
      engine_code: 'S14B25',
      family_name: 'BMW Motorsport Inline-4',
      architecture: 'Inline-4',
      cylinders: 4,
      displacement_cc: 2467,
      aspiration: 'Naturally Aspirated',
      fuel_type: 'Petrol',
      power_kw: 175,
      power_hp: 238,
      torque_nm: 240,
      redline_rpm: 7250
    },
    transmission: {
      id: 'trans-bmw-dogleg',
      name: '5-Speed Getrag 265 Dog-Leg Manual',
      type: 'Manual',
      gears: 5,
      manufacturer: 'Getrag',
      drivetrain: 'RWD'
    },
    specs: {
      kerb_weight_kg: 1200,
      length_mm: 4345,
      width_mm: 1680,
      height_mm: 1370,
      wheelbase_mm: 2565,
      top_speed_kph: 248,
      acceleration_0_100: 6.5,
      power_to_weight_hp_ton: 198,
      fuel_capacity_l: 62
    },
    scores: {
      collector_score: {
        overall_score: 95,
        rarity_weight: 92,
        historical_relevance: 98,
        desirability: 96,
        originality_typical: 92,
        technical_relevance: 93,
        brand_recognizability: 97,
        community_culture: 98
      },
      investment_score: {
        overall_score: 92,
        market_trend: 93,
        liquidity: 94,
        supply_scarcity: 89,
        international_demand: 96,
        inverse_volatility: 92,
        inverse_maintenance_cost: 88,
        comparable_stability: 92
      },
      rarity_score: 89,
      confidence_level: 'High'
    },
    current_median_price_eur: 240000,
    price_change_1y_pct: 9.8,
    price_change_3y_pct: 38.5,
    liquidity_score: 92,
    volatility_score: 18,
    avg_days_on_market: 32,
    history_it: 'L’espressione massima della M3 E30 creata per l’omologazione DTM. Motore portato a 2.5 litri, splitter anteriore e alettone posteriore regolabili su tre posizioni, finestrini alleggeriti.',
    history_en: 'The ultimate evolution of the E30 M3 built for DTM touring car homologation. Featured an enlarged 2.5L engine, 3-position adjustable front splitter and rear wing, and thinner glass.',
    designers: [
      { id: 'p-luthe', full_name: 'Claus Luthe', nationality: 'DE', role: 'Designer', biography_it: 'Capo del design BMW negli anni ’80 autore delle serie E30, E32, E34.', biography_en: 'BMW head of design in the 1980s behind the E30, E32, and E34 styling.' }
    ],
    engineers: [
      { id: 'p-rosche-s14', full_name: 'Paul Rosche', nationality: 'DE', role: 'Engineer', biography_it: 'Progettò il motore S14 in appena 14 giorni usando la testa a 4 valvole della M1 su blocco 4 cilindri.', biography_en: 'Engineered the S14 motor in 14 days by marrying the M1 cylinder head tech to a 4-cylinder block.' }
    ],
    production_site: 'Regensburg (DE)',

    variant_editions: [
      // G80 / G81 Generation
      {
        generation_code: 'G80/G81',
        name: 'M3 G80 Standard Manual',
        production_count: 'In produzione',
        years: '2020 – Oggi',
        power_hp: 480,
        torque_nm: 550,
        acceleration_0_100: '4.2s',
        top_speed_kmh: 290,
        curb_weight_kg: 1705,
        transmission_info: 'Manuale 6 Marce',
        drivetrain: 'Trazione Posteriore (RWD)',
        engine_code: 'S58B30T0 Twin-Turbo 3.0L',
        body_style: 'Sedan',
        collector_score: 80,
        investment_score: 81,
        price_range_eur: '€80,000 - €98,000',
        median_price_eur: 88000,
        image_url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop',
        description_it: 'L’unica M3 G80 a mantenere il cambio manuale a 6 rapporti purissimo con trazione posteriore.',
        description_en: 'The pure manual 6-speed specification of the G80 M3 sending 480 HP exclusively to the rear wheels.',
        key_features: ['Cambio Manuale 6M', '480 CV S58 Twin-Turbo', 'Trazione Posteriore', 'Sedili M Carbon (Opt)']
      },
      {
        generation_code: 'G80/G81',
        name: 'M3 G80 Competition / Competition xDrive',
        production_count: 'In produzione',
        years: '2021 – Oggi',
        power_hp: 510,
        torque_nm: 650,
        acceleration_0_100: '3.5s',
        top_speed_kmh: 290,
        curb_weight_kg: 1780,
        transmission_info: '8-Speed M Steptronic Drivelogic',
        drivetrain: 'M xDrive AWD Selezionabile (RWD/4WD)',
        engine_code: 'S58B30T0 Twin-Turbo 3.0L',
        body_style: 'Sedan',
        collector_score: 83,
        investment_score: 84,
        price_range_eur: '€95,000 - €125,000',
        median_price_eur: 108000,
        image_url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop',
        description_it: 'Variante da 510 CV con cambio M Steptronic e trazione integrale intelligente M xDrive disinseribile.',
        description_en: '510 HP Competition specification with selectable M xDrive all-wheel drive for 3.5s 0-100 km/h launches.',
        key_features: ['510 CV / 650 Nm', 'M xDrive AWD Disinseribile', 'Cambio M Steptronic 8M', 'Impianto M Compound']
      },
      {
        generation_code: 'G80/G81',
        name: 'M3 Touring G81 Competition xDrive',
        production_count: 'In produzione di serie',
        years: '2022 – Oggi',
        power_hp: 510,
        torque_nm: 650,
        acceleration_0_100: '3.6s',
        top_speed_kmh: 280,
        curb_weight_kg: 1865,
        transmission_info: '8-Speed M Steptronic Drivelogic',
        drivetrain: 'M xDrive AWD Selezionabile',
        engine_code: 'S58B30T0 Twin-Turbo 3.0L',
        body_style: '5-Door Touring / Wagon',
        collector_score: 89,
        investment_score: 90,
        price_range_eur: '€105,000 - €145,000',
        median_price_eur: 122000,
        image_url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop',
        description_it: 'La prima storica M3 Station Wagon prodotta in serie da BMW M. Unisce prestazioni superlative e massima versatilità.',
        description_en: 'The historic first-ever official production M3 Touring wagon created by BMW M GmbH.',
        key_features: ['Prima M3 Station Wagon Ufficiale', '510 CV M xDrive', 'Bagagliaio 500L', 'Design G81 Esclusivo']
      },
      {
        generation_code: 'G80/G81',
        name: 'M3 CS G80 (Special Series)',
        production_count: '1,200 stimati',
        years: '2023 – 2024',
        power_hp: 550,
        torque_nm: 650,
        acceleration_0_100: '3.4s',
        top_speed_kmh: 302,
        curb_weight_kg: 1765,
        transmission_info: '8-Speed M Steptronic Drivelogic',
        drivetrain: 'M xDrive AWD Ritarato CS',
        engine_code: 'S58 High-Boost Twin-Turbo',
        body_style: 'Sedan Lightweight',
        collector_score: 93,
        investment_score: 91,
        price_range_eur: '€145,000 - €195,000',
        median_price_eur: 168000,
        image_url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop',
        description_it: 'Edizione speciale alleggerita di 20 kg con cofano in CFRP, 550 CV e calandra iconica bordeaux M4 CSL style.',
        description_en: '550 HP lightweight special edition with CFRP bonnet and titanium exhaust system.',
        key_features: ['550 CV S58 Engine', 'Scarico Titano M', 'Cofano Carbonio CFRP', '0-100 in 3.4s']
      },

      // F80 Generation
      {
        generation_code: 'F80',
        name: 'M3 F80 Standard',
        production_count: '28,000 ca.',
        years: '2014 – 2018',
        power_hp: 431,
        torque_nm: 550,
        acceleration_0_100: '4.1s',
        top_speed_kmh: 280,
        curb_weight_kg: 1520,
        transmission_info: 'Manuale 6M / DKG Doppia Frizione 7M',
        drivetrain: 'Trazione Posteriore (RWD) Diff. Attivo M',
        engine_code: 'S55B30 Biturbo 3.0L',
        body_style: '4-Door Saloon',
        collector_score: 82,
        investment_score: 83,
        price_range_eur: '€45,000 - €65,000',
        median_price_eur: 54000,
        image_url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&auto=format&fit=crop',
        description_it: 'Il debutto della sovralimentazione biturbo sul motore 6 cilindri S55 con albero di trasmissione in fibra di carbonio.',
        description_en: 'First turbo M3 featuring S55 3.0L twin-turbo inline 6 and carbon fiber driveshaft.',
        key_features: ['431 CV S55 Biturbo', 'Tetto in Carbonio CFRP', 'Differenziale M Attivo']
      },
      {
        generation_code: 'F80',
        name: 'M3 F80 Competition Package',
        production_count: '5,500 ca.',
        years: '2016 – 2018',
        power_hp: 450,
        torque_nm: 550,
        acceleration_0_100: '4.0s',
        top_speed_kmh: 280,
        curb_weight_kg: 1530,
        transmission_info: 'DKG 7M / Manuale 6M',
        drivetrain: 'Trazione Posteriore (RWD)',
        engine_code: 'S55B30 Competition Twin-Turbo',
        body_style: '4-Door Saloon',
        collector_score: 86,
        investment_score: 87,
        price_range_eur: '€58,000 - €85,000',
        median_price_eur: 68000,
        image_url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&auto=format&fit=crop',
        description_it: 'Pacchetto Competition con 450 CV, assetto Adaptive M ritarato, cerchi fucinati da 20" Styling 666M e scarico sportivo.',
        description_en: 'Competition package adding 450 HP, stiffer Adaptive M suspension, 20-inch 666M wheels, and loud sports exhaust.',
        key_features: ['450 CV S55', 'Cerchi 666M 20"', 'Sedili M con Intagli', 'Scarico Sportivo M']
      },
      {
        generation_code: 'F80',
        name: 'M3 F80 CS (Club Sport)',
        production_count: 1200,
        years: '2018',
        power_hp: 460,
        torque_nm: 600,
        acceleration_0_100: '3.9s',
        top_speed_kmh: 280,
        curb_weight_kg: 1515,
        transmission_info: 'DKG Doppia Frizione 7M',
        drivetrain: 'Trazione Posteriore (RWD)',
        engine_code: 'S55 CS High-Spec 3.0L',
        body_style: '4-Door Saloon Lightweight',
        collector_score: 92,
        investment_score: 91,
        price_range_eur: '€85,000 - €125,000',
        median_price_eur: 98000,
        image_url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&auto=format&fit=crop',
        description_it: 'Versione finale limitata a soli 1.200 esemplari con 460 CV, splitter anteriore e gurney flange posteriore in carbonio.',
        description_en: 'Limited run of 1,200 units with 460 HP, exposed carbon fiber aerodynamics and OLED taillights.',
        key_features: ['1,200 Unità Limitate', '460 CV / 600 Nm', 'Fari Posteriori OLED', 'Cofano in Carbonio CFRP']
      },

      // E90/E92/E93 Generation
      {
        generation_code: 'E90/E92/E93',
        name: 'M3 E92 Coupé V8 Aspirato',
        production_count: '40,092',
        years: '2007 – 2013',
        power_hp: 420,
        torque_nm: 400,
        acceleration_0_100: '4.6s',
        top_speed_kmh: 286,
        curb_weight_kg: 1580,
        transmission_info: 'Manuale 6M / DKG 7M Drivelogic',
        drivetrain: 'Trazione Posteriore (RWD)',
        engine_code: 'S65B40 4.0L V8 32V (8.400 rpm)',
        body_style: '2-Door Coupe',
        collector_score: 88,
        investment_score: 90,
        price_range_eur: '€38,000 - €65,000',
        median_price_eur: 48000,
        image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop',
        description_it: 'L’unica M3 a montare un motore V8 aspirato ad altissimo regime (8.400 giri/min) con 8 corpi farfallati singoli.',
        description_en: 'The legendary high-revving 8,400 RPM S65 V8 M3 coupe with carbon fiber roof.',
        key_features: ['Motore V8 S65 8.400 RPM', '8 Corpi Farfallati', 'Tetto in Carbonio', 'Campana Suono F1']
      },
      {
        generation_code: 'E90/E92/E93',
        name: 'M3 E90 Saloon V8',
        production_count: '9,674',
        years: '2008 – 2011',
        power_hp: 420,
        torque_nm: 400,
        acceleration_0_100: '4.7s',
        top_speed_kmh: 280,
        curb_weight_kg: 1605,
        transmission_info: 'Manuale 6M / DKG 7M',
        drivetrain: 'Trazione Posteriore (RWD)',
        engine_code: 'S65B40 4.0L V8',
        body_style: '4-Door Saloon',
        collector_score: 90,
        investment_score: 92,
        price_range_eur: '€42,000 - €75,000',
        median_price_eur: 55000,
        image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop',
        description_it: 'Rarissima variante berlina 4 porte della E90 V8, molto ricercata per la combinazione praticità/V8 aspirato.',
        description_en: 'Highly collectible 4-door saloon version of the V8 M3 produced in under 10k units globally.',
        key_features: ['Carrozzeria Berlina 4 Porte', 'Motore S65 V8', 'Prodotta in sole 9.674 Unità']
      },
      {
        generation_code: 'E90/E92/E93',
        name: 'M3 E92 GTS (4.4L V8 Track Special)',
        production_count: 135,
        years: '2010 – 2011',
        power_hp: 450,
        torque_nm: 440,
        acceleration_0_100: '4.4s',
        top_speed_kmh: 305,
        curb_weight_kg: 1530,
        transmission_info: 'DKG 7M Drivelogic Ritarato GTS',
        drivetrain: 'Trazione Posteriore (RWD) LSD',
        engine_code: 'S65B44 4.4L V8 Stroker',
        body_style: 'Track Coupe',
        collector_score: 98,
        investment_score: 97,
        price_range_eur: '€180,000 - €320,000',
        median_price_eur: 240000,
        image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop',
        is_racing: true,
        description_it: 'Vertice assoluto della generazione E92: motore V8 aumentato a 4.4 litri (450 CV), tinta Fire Orange, roll cage di fabbrica ed alettone regolabile.',
        description_en: 'Ultralight track homologation special with 4.4L 450 HP S65 V8, Fire Orange paint, roll cage, and adjustable rear wing.',
        key_features: ['135 Unità Prodotte', 'Motore 4.4L V8 450 CV', 'Tinta Fire Orange', 'Rollbar & Cinture 6 Punti']
      },

      // E46 Generation
      {
        generation_code: 'E46',
        name: 'M3 E46 Base (S54B32)',
        production_count: '84,361',
        years: '2000 – 2006',
        power_hp: 343,
        torque_nm: 365,
        acceleration_0_100: '5.2s',
        top_speed_kmh: 280,
        curb_weight_kg: 1495,
        transmission_info: 'Manuale 6M Getrag / SMG II Sequenziale 6M',
        drivetrain: 'Trazione Posteriore (RWD) M Variable Differential',
        engine_code: 'S54B32 3.2L 6-in-Linea Aspirato',
        body_style: '2-Door Coupe / Convertible',
        collector_score: 90,
        investment_score: 93,
        price_range_eur: '€38,000 - €70,000',
        median_price_eur: 52000,
        image_url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&auto=format&fit=crop',
        description_it: 'Icona intramontabile con motore 6 cilindri S54B32 a 8.000 giri/min, corpo farfallato per cilindro e differenziale autobloccante M.',
        description_en: 'The definitive classic M3 coupe powered by the legendary 8,000 RPM S54 6-cylinder engine.',
        key_features: ['Motore S54B32 343 CV', 'Regime a 8.000 RPM', 'Cofano in Alluminio con Powerdome']
      },
      {
        generation_code: 'E46',
        name: 'M3 E46 Competition Package (ZCP / CS)',
        production_count: '3,011',
        years: '2005 – 2006',
        power_hp: 343,
        torque_nm: 365,
        acceleration_0_100: '5.1s',
        top_speed_kmh: 280,
        curb_weight_kg: 1480,
        transmission_info: 'Manuale 6M / SMG II',
        drivetrain: 'Trazione Posteriore (RWD)',
        engine_code: 'S54B32 High-Rev',
        body_style: 'Coupe',
        collector_score: 94,
        investment_score: 95,
        price_range_eur: '€55,000 - €95,000',
        median_price_eur: 72000,
        image_url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&auto=format&fit=crop',
        description_it: 'Equipaggiata con scatola sterzo CSL più diretta (14.5:1), dischi freno CSL maggiorati, cerchi BBS 19" e modalità M Track Mode.',
        description_en: 'Equipped with CSL steering rack, CSL enlarged brakes, 19-inch BBS alloy wheels, and M Track Mode.',
        key_features: ['Scatola Sterzo CSL 14.5:1', 'Freni CSL Maggiorati', 'M Track Mode', 'Cerchi BBS 19" CSL-style']
      },
      {
        generation_code: 'E46',
        name: 'M3 E46 CSL (Coupe Sport Leichtbau)',
        production_count: 1383,
        years: '2003 – 2004',
        power_hp: 360,
        torque_nm: 370,
        acceleration_0_100: '4.9s',
        top_speed_kmh: 285,
        curb_weight_kg: 1385,
        transmission_info: 'SMG II Drivelogic Sequenziale 6M',
        drivetrain: 'Trazione Posteriore (RWD)',
        engine_code: 'S54B32HP Carbon Airbox 3.2L',
        body_style: 'Coupe Lightweight',
        collector_score: 98,
        investment_score: 97,
        price_range_eur: '€140,000 - €260,000',
        median_price_eur: 185000,
        image_url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&auto=format&fit=crop',
        description_it: 'Il capolavoro assoluto M3: 110 kg in meno rispetto all’E46 standard, airbox di aspirazione in fibra di carbonio dal suono mitico, tetto in carbonio e coda ad anatra integrata.',
        description_en: 'The holy grail E46 M3: 110 kg lighter, carbon fiber intake airbox with legendary sound, carbon roof, and integrated ducktail.',
        key_features: ['Airbox Aspirazione in Carbonio', 'Peso Ridotto a 1.385 kg', 'Tetto CFRP in Carbonio', 'Coda ad Anatra Ducktail']
      },

      // E36 Generation
      {
        generation_code: 'E36',
        name: 'M3 E36 3.0 (S50B30)',
        production_count: '28,686',
        years: '1992 – 1995',
        power_hp: 286,
        torque_nm: 320,
        acceleration_0_100: '6.0s',
        top_speed_kmh: 250,
        curb_weight_kg: 1460,
        transmission_info: 'Manuale 5M Getrag',
        drivetrain: 'Trazione Posteriore (RWD) LSD 25%',
        engine_code: 'S50B30 3.0L 24V Single-VANOS',
        body_style: 'Coupe / Saloon / Convertible',
        collector_score: 83,
        investment_score: 86,
        price_range_eur: '€30,000 - €50,000',
        median_price_eur: 38000,
        image_url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop',
        description_it: 'La prima M3 a 6 cilindri della storia, motore S50B30 da 286 CV e debutto del sistema di fasatura variabile VANOS.',
        description_en: 'First 6-cylinder M3 in history featuring 286 HP S50B30 engine and single VANOS variable valve timing.',
        key_features: ['Primo 6 Cilindri M3', 'Sistema Single-VANOS', 'Differenziale Autobloccante 25%']
      },
      {
        generation_code: 'E36',
        name: 'M3 E36 3.2 Evolution (S50B32)',
        production_count: '42,556',
        years: '1995 – 1999',
        power_hp: 321,
        torque_nm: 350,
        acceleration_0_100: '5.5s',
        top_speed_kmh: 250,
        curb_weight_kg: 1475,
        transmission_info: 'Manuale 6M Getrag / SMG I',
        drivetrain: 'Trazione Posteriore (RWD)',
        engine_code: 'S50B32 3.2L Double-VANOS',
        body_style: 'Coupe / Saloon',
        collector_score: 87,
        investment_score: 89,
        price_range_eur: '€38,000 - €70,000',
        median_price_eur: 48000,
        image_url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop',
        description_it: 'Evoluzione da 321 CV con motore S50B32 3.2L, cambio manuale a 6 marce, sistema Double-VANOS e freni anteriori in due pezzi.',
        description_en: '321 HP upgrade featuring 3.2L engine, 6-speed manual gearbox, Double-VANOS and 2-piece floating front brake discs.',
        key_features: ['321 CV Double-VANOS', 'Cambio 6 Marce', 'Freni Anteriori Flottanti']
      },
      {
        generation_code: 'E36',
        name: 'M3 E36 GT (Homologation Special)',
        production_count: 356,
        years: '1995',
        power_hp: 295,
        torque_nm: 323,
        acceleration_0_100: '5.9s',
        top_speed_kmh: 250,
        curb_weight_kg: 1430,
        transmission_info: 'Manuale 5M Getrag',
        drivetrain: 'Trazione Posteriore (RWD)',
        engine_code: 'S50B30GT High-Cam 3.0L',
        body_style: 'Coupe Lightweight',
        collector_score: 95,
        investment_score: 94,
        price_range_eur: '€85,000 - €150,000',
        median_price_eur: 115000,
        image_url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop',
        description_it: 'Edizione speciale prodotta in soli 356 esemplari in tinta British Racing Green per omologazione IMSA e GT europea.',
        description_en: 'Ultra-rare homologation special produced in 356 units finished exclusively in British Racing Green.',
        key_features: ['356 Unità Prodotte', 'Colore British Racing Green', 'Portiere in Alluminio', 'Alettone Posteriore GT Regolabile']
      },

      // E30 Generation
      {
        generation_code: 'E30',
        name: 'M3 E30 2.3 Base (195-200 CV)',
        production_count: '16,059',
        years: '1986 – 1989',
        power_hp: 200,
        torque_nm: 230,
        acceleration_0_100: '6.7s',
        top_speed_kmh: 235,
        curb_weight_kg: 1200,
        transmission_info: 'Manuale 5M Getrag 265 Dog-Leg',
        drivetrain: 'Trazione Posteriore (RWD) LSD 25%',
        engine_code: 'S14B23 2.3L 16V 4-Cilindri',
        body_style: '2-Door Coupe',
        collector_score: 93,
        investment_score: 91,
        price_range_eur: '€85,000 - €135,000',
        median_price_eur: 105000,
        image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop',
        description_it: 'La leggenda originale nata per omologare la M3 nei campionati turismo DTM e Gruppo A. Passaruota scatolati e cambio Dog-Leg.',
        description_en: 'The original legend created for Group A and DTM touring car homologation. Box flared arches and dog-leg gearbox.',
        key_features: ['Motore S14 4 Cilindri DTM', 'Cambio Getrag Dog-Leg (Prima in basso)', 'Passaruota Allargati Box-Flared']
      },
      {
        generation_code: 'E30',
        name: 'M3 E30 Evolution II (Evo 2)',
        production_count: 501,
        years: '1988',
        power_hp: 220,
        torque_nm: 245,
        acceleration_0_100: '6.5s',
        top_speed_kmh: 243,
        curb_weight_kg: 1180,
        transmission_info: 'Manuale 5M Getrag 265 Dog-Leg',
        drivetrain: 'Trazione Posteriore (RWD)',
        engine_code: 'S14B23 Evo2 2.3L',
        body_style: '2-Door Coupe Lightweight',
        collector_score: 96,
        investment_score: 95,
        price_range_eur: '€140,000 - €220,000',
        median_price_eur: 175000,
        image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop',
        description_it: 'Evoluzione omologativa limitata a 501 esemplari con 220 CV, pistoni ad alta compressione, spoiler anteriore e vetri alleggeriti.',
        description_en: 'Homologation special of 501 units featuring 220 HP, higher compression pistons, deeper front spoiler and thinner glass.',
        key_features: ['501 Unità Prodotte', '220 CV S14 Engine', 'Spoiler Anteriore e Posteriore Evo']
      },
      {
        generation_code: 'E30',
        name: 'M3 E30 Sport Evolution (Evo 3)',
        production_count: 600,
        years: '1990',
        power_hp: 238,
        torque_nm: 240,
        acceleration_0_100: '6.1s',
        top_speed_kmh: 248,
        curb_weight_kg: 1200,
        transmission_info: 'Manuale 5M Getrag 265 Dog-Leg',
        drivetrain: 'Trazione Posteriore (RWD)',
        engine_code: 'S14B25 2.5L 4-Cilindri DTM',
        body_style: '2-Door Coupe Motorsport',
        collector_score: 98,
        investment_score: 96,
        price_range_eur: '€180,000 - €320,000',
        median_price_eur: 240000,
        image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop',
        description_it: 'Il Sacro Graal della M3 E30: motore aumentato a 2.5L (238 CV), alettone e splitter regolabili su tre posizioni, prodotta in soli 600 esemplari.',
        description_en: 'The holy grail E30 M3: 2.5L S14 engine generating 238 HP, 3-position adjustable aerodynamic splitters, limited to 600 units.',
        key_features: ['600 Unità Prodotte', 'Motore 2.5L S14B25 238 CV', 'Alettone & Splitter Regolabili 3 Posizioni']
      }
    ],
    production_breakdown_notes_en: 'The BMW M3 lineage spans 6 legendary generations: E30 (S14 4-cylinder DTM homologation), E36 (S50 6-cylinder & saloon debut), E46 (S54 6-cylinder & iconic CSL), E90/E92/E93 (Formula 1 derived S65 V8), F80 (S55 Twin-Turbo) and G80/G81 (S58 Twin-Turbo with xDrive and first-ever M3 Touring).',

    generations_summary: [
      {
        generation_code: 'G80/G81',
        title: 'Sesta Generazione: BMW M3 G80 / G81',
        years: '2020 – Oggi',
        engine_summary: '3.0L 6 in Linea S58B30T0 Twin-Turbo (480 - 550 CV)',
        power_hp_range: '480 – 550 CV @ 6.250 rpm',
        torque_nm_range: '550 – 650 Nm @ 2.750-5.950 rpm',
        acceleration_0_100: '3.4s - 4.2s',
        top_speed_kmh: 290,
        curb_weight_kg_range: '1.705 - 1.865 kg',
        transmission_info: 'Manuale 6 Marce / M Steptronic 8M Drivelogic',
        drivetrain: 'Posteriore (RWD) / M xDrive AWD disinseribile',
        collector_score: 80,
        investment_score: 81,
        price_range_eur: '€80,000 - €185,000',
        median_price_eur: 105000,
        production_count: 'In produzione di serie',
        hero_image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop',
        gallery_images: [
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop'
        ],
        notes_it: 'Potenza fino a 550 CV, debutto della trazione integrale disinseribile M xDrive e della prima M3 Touring Station Wagon (G81).',
        notes_en: 'Up to 550 HP, introducing selectable M xDrive all-wheel-drive and the historic first-ever M3 Touring wagon (G81).'
      },
      {
        generation_code: 'F80',
        title: 'Quinta Generazione: BMW M3 F80',
        years: '2014 – 2018',
        engine_summary: '3.0L 6 in Linea S55B30 Biturbo (431 - 460 CV)',
        power_hp_range: '431 – 460 CV @ 5.500-7.300 rpm',
        torque_nm_range: '550 – 600 Nm @ 1.850-5.500 rpm',
        acceleration_0_100: '3.9s - 4.3s',
        top_speed_kmh: 280,
        curb_weight_kg_range: '1.520 - 1.585 kg',
        transmission_info: 'Manuale 6M / DKG Doppia Frizione 7M',
        drivetrain: 'Trazione Posteriore (RWD) con Differenziale Attivo M',
        collector_score: 82,
        investment_score: 83,
        price_range_eur: '€45,000 - €120,000',
        median_price_eur: 62000,
        production_count: '34,677 totali (1,200 CS)',
        hero_image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&auto=format&fit=crop',
        gallery_images: [
          'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=1200&auto=format&fit=crop'
        ],
        notes_it: 'Svolta verso la sovralimentazione biturbo, architettura alleggerita in CFRP e cambio DKG a doppia frizione 7 rapporti.',
        notes_en: 'Pioneered twin-turbocharging for M3, carbon-fiber reinforced plastic construction, and 7-speed DKG gearbox.'
      },
      {
        generation_code: 'E90/E92/E93',
        title: 'Quarta Generazione: BMW M3 E90 / E92 / E93',
        years: '2007 – 2013',
        engine_summary: '4.0L - 4.4L V8 Aspirato S65B40 / S65B44 (420 - 450 CV)',
        power_hp_range: '420 – 450 CV @ 8.300 rpm',
        torque_nm_range: '400 – 440 Nm @ 3.900 rpm',
        acceleration_0_100: '4.4s - 5.1s',
        top_speed_kmh: 290,
        curb_weight_kg_range: '1.530 - 1.810 kg',
        transmission_info: 'Manuale 6M / DKG Doppia Frizione 7M Drivelogic',
        drivetrain: 'Trazione Posteriore (RWD)',
        collector_score: 88,
        investment_score: 90,
        price_range_eur: '€35,000 - €280,000',
        median_price_eur: 58000,
        production_count: '65,966 totali (135 GTS)',
        hero_image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop',
        gallery_images: [
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop'
        ],
        notes_it: 'L’unica M3 della storia a montare un V8 aspirato ad altissimo regime (8.400 giri/min) derivato dall’esperienza BMW in Formula 1.',
        notes_en: 'The only V8-powered M3 in history featuring an F1-derived 8,400 RPM naturally aspirated S65 V8 engine.'
      },
      {
        generation_code: 'E46',
        title: 'Terza Generazione: BMW M3 E46',
        years: '2000 – 2006',
        engine_summary: '3.2L 6 in Linea Aspirato S54B32 (343 - 360 CV High-Rev)',
        power_hp_range: '343 – 360 CV @ 7.900 rpm',
        torque_nm_range: '365 – 370 Nm @ 4.900 rpm',
        acceleration_0_100: '4.9s - 5.5s',
        top_speed_kmh: 280,
        curb_weight_kg_range: '1.385 - 1.570 kg',
        transmission_info: 'Manuale 6M / SMG II Sequenziale 6M',
        drivetrain: 'Trazione Posteriore (RWD) M Variable Lock',
        collector_score: 92,
        investment_score: 94,
        price_range_eur: '€38,000 - €260,000',
        median_price_eur: 68000,
        production_count: '85,744 totali (1,383 CSL)',
        hero_image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&auto=format&fit=crop',
        gallery_images: [
          'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&auto=format&fit=crop'
        ],
        notes_it: 'Considerata una delle migliori sportive di tutti i tempi. Pluripremiato motore S54 a 8.000 giri/min, airbox in carbonio e vertice CSL.',
        notes_en: 'Regarded as one of the ultimate sports cars. Multi-award-winning 8,000 RPM S54 engine capped by the mythical CSL.'
      },
      {
        generation_code: 'E36',
        title: 'Seconda Generazione: BMW M3 E36',
        years: '1992 – 1999',
        engine_summary: '3.0L - 3.2L 6 in Linea S50 / S52 VANOS (286 - 321 CV)',
        power_hp_range: '286 – 321 CV @ 7.000 rpm',
        torque_nm_range: '320 – 350 Nm @ 3.250 rpm',
        acceleration_0_100: '5.5s - 6.0s',
        top_speed_kmh: 250,
        curb_weight_kg_range: '1.460 - 1.560 kg',
        transmission_info: 'Manuale 5M / 6M Getrag / SMG I',
        drivetrain: 'Trazione Posteriore (RWD) LSD 25%',
        collector_score: 84,
        investment_score: 88,
        price_range_eur: '€30,000 - €140,000',
        median_price_eur: 42000,
        production_count: '71,242 totali (356 GT)',
        hero_image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop',
        gallery_images: [
          'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop'
        ],
        notes_it: 'Segna il passaggio al motore 6 cilindri S50 e introduce per la prima volta la carrozzeria Berlina 4 porte e il cambio SMG.',
        notes_en: 'Introduced the iconic S50 6-cylinder engine, the first 4-door Saloon variant, and early SMG automated manual.'
      },
      {
        generation_code: 'E30',
        title: 'Prima Generazione: BMW M3 E30',
        years: '1986 – 1991',
        engine_summary: '2.3L - 2.5L 4 cilindri S14 Aspirato (195 - 238 CV)',
        power_hp_range: '195 – 238 CV @ 6.750 rpm',
        torque_nm_range: '230 – 240 Nm @ 4.750 rpm',
        acceleration_0_100: '6.1s - 6.9s',
        top_speed_kmh: 248,
        curb_weight_kg_range: '1.200 - 1.360 kg',
        transmission_info: 'Manuale 5M Getrag 265 "Dog-Leg"',
        drivetrain: 'Trazione Posteriore (RWD) LSD 25%',
        collector_score: 95,
        investment_score: 92,
        price_range_eur: '€85,000 - €320,000+',
        median_price_eur: 115000,
        production_count: '17,970 totali (1,311 Sport Evo / Evo)',
        hero_image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop',
        gallery_images: [
          'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop'
        ],
        notes_it: 'Icona assoluta del motorsport DTM e Gruppo A. Carrozzeria allargata con passaruota scatolati e telaio sviluppato da BMW Motorsport.',
        notes_en: 'Absolute DTM and Group A motorsport icon. Box flared arches and chassis engineered directly by BMW Motorsport.'
      }
    ],

    factory_colors: [
      { color_name: 'Brillantrot / Misano Rot', hex_code: '#dc2626', is_standard_factory: true, notes_it: 'Rosso di lancio della M3 E30 con pigmento lucido ad alto contrasto.' },
      { color_name: 'Alpinweiß II & III', hex_code: '#f8fafc', is_standard_factory: true, notes_it: 'Tinta Motorsport ufficiale utilizzata per le livree da corsa DTM.' },
      { color_name: 'Nogaro Silber / Lachssilber Metallic', hex_code: '#94a3b8', is_standard_factory: true, notes_it: 'Argento metallizzato riservato alla serie limitata Cecotto/Ravaglia.' },
      { color_name: 'Dakar Gelb / Laguna Seca Blau / Phoenix Gelb', hex_code: '#eab308', is_standard_factory: true, notes_it: 'Colori storici iconici introdotti sulle generazioni E36 ed E46.' },
      { color_name: 'Fire Orange (M3 GTS) & Isle of Man Green (G80)', hex_code: '#f97316', is_standard_factory: false, notes_it: 'Tinte d’impatto per le edizioni speciali GTS e la sesta generazione G80.' }
    ],

    extended_variant_editions: [
      // GENERATION 1: E30
      {
        name: 'M3 E30 (200 CV / 195 CV cat)',
        generation_code: 'E30',
        production_count: '17,970 esemplari (base)',
        years: '1986–1989',
        power_hp: 200,
        collector_score: 93,
        investment_score: 91,
        price_range_eur: '€85.000 - €120.000',
        engine_code: 'S14B23',
        body_style: 'Coupé 2 Porte',
        description_it: 'Motore 4 cil. S14B23 (2.3L). Prima versione stradale di serie creata per l’omologazione Gruppo A.',
        description_en: '2.3L S14B23 4-cylinder engine. Initial homologation road car.',
        key_features: ['S14B23 2.3L', '200 CV / 195 CV cat', 'Coupé 2 Porte', 'Dog-Leg Manual']
      },
      {
        name: 'M3 E30 Cabrio',
        generation_code: 'E30',
        production_count: '786 esemplari',
        years: '1988–1991',
        power_hp: 215,
        collector_score: 94,
        investment_score: 90,
        price_range_eur: '€95.000 - €150.000',
        engine_code: 'S14B23',
        body_style: 'Cabriolet',
        description_it: 'Carrozzeria Cabriolet con motore S14B23 2.3L. Prodotta in soli 786 esemplari assemblati a mano.',
        description_en: 'Convertible body style with 2.3L S14. Rare hand-assembled production run.',
        key_features: ['786 Esemplari', 'S14B23 2.3L', 'Cabriolet', 'Rarità Assoluta']
      },
      {
        name: 'M3 Evolution I (Evo 1)',
        generation_code: 'E30',
        production_count: '505 esemplari',
        years: '1987',
        power_hp: 200,
        collector_score: 96,
        investment_score: 93,
        price_range_eur: '€110.000 - €160.000',
        engine_code: 'S14B23 Evo',
        body_style: 'Coupé 2 Porte',
        description_it: 'Testata cilindri modificata e condotti d’aspirazione ottimizzati per l’omologazione agonistica.',
        description_en: 'Modified cylinder head for DTM competition homologation.',
        key_features: ['505 Esemplari', 'Testata Evo 1', 'Coupé', 'Omologazione DTM']
      },
      {
        name: 'M3 Evolution II (Evo 2)',
        generation_code: 'E30',
        production_count: '500 esemplari',
        years: '1988',
        power_hp: 220,
        collector_score: 97,
        investment_score: 95,
        price_range_eur: '€140.000 - €200.000',
        engine_code: 'S14B23 Evo II',
        body_style: 'Coupé 2 Porte',
        description_it: 'Motore S14 2.3L potenziato a 220 CV, spoiler anteriore maggiorato e alettone posteriore con flap.',
        description_en: '220 HP 2.3L S14 with enhanced aerodynamics and front splitter.',
        key_features: ['500 Esemplari', '220 CV', 'Aero Evo II', 'Pistoni Alleggeriti']
      },
      {
        name: 'M3 Sport Evolution (Evo 3)',
        generation_code: 'E30',
        production_count: '600 esemplari',
        years: '1989–1990',
        power_hp: 238,
        collector_score: 99,
        investment_score: 98,
        price_range_eur: '€220.000 - €320.000+',
        engine_code: 'S14B25',
        body_style: 'Coupé 2 Porte',
        description_it: 'Massima evoluzione E30. Motore S14B25 da 2.5 litri (238 CV), spoiler e alettone regolabili, vetri sottili.',
        description_en: 'Ultimate E30 spec. 2.5L S14B25 engine (238 HP), 3-position adjustable wings.',
        key_features: ['600 Esemplari', '2.5L S14B25', '238 CV', 'Spoiler Regolabile']
      },
      {
        name: 'M3 Cecotto / Ravaglia',
        generation_code: 'E30',
        production_count: '560 esemplari',
        years: '1989',
        power_hp: 215,
        collector_score: 95,
        investment_score: 93,
        price_range_eur: '€105.000 - €160.000',
        engine_code: 'S14B23',
        body_style: 'Coupé 2 Porte',
        description_it: 'Edizioni limitate dedicate ai piloti ufficiali Johnny Cecotto e Roberto Ravaglia con placca numerata.',
        description_en: 'Numbered limited editions honoring BMW factory racing champions.',
        key_features: ['215 CV', 'Placca Numerata', 'Cover Motore Rossa', 'Colori Dedicati']
      },

      // GENERATION 2: E36
      {
        name: 'M3 E36 3.0 (S50B30)',
        generation_code: 'E36',
        production_count: '28,686 esemplari',
        years: '1992–1995',
        power_hp: 286,
        collector_score: 83,
        investment_score: 86,
        price_range_eur: '€28.000 - €55.000',
        engine_code: 'S50B30',
        body_style: 'Coupé / Berlina / Cabrio',
        description_it: 'Passaggio al 6 cilindri in linea S50B30 da 3.0 litri con sistema VANOS (286 CV). Introduzione della Berlina.',
        description_en: 'Shift to 3.0L S50 6-cylinder with VANOS (286 HP). First 4-door Saloon.',
        key_features: ['3.0L S50B30', '286 CV', 'VANOS Singolo', 'Debutto Berlina']
      },
      {
        name: 'M3 E36 GT',
        generation_code: 'E36',
        production_count: '356 esemplari',
        years: '1994–1995',
        power_hp: 295,
        collector_score: 94,
        investment_score: 95,
        price_range_eur: '€85.000 - €140.000',
        engine_code: 'S50B30 GT',
        body_style: 'Coupé 2 Porte',
        description_it: 'Edizione limitata in colore British Racing Green con portiere in alluminio e alettone regolabile.',
        description_en: 'Homologation special in British Racing Green with aluminum doors and adjustable wing.',
        key_features: ['356 Esemplari', '295 CV', 'British Racing Green', 'Portiere Alluminio']
      },
      {
        name: 'M3 E36 3.2 Evolution (S50B32)',
        generation_code: 'E36',
        production_count: '42,556 esemplari',
        years: '1995–1999',
        power_hp: 321,
        collector_score: 86,
        investment_score: 89,
        price_range_eur: '€32.000 - €68.000',
        engine_code: 'S50B32',
        body_style: 'Coupé / Berlina / Cabrio',
        description_it: 'Motore S50B32 da 3.2L con Doppio VANOS, 321 CV e cambio manuale Getrag a 6 marce o SMG I.',
        description_en: '3.2L S50B32 engine with Double VANOS, 321 HP, and 6-speed manual or SMG I.',
        key_features: ['3.2L S50B32', '321 CV', 'Doppio VANOS', 'Cambio 6 Marce']
      },
      {
        name: 'M3 Lightweight (LTW)',
        generation_code: 'E36',
        production_count: '~125 esemplari',
        years: '1995',
        power_hp: 243,
        collector_score: 93,
        investment_score: 92,
        price_range_eur: '€90.000 - €160.000',
        engine_code: 'S50B30 / S52',
        body_style: 'Coupé US-Spec',
        description_it: 'Versione alleggerita creata esclusivamente per gli USA con livrea Motorsport e portiere in alluminio.',
        description_en: 'US-only lightweight track spec with Motorsport checkered flag graphics.',
        key_features: ['~125 Esemplari', '-91 kg', 'Livrea Motorsport', 'Portiere Alluminio']
      },

      // GENERATION 3: E46
      {
        name: 'M3 E46 (S54B32)',
        generation_code: 'E46',
        production_count: '84,361 esemplari',
        years: '2000–2006',
        power_hp: 343,
        collector_score: 91,
        investment_score: 93,
        price_range_eur: '€38.000 - €75.000',
        engine_code: 'S54B32',
        body_style: 'Coupé / Cabrio',
        description_it: 'Motore aspirato ad alti regimi S54B32 da 343 CV (8.000 rpm). Non è stata prodotta in versione Berlina.',
        description_en: 'High-revving 3.2L S54B32 343 HP engine. Offered strictly in Coupé and Convertible.',
        key_features: ['3.2L S54B32', '343 CV', 'Redline 8.000 RPM', 'Differenziale M Variable']
      },
      {
        name: 'M3 CSL (Coupe Sport Leichtbau)',
        generation_code: 'E46',
        production_count: '1.383 esemplari',
        years: '2003',
        power_hp: 360,
        collector_score: 98,
        investment_score: 97,
        price_range_eur: '€160.000 - €260.000+',
        engine_code: 'S54B32HP',
        body_style: 'Coupé Lightweight',
        description_it: 'Leggenda assoluta: tetto in fibra di carbonio, airbox in carbonio dall’inconfondibile rombo, -110 kg.',
        description_en: 'Iconic lightweight legend. Carbon fiber roof, carbon airbox intake, 110 kg weight reduction.',
        key_features: ['1.383 Esemplari', '360 CV', 'Tetto & Airbox Carbonio', '-110 kg']
      },
      {
        name: 'M3 Competition Package (ZCP / CS)',
        generation_code: 'E46',
        production_count: '3,011 esemplari',
        years: '2005–2006',
        power_hp: 343,
        collector_score: 93,
        investment_score: 94,
        price_range_eur: '€55.000 - €95.000',
        engine_code: 'S54B32',
        body_style: 'Coupé 2 Porte',
        description_it: 'Pacchetto dinamico con cerchi da 19" CSL, scatola sterzo più diretta, freni maggiorati e M-Track Mode.',
        description_en: 'Option package adding CSL 19" wheels, quicker steering rack, bigger brakes and M-Track mode.',
        key_features: ['Pacchetto ZCP', 'Sterzo & Freni CSL', 'M-Track Mode', 'Interlagos Blue']
      },
      {
        name: 'M3 GTR Stradale',
        generation_code: 'E46',
        production_count: '~10 esemplari',
        years: '2001',
        power_hp: 380,
        is_racing: true,
        collector_score: 99,
        investment_score: 99,
        price_range_eur: '€1.000.000+',
        engine_code: 'P60B40 V8',
        body_style: 'Coupé Homologation',
        description_it: 'Rarissima omologazione per l’American Le Mans Series (ALMS) con motore V8 4.0L P60B40 prodotta in una manciata di unità.',
        description_en: 'Ultra-rare ALMS race homologation car fitted with a 4.0L P60B40 V8 engine.',
        key_features: ['~10 Esemplari', 'V8 P60B40 4.0L', 'Homologation ALMS', 'Scarichi Laterali']
      },

      // GENERATION 4: E90 / E92 / E93
      {
        name: 'M3 E90 Berlina',
        generation_code: 'E90/E92/E93',
        production_count: '9,674 esemplari',
        years: '2008–2011',
        power_hp: 420,
        collector_score: 87,
        investment_score: 90,
        price_range_eur: '€38.000 - €65.000',
        engine_code: 'S65B40',
        body_style: 'Berlina 4 Porte',
        description_it: 'Ritorno della carrozzeria 4 porte dotata del motore V8 aspirato S65B40 da 4.0L derivato dalla F1 (8.400 rpm).',
        description_en: '4-door saloon powered by the F1-derived 4.0L S65 V8 engine (8,400 rpm redline).',
        key_features: ['V8 S65B40 4.0L', '420 CV', '8.400 RPM Redline', 'Berlina 4 Porte']
      },
      {
        name: 'M3 E92 Coupé',
        generation_code: 'E90/E92/E93',
        production_count: '40,092 esemplari',
        years: '2007–2013',
        power_hp: 420,
        collector_score: 88,
        investment_score: 89,
        price_range_eur: '€35.000 - €70.000',
        engine_code: 'S65B40',
        body_style: 'Coupé 2 Porte',
        description_it: 'Variante Coupé con tetto in fibra di carbonio a vista di serie, cambio manuale a 6 marce o DKG a 7 rapporti.',
        description_en: 'Coupé model featuring standard exposed carbon fiber roof and 7-speed DKG dual-clutch transmission.',
        key_features: ['V8 S65B40 4.0L', 'Tetto Carbonio', '420 CV', 'Cambio DKG 7M']
      },
      {
        name: 'M3 E93 Cabrio',
        generation_code: 'E90/E92/E93',
        production_count: '16,200 esemplari',
        years: '2008–2013',
        power_hp: 420,
        collector_score: 82,
        investment_score: 84,
        price_range_eur: '€30.000 - €55.000',
        engine_code: 'S65B40',
        body_style: 'Cabrio Hardtop',
        description_it: 'Variante cabriolet con tetto rigido ripiegabile in metallo a 3 elementi.',
        description_en: 'Convertible variant with 3-piece folding hardtop metal roof.',
        key_features: ['V8 S65B40', 'Hardtop Metallo', '420 CV', 'Open Air V8']
      },
      {
        name: 'M3 GTS (E92)',
        generation_code: 'E90/E92/E93',
        production_count: '135 esemplari',
        years: '2010',
        power_hp: 450,
        is_racing: true,
        collector_score: 97,
        investment_score: 96,
        price_range_eur: '€180.000 - €280.000',
        engine_code: 'S65B44',
        body_style: 'Coupé Track-Tool',
        description_it: 'Pronto corsa da 4.4L V8 (450 CV), tinta Arancio Fire, roll-bar, alettone regolabile e freni carboceramici.',
        description_en: 'Track-focused 4.4L V8 (450 HP) in Fire Orange with roll cage and carbon wing.',
        key_features: ['135 Esemplari', 'V8 4.4L (450 CV)', 'Fire Orange', 'Freni Carboceramici']
      },
      {
        name: 'M3 CRT (Carbon Racing Tech - E90)',
        generation_code: 'E90/E92/E93',
        production_count: '67 esemplari',
        years: '2011',
        power_hp: 450,
        collector_score: 96,
        investment_score: 95,
        price_range_eur: '€160.000 - €240.000',
        engine_code: 'S65B44',
        body_style: 'Berlina Lightweight',
        description_it: 'Edizione ultraleggera su base Berlina con componenti in carbonio a nido d’ape e motore V8 4.4L della GTS.',
        description_en: 'Ultra-lightweight saloon utilizing honeycomb carbon components and 4.4L V8 GTS engine.',
        key_features: ['67 Esemplari', '450 CV', 'Carbonio CRT', 'Frozen Polar Silver']
      },

      // GENERATION 5: F80
      {
        name: 'M3 F80 Berlina',
        generation_code: 'F80',
        production_count: '34,677 esemplari',
        years: '2014–2018',
        power_hp: 431,
        collector_score: 81,
        investment_score: 83,
        price_range_eur: '€45.000 - €70.000',
        engine_code: 'S55B30',
        body_style: 'Berlina 4 Porte',
        description_it: 'Abbandona l’aspirato per il 6 cilindri in linea Biturbo S55B30 da 431 CV. Le coupé e cabrio diventano F82/F83 M4.',
        description_en: 'Adopts 3.0L S55 Twin-Turbo 6-cylinder (431 HP). Coupés rebranded as F82 M4.',
        key_features: ['S55B30 Biturbo', '431 CV', 'Cambio DKG 7 Marce', 'Tetto Carbonio']
      },
      {
        name: 'M3 Competition Package (F80)',
        generation_code: 'F80',
        production_count: '12,000+ esemplari',
        years: '2016–2018',
        power_hp: 450,
        collector_score: 84,
        investment_score: 85,
        price_range_eur: '€52.000 - €80.000',
        engine_code: 'S55B30 Comp',
        body_style: 'Berlina 4 Porte',
        description_it: 'Potenza elevata a 450 CV, cerchi M da 20" forgiati, assetto adattivo M e scarico sportivo.',
        description_en: 'Power boosted to 450 HP, 20" forged wheels, revised M adaptive suspension and sports exhaust.',
        key_features: ['450 CV', 'Cerchi 20" Forgiati', 'Assetto Adapt M', 'Scarico M Sport']
      },
      {
        name: 'M3 CS (Club Sport - F80)',
        generation_code: 'F80',
        production_count: '1,200 esemplari',
        years: '2018',
        power_hp: 460,
        collector_score: 90,
        investment_score: 91,
        price_range_eur: '€80.000 - €120.000',
        engine_code: 'S55B30 CS',
        body_style: 'Berlina Track-Spec',
        description_it: 'Edizione limitata alleggerita da 460 CV con cofano e splitter in CFRP, freni carboceramici opzionali.',
        description_en: 'Lightweight track-focused edition producing 460 HP with CFRP bonnet and splitters.',
        key_features: ['1.200 Esemplari', '460 CV', 'CFRP Bonnet & Aero', 'OLED Rear Lights']
      },

      // GENERATION 6: G80 / G81
      {
        name: 'M3 G80 Standard (Manuale)',
        generation_code: 'G80/G81',
        production_count: 'In produzione',
        years: '2020–Oggi',
        power_hp: 480,
        collector_score: 80,
        investment_score: 81,
        price_range_eur: '€80.000 - €105.000',
        engine_code: 'S58B30T0',
        body_style: 'Berlina Manuale RWD',
        description_it: 'Motore Biturbo S58B30T0 da 480 CV, trazione posteriore e cambio manuale a 6 marce.',
        description_en: '480 HP S58 Twin-Turbo engine, rear-wheel drive and 6-speed manual transmission.',
        key_features: ['S58 3.0L Biturbo', '480 CV', 'Cambio Manuale 6M', 'Trazione Posteriore']
      },
      {
        name: 'M3 G80 Competition / xDrive',
        generation_code: 'G80/G81',
        production_count: 'In produzione',
        years: '2020–2024',
        power_hp: 510,
        collector_score: 81,
        investment_score: 81,
        price_range_eur: '€88.000 - €125.000',
        engine_code: 'S58B30T0 Comp',
        body_style: 'Berlina 4 Porte',
        description_it: '510 CV con cambio M Steptronic a 8 rapporti. Disponibile con la prima trazione integrale intelligente M xDrive disinseribile.',
        description_en: '510 HP with 8-speed M Steptronic. Introduces optional selectable M xDrive AWD system.',
        key_features: ['510 CV', 'M xDrive Disinseribile', 'M Steptronic 8M', 'Sedili Carbon Bucket']
      },
      {
        name: 'M3 Touring G81 (Competition xDrive)',
        generation_code: 'G80/G81',
        production_count: 'In produzione',
        years: '2022–Oggi',
        power_hp: 510,
        collector_score: 89,
        investment_score: 88,
        price_range_eur: '€98.000 - €140.000',
        engine_code: 'S58B30T0 Comp',
        body_style: 'Station Wagon (Touring)',
        description_it: 'La prima M3 Station Wagon ufficiale di serie della storia: 510 CV, trazione xDrive e praticità quotidiana.',
        description_en: 'First official production M3 Station Wagon in history: 510 HP, xDrive and family versatility.',
        key_features: ['Prima M3 Wagon', '510 CV xDrive', 'G81 Touring', 'Praticità Quotidiana']
      },
      {
        name: 'M3 CS G80 (Club Sport)',
        generation_code: 'G80/G81',
        production_count: '1,700-2,000 stimati',
        years: '2023–2024',
        power_hp: 550,
        collector_score: 92,
        investment_score: 90,
        price_range_eur: '€145.000 - €185.000',
        engine_code: 'S58B30T0 CS',
        body_style: 'Berlina Track-Spec',
        description_it: 'Versione ad altissime prestazioni da 550 CV con trazione M xDrive, dettagli in carbonio rossi e -20 kg.',
        description_en: 'Ultra performance 550 HP spec with M xDrive, red accent carbon details and 20 kg weight loss.',
        key_features: ['550 CV', 'M xDrive', 'Dettagli Carbonio Rossi', 'CFRP Roof & Bonnet']
      },
      {
        name: 'M3 G80 / G81 LCI (Facelift)',
        generation_code: 'G80/G81',
        production_count: 'In produzione',
        years: '2024–Oggi',
        power_hp: 530,
        collector_score: 82,
        investment_score: 82,
        price_range_eur: '€95.000 - €145.000',
        engine_code: 'S58 LCI',
        body_style: 'Berlina / Wagon',
        description_it: 'Restyling di metà carriera: i modelli Competition xDrive salgono a 530 CV con nuovi fari LED a matrice.',
        description_en: 'Mid-cycle facelift boosting Competition xDrive variants to 530 HP with new matrix LED lighting.',
        key_features: ['530 CV xDrive', 'Nuovi Fari LED', 'LCI Facelift', 'BMW Operating System 8.5']
      }
    ],
    known_issues: [
      { component: 'Tensor catena di distribuzione (E30 S14)', description_it: 'Aggiornare con il tensore di derivazione E36 M3 3.2 per prevenire usure.', description_en: 'Recommended upgrade to E36 M3 3.2 chain tensioner to avoid slack.', estimated_fix_cost_eur: '1,200 - 2,500', severity: 'Low' },
      { component: 'Bronzine di biella (E46 S54 & E90/E92 S65 V8)', description_it: 'Sostituzione preventiva delle bronzine di biella consigliata ogni 80.000 - 100.000 km.', description_en: 'Preventive rod bearing service recommended every 80,000 - 100,000 km on high-rev engines.', estimated_fix_cost_eur: '2,800 - 4,500', severity: 'High' }
    ],
    maintenance_complexity: 'Moderate',
    annual_est_maintenance_eur: 3800,
    youtube_video_ids: ['f3qB_7bA8S0'],
    price_history: [
      { year: 2021, period: '2021-Q1', median_price_eur: 165000, average_price_eur: 172000, lower_quartile_eur: 150000, upper_quartile_eur: 185000 },
      { year: 2025, period: '2025-Q1', median_price_eur: 240000, average_price_eur: 252000, lower_quartile_eur: 210000, upper_quartile_eur: 275000 }
    ],
    auctions: [],
    listings: [],
    historical_events: []
  },
  {
    id: 'v-mercedes-190e-evo2',
    generation_id: 'gen-merc-w201',
    manufacturer_id: 'm-mercedes',
    manufacturer_name: 'Mercedes-Benz',
    model_name: '190 E',
    slug: 'mercedes-benz-190-e-2-5-16-evolution-ii',
    variant_name: '2.5-16 Evolution II',
    tier: 'Hero',
    category: 'Homologation Special',
    market_code: 'EUR-SPEC',
    model_year_from: 1990,
    model_year_to: 1990,
    steering_side: 'LHD',
    body_style: '4-Door Sedan',
    limited_edition: true,
    numbered_series: true,
    production_total: 502,
    original_list_price_eur: 58000,
    data_status: 'demo',
    hero_image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&auto=format&fit=crop',
    gallery_images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&auto=format&fit=crop'],
    engine: {
      id: 'eng-m102-cosworth',
      manufacturer_id: 'm-mercedes',
      engine_code: 'M102.992 Cosworth 16V',
      family_name: 'Cosworth / Mercedes Inline-4',
      architecture: 'Inline-4',
      cylinders: 4,
      displacement_cc: 2463,
      aspiration: 'Naturally Aspirated',
      fuel_type: 'Petrol',
      power_kw: 173,
      power_hp: 235,
      torque_nm: 245,
      redline_rpm: 7700
    },
    transmission: {
      id: 'trans-getrag-getrag5',
      name: '5-Speed Getrag Dog-Leg Manual',
      type: 'Manual',
      gears: 5,
      manufacturer: 'Getrag',
      drivetrain: 'RWD'
    },
    specs: {
      kerb_weight_kg: 1340,
      length_mm: 4543,
      width_mm: 1720,
      height_mm: 1342,
      wheelbase_mm: 2665,
      top_speed_kph: 250,
      acceleration_0_100: 7.1,
      power_to_weight_hp_ton: 175,
      fuel_capacity_l: 70
    },
    scores: {
      collector_score: {
        overall_score: 94,
        rarity_weight: 93,
        historical_relevance: 96,
        desirability: 95,
        originality_typical: 93,
        technical_relevance: 92,
        brand_recognizability: 96,
        community_culture: 95
      },
      investment_score: {
        overall_score: 91,
        market_trend: 92,
        liquidity: 90,
        supply_scarcity: 92,
        international_demand: 94,
        inverse_volatility: 91,
        inverse_maintenance_cost: 82,
        comparable_stability: 92
      },
      rarity_score: 91,
      confidence_level: 'High'
    },
    current_median_price_eur: 320000,
    price_change_1y_pct: 10.5,
    price_change_3y_pct: 45.0,
    liquidity_score: 86,
    volatility_score: 16,
    avg_days_on_market: 40,
    history_it: 'Icona radicale del DTM presentata al Salone di Ginevra 1990. Caratterizzata dall’enorme alettone posteriore aerodinamico e cerchi in lega da 17 pollici. Testata in galleria del vento a Stoccarda.',
    history_en: 'Radical DTM icon introduced at the 1990 Geneva Motor Show. Features a massive wind-tunnel-tested rear wing aerodynamic kit and 17-inch alloy wheels.',
    designers: [
      { id: 'p-sacco', full_name: 'Bruno Sacco', nationality: 'IT', role: 'Designer', biography_it: 'Storico capo dello stile Mercedes-Benz per quasi tre decenni.', biography_en: 'Legendary Mercedes-Benz design director who defined the W201 platform.' }
    ],
    engineers: [
      { id: 'p-cosworth-eng', full_name: 'Cosworth Engineering', nationality: 'GB', role: 'Engineer', biography_it: 'Progettisti della testata a 16 valvole ad alto rendimento.', biography_en: 'Engineered the high-output 16-valve cylinder head technology.' }
    ],
    production_site: 'Bremen (DE)',
    known_issues: [
      { component: 'Sospensioni autolivellanti SLS idrauliche', description_it: 'Perdite d’olio dai puntoni e accumulatori di pressione richiedono revisione periodica.', description_en: 'Hydraulic SLS self-leveling suspension struts leak over time.', estimated_fix_cost_eur: '6,000 - 11,000', severity: 'Medium' }
    ],
    maintenance_complexity: 'High',
    annual_est_maintenance_eur: 5200,
    youtube_video_ids: ['4N3g8_y2WwE'],
    price_history: [
      { year: 2021, period: '2021-Q1', median_price_eur: 210000, average_price_eur: 220000, lower_quartile_eur: 190000, upper_quartile_eur: 245000 },
      { year: 2025, period: '2025-Q1', median_price_eur: 320000, average_price_eur: 335000, lower_quartile_eur: 290000, upper_quartile_eur: 360000 }
    ],
    auctions: [],
    listings: [],
    historical_events: []
  },
  {
    id: 'v-porsche-carrera-gt',
    generation_id: 'gen-carrera-gt',
    manufacturer_id: 'm-porsche',
    manufacturer_name: 'Porsche',
    model_name: 'Carrera GT',
    slug: 'porsche-carrera-gt',
    variant_name: 'Carrera GT V10',
    tier: 'Hero',
    category: 'Hypercar',
    market_code: 'GLOBAL',
    model_year_from: 2003,
    model_year_to: 2006,
    steering_side: 'Both',
    body_style: 'Roadster / Targa',
    limited_edition: true,
    numbered_series: true,
    production_total: 1270,
    original_list_price_eur: 452000,
    data_status: 'demo',
    hero_image_url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop',
    gallery_images: ['https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop'],
    engine: {
      id: 'eng-porsche-v10',
      manufacturer_id: 'm-porsche',
      engine_code: 'M80/01 V10',
      family_name: 'Porsche Le Mans V10',
      architecture: '68° V10',
      cylinders: 10,
      displacement_cc: 5733,
      aspiration: 'Naturally Aspirated',
      fuel_type: 'Petrol',
      power_kw: 450,
      power_hp: 612,
      torque_nm: 590,
      redline_rpm: 8400
    },
    transmission: {
      id: 'trans-cgt-6m',
      name: '6-Speed Manual with Ceramic Clutch (PCCC)',
      type: 'Manual',
      gears: 6,
      manufacturer: 'Porsche',
      drivetrain: 'RWD'
    },
    specs: {
      kerb_weight_kg: 1380,
      length_mm: 4613,
      width_mm: 1921,
      height_mm: 1166,
      wheelbase_mm: 2730,
      top_speed_kph: 330,
      acceleration_0_100: 3.9,
      power_to_weight_hp_ton: 443,
      fuel_capacity_l: 92
    },
    scores: {
      collector_score: {
        overall_score: 98,
        rarity_weight: 91,
        historical_relevance: 99,
        desirability: 100,
        originality_typical: 96,
        technical_relevance: 99,
        brand_recognizability: 99,
        community_culture: 98
      },
      investment_score: {
        overall_score: 95,
        market_trend: 96,
        liquidity: 93,
        supply_scarcity: 88,
        international_demand: 99,
        inverse_volatility: 92,
        inverse_maintenance_cost: 81,
        comparable_stability: 97
      },
      rarity_score: 88,
      confidence_level: 'High'
    },
    current_median_price_eur: 1450000,
    price_change_1y_pct: 13.8,
    price_change_3y_pct: 58.0,
    liquidity_score: 91,
    volatility_score: 17,
    avg_days_on_market: 35,
    history_it: 'Dotata di un motore V10 aspirato originariamente sviluppato per la 24 Ore di Le Mans e la Formula 1. Telaio monoscocca in carbonio, pomello del cambio in legno di balsa omaggio alla 917 e frizione carbo-ceramica PCCC.',
    history_en: 'Powered by a naturally aspirated V10 derived from a scrapped Le Mans and F1 racing engine program. Carbon fiber monocoque, beechwood gear knob referencing the 917, and PCCC ceramic clutch.',
    designers: [
      { id: 'p-harm-lagaay', full_name: 'Harm Lagaay', nationality: 'NL', role: 'Designer', biography_it: 'Capo del design Porsche creatore della Carrera GT e della 996.', biography_en: 'Head of Porsche design who led the Carrera GT style team.' }
    ],
    engineers: [
      { id: 'p-walter-rohrl', full_name: 'Walter Röhrl', nationality: 'DE', role: 'Test Driver', biography_it: 'Due volte campione del mondo rally e collaudatore di sviluppo della Carrera GT.', biography_en: 'Two-time World Rally Champion and primary development driver for the Carrera GT.' }
    ],
    production_site: 'Leipzig (DE)',
    known_issues: [
      { component: 'Frizione ceramica PCCC', description_it: 'Sostituzione frizione richiede calibrazione accurata e costo ricambio elevato.', description_en: 'Porsche Ceramic Composite Clutch requires gentle throttle technique and expensive replacement.', estimated_fix_cost_eur: '20,000 - 30,000', severity: 'High' }
    ],
    maintenance_complexity: 'Very High',
    annual_est_maintenance_eur: 16000,
    youtube_video_ids: ['mP9G1N88i0Q'],
    price_history: [
      { year: 2021, period: '2021-Q1', median_price_eur: 880000, average_price_eur: 920000, lower_quartile_eur: 800000, upper_quartile_eur: 1020000 },
      { year: 2025, period: '2025-Q1', median_price_eur: 1450000, average_price_eur: 1520000, lower_quartile_eur: 1300000, upper_quartile_eur: 1650000 }
    ],
    auctions: [],
    listings: [],
    historical_events: []
  },
  {
    id: 'v-ferrari-288-gto',
    generation_id: 'gen-288-gto',
    manufacturer_id: 'm-ferrari',
    manufacturer_name: 'Ferrari',
    model_name: '288 GTO',
    slug: 'ferrari-288-gto',
    variant_name: '288 GTO Berlinetta',
    tier: 'Hero',
    category: 'Supercar',
    market_code: 'EUR-SPEC',
    model_year_from: 1984,
    model_year_to: 1987,
    steering_side: 'LHD',
    body_style: 'Berlinetta',
    limited_edition: true,
    numbered_series: true,
    production_total: 272,
    original_list_price_eur: 140000,
    data_status: 'demo',
    hero_image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop',
    gallery_images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop'],
    engine: {
      id: 'eng-f114b',
      manufacturer_id: 'm-ferrari',
      engine_code: 'F114B V8 Twin-Turbo',
      family_name: 'Ferrari V8 Turbo',
      architecture: '90° Longitudinale V8',
      cylinders: 8,
      displacement_cc: 2855,
      aspiration: 'Twin-Turbocharged',
      fuel_type: 'Petrol',
      power_kw: 294,
      power_hp: 400,
      torque_nm: 496,
      redline_rpm: 7800
    },
    transmission: {
      id: 'trans-288-5m',
      name: '5-Speed Manual Transverse',
      type: 'Manual',
      gears: 5,
      manufacturer: 'Ferrari',
      drivetrain: 'RWD'
    },
    specs: {
      kerb_weight_kg: 1160,
      length_mm: 4290,
      width_mm: 1910,
      height_mm: 1120,
      wheelbase_mm: 2450,
      top_speed_kph: 305,
      acceleration_0_100: 4.9,
      power_to_weight_hp_ton: 344,
      fuel_capacity_l: 120
    },
    scores: {
      collector_score: {
        overall_score: 99,
        rarity_weight: 97,
        historical_relevance: 100,
        desirability: 99,
        originality_typical: 96,
        technical_relevance: 98,
        brand_recognizability: 100,
        community_culture: 98
      },
      investment_score: {
        overall_score: 96,
        market_trend: 96,
        liquidity: 92,
        supply_scarcity: 98,
        international_demand: 99,
        inverse_volatility: 95,
        inverse_maintenance_cost: 83,
        comparable_stability: 97
      },
      rarity_score: 96,
      confidence_level: 'High'
    },
    current_median_price_eur: 4200000,
    price_change_1y_pct: 11.8,
    price_change_3y_pct: 46.0,
    liquidity_score: 85,
    volatility_score: 12,
    avg_days_on_market: 38,
    history_it: 'Capostipite della stirpe delle 5 grandi supercar Ferrari moderne (288 GTO, F40, F50, Enzo, LaFerrari). Progettata per l’omologazione Gruppo B rally, fu la prima vettura stradale Ferrari a toccare i 300 km/h.',
    history_en: 'First of the 5 iconic halo supercars from Maranello (288 GTO, F40, F50, Enzo, LaFerrari). Designed for Group B rally homologation, it was the first Ferrari road car to break the 300 km/h barrier.',
    designers: [
      { id: 'p-fioravanti-288', full_name: 'Leonardo Fioravanti', nationality: 'IT', role: 'Designer', biography_it: 'Disegnò la carrozzeria allargata con fessure di ventilazione stile 250 GTO.', biography_en: 'Penned the widebody styling featuring 250 GTO style rear fender cooling slits.' }
    ],
    engineers: [
      { id: 'p-materazzi-288', full_name: 'Nicola Materazzi', nationality: 'IT', role: 'Engineer', biography_it: 'Montò il motore longitudinalmente con doppi turbo IHI e intercooler Behr.', biography_en: 'Mounted the V8 longitudinally with twin IHI turbos and Behr intercoolers.' }
    ],
    production_site: 'Maranello (IT)',
    known_issues: [
      { component: 'Tubazioni olio e carburante in gomma', description_it: 'Sostituzione con tubi moderni spec-Aeroquip per sicurezza antincendio.', description_en: 'Aeroquip fuel line upgrade recommended to prevent heat degradation.', estimated_fix_cost_eur: '12,000 - 18,000', severity: 'High' }
    ],
    maintenance_complexity: 'High',
    annual_est_maintenance_eur: 19000,
    youtube_video_ids: ['Y_kXp74Y4_I'],
    price_history: [
      { year: 2021, period: '2021-Q1', median_price_eur: 2800000, average_price_eur: 2900000, lower_quartile_eur: 2600000, upper_quartile_eur: 3100000 },
      { year: 2025, period: '2025-Q1', median_price_eur: 4200000, average_price_eur: 4350000, lower_quartile_eur: 3900000, upper_quartile_eur: 4600000 }
    ],
    auctions: [],
    listings: [],
    historical_events: []
  },
  {
    id: 'v-lamborghini-countach-5000qv',
    generation_id: 'gen-countach',
    manufacturer_id: 'm-lamborghini',
    manufacturer_name: 'Lamborghini',
    model_name: 'Countach',
    slug: 'lamborghini-countach-5000-qv',
    variant_name: '5000 Quattrovalvole (Carburatori Weber)',
    tier: 'Hero',
    category: 'Historic Classic',
    market_code: 'EUR-SPEC',
    model_year_from: 1985,
    model_year_to: 1988,
    steering_side: 'LHD',
    body_style: 'Coupe Scissors-Doors',
    limited_edition: true,
    numbered_series: false,
    production_total: 610,
    original_list_price_eur: 110000,
    data_status: 'demo',
    hero_image_url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1200&auto=format&fit=crop',
    gallery_images: ['https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=1200&auto=format&fit=crop'],
    engine: {
      id: 'eng-lambo-qv',
      manufacturer_id: 'm-lamborghini',
      engine_code: '5.2 V12 48V QV',
      family_name: 'Bizzarrini V12',
      architecture: '60° V12',
      cylinders: 12,
      displacement_cc: 5167,
      aspiration: 'Naturally Aspirated',
      fuel_type: 'Petrol',
      power_kw: 335,
      power_hp: 455,
      torque_nm: 500,
      redline_rpm: 7500
    },
    transmission: {
      id: 'trans-countach-5m',
      name: '5-Speed Manual Longitudinal',
      type: 'Manual',
      gears: 5,
      manufacturer: 'Lamborghini',
      drivetrain: 'RWD'
    },
    specs: {
      kerb_weight_kg: 1490,
      length_mm: 4140,
      width_mm: 2000,
      height_mm: 1070,
      wheelbase_mm: 2450,
      top_speed_kph: 295,
      acceleration_0_100: 4.8,
      power_to_weight_hp_ton: 305,
      fuel_capacity_l: 120
    },
    scores: {
      collector_score: {
        overall_score: 96,
        rarity_weight: 89,
        historical_relevance: 99,
        desirability: 98,
        originality_typical: 93,
        technical_relevance: 95,
        brand_recognizability: 100,
        community_culture: 97
      },
      investment_score: {
        overall_score: 91,
        market_trend: 92,
        liquidity: 89,
        supply_scarcity: 88,
        international_demand: 96,
        inverse_volatility: 90,
        inverse_maintenance_cost: 78,
        comparable_stability: 93
      },
      rarity_score: 87,
      confidence_level: 'High'
    },
    current_median_price_eur: 680000,
    price_change_1y_pct: 10.1,
    price_change_3y_pct: 39.0,
    liquidity_score: 87,
    volatility_score: 20,
    avg_days_on_market: 42,
    history_it: 'L’auto da manifesto per eccellenza degli anni ’80. La versione 5000 QV montava 4 valvole per cilindro e 6 carburatori Weber doppio corpo invertiti posizionati verticalmente sopra il V12.',
    history_en: 'The ultimate poster car of the 1980s. The 5000 QV upgrade introduced 4 valves per cylinder and 6 downdraft twin-choke Weber carburetors mounted directly above the V12.',
    designers: [
      { id: 'p-gandini-countach', full_name: 'Marcello Gandini', nationality: 'IT', role: 'Designer', biography_it: 'Creatore delle celebri portiere a forbice e della linea a cuneo avveniristica.', biography_en: 'Pioneer of the futuristic wedge shape and iconic scissor doors at Bertone.' }
    ],
    engineers: [
      { id: 'p-stanzani', full_name: 'Paolo Stanzani', nationality: 'IT', role: 'Engineer', biography_it: 'Progettista del telaio tubolare e della disposizione capovolta del cambio.', biography_en: 'Engineered the tubular spaceframe chassis and reversed transmission layout.' }
    ],
    production_site: 'Sant’Agata Bolognese (IT)',
    known_issues: [
      { component: 'Sincronizzazione 6 carburatori Weber 44 DCNF', description_it: 'Richiede maestria di carburatori d’epoca per una carburazione uniforme.', description_en: 'Meticulous 6-Weber carburetor tuning required for crisp throttle response.', estimated_fix_cost_eur: '3,500 - 6,500', severity: 'Medium' }
    ],
    maintenance_complexity: 'High',
    annual_est_maintenance_eur: 8500,
    youtube_video_ids: ['3kX82M21kY8'],
    price_history: [
      { year: 2021, period: '2021-Q1', median_price_eur: 480000, average_price_eur: 510000, lower_quartile_eur: 430000, upper_quartile_eur: 560000 },
      { year: 2025, period: '2025-Q1', median_price_eur: 680000, average_price_eur: 710000, lower_quartile_eur: 620000, upper_quartile_eur: 760000 }
    ],
    auctions: [],
    listings: [],
    historical_events: []
  },
  {
    id: 'v-jaguar-xj220',
    generation_id: 'gen-xj220',
    manufacturer_id: 'm-jaguar',
    manufacturer_name: 'Jaguar',
    model_name: 'XJ220',
    slug: 'jaguar-xj220',
    variant_name: 'XJ220 Twin-Turbo V6',
    tier: 'Hero',
    category: 'Supercar',
    market_code: 'EUR-SPEC',
    model_year_from: 1992,
    model_year_to: 1994,
    steering_side: 'Both',
    body_style: 'Coupe',
    limited_edition: true,
    numbered_series: true,
    production_total: 275,
    original_list_price_eur: 530000,
    data_status: 'demo',
    hero_image_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&auto=format&fit=crop',
    gallery_images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&auto=format&fit=crop'],
    engine: {
      id: 'eng-jag-jv6',
      manufacturer_id: 'm-jaguar',
      engine_code: 'JRV-6 3.5 Twin-Turbo V6',
      family_name: 'Jaguar Sport V6',
      architecture: '90° V6',
      cylinders: 6,
      displacement_cc: 3498,
      aspiration: 'Twin-Turbocharged',
      fuel_type: 'Petrol',
      power_kw: 404,
      power_hp: 550,
      torque_nm: 644,
      redline_rpm: 7200
    },
    transmission: {
      id: 'trans-xj220-5m',
      name: '5-Speed Manual AP Racing',
      type: 'Manual',
      gears: 5,
      manufacturer: 'AP Racing / FF Developments',
      drivetrain: 'RWD'
    },
    specs: {
      kerb_weight_kg: 1470,
      length_mm: 4930,
      width_mm: 2009,
      height_mm: 1150,
      wheelbase_mm: 2640,
      top_speed_kph: 341.7,
      acceleration_0_100: 3.8,
      power_to_weight_hp_ton: 374,
      fuel_capacity_l: 90
    },
    scores: {
      collector_score: {
        overall_score: 92,
        rarity_weight: 96,
        historical_relevance: 93,
        desirability: 91,
        originality_typical: 92,
        technical_relevance: 94,
        brand_recognizability: 94,
        community_culture: 90
      },
      investment_score: {
        overall_score: 89,
        market_trend: 91,
        liquidity: 84,
        supply_scarcity: 95,
        international_demand: 88,
        inverse_volatility: 89,
        inverse_maintenance_cost: 76,
        comparable_stability: 91
      },
      rarity_score: 95,
      confidence_level: 'High'
    },
    current_median_price_eur: 580000,
    price_change_1y_pct: 8.9,
    price_change_3y_pct: 32.0,
    liquidity_score: 80,
    volatility_score: 19,
    avg_days_on_market: 52,
    history_it: 'Detentrice del record mondiale di velocità per vetture stradali di serie tra il 1992 e il 1993 (341,7 km/h) prima dell’arrivo della McLaren F1. Sviluppata in collaborazione con Tom Walkinshaw Racing (TWR).',
    history_en: 'Held the world production car top speed record (341.7 km/h / 212.3 mph) between 1992 and 1993 prior to the McLaren F1. Co-engineered with Tom Walkinshaw Racing (TWR).',
    designers: [
      { id: 'p-jim-randle', full_name: 'Jim Randle', nationality: 'GB', role: 'Engineer', biography_it: 'Direttore ingegneria Jaguar fondatore del celebre "Saturday Club" che ideò la XJ220.', biography_en: 'Jaguar engineering director who formed the "Saturday Club" that conceived the XJ220.' }
    ],
    engineers: [
      { id: 'p-twr', full_name: 'Tom Walkinshaw Racing (TWR)', nationality: 'GB', role: 'Engineer', biography_it: 'Partner tecnico responsabile dello sviluppo del telaio in alluminio a nido d’ape.', biography_en: 'Technical partner responsible for the aluminum honeycomb chassis development.' }
    ],
    production_site: 'Bloxham, Oxfordshire (GB)',
    known_issues: [
      { component: 'Pneumatici fuori misura su misura', description_it: 'Pneumatici moderni Bridgestone specifici riprodotti appositamente per XJ220.', description_en: 'Re-commissioned Bridgestone XJ220 specific tires required for safe high-speed use.', estimated_fix_cost_eur: '6,000 - 9,000', severity: 'Medium' }
    ],
    maintenance_complexity: 'High',
    annual_est_maintenance_eur: 11000,
    youtube_video_ids: ['9sN_8v19Psw'],
    price_history: [
      { year: 2021, period: '2021-Q1', median_price_eur: 420000, average_price_eur: 440000, lower_quartile_eur: 380000, upper_quartile_eur: 480000 },
      { year: 2025, period: '2025-Q1', median_price_eur: 580000, average_price_eur: 605000, lower_quartile_eur: 520000, upper_quartile_eur: 650000 }
    ],
    auctions: [],
    listings: [],
    historical_events: []
  }
];

// Helper generator to construct remaining ~292 cars across Core & Discovery categories
export function generateFullCatalog(): VehicleVariant[] {
  const catalog: VehicleVariant[] = [...HERO_VEHICLES];

  const coreTemplates = [
    { name: 'Testarossa Monospechio', brand: 'Ferrari', mId: 'm-ferrari', cat: 'Historic Classic' as const, year: 1985, price: 195000, hp: 390, prod: 7177 },
    { name: '550 Maranello Manual', brand: 'Ferrari', mId: 'm-ferrari', cat: 'Youngtimer' as const, year: 1998, price: 165000, hp: 485, prod: 3083 },
    { name: '430 Scuderia', brand: 'Ferrari', mId: 'm-ferrari', cat: 'Limited Series' as const, year: 2008, price: 245000, hp: 510, prod: 1800 },
    { name: '911 GT3 RS (997.2 3.8)', brand: 'Porsche', mId: 'm-porsche', cat: 'Youngtimer' as const, year: 2010, price: 260000, hp: 450, prod: 1619 },
    { name: '911 Turbo S (964)', brand: 'Porsche', mId: 'm-porsche', cat: 'Youngtimer' as const, year: 1993, price: 380000, hp: 381, prod: 1560 },
    { name: 'Diablo GT', brand: 'Lamborghini', mId: 'm-lamborghini', cat: 'Supercar' as const, year: 1999, price: 850000, hp: 575, prod: 80 },
    { name: 'Murciélago LP670-4 SV Manual', brand: 'Lamborghini', mId: 'm-lamborghini', cat: 'Supercar' as const, year: 2009, price: 1100000, hp: 670, prod: 350 },
    { name: 'Stratos HF Stradale', brand: 'Lancia', mId: 'm-lancia', cat: 'Historic Classic' as const, year: 1974, price: 580000, hp: 190, prod: 492 },
    { name: 'M1 E26', brand: 'BMW', mId: 'm-bmw', cat: 'Historic Classic' as const, year: 1979, price: 520000, hp: 277, prod: 453 },
    { name: 'SLS AMG Black Series', brand: 'Mercedes-Benz', mId: 'm-mercedes', cat: 'Limited Series' as const, year: 2013, price: 750000, hp: 631, prod: 350 },
    { name: 'DB5 Vantage Coupe', brand: 'Aston Martin', mId: 'm-aston', cat: 'Historic Classic' as const, year: 1964, price: 1150000, hp: 325, prod: 1059 },
    { name: '33 Stradale (1967)', brand: 'Alfa Romeo', mId: 'm-alfa', cat: 'Historic Classic' as const, year: 1967, price: 12000000, hp: 230, prod: 18 },
    { name: 'MC12 Stradale', brand: 'Maserati', mId: 'm-maserati', cat: 'Hypercar' as const, year: 2004, price: 3800000, hp: 630, prod: 50 },
    { name: 'EB110 Super Sport (SS)', brand: 'Bugatti', mId: 'm-bugatti', cat: 'Hypercar' as const, year: 1993, price: 3200000, hp: 612, prod: 30 }
  ];

  // Populate Core tier items (~75)
  for (let i = 0; i < coreTemplates.length; i++) {
    const t = coreTemplates[i];
    const slug = `${t.brand.toLowerCase()}-${t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    
    catalog.push({
      id: `v-core-${i}`,
      generation_id: `gen-core-${i}`,
      manufacturer_id: t.mId,
      manufacturer_name: t.brand,
      model_name: t.name,
      slug,
      variant_name: `${t.name} Original Spec`,
      tier: 'Core',
      category: t.cat,
      market_code: 'EUR-SPEC',
      model_year_from: t.year,
      model_year_to: t.year + 3,
      steering_side: 'LHD',
      body_style: 'Coupe',
      limited_edition: t.prod < 2000,
      numbered_series: t.prod < 1000,
      production_total: t.prod,
      original_list_price_eur: Math.round(t.price * 0.15),
      data_status: 'demo',
      hero_image_url: HERO_VEHICLES[i % HERO_VEHICLES.length].hero_image_url,
      gallery_images: [HERO_VEHICLES[i % HERO_VEHICLES.length].hero_image_url],
      engine: {
        id: `eng-core-${i}`,
        manufacturer_id: t.mId,
        engine_code: `ENG-${t.brand.substring(0, 3).toUpperCase()}-${i}`,
        family_name: `${t.brand} Performance Motor`,
        architecture: t.hp > 500 ? 'V12' : t.hp > 300 ? 'V8' : 'Flat-6',
        cylinders: t.hp > 500 ? 12 : 8,
        displacement_cc: 3800 + (i * 120),
        aspiration: 'Naturally Aspirated',
        fuel_type: 'Petrol',
        power_kw: Math.round(t.hp * 0.735),
        power_hp: t.hp,
        torque_nm: Math.round(t.hp * 1.1)
      },
      transmission: {
        id: `trans-core-${i}`,
        name: '6-Speed Manual / F1',
        type: 'Manual',
        gears: 6,
        manufacturer: t.brand,
        drivetrain: 'RWD'
      },
      specs: {
        kerb_weight_kg: 1350 + (i * 10),
        length_mm: 4450,
        width_mm: 1910,
        height_mm: 1210,
        wheelbase_mm: 2500,
        top_speed_kph: 280 + (i * 4),
        acceleration_0_100: Number((4.5 - (i * 0.08)).toFixed(1)),
        power_to_weight_hp_ton: Math.round((t.hp / 1.35)),
        fuel_capacity_l: 85
      },
      scores: {
        collector_score: {
          overall_score: 90 + (i % 8),
          rarity_weight: 85 + (i % 12),
          historical_relevance: 88 + (i % 10),
          desirability: 91 + (i % 7),
          originality_typical: 90,
          technical_relevance: 88,
          brand_recognizability: 94,
          community_culture: 91
        },
        investment_score: {
          overall_score: 87 + (i % 9),
          market_trend: 88 + (i % 8),
          liquidity: 85 + (i % 10),
          supply_scarcity: 89,
          international_demand: 91,
          inverse_volatility: 88,
          inverse_maintenance_cost: 80,
          comparable_stability: 89
        },
        rarity_score: 85 + (i % 12),
        confidence_level: 'High'
      },
      current_median_price_eur: t.price,
      price_change_1y_pct: Number((7.2 + (i * 0.4)).toFixed(1)),
      price_change_3y_pct: Number((28.5 + (i * 1.1)).toFixed(1)),
      liquidity_score: 84,
      volatility_score: 20,
      avg_days_on_market: 36,
      history_it: `Scheda vettura ${t.brand} ${t.name}, pezzo di elevata rilevanza nel mercato del collezionismo europeo.`,
      history_en: `Datasheet for ${t.brand} ${t.name}, highly significant European collector vehicle.`,
      designers: [{ id: 'p-des-generic', full_name: ' Centro Stile', nationality: 'IT', role: 'Designer', biography_it: 'Centro stile ufficiale.', biography_en: 'Official styling studio.' }],
      engineers: [],
      production_site: 'Europe',
      known_issues: [{ component: 'Componenti elettrici d’epoca', description_it: 'Invecchiamento relè e cablaggi.', description_en: 'Aging wiring harness and relays.', estimated_fix_cost_eur: '1,500 - 3,000', severity: 'Low' }],
      maintenance_complexity: 'Moderate',
      annual_est_maintenance_eur: 4500,
      price_history: [
        { year: 2021, period: '2021-Q1', median_price_eur: Math.round(t.price * 0.72), average_price_eur: Math.round(t.price * 0.75), lower_quartile_eur: Math.round(t.price * 0.65), upper_quartile_eur: Math.round(t.price * 0.82) },
        { year: 2025, period: '2025-Q1', median_price_eur: t.price, average_price_eur: Math.round(t.price * 1.05), lower_quartile_eur: Math.round(t.price * 0.92), upper_quartile_eur: Math.round(t.price * 1.15) }
      ],
      auctions: [],
      listings: [],
      historical_events: []
    });
  }

  // Populate remaining Discovery tier items to reach ~300 entries total
  const totalTarget = 300;
  const currentCount = catalog.length;
  const needed = totalTarget - currentCount;

  const brandsList = ['Ferrari', 'Porsche', 'Lamborghini', 'Lancia', 'BMW', 'Mercedes-Benz', 'Jaguar', 'Alfa Romeo', 'Maserati', 'Aston Martin'];
  const categoriesList: (VehicleVariant['category'])[] = ['Youngtimer', 'Historic Classic', 'Instant Classic', 'Limited Series', 'GT / Grand Tourer'];

  for (let j = 0; j < needed; j++) {
    const brand = brandsList[j % brandsList.length];
    const mId = MANUFACTURERS.find(m => m.official_name.includes(brand))?.id || 'm-ferrari';
    const name = `${brand} Iconic Series #${j + 1}`;
    const year = 1970 + (j % 45);
    const price = 45000 + (j * 3800);
    const slug = `discovery-${brand.toLowerCase()}-${j + 1}`;

    catalog.push({
      id: `v-disc-${j}`,
      generation_id: `gen-disc-${j}`,
      manufacturer_id: mId,
      manufacturer_name: brand,
      model_name: name,
      slug,
      variant_name: `${name} Standard`,
      tier: 'Discovery',
      category: categoriesList[j % categoriesList.length],
      market_code: 'EUR-SPEC',
      model_year_from: year,
      steering_side: 'LHD',
      body_style: j % 2 === 0 ? 'Coupe' : 'Spider',
      limited_edition: j % 3 === 0,
      numbered_series: false,
      production_total: 800 + (j * 15),
      data_status: 'demo',
      hero_image_url: HERO_VEHICLES[j % HERO_VEHICLES.length].hero_image_url,
      gallery_images: [HERO_VEHICLES[j % HERO_VEHICLES.length].hero_image_url],
      engine: {
        id: `eng-disc-${j}`,
        manufacturer_id: mId,
        engine_code: `ENG-DISC-${j}`,
        family_name: `${brand} Classic Engine`,
        architecture: j % 2 === 0 ? 'V8' : 'Inline-6',
        cylinders: j % 2 === 0 ? 8 : 6,
        displacement_cc: 2900 + (j * 20),
        aspiration: 'Naturally Aspirated',
        fuel_type: 'Petrol',
        power_kw: 180 + (j * 2),
        power_hp: 245 + (j * 3),
        torque_nm: 300 + (j * 4)
      },
      transmission: {
        id: `trans-disc-${j}`,
        name: '5-Speed Manual',
        type: 'Manual',
        gears: 5,
        manufacturer: brand,
        drivetrain: 'RWD'
      },
      specs: {
        kerb_weight_kg: 1280 + (j * 5),
        length_mm: 4300,
        width_mm: 1800,
        height_mm: 1280,
        wheelbase_mm: 2450,
        top_speed_kph: 240 + (j % 50),
        acceleration_0_100: 5.8,
        power_to_weight_hp_ton: 190,
        fuel_capacity_l: 75
      },
      scores: {
        collector_score: {
          overall_score: 75 + (j % 20),
          rarity_weight: 70 + (j % 20),
          historical_relevance: 72 + (j % 20),
          desirability: 76 + (j % 18),
          originality_typical: 80,
          technical_relevance: 74,
          brand_recognizability: 85,
          community_culture: 78
        },
        investment_score: {
          overall_score: 73 + (j % 22),
          market_trend: 75 + (j % 18),
          liquidity: 78 + (j % 15),
          supply_scarcity: 72,
          international_demand: 80,
          inverse_volatility: 82,
          inverse_maintenance_cost: 85,
          comparable_stability: 80
        },
        rarity_score: 70 + (j % 20),
        confidence_level: j % 4 === 0 ? 'Medium' : 'High'
      },
      current_median_price_eur: price,
      price_change_1y_pct: Number((4.5 + (j % 8)).toFixed(1)),
      price_change_3y_pct: Number((18.0 + (j % 25)).toFixed(1)),
      liquidity_score: 78,
      volatility_score: 22,
      avg_days_on_market: 45,
      history_it: `Scheda sintetica vettura di classe Discovery ${brand}.`,
      history_en: `Discovery level overview for ${brand} collector model.`,
      designers: [],
      engineers: [],
      production_site: 'Europe',
      known_issues: [],
      maintenance_complexity: 'Moderate',
      annual_est_maintenance_eur: 2800,
      price_history: [
        { year: 2021, period: '2021-Q1', median_price_eur: Math.round(price * 0.8), average_price_eur: Math.round(price * 0.82), lower_quartile_eur: Math.round(price * 0.75), upper_quartile_eur: Math.round(price * 0.88) },
        { year: 2025, period: '2025-Q1', median_price_eur: price, average_price_eur: Math.round(price * 1.04), lower_quartile_eur: Math.round(price * 0.95), upper_quartile_eur: Math.round(price * 1.1) }
      ],
      auctions: [],
      listings: [],
      historical_events: []
    });
  }

  return catalog;
}

export const CATALOG_DATABASE = generateFullCatalog();

// Knowledge Graph Entities & Edges
export const GRAPH_ENTITIES: GraphEntity[] = [
  { id: 'g-f40', name: 'Ferrari F40', type: 'Variant', subtitle: 'Supercar (1987-1992)', image_url: HERO_VEHICLES[0].hero_image_url },
  { id: 'g-288gto', name: 'Ferrari 288 GTO', type: 'Variant', subtitle: 'Homologation Special (1984)', image_url: HERO_VEHICLES[6].hero_image_url },
  { id: 'g-959', name: 'Porsche 959', type: 'Variant', subtitle: 'AWD Supercar (1986-1988)', image_url: HERO_VEHICLES[1].hero_image_url },
  { id: 'g-mclaren-f1', name: 'McLaren F1', type: 'Variant', subtitle: 'Atmospheric V12 Hypercar', image_url: HERO_VEHICLES[2].hero_image_url },
  { id: 'g-eb110', name: 'Bugatti EB110', type: 'Variant', subtitle: 'Quad-Turbo V12 Hypercar', image_url: HERO_VEHICLES[4].hero_image_url },
  
  // Designers & Engineers
  { id: 'g-fioravanti', name: 'Leonardo Fioravanti', type: 'Designer', subtitle: 'Pininfarina Chief Designer' },
  { id: 'g-materazzi', name: 'Nicola Materazzi', type: 'Engineer', subtitle: 'Father of Ferrari Turbocharging' },
  { id: 'g-murray', name: 'Gordon Murray', type: 'Designer', subtitle: 'Creator of McLaren F1 & GMA T.50' },
  { id: 'g-gandini', name: 'Marcello Gandini', type: 'Designer', subtitle: 'Bertone Genius (Miura, Countach, EB110)' },
  
  // Engines & Factories
  { id: 'g-f120a', name: 'Ferrari F120A V8 Turbo', type: 'Engine', subtitle: '2.9L Twin Turbo (478 HP)' },
  { id: 'g-s70', name: 'BMW S70/2 V12', type: 'Engine', subtitle: '6.1L Naturally Aspirated (627 HP)' },
  { id: 'g-maranello', name: 'Maranello Factory', type: 'Factory', subtitle: 'Ferrari HQ & Historic Production' },
  { id: 'g-campogalliano', name: 'Fabbrica Blu Campogalliano', type: 'Factory', subtitle: 'Bugatti Automobili S.p.A. (1990-1995)' },
  
  // Motorsport Events
  { id: 'g-lemans-1995', name: '24 Hours of Le Mans 1995', type: 'Event', subtitle: 'Overall Victory McLaren F1 GTR' }
];

export const GRAPH_RELATIONSHIPS: GraphRelationship[] = [
  { id: 'r1', subject_entity_id: 'g-f40', predicate: 'DESIGNED_BY', object_entity_id: 'g-fioravanti', confidence_score: 100, verification_status: 'verified', explanation_it: 'Leonardo Fioravanti guidò il centro stile Pininfarina nella definizione della F40.', explanation_en: 'Leonardo Fioravanti led the Pininfarina design team for the F40.' },
  { id: 'r2', subject_entity_id: 'g-f40', predicate: 'ENGINEERED_BY', object_entity_id: 'g-materazzi', confidence_score: 100, verification_status: 'verified', explanation_it: 'Nicola Materazzi definì le specifiche del V8 sovralimentato e del telaio.', explanation_en: 'Nicola Materazzi engineered the twin-turbo V8 powertrain and tubular frame.' },
  { id: 'r3', subject_entity_id: 'g-f40', predicate: 'DERIVED_FROM', object_entity_id: 'g-288gto', confidence_score: 98, verification_status: 'verified', explanation_it: 'Il progetto F40 nacque dall’evoluzione tecnica della 288 GTO Evoluzione.', explanation_en: 'The F40 evolved directly from the 288 GTO Evoluzione experimental prototype.' },
  { id: 'r4', subject_entity_id: 'g-f40', predicate: 'POWERED_BY', object_entity_id: 'g-f120a', confidence_score: 100, verification_status: 'verified', explanation_it: 'Motorizzata dal propulsore F120A V8 bialbero twin-turbo.', explanation_en: 'Powered by the twin-turbocharged F120A V8 engine.' },
  { id: 'r5', subject_entity_id: 'g-f40', predicate: 'COMPETES_WITH', object_entity_id: 'g-959', confidence_score: 100, verification_status: 'verified', explanation_it: 'Storica rivalità per il primato delle supercar di fine anni ’80.', explanation_en: 'Iconic rival for top speed supremacy in late 1980s supercar era.' },
  { id: 'r6', subject_entity_id: 'g-mclaren-f1', predicate: 'DESIGNED_BY', object_entity_id: 'g-murray', confidence_score: 100, verification_status: 'verified', explanation_it: 'Gordon Murray concepì l’architettura a tre posti e telaio monoscocca.', explanation_en: 'Gordon Murray conceived the 3-seater central position architecture.' },
  { id: 'r7', subject_entity_id: 'g-mclaren-f1', predicate: 'POWERED_BY', object_entity_id: 'g-s70', confidence_score: 100, verification_status: 'verified', explanation_it: 'Equipaggiata con il V12 aspirato S70/2 fornito da BMW Motorsport.', explanation_en: 'Equipped with the bespoke S70/2 V12 built by BMW Motorsport.' },
  { id: 'r8', subject_entity_id: 'g-mclaren-f1', predicate: 'ASSOCIATED_WITH_EVENT', object_entity_id: 'g-lemans-1995', confidence_score: 100, verification_status: 'verified', explanation_it: 'Vittoria leggendaria al debutto nella 24 Ore di Le Mans del 1995.', explanation_en: 'Historic overall victory on debut at the 1995 24 Hours of Le Mans.' },
  { id: 'r9', subject_entity_id: 'g-eb110', predicate: 'DESIGNED_BY', object_entity_id: 'g-gandini', confidence_score: 95, verification_status: 'verified', explanation_it: 'Marcello Gandini disegnò la prima versione avveniristica con fari a scomparsa.', explanation_en: 'Marcello Gandini designed the initial futuristic styling with pop-up headlights.' },
  { id: 'r10', subject_entity_id: 'g-eb110', predicate: 'PRODUCED_AT', object_entity_id: 'g-campogalliano', confidence_score: 100, verification_status: 'verified', explanation_it: 'Assemblata nella celebre Fabbrica Blu a Campogalliano (Modena).', explanation_en: 'Assembled at the high-tech Blue Factory in Campogalliano, Italy.' }
];

export const DATA_ASSERTIONS_MOCK: DataAssertion[] = [
  { id: 'ast-1', entity_type: 'VehicleVariant', entity_id: 'v-ferrari-f40', attribute_name: 'production_total', raw_value: '1311', normalized_value: '1311', unit: 'units', source_name: 'Ferrari Factory Archives', retrieved_at: '2025-01-10', confidence_score: 100, verification_status: 'verified' },
  { id: 'ast-2', entity_type: 'VehicleVariant', entity_id: 'v-ferrari-f40', attribute_name: 'top_speed_kph', raw_value: '324.0 km/h', normalized_value: '324', unit: 'kph', source_name: 'Quattroruote / Auto Motor und Sport Tests', retrieved_at: '2025-01-12', confidence_score: 98, verification_status: 'verified' },
  { id: 'ast-3', entity_type: 'VehicleVariant', entity_id: 'v-mclaren-f1', attribute_name: 'top_speed_kph', raw_value: '386.4 km/h', normalized_value: '386.4', unit: 'kph', source_name: 'Ehra-Lessien Proving Ground Official Record', retrieved_at: '2025-01-15', confidence_score: 100, verification_status: 'verified' }
];
