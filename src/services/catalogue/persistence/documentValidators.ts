import { Maker, Model, Generation, VehicleVariant, CanonicalEngine, CatalogueStatus, DataStatus } from '../../../types/index.js';
import { CatalogueIntegrityError } from '../types.js';

function ensureNonEmptyString(val: any, fieldName: string, entityType: string, docId: string): string {
  if (typeof val !== 'string' || !val.trim()) {
    throw new CatalogueIntegrityError(
      `Malformed persistent ${entityType} document "${docId}": missing or invalid required string field "${fieldName}".`,
      [{
        severity: 'ERROR',
        entityType: entityType.toUpperCase() as any,
        entityId: docId,
        field: fieldName,
        message: `Field "${fieldName}" must be a non-empty string.`
      }]
    );
  }
  return val.trim();
}

function normalizeNumberOrNull(val: any, fieldName: string, entityType: string, docId: string): number | null {
  if (val === null || val === undefined) {
    return null;
  }
  if (typeof val === 'number') {
    if (isNaN(val)) {
      throw new CatalogueIntegrityError(
        `Malformed persistent ${entityType} document "${docId}": field "${fieldName}" is NaN.`,
        [{
          severity: 'ERROR',
          entityType: entityType.toUpperCase() as any,
          entityId: docId,
          field: fieldName,
          message: `Field "${fieldName}" is NaN.`
        }]
      );
    }
    return val;
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  throw new CatalogueIntegrityError(
    `Malformed persistent ${entityType} document "${docId}": field "${fieldName}" must be a number or null. Received: ${JSON.stringify(val)}`,
    [{
      severity: 'ERROR',
      entityType: entityType.toUpperCase() as any,
      entityId: docId,
      field: fieldName,
      message: `Field "${fieldName}" must be numeric or null.`
    }]
  );
}

export function validateAndNormalizeMaker(raw: any, docId: string): Maker {
  if (!raw || typeof raw !== 'object') {
    throw new CatalogueIntegrityError(`Invalid document data for Maker "${docId}".`);
  }

  const id = raw.id ? ensureNonEmptyString(raw.id, 'id', 'Maker', docId) : docId;
  const slug = ensureNonEmptyString(raw.slug, 'slug', 'Maker', id);
  const nameValue = raw.canonical_name || raw.name;
  const canonical_name = ensureNonEmptyString(nameValue, 'canonical_name', 'Maker', id);

  return {
    id,
    slug,
    canonical_name,
    official_name: typeof raw.official_name === 'string' ? raw.official_name : undefined,
    country_code: raw.country_code ?? null,
    country_of_origin: raw.country_of_origin ?? (raw.country || null),
    founded_year: normalizeNumberOrNull(raw.founded_year, 'founded_year', 'Maker', id),
    active: typeof raw.active === 'boolean' ? raw.active : true,
    catalogue_status: (raw.catalogue_status as CatalogueStatus) || 'PUBLISHED',
    logo_url: typeof raw.logo_url === 'string' ? raw.logo_url : undefined,
    website_url: typeof raw.website_url === 'string' ? raw.website_url : undefined,
    is_ui_fixture: !!raw.is_ui_fixture
  };
}

export function validateAndNormalizeModel(raw: any, docId: string): Model {
  if (!raw || typeof raw !== 'object') {
    throw new CatalogueIntegrityError(`Invalid document data for Model "${docId}".`);
  }

  const id = raw.id ? ensureNonEmptyString(raw.id, 'id', 'Model', docId) : docId;
  const maker_id = ensureNonEmptyString(raw.maker_id, 'maker_id', 'Model', id);
  const slug = ensureNonEmptyString(raw.slug, 'slug', 'Model', id);
  const nameValue = raw.canonical_name || raw.name;
  const canonical_name = ensureNonEmptyString(nameValue, 'canonical_name', 'Model', id);

  return {
    id,
    maker_id,
    slug,
    canonical_name,
    category: raw.category,
    introduced_year: normalizeNumberOrNull(raw.introduced_year || raw.year_start, 'introduced_year', 'Model', id),
    discontinued_year: normalizeNumberOrNull(raw.discontinued_year || raw.year_end, 'discontinued_year', 'Model', id),
    catalogue_status: (raw.catalogue_status as CatalogueStatus) || 'PUBLISHED',
    catalogue_tier: raw.catalogue_tier,
    hero_image_url: typeof raw.hero_image_url === 'string' ? raw.hero_image_url : undefined,
    summary_en: typeof raw.summary_en === 'string' ? raw.summary_en : undefined,
    is_ui_fixture: !!raw.is_ui_fixture
  };
}

export function validateAndNormalizeGeneration(raw: any, docId: string): Generation {
  if (!raw || typeof raw !== 'object') {
    throw new CatalogueIntegrityError(`Invalid document data for Generation "${docId}".`);
  }

  const id = raw.id ? ensureNonEmptyString(raw.id, 'id', 'Generation', docId) : docId;
  const model_id = ensureNonEmptyString(raw.model_id, 'model_id', 'Generation', id);
  const nameValue = raw.canonical_name || raw.name || raw.generation_code;
  const canonical_name = ensureNonEmptyString(nameValue, 'canonical_name', 'Generation', id);
  const generation_code = typeof raw.generation_code === 'string' && raw.generation_code.trim() 
    ? raw.generation_code.trim() 
    : canonical_name;
  const slug = ensureNonEmptyString(raw.slug, 'slug', 'Generation', id);

  return {
    id,
    model_id,
    generation_code,
    canonical_name,
    slug,
    production_start: normalizeNumberOrNull(raw.production_start || raw.production_start_year, 'production_start', 'Generation', id),
    production_end: normalizeNumberOrNull(raw.production_end || raw.production_end_year, 'production_end', 'Generation', id),
    production_total: normalizeNumberOrNull(raw.production_total, 'production_total', 'Generation', id),
    production_total_confidence: raw.production_total_confidence,
    catalogue_status: (raw.catalogue_status as CatalogueStatus) || 'PUBLISHED',
    distinctive_features_en: Array.isArray(raw.distinctive_features_en) ? raw.distinctive_features_en : undefined,
    hero_image_url: typeof raw.hero_image_url === 'string' ? raw.hero_image_url : undefined,
    is_ui_fixture: !!raw.is_ui_fixture
  };
}

export function validateAndNormalizeVariant(raw: any, docId: string): VehicleVariant {
  if (!raw || typeof raw !== 'object') {
    throw new CatalogueIntegrityError(`Invalid document data for VehicleVariant "${docId}".`);
  }

  const id = raw.id ? ensureNonEmptyString(raw.id, 'id', 'VehicleVariant', docId) : docId;
  const generation_id = ensureNonEmptyString(raw.generation_id, 'generation_id', 'VehicleVariant', id);
  const manufacturer_id = typeof raw.manufacturer_id === 'string' && raw.manufacturer_id.trim()
    ? raw.manufacturer_id.trim()
    : typeof raw.maker_id === 'string' && raw.maker_id.trim()
      ? raw.maker_id.trim()
      : 'UNKNOWN_MANUFACTURER';
  const manufacturer_name = typeof raw.manufacturer_name === 'string' && raw.manufacturer_name.trim()
    ? raw.manufacturer_name.trim()
    : 'Unknown Manufacturer';
  const model_name = typeof raw.model_name === 'string' && raw.model_name.trim()
    ? raw.model_name.trim()
    : 'Unknown Model';
  const slug = ensureNonEmptyString(raw.slug, 'slug', 'VehicleVariant', id);
  const nameValue = raw.variant_name || raw.name || raw.canonical_name;
  const variant_name = ensureNonEmptyString(nameValue, 'variant_name', 'VehicleVariant', id);

  return {
    id,
    generation_id,
    manufacturer_id,
    manufacturer_name,
    model_name,
    slug,
    variant_name,
    production_start_year: normalizeNumberOrNull(raw.production_start_year || raw.year_start, 'production_start_year', 'VehicleVariant', id),
    body_style: raw.body_style || 'Coupe',
    category: raw.category || 'GT / Grand Tourer',
    hero_image_url: typeof raw.hero_image_url === 'string' && raw.hero_image_url.trim() ? raw.hero_image_url.trim() : undefined,
    data_status: (raw.data_status as DataStatus) || 'verified',
    catalogue_status: (raw.catalogue_status as CatalogueStatus) || 'PUBLISHED',
    is_ui_fixture: !!raw.is_ui_fixture,
    specs: raw.specs || null,
    engine: raw.engine || null,
    scores: raw.scores || null
  };
}

export function validateAndNormalizeEngine(raw: any, docId: string): CanonicalEngine {
  if (!raw || typeof raw !== 'object') {
    throw new CatalogueIntegrityError(`Invalid document data for CanonicalEngine "${docId}".`);
  }

  const id = raw.id ? ensureNonEmptyString(raw.id, 'id', 'CanonicalEngine', docId) : docId;
  const slug = ensureNonEmptyString(raw.slug, 'slug', 'CanonicalEngine', id);
  const nameValue = raw.canonical_name || raw.name;
  const canonical_name = ensureNonEmptyString(nameValue, 'canonical_name', 'CanonicalEngine', id);
  const engine_code = typeof raw.engine_code === 'string' && raw.engine_code.trim()
    ? raw.engine_code.trim()
    : typeof raw.code === 'string' && raw.code.trim()
      ? raw.code.trim()
      : 'UNKNOWN_CODE';

  return {
    id,
    slug,
    canonical_name,
    engine_code,
    family_name: typeof raw.family_name === 'string' ? raw.family_name : undefined,
    manufacturer_id: typeof raw.manufacturer_id === 'string' ? raw.manufacturer_id : undefined,
    specs: raw.specs || {
      architecture: raw.architecture || 'Flat-6',
      displacement_cc: normalizeNumberOrNull(raw.displacement_cc, 'displacement_cc', 'CanonicalEngine', id) ?? 0,
      aspiration: raw.aspiration || raw.induction || 'Naturally Aspirated',
      fuel_type: raw.fuel_type || 'Petrol',
      power_hp: normalizeNumberOrNull(raw.power_hp, 'power_hp', 'CanonicalEngine', id) ?? 0,
      torque_nm: normalizeNumberOrNull(raw.torque_nm, 'torque_nm', 'CanonicalEngine', id) ?? 0
    },
    data_status: (raw.data_status as DataStatus) || 'verified',
    catalogue_status: (raw.catalogue_status as CatalogueStatus) || 'PUBLISHED',
    is_ui_fixture: !!raw.is_ui_fixture
  };
}
