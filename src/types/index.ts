
export type SpotlightTargetType = 'CAR' | 'MOTORCYCLE' | 'DESIGNER' | 'ENGINEER' | 'RACING_FIGURE' | 'EVENT' | 'EDITORIAL';

export interface HomepageSpotlight {
  id: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  order: number;
  contentType: SpotlightTargetType;
  title: string;
  eyebrow: string;
  summary: string;
  image: string;
  imageAlt: string;
  targetType: SpotlightTargetType;
  targetId?: string;
  targetUrl?: string;
  startAt?: string;
  endAt?: string;
  published: boolean;
}

export interface EditorialStory {
  id: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  title: string;
  subtitle: string;
  excerpt: string;
  body: string;
  heroImage: string;
  imageAlt: string;
  author: string;
  publishedAt: string;
  relatedMakers?: string[];
  relatedMachines?: string[];
  relatedPeople?: string[];
  relatedEngines?: string[];
  featured: boolean;
  homepageOrder: number;
}

export type PersonRole = 'Designer' | 'Engineer' | 'Test Driver' | 'Founder' | 'Racing Driver' | 'Racing Figure';

export interface CanonicalEngine {
  id: string;
  slug: string;
  canonical_name: string;
  engine_code: string;
  family_name?: string;
  manufacturer_id?: string;
  specs: EngineSpec;
  data_status: DataStatus;
  is_ui_fixture?: boolean;
  catalogue_status: CatalogueStatus;
}
export type CatalogueStatus = 'IN_RESEARCH' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';

export type CatalogueTier = 'HERO' | 'CORE' | 'DISCOVERY';

export interface Maker {
  is_ui_fixture?: boolean;
  id: string;
  slug: string;
  canonical_name: string;
  official_name?: string;
  country_code?: string | null;
  country_of_origin?: string | null;
  founded_year?: number | null;
  active: boolean;
  catalogue_status: CatalogueStatus;
  logo_url?: string;
  website_url?: string;
}

export interface Model {
  is_ui_fixture?: boolean;
  id: string;
  maker_id: string;
  canonical_name: string;
  slug: string;
  category?: CategoryType;
  introduced_year?: number | null;
  discontinued_year?: number | null;
  catalogue_status: CatalogueStatus;
  catalogue_tier?: CatalogueTier;
  hero_image_url?: string;
  summary_en?: string;
}

export interface Generation {
  is_ui_fixture?: boolean;
  id: string;
  model_id: string;
  generation_code: string;
  canonical_name: string;
  slug: string;
  production_start?: number | null;
  production_end?: number | null;
  production_total?: number | null;
  production_total_confidence?: 'High' | 'Medium' | 'Low' | 'Insufficient Data';
  catalogue_status: CatalogueStatus;
  distinctive_features_en?: string[];
  hero_image_url?: string;
}

export interface VehicleInstance {
  id: string;
  variant_id: string;
  chassis_number_masked?: string;
  build_date?: string;
  production_sequence?: number;
  current_country_code?: string;
  current_mileage_km?: number;
  originality_status?: string;
  public_visibility: 'PUBLIC' | 'REGISTERED' | 'PREMIUM' | 'EDITORIAL' | 'PRIVATE';
}

export type UserRole = 'visitor' | 'private_user' | 'corporate_user' | 'editor' | 'super_admin';

export type VerificationStatus = 
  | 'imported' 
  | 'AI-extracted' 
  | 'pending-review' 
  | 'verified' 
  | 'disputed' 
  | 'rejected' 
  | 'superseded'
  | 'published';

export type DataStatus = 'demo' | 'provisional' | 'verified' | 'licensed' | 'imported' | 'DEMO';

export type CategoryType = 
  | 'Supercar' 
  | 'Hypercar' 
  | 'Youngtimer' 
  | 'Historic Classic' 
  | 'Instant Classic' 
  | 'Homologation Special' 
  | 'Limited Series' 
  | 'GT / Grand Tourer';

export interface Manufacturer {
  id: string;
  slug: string;
  official_name: string;
  country_code?: string | null;
  founded_year?: number | null;
  active?: boolean | null;
  logo_url: string;
  website_url?: string;
  created_at?: string;
}

export interface VehicleModel {
  id: string;
  manufacturer_id: string;
  manufacturer_name: string;
  slug: string;
  model_name: string;
  category: CategoryType;
  first_production_year: number;
  last_production_year?: number;
  market_status: string;
  collector_relevance: string;
  hero_image_url: string;
}

export interface VehicleGeneration {
  id: string;
  vehicle_model_id: string;
  generation_code: string;
  public_name: string;
  internal_code?: string;
  start_year: number;
  end_year?: number;
  facelift_year?: number;
  body_type: string;
  production_total: number;
  production_total_confidence: 'High' | 'Medium' | 'Low' | 'Insufficient Data';
}

export interface EngineSpec {
  architecture?: string; // e.g., 'V12', 'Flat-6', 'V8 Twin Turbo'
  cylinders?: number | null;
  displacement_cc?: number | null;
  aspiration?: string | null;
  fuel_type?: string | null;
  power_kw?: number | null;
  power_hp?: number | null;
  torque_nm?: number | null;
  compression_ratio?: string;
  bore_mm?: number;
  stroke_mm?: number;
  valves?: number;
  redline_rpm?: number;
}

export interface TransmissionSpec {
  id: string;
  name: string;
  type: 'Manual' | 'Sequential' | 'Dual-Clutch' | 'Automated Manual' | 'Automatic';
  gears: number;
  manufacturer: string;
  drivetrain: 'RWD' | 'AWD' | 'FWD';
  differential_type?: string;
}

export interface TechnicalSpecs {
  kerb_weight_kg: number;
  dry_weight_kg?: number;
  length_mm: number;
  width_mm: number;
  height_mm: number;
  wheelbase_mm: number;
  top_speed_kph: number;
  acceleration_0_100: number; // seconds
  power_to_weight_hp_ton: number;
  fuel_capacity_l: number;
  luggage_capacity_l?: number;
}

export interface CollectorScoreBreakdown {
  overall_score: number; // 0-100
  rarity_weight: number; // 20%
  historical_relevance: number; // 20%
  desirability: number; // 20%
  originality_typical: number; // 10%
  technical_relevance: number; // 10%
  brand_recognizability: number; // 10%
  community_culture: number; // 10%
}

export interface InvestmentScoreBreakdown {
  overall_score: number; // 0-100
  market_trend: number; // 20%
  liquidity: number; // 20%
  supply_scarcity: number; // 15%
  international_demand: number; // 15%
  inverse_volatility: number; // 10%
  inverse_maintenance_cost: number; // 10%
  comparable_stability: number; // 10%
}

export interface Scores {
  collector_score: CollectorScoreBreakdown;
  investment_score: InvestmentScoreBreakdown;
  rarity_score: number; // 0-100
  confidence_level: 'High' | 'Medium' | 'Low' | 'Insufficient Data';
}

export interface PriceHistoryPoint {
  year: number;
  period: string; // e.g., '2021-Q1'
  median_price_eur: number;
  average_price_eur: number;
  lower_quartile_eur: number;
  upper_quartile_eur: number;
  auction_point?: number;
  auction_house?: string;
  auction_event?: string;
}

export interface AuctionResult {
  id: string;
  variant_id: string;
  auction_house_name: string;
  auction_event_name: string;
  lot_number: string;
  auction_date: string;
  country_code: string;
  estimate_low_eur: number;
  estimate_high_eur: number;
  hammer_price_eur: number;
  sale_price_eur: number; // including buyer premium
  sold: boolean;
  mileage_km: number;
  chassis_number_masked: string;
  source_url?: string;
}

export interface Listing {
  id: string;
  partner_dealer_id?: string;
  partner_dealer_name?: string;
  dealer_city?: string;
  dealer_country?: string;
  dealer_verified: boolean;
  variant_id: string;
  title: string;
  description_it: string;
  description_en: string;
  price_eur: number;
  mileage_km: number;
  registration_year: number;
  chassis_number_masked: string;
  condition_grade: 'Mint / Concours' | 'Excellent' | 'Good' | 'Project / Restoration';
  exterior_color: string;
  interior_color: string;
  transmission_type: string;
  published_at: string;
  status: 'active' | 'pending' | 'sold';
  image_urls: string[];
}

export type DealerListing = Listing;

export interface KnownIssue {
  component: string;
  description_it: string;
  description_en: string;
  estimated_fix_cost_eur: string;
  severity: 'High' | 'Medium' | 'Low';
}

export interface VehicleEdition {
  name: string;
  production_count: string | number;
  years?: string;
  description_it: string;
  description_en: string;
  key_features?: string[];
  is_racing?: boolean;
  power_hp?: number;
  torque_nm?: number;
  acceleration_0_100?: string;
  top_speed_kmh?: number;
  curb_weight_kg?: number;
  transmission_info?: string;
  drivetrain?: string;
  generation_code?: string;
  collector_score?: number;
  investment_score?: number;
  price_range_eur?: string;
  median_price_eur?: number;
  body_style?: string;
  image_url?: string;
}

export interface GenerationSummary {
  generation_code: string; // e.g. 'E30', 'E36', 'E46', 'E90 / E92 / E93', 'F80', 'G80 / G81'
  title: string;
  years: string;
  engine_summary: string;
  power_hp_range?: string;
  torque_nm_range?: string;
  acceleration_0_100?: string;
  top_speed_kmh?: number;
  curb_weight_kg_range?: string;
  transmission_info?: string;
  drivetrain?: string;
  collector_score: number;
  investment_score: number;
  price_range_eur: string;
  median_price_eur?: number;
  production_count: string;
  hero_image: string;
  gallery_images?: string[];
  notes_it: string;
  notes_en: string;
}

export interface FactoryColor {
  color_name: string;
  color_code?: string;
  hex_code?: string;
  is_standard_factory: boolean;
  notes_it?: string;
  notes_en?: string;
}

export interface Person {
  id: string;
  full_name: string;
  nationality: string;
  roles: PersonRole[];
  role?: PersonRole; // Legacy compatibility
  biography_it: string;
  biography_en: string;
  avatar_url?: string;
}

export interface HistoricalEvent {
  id: string;
  title_it: string;
  title_en: string;
  description_it: string;
  description_en: string;
  event_date: string;
  event_type: 'Launch' | 'Motorsport Victory' | 'Speed Record' | 'Production End' | 'Auction Record';
  country_code: string;
}

export interface HomeSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaPage: string;
  bgImage: string;
  accentColor?: string;
}

export interface VehicleVariant {
  id: string;
  generation_id: string;
  manufacturer_id: string;
  manufacturer_name: string;
  model_name: string;
  slug: string;
  variant_name: string;
  technical_identifiers?: string[];
  in_primo_piano?: boolean;
  tier?: 'Hero' | 'Core' | 'Discovery';
  category?: CategoryType;
  market_code?: string;
  model_year_from?: number | null;
  model_year_to?: number | null;
  production_start_year?: number | null;
  steering_side?: 'LHD' | 'RHD' | 'Both' | null;
  body_style?: string | null;
  limited_edition?: boolean | null;
  numbered_series?: boolean | null;
  production_total?: number | null;
  original_list_price_eur?: number | null;
  data_status: DataStatus;
  is_ui_fixture?: boolean;
  dataStatus?: DataStatus;
  catalogue_status?: CatalogueStatus;
  catalogueStatus?: CatalogueStatus;
  hero_image_url?: string;
  gallery_images?: string[];
  
  // Detailed specs
  canonical_engine_id?: string | null;
  engine?: EngineSpec | null;
  transmission?: TransmissionSpec | null;
  specs?: TechnicalSpecs | null;
  scores?: Scores | null;
  
  // Market summary
  current_median_price_eur?: number | null;
  price_change_1y_pct?: number | null;
  price_change_3y_pct?: number | null;
  liquidity_score?: number | null; // 0-100
  volatility_score?: number | null; // 0-100
  avg_days_on_market?: number | null;
  
  // Narrative details (Hero/Core level)
  history_it?: string | null;
  history_en?: string | null;
  designers?: Person[];
  engineers?: Person[];
  related_entities?: GraphRelationship[];
  production_site?: string | null;
  known_issues?: KnownIssue[];
  maintenance_complexity?: 'Very High' | 'High' | 'Moderate' | 'Low' | null;
  annual_est_maintenance_eur?: number | null;
  youtube_video_ids?: string[];
  
  // Versions, Editions & Factory Colors Breakdown
  variant_editions?: VehicleEdition[];
  extended_variant_editions?: VehicleEdition[];
  generations_summary?: GenerationSummary[];
  factory_colors?: FactoryColor[];
  production_breakdown_notes_it?: string;
  production_breakdown_notes_en?: string;
  
  // Price history
  price_history?: PriceHistoryPoint[];
  auctions?: AuctionResult[];
  listings?: Listing[];
  historical_events?: HistoricalEvent[];
}

export interface GraphEntity {
  id: string;
  name: string;
  type: 
    | 'Manufacturer'
    | 'MANUFACTURER'
    | 'Model'
    | 'MODEL'
    | 'Generation'
    | 'GENERATION'
    | 'Variant'
    | 'VARIANT'
    | 'VEHICLE'
    | 'Engine'
    | 'Transmission'
    | 'Designer'
    | 'Engineer'
    | 'Factory'
    | 'Event'
    | 'CompetitorModel'
    | 'Auction'
    | string;
  category?: string;
  subtitle?: string;
  image_url?: string;
  slug?: string;
  attributes?: Record<string, any>;
  details?: Record<string, any>;
}

export interface GraphRelationship {
  id: string;
  subject_entity_id: string;
  predicate: 
    | 'MANUFACTURED_BY'
    | 'PART_OF_MODEL'
    | 'PART_OF_GENERATION'
    | 'POWERED_BY'
    | 'DESIGNED_BY'
    | 'ENGINEERED_BY'
    | 'PRODUCED_AT'
    | 'DERIVED_FROM'
    | 'COMPETES_WITH'
    | 'PRECEDED_BY'
    | 'SUCCEEDED_BY'
    | 'SHARES_ENGINE_WITH'
    | 'SHARES_PLATFORM_WITH'
    | 'ASSOCIATED_WITH_EVENT'
    | 'DROVE'
    | 'RODE'
    | 'TESTED'
    | 'DEVELOPED_WITH'
    | 'ASSOCIATED_WITH'
    | string;
  object_entity_id: string;
  confidence_score: number; // 0-100
  verification_status?: VerificationStatus;
  explanation_it?: string;
  explanation_en?: string;
}

export interface DataAssertion {
  id: string;
  entity_type: string;
  entity_id: string;
  attribute_name: string;
  raw_value: string;
  normalized_value: string;
  unit?: string;
  source_name: string;
  retrieved_at: string;
  confidence_score: number;
  verification_status: VerificationStatus;
}

export type SearchEntityType = 'MAKER' | 'MODEL' | 'GENERATION' | 'VARIANT' | 'ENGINE' | 'PERSON' | 'ORGANIZATION';

export interface DiscoveryAction {
  id: string;
  url: string;
  title: string;
}

export interface SearchResult {
  id: string;
  type: SearchEntityType;
  title: string;
  subtitle?: string;
  url: string;
  thumbnail?: string;
  canonicalName?: string;
  makerSlug?: string;
  modelSlug?: string;
  generationSlug?: string;
  variantSlug?: string;
  action?: () => void;
}

export type SearchKeyKind = 
  | 'CANONICAL_NAME'
  | 'DISPLAY_NAME'
  | 'TECHNICAL_CODE'
  | 'GENERATION_CODE'
  | 'ENGINE_CODE'
  | 'CHASSIS_CODE'
  | 'PLATFORM_CODE'
  | 'MARKET_DESIGNATION'
  | 'ALIAS'
  | 'RELATIONAL_CONTEXT';

export interface SearchKey {
  value: string;
  kind: SearchKeyKind;
}

export interface SearchIndexEntry {
  id: string;
  entityType: SearchEntityType;
  searchKeys: SearchKey[];
  canonicalUrl: string;
  title: string;
  subtitle?: string;
  thumbnail?: string;
  makerSlug?: string;
  modelSlug?: string;
  generationSlug?: string;
  variantSlug?: string;
}

export interface SearchFilters {
  query?: string;
  entityTypes?: SearchEntityType[];
  category?: CategoryType | 'All';
  manufacturerId?: string;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  collectorScoreMin?: number;
  investmentScoreMin?: number;
  drivetrain?: 'All' | 'RWD' | 'AWD' | 'FWD';
  transmission?: 'All' | 'Manual' | 'Sequential' | 'Dual-Clutch' | 'Automated Manual' | 'Automatic';
  limitedEditionOnly?: boolean;
  tier?: 'All' | 'Hero' | 'Core' | 'Discovery';
  dataStatus?: 'All' | DataStatus;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  referenced_vehicle_slugs?: string[];
  report_data?: any;
}

// -------------------------------------------------------------
// HIERARCHICAL NAVIGATION & ASSET TYPES
// -------------------------------------------------------------

export interface ManufacturerSummary {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  countryCode?: string;
}

export interface VehicleModelSummary {
  id: string;
  name: string;
  slug: string;
  years: string;
  category?: string;
}

export interface VariantNavigationItem {
  id: string;
  slug: string;
  name: string;
  years: string;
  limitedEdition: boolean;
  productionTotal?: number;
  active?: boolean | null;
  powerHp?: number;
}

export interface GenerationNavigationItem {
  id: string;
  code: string;
  name: string;
  years: string;
  slug: string;
  variants: VariantNavigationItem[];
}

export interface VehicleFamilyNavigation {
  manufacturer: ManufacturerSummary;
  model: VehicleModelSummary;
  generations: GenerationNavigationItem[];
  activeGenerationId?: string;
  activeVariantId?: string;
}

export type ImageRole = 
  | 'hero' 
  | 'exterior' 
  | 'interior' 
  | 'engine' 
  | 'detail' 
  | 'historical' 
  | 'racing' 
  | 'production';

export interface MediaAsset {
  id: string;
  entityType: 'model' | 'generation' | 'variant';
  entityId: string;
  sourceUrl: string;
  storageUrl?: string;
  author?: string;
  licence?: string;
  attributionText?: string;
  copyrightStatus?: 'Public Domain' | 'Creative Commons' | 'Editorial Rights Reserved' | 'Platform License';
  editorialApproval: boolean;
  imageRole: ImageRole;
  caption_it?: string;
  caption_en?: string;
}

export type VideoType = 
  | 'overview' 
  | 'road_test' 
  | 'technical' 
  | 'historical' 
  | 'buying_guide' 
  | 'auction' 
  | 'restoration' 
  | 'driving';

export interface VideoAsset {
  id: string;
  youtubeVideoId: string;
  entityType: 'model' | 'generation' | 'variant';
  entityId: string;
  title: string;
  channelName: string;
  language: 'it' | 'en' | 'multilingual';
  videoType: VideoType;
  editorialApproval: boolean;
  lastAvailabilityCheck?: string;
}

export interface ProductionRecord {
  id: string;
  entityType: 'model' | 'generation' | 'variant';
  entityId: string;
  value: number;
  aggregationLevel: 'model_total' | 'generation_total' | 'variant_total' | 'year' | 'market' | 'body_style' | 'steering' | 'limited_edition';
  year?: number;
  market?: string;
  bodyStyle?: string;
  steeringSide?: 'LHD' | 'RHD';
  source: string;
  confidenceScore: number; // 0-100
  verificationStatus: VerificationStatus;
}

export interface VehicleModelHierarchy {
  modelId: string;
  manufacturerId: string;
  manufacturerName: string;
  manufacturerSlug: string;
  modelName: string;
  modelSlug: string;
  category?: CategoryType | null;
  yearsRange?: string | null;
  totalGenerationsCount?: number | null;
  totalVariantsCount?: number | null;
  historicSummaryIt?: string | null;
  historicSummaryEn?: string | null;
  powerHpRange?: [number, number] | null;
  collectorScoreOverall?: number | null;
  investmentScoreOverall?: number | null;
  priceRangeEur?: { min: number; max: number } | null;
  heroImageUrl?: string | null;
  competitors?: { name: string; slug: string; manufacturer: string; image_url: string }[];
}

export interface VehicleGenerationHierarchy {
  generationId: string;
  modelId: string;
  generationCode: string;
  generationSlug: string;
  publicName: string;
  yearsRange: string;
  productionTotal: number;
  descriptionIt: string;
  descriptionEn: string;
  distinctiveFeaturesIt: string[];
  distinctiveFeaturesEn: string[];
  availableEngines: string[];
  bodyStyles: string[];
  markets: string[];
  updateChronology: { year: number; eventIt: string; eventEn: string }[];
  heroImageUrl: string;
}


export type AssetStatus = 'RESOLVED' | 'UNAVAILABLE' | 'INVALID' | 'AMBIGUOUS';

export type SourceProvider = 'WIKIMEDIA' | 'OFFICIAL';

export interface MakerLogoAsset {
  maker_id: string;
  source_provider: SourceProvider;
  wikidata_entity_id?: string;
  source_file_name?: string;
  source_url?: string;
  source_page_url?: string;
  retrieved_at: string;
  mime_type?: string;
  asset_status: AssetStatus;
  internal_asset_url?: string;
}
