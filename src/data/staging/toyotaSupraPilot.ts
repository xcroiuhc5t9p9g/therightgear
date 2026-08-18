// ============================================================================
// THE RIGHT GEAR - IMPORT LAB STAGING
// PILOT: TOYOTA SUPRA
// PHASE: DRY RUN / STRUCTURAL NORMALIZATION
// STATUS: NON-CANONICAL CANDIDATES ONLY. DO NOT USE IN PRODUCTION UI.
// ============================================================================

export type ValidationStatus = 'CANDIDATE' | 'CONFLICT' | 'VALIDATED';
export type MarketScope = 'Japan' | 'Europe' | 'North America' | 'Global' | 'Unknown';
export type VariantClassification = 'TRIM' | 'SPECIAL_EDITION' | 'HOMOLOGATION_SPECIAL' | 'MARKET_SPECIFIC_VERSION' | 'POWERTRAIN_CONFIGURATION' | 'UNKNOWN';

export interface ImportAssertion<T = any> {
  value: T;
  source: string;
  marketScope?: MarketScope;
  isEditorial?: boolean;
  notes?: string;
}

export interface StagingEntity {
  entityType: 'MAKER' | 'MODEL' | 'GENERATION' | 'VARIANT' | 'ENGINE' | 'EDITORIAL';
  proposedId: string;
  proposedSlug: string;
  proposedName: string;
  parentId?: string;
  aliases?: ImportAssertion<string>[];
  assertions: Record<string, ImportAssertion[]>;
  validationStatus: ValidationStatus;
}

export const TOYOTA_SUPRA_PILOT_DATA: StagingEntity[] = [
  // ---------------------------------------------------------
  // MAKER
  // ---------------------------------------------------------
  {
    entityType: 'MAKER',
    proposedId: 'cand-m-toyota',
    proposedSlug: 'toyota',
    proposedName: 'Toyota',
    assertions: {},
    validationStatus: 'CANDIDATE'
  },

  // ---------------------------------------------------------
  // MODEL
  // ---------------------------------------------------------
  {
    entityType: 'MODEL',
    proposedId: 'cand-mod-supra',
    proposedSlug: 'supra',
    proposedName: 'Supra',
    parentId: 'cand-m-toyota',
    aliases: [
      { value: 'Celica Supra', source: 'Founder Material', marketScope: 'North America', notes: 'Ambiguity: early cars shared naming' },
      { value: 'Celica XX', source: 'Founder Material', marketScope: 'Japan', notes: 'Ambiguity: domestic naming' }
    ],
    assertions: {},
    validationStatus: 'CANDIDATE'
  },

  // ---------------------------------------------------------
  // GENERATIONS
  // ---------------------------------------------------------
  {
    entityType: 'GENERATION',
    proposedId: 'cand-gen-supra-a40-a50',
    proposedSlug: 'a40-a50',
    proposedName: 'A40 / A50',
    parentId: 'cand-mod-supra',
    assertions: {
      productionPeriod: [{ value: '1978-1981', source: 'Founder Material' }]
    },
    validationStatus: 'CANDIDATE'
  },
  {
    entityType: 'GENERATION',
    proposedId: 'cand-gen-supra-a60',
    proposedSlug: 'a60',
    proposedName: 'A60',
    parentId: 'cand-mod-supra',
    assertions: {
      productionPeriod: [{ value: '1981-1985', source: 'Founder Material' }]
    },
    validationStatus: 'CANDIDATE'
  },
  {
    entityType: 'GENERATION',
    proposedId: 'cand-gen-supra-a70',
    proposedSlug: 'a70',
    proposedName: 'A70',
    parentId: 'cand-mod-supra',
    assertions: {
      productionPeriod: [{ value: '1986-1992', source: 'Founder Material' }]
    },
    validationStatus: 'CANDIDATE'
  },
  {
    entityType: 'GENERATION',
    proposedId: 'cand-gen-supra-a80',
    proposedSlug: 'a80',
    proposedName: 'A80',
    parentId: 'cand-mod-supra',
    assertions: {
      productionPeriod: [{ value: '1993-2002', source: 'Founder Material' }]
    },
    validationStatus: 'CANDIDATE'
  },
  {
    entityType: 'GENERATION',
    proposedId: 'cand-gen-supra-a90-a91',
    proposedSlug: 'a90-a91',
    proposedName: 'A90 / A91',
    parentId: 'cand-mod-supra',
    assertions: {
      productionPeriod: [{ value: '2019-present', source: 'Founder Material' }]
    },
    validationStatus: 'CANDIDATE'
  },

  // ---------------------------------------------------------
  // VARIANTS
  // ---------------------------------------------------------
  {
    entityType: 'VARIANT',
    proposedId: 'cand-var-supra-l-type',
    proposedSlug: 'l-type',
    proposedName: 'L-Type',
    parentId: 'cand-gen-supra-a60',
    assertions: { classification: [{ value: 'TRIM' as VariantClassification, source: 'Founder Material', marketScope: 'North America', notes: 'Luxury Type' }] },
    validationStatus: 'CANDIDATE'
  },
  {
    entityType: 'VARIANT',
    proposedId: 'cand-var-supra-p-type',
    proposedSlug: 'p-type',
    proposedName: 'P-Type',
    parentId: 'cand-gen-supra-a60',
    assertions: { classification: [{ value: 'TRIM' as VariantClassification, source: 'Founder Material', marketScope: 'North America', notes: 'Performance Type' }] },
    validationStatus: 'CANDIDATE'
  },
  {
    entityType: 'VARIANT',
    proposedId: 'cand-var-supra-turbo-a',
    proposedSlug: 'turbo-a',
    proposedName: 'Turbo A',
    parentId: 'cand-gen-supra-a70',
    assertions: { classification: [{ value: 'HOMOLOGATION_SPECIAL' as VariantClassification, source: 'Founder Material', marketScope: 'Japan' }] },
    validationStatus: 'CANDIDATE'
  },
  {
    entityType: 'VARIANT',
    proposedId: 'cand-var-supra-sz',
    proposedSlug: 'sz',
    proposedName: 'SZ',
    parentId: 'cand-gen-supra-a80',
    assertions: { classification: [{ value: 'POWERTRAIN_CONFIGURATION' as VariantClassification, source: 'Founder Material', marketScope: 'Japan' }] },
    validationStatus: 'CANDIDATE'
  },
  {
    entityType: 'VARIANT',
    proposedId: 'cand-var-supra-sz-r',
    proposedSlug: 'sz-r',
    proposedName: 'SZ-R',
    parentId: 'cand-gen-supra-a80',
    assertions: { classification: [{ value: 'POWERTRAIN_CONFIGURATION' as VariantClassification, source: 'Founder Material', marketScope: 'Japan' }] },
    validationStatus: 'CANDIDATE'
  },
  {
    entityType: 'VARIANT',
    proposedId: 'cand-var-supra-rz',
    proposedSlug: 'rz',
    proposedName: 'RZ',
    parentId: 'cand-gen-supra-a80',
    assertions: { classification: [{ value: 'POWERTRAIN_CONFIGURATION' as VariantClassification, source: 'Founder Material', marketScope: 'Japan' }] },
    validationStatus: 'CANDIDATE'
  },
  {
    entityType: 'VARIANT',
    proposedId: 'cand-var-supra-rz-s',
    proposedSlug: 'rz-s',
    proposedName: 'RZ-S',
    parentId: 'cand-gen-supra-a80',
    assertions: { classification: [{ value: 'POWERTRAIN_CONFIGURATION' as VariantClassification, source: 'Founder Material', marketScope: 'Japan' }] },
    validationStatus: 'CANDIDATE'
  },
  {
    entityType: 'VARIANT',
    proposedId: 'cand-var-supra-a91-edition',
    proposedSlug: 'a91-edition',
    proposedName: 'A91 Edition',
    parentId: 'cand-gen-supra-a90-a91',
    assertions: { classification: [{ value: 'SPECIAL_EDITION' as VariantClassification, source: 'Founder Material' }] },
    validationStatus: 'CANDIDATE'
  },
  {
    entityType: 'VARIANT',
    proposedId: 'cand-var-supra-a91-mt',
    proposedSlug: 'a91-mt',
    proposedName: 'A91-MT',
    parentId: 'cand-gen-supra-a90-a91',
    assertions: { classification: [{ value: 'SPECIAL_EDITION' as VariantClassification, source: 'Founder Material', notes: 'Manual Transmission specific edition' }] },
    validationStatus: 'CANDIDATE'
  },
  {
    entityType: 'VARIANT',
    proposedId: 'cand-var-supra-jarama',
    proposedSlug: 'jarama-track-edition',
    proposedName: 'Jarama Track Edition',
    parentId: 'cand-gen-supra-a90-a91',
    assertions: { classification: [{ value: 'SPECIAL_EDITION' as VariantClassification, source: 'Founder Material', marketScope: 'Europe' }] },
    validationStatus: 'CANDIDATE'
  },
  {
    entityType: 'VARIANT',
    proposedId: 'cand-var-supra-lightweight',
    proposedSlug: 'lightweight',
    proposedName: 'Lightweight',
    parentId: 'cand-gen-supra-a90-a91',
    assertions: { classification: [{ value: 'SPECIAL_EDITION' as VariantClassification, source: 'Founder Material', marketScope: 'Europe' }] },
    validationStatus: 'CANDIDATE'
  },
  {
    entityType: 'VARIANT',
    proposedId: 'cand-var-supra-lightweight-evo',
    proposedSlug: 'lightweight-evo',
    proposedName: 'Lightweight Evo',
    parentId: 'cand-gen-supra-a90-a91',
    assertions: { classification: [{ value: 'SPECIAL_EDITION' as VariantClassification, source: 'Founder Material' }] },
    validationStatus: 'CANDIDATE'
  },
  {
    entityType: 'VARIANT',
    proposedId: 'cand-var-supra-a90-final-edition',
    proposedSlug: 'a90-final-edition',
    proposedName: 'A90 Final Edition',
    parentId: 'cand-gen-supra-a90-a91',
    assertions: { classification: [{ value: 'SPECIAL_EDITION' as VariantClassification, source: 'Founder Material' }] },
    validationStatus: 'CANDIDATE'
  },

  // ---------------------------------------------------------
  // ENGINES
  // ---------------------------------------------------------
  ...['M-EU', '4M-E', '5M-E', '5M-GE', '1G-EU', '1G-GEU', 'M-TEU', '7M-GE', '7M-GTE', '1G-GTE', '1JZ-GTE', '2JZ-GE', '2JZ-GTE', 'B48', 'B58'].map(engineCode => ({
    entityType: 'ENGINE' as const,
    proposedId: `cand-eng-${engineCode.toLowerCase()}`,
    proposedSlug: engineCode.toLowerCase(),
    proposedName: engineCode,
    assertions: {
      designation: [{ value: engineCode, source: 'Founder Material' }]
    },
    validationStatus: 'CANDIDATE' as ValidationStatus
  })),

  // ---------------------------------------------------------
  // EDITORIAL
  // ---------------------------------------------------------
  {
    entityType: 'EDITORIAL',
    proposedId: 'cand-edit-01',
    proposedSlug: 'editorial-01',
    proposedName: 'Editorial Commentary',
    assertions: {
      quote: [{ value: 'the absolute myth of the saga', source: 'Founder Material', isEditorial: true }]
    },
    validationStatus: 'CANDIDATE'
  }
];
