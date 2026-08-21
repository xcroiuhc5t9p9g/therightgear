import { 
  CanonicalSeedBundle, 
  SeedPlanSummary, 
  EntityPlanItem, 
  EntityActionType, 
  SeedExecutionOptions, 
  SeedExecutionResult,
  BundleIntegrityReport 
} from './types.js';
import { CATALOGUE_COLLECTIONS } from '../persistence/constants.js';
import { getAdminFirestore } from '../persistence/firebaseAdmin.js';
import { CatalogueFirestoreWriter } from '../persistence/CatalogueFirestoreWriter.js';
import { 
  validateAndNormalizeMaker, 
  validateAndNormalizeModel, 
  validateAndNormalizeGeneration, 
  validateAndNormalizeVariant, 
  validateAndNormalizeEngine 
} from '../persistence/documentValidators.js';
import { CatalogueIntegrityError, CataloguePersistenceError } from '../types.js';

export class CatalogueSeedEngine {
  private customDb?: any;

  constructor(customDb?: any) {
    this.customDb = customDb;
  }

  private async getDb(): Promise<any> {
    return this.customDb || (await getAdminFirestore());
  }

  /**
   * Deeply compares two objects to detect if changes are identical, mergeable, or conflicting.
   */
  private compareEntity(existingData: any, incomingData: any): { action: EntityActionType; diffs: Array<{ field: string; existingValue: any; incomingValue: any }> } {
    const diffs: Array<{ field: string; existingValue: any; incomingValue: any }> = [];
    let isMerge = false;
    let isConflict = false;

    const allKeys = new Set([...Object.keys(existingData || {}), ...Object.keys(incomingData || {})]);

    for (const key of allKeys) {
      // Ignore internal metadata / timestamp fields in comparison if any
      if (key === 'createdAt' || key === 'updatedAt' || key === '_meta') continue;

      const existingVal = existingData ? existingData[key] : undefined;
      const incomingVal = incomingData ? incomingData[key] : undefined;

      const strExist = JSON.stringify(existingVal);
      const strIncom = JSON.stringify(incomingVal);

      if (strExist !== strIncom) {
        diffs.push({
          field: key,
          existingValue: existingVal,
          incomingValue: incomingVal
        });

        // If existing field was null/undefined or empty and incoming brings new data -> MERGE
        if (existingVal === undefined || existingVal === null || existingVal === '') {
          isMerge = true;
        } else if (incomingVal === undefined || incomingVal === null || incomingVal === '') {
          // Incoming is missing optional field that existing has -> MERGE
          isMerge = true;
        } else {
          // Substantive value difference -> CONFLICT
          isConflict = true;
        }
      }
    }

    if (diffs.length === 0) {
      return { action: 'NO_OP', diffs: [] };
    }

    if (isConflict) {
      return { action: 'CONFLICT', diffs };
    }

    if (isMerge) {
      return { action: 'MERGE', diffs };
    }

    return { action: 'MERGE', diffs };
  }

  /**
   * Deeply checks a seed bundle for strict DATA-16R canonical data integrity:
   * 1. Rejects unapproved scores (collector, investment, rarity, etc.)
   * 2. Verifies provenance presence and Tier hierarchy
   * 3. Audits supported, derived, and unresolved facts
   */
  public auditBundleIntegrity(bundle: CanonicalSeedBundle): BundleIntegrityReport {
    let scoresDetectedCount = 0;
    let supportedFactsCount = 0;
    let derivedFactsCount = 0;
    let unresolvedFactsCount = 0;

    // 1. Audit Variants for scores and facts
    for (const v of bundle.variants) {
      if (v.scores) {
        const hasScoreValues = 
          v.scores.collector_score || 
          v.scores.investment_score || 
          v.scores.rarity_score !== undefined;
        if (hasScoreValues) {
          scoresDetectedCount++;
        }
      }

      // Audit supported facts
      if (v.variant_name) supportedFactsCount++;
      if (v.technical_identifiers && v.technical_identifiers.length > 0) supportedFactsCount++;
      if (v.production_start_year) supportedFactsCount++;
      if (v.production_total !== undefined && v.production_total !== null) supportedFactsCount++;
      if (v.body_style) supportedFactsCount++;
      if (v.steering_side) supportedFactsCount++;
      if (v.specs) {
        if (v.specs.kerb_weight_kg) supportedFactsCount++;
        if (v.specs.top_speed_kph) supportedFactsCount++;
        if (v.specs.acceleration_0_100) supportedFactsCount++;
        if (v.specs.power_to_weight_hp_ton) derivedFactsCount++;
      }
      if (v.engine) {
        if (v.engine.displacement_cc) supportedFactsCount++;
        if (v.engine.power_kw) supportedFactsCount++;
        if (v.engine.power_hp) supportedFactsCount++;
        if (v.engine.torque_nm) supportedFactsCount++;
      }
    }

    // 2. Audit Engines
    for (const e of bundle.engines) {
      if (e.engine_code) supportedFactsCount++;
      if (e.specs.displacement_cc) supportedFactsCount++;
      if (e.specs.power_kw) supportedFactsCount++;
      if (e.specs.power_hp) supportedFactsCount++;
      if (e.specs.torque_nm) supportedFactsCount++;
      if (e.specs.bore_mm) supportedFactsCount++;
      if (e.specs.stroke_mm) supportedFactsCount++;
    }

    // 3. Audit Generations
    for (const g of bundle.generations) {
      if (g.generation_code) supportedFactsCount++;
      if (g.production_start) supportedFactsCount++;
      if (g.production_end) supportedFactsCount++;
      if (g.production_total) supportedFactsCount++;
    }

    // 4. Audit Models
    for (const m of bundle.models) {
      if (m.canonical_name) supportedFactsCount++;
      if (m.introduced_year) supportedFactsCount++;
      if (m.discontinued_year === null) unresolvedFactsCount++; // Lineage ongoing
    }

    // 5. Audit Makers
    for (const mk of bundle.makers) {
      if (mk.canonical_name) supportedFactsCount++;
      if (mk.official_name) supportedFactsCount++;
      if (mk.founded_year) supportedFactsCount++;
      if (mk.country_code) supportedFactsCount++;
    }

    const totalEntities = 
      bundle.makers.length + 
      bundle.models.length + 
      bundle.generations.length + 
      bundle.variants.length + 
      bundle.engines.length;

    const tier1Sources = bundle.sources.filter(s => s.tier === 'TIER_1_PRIMARY').length;
    const tier2Sources = bundle.sources.filter(s => s.tier === 'TIER_2_INSTITUTIONAL').length;

    const isAuditClean = scoresDetectedCount === 0 && tier1Sources >= 1;

    return {
      bundleId: bundle.bundleId,
      totalEntities,
      supportedFactsCount,
      derivedFactsCount,
      unresolvedFactsCount,
      scoresDetectedCount,
      sourcesCount: bundle.sources.length,
      tier1SourcesCount: tier1Sources,
      tier2SourcesCount: tier2Sources,
      isAuditClean
    };
  }

  /**
   * Generates a comprehensive, dry-run seed plan against the target datastore.
   */
  public async planSeed(bundle: CanonicalSeedBundle): Promise<SeedPlanSummary> {
    const db = await this.getDb();
    const items: EntityPlanItem[] = [];
    const actionsCount = {
      CREATE: 0,
      NO_OP: 0,
      MERGE: 0,
      CONFLICT: 0
    };

    // 1. Audit Bundle Integrity
    const integrityReport = this.auditBundleIntegrity(bundle);
    if (!integrityReport.isAuditClean && integrityReport.scoresDetectedCount > 0) {
      throw new CatalogueIntegrityError(
        `Seed validation failed: unapproved score fields (${integrityReport.scoresDetectedCount}) detected in canonical bundle "${bundle.bundleId}". Scores without approved methodology are strictly disallowed.`
      );
    }

    // 2. Pre-validate all entities using document validators
    const validMakers = bundle.makers.map(m => validateAndNormalizeMaker(m, m.id));
    const validModels = bundle.models.map(m => validateAndNormalizeModel(m, m.id));
    const validGenerations = bundle.generations.map(g => validateAndNormalizeGeneration(g, g.id));
    const validVariants = bundle.variants.map(v => validateAndNormalizeVariant(v, v.id));
    const validEngines = bundle.engines.map(e => validateAndNormalizeEngine(e, e.id));

    // 2. Plan Makers
    for (const m of validMakers) {
      const doc = await db.collection(CATALOGUE_COLLECTIONS.makers).doc(m.id).get();
      if (!doc.exists) {
        items.push({
          collection: CATALOGUE_COLLECTIONS.makers,
          entityType: 'MAKER',
          id: m.id,
          slug: m.slug,
          canonicalName: m.canonical_name,
          action: 'CREATE',
          details: `Maker "${m.canonical_name}" does not exist in datastore.`
        });
        actionsCount.CREATE++;
      } else {
        const { action, diffs } = this.compareEntity(doc.data(), m);
        items.push({
          collection: CATALOGUE_COLLECTIONS.makers,
          entityType: 'MAKER',
          id: m.id,
          slug: m.slug,
          canonicalName: m.canonical_name,
          action,
          details: action === 'NO_OP' 
            ? 'Identical record already exists.' 
            : `${diffs.length} field diff(s) detected.`,
          differences: diffs.length > 0 ? diffs : undefined
        });
        actionsCount[action]++;
      }
    }

    // 3. Plan Models
    for (const m of validModels) {
      const doc = await db.collection(CATALOGUE_COLLECTIONS.models).doc(m.id).get();
      if (!doc.exists) {
        items.push({
          collection: CATALOGUE_COLLECTIONS.models,
          entityType: 'MODEL',
          id: m.id,
          slug: m.slug,
          canonicalName: m.canonical_name,
          action: 'CREATE',
          details: `Model "${m.canonical_name}" does not exist in datastore.`
        });
        actionsCount.CREATE++;
      } else {
        const { action, diffs } = this.compareEntity(doc.data(), m);
        items.push({
          collection: CATALOGUE_COLLECTIONS.models,
          entityType: 'MODEL',
          id: m.id,
          slug: m.slug,
          canonicalName: m.canonical_name,
          action,
          details: action === 'NO_OP' 
            ? 'Identical record already exists.' 
            : `${diffs.length} field diff(s) detected.`,
          differences: diffs.length > 0 ? diffs : undefined
        });
        actionsCount[action]++;
      }
    }

    // 4. Plan Generations
    for (const g of validGenerations) {
      const doc = await db.collection(CATALOGUE_COLLECTIONS.generations).doc(g.id).get();
      if (!doc.exists) {
        items.push({
          collection: CATALOGUE_COLLECTIONS.generations,
          entityType: 'GENERATION',
          id: g.id,
          slug: g.slug,
          canonicalName: g.canonical_name,
          action: 'CREATE',
          details: `Generation "${g.canonical_name}" does not exist in datastore.`
        });
        actionsCount.CREATE++;
      } else {
        const { action, diffs } = this.compareEntity(doc.data(), g);
        items.push({
          collection: CATALOGUE_COLLECTIONS.generations,
          entityType: 'GENERATION',
          id: g.id,
          slug: g.slug,
          canonicalName: g.canonical_name,
          action,
          details: action === 'NO_OP' 
            ? 'Identical record already exists.' 
            : `${diffs.length} field diff(s) detected.`,
          differences: diffs.length > 0 ? diffs : undefined
        });
        actionsCount[action]++;
      }
    }

    // 5. Plan Variants
    for (const v of validVariants) {
      const doc = await db.collection(CATALOGUE_COLLECTIONS.variants).doc(v.id).get();
      if (!doc.exists) {
        items.push({
          collection: CATALOGUE_COLLECTIONS.variants,
          entityType: 'VARIANT',
          id: v.id,
          slug: v.slug,
          canonicalName: v.variant_name,
          action: 'CREATE',
          details: `Variant "${v.variant_name}" does not exist in datastore.`
        });
        actionsCount.CREATE++;
      } else {
        const { action, diffs } = this.compareEntity(doc.data(), v);
        items.push({
          collection: CATALOGUE_COLLECTIONS.variants,
          entityType: 'VARIANT',
          id: v.id,
          slug: v.slug,
          canonicalName: v.variant_name,
          action,
          details: action === 'NO_OP' 
            ? 'Identical record already exists.' 
            : `${diffs.length} field diff(s) detected.`,
          differences: diffs.length > 0 ? diffs : undefined
        });
        actionsCount[action]++;
      }
    }

    // 6. Plan Engines
    for (const e of validEngines) {
      const doc = await db.collection(CATALOGUE_COLLECTIONS.engines).doc(e.id).get();
      if (!doc.exists) {
        items.push({
          collection: CATALOGUE_COLLECTIONS.engines,
          entityType: 'ENGINE',
          id: e.id,
          slug: e.slug,
          canonicalName: e.canonical_name,
          action: 'CREATE',
          details: `Engine "${e.canonical_name}" does not exist in datastore.`
        });
        actionsCount.CREATE++;
      } else {
        const { action, diffs } = this.compareEntity(doc.data(), e);
        items.push({
          collection: CATALOGUE_COLLECTIONS.engines,
          entityType: 'ENGINE',
          id: e.id,
          slug: e.slug,
          canonicalName: e.canonical_name,
          action,
          details: action === 'NO_OP' 
            ? 'Identical record already exists.' 
            : `${diffs.length} field diff(s) detected.`,
          differences: diffs.length > 0 ? diffs : undefined
        });
        actionsCount[action]++;
      }
    }

    return {
      bundleId: bundle.bundleId,
      totalEntities: items.length,
      actionsCount,
      items,
      hasConflicts: actionsCount.CONFLICT > 0,
      isValid: true,
      integrityReport
    };
  }

  /**
   * Executes the seed ingestion pipeline.
   * By default runs in safe dry-run mode unless dryRun=false and confirmWrite=true are explicitly passed.
   */
  public async executeSeed(
    bundle: CanonicalSeedBundle, 
    options: SeedExecutionOptions = {}
  ): Promise<SeedExecutionResult> {
    const isDryRun = options.dryRun !== false;
    const plan = await this.planSeed(bundle);

    if (isDryRun) {
      return {
        dryRun: true,
        plan,
        executed: false,
        upsertCounts: {
          makers: 0,
          models: 0,
          generations: 0,
          variants: 0,
          engines: 0
        },
        errors: []
      };
    }

    // Live execution safety guard
    if (!options.confirmWrite) {
      throw new CatalogueIntegrityError(
        'Seed execution safety guard: confirmWrite flag must be set to true to perform persistent modifications.'
      );
    }

    if (plan.hasConflicts && !options.forceOnConflict) {
      throw new CatalogueIntegrityError(
        `Seed execution blocked: ${plan.actionsCount.CONFLICT} conflicting entity differences detected. Resolve conflicts or use forceOnConflict.`
      );
    }

    const writer = new CatalogueFirestoreWriter(this.customDb);
    const upsertRes = await writer.upsertHierarchy({
      makers: bundle.makers,
      models: bundle.models,
      generations: bundle.generations,
      variants: bundle.variants,
      engines: bundle.engines
    });

    return {
      dryRun: false,
      plan,
      executed: true,
      upsertCounts: {
        makers: upsertRes.makersUpserted,
        models: upsertRes.modelsUpserted,
        generations: upsertRes.generationsUpserted,
        variants: upsertRes.variantsUpserted,
        engines: upsertRes.enginesUpserted
      },
      errors: []
    };
  }
}
