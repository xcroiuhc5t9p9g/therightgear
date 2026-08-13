import { Maker, Model, Generation, VehicleVariant } from '../types';

// ============================================================================
// CONTROLLED TEST CATALOGUE (PROJECT MANUAL SECTION 15)
// ============================================================================

export const TEST_MAKERS: Maker[] = [
  {
    id: 'm-bmw',
    slug: 'bmw',
    canonical_name: 'BMW',
    active: true,
    catalogue_status: 'IN_RESEARCH',
    logo_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&auto=format&fit=crop'
  }
];

export const TEST_MODELS: Model[] = [
  {
    id: 'bmw-m3',
    maker_id: 'm-bmw',
    canonical_name: 'M3',
    slug: 'm3',
    category: 'Youngtimer',
    catalogue_status: 'IN_RESEARCH',
    catalogue_tier: 'HERO',
    hero_image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop'
  }
];

export const TEST_GENERATIONS: Generation[] = [
  {
    id: 'bmw-m3-e30',
    model_id: 'bmw-m3',
    generation_code: 'E30',
    canonical_name: 'E30',
    slug: 'e30',
    catalogue_status: 'IN_RESEARCH',
    hero_image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop'
  }
];

export const TEST_VARIANTS: VehicleVariant[] = [
  // 1. BMW M3 2.3
  {
    id: 'bmw-m3-e30-2-3',
    generation_id: 'bmw-m3-e30',
    manufacturer_id: 'm-bmw',
    manufacturer_name: 'BMW',
    model_name: 'M3',
    slug: 'bmw-m3-2-3',
    variant_name: 'M3 2.3',
    tier: 'Core',
    category: 'Youngtimer',
    catalogue_status: 'IN_RESEARCH',
    catalogueStatus: 'IN_RESEARCH',
    data_status: 'verified',
    dataStatus: 'verified',
    production_start_year: 1986,
    model_year_from: 1986,
    model_year_to: 1991,
    production_total: 17970,
    hero_image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop',
    gallery_images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop'],
    engine: {
      id: 'eng-s14b23',
      manufacturer_id: 'm-bmw',
      engine_code: 'S14B23',
      family_name: 'BMW S14',
      architecture: 'Inline-4 DOHC 16v',
      cylinders: 4,
      displacement_cc: 2302,
      aspiration: 'Naturally Aspirated',
      fuel_type: 'Petrol',
      power_kw: 147,
      power_hp: 200,
      torque_nm: 240
    },
    transmission: {
      id: 'trans-getrag-265',
      name: 'Getrag 265 5-Speed Manual Dog-Leg',
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
      top_speed_kph: 235,
      acceleration_0_100: 6.7,
      power_to_weight_hp_ton: 166.7,
      fuel_capacity_l: 62
    }
  },

  // 2. BMW M3 Evolution II
  {
    id: 'bmw-m3-e30-evolution-2',
    generation_id: 'bmw-m3-e30',
    manufacturer_id: 'm-bmw',
    manufacturer_name: 'BMW',
    model_name: 'M3',
    slug: 'bmw-m3-evolution-ii',
    variant_name: 'M3 Evolution II',
    tier: 'Core',
    category: 'Youngtimer',
    catalogue_status: 'IN_RESEARCH',
    catalogueStatus: 'IN_RESEARCH',
    data_status: 'verified',
    dataStatus: 'verified',
    production_start_year: 1988,
    model_year_from: 1988,
    model_year_to: 1988,
    production_total: 500,
    hero_image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop',
    gallery_images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop'],
    engine: {
      id: 'eng-s14b23-evo2',
      manufacturer_id: 'm-bmw',
      engine_code: 'S14B23 Evo II',
      family_name: 'BMW S14',
      architecture: 'Inline-4 DOHC 16v',
      cylinders: 4,
      displacement_cc: 2302,
      aspiration: 'Naturally Aspirated',
      fuel_type: 'Petrol',
      power_kw: 162,
      power_hp: 220,
      torque_nm: 245
    },
    transmission: {
      id: 'trans-getrag-265-evo',
      name: 'Getrag 265 5-Speed Manual Dog-Leg',
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
      top_speed_kph: 243,
      acceleration_0_100: 6.7,
      power_to_weight_hp_ton: 183.3,
      fuel_capacity_l: 62
    }
  },

  // 3. BMW M3 Sport Evolution
  {
    id: 'bmw-m3-e30-sport-evolution',
    generation_id: 'bmw-m3-e30',
    manufacturer_id: 'm-bmw',
    manufacturer_name: 'BMW',
    model_name: 'M3',
    slug: 'bmw-m3-sport-evolution',
    variant_name: 'M3 Sport Evolution',
    tier: 'Hero',
    category: 'Youngtimer',
    catalogue_status: 'IN_RESEARCH',
    catalogueStatus: 'IN_RESEARCH',
    data_status: 'verified',
    dataStatus: 'verified',
    production_start_year: 1990,
    model_year_from: 1990,
    model_year_to: 1990,
    production_total: 600,
    hero_image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop',
    gallery_images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop'],
    engine: {
      id: 'eng-s14b25',
      manufacturer_id: 'm-bmw',
      engine_code: 'S14B25',
      family_name: 'BMW S14',
      architecture: 'Inline-4 DOHC 16v',
      cylinders: 4,
      displacement_cc: 2467,
      aspiration: 'Naturally Aspirated',
      fuel_type: 'Petrol',
      power_kw: 175,
      power_hp: 238,
      torque_nm: 240
    },
    transmission: {
      id: 'trans-getrag-265-sport-evo',
      name: 'Getrag 265 5-Speed Manual Dog-Leg',
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
      power_to_weight_hp_ton: 198.3,
      fuel_capacity_l: 62
    }
  }
];
