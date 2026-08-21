import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { GRAPH_ENTITIES, GRAPH_RELATIONSHIPS } from './src/data/catalogData.js';
import { catalogueRepository } from './src/services/catalogueRepository.js';
import { Maker, Model, Generation, VehicleVariant } from './src/types/index.js';
import { importLabStore } from './src/services/importLabStore.js';
import { importEngine } from './src/services/importProviders/importEngine.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());


// Initialize Gemini SDK on server-side only
const geminiApiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (geminiApiKey) {
  aiClient = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// -------------------------------------------------------------
// REST API v1 ROUTES
// -------------------------------------------------------------

// Health Check
app.get('/api/v1/health', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isReady = await catalogueRepository.isReady();
    if (!isReady) {
      return res.status(503).json({
        status: 'degraded',
        version: '0.2',
        timestamp: new Date().toISOString(),
        catalogue: {
          ready: false
        },
        gemini_configured: !!aiClient
      });
    }

    const variants = await catalogueRepository.getVariants();
    res.json({
      status: 'ok',
      version: '0.2',
      timestamp: new Date().toISOString(),
      catalogue: {
        ready: true,
        catalog_count: variants.length
      },
      gemini_configured: !!aiClient
    });
  } catch (err) {
    next(err);
  }
});

// Manufacturers
app.get('/api/v1/manufacturers', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const manufacturers = await catalogueRepository.getManufacturers();
    res.json(manufacturers);
  } catch (err) {
    next(err);
  }
});

// Brands / Makers
app.get('/api/v1/brands', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const makers = await catalogueRepository.getMakers();
    res.json(makers);
  } catch (err) {
    next(err);
  }
});

// -------------------------------------------------------------
// HIERARCHICAL MODEL, GENERATION & VARIANT ENDPOINTS
// -------------------------------------------------------------

// Model navigation structure (Single endpoint payload for VersionNavigator)
app.get('/api/v1/models/:modelId/navigation', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { modelId } = req.params;
    const context = await catalogueRepository.resolveModelHierarchy(modelId);
    
    if (!context) {
      return res.status(404).json({ success: false, error: 'MODEL_NAVIGATION_NOT_FOUND' });
    }

    const { maker, model, generationContexts } = context;

    const manufacturer = {
      id: maker?.id ?? model.maker_id ?? null,
      name: maker?.official_name ?? maker?.canonical_name ?? null,
      slug: maker?.slug ?? null,
      logoUrl: maker?.logo_url ?? undefined,
      countryCode: maker?.country_code ?? undefined
    };

    // Model year aggregation
    let modelMinYear: number | null = model.introduced_year ?? null;
    let modelMaxYear: number | null = model.discontinued_year ?? null;

    generationContexts.forEach(g => {
      if (g._startYear !== null) {
        if (modelMinYear === null || g._startYear < modelMinYear) modelMinYear = g._startYear;
      }
      if (g._endYear !== null) {
        if (modelMaxYear === null || g._endYear > modelMaxYear) modelMaxYear = g._endYear;
      }
    });

    let modelYears: string | null = null;
    if (modelMinYear !== null) {
      if (modelMaxYear !== null && modelMaxYear !== modelMinYear) {
        modelYears = `${modelMinYear}–${modelMaxYear}`;
      } else {
        modelYears = `${modelMinYear}`;
      }
    } else if (modelMaxYear !== null) {
      modelYears = `${modelMaxYear}`;
    }

    const modelPayload = {
      id: model.id,
      name: model.canonical_name ?? null,
      slug: model.slug ?? null,
      years: modelYears,
      category: model.category ?? undefined
    };

    const generations = generationContexts.map(g => {
      let genYears: string | null = null;
      if (g._startYear !== null) {
        if (g._endYear !== null && g._endYear !== g._startYear) {
          genYears = `${g._startYear}–${g._endYear}`;
        } else {
          genYears = `${g._startYear}`;
        }
      } else if (g._endYear !== null) {
        genYears = `${g._endYear}`;
      }

      // Deterministic sorting of variants inside generation
      const sortedVariants = [...g.variants].sort((a, b) => {
        const yA = a.model_year_from ?? 9999;
        const yB = b.model_year_from ?? 9999;
        if (yA !== yB) return yA - yB;
        return (a.variant_name || '').localeCompare(b.variant_name || '') || a.id.localeCompare(b.id);
      });

      const variantsPayload = sortedVariants.map(v => {
        let variantYears: string | null = null;
        if (v.model_year_from != null) {
          if (v.model_year_to != null && v.model_year_to !== v.model_year_from) {
            variantYears = `${v.model_year_from}–${v.model_year_to}`;
          } else {
            variantYears = `${v.model_year_from}`;
          }
        } else if (v.model_year_to != null) {
          variantYears = `${v.model_year_to}`;
        }

        return {
          id: v.id,
          slug: v.slug,
          name: v.variant_name ?? null,
          years: variantYears,
          limitedEdition: v.limited_edition ?? null,
          productionTotal: v.production_total ?? null,
          powerHp: v.engine?.power_hp ?? null
        };
      });

      return {
        id: g.generationId,
        code: g.generation?.generation_code ?? null,
        name: g.generation?.canonical_name ?? null,
        years: genYears,
        slug: g.generation?.slug ?? null,
        variants: variantsPayload
      };
    });

    return res.json({
      manufacturer,
      model: modelPayload,
      generations
    });
  } catch (err) {
    next(err);
  }
});

// GET Model details
app.get('/api/v1/models/:modelId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { modelId } = req.params;
    const context = await catalogueRepository.resolveModelHierarchy(modelId);
    if (!context) {
      return res.status(404).json({ error: 'Model not found' });
    }

    const { maker, model, generationContexts, allVariants } = context;

    let minYear: number | null = model.introduced_year ?? null;
    let maxYear: number | null = model.discontinued_year ?? null;
    let minHp: number | null = null;
    let maxHp: number | null = null;
    let minPrice: number | null = null;
    let maxPrice: number | null = null;

    generationContexts.forEach(g => {
      if (g._startYear !== null) {
        if (minYear === null || g._startYear < minYear) minYear = g._startYear;
      }
      if (g._endYear !== null) {
        if (maxYear === null || g._endYear > maxYear) maxYear = g._endYear;
      }
    });

    allVariants.forEach(v => {
      const hp = v.engine?.power_hp;
      if (typeof hp === 'number' && !isNaN(hp) && hp > 0) {
        if (minHp === null || hp < minHp) minHp = hp;
        if (maxHp === null || hp > maxHp) maxHp = hp;
      }
      const price = v.current_median_price_eur;
      if (typeof price === 'number' && !isNaN(price)) {
        if (minPrice === null || price < minPrice) minPrice = price;
        if (maxPrice === null || price > maxPrice) maxPrice = price;
      }
    });

    let yearsRange: string | null = null;
    if (minYear !== null) {
      if (maxYear !== null && maxYear !== minYear) {
        yearsRange = `${minYear}–${maxYear}`;
      } else {
        yearsRange = `${minYear}`;
      }
    } else if (maxYear !== null) {
      yearsRange = `${maxYear}`;
    }

    const powerHpRange: [number, number] | null = (minHp !== null && maxHp !== null) ? [minHp, maxHp] : null;
    const priceRangeEur = (minPrice !== null && maxPrice !== null) ? { min: minPrice, max: maxPrice } : null;

    res.json({
      modelId: model.id,
      manufacturerId: maker?.id ?? model.maker_id,
      manufacturerName: maker?.canonical_name ?? maker?.official_name ?? null,
      manufacturerSlug: maker?.slug ?? null,
      modelName: model.canonical_name,
      modelSlug: model.slug,
      category: model.category ?? null,
      yearsRange,
      totalGenerationsCount: generationContexts.length,
      totalVariantsCount: allVariants.length,
      powerHpRange,
      collectorScoreOverall: null,
      investmentScoreOverall: null,
      priceRangeEur,
      heroImageUrl: model.hero_image_url ?? (allVariants[0]?.hero_image_url ?? null),
      historicSummaryIt: null,
      historicSummaryEn: model.summary_en ?? null
    });
  } catch (err) {
    next(err);
  }
});

// GET Generations for Model
app.get('/api/v1/models/:modelId/generations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { modelId } = req.params;
    const context = await catalogueRepository.resolveModelHierarchy(modelId);
    if (!context) {
      return res.status(404).json({ success: false, error: 'MODEL_NOT_FOUND' });
    }

    const { generationContexts } = context;

    const result = generationContexts.map(g => {
      let yearsRange: string | null = null;
      if (g._startYear !== null) {
        if (g._endYear !== null && g._endYear !== g._startYear) {
          yearsRange = `${g._startYear}–${g._endYear}`;
        } else {
          yearsRange = `${g._startYear}`;
        }
      } else if (g._endYear !== null) {
        yearsRange = `${g._endYear}`;
      }

      return {
        id: g.generationId,
        slug: g.generation?.slug ?? null,
        code: g.generation?.generation_code ?? null,
        name: g.generation?.canonical_name ?? null,
        yearsRange,
        variantsCount: g.variants.length
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// GET Scoped Generation details (Scoped to Model)
app.get('/api/v1/models/:modelId/generations/:generationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { modelId, generationId } = req.params;
    const context = await catalogueRepository.resolveModelHierarchy(modelId);
    if (!context) {
      return res.status(404).json({ success: false, error: 'MODEL_NOT_FOUND' });
    }

    const { maker, model, generationContexts } = context;
    const genContext = generationContexts.find(g => g.generationId === generationId || g.generation?.slug === generationId);
    if (!genContext) {
      return res.status(404).json({ success: false, error: 'GENERATION_NOT_FOUND' });
    }

    const powerValues: number[] = [];
    genContext.variants.forEach(v => {
      if (typeof v.engine?.power_hp === 'number' && !isNaN(v.engine.power_hp) && v.engine.power_hp > 0) {
        powerValues.push(v.engine.power_hp);
      }
    });

    let yearsRange: string | null = null;
    if (genContext._startYear !== null) {
      if (genContext._endYear !== null && genContext._endYear !== genContext._startYear) {
        yearsRange = `${genContext._startYear}–${genContext._endYear}`;
      } else {
        yearsRange = `${genContext._startYear}`;
      }
    } else if (genContext._endYear !== null) {
      yearsRange = `${genContext._endYear}`;
    }

    let powerHpRange: [number, number] | null = null;
    if (powerValues.length > 0) {
      powerHpRange = [Math.min(...powerValues), Math.max(...powerValues)];
    }

    res.json({
      generationId: genContext.generationId,
      manufacturerId: maker?.id ?? model.maker_id ?? null,
      manufacturerName: maker?.canonical_name ?? maker?.official_name ?? null,
      modelName: model.canonical_name,
      generationSlug: genContext.generation?.slug ?? null,
      generationCode: genContext.generation?.generation_code ?? null,
      generationName: genContext.generation?.canonical_name ?? null,
      yearsRange,
      totalVariantsCount: genContext.variants.length,
      powerHpRange
    });
  } catch (err) {
    next(err);
  }
});

// GET Scoped Variants for Generation (Scoped to Model)
app.get('/api/v1/models/:modelId/generations/:generationId/variants', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { modelId, generationId } = req.params;
    const context = await catalogueRepository.resolveModelHierarchy(modelId);
    if (!context) {
      return res.status(404).json({ success: false, error: 'MODEL_NOT_FOUND' });
    }

    const { generationContexts } = context;
    const genContext = generationContexts.find(g => g.generationId === generationId || g.generation?.slug === generationId);
    if (!genContext) {
      return res.status(404).json({ success: false, error: 'GENERATION_NOT_FOUND' });
    }

    const sortedVariants = [...genContext.variants].sort((a, b) => {
      const yA = a.model_year_from ?? 9999;
      const yB = b.model_year_from ?? 9999;
      if (yA !== yB) return yA - yB;
      return (a.variant_name || '').localeCompare(b.variant_name || '') || a.id.localeCompare(b.id);
    });

    const variantsList = sortedVariants.map(mv => {
      let yearsRange: string | null = null;
      if (mv.model_year_from != null) {
        if (mv.model_year_to != null && mv.model_year_to !== mv.model_year_from) {
          yearsRange = `${mv.model_year_from}–${mv.model_year_to}`;
        } else {
          yearsRange = `${mv.model_year_from}`;
        }
      } else if (mv.model_year_to != null) {
        yearsRange = `${mv.model_year_to}`;
      }

      return {
        id: mv.id,
        slug: mv.slug,
        name: mv.variant_name ?? null,
        yearsRange,
        limitedEdition: mv.limited_edition ?? null,
        productionTotal: mv.production_total ?? null,
        powerHp: mv.engine?.power_hp ?? null
      };
    });

    res.json(variantsList);
  } catch (err) {
    next(err);
  }
});

// Legacy GET Generation details (Unscoped compatibility route)
app.get('/api/v1/generations/:generationId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { generationId } = req.params;
    
    const gen = await catalogueRepository.getGenerationByIdOrSlug(generationId);
    let parentModel: Model | null = gen ? await catalogueRepository.getModelById(gen.model_id) : null;
    
    const genVehicles = gen 
      ? await catalogueRepository.getVariantsByGeneration(gen.id) 
      : (await catalogueRepository.getVariants()).filter(x => x.generation_id === generationId);

    if (!gen && genVehicles.length === 0) {
      return res.status(404).json({ success: false, error: 'GENERATION_NOT_FOUND' });
    }

    if (!parentModel && genVehicles.length > 0) {
      const v = genVehicles[0];
      const models = await catalogueRepository.getModels();
      parentModel = models.find(m => m.canonical_name.toLowerCase() === (v.model_name || '').toLowerCase()) ?? null;
    }

    const maker = parentModel ? await catalogueRepository.getMakerById(parentModel.maker_id) : null;

    let minStartYear: number | null = gen?.production_start ?? null;
    let maxKnownEndYear: number | null = gen?.production_end ?? null;
    
    const powerValues: number[] = [];

    genVehicles.forEach(mv => {
      if (mv.model_year_from != null) {
        if (minStartYear === null || mv.model_year_from < minStartYear) minStartYear = mv.model_year_from;
      }
      if (mv.model_year_to != null) {
        if (maxKnownEndYear === null || mv.model_year_to > maxKnownEndYear) maxKnownEndYear = mv.model_year_to;
      }

      if (typeof mv.engine?.power_hp === 'number' && !isNaN(mv.engine.power_hp) && mv.engine.power_hp > 0) {
        powerValues.push(mv.engine.power_hp);
      }
    });

    let yearsRange: string | null = null;
    if (minStartYear !== null) {
      if (maxKnownEndYear !== null && maxKnownEndYear !== minStartYear) {
        yearsRange = `${minStartYear}–${maxKnownEndYear}`;
      } else {
        yearsRange = `${minStartYear}`;
      }
    } else if (maxKnownEndYear !== null) {
      yearsRange = `${maxKnownEndYear}`;
    }

    let powerHpRange: [number, number] | null = null;
    if (powerValues.length > 0) {
      powerHpRange = [Math.min(...powerValues), Math.max(...powerValues)];
    }

    res.json({
      generationId: gen ? gen.id : generationId,
      manufacturerId: maker?.id ?? parentModel?.maker_id ?? genVehicles[0]?.manufacturer_id ?? null,
      manufacturerName: maker?.canonical_name ?? maker?.official_name ?? genVehicles[0]?.manufacturer_name ?? null,
      modelName: parentModel?.canonical_name ?? genVehicles[0]?.model_name ?? null,
      generationSlug: gen?.slug ?? null,
      generationCode: gen?.generation_code ?? null,
      generationName: gen?.canonical_name ?? null,
      yearsRange,
      totalVariantsCount: genVehicles.length,
      powerHpRange
    });
  } catch (err) {
    next(err);
  }
});

// Legacy GET Variants for Generation (Unscoped compatibility route)
app.get('/api/v1/generations/:generationId/variants', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { generationId } = req.params;
    
    const gen = await catalogueRepository.getGenerationByIdOrSlug(generationId);
    const genVehicles = gen 
      ? await catalogueRepository.getVariantsByGeneration(gen.id) 
      : (await catalogueRepository.getVariants()).filter(x => x.generation_id === generationId);
    
    if (!gen && genVehicles.length === 0) {
      return res.status(404).json({ success: false, error: 'GENERATION_NOT_FOUND' });
    }

    const sortedVehicles = [...genVehicles].sort((a, b) => {
      const yA = a.model_year_from ?? 9999;
      const yB = b.model_year_from ?? 9999;
      if (yA !== yB) return yA - yB;
      return (a.variant_name || '').localeCompare(b.variant_name || '') || a.id.localeCompare(b.id);
    });

    const variantsList = sortedVehicles.map(mv => {
      let yearsRange: string | null = null;
      if (mv.model_year_from != null) {
        if (mv.model_year_to != null && mv.model_year_to !== mv.model_year_from) {
          yearsRange = `${mv.model_year_from}–${mv.model_year_to}`;
        } else {
          yearsRange = `${mv.model_year_from}`;
        }
      } else if (mv.model_year_to != null) {
        yearsRange = `${mv.model_year_to}`;
      }

      return {
        id: mv.id,
        slug: mv.slug,
        name: mv.variant_name ?? null,
        yearsRange,
        limitedEdition: mv.limited_edition ?? null,
        productionTotal: mv.production_total ?? null,
        powerHp: mv.engine?.power_hp ?? null
      };
    });

    res.json(variantsList);
  } catch (err) {
    next(err);
  }
});

// GET Single Variant
app.get('/api/v1/variants/:variantId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { variantId } = req.params;
    
    // MATCH EXACT IDENTITY ONLY
    const found = await catalogueRepository.getVariantByIdOrSlug(variantId);
    
    if (!found) {
      return res.status(404).json({ success: false, error: 'VARIANT_NOT_FOUND' });
    }
    
    // STRIP OUT LEGACY / DEMO / MARKET DATA / INTERNAL WORKFLOW STATUS
    res.json({
      // IDENTITY
      id: found.id,
      generation_id: found.generation_id,
      manufacturer_id: found.manufacturer_id,
      manufacturer_name: found.manufacturer_name,
      model_name: found.model_name,
      slug: found.slug,
      variant_name: found.variant_name,
      technical_identifiers: found.technical_identifiers ?? null,
      category: found.category ?? null,
      market_code: found.market_code ?? null,
      
      // PRODUCTION / CLASSIFICATION
      model_year_from: found.model_year_from ?? null,
      model_year_to: found.model_year_to ?? null,
      production_start_year: found.production_start_year ?? null,
      steering_side: found.steering_side ?? null,
      body_style: found.body_style ?? null,
      limited_edition: found.limited_edition ?? null,
      numbered_series: found.numbered_series ?? null,
      production_total: found.production_total ?? null,
      original_list_price_eur: found.original_list_price_eur ?? null,
      
      // MEDIA
      hero_image_url: found.hero_image_url ?? null,
      gallery_images: found.gallery_images ?? null,
      youtube_video_ids: found.youtube_video_ids ?? null,
      
      // TECHNICAL
      canonical_engine_id: found.canonical_engine_id ?? null,
      engine: found.engine ?? null,
      transmission: found.transmission ?? null,
      specs: found.specs ?? null,
      
      // HISTORY / PROVENANCE
      history_it: found.history_it ?? null,
      history_en: found.history_en ?? null,
      designers: found.designers ?? null,
      engineers: found.engineers ?? null,
      related_entities: found.related_entities ?? null,
      production_site: found.production_site ?? null,
      
      // PRODUCTION BREAKDOWNS
      variant_editions: found.variant_editions ?? null,
      extended_variant_editions: found.extended_variant_editions ?? null,
      factory_colors: found.factory_colors ?? null,
      production_breakdown_notes_it: found.production_breakdown_notes_it ?? null,
      production_breakdown_notes_en: found.production_breakdown_notes_en ?? null
    });
  } catch (err) {
    next(err);
  }
});

// GET Specs for Variant
app.get('/api/v1/variants/:variantId/specifications', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { variantId } = req.params;
    const found = await catalogueRepository.getVariantByIdOrSlug(variantId);
    if (!found) {
      return res.status(404).json({ success: false, error: 'VARIANT_NOT_FOUND' });
    }

    res.json({
      variantId: found.id,
      canonical_engine_id: found.canonical_engine_id ?? null,
      engine: found.engine ?? null,
      transmission: found.transmission ?? null,
      specs: found.specs ?? null,
      technical_identifiers: found.technical_identifiers ?? null
    });
  } catch (err) {
    next(err);
  }
});

// GET Production Record for Variant
app.get('/api/v1/variants/:variantId/production', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { variantId } = req.params;
    const found = await catalogueRepository.getVariantByIdOrSlug(variantId);
    if (!found) {
      return res.status(404).json({ success: false, error: 'VARIANT_NOT_FOUND' });
    }

    res.json({
      variantId: found.id,
      model_year_from: found.model_year_from ?? null,
      model_year_to: found.model_year_to ?? null,
      production_start_year: found.production_start_year ?? null,
      production_total: found.production_total ?? null,
      limited_edition: found.limited_edition ?? null,
      numbered_series: found.numbered_series ?? null,
      steering_side: found.steering_side ?? null,
      body_style: found.body_style ?? null,
      production_site: found.production_site ?? null,
      original_list_price_eur: found.original_list_price_eur ?? null,
      production_breakdown_notes_it: found.production_breakdown_notes_it ?? null,
      production_breakdown_notes_en: found.production_breakdown_notes_en ?? null,
      variant_editions: found.variant_editions ?? null,
      extended_variant_editions: found.extended_variant_editions ?? null,
      factory_colors: found.factory_colors ?? null
    });
  } catch (err) {
    next(err);
  }
});

// GET Media Assets for Variant
app.get('/api/v1/variants/:variantId/media', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { variantId } = req.params;
    const found = await catalogueRepository.getVariantByIdOrSlug(variantId);
    if (!found) {
      return res.status(404).json({ success: false, error: 'VARIANT_NOT_FOUND' });
    }

    res.json({
      variantId: found.id,
      hero_image_url: found.hero_image_url ?? null,
      gallery_images: found.gallery_images ?? null,
      youtube_video_ids: found.youtube_video_ids ?? null
    });
  } catch (err) {
    next(err);
  }
});

// POST Variant Compare
app.post('/api/v1/compare/variants', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { variantIds } = req.body;
    if (!Array.isArray(variantIds)) {
      return res.status(400).json({ error: 'variantIds array required' });
    }
    const variants = await catalogueRepository.getVariants();
    const results = variants.filter(v => variantIds.includes(v.id) || variantIds.includes(v.slug));
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// Search & Catalog Filter Endpoint
app.get('/api/v1/vehicles', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      query,
      category,
      manufacturerId,
      yearMin,
      yearMax,
      priceMin,
      priceMax,
      collectorScoreMin,
      investmentScoreMin,
      drivetrain,
      tier,
      limitedOnly
    } = req.query;

    let filtered = await catalogueRepository.getVariants();

    if (query && typeof query === 'string') {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(v => 
        v.manufacturer_name.toLowerCase().includes(q) ||
        v.model_name.toLowerCase().includes(q) ||
        v.variant_name.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        (v.history_it && v.history_it.toLowerCase().includes(q)) ||
        (v.history_en && v.history_en.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'All' && typeof category === 'string') {
      filtered = filtered.filter(v => v.category === category);
    }

    if (manufacturerId && typeof manufacturerId === 'string') {
      filtered = filtered.filter(v => v.manufacturer_id === manufacturerId || v.manufacturer_name.toLowerCase() === manufacturerId.toLowerCase());
    }

    if (tier && tier !== 'All' && typeof tier === 'string') {
      filtered = filtered.filter(v => v.tier === tier);
    }

    if (yearMin) {
      filtered = filtered.filter(v => (v.model_year_from ?? 0) >= Number(yearMin));
    }

    if (yearMax) {
      filtered = filtered.filter(v => ((v.model_year_to ?? v.model_year_from) ?? 9999) <= Number(yearMax));
    }

    if (priceMin) {
      filtered = filtered.filter(v => (v.current_median_price_eur ?? 0) >= Number(priceMin));
    }

    if (priceMax) {
      filtered = filtered.filter(v => (v.current_median_price_eur ?? 0) <= Number(priceMax));
    }

    if (collectorScoreMin) {
      filtered = filtered.filter(v => (v.scores?.collector_score?.overall_score ?? 0) >= Number(collectorScoreMin));
    }

    if (investmentScoreMin) {
      filtered = filtered.filter(v => (v.scores?.investment_score?.overall_score ?? 0) >= Number(investmentScoreMin));
    }

    if (drivetrain && drivetrain !== 'All' && typeof drivetrain === 'string') {
      filtered = filtered.filter(v => v.transmission?.drivetrain === drivetrain);
    }

    if (limitedOnly === 'true') {
      filtered = filtered.filter(v => v.limited_edition);
    }

    res.json({
      total: filtered.length,
      vehicles: filtered
    });
  } catch (err) {
    next(err);
  }
});

// Single Vehicle Detail
app.get('/api/v1/vehicles/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const vehicle = await catalogueRepository.getVariantByIdOrSlug(slug);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
});

// Compare Endpoint
app.get('/api/v1/compare', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idsStr = req.query.ids as string;
    if (!idsStr) {
      return res.json([]);
    }
    const ids = idsStr.split(',');
    const variants = await catalogueRepository.getVariants();
    const vehicles = variants.filter(v => ids.includes(v.id) || ids.includes(v.slug));
    res.json(vehicles);
  } catch (err) {
    next(err);
  }
});

// Full Knowledge Graph
app.get('/api/v1/graph/full', (req: Request, res: Response) => {
  res.json({
    entities: GRAPH_ENTITIES,
    relationships: GRAPH_RELATIONSHIPS
  });
});

// AI Advisor Endpoint (Gemini 3.6 Flash Server-Side Grounded AI)
app.post('/api/v1/ai/advisor', async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  return res.status(503).json({
    error: "AI_ADVISOR_GROUNDING_UNAVAILABLE",
    answer: null,
    referenced_slugs: [],
    confidence: null
  });
});

// Dealer Listings Endpoint
app.get('/api/v1/dealer/listings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const variants = await catalogueRepository.getVariants();
    const allListings = variants.flatMap(v => v.listings || []);
    res.json(allListings);
  } catch (err) {
    next(err);
  }
});

// Editorial Assertions Queue
app.get('/api/v1/editor/assertions', (req: Request, res: Response) => {
  res.status(503).json({
    success: false,
    error: 'EDITORIAL_ASSERTIONS_UNAVAILABLE',
    assertions: []
  });
});

// Admin Audit Log
app.get('/api/v1/admin/audit-log', (req: Request, res: Response) => {
  res.status(503).json({
    success: false,
    error: 'ADMIN_AUDIT_LOG_UNAVAILABLE',
    entries: []
  });
});

// -------------------------------------------------------------
// SEO, GEO (GENERATIVE ENGINE OPTIMIZATION) & AIO ENDPOINTS
// -------------------------------------------------------------

// Sitemap XML
app.get('/sitemap.xml', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const host = req.get('host') || 'therightgear.app';
    const protocol = req.protocol === 'https' || host.includes('ai.studio') || host.includes('run.app') ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const staticUrls = [
      '/',
      '/cars',
      '/motorcycles',
      '/events',
      '/market',
      '/about',
      '/faq',
      '/methodology',
      '/data-partnerships',
      '/contact',
      '/privacy',
      '/terms',
      '/llms.txt'
    ];

    const urls: string[] = [...staticUrls];

    // Canonical Maker routes (/brands/:maker)
    const makerSlugs = new Set<string>();
    const manufacturers = await catalogueRepository.getManufacturers();
    manufacturers.forEach(m => {
      if (m.slug) makerSlugs.add(m.slug);
    });
    
    const variants = await catalogueRepository.getVariants();
    variants.forEach(v => {
      if (v.manufacturer_name) {
        const slug = v.manufacturer_name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        if (slug) makerSlugs.add(slug);
      }
    });
    makerSlugs.forEach(slug => {
      urls.push(`/brands/${slug}`);
    });

    // Canonical Model, Generation, and Variant routes
    const modelUrls = new Set<string>();
    const generationUrls = new Set<string>();
    const variantUrls = new Set<string>();

    variants.forEach(v => {
      if (!v.manufacturer_name || !v.model_name) return;
      const isMotorcycle = (v.category as string) === 'motorcycle' || (v as any).vehicle_type === 'motorcycle';
      if (isMotorcycle) return;

      const makerSlug = v.manufacturer_name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const modelSlug = v.model_name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      if (!makerSlug || !modelSlug) return;

      modelUrls.add(`/cars/${makerSlug}/${modelSlug}`);

      if (v.generation_id && typeof v.generation_id === 'string' && v.generation_id.trim().length > 0) {
        const genSlug = v.generation_id.trim();
        generationUrls.add(`/cars/${makerSlug}/${modelSlug}/${genSlug}`);

        if (v.slug && typeof v.slug === 'string' && v.slug.trim().length > 0) {
          const varSlug = v.slug.trim();
          variantUrls.add(`/cars/${makerSlug}/${modelSlug}/${genSlug}/${varSlug}`);
        }
      }
    });

    modelUrls.forEach(u => urls.push(u));
    generationUrls.forEach(u => urls.push(u));
    variantUrls.forEach(u => urls.push(u));

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    urls.forEach(path => {
      xml += `  <url>\n    <loc>${baseUrl}${path}</loc>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    next(err);
  }
});

// Robots.txt
app.get('/robots.txt', (req: Request, res: Response) => {
  const host = req.get('host') || 'therightgear.app';
  const protocol = req.protocol === 'https' || host.includes('ai.studio') || host.includes('run.app') ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;

  const txt = `User-agent: *
Allow: /
Disallow: /admin

# AI Search & Crawler Engine Optimization (GEO/AIO)
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Applebot-Extended
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.header('Content-Type', 'text/plain');
  res.send(txt);
});

// LLMS.txt specification for AI models
const handleLlmsTxt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const host = req.get('host') || 'therightgear.app';
    const protocol = req.protocol === 'https' || host.includes('ai.studio') || host.includes('run.app') ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const variants = await catalogueRepository.getVariants();

    const md = `# Automotive Intelligence Platform — The Right Gear
> Knowledge graph, technical datasheets, historical provenance, and market valuations for iconic sports cars, youngtimers, and supercars.

## System Overview
The Automotive Intelligence Platform (AIP) on ${baseUrl} is an authoritative automotive knowledge base. It provides verified OEM technical specifications, production totals, engine architectures, chassis codes, and collector valuations.

## Taxonomy & Categories
- Supercar (/category/supercar): High-performance flagships (e.g., modern flagships)
- Hypercar (/category/hypercar): Limited-run pinnacle engineering (e.g., limited-run pinnacles)
- Youngtimer (/category/youngtimer): Modern classics from 1980s-2000s (e.g., 1980s-2000s icons)
- GT Classic (/category/gt-classic): Grand tourers and vintage racing legends (e.g., vintage legends)
- Homologation Special (/category/homologation-special): Motorsport classification road cars (e.g., Porsche 911 GT1 Straßenversion)

## Featured Vehicles & Direct Datasheet Slugs
${variants.map(v => `- [${v.manufacturer_name} ${v.model_name} ${v.variant_name}](${baseUrl}/vehicle/${v.slug}): ${v.engine?.power_hp || 'N/A'} HP, ${v.engine?.torque_nm || 'N/A'} Nm, 0-100 km/h in ${v.specs?.acceleration_0_100 || 'N/A'}s. Market Valuation: € ${v.current_median_price_eur?.toLocaleString('en-US') || 'N/A'}`).join('\n')}

## Knowledge Graph Entities (Designers, Engineers, Coachbuilders)
${GRAPH_ENTITIES.map(e => `- [${e.name} (${e.type})](${baseUrl}/entity/${(e as any).slug || e.id}): ${(e as any).roleTitle || (e as any).role || e.type}`).join('\n')}

## Public REST API for AI Retrieval
- GET ${baseUrl}/api/v1/vehicles — Complete vehicle catalog
- GET ${baseUrl}/api/v1/vehicles/:slug — Technical specifications & JSON-LD schema
- GET ${baseUrl}/api/v1/manufacturers — Official manufacturer list
- GET ${baseUrl}/api/v1/categories — Category & subcategory taxonomy
- GET ${baseUrl}/api/v1/graph — Knowledge Graph entities and relationships
`;

    res.header('Content-Type', 'text/markdown; charset=utf-8');
    res.send(md);
  } catch (err) {
    next(err);
  }
};

app.get('/llms.txt', handleLlmsTxt);
app.get('/.well-known/llms.txt', handleLlmsTxt);

// Categories API Endpoint
app.get('/api/v1/categories', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allVariants = await catalogueRepository.getVariants();
    res.json([
      { slug: 'supercar', name: 'Supercar', description: 'Vetture ad alte prestazioni ad elevata tecnologia e potenza.', count: allVariants.filter(v => v.category === 'Supercar').length },
      { slug: 'hypercar', name: 'Hypercar', description: 'Edizioni limite estreme, pinnacolo dell\'ingegneria automobilistica.', count: allVariants.filter(v => v.category === 'Hypercar').length },
      { slug: 'youngtimer', name: 'Youngtimer', description: 'Classiche moderne anni \'80, \'90 e 2000 ad alto valore collezionistico.', count: allVariants.filter(v => v.category === 'Youngtimer').length },
      { slug: 'gt-classic', name: 'GT Classic', description: 'Gran Turismo storiche e vetture sportive d\'epoca.', count: allVariants.filter(v => (v.category as string) === 'Historic Classic' || (v.category as string) === 'GT / Grand Tourer').length },
      { slug: 'homologation-special', name: 'Homologation Special', description: 'Modelli stradali prodotti per omologazione Motorsport.', count: allVariants.filter(v => v.category === 'Homologation Special').length }
    ]);
  } catch (err) {
    next(err);
  }
});

// Catalogue Structural Validation Diagnostic Endpoint
app.get('/api/v1/catalogue/validation', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await catalogueRepository.validate();
    res.json(result);
  } catch (err) {
    next(err);
  }
});


// Mass Import & Multi-Source Extraction Endpoint
app.post('/api/v1/import/extract-vehicle', async (req: Request, res: Response) => {
  const { query, provider = 'gemini_google_search' } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Invia una query di ricerca o una lista di modelli auto.' });
  }

  // Pluggable provider handling architecture
  if (provider === 'paid_carquery_api' || provider === 'paid_mobile_de_api' || provider === 'paid_vincario_vin_api') {
    return res.status(503).json({
      success: false,
      provider,
      error: 'PROVIDER_NOT_CONFIGURED',
      message: 'Connettore API commerciale non configurato.',
      records: []
    });
  }

  // Active Default: Gemini Google Search Grounding
  if (!aiClient) {
    return res.status(503).json({
      success: false,
      provider: 'free_web_fallback',
      error: 'GEMINI_UNAVAILABLE',
      message: 'Configura GEMINI_API_KEY per abilitare l\'estrazione live. Estrazione offline simulata disabilitata per Data Integrity.',
      records: []
    });
  }

  try {
    const prompt = `
Sei l'agente specializzato nell'estrazione dati della banca dati automobilistica.
Ricerca sul web tramite Google Search informazioni aggiornate, ufficiali e autorevoli per i seguenti veicoli richiesti dall'amministratore:
"${query}"

Per ciascun veicolo trovato, estrai una scheda tecnica completa rispettando TASSATIVAMENTE la seguente struttura JSON (incluso un array JSON denominato "vehicles"). IMPORTANTE: NON INVENTARE DATI. Se un dato tecnico o di mercato non è disponibile nelle fonti, restituisci null anziché stimarlo:

\`\`\`json
{
  "vehicles": [
    {
      "manufacturer_name": "Nome Marca (es. Brand, Altro)",
      "model_name": "Nome Modello (es. 296 GTB, 911 GT3 RS, 33 Stradale)",
      "variant_name": "Specifiche variante/allestimento (es. Assetto Fiorano, PDK 525 CV)",
      "category": "Una tra: Hypercar, Supercar, Youngtimer, Classic, GT, Limited Series, Homologation Special",
      "model_year_from": 2024,
      "model_year_to": null,
      "production_total": 500,
      "power_hp": 830,
      "torque_nm": 740,
      "engine_cc": 2992,
      "engine_layout": "V6 Twin-Turbo + E-Motor Mid-Rear",
      "transmission": "Dual-Clutch 8-Speed",
      "top_speed_kmh": 330,
      "acceleration_0_100": 2.9,
      "price_new_eur": 320000,
      "estimated_market_value_eur": 380000,
      "hero_image_url": "URL immagine rappresentativa reale o null se non disponibile",
      "key_features": ["Caratteristica 1", "Caratteristica 2", "Caratteristica 3"],
      "technical_description": "Breve descrizione tecnica e storica ufficiale del modello."
    }
  ]
}
\`\`\`

Fornisci ESCLUSIVAMENTE il blocco di codice JSON valido contenente la lista dei veicoli estratta dalle fonti web ufficiali.
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1
      }
    });

    const responseText = response.text || '';
    
    // Extract Grounding Citations from Google Search
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingSources = rawChunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title || 'Fonte Web Automotive',
        uri: c.web.uri || ''
      }));

    // Parse JSON block from Gemini output
    let parsedVehicles: any[] = [];
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const parsedData = JSON.parse(jsonStr);
      parsedVehicles = Array.isArray(parsedData) ? parsedData : (parsedData.vehicles || [parsedData]);
    }

    // Format records to match internal VehicleVariant schema
    const formattedRecords = parsedVehicles.map((v: any, idx: number) => ({
      id: `ext-gemini-${Date.now()}-${idx}`,
      slug: `${(v.manufacturer_name || 'Auto').toLowerCase()}-${(v.model_name || 'modello').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`,
      manufacturer_name: v.manufacturer_name || 'Costruttore Sconosciuto',
      model_name: v.model_name || 'Modello Sconosciuto',
      variant_name: v.variant_name || null,
      category: v.category || null,
      model_year_from: v.model_year_from ? Number(v.model_year_from) : null,
      model_year_to: v.model_year_to ? Number(v.model_year_to) : null,
      production_total: v.production_total ? Number(v.production_total) : null,
      power_hp: v.power_hp ? Number(v.power_hp) : null,
      torque_nm: v.torque_nm ? Number(v.torque_nm) : null,
      engine_cc: v.engine_cc ? Number(v.engine_cc) : null,
      engine_layout: v.engine_layout || null,
      transmission: v.transmission || null,
      top_speed_kmh: v.top_speed_kmh ? Number(v.top_speed_kmh) : null,
      acceleration_0_100: v.acceleration_0_100 ? Number(v.acceleration_0_100) : null,
      price_new_eur: v.price_new_eur ? Number(v.price_new_eur) : null,
      estimated_market_value_eur: v.estimated_market_value_eur ? Number(v.estimated_market_value_eur) : null,
      hero_image_url: v.hero_image_url && v.hero_image_url.startsWith('http') 
         ? v.hero_image_url 
         : null,
      data_status: 'imported',
      technical_description: v.technical_description || null,
      key_features: Array.isArray(v.key_features) ? v.key_features : [],
      source_references: groundingSources.map((s: any) => s.title).slice(0, 3)
    }));

    return res.json({
      success: true,
      provider: 'gemini_google_search',
      message: `Estratti con successo ${formattedRecords.length} record completi tramite Gemini Search Grounding e fonti web.`,
      records: formattedRecords,
      groundingSources
    });

  } catch (error: any) {
    console.error('Vehicle Import API Error:', error);
    return res.status(500).json({
      error: 'Impossibile completare l\'estrazione web dei dati automobilistici.',
      details: error.message
    });
  }
});

// -------------------------------------------------------------
// IMPORT LAB v0.1 REST API ENDPOINTS & AUTHORIZATION GATE
// -------------------------------------------------------------

// Server-Side Authorization Middleware for Privileged Import Lab APIs
const requireImportLabAuth = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const userRole = req.headers['x-user-role'] as string;
  const apiKey = req.headers['x-import-lab-key'] as string;

  // FAIL CLOSED by default
  const configuredSecret = process.env.IMPORT_LAB_SECRET;
  
  if (configuredSecret && apiKey === configuredSecret) {
    return next();
  }

  if (!authHeader) {
    return res.status(401).json({
      error: 'Unauthorized: Missing authentication credentials.'
    });
  }

  return res.status(401).json({
    error: 'Unauthorized: BLOCKED_PENDING_FIREBASE_VERIFICATION. Server-side Firebase Admin token verification is required.'
  });
};

app.use('/api/v1/import-lab', requireImportLabAuth);

// Start or Trigger Import Job
app.post('/api/v1/import-lab/jobs', async (req: Request, res: Response) => {
  try {
    const { targetVariantId = '', mode = 'LIVE' } = req.body || {};
    const job = await importEngine.executeImportJob(targetVariantId, { mode });
    const metrics = importLabStore.calculateMetrics(job.id);
    return res.json({ success: true, job, metrics });
  } catch (err: any) {
    console.error('Import Lab Job Execution Error:', err);
    return res.status(500).json({ error: 'Failed to execute Import Lab job', details: err.message });
  }
});

// List all Import Jobs
app.get('/api/v1/import-lab/jobs', (req: Request, res: Response) => {
  const jobs = importLabStore.getAllJobs();
  return res.json({ jobs });
});

// Get Import Job by ID
app.get('/api/v1/import-lab/job/:jobId', (req: Request, res: Response) => {
  const { jobId } = req.params;
  const job = importLabStore.getJob(jobId);
  if (!job) return res.status(404).json({ error: 'ImportJob not found' });
  const metrics = importLabStore.calculateMetrics(jobId);
  return res.json({ job, metrics });
});

// Get Sources for Job
app.get('/api/v1/import-lab/job/:jobId/sources', (req: Request, res: Response) => {
  const { jobId } = req.params;
  const sources = importLabStore.getDataSourcesForJob(jobId);
  return res.json({ sources });
});

// Get Assertions for Job
app.get('/api/v1/import-lab/job/:jobId/assertions', (req: Request, res: Response) => {
  const { jobId } = req.params;
  const assertions = importLabStore.getAssertionsForJob(jobId);
  return res.json({ assertions });
});

// Get Conflicts for Job
app.get('/api/v1/import-lab/job/:jobId/conflicts', (req: Request, res: Response) => {
  const { jobId } = req.params;
  const conflicts = importLabStore.getConflictsForJob(jobId);
  return res.json({ conflicts });
});

// Get Media for Job
app.get('/api/v1/import-lab/job/:jobId/media', (req: Request, res: Response) => {
  const { jobId } = req.params;
  const media = importLabStore.getMediaCandidatesForJob(jobId);
  return res.json({ media });
});

// Get Videos for Job
app.get('/api/v1/import-lab/job/:jobId/videos', (req: Request, res: Response) => {
  const { jobId } = req.params;
  const videos = importLabStore.getVideoCandidatesForJob(jobId);
  return res.json({ videos });
});

// Approve Assertion
app.post('/api/v1/import-lab/job/:jobId/assertion/:assertionId/approve', (req: Request, res: Response) => {
  const { jobId, assertionId } = req.params;
  const { selectedBy = 'editor' } = req.body || {};

  const assertions = importLabStore.getAssertionsForJob(jobId);
  const ast = assertions.find(a => a.id === assertionId);
  if (!ast) return res.status(404).json({ error: 'Assertion not found' });

  // Update status to APPROVED
  const updatedAst = importLabStore.updateAssertion(jobId, assertionId, { verificationStatus: 'APPROVED' });

  // Register Canonical Selection
  importLabStore.setCanonicalSelection({
    entityId: ast.subjectEntityId,
    fieldName: ast.fieldName,
    selectedAssertionId: assertionId,
    selectedBy,
    selectedAt: new Date().toISOString(),
    selectionReason: 'Approved by editorial review in Import Lab v0.1'
  });

  return res.json({ success: true, assertion: updatedAst });
});

// Reject Assertion
app.post('/api/v1/import-lab/job/:jobId/assertion/:assertionId/reject', (req: Request, res: Response) => {
  const { jobId, assertionId } = req.params;
  const updatedAst = importLabStore.updateAssertion(jobId, assertionId, { verificationStatus: 'REJECTED' });
  if (!updatedAst) return res.status(404).json({ error: 'Assertion not found' });
  return res.json({ success: true, assertion: updatedAst });
});

// Resolve Conflict
app.post('/api/v1/import-lab/job/:jobId/conflict/:conflictId/resolve', (req: Request, res: Response) => {
  const { jobId, conflictId } = req.params;
  const { approvedAssertionId, notes } = req.body || {};

  if (!approvedAssertionId) return res.status(400).json({ error: 'approvedAssertionId is required' });

  const conflict = importLabStore.resolveConflict(jobId, conflictId, approvedAssertionId, notes);
  if (!conflict) return res.status(404).json({ error: 'Conflict not found' });

  // Register Canonical Selection for the approved assertion
  const assertions = importLabStore.getAssertionsForJob(jobId);
  const approvedAst = assertions.find(a => a.id === approvedAssertionId);
  if (approvedAst) {
    importLabStore.setCanonicalSelection({
      entityId: approvedAst.subjectEntityId,
      fieldName: approvedAst.fieldName,
      selectedAssertionId: approvedAssertionId,
      selectedBy: 'editor',
      selectedAt: new Date().toISOString(),
      selectionReason: `Resolved conflict ${conflictId}`
    });
  }

  return res.json({ success: true, conflict });
});

// Public Preview Endpoint (Retrieves ONLY approved canonical data)
app.get('/api/v1/import-lab/preview/:variantId', (req: Request, res: Response) => {
  const { variantId } = req.params;
  const canonicalData = importLabStore.getApprovedCanonicalData(variantId);
  return res.json({ variantId, canonicalData });
});

// -------------------------------------------------------------
// CENTRALIZED EXPRESS ERROR HANDLER
// -------------------------------------------------------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err?.name === 'CataloguePersistenceError' || err?.name === 'CatalogueConfigurationError') {
    return res.status(503).json({
      success: false,
      error: 'CATALOGUE_SERVICE_UNAVAILABLE',
      message: 'The catalogue storage service is currently unconfigured or unavailable.'
    });
  }

  if (err?.name === 'CatalogueIntegrityError') {
    return res.status(503).json({
      success: false,
      error: 'CATALOGUE_INTEGRITY_ERROR',
      message: 'Catalogue structural validation encountered fatal errors.'
    });
  }

  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR'
  });
});

// -------------------------------------------------------------
// SERVER-SIDE HTML PRERENDERER (SEO, GEO & AIO COMPLIANCE)
// -------------------------------------------------------------
let distTemplate = '';

function renderHtmlPage(reqPath: string, host: string, protocol: string, devTemplate?: string): string {
  const baseUrl = `${protocol}://${host}`;
  const cleanPath = reqPath.split('?')[0];

  let title = "The Right Gear | Iconic Cars and Motorbikes Decoded";
  let description = "Automotive Intelligence platform dedicated to iconic, collectible, and investment-relevant automobiles. Technical specs, production counts, and verified provenance.";
  let robots = "index, follow";
  let jsonLd: any = null;
  let bodyHtml = "";

  if (cleanPath === '/' || cleanPath === '') {
    title = "The Right Gear | Iconic Cars and Motorbikes Decoded";
    description = "The Right Gear is the Automotive Intelligence platform for iconic, collectible and investment-relevant automobiles. Discover verified technical specs, production counts, and car provenance.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "The Right Gear",
      "url": baseUrl,
      "description": description
    };
    bodyHtml = `
      <main>
        <h1>The Right Gear | Iconic Cars and Motorbikes Decoded</h1>
        <section>
          <h2>Market Intelligence</h2>
          <p>Validated auction results and price observations.</p>
        </section>
        <section>
          <h2>Events & Auctions</h2>
          <p>Official calendars and upcoming auction catalogues.</p>
        </section>
        <section>
          <h2>The People Behind the Machines</h2>
          <p>Designers, Engineers, Racing Figures, and recently added canonical records.</p>
        </section>
      </main>
    `;
  } else if (cleanPath === '/faq') {
    title = "FAQ & How it Works | The Right Gear";
    description = "Frequently asked questions about The Right Gear, our automotive catalogue, data methodology, and market intelligence.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": []
    };
    bodyHtml = `<main><h1>FAQ & How it Works</h1></main>`;
  } else if (cleanPath === '/about') {
    title = "About The Right Gear | Automotive Intelligence Platform";
    description = "Learn about The Right Gear — an independent Automotive Intelligence platform dedicated to collectible and investment-relevant automobiles.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About The Right Gear",
      "url": `${baseUrl}/about`
    };
    bodyHtml = `
      <main>
        <h1>About The Right Gear</h1>
        <p>The Right Gear is an Automotive Intelligence platform dedicated to iconic, collectible and investment-relevant automobiles.</p>
        <h2>Mission & Vision</h2>
        <p>Its objective is to become a trusted reference platform for automotive history, engineering, production, specifications, people, market intelligence and relationships between important automobiles.</p>
      </main>
    `;
  } else if (cleanPath === '/methodology') {
    title = "Data Methodology & Provenance | The Right Gear";
    description = "Discover The Right Gear data architecture, source attribution, conflict resolution, and verification standards for automotive facts.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Data Methodology — The Right Gear",
      "url": `${baseUrl}/methodology`
    };
    bodyHtml = `
      <main>
        <h1>Data Methodology & Provenance</h1>
        <p>At The Right Gear, data integrity is our absolute highest priority. Every technical specification, production total, engine code, and historical record is tracked back to verified sources.</p>
        <h2>Four-Layer Provenance Architecture</h2>
        <ol>
          <li>Source Documents & Primary Registries</li>
          <li>Structured Assertions</li>
          <li>Editorial Review & Conflict Identification</li>
          <li>Canonical Knowledge Publication</li>
        </ol>
      </main>
    `;
  } else if (cleanPath === '/data-partnerships') {
    title = "Data Partnerships & Provider Ecosystem | The Right Gear";
    description = "Information for commercial data providers, enterprise APIs, JATO Dynamics, CLASSIC.COM, and automotive archives integrating with The Right Gear.";
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Data Partnerships — The Right Gear",
      "url": `${baseUrl}/data-partnerships`
    };
    bodyHtml = `
      <main>
        <h1>Data Partnerships & Provider Ecosystem</h1>
        <p>The Right Gear provides a partner-ready architecture designed for integration with automotive data providers, auction platforms, and OEM archives.</p>
      </main>
    `;
  } else if (cleanPath.startsWith('/entity/')) {
    robots = "noindex, nofollow";
    const entitySlug = cleanPath.split('/entity/')[1];
    title = `${entitySlug.replace(/-/g, ' ').toUpperCase()} | Internal Research Entity | The Right Gear`;
    description = "Internal research entity profile.";
    bodyHtml = `
      <main>
        <h1>${entitySlug.replace(/-/g, ' ').toUpperCase()}</h1>
        <p>Internal research entity record.</p>
      </main>
    `;
  } else {
    title = "The Right Gear | Iconic Cars and Motorbikes Decoded";
    description = "Automotive Intelligence platform dedicated to iconic, collectible, and investment-relevant automobiles.";
    bodyHtml = `
      <main>
        <h1>The Right Gear</h1>
        <p>Automotive Intelligence & Provenance for collectible automobiles.</p>
      </main>
    `;
  }

  bodyHtml += `
      <footer>
        <p>&copy; ${new Date().getFullYear()} The Right Gear</p>
        <nav>
          <a href="/about">About</a> | 
          <a href="/privacy">Privacy</a> | 
          <a href="/terms">Terms and Conditions</a> | 
          <a href="/contact">Contact</a>
        </nav>
      </footer>
    `;

  const jsonLdScript = jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : '';

  if ((process.env.NODE_ENV === 'production' && distTemplate) || devTemplate) {
    let output = devTemplate || distTemplate;
    // Replace title
    output = output.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
    // Remove existing meta description if any
    output = output.replace(/<meta name="description".*?>/, '');
    
    // Inject SEO meta tags before </head>
    const metaTags = `
    <meta name="description" content="${description}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${baseUrl}${cleanPath}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${baseUrl}${cleanPath}" />
    <meta property="og:site_name" content="The Right Gear" />
    ${jsonLdScript}`;
    
    output = output.replace('</head>', `${metaTags}\n  </head>`);
    output = output.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
    
    return output;
  }

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="${robots}" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${baseUrl}${cleanPath}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${baseUrl}${cleanPath}" />
    <meta property="og:site_name" content="The Right Gear" />
    ${jsonLdScript}
  </head>
  <body>
    <div id="root">${bodyHtml}</div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
}

// -------------------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    try {
      distTemplate = fs.readFileSync(path.join(process.cwd(), 'dist', 'index.html'), 'utf-8');
    } catch (e) {
      console.error('Could not read dist/index.html', e);
    }
  }

  // Health endpoint
  app.get('/healthz', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  let vite: any;
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
  }

  // SSR / Prerender Middleware for HTML page routes
  app.get([
    '/',
    '/about',
    '/faq',
    '/methodology',
    '/data-partnerships',
    '/explore',
    '/market',
    '/compare',
    '/graph',
    '/editorial',
    '/brands/*',
    '/cars/*',
    '/manufacturer/*',
    '/category/*',
    '/vehicle/*',
    '/entity/*',
    '*'
  ], async (req: Request, res: Response, next: any) => {
    if (req.path.startsWith('/api/') || req.path.includes('.')) {
      return next();
    }

    const host = req.get('host') || 'therightgear.app';
    const protocol = req.protocol === 'https' || host.includes('ai.studio') || host.includes('run.app') ? 'https' : 'http';

    let html = '';
    
    if (vite) {
      try {
        const baseHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
        const transformedHtml = await vite.transformIndexHtml(req.path, baseHtml);
        html = renderHtmlPage(req.path, host, protocol, transformedHtml);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        console.error(e);
        return res.status(500).end(e.message);
      }
    } else {
      html = renderHtmlPage(req.path, host, protocol);
    }

    res.header('Content-Type', 'text/html; charset=utf-8');
    return res.send(html);
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Automotive Intelligence Platform] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
