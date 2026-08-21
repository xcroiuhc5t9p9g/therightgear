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
  version: '1.1.0',
  description: 'First controlled, authoritative real-world canonical catalogue dataset for BMW M3 (E30 Generation), audited under DATA-16R data integrity standards.',
  sources: [
    {
      sourceId: 'src-fia-homologation-a5327',
      tier: 'TIER_1_PRIMARY',
      title: 'FIA Homologation Form A-5327 — BMW M3 (Group A)',
      publisher: 'Fédération Internationale de l’Automobile (FIA)',
      documentRef: 'FIA Form A-5327 (Valid from 01/03/1987)',
      publishedYear: 1987,
      notes: 'Official international racing and road homologation document specifying base chassis dimensions, engine displacement (2302 cc), bore (93.4 mm), stroke (84.0 mm), 4-valve cylinder head, and 5-speed manual gearbox.',
      entityIds: ['eng-bmw-s14b23', 'var-bmw-m3-e30-coupe-base', 'gen-bmw-m3-e30'],
      supports: ['specs.cylinders', 'specs.displacement_cc', 'specs.bore_mm', 'specs.stroke_mm', 'specs.valves', 'engine.cylinders', 'engine.displacement_cc', 'engine.bore_mm', 'engine.stroke_mm', 'engine.valves', 'transmission.type', 'transmission.gears']
    },
    {
      sourceId: 'src-fia-homologation-a5327-evo2',
      tier: 'TIER_1_PRIMARY',
      title: 'FIA Homologation Form A-5327 Extension 03/03-EVO — BMW M3 Evolution (Evo II)',
      publisher: 'Fédération Internationale de l’Automobile (FIA)',
      documentRef: 'FIA Extension Form 03/03-EVO (Valid from 01/03/1988)',
      publishedYear: 1988,
      notes: 'Official Evolution homologation certificate specifying Evolution II engine modifications (higher compression ratio 11.0:1, 220 PS / 162 kW at 6750 rpm) and aerodynamic front and rear spoilers.',
      entityIds: ['var-bmw-m3-e30-evo-2'],
      supports: ['specs.cylinders', 'specs.displacement_cc', 'specs.bore_mm', 'specs.stroke_mm', 'specs.valves', 'specs.power_kw', 'specs.power_hp', 'engine.power_kw', 'engine.power_hp', 'engine.compression_ratio']
    },
    {
      sourceId: 'src-fia-homologation-a5327-sport-evo',
      tier: 'TIER_1_PRIMARY',
      title: 'FIA Homologation Form A-5327 Extension 07/05-ET — BMW M3 Sport Evolution',
      publisher: 'Fédération Internationale de l’Automobile (FIA)',
      documentRef: 'FIA Extension Form 07/05-ET (Valid from 01/03/1990)',
      publishedYear: 1990,
      notes: 'Official Evolution homologation certificate defining 2.5L engine evolution: displacement (2467 cc), bore (95.0 mm), stroke (87.0 mm), 238 PS (175 kW at 7000 rpm), adjustable front splitter and rear wing.',
      entityIds: ['eng-bmw-s14b25', 'var-bmw-m3-e30-sport-evo'],
      supports: ['specs.cylinders', 'specs.displacement_cc', 'specs.bore_mm', 'specs.stroke_mm', 'specs.valves', 'specs.power_kw', 'specs.power_hp', 'engine.power_kw', 'engine.power_hp', 'engine.displacement_cc', 'engine.bore_mm', 'engine.stroke_mm']
    },
    {
      sourceId: 'src-bmw-classic-e30-m3',
      tier: 'TIER_1_PRIMARY',
      title: 'BMW Group Classic Archive — BMW M3 (E30) Technical Specifications & Production Records',
      publisher: 'BMW AG / BMW Group Classic, Munich',
      referenceUrl: 'https://www.bmwgroup-classic.com',
      publishedYear: 2016,
      notes: 'Manufacturer historical archive for E30 M3 series production figures, technical data, launch year (1986), and end of production (1991).',
      entityIds: ['maker-bmw', 'model-bmw-m3', 'gen-bmw-m3-e30', 'var-bmw-m3-e30-coupe-base', 'var-bmw-m3-e30-evo-2', 'var-bmw-m3-e30-sport-evo', 'var-bmw-m3-e30-cabriolet'],
      supports: ['introduced_year', 'production_start', 'production_end', 'model_year_from', 'model_year_to', 'power_kw', 'power_hp', 'kerb_weight_kg', 'top_speed_kph', 'acceleration_0_100']
    },
    {
      sourceId: 'src-bmw-m-registry-e30',
      tier: 'TIER_2_INSTITUTIONAL',
      title: 'BMW M Registry FAQ — E30 M3 Four-Cylinder',
      publisher: 'BMW M Registry / International BMW Registry Foundation',
      referenceUrl: 'http://www.bmwmregistry.com/model_faq.php?id=8',
      publishedYear: 2021,
      notes: 'Authoritative registry documentation of worldwide production quantities (17,970 total E30 M3: 17,184 coupes and 786 convertibles), factory model type codes (AK01, AK03, AK05, AC79, BB01, BB05), and variant specifications.',
      entityIds: ['gen-bmw-m3-e30', 'var-bmw-m3-e30-coupe-base', 'var-bmw-m3-e30-evo-2', 'var-bmw-m3-e30-sport-evo', 'var-bmw-m3-e30-cabriolet'],
      supports: ['production_total', 'technical_identifiers', 'limited_edition', 'numbered_series', 'steering_side', 'body_style']
    },
    {
      sourceId: 'src-bmw-group-corporate',
      tier: 'TIER_1_PRIMARY',
      title: 'BMW Group Company Portrait & Corporate History',
      publisher: 'Bayerische Motoren Werke AG (BMW Group)',
      referenceUrl: 'https://www.bmwgroup.com',
      publishedYear: 2023,
      notes: 'Official corporate record: Bayerische Motoren Werke AG, founded 1916 in Munich, Germany.',
      entityIds: ['maker-bmw'],
      supports: ['canonical_name', 'official_name', 'country_code', 'country_of_origin', 'founded_year', 'active']
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
        'Box-flared front and rear wheel arches to accommodate widened track and competition wheel fitments',
        'Raised composite rear bootlid and rear wing for aerodynamic downforce (FIA homologation A-5327)',
        'Naturally aspirated 16-valve four-cylinder BMW S14 engine with individual throttle bodies',
        'Getrag 265/5 5-speed manual dogleg transmission',
        '25% mechanical limited-slip differential as standard factory equipment'
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
        power_kw: 147,
        power_hp: 200,
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
        top_speed_kph: 235,
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
      production_total: 501,
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
        top_speed_kph: 228,
        acceleration_0_100: 7.3,
        power_to_weight_hp_ton: 158.1,
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
