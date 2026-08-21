import { CanonicalSeedBundle } from './types.js';

/**
 * Authoritative Canonical Dataset: BMW M3 Foundation (E30 Generation Focus)
 * 
 * Source Provenance Hierarchy:
 * Tier 1: BMW Group Classic Archive, BMW AG Corporate Documentation, FIA Homologation Form A-5327 (BMW M3 E30)
 * Tier 2: BMW M Registry (Authoritative VIN-level registry for BMW M vehicles)
 * 
 * Core Principles:
 * - "Unknown is preferable to plausible but invented."
 * - "No score without approved methodology."
 * - "Null != present/current."
 */
export const BMW_M3_FOUNDATION_SEED: CanonicalSeedBundle = {
  bundleId: 'canonical-seed-bmw-m3-foundation',
  version: '1.4.0',
  description: 'Authoritative canonical catalogue dataset for BMW M3 (E30 Generation), audited under DATA-16R3R authoritative source provenance standards.',
  sources: [
    {
      sourceId: 'src-fia-homologation-a5327',
      tier: 'TIER_1_PRIMARY',
      title: 'FIA Historic Database — Homologation A-5327: BMW M3 (2302 cc)',
      publisher: 'Fédération Internationale de l’Automobile (FIA)',
      documentRef: 'FIA Homologation Form A-5327 (Valid from 02/03/1987)',
      referenceUrl: 'https://historicdb.fia.com/car/bmw-m3-2302',
      publishedYear: 1987,
      notes: 'Official international racing and road homologation document specifying base chassis dimensions (wheelbase 2565 mm, length 4345 mm, width 1680 mm, height 1370 mm), engine displacement (2302 cc), bore (93.4 mm), stroke (84.0 mm), 4-valve cylinder head (16V), compression ratio 10.5:1, 5-speed manual transmission, and aerodynamic bodywork.',
      entityIds: ['eng-bmw-s14b23', 'var-bmw-m3-e30-coupe-base', 'gen-bmw-m3-e30'],
      supports: [
        'specs.bore_mm',
        'specs.stroke_mm',
        'specs.valves',
        'specs.compression_ratio',
        'specs.wheelbase_mm',
        'specs.length_mm',
        'specs.width_mm',
        'specs.height_mm',
        'engine.bore_mm',
        'engine.stroke_mm',
        'engine.valves',
        'engine.compression_ratio',
        'transmission.type',
        'transmission.gears',
        'transmission.drivetrain',
        'distinctive_features_en'
      ]
    },
    {
      sourceId: 'src-bmw-classic-e30-m3-overview',
      tier: 'TIER_1_PRIMARY',
      title: 'BMW Group Classic — BMW M3 (E30) Overview',
      publisher: 'Bayerische Motoren Werke AG (BMW Group Classic)',
      referenceUrl: 'https://www.bmwgroup-classic.com/en/models/bmw-classics/product-description-page.ad-1558-1.bmw-m3-e30.html',
      publishedYear: 2021,
      notes: 'Official BMW Group Classic documentation on the first-generation BMW M3 (E30): debuted at IAA Frankfurt 1985, series production 1986–1991, with sedan production ending in 1990 and convertible continuing through 1991.',
      entityIds: [
        'model-bmw-m3',
        'gen-bmw-m3-e30'
      ],
      supports: [
        'canonical_name',
        'category',
        'introduced_year',
        'summary_en',
        'generation_code',
        'production_start',
        'production_end',
        'distinctive_features_en'
      ]
    },
    {
      sourceId: 'src-bmw-classic-e30-m3',
      tier: 'TIER_1_PRIMARY',
      title: 'BMW Group Classic — BMW M3 (E30)',
      publisher: 'Bayerische Motoren Werke AG (BMW Group Classic)',
      referenceUrl: 'https://www.bmwgroup-classic.com/en/models/bmw-classics/product-description-page.ad-239-1.bmw-m3-e30.html',
      publishedYear: 2021,
      notes: 'Official BMW Group Classic vehicle documentation for the BMW M3 (E30): production period 09/1986–12/1990, four-cylinder inline engine with 2302 cc displacement, outputs of 195 hp / 143 kW (with catalyst), 200 hp / 147 kW (without catalyst), 215 hp / 158 kW (from 09/1989), and 230 km/h top speed.',
      entityIds: [
        'var-bmw-m3-e30-coupe-base',
        'eng-bmw-s14b23'
      ],
      supports: [
        'canonical_name',
        'variant_name',
        'production_start_year',
        'model_year_from',
        'canonical_engine_id',
        'engine_code',
        'family_name',
        'manufacturer_id',
        'specs.architecture',
        'specs.cylinders',
        'specs.displacement_cc',
        'specs.aspiration',
        'specs.fuel_type',
        'specs.top_speed_kph',
        'engine.architecture',
        'engine.cylinders',
        'engine.displacement_cc',
        'engine.power_kw',
        'engine.power_hp',
        'engine.aspiration',
        'engine.fuel_type'
      ]
    },
    {
      sourceId: 'src-bmw-classic-e30-m3-sedan',
      tier: 'TIER_1_PRIMARY',
      title: 'BMW Group Classic — BMW M3 Sedan (E30)',
      publisher: 'Bayerische Motoren Werke AG (BMW Group Classic)',
      referenceUrl: 'https://www.bmwgroup-classic.com/en/models/bmw-classics/product-description-page.ad-1561-1.bmw-m3-sedan-e30.html',
      publishedYear: 2021,
      notes: 'Official BMW Group Classic vehicle documentation for the BMW M3 Sedan (E30) two-door saloon/coupé bodyshell: production period 1986–1990, 1200 kg kerb weight, 17,184 total coupé/saloon units produced.',
      entityIds: [
        'var-bmw-m3-e30-coupe-base'
      ],
      supports: [
        'specs.kerb_weight_kg'
      ]
    },
    {
      sourceId: 'src-bmw-classic-e30-m3-evo2',
      tier: 'TIER_1_PRIMARY',
      title: 'BMW Group Classic — BMW M3 (E30), Evolution II',
      publisher: 'Bayerische Motoren Werke AG (BMW Group Classic)',
      referenceUrl: 'https://www.bmwgroup-classic.com/en/models/bmw-classics/product-description-page.ad-236-1.bmw-m3-e30-evolution-ii.html',
      publishedYear: 2021,
      notes: 'Official BMW Group Classic vehicle documentation for the BMW M3 (E30) Evolution II: production period 04/1988–06/1988, 2302 cc four-cylinder inline engine, 220 hp / 162 kW at 6750 rpm, 243 km/h top speed, limited production series of 500 units.',
      entityIds: ['var-bmw-m3-e30-evo-2'],
      supports: [
        'variant_name',
        'production_start_year',
        'model_year_from',
        'model_year_to',
        'production_total',
        'canonical_engine_id',
        'specs.top_speed_kph',
        'engine.architecture',
        'engine.cylinders',
        'engine.displacement_cc',
        'engine.power_kw',
        'engine.power_hp',
        'engine.aspiration',
        'engine.fuel_type'
      ]
    },
    {
      sourceId: 'src-bmw-classic-e30-m3-sport-evo',
      tier: 'TIER_1_PRIMARY',
      title: 'BMW Group Classic — BMW M3 (E30), Sport Evolution ("Evolution III")',
      publisher: 'Bayerische Motoren Werke AG (BMW Group Classic)',
      referenceUrl: 'https://www.bmwgroup-classic.com/en/models/bmw-classics/product-description-page.ad-238-1.bmw-m3-e30-sport-evolution-evolution-iii.html',
      publishedYear: 2021,
      notes: 'Official BMW Group Classic vehicle documentation for the BMW M3 (E30) Sport Evolution ("Evolution III"): production period 12/1989–03/1990, 2467 cc four-cylinder inline engine, 238 hp / 175 kW at 7000 rpm, 248 km/h top speed, limited homologation run of 600 units.',
      entityIds: ['eng-bmw-s14b25', 'var-bmw-m3-e30-sport-evo'],
      supports: [
        'canonical_name',
        'engine_code',
        'family_name',
        'manufacturer_id',
        'variant_name',
        'production_start_year',
        'model_year_from',
        'model_year_to',
        'production_total',
        'canonical_engine_id',
        'specs.top_speed_kph',
        'specs.displacement_cc',
        'specs.power_kw',
        'specs.power_hp',
        'specs.architecture',
        'specs.cylinders',
        'specs.aspiration',
        'specs.fuel_type',
        'engine.architecture',
        'engine.cylinders',
        'engine.displacement_cc',
        'engine.power_kw',
        'engine.power_hp',
        'engine.aspiration',
        'engine.fuel_type'
      ]
    },
    {
      sourceId: 'src-bmw-classic-e30-m3-convertible',
      tier: 'TIER_1_PRIMARY',
      title: 'BMW Group Classic — BMW M3 (E30) Convertible',
      publisher: 'Bayerische Motoren Werke AG (BMW Group Classic)',
      referenceUrl: 'https://www.bmwgroup-classic.com/en/models/bmw-classics/product-description-page.ad-1562-1.bmw-m3-e30-convertible.html',
      publishedYear: 2021,
      notes: 'Official BMW Group Classic vehicle documentation for the BMW M3 (E30) Convertible: production period 06/1988–06/1991, 2302 cc four-cylinder inline engine, 195 hp / 200 hp / 215 hp calibrations, 235 km/h top speed, 786 units produced.',
      entityIds: ['var-bmw-m3-e30-cabriolet'],
      supports: [
        'variant_name',
        'production_start_year',
        'model_year_from',
        'model_year_to',
        'production_total',
        'canonical_engine_id',
        'specs.top_speed_kph',
        'engine.architecture',
        'engine.cylinders',
        'engine.displacement_cc',
        'engine.power_kw',
        'engine.power_hp',
        'engine.aspiration',
        'engine.fuel_type'
      ]
    },
    {
      sourceId: 'src-bmw-m-registry-e30',
      tier: 'TIER_2_INSTITUTIONAL',
      title: 'BMW M Registry FAQ — E30 M3 Four-Cylinder',
      publisher: 'BMW M Registry',
      referenceUrl: 'http://www.bmwmregistry.com/model_faq.php?id=8',
      publishedYear: 2021,
      notes: 'Detailed registry documentation for factory model type codes (AK01, AK03, AK05, AC79, BB01, BB05), production totals (17,970 overall: 17,184 coupes and 786 convertibles; 14,996 standard 2.3L coupes, 500 Evolution II, 600 Sport Evolution), Getrag 265/5 5-speed manual dogleg gearbox with 25% mechanical limited-slip differential, 70-liter fuel tank capacity, torque curves (240 Nm / 245 Nm), 0-100 acceleration, kerb weights, and 7250 rpm redline.',
      entityIds: [
        'gen-bmw-m3-e30',
        'var-bmw-m3-e30-coupe-base',
        'var-bmw-m3-e30-evo-2',
        'var-bmw-m3-e30-sport-evo',
        'var-bmw-m3-e30-cabriolet',
        'eng-bmw-s14b23',
        'eng-bmw-s14b25'
      ],
      supports: [
        'production_total',
        'category',
        'steering_side',
        'body_style',
        'limited_edition',
        'numbered_series',
        'model_year_to',
        'technical_identifiers',
        'transmission.name',
        'transmission.type',
        'transmission.gears',
        'transmission.manufacturer',
        'transmission.drivetrain',
        'transmission.differential_type',
        'specs.fuel_capacity_l',
        'specs.acceleration_0_100',
        'specs.kerb_weight_kg',
        'specs.torque_nm',
        'specs.redline_rpm',
        'specs.bore_mm',
        'specs.stroke_mm',
        'specs.valves',
        'specs.compression_ratio',
        'specs.wheelbase_mm',
        'specs.length_mm',
        'specs.width_mm',
        'specs.height_mm',
        'engine.torque_nm',
        'engine.redline_rpm',
        'engine.bore_mm',
        'engine.stroke_mm',
        'engine.valves',
        'engine.compression_ratio'
      ]
    },
    {
      sourceId: 'src-bmw-group-corporate',
      tier: 'TIER_1_PRIMARY',
      title: 'BMW Group — Company Portrait & Corporate History',
      publisher: 'Bayerische Motoren Werke AG (BMW Group)',
      referenceUrl: 'https://www.bmwgroup.com',
      publishedYear: 2023,
      notes: 'Official corporate record: Bayerische Motoren Werke AG, founded 1916 in Munich, Germany.',
      entityIds: ['maker-bmw'],
      supports: [
        'canonical_name',
        'official_name',
        'country_code',
        'country_of_origin',
        'founded_year',
        'active',
        'website_url'
      ]
    }
  ],

  // 1. MAKER
  makers: [
    {
      id: 'maker-bmw',
      slug: 'bmw',
      canonical_name: 'BMW',
      official_name: 'Bayerische Motoren Werke AG',
      country_code: 'DE',
      country_of_origin: 'Germany',
      founded_year: 1916,
      active: true,
      catalogue_status: 'PUBLISHED',
      website_url: 'https://www.bmwgroup.com',
      is_ui_fixture: false
    }
  ],

  // 2. MODEL
  models: [
    {
      id: 'model-bmw-m3',
      maker_id: 'maker-bmw',
      slug: 'm3',
      canonical_name: 'M3',
      category: 'Homologation Special',
      introduced_year: 1986,
      discontinued_year: null,
      catalogue_status: 'PUBLISHED',
      catalogue_tier: 'HERO',
      summary_en: 'The BMW M3 is a high-performance sports model developed by BMW Motorsport GmbH, originally created to satisfy Group A touring car homologation regulations.',
      is_ui_fixture: false
    }
  ],

  // 3. GENERATION
  generations: [
    {
      id: 'gen-bmw-m3-e30',
      model_id: 'model-bmw-m3',
      generation_code: 'E30',
      canonical_name: 'M3 E30',
      slug: 'e30',
      production_start: 1986,
      production_end: 1991,
      production_total: 17970,
      catalogue_status: 'PUBLISHED',
      distinctive_features_en: [
        'Box-flared front and rear wheel arches to accommodate widened track',
        'Raised composite rear bootlid and rear wing for aerodynamic downforce',
        'Naturally aspirated 16-valve four-cylinder BMW S14 engine'
      ],
      is_ui_fixture: false
    }
  ],

  // 4. CANONICAL ENGINES
  engines: [
    {
      id: 'eng-bmw-s14b23',
      slug: 'bmw-s14b23',
      canonical_name: 'BMW S14B23 2.3L I4',
      engine_code: 'S14B23',
      family_name: 'BMW S14',
      manufacturer_id: 'maker-bmw',
      specs: {
        architecture: 'Inline-4 DOHC 16V',
        cylinders: 4,
        displacement_cc: 2302,
        aspiration: 'Naturally Aspirated',
        fuel_type: 'Petrol',
        power_kw: null,
        power_hp: null,
        torque_nm: 240,
        bore_mm: 93.4,
        stroke_mm: 84.0,
        valves: 16,
        compression_ratio: '10.5:1',
        redline_rpm: 7250
      },
      data_status: 'verified',
      catalogue_status: 'PUBLISHED',
      is_ui_fixture: false
    },
    {
      id: 'eng-bmw-s14b25',
      slug: 'bmw-s14b25',
      canonical_name: 'BMW S14B25 2.5L I4 Sport Evolution',
      engine_code: 'S14B25',
      family_name: 'BMW S14',
      manufacturer_id: 'maker-bmw',
      specs: {
        architecture: 'Inline-4 DOHC 16V',
        cylinders: 4,
        displacement_cc: 2467,
        aspiration: 'Naturally Aspirated',
        fuel_type: 'Petrol',
        power_kw: 175,
        power_hp: 238,
        torque_nm: 240,
        bore_mm: 95.0,
        stroke_mm: 87.0,
        valves: 16,
        compression_ratio: '10.2:1',
        redline_rpm: 7250
      },
      data_status: 'verified',
      catalogue_status: 'PUBLISHED',
      is_ui_fixture: false
    }
  ],

  // 5. VEHICLE VARIANTS (Authoritative E30 M3 Variants — Zero Unapproved Scores)
  variants: [
    {
      id: 'var-bmw-m3-e30-coupe-base',
      generation_id: 'gen-bmw-m3-e30',
      manufacturer_id: 'maker-bmw',
      manufacturer_name: 'BMW',
      model_name: 'M3',
      slug: 'bmw-m3-e30-coupe',
      variant_name: 'M3 E30 Coupé',
      technical_identifiers: ['AK01', 'AK03', 'AK05'],
      in_primo_piano: true,
      tier: 'Hero',
      category: 'Homologation Special',
      model_year_from: 1986,
      model_year_to: 1991,
      production_start_year: 1986,
      steering_side: 'LHD',
      body_style: 'Coupe',
      limited_edition: false,
      numbered_series: false,
      production_total: 14996,
      canonical_engine_id: 'eng-bmw-s14b23',
      data_status: 'verified',
      catalogue_status: 'PUBLISHED',
      is_ui_fixture: false,
      specs: {
        kerb_weight_kg: 1200,
        length_mm: 4345,
        width_mm: 1680,
        height_mm: 1370,
        wheelbase_mm: 2565,
        top_speed_kph: 230,
        acceleration_0_100: 6.7,
        power_to_weight_hp_ton: 166.7,
        fuel_capacity_l: 70
      },
      engine: {
        architecture: 'Inline-4 DOHC 16V',
        cylinders: 4,
        displacement_cc: 2302,
        aspiration: 'Naturally Aspirated',
        fuel_type: 'Petrol',
        power_kw: 147,
        power_hp: 200,
        torque_nm: 240,
        compression_ratio: '10.5:1',
        bore_mm: 93.4,
        stroke_mm: 84.0,
        valves: 16,
        redline_rpm: 7250
      },
      transmission: {
        id: 'trans-getrag-265-5',
        name: 'Getrag 265/5 Dogleg',
        type: 'Manual',
        gears: 5,
        manufacturer: 'Getrag',
        drivetrain: 'RWD',
        differential_type: '25% Mechanical Limited Slip'
      },
      scores: null
    },
    {
      id: 'var-bmw-m3-e30-evo-2',
      generation_id: 'gen-bmw-m3-e30',
      manufacturer_id: 'maker-bmw',
      manufacturer_name: 'BMW',
      model_name: 'M3',
      slug: 'bmw-m3-e30-evolution-2',
      variant_name: 'M3 E30 Evolution II',
      technical_identifiers: ['AK05'],
      in_primo_piano: true,
      tier: 'Hero',
      category: 'Homologation Special',
      model_year_from: 1988,
      model_year_to: 1988,
      production_start_year: 1988,
      steering_side: 'LHD',
      body_style: 'Coupe',
      limited_edition: true,
      numbered_series: true,
      production_total: 500,
      canonical_engine_id: 'eng-bmw-s14b23',
      data_status: 'verified',
      catalogue_status: 'PUBLISHED',
      is_ui_fixture: false,
      specs: {
        kerb_weight_kg: 1190,
        length_mm: 4345,
        width_mm: 1680,
        height_mm: 1370,
        wheelbase_mm: 2565,
        top_speed_kph: 243,
        acceleration_0_100: 6.4,
        power_to_weight_hp_ton: 184.9,
        fuel_capacity_l: 70
      },
      engine: {
        architecture: 'Inline-4 DOHC 16V',
        cylinders: 4,
        displacement_cc: 2302,
        aspiration: 'Naturally Aspirated',
        fuel_type: 'Petrol',
        power_kw: 162,
        power_hp: 220,
        torque_nm: 245,
        compression_ratio: '11.0:1',
        bore_mm: 93.4,
        stroke_mm: 84.0,
        valves: 16,
        redline_rpm: 7250
      },
      transmission: {
        id: 'trans-getrag-265-5',
        name: 'Getrag 265/5 Dogleg',
        type: 'Manual',
        gears: 5,
        manufacturer: 'Getrag',
        drivetrain: 'RWD',
        differential_type: '25% Mechanical Limited Slip'
      },
      scores: null
    },
    {
      id: 'var-bmw-m3-e30-sport-evo',
      generation_id: 'gen-bmw-m3-e30',
      manufacturer_id: 'maker-bmw',
      manufacturer_name: 'BMW',
      model_name: 'M3',
      slug: 'bmw-m3-e30-sport-evolution',
      variant_name: 'M3 E30 Sport Evolution (Evo III)',
      technical_identifiers: ['AC79'],
      in_primo_piano: true,
      tier: 'Hero',
      category: 'Homologation Special',
      model_year_from: 1990,
      model_year_to: 1990,
      production_start_year: 1990,
      steering_side: 'LHD',
      body_style: 'Coupe',
      limited_edition: true,
      numbered_series: true,
      production_total: 600,
      canonical_engine_id: 'eng-bmw-s14b25',
      data_status: 'verified',
      catalogue_status: 'PUBLISHED',
      is_ui_fixture: false,
      specs: {
        kerb_weight_kg: 1200,
        length_mm: 4345,
        width_mm: 1680,
        height_mm: 1360,
        wheelbase_mm: 2565,
        top_speed_kph: 248,
        acceleration_0_100: 6.1,
        power_to_weight_hp_ton: 198.3,
        fuel_capacity_l: 70
      },
      engine: {
        architecture: 'Inline-4 DOHC 16V',
        cylinders: 4,
        displacement_cc: 2467,
        aspiration: 'Naturally Aspirated',
        fuel_type: 'Petrol',
        power_kw: 175,
        power_hp: 238,
        torque_nm: 240,
        compression_ratio: '10.2:1',
        bore_mm: 95.0,
        stroke_mm: 87.0,
        valves: 16,
        redline_rpm: 7250
      },
      transmission: {
        id: 'trans-getrag-265-5',
        name: 'Getrag 265/5 Dogleg',
        type: 'Manual',
        gears: 5,
        manufacturer: 'Getrag',
        drivetrain: 'RWD',
        differential_type: '25% Mechanical Limited Slip'
      },
      scores: null
    },
    {
      id: 'var-bmw-m3-e30-cabriolet',
      generation_id: 'gen-bmw-m3-e30',
      manufacturer_id: 'maker-bmw',
      manufacturer_name: 'BMW',
      model_name: 'M3',
      slug: 'bmw-m3-e30-cabriolet',
      variant_name: 'M3 E30 Cabriolet',
      technical_identifiers: ['BB01', 'BB05'],
      in_primo_piano: false,
      tier: 'Hero',
      category: 'Youngtimer',
      model_year_from: 1988,
      model_year_to: 1991,
      production_start_year: 1988,
      steering_side: 'LHD',
      body_style: 'Convertible',
      limited_edition: false,
      numbered_series: false,
      production_total: 786,
      canonical_engine_id: 'eng-bmw-s14b23',
      data_status: 'verified',
      catalogue_status: 'PUBLISHED',
      is_ui_fixture: false,
      specs: {
        kerb_weight_kg: 1360,
        length_mm: 4345,
        width_mm: 1680,
        height_mm: 1370,
        wheelbase_mm: 2565,
        top_speed_kph: 235,
        acceleration_0_100: 7.3,
        power_to_weight_hp_ton: 147.1,
        fuel_capacity_l: 70
      },
      engine: {
        architecture: 'Inline-4 DOHC 16V',
        cylinders: 4,
        displacement_cc: 2302,
        aspiration: 'Naturally Aspirated',
        fuel_type: 'Petrol',
        power_kw: 147,
        power_hp: 200,
        torque_nm: 240,
        compression_ratio: '10.5:1',
        bore_mm: 93.4,
        stroke_mm: 84.0,
        valves: 16,
        redline_rpm: 7250
      },
      transmission: {
        id: 'trans-getrag-265-5',
        name: 'Getrag 265/5 Dogleg',
        type: 'Manual',
        gears: 5,
        manufacturer: 'Getrag',
        drivetrain: 'RWD',
        differential_type: '25% Mechanical Limited Slip'
      },
      scores: null
    }
  ]
};
