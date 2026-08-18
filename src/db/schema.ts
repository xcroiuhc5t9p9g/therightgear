// ============================================================================
// AUTOMOTIVE CANONICAL KNOWLEDGE GRAPH & CATALOGUE - POSTGRESQL SCHEMA DEFINITION
// ============================================================================

export const POSTGRES_SCHEMA_SQL = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MAKERS TABLE
CREATE TABLE IF NOT EXISTS makers (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(128) UNIQUE NOT NULL,
  canonical_name VARCHAR(128) NOT NULL,
  country_code CHAR(2) NOT NULL,
  founded_year INTEGER,
  active BOOLEAN DEFAULT TRUE,
  catalogue_status VARCHAR(32) DEFAULT 'IN_RESEARCH',
  logo_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. MODELS TABLE
CREATE TABLE IF NOT EXISTS models (
  id VARCHAR(64) PRIMARY KEY,
  maker_id VARCHAR(64) NOT NULL REFERENCES makers(id) ON DELETE CASCADE,
  canonical_name VARCHAR(128) NOT NULL,
  slug VARCHAR(128) UNIQUE NOT NULL,
  category VARCHAR(64) NOT NULL,
  introduced_year INTEGER NOT NULL,
  discontinued_year INTEGER,
  catalogue_status VARCHAR(32) DEFAULT 'IN_RESEARCH',
  catalogue_tier VARCHAR(32) DEFAULT 'CORE',
  hero_image_url TEXT,
  summary_en TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. GENERATIONS TABLE
CREATE TABLE IF NOT EXISTS generations (
  id VARCHAR(64) PRIMARY KEY,
  model_id VARCHAR(64) NOT NULL REFERENCES models(id) ON DELETE CASCADE,
  generation_code VARCHAR(64) NOT NULL,
  canonical_name VARCHAR(128) NOT NULL,
  slug VARCHAR(128) UNIQUE NOT NULL,
  production_start INTEGER NOT NULL,
  production_end INTEGER,
  production_total INTEGER,
  production_total_confidence VARCHAR(32) DEFAULT 'High',
  catalogue_status VARCHAR(32) DEFAULT 'IN_RESEARCH',
  distinctive_features_en TEXT[],
  hero_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. VARIANTS TABLE
CREATE TABLE IF NOT EXISTS variants (
  id VARCHAR(64) PRIMARY KEY,
  generation_id VARCHAR(64) NOT NULL REFERENCES generations(id) ON DELETE CASCADE,
  maker_id VARCHAR(64) NOT NULL REFERENCES makers(id),
  canonical_name VARCHAR(128) NOT NULL,
  slug VARCHAR(128) UNIQUE NOT NULL,
  body_style VARCHAR(64) NOT NULL,
  model_year_from INTEGER NOT NULL,
  model_year_to INTEGER,
  steering_side VARCHAR(16) DEFAULT 'LHD',
  limited_edition BOOLEAN DEFAULT FALSE,
  numbered_series BOOLEAN DEFAULT FALSE,
  production_total INTEGER,
  catalogue_status VARCHAR(32) DEFAULT 'IN_RESEARCH',
  catalogue_tier VARCHAR(32) DEFAULT 'CORE',
  hero_image_url TEXT,
  current_median_price_eur NUMERIC(12,2),
  collector_score INTEGER,
  investment_score INTEGER,
  history_en TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. VEHICLE INSTANCES TABLE (CHASSIS LEVEL)
CREATE TABLE IF NOT EXISTS vehicle_instances (
  id VARCHAR(64) PRIMARY KEY,
  variant_id VARCHAR(64) NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
  chassis_number_masked VARCHAR(64),
  build_date DATE,
  production_sequence INTEGER,
  current_country_code CHAR(2),
  current_mileage_km INTEGER,
  originality_status VARCHAR(64),
  public_visibility VARCHAR(32) DEFAULT 'PUBLIC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. DATA SOURCES TABLE
CREATE TABLE IF NOT EXISTS data_sources (
  id VARCHAR(64) PRIMARY KEY,
  source_name VARCHAR(128) NOT NULL,
  source_type VARCHAR(64) NOT NULL,
  license_type VARCHAR(64),
  confidence_baseline INTEGER DEFAULT 80,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. DATA ASSERTIONS TABLE (PROVENANCE)
CREATE TABLE IF NOT EXISTS data_assertions (
  id VARCHAR(64) PRIMARY KEY,
  source_id VARCHAR(64) REFERENCES data_sources(id),
  entity_type VARCHAR(64) NOT NULL,
  entity_id VARCHAR(64) NOT NULL,
  attribute_name VARCHAR(64) NOT NULL,
  raw_value TEXT,
  normalized_value TEXT,
  confidence_score INTEGER DEFAULT 80,
  verification_status VARCHAR(32) DEFAULT 'pending-review',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR FAST GRAPH / CATALOGUE QUERYING
CREATE INDEX IF NOT EXISTS idx_models_maker ON models(maker_id);
CREATE INDEX IF NOT EXISTS idx_generations_model ON generations(model_id);
CREATE INDEX IF NOT EXISTS idx_variants_generation ON variants(generation_id);
CREATE INDEX IF NOT EXISTS idx_variants_slug ON variants(slug);
`;
