import { 
  CanonicalSeedBundle, 
  SeedPlanSummary, 
  EntityPlanItem, 
  EntityActionType, 
  SeedExecutionOptions, 
  SeedExecutionResult,
  BundleIntegrityReport,
  UnsupportedCriticalFact,
  DerivedFactRecord
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

/**
 * Validates if an entity's specific field path is explicitly supported by at least one
 * source provenance citation in the bundle.
 */
export function hasSourceCoverage(
  sources: CanonicalSeedBundle['sources'],
  entityId: string,
  fieldPath: string
): boolean {
  if (!sources || !Array.isArray(sources)) return false;
  return sources.some(source => {
    if (!Array.isArray(source.entityIds) || !source.entityIds.includes(entityId)) {
      return false;
    }
    if (!Array.isArray(source.supports)) {
      return false;
    }
    return source.supports.includes(fieldPath);
  });
}

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
   * Deeply checks a seed bundle for strict DATA-16R2 canonical data integrity and provenance coverage:
   * 1. Rejects unapproved scores (collector, investment, rarity, etc.)
   * 2. Rejects populated critical facts that lack explicit entity-linked source provenance
   * 3. Validates deterministic derivations (e.g. power_to_weight_hp_ton requires supported inputs)
   * 4. Enforces source provenance structural correctness (entityIds, supports, tier)
   */
  public auditBundleIntegrity(bundle: CanonicalSeedBundle): BundleIntegrityReport {
    let scoresDetectedCount = 0;
    let supportedFactsCount = 0;
    let derivedFactsCount = 0;
    let unresolvedFactsCount = 0;

    const unsupportedCriticalFacts: UnsupportedCriticalFact[] = [];
    const derivedFacts: DerivedFactRecord[] = [];
    const provenanceStructureErrors: string[] = [];

    // 0. Provenance Structure Checks
    const bundleEntityIds = new Set<string>([
      ...bundle.makers.map(m => m.id),
      ...bundle.models.map(m => m.id),
      ...bundle.generations.map(g => g.id),
      ...bundle.variants.map(v => v.id),
      ...bundle.engines.map(e => e.id)
    ]);

    for (const src of bundle.sources) {
      if (!src.sourceId || !src.tier || !src.title || !src.publisher) {
        provenanceStructureErrors.push(`Source "${src.sourceId || 'unknown'}" is missing required fields (sourceId, tier, title, publisher).`);
      }
      if (!Array.isArray(src.entityIds) || src.entityIds.length === 0) {
        provenanceStructureErrors.push(`Source "${src.sourceId}" does not declare any entityIds.`);
      } else {
        for (const eid of src.entityIds) {
          if (!bundleEntityIds.has(eid)) {
            provenanceStructureErrors.push(`Source "${src.sourceId}" references unknown entityId "${eid}".`);
          }
        }
      }
      if (!Array.isArray(src.supports) || src.supports.length === 0) {
        provenanceStructureErrors.push(`Source "${src.sourceId}" does not declare any supported field paths.`);
      }
    }

    // Helper: evaluate a critical field for an entity
    const auditField = (entityId: string, fieldPath: string, value: any) => {
      if (value === undefined || value === null) {
        return; // Empty/null field is not populated
      }
      if (Array.isArray(value) && value.length === 0) {
        return; // Empty array
      }

      const covered = hasSourceCoverage(bundle.sources, entityId, fieldPath);
      if (covered) {
        supportedFactsCount++;
      } else {
        unresolvedFactsCount++;
        unsupportedCriticalFacts.push({
          entityId,
          fieldPath,
          value,
          reason: 'NO_SOURCE_COVERAGE'
        });
      }
    };

    // 1. Audit Makers
    for (const mk of bundle.makers) {
      auditField(mk.id, 'canonical_name', mk.canonical_name);
      auditField(mk.id, 'official_name', mk.official_name);
      auditField(mk.id, 'country_code', mk.country_code);
      auditField(mk.id, 'country_of_origin', mk.country_of_origin);
      auditField(mk.id, 'founded_year', mk.founded_year);
      auditField(mk.id, 'active', mk.active);
      if (mk.website_url) auditField(mk.id, 'website_url', mk.website_url);
    }

    // 2. Audit Models
    for (const m of bundle.models) {
      auditField(m.id, 'canonical_name', m.canonical_name);
      auditField(m.id, 'category', m.category);
      auditField(m.id, 'introduced_year', m.introduced_year);
      auditField(m.id, 'summary_en', m.summary_en);
      if (m.discontinued_year !== null && m.discontinued_year !== undefined) {
        auditField(m.id, 'discontinued_year', m.discontinued_year);
      } else if (m.discontinued_year === null) {
        // Lineage ongoing / actively produced
        unresolvedFactsCount++;
      }
    }

    // 3. Audit Generations
    for (const g of bundle.generations) {
      auditField(g.id, 'generation_code', g.generation_code);
      auditField(g.id, 'canonical_name', g.canonical_name);
      auditField(g.id, 'production_start', g.production_start);
      auditField(g.id, 'production_end', g.production_end);
      auditField(g.id, 'production_total', g.production_total);
      if (g.distinctive_features_en && g.distinctive_features_en.length > 0) {
        auditField(g.id, 'distinctive_features_en', g.distinctive_features_en);
      }
    }

    // 4. Audit Canonical Engines
    for (const e of bundle.engines) {
      auditField(e.id, 'canonical_name', e.canonical_name);
      auditField(e.id, 'engine_code', e.engine_code);
      auditField(e.id, 'family_name', e.family_name);
      auditField(e.id, 'manufacturer_id', e.manufacturer_id);

      if (e.specs) {
        auditField(e.id, 'specs.architecture', e.specs.architecture);
        auditField(e.id, 'specs.cylinders', e.specs.cylinders);
        auditField(e.id, 'specs.displacement_cc', e.specs.displacement_cc);
        auditField(e.id, 'specs.aspiration', e.specs.aspiration);
        auditField(e.id, 'specs.fuel_type', e.specs.fuel_type);
        auditField(e.id, 'specs.power_kw', e.specs.power_kw);
        auditField(e.id, 'specs.power_hp', e.specs.power_hp);
        auditField(e.id, 'specs.torque_nm', e.specs.torque_nm);
        auditField(e.id, 'specs.bore_mm', e.specs.bore_mm);
        auditField(e.id, 'specs.stroke_mm', e.specs.stroke_mm);
        auditField(e.id, 'specs.valves', e.specs.valves);
        auditField(e.id, 'specs.compression_ratio', e.specs.compression_ratio);
        auditField(e.id, 'specs.redline_rpm', e.specs.redline_rpm);
      }
    }

    // 5. Audit Variants (Scores, Critical Specs, Engine, Transmission, Derivations)
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

      auditField(v.id, 'variant_name', v.variant_name);
      if (v.technical_identifiers && v.technical_identifiers.length > 0) {
        auditField(v.id, 'technical_identifiers', v.technical_identifiers);
      }
      auditField(v.id, 'category', v.category);
      auditField(v.id, 'model_year_from', v.model_year_from);
      auditField(v.id, 'model_year_to', v.model_year_to);
      auditField(v.id, 'production_start_year', v.production_start_year);
      auditField(v.id, 'steering_side', v.steering_side);
      auditField(v.id, 'body_style', v.body_style);
      auditField(v.id, 'limited_edition', v.limited_edition);
      auditField(v.id, 'numbered_series', v.numbered_series);
      auditField(v.id, 'production_total', v.production_total);
      auditField(v.id, 'canonical_engine_id', v.canonical_engine_id);

      if (v.specs) {
        auditField(v.id, 'specs.kerb_weight_kg', v.specs.kerb_weight_kg);
        auditField(v.id, 'specs.length_mm', v.specs.length_mm);
        auditField(v.id, 'specs.width_mm', v.specs.width_mm);
        auditField(v.id, 'specs.height_mm', v.specs.height_mm);
        auditField(v.id, 'specs.wheelbase_mm', v.specs.wheelbase_mm);
        auditField(v.id, 'specs.top_speed_kph', v.specs.top_speed_kph);
        auditField(v.id, 'specs.acceleration_0_100', v.specs.acceleration_0_100);
        auditField(v.id, 'specs.fuel_capacity_l', v.specs.fuel_capacity_l);

        // Power to Weight Ratio (Deterministic Derivation)
        if (v.specs.power_to_weight_hp_ton !== undefined && v.specs.power_to_weight_hp_ton !== null) {
          const weightSupported = hasSourceCoverage(bundle.sources, v.id, 'specs.kerb_weight_kg');
          const powerSupported = hasSourceCoverage(bundle.sources, v.id, 'engine.power_hp') || hasSourceCoverage(bundle.sources, v.id, 'engine.power_kw');
          
          if (weightSupported && powerSupported) {
            derivedFactsCount++;
            derivedFacts.push({
              entityId: v.id,
              fieldPath: 'specs.power_to_weight_hp_ton',
              value: v.specs.power_to_weight_hp_ton,
              inputFields: ['specs.kerb_weight_kg', 'engine.power_hp'],
              formula: 'power_hp / (kerb_weight_kg / 1000)'
            });
          } else {
            unresolvedFactsCount++;
            const missingInputs: string[] = [];
            if (!weightSupported) missingInputs.push('specs.kerb_weight_kg');
            if (!powerSupported) missingInputs.push('engine.power_hp/engine.power_kw');
            unsupportedCriticalFacts.push({
              entityId: v.id,
              fieldPath: 'specs.power_to_weight_hp_ton',
              value: v.specs.power_to_weight_hp_ton,
              reason: `DERIVATION_INPUT_UNSUPPORTED: Missing supported input(s) [${missingInputs.join(', ')}]`
            });
          }
        }
      }

      if (v.engine) {
        auditField(v.id, 'engine.architecture', v.engine.architecture);
        auditField(v.id, 'engine.cylinders', v.engine.cylinders);
        auditField(v.id, 'engine.displacement_cc', v.engine.displacement_cc);
        auditField(v.id, 'engine.aspiration', v.engine.aspiration);
        auditField(v.id, 'engine.fuel_type', v.engine.fuel_type);
        auditField(v.id, 'engine.power_kw', v.engine.power_kw);
        auditField(v.id, 'engine.power_hp', v.engine.power_hp);
        auditField(v.id, 'engine.torque_nm', v.engine.torque_nm);
        auditField(v.id, 'engine.compression_ratio', v.engine.compression_ratio);
        auditField(v.id, 'engine.bore_mm', v.engine.bore_mm);
        auditField(v.id, 'engine.stroke_mm', v.engine.stroke_mm);
        auditField(v.id, 'engine.valves', v.engine.valves);
        auditField(v.id, 'engine.redline_rpm', v.engine.redline_rpm);
      }

      if (v.transmission) {
        auditField(v.id, 'transmission.name', v.transmission.name);
        auditField(v.id, 'transmission.type', v.transmission.type);
        auditField(v.id, 'transmission.gears', v.transmission.gears);
        auditField(v.id, 'transmission.manufacturer', v.transmission.manufacturer);
        auditField(v.id, 'transmission.drivetrain', v.transmission.drivetrain);
        auditField(v.id, 'transmission.differential_type', v.transmission.differential_type);
      }
    }

    const totalEntities = 
      bundle.makers.length + 
      bundle.models.length + 
      bundle.generations.length + 
      bundle.variants.length + 
      bundle.engines.length;

    const tier1Sources = bundle.sources.filter(s => s.tier === 'TIER_1_PRIMARY').length;
    const tier2Sources = bundle.sources.filter(s => s.tier === 'TIER_2_INSTITUTIONAL').length;

    const isAuditClean = 
      scoresDetectedCount === 0 && 
      unsupportedCriticalFacts.length === 0 && 
      provenanceStructureErrors.length === 0;

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
      isAuditClean,
      unsupportedCriticalFacts,
      derivedFacts,
      provenanceStructureErrors
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
    if (!integrityReport.isAuditClean) {
      const reasons: string[] = [];
      if (integrityReport.scoresDetectedCount > 0) {
        reasons.push(`unapproved score fields (${integrityReport.scoresDetectedCount}) detected`);
      }
      if (integrityReport.unsupportedCriticalFacts.length > 0) {
        const samples = integrityReport.unsupportedCriticalFacts
          .slice(0, 5)
          .map(f => `${f.entityId}.${f.fieldPath} (${f.reason})`)
          .join(', ');
        reasons.push(`${integrityReport.unsupportedCriticalFacts.length} unsupported critical fact(s) without source provenance [${samples}${integrityReport.unsupportedCriticalFacts.length > 5 ? '...' : ''}]`);
      }
      if (integrityReport.provenanceStructureErrors.length > 0) {
        reasons.push(`${integrityReport.provenanceStructureErrors.length} provenance structure error(s) [${integrityReport.provenanceStructureErrors.join('; ')}]`);
      }
      throw new CatalogueIntegrityError(
        `Seed validation failed for bundle "${bundle.bundleId}": ${reasons.join('; ')}`
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
