import { Maker, Model, Generation, VehicleVariant, CanonicalEngine } from '../../../types/index.js';

export type SourceTier = 'TIER_1_PRIMARY' | 'TIER_2_INSTITUTIONAL' | 'TIER_3_SPECIALIST';

export interface SourceProvenance {
  sourceId: string;
  tier: SourceTier;
  title: string;
  publisher: string;
  referenceUrl?: string;
  documentRef?: string;
  publishedYear?: number;
  notes?: string;
}

export interface CanonicalSeedBundle {
  bundleId: string;
  version: string;
  description: string;
  sources: SourceProvenance[];
  makers: Maker[];
  models: Model[];
  generations: Generation[];
  variants: VehicleVariant[];
  engines: CanonicalEngine[];
}

export type EntityActionType = 'CREATE' | 'NO_OP' | 'MERGE' | 'CONFLICT';

export interface EntityPlanItem {
  collection: string;
  entityType: 'MAKER' | 'MODEL' | 'GENERATION' | 'VARIANT' | 'ENGINE';
  id: string;
  slug: string;
  canonicalName: string;
  action: EntityActionType;
  details: string;
  differences?: Array<{
    field: string;
    existingValue: any;
    incomingValue: any;
  }>;
}

export interface SeedPlanSummary {
  bundleId: string;
  totalEntities: number;
  actionsCount: {
    CREATE: number;
    NO_OP: number;
    MERGE: number;
    CONFLICT: number;
  };
  items: EntityPlanItem[];
  hasConflicts: boolean;
  isValid: boolean;
}

export interface SeedExecutionOptions {
  dryRun?: boolean;
  confirmWrite?: boolean;
  forceOnConflict?: boolean;
  customDb?: any;
}

export interface SeedExecutionResult {
  dryRun: boolean;
  plan: SeedPlanSummary;
  executed: boolean;
  upsertCounts: {
    makers: number;
    models: number;
    generations: number;
    variants: number;
    engines: number;
  };
  errors: string[];
}
