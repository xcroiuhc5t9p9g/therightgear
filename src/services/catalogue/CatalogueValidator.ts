import { 
  ICatalogueProvider, 
  CatalogueValidationResult, 
  CatalogueValidationIssue,
  CatalogueIntegrityError
} from './types.js';

export class CatalogueValidator {
  public static async validate(provider: ICatalogueProvider, throwOnErrors: boolean = false): Promise<CatalogueValidationResult> {
    const errors: CatalogueValidationIssue[] = [];
    const warnings: CatalogueValidationIssue[] = [];

    const [makers, models, generations, variants, engines] = await Promise.all([
      provider.getMakers(),
      provider.getModels(),
      provider.getGenerations(),
      provider.getVariants(),
      provider.getCanonicalEngines()
    ]);

    const makerIds = new Set<string>();
    const makerSlugs = new Set<string>();
    makers.forEach(m => {
      if (makerIds.has(m.id)) {
        errors.push({
          severity: 'ERROR',
          entityType: 'MAKER',
          entityId: m.id,
          field: 'id',
          message: `Duplicate Maker ID: "${m.id}"`
        });
      }
      makerIds.add(m.id);

      if (makerSlugs.has(m.slug.toLowerCase())) {
        errors.push({
          severity: 'ERROR',
          entityType: 'MAKER',
          entityId: m.id,
          field: 'slug',
          message: `Duplicate Maker slug: "${m.slug}"`
        });
      }
      makerSlugs.add(m.slug.toLowerCase());
    });

    const modelIds = new Set<string>();
    const modelSlugs = new Set<string>();
    models.forEach(m => {
      if (modelIds.has(m.id)) {
        errors.push({
          severity: 'ERROR',
          entityType: 'MODEL',
          entityId: m.id,
          field: 'id',
          message: `Duplicate Model ID: "${m.id}"`
        });
      }
      modelIds.add(m.id);

      const scopedSlug = `${m.maker_id}:${m.slug.toLowerCase()}`;
      if (modelSlugs.has(scopedSlug)) {
        errors.push({
          severity: 'ERROR',
          entityType: 'MODEL',
          entityId: m.id,
          field: 'slug',
          message: `Duplicate Model slug within Maker "${m.maker_id}": "${m.slug}"`
        });
      }
      modelSlugs.add(scopedSlug);

      if (!makerIds.has(m.maker_id)) {
        errors.push({
          severity: 'ERROR',
          entityType: 'MODEL',
          entityId: m.id,
          field: 'maker_id',
          message: `Model "${m.id}" references non-existent Maker "${m.maker_id}"`
        });
      }
    });

    const generationIds = new Set<string>();
    generations.forEach(g => {
      if (generationIds.has(g.id)) {
        errors.push({
          severity: 'ERROR',
          entityType: 'GENERATION',
          entityId: g.id,
          field: 'id',
          message: `Duplicate Generation ID: "${g.id}"`
        });
      }
      generationIds.add(g.id);

      if (!modelIds.has(g.model_id)) {
        errors.push({
          severity: 'ERROR',
          entityType: 'GENERATION',
          entityId: g.id,
          field: 'model_id',
          message: `Generation "${g.id}" references non-existent Model "${g.model_id}"`
        });
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
          message: `Duplicate CanonicalEngine ID: "${e.id}"`
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
          message: `Duplicate Variant ID: "${v.id}"`
        });
      }
      variantIds.add(v.id);

      if (variantSlugs.has(v.slug.toLowerCase())) {
        warnings.push({
          severity: 'WARNING',
          entityType: 'VARIANT',
          entityId: v.id,
          field: 'slug',
          message: `Duplicate Variant global slug: "${v.slug}"`
        });
      }
      variantSlugs.add(v.slug.toLowerCase());

      if (v.generation_id && !generationIds.has(v.generation_id)) {
        errors.push({
          severity: 'ERROR',
          entityType: 'VARIANT',
          entityId: v.id,
          field: 'generation_id',
          message: `Variant "${v.id}" references non-existent Generation "${v.generation_id}"`
        });
      }

      if (v.canonical_engine_id && !engineIds.has(v.canonical_engine_id)) {
        warnings.push({
          severity: 'WARNING',
          entityType: 'VARIANT',
          entityId: v.id,
          field: 'canonical_engine_id',
          message: `Variant "${v.id}" references non-existent CanonicalEngine "${v.canonical_engine_id}"`
        });
      }
    });

    const result: CatalogueValidationResult = {
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

    if (!result.valid && throwOnErrors) {
      throw new CatalogueIntegrityError(
        `Catalogue validation failed with ${errors.length} structural error(s).`,
        errors
      );
    }

    return result;
  }
}
