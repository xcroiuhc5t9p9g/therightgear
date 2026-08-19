import { Maker, Model, Generation, VehicleVariant, CanonicalEngine } from '../../types/index.js';
import { CatalogueValidationIssue, CatalogueValidationResult, ICatalogueProvider } from './types.js';

export class CatalogueValidator {
  public static validate(provider: ICatalogueProvider): CatalogueValidationResult {
    const errors: CatalogueValidationIssue[] = [];
    const warnings: CatalogueValidationIssue[] = [];

    const makers = provider.getMakers();
    const models = provider.getModels();
    const generations = provider.getGenerations();
    const variants = provider.getVariants();
    const engines = provider.getCanonicalEngines();

    const makerIds = new Set<string>();
    const makerSlugs = new Set<string>();
    makers.forEach(m => {
      if (makerIds.has(m.id)) {
        errors.push({
          severity: 'ERROR',
          entityType: 'MAKER',
          entityId: m.id,
          field: 'id',
          message: `Duplicate Maker ID: '${m.id}'`
        });
      }
      makerIds.add(m.id);

      if (makerSlugs.has(m.slug)) {
        errors.push({
          severity: 'ERROR',
          entityType: 'MAKER',
          entityId: m.id,
          field: 'slug',
          message: `Duplicate Maker slug: '${m.slug}'`
        });
      }
      makerSlugs.add(m.slug);
    });

    const modelIds = new Set<string>();
    const modelSlugsByMaker = new Map<string, Set<string>>();
    models.forEach(m => {
      if (modelIds.has(m.id)) {
        errors.push({
          severity: 'ERROR',
          entityType: 'MODEL',
          entityId: m.id,
          field: 'id',
          message: `Duplicate Model ID: '${m.id}'`
        });
      }
      modelIds.add(m.id);

      // Model relational check: maker_id must exist
      if (!makerIds.has(m.maker_id)) {
        errors.push({
          severity: 'ERROR',
          entityType: 'MODEL',
          entityId: m.id,
          field: 'maker_id',
          message: `Model '${m.id}' references nonexistent Maker ID '${m.maker_id}'`
        });
      }

      // Check slug uniqueness per maker
      let makerModelSlugs = modelSlugsByMaker.get(m.maker_id);
      if (!makerModelSlugs) {
        makerModelSlugs = new Set<string>();
        modelSlugsByMaker.set(m.maker_id, makerModelSlugs);
      }
      if (makerModelSlugs.has(m.slug)) {
        errors.push({
          severity: 'ERROR',
          entityType: 'MODEL',
          entityId: m.id,
          field: 'slug',
          message: `Duplicate Model slug '${m.slug}' for Maker '${m.maker_id}'`
        });
      }
      makerModelSlugs.add(m.slug);
    });

    const generationIds = new Set<string>();
    const generationSlugsByModel = new Map<string, Set<string>>();
    generations.forEach(g => {
      if (generationIds.has(g.id)) {
        errors.push({
          severity: 'ERROR',
          entityType: 'GENERATION',
          entityId: g.id,
          field: 'id',
          message: `Duplicate Generation ID: '${g.id}'`
        });
      }
      generationIds.add(g.id);

      // Generation relational check: model_id must exist
      if (!modelIds.has(g.model_id)) {
        errors.push({
          severity: 'ERROR',
          entityType: 'GENERATION',
          entityId: g.id,
          field: 'model_id',
          message: `Generation '${g.id}' references nonexistent Model ID '${g.model_id}'`
        });
      }

      // Check slug uniqueness per model
      if (g.slug) {
        let modelGenSlugs = generationSlugsByModel.get(g.model_id);
        if (!modelGenSlugs) {
          modelGenSlugs = new Set<string>();
          generationSlugsByModel.set(g.model_id, modelGenSlugs);
        }
        if (modelGenSlugs.has(g.slug)) {
          errors.push({
            severity: 'ERROR',
            entityType: 'GENERATION',
            entityId: g.id,
            field: 'slug',
            message: `Duplicate Generation slug '${g.slug}' for Model '${g.model_id}'`
          });
        }
        modelGenSlugs.add(g.slug);
      }
    });

    const engineIds = new Set<string>();
    engines.forEach(e => {
      if (engineIds.has(e.id)) {
        errors.push({
          severity: 'ERROR',
          entityType: 'ENGINE',
          entityId: e.id,
          field: 'id',
          message: `Duplicate Engine ID: '${e.id}'`
        });
      }
      engineIds.add(e.id);
    });

    const variantIds = new Set<string>();
    const variantSlugs = new Set<string>();
    variants.forEach(v => {
      if (variantIds.has(v.id)) {
        errors.push({
          severity: 'ERROR',
          entityType: 'VARIANT',
          entityId: v.id,
          field: 'id',
          message: `Duplicate Variant ID: '${v.id}'`
        });
      }
      variantIds.add(v.id);

      if (v.slug) {
        if (variantSlugs.has(v.slug)) {
          errors.push({
            severity: 'ERROR',
            entityType: 'VARIANT',
            entityId: v.id,
            field: 'slug',
            message: `Duplicate Variant slug: '${v.slug}'`
          });
        }
        variantSlugs.add(v.slug);
      }

      // Variant relational check: generation_id
      if (v.generation_id) {
        if (!generationIds.has(v.generation_id)) {
          warnings.push({
            severity: 'WARNING',
            entityType: 'VARIANT',
            entityId: v.id,
            field: 'generation_id',
            message: `Variant '${v.id}' references unindexed/orphan Generation ID '${v.generation_id}'`
          });
        }
      }

      // Variant relational check: canonical_engine_id
      if (v.canonical_engine_id) {
        if (!engineIds.has(v.canonical_engine_id)) {
          warnings.push({
            severity: 'WARNING',
            entityType: 'VARIANT',
            entityId: v.id,
            field: 'canonical_engine_id',
            message: `Variant '${v.id}' references unindexed CanonicalEngine ID '${v.canonical_engine_id}'`
          });
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      metrics: {
        makersCount: makers.length,
        modelsCount: models.length,
        generationsCount: generations.length,
        variantsCount: variants.length,
        enginesCount: engines.length
      }
    };
  }
}
