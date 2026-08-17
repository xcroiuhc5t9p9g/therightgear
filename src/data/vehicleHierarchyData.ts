import { 
  VehicleFamilyNavigation, 
  VehicleModelHierarchy, 
  VehicleGenerationHierarchy, 
  VehicleVariant,
  MediaAsset,
  VideoAsset,
  ProductionRecord
} from '../types';
import { catalogueRepository } from '../services/catalogueRepository';

// -------------------------------------------------------------
// DEMO DATA FLAG & SOURCE ATTRIBUTION
// -------------------------------------------------------------
export const DATA_DEMO_NOTICE = {
  status: 'demo' as const,
  attribution: 'Automotive Intelligence Platform - Demo Data Repository (Plausible benchmarks)',
  license: 'Editorial / Non-verified demo payload'
};

// -------------------------------------------------------------
// BMW M3 MODEL FAMILY SPECIFIC DATA (DEMO payload)
// -------------------------------------------------------------

export const BMW_M3_MODEL_HIERARCHY: VehicleModelHierarchy = {
  modelId: 'bmw-m3',
  manufacturerId: 'm-bmw',
  manufacturerName: 'BMW',
  manufacturerSlug: 'bmw',
  modelName: 'M3',
  modelSlug: 'm3',
  category: 'Youngtimer',
  yearsRange: '1986–Presente',
  totalGenerationsCount: 6,
  totalVariantsCount: 18,
  historicSummaryIt: 'La BMW M3 è il punto di riferimento assoluto tra le berline e coupé ad alte prestazioni. Nata nel 1986 dal reparto BMW Motorsport per omologare la vettura da corsa nei campionati Turismo e DTM, la M3 si è evoluta attraverso 6 generazioni (E30, E36, E46, E90/E92, F80, G80/G81), passando dal 4 cilindri ad alto regime S14 ai propulsori 6 cilindri in linea e V8 atmosferici, fino ai moderni 3.0 BiTurbo M TwinPower Turbo.',
  historicSummaryEn: 'The BMW M3 is the benchmark for high-performance sports saloons and coupes. First created in 1986 by BMW Motorsport to fulfill Group A touring car homologation requirements, the M3 has evolved across 6 iconic generations (E30, E36, E46, E90/E92, F80, G80/G81).',
  powerHpRange: [195, 550],
  collectorScoreOverall: 94,
  investmentScoreOverall: 91,
  priceRangeEur: { min: 25000, max: 350000 },
  heroImageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop',
  competitors: [
    { name: '190E 2.5-16 Evolution II', slug: 'mercedes-190e-evo2', manufacturer: 'Mercedes-Benz', image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop' },
    { name: 'RS4 Avant / Sport Quattro', slug: 'audi-rs4', manufacturer: 'Audi Sport', image_url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop' },
    { name: 'Giulia GTA / GTAm', slug: 'alfa-giulia-gta', manufacturer: 'Alfa Romeo', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop' }
  ]
};

export const BMW_M3_GENERATIONS_HIERARCHY: VehicleGenerationHierarchy[] = [
  {
    generationId: 'bmw-m3-e30',
    modelId: 'bmw-m3',
    generationCode: 'E30',
    generationSlug: 'e30',
    publicName: 'M3 E30',
    yearsRange: '1986–1991',
    productionTotal: 17970,
    descriptionIt: 'Sviluppata direttamente da BMW Motorsport con passaruota allargati e telaio dedicato per dominare il DTM e il Gruppo A.',
    descriptionEn: 'Directly engineered by BMW Motorsport featuring flared box arches and bespoke chassis dynamics to dominate DTM and Group A.',
    distinctiveFeaturesIt: ['Passaruota allargati Box Flares', 'Motore 4 Cilindri S14 High-Rev', 'Cambio Getrag 265 Dog-Leg 5M', 'Differenziale LSD 25%'],
    distinctiveFeaturesEn: ['Box flared wheel arches', 'S14 High-revving 4-cyl engine', 'Getrag 265 Dog-Leg 5-speed', '25% Limited Slip Differential'],
    availableEngines: ['2.3L S14B23 (195-220 hp)', '2.5L S14B25 (238 hp)'],
    bodyStyles: ['Coupé 2 Porte', 'Cabriolet'],
    markets: ['Europa', 'Nord America', 'Giappone'],
    updateChronology: [
      { year: 1986, eventIt: 'Lancio sul mercato della versione base 2.3L (195/200 hp)', eventEn: 'Market launch of base 2.3L model (195/200 HP)' },
      { year: 1988, eventIt: 'Introduzione M3 Evolution I / II (220 hp, condotti aspirazione rivisti)', eventEn: 'Introduction of M3 Evolution I / II (220 HP)' },
      { year: 1990, eventIt: 'Lancio della Sport Evolution III (2.5L 238 hp, serie limitata a 600 pezzi)', eventEn: 'Launch of Sport Evolution III (2.5L 238 HP, 600 units limited series)' }
    ],
    heroImageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop'
  },
  {
    generationId: 'bmw-m3-e36',
    modelId: 'bmw-m3',
    generationCode: 'E36',
    generationSlug: 'e36',
    publicName: 'M3 E36',
    yearsRange: '1992–1999',
    productionTotal: 71242,
    descriptionIt: 'La prima M3 ad adottare il motore 6 cilindri in linea atmosferico S50, trasformando la vettura in un’icona GT di massa.',
    descriptionEn: 'The first M3 powered by an inline-6 atmospheric S50 engine, evolving the nameplate into a GT cruiser.',
    distinctiveFeaturesIt: ['Motore 6 Cilindri in linea S50/S52', 'Sistema VANOS / Doppio VANOS', 'Disponibile in Coupé, Berlina e Cabrio'],
    distinctiveFeaturesEn: ['Inline-6 S50/S52 engine', 'VANOS / Double VANOS variable valve timing', 'Available in Coupé, Saloon & Convertible'],
    availableEngines: ['3.0L S50B30 (286 hp)', '3.2L S50B32 (321 hp)'],
    bodyStyles: ['Coupé', 'Sedan (Berlina)', 'Cabriolet'],
    markets: ['Global'],
    updateChronology: [
      { year: 1992, eventIt: 'Lancio M3 Coupé 3.0L S50 (286 hp)', eventEn: 'Launch M3 Coupé 3.0L S50 (286 HP)' },
      { year: 1995, eventIt: 'Edizione limitata M3 GT (356 pezzi, British Racing Green)', eventEn: 'Limited M3 GT (356 units, British Racing Green)' },
      { year: 1996, eventIt: 'Upgrade a 3.2L S50B32 (321 hp) e cambio a 6 marce', eventEn: 'Upgrade to 3.2L S50B32 (321 HP) and 6-speed manual' }
    ],
    heroImageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop'
  },
  {
    generationId: 'bmw-m3-e46',
    modelId: 'bmw-m3',
    generationCode: 'E46',
    generationSlug: 'e46',
    publicName: 'M3 E46',
    yearsRange: '2000–2006',
    productionTotal: 85700,
    descriptionIt: 'Considerata la sintesi perfetta dell’era atmosferica ad alto regime (8.000 rpm) con il leggendario motore 3.2L S54.',
    descriptionEn: 'Considered the peak of atmospheric high-revving M power (8,000 rpm) featuring the legendary 3.2L S54 engine.',
    distinctiveFeaturesIt: ['Motore S54B32 8.000 RPM', 'Power Dome sul cofano', 'Grigliette laterali M', 'Variante CSL alleggerita'],
    distinctiveFeaturesEn: ['S54B32 engine 8,000 RPM redline', 'Power dome bonnet', 'M side gills', 'Lightweight CSL edition'],
    availableEngines: ['3.2L S54B32 (343 hp)', '3.2L S54B32 HP CSL (360 hp)'],
    bodyStyles: ['Coupé', 'Cabriolet'],
    markets: ['Global'],
    updateChronology: [
      { year: 2000, eventIt: 'Presentazione M3 E46 Coupé (343 hp)', eventEn: 'Debut M3 E46 Coupé (343 HP)' },
      { year: 2003, eventIt: 'Lancio M3 CSL (-110 kg, tetto in carbonio, 360 hp, airbox in carbonio)', eventEn: 'Launch M3 CSL (-110 kg, carbon roof, 360 HP, carbon airbox)' },
      { year: 2005, eventIt: 'Pacchetto CS / Competition Package', eventEn: 'CS / Competition Package introduction' }
    ],
    heroImageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&auto=format&fit=crop'
  },
  {
    generationId: 'bmw-m3-e92',
    modelId: 'bmw-m3',
    generationCode: 'E90 / E92 / E93',
    generationSlug: 'e92',
    publicName: 'M3 V8 (E90/E92/E93)',
    yearsRange: '2007–2013',
    productionTotal: 65968,
    descriptionIt: 'L’unica M3 della storia dotata di un propulsore V8 atmosferico (S65 4.0L / 4.4L), in grado di raggiungere 8.400 rpm.',
    descriptionEn: 'The only M3 generation powered by a high-revving naturally aspirated V8 engine (S65 4.0L / 4.4L) reaching 8,400 rpm.',
    distinctiveFeaturesIt: ['Motore V8 S65B40 8.400 RPM', 'Tetto in fibra di carbonio di serie su Coupé', 'Cambio M-DKG 7 rapporti'],
    distinctiveFeaturesEn: ['S65B40 V8 engine 8,400 RPM', 'Carbon fiber roof standard on Coupé', '7-speed M-DKG dual clutch option'],
    availableEngines: ['4.0L S65B40 V8 (420 hp)', '4.4L S65B44 V8 GTS (450 hp)'],
    bodyStyles: ['E92 Coupé', 'E90 Sedan', 'E93 Cabriolet'],
    markets: ['Global'],
    updateChronology: [
      { year: 2007, eventIt: 'Debutto M3 E92 Coupé V8 4.0L (420 hp)', eventEn: 'Debut M3 E92 Coupé V8 4.0L (420 HP)' },
      { year: 2010, eventIt: 'Presentazione M3 GTS 4.4L (450 hp, roll-bar, alettone fisso, 135 pezzi)', eventEn: 'M3 GTS 4.4L debut (450 HP, roll cage, fixed wing, 135 units)' }
    ],
    heroImageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop'
  },
  {
    generationId: 'bmw-m3-f80',
    modelId: 'bmw-m3',
    generationCode: 'F80',
    generationSlug: 'f80',
    publicName: 'M3 F80',
    yearsRange: '2014–2018',
    productionTotal: 34677,
    descriptionIt: 'La prima M3 ad adottare la sovralimentazione BiTurbo con il propulsore 6 in linea S55, mantenendo la trazione posteriore pura.',
    descriptionEn: 'First M3 to adopt TwinTurbo charging with the S55 inline-6, maintaining pure rear wheel drive characteristics.',
    distinctiveFeaturesIt: ['Motore 6 in linea S55 BiTurbo', 'Albero di trasmissione in fibra di carbonio CFRP', 'LBL flared arches'],
    distinctiveFeaturesEn: ['S55 BiTurbo inline-6', 'CFRP carbon drive shaft', 'Aggressive widebody arches'],
    availableEngines: ['3.0L S55B30 BiTurbo (431 hp - 460 hp)'],
    bodyStyles: ['Sedan (Solo 4 porte, la Coupé diventa M4 F82)'],
    markets: ['Global'],
    updateChronology: [
      { year: 2014, eventIt: 'Lancio M3 F80 Sedan (431 hp)', eventEn: 'Launch M3 F80 Sedan (431 HP)' },
      { year: 2016, eventIt: 'Competition Package (450 hp)', eventEn: 'Competition Package (450 HP)' },
      { year: 2018, eventIt: 'M3 CS (460 hp, 1200 esemplari)', eventEn: 'M3 CS (460 HP, 1200 units)' }
    ],
    heroImageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=1200&auto=format&fit=crop'
  },
  {
    generationId: 'bmw-m3-g80',
    modelId: 'bmw-m3',
    generationCode: 'G80 / G81',
    generationSlug: 'g80',
    publicName: 'M3 G80 / G81',
    yearsRange: '2020–Presente',
    productionTotal: 28000,
    descriptionIt: 'Sesta generazione con il propulsore S58 fino a 550 hp, opzione M xDrive a trazione integrale disinseribile e prima variante Touring G81.',
    descriptionEn: 'Sixth generation powered by the S58 up to 550 HP, M xDrive AWD option and first official M3 Touring station wagon G81.',
    distinctiveFeaturesIt: ['Motore S58 BiTurbo fino a 550 hp', 'Trazione M xDrive commutabile in 2WD', 'Prima M3 Touring della storia (G81)'],
    distinctiveFeaturesEn: ['S58 BiTurbo up to 550 HP', 'M xDrive switchable to pure 2WD', 'First ever factory M3 Touring (G81)'],
    availableEngines: ['3.0L S58B30T0 (480 hp - 550 hp)'],
    bodyStyles: ['G80 Sedan', 'G81 Touring'],
    markets: ['Global'],
    updateChronology: [
      { year: 2020, eventIt: 'Debutto M3 G80 Sedan (480 hp / 510 hp Competition)', eventEn: 'Debut M3 G80 Sedan (480 HP / 510 HP Competition)' },
      { year: 2022, eventIt: 'Lancio M3 Touring G81', eventEn: 'Launch M3 Touring G81' },
      { year: 2023, eventIt: 'M3 CS G80 (550 hp, trazione M xDrive)', eventEn: 'M3 CS G80 (550 HP, M xDrive)' }
    ],
    heroImageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop'
  }
];

// -------------------------------------------------------------
// NAVIGATION TREE GENERATOR
// -------------------------------------------------------------

export function getVehicleFamilyNavigation(modelSlugOrId: string = 'bmw-m3'): VehicleFamilyNavigation {
  // Check if BMW M3
  if (modelSlugOrId.includes('bmw-m3') || modelSlugOrId.includes('m3')) {
    return {
      manufacturer: {
        id: 'm-bmw',
        name: 'BMW',
        slug: 'bmw',
        countryCode: 'DE'
      },
      model: {
        id: 'bmw-m3',
        name: 'M3',
        slug: 'm3',
        years: '1986–Presente',
        category: 'Youngtimer'
      },
      generations: [
        {
          id: 'bmw-m3-e30',
          code: 'E30',
          name: 'M3 E30',
          years: '1986–1991',
          slug: 'e30',
          variants: [
            { id: 'bmw-m3-e30-2-3', slug: 'm3-2-3', name: 'M3 2.3 (195/200 hp)', years: '1986–1991', limitedEdition: false, productionTotal: 17970, active: true, powerHp: 200 },
            { id: 'bmw-m3-e30-evolution-ii', slug: 'evolution-ii', name: 'M3 Evolution II (220 hp)', years: '1988', limitedEdition: true, productionTotal: 500, active: true, powerHp: 220 },
            { id: 'bmw-m3-e30-sport-evolution', slug: 'sport-evolution', name: 'M3 Sport Evolution (238 hp)', years: '1990', limitedEdition: true, productionTotal: 600, active: true, powerHp: 238 }
          ]
        },
        {
          id: 'bmw-m3-e36',
          code: 'E36',
          name: 'M3 E36',
          years: '1992–1999',
          slug: 'e36',
          variants: [
            { id: 'bmw-m3-e36-3-0', slug: 'm3-3-0', name: 'M3 3.0 (286 hp)', years: '1992–1995', limitedEdition: false, productionTotal: 28867, active: false, powerHp: 286 },
            { id: 'bmw-m3-e36-3-2', slug: 'm3-3-2', name: 'M3 3.2 (321 hp)', years: '1995–1999', limitedEdition: false, productionTotal: 42019, active: false, powerHp: 321 },
            { id: 'bmw-m3-e36-gt', slug: 'm3-gt', name: 'M3 GT (295 hp)', years: '1995', limitedEdition: true, productionTotal: 356, active: false, powerHp: 295 }
          ]
        },
        {
          id: 'bmw-m3-e46',
          code: 'E46',
          name: 'M3 E46',
          years: '2000–2006',
          slug: 'e46',
          variants: [
            { id: 'bmw-m3-e46-coupe', slug: 'm3-coupe', name: 'M3 Coupé (343 hp)', years: '2000–2006', limitedEdition: false, productionTotal: 84317, active: false, powerHp: 343 },
            { id: 'bmw-m3-e46-csl', slug: 'm3-csl', name: 'M3 CSL (360 hp)', years: '2003', limitedEdition: true, productionTotal: 1383, active: false, powerHp: 360 }
          ]
        },
        {
          id: 'bmw-m3-e92',
          code: 'E90/E92/E93',
          name: 'M3 V8',
          years: '2007–2013',
          slug: 'e92',
          variants: [
            { id: 'bmw-m3-e92-v8', slug: 'm3-v8-coupe', name: 'M3 V8 Coupé (420 hp)', years: '2007–2013', limitedEdition: false, productionTotal: 65833, active: false, powerHp: 420 },
            { id: 'bmw-m3-e92-gts', slug: 'm3-gts', name: 'M3 GTS 4.4 (450 hp)', years: '2010', limitedEdition: true, productionTotal: 135, active: false, powerHp: 450 }
          ]
        },
        {
          id: 'bmw-m3-f80',
          code: 'F80',
          name: 'M3 F80',
          years: '2014–2018',
          slug: 'f80',
          variants: [
            { id: 'bmw-m3-f80-sedan', slug: 'm3-sedan', name: 'M3 Sedan (431 hp)', years: '2014–2018', limitedEdition: false, productionTotal: 33477, active: false, powerHp: 431 },
            { id: 'bmw-m3-f80-cs', slug: 'm3-cs', name: 'M3 CS (460 hp)', years: '2018', limitedEdition: true, productionTotal: 1200, active: false, powerHp: 460 }
          ]
        },
        {
          id: 'bmw-m3-g80',
          code: 'G80/G81',
          name: 'M3 G80 / G81',
          years: '2020–Presente',
          slug: 'g80',
          variants: [
            { id: 'bmw-m3-g80-competition', slug: 'm3-competition', name: 'M3 Competition xDrive (510 hp)', years: '2020–Pres.', limitedEdition: false, productionTotal: 26000, active: false, powerHp: 510 },
            { id: 'bmw-m3-g80-cs', slug: 'm3-cs-g80', name: 'M3 CS G80 (550 hp)', years: '2023', limitedEdition: true, productionTotal: 2000, active: false, powerHp: 550 }
          ]
        }
      ]
    };
  }

  // Generic Fallback for Ferrari F40 / others
  const foundInCatalog = catalogueRepository.getVariantBySlug(modelSlugOrId) || catalogueRepository.getAllVariants().vehicles.find(v => v.id === modelSlugOrId);
  const mName = foundInCatalog ? foundInCatalog.manufacturer_name : 'Ferrari';
  const mSlug = mName.toLowerCase().replace(/\s+/g, '-');
  const modelName = foundInCatalog ? foundInCatalog.model_name : 'F40';
  const modelSlug = modelName.toLowerCase().replace(/\s+/g, '-');

  return {
    manufacturer: {
      id: `m-${mSlug}`,
      name: mName,
      slug: mSlug
    },
    model: {
      id: `model-${modelSlug}`,
      name: modelName,
      slug: modelSlug,
      years: foundInCatalog ? `${foundInCatalog.model_year_from}–${foundInCatalog.model_year_to || 'Presente'}` : '1987–1992',
      category: foundInCatalog?.category || 'Supercar'
    },
    generations: [
      {
        id: `gen-${modelSlug}`,
        code: 'Gen 1',
        name: `${modelName} Series`,
        years: foundInCatalog ? `${foundInCatalog.model_year_from}–${foundInCatalog.model_year_to || 'Presente'}` : '1987–1992',
        slug: 'series-1',
        variants: [
          {
            id: foundInCatalog?.id || 'v-ferrari-f40',
            slug: foundInCatalog?.slug || 'ferrari-f40',
            name: foundInCatalog?.variant_name || `${modelName} Standard`,
            years: foundInCatalog ? `${foundInCatalog.model_year_from}–${foundInCatalog.model_year_to || ''}` : '1987–1992',
            limitedEdition: foundInCatalog?.limited_edition || true,
            productionTotal: foundInCatalog?.production_total || 1311,
            active: true,
            powerHp: foundInCatalog?.engine.power_hp || 478
          }
        ]
      }
    ]
  };
}

export const BMW_M3_FAMILY_NAV: VehicleFamilyNavigation = getVehicleFamilyNavigation('bmw-m3');


// -------------------------------------------------------------
// MEDIA ASSETS (Specific for Model, Generation, Variant)
// -------------------------------------------------------------

export const MEDIA_ASSETS_SAMPLE: MediaAsset[] = [
  {
    id: 'img-m3-model-hero',
    entityType: 'model',
    entityId: 'bmw-m3',
    sourceUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop',
    imageRole: 'hero',
    editorialApproval: true,
    author: 'BMW AG Press',
    copyrightStatus: 'Editorial Rights Reserved',
  },
  {
    id: 'img-m3-e30-ext',
    entityType: 'generation',
    entityId: 'bmw-m3-e30',
    sourceUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop',
    imageRole: 'exterior',
    editorialApproval: true,
    author: 'BMW Group Classic',
    copyrightStatus: 'Editorial Rights Reserved',
  },
  {
    id: 'img-m3-e30-sport-evo-engine',
    entityType: 'variant',
    entityId: 'bmw-m3-e30-sport-evolution',
    sourceUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop',
    imageRole: 'engine',
    editorialApproval: true,
    author: 'Archive BMW Motorsport',
    copyrightStatus: 'Editorial Rights Reserved',
  }
];

export const VIDEO_ASSETS_SAMPLE: VideoAsset[] = [
  {
    id: 'vid-m3-e30-dtm',
    youtubeVideoId: 'S35Qx8wzUso',
    entityType: 'generation',
    entityId: 'bmw-m3-e30',
    title: 'BMW M3 E30 DTM Legendary Battle Nürburgring 1989',
    channelName: 'BMW Motorsport Official',
    language: 'en',
    videoType: 'historical',
    editorialApproval: true
  },
  {
    id: 'vid-m3-sport-evo-review',
    youtubeVideoId: 'dQw4w9WgXcQ',
    entityType: 'variant',
    entityId: 'bmw-m3-e30-sport-evolution',
    title: 'BMW M3 Sport Evolution E30 Track Test & Buying Guide',
    channelName: 'Automotive Intelligence Media',
    language: 'it',
    videoType: 'road_test',
    editorialApproval: true
  }
];

// -------------------------------------------------------------
// PRODUCTION RECORDS (Model, Generation, Variant level)
// -------------------------------------------------------------

export const PRODUCTION_RECORDS_SAMPLE: ProductionRecord[] = [
  {
    id: 'prod-m3-total',
    entityType: 'model',
    entityId: 'bmw-m3',
    value: 303500,
    aggregationLevel: 'model_total',
    source: 'BMW Group Official Archives 2024',
    confidenceScore: 98,
    verificationStatus: 'verified'
  },
  {
    id: 'prod-m3-e30-total',
    entityType: 'generation',
    entityId: 'bmw-m3-e30',
    value: 17970,
    aggregationLevel: 'generation_total',
    source: 'BMW Motorsport Handbuilt Register',
    confidenceScore: 99,
    verificationStatus: 'verified'
  },
  {
    id: 'prod-m3-e30-sport-evo',
    entityType: 'variant',
    entityId: 'bmw-m3-e30-sport-evolution',
    value: 600,
    aggregationLevel: 'variant_total',
    source: 'BMW Group Classic Archives & FIA Historic Database Homologation A-5327',
    confidenceScore: 100,
    verificationStatus: 'verified'
  }
];
