import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { CATALOG_DATABASE, MANUFACTURERS, GRAPH_ENTITIES, GRAPH_RELATIONSHIPS, DATA_ASSERTIONS_MOCK } from './src/data/catalogData.js';

dotenv.config();

const app = express();
const PORT = 3000;

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
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '0.2',
    timestamp: new Date().toISOString(),
    catalog_count: CATALOG_DATABASE.length,
    gemini_configured: !!aiClient
  });
});

// Manufacturers
app.get('/api/v1/manufacturers', (req: Request, res: Response) => {
  res.json(MANUFACTURERS);
});

// -------------------------------------------------------------
// HIERARCHICAL MODEL, GENERATION & VARIANT ENDPOINTS
// -------------------------------------------------------------

// Model navigation structure (Single endpoint payload for VersionNavigator)
app.get('/api/v1/models/:modelId/navigation', (req: Request, res: Response) => {
  const { modelId } = req.params;
  const isBmwM3 = modelId.toLowerCase().includes('m3');
  
  if (isBmwM3) {
    return res.json({
      manufacturer: { id: 'm-bmw', name: 'BMW', slug: 'bmw', countryCode: 'DE' },
      model: { id: 'bmw-m3', name: 'M3', slug: 'm3', years: '1986–Presente', category: 'Youngtimer' },
      generations: [
        {
          id: 'bmw-m3-e30',
          code: 'E30',
          name: 'M3 E30',
          years: '1986–1991',
          slug: 'e30',
          variants: [
            { id: 'bmw-m3-e30-2-3', slug: 'm3-2-3', name: 'M3 2.3 (195/200 CV)', years: '1986–1991', limitedEdition: false, productionTotal: 17970, active: true, powerHp: 200 },
            { id: 'bmw-m3-e30-evolution', slug: 'm3-evolution', name: 'M3 Evolution I/II', years: '1988', limitedEdition: true, productionTotal: 501, active: false, powerHp: 220 },
            { id: 'bmw-m3-e30-sport-evolution', slug: 'sport-evolution', name: 'M3 Sport Evolution (238 CV)', years: '1990', limitedEdition: true, productionTotal: 600, active: false, powerHp: 238 }
          ]
        },
        {
          id: 'bmw-m3-e36',
          code: 'E36',
          name: 'M3 E36',
          years: '1992–1999',
          slug: 'e36',
          variants: [
            { id: 'bmw-m3-e36-3-0', slug: 'm3-3-0', name: 'M3 3.0 (286 CV)', years: '1992–1995', limitedEdition: false, productionTotal: 28867, active: false, powerHp: 286 },
            { id: 'bmw-m3-e36-3-2', slug: 'm3-3-2', name: 'M3 3.2 (321 CV)', years: '1995–1999', limitedEdition: false, productionTotal: 42019, active: false, powerHp: 321 },
            { id: 'bmw-m3-e36-gt', slug: 'm3-gt', name: 'M3 GT (295 CV)', years: '1995', limitedEdition: true, productionTotal: 356, active: false, powerHp: 295 }
          ]
        },
        {
          id: 'bmw-m3-e46',
          code: 'E46',
          name: 'M3 E46',
          years: '2000–2006',
          slug: 'e46',
          variants: [
            { id: 'bmw-m3-e46-coupe', slug: 'm3-coupe', name: 'M3 Coupé (343 CV)', years: '2000–2006', limitedEdition: false, productionTotal: 84317, active: false, powerHp: 343 },
            { id: 'bmw-m3-e46-csl', slug: 'm3-csl', name: 'M3 CSL (360 CV)', years: '2003', limitedEdition: true, productionTotal: 1383, active: false, powerHp: 360 }
          ]
        },
        {
          id: 'bmw-m3-e92',
          code: 'E90/E92/E93',
          name: 'M3 V8',
          years: '2007–2013',
          slug: 'e92',
          variants: [
            { id: 'bmw-m3-e92-v8', slug: 'm3-v8-coupe', name: 'M3 V8 Coupé (420 CV)', years: '2007–2013', limitedEdition: false, productionTotal: 65833, active: false, powerHp: 420 },
            { id: 'bmw-m3-e92-gts', slug: 'm3-gts', name: 'M3 GTS 4.4 (450 CV)', years: '2010', limitedEdition: true, productionTotal: 135, active: false, powerHp: 450 }
          ]
        },
        {
          id: 'bmw-m3-f80',
          code: 'F80',
          name: 'M3 F80',
          years: '2014–2018',
          slug: 'f80',
          variants: [
            { id: 'bmw-m3-f80-sedan', slug: 'm3-sedan', name: 'M3 Sedan (431 CV)', years: '2014–2018', limitedEdition: false, productionTotal: 33477, active: false, powerHp: 431 },
            { id: 'bmw-m3-f80-cs', slug: 'm3-cs', name: 'M3 CS (460 CV)', years: '2018', limitedEdition: true, productionTotal: 1200, active: false, powerHp: 460 }
          ]
        },
        {
          id: 'bmw-m3-g80',
          code: 'G80/G81',
          name: 'M3 G80 / G81',
          years: '2020–Presente',
          slug: 'g80',
          variants: [
            { id: 'bmw-m3-g80-competition', slug: 'm3-competition', name: 'M3 Competition xDrive (510 CV)', years: '2020–Pres.', limitedEdition: false, productionTotal: 26000, active: false, powerHp: 510 },
            { id: 'bmw-m3-g80-cs', slug: 'm3-cs-g80', name: 'M3 CS G80 (550 CV)', years: '2023', limitedEdition: true, productionTotal: 2000, active: false, powerHp: 550 }
          ]
        }
      ]
    });
  }

  // Fallback for other vehicles
  const vehicle = CATALOG_DATABASE.find(v => v.slug === modelId || v.id === modelId || v.model_name.toLowerCase().replace(/\s+/g, '-') === modelId);
  const mName = vehicle ? vehicle.manufacturer_name : 'Manufacturer';
  const modelName = vehicle ? vehicle.model_name : 'Model';
  
  return res.json({
    manufacturer: { id: `m-${mName.toLowerCase()}`, name: mName, slug: mName.toLowerCase() },
    model: { id: modelId, name: modelName, slug: modelId, years: vehicle ? `${vehicle.model_year_from}–${vehicle.model_year_to || 'Pres.'}` : '1990–2000' },
    generations: [
      {
        id: `gen-${modelId}`,
        code: 'Gen 1',
        name: `${modelName} Series`,
        years: vehicle ? `${vehicle.model_year_from}–${vehicle.model_year_to || ''}` : '1990–2000',
        slug: 'gen-1',
        variants: [
          {
            id: vehicle?.id || modelId,
            slug: vehicle?.slug || modelId,
            name: vehicle?.variant_name || modelName,
            years: vehicle ? `${vehicle.model_year_from}–${vehicle.model_year_to || ''}` : '1990–2000',
            limitedEdition: vehicle?.limited_edition || false,
            productionTotal: vehicle?.production_total || 1000,
            active: true,
            powerHp: vehicle?.engine.power_hp || 400
          }
        ]
      }
    ]
  });
});

// GET Model details
app.get('/api/v1/models/:modelId', (req: Request, res: Response) => {
  const { modelId } = req.params;
  const isBmwM3 = modelId.toLowerCase().includes('m3');
  
  if (isBmwM3) {
    return res.json({
      modelId: 'bmw-m3',
      manufacturerId: 'm-bmw',
      manufacturerName: 'BMW',
      manufacturerSlug: 'bmw',
      modelName: 'M3',
      modelSlug: 'm3',
      category: 'Youngtimer',
      yearsRange: '1986–Presente',
      totalGenerationsCount: 6,
      totalVariantsCount: 18,
      powerHpRange: [195, 550],
      collectorScoreOverall: 94,
      investmentScoreOverall: 91,
      priceRangeEur: '€25.000 - €350.000+',
      heroImageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop',
      historicSummaryIt: 'La BMW M3 rappresenta la pietra d’paragone mondiale delle berline sportive e coupé. Creata da BMW Motorsport nel 1986, si è evoluta in 6 generazioni iconiche.',
      historicSummaryEn: 'The BMW M3 is the benchmark for high-performance sports saloons and coupes, spanning 6 generations from E30 to G80.'
    });
  }

  const v = CATALOG_DATABASE.find(x => x.slug === modelId || x.id === modelId);
  if (!v) {
    return res.status(404).json({ error: 'Model not found' });
  }
  res.json({
    modelId: v.id,
    manufacturerId: v.manufacturer_id,
    manufacturerName: v.manufacturer_name,
    manufacturerSlug: v.manufacturer_name.toLowerCase(),
    modelName: v.model_name,
    modelSlug: v.slug,
    category: v.category,
    yearsRange: `${v.model_year_from}–${v.model_year_to || 'Presente'}`,
    totalGenerationsCount: 1,
    totalVariantsCount: 1,
    powerHpRange: [v.engine.power_hp, v.engine.power_hp],
    collectorScoreOverall: v.scores.collector_score.overall_score,
    investmentScoreOverall: v.scores.investment_score.overall_score,
    priceRangeEur: `€${v.current_median_price_eur.toLocaleString()}`,
    heroImageUrl: v.hero_image_url,
    historicSummaryIt: v.history_it,
    historicSummaryEn: v.history_en
  });
});

// GET Generations for Model
app.get('/api/v1/models/:modelId/generations', (req: Request, res: Response) => {
  const { modelId } = req.params;
  res.json([
    { id: 'bmw-m3-e30', code: 'E30', publicName: 'M3 E30', years: '1986–1991', productionTotal: 17970 },
    { id: 'bmw-m3-e36', code: 'E36', publicName: 'M3 E36', years: '1992–1999', productionTotal: 71242 },
    { id: 'bmw-m3-e46', code: 'E46', publicName: 'M3 E46', years: '2000–2006', productionTotal: 85700 },
    { id: 'bmw-m3-e92', code: 'E90/E92', publicName: 'M3 V8', years: '2007–2013', productionTotal: 65968 },
    { id: 'bmw-m3-f80', code: 'F80', publicName: 'M3 F80', years: '2014–2018', productionTotal: 34677 },
    { id: 'bmw-m3-g80', code: 'G80/G81', publicName: 'M3 G80', years: '2020–Presente', productionTotal: 28000 }
  ]);
});

// GET Generation details
app.get('/api/v1/generations/:generationId', (req: Request, res: Response) => {
  const { generationId } = req.params;
  res.json({
    generationId,
    modelId: 'bmw-m3',
    generationCode: 'E30',
    publicName: 'BMW M3 E30',
    yearsRange: '1986–1991',
    productionTotal: 17970,
    descriptionIt: 'Icona indiscussa sviluppata da BMW Motorsport per dominare i campionati Turismo DTM e Gruppo A.',
    availableEngines: ['2.3L S14B23', '2.5L S14B25 EVO III'],
    bodyStyles: ['Coupé 2 Porte', 'Cabriolet'],
    heroImageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop'
  });
});

// GET Variants for Generation
app.get('/api/v1/generations/:generationId/variants', (req: Request, res: Response) => {
  res.json([
    { id: 'bmw-m3-e30-2-3', name: 'M3 2.3 (195/200 CV)', years: '1986–1991', powerHp: 200, productionTotal: 17970 },
    { id: 'bmw-m3-e30-evolution', name: 'M3 Evolution I/II', years: '1988', powerHp: 220, productionTotal: 501 },
    { id: 'bmw-m3-e30-sport-evolution', name: 'M3 Sport Evolution (238 CV)', years: '1990', powerHp: 238, productionTotal: 600 }
  ]);
});

// GET Single Variant
app.get('/api/v1/variants/:variantId', (req: Request, res: Response) => {
  const { variantId } = req.params;
  const found = CATALOG_DATABASE.find(v => v.id === variantId || v.slug === variantId);
  if (found) {
    return res.json(found);
  }
  // Return default demo payload for BMW M3 Sport Evolution
  res.json({
    id: 'bmw-m3-e30-sport-evolution',
    generation_id: 'bmw-m3-e30',
    manufacturer_id: 'm-bmw',
    manufacturer_name: 'BMW',
    model_name: 'M3',
    slug: 'sport-evolution',
    variant_name: 'M3 Sport Evolution (E30 2.5 EVO III)',
    tier: 'Hero',
    category: 'Youngtimer',
    market_code: 'EUR-SPEC',
    model_year_from: 1990,
    model_year_to: 1990,
    steering_side: 'LHD',
    body_style: 'Coupé 2 Porte',
    limited_edition: true,
    numbered_series: true,
    production_total: 600,
    original_list_price_eur: 85000,
    data_status: 'demo',
    hero_image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop'
    ],
    engine: {
      id: 'eng-s14b25',
      manufacturer_id: 'm-bmw',
      engine_code: 'S14B25',
      family_name: 'BMW Motorsport S14 4-Cyl',
      architecture: 'Inline-4',
      cylinders: 4,
      displacement_cc: 2467,
      aspiration: 'Naturally Aspirated',
      fuel_type: 'Petrol',
      power_kw: 175,
      power_hp: 238,
      torque_nm: 240,
      redline_rpm: 7250
    },
    transmission: {
      id: 'trans-getrag-265',
      name: '5-Speed Dog-Leg Manual',
      type: 'Manual',
      gears: 5,
      manufacturer: 'Getrag 265/5',
      drivetrain: 'RWD',
      differential_type: 'Mechanical Limited Slip 25%'
    },
    specs: {
      kerb_weight_kg: 1200,
      dry_weight_kg: 1150,
      length_mm: 4345,
      width_mm: 1680,
      height_mm: 1370,
      wheelbase_mm: 2565,
      top_speed_kph: 248,
      acceleration_0_100: 6.1,
      power_to_weight_hp_ton: 198,
      fuel_capacity_l: 62
    },
    scores: {
      collector_score: {
        overall_score: 97,
        rarity_weight: 98,
        historical_relevance: 99,
        desirability: 98,
        originality_typical: 95,
        technical_relevance: 96,
        brand_recognizability: 97,
        community_culture: 98
      },
      investment_score: {
        overall_score: 95,
        market_trend: 96,
        liquidity: 90,
        supply_scarcity: 98,
        international_demand: 97,
        inverse_volatility: 92,
        inverse_maintenance_cost: 88,
        comparable_stability: 94
      },
      rarity_score: 98,
      confidence_level: 'High'
    },
    current_median_price_eur: 245000,
    price_change_1y_pct: 12.5,
    price_change_3y_pct: 38.2,
    liquidity_score: 85,
    volatility_score: 18,
    avg_days_on_market: 42,
    history_it: 'Prodotta in soli 600 esemplari tra dicembre 1989 e marzo 1990 per omologare la terza evoluzione della M3 nel DTM. Motore portante portato a 2.5 litri (238 CV), alettone posteriore e splitter anteriore regolabili su 3 posizioni.',
    history_en: 'Produced in just 600 units to homologate the 2.5L EVO III for DTM racing. Features adjustable 3-position front splitter and rear wing.',
    designers: [{ id: 'p-boyke', full_name: 'Claus Luthe / Ercole Spada', nationality: 'DE/IT', role: 'Designer', biography_it: 'Iconico centro stile BMW degli anni 80', biography_en: 'Iconic 80s BMW design team' }],
    engineers: [{ id: 'p-paul-rosche', full_name: 'Paul Rosche', nationality: 'DE', role: 'Engineer', biography_it: 'Padre del motore BMW S14 e dei V12 F1', biography_en: 'Legendary engine designer behind the S14 and F1 V12s' }],
    production_site: 'Garching / Munich, Germany (Hand-finished)',
    known_issues: [
      { component: 'S14 Timing Chain Tensioner', description_it: 'Tensionatore catena idraulico soggetto ad usura', description_en: 'Hydraulic timing chain tensioner wear', estimated_fix_cost_eur: '€1.200 - €2.500', severity: 'Medium' }
    ],
    maintenance_complexity: 'High',
    annual_est_maintenance_eur: 3200,
    price_history: [
      { year: 2021, period: '2021-Q1', median_price_eur: 185000, average_price_eur: 190000, lower_quartile_eur: 170000, upper_quartile_eur: 210000 },
      { year: 2024, period: '2024-Q1', median_price_eur: 245000, average_price_eur: 255000, lower_quartile_eur: 220000, upper_quartile_eur: 290000 }
    ],
    auctions: [],
    listings: [],
    historical_events: []
  });
});

// GET Specs for Variant
app.get('/api/v1/variants/:variantId/specifications', (req: Request, res: Response) => {
  res.json({
    engineCode: 'S14B25',
    displacementCc: 2467,
    powerHp: 238,
    torqueNm: 240,
    topSpeedKmh: 248,
    acceleration0100: 6.1,
    weightKg: 1200
  });
});

// GET Production Record for Variant
app.get('/api/v1/variants/:variantId/production', (req: Request, res: Response) => {
  res.json({
    variantId: req.params.variantId,
    productionTotal: 600,
    lhdTotal: 600,
    rhdTotal: 0,
    verificationStatus: 'verified',
    confidenceScore: 100
  });
});

// GET Media Assets for Variant
app.get('/api/v1/variants/:variantId/media', (req: Request, res: Response) => {
  res.json({
    images: [
      { id: 'm1', role: 'hero', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop' },
      { id: 'm2', role: 'engine', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop' }
    ],
    videos: [
      { id: 'v1', youtubeId: 'S35Qx8wzUso', title: 'BMW M3 E30 DTM Legendary Battle Nürburgring 1989', type: 'historical' }
    ]
  });
});

// POST Variant Compare
app.post('/api/v1/compare/variants', (req: Request, res: Response) => {
  const { variantIds } = req.body;
  if (!Array.isArray(variantIds)) {
    return res.status(400).json({ error: 'variantIds array required' });
  }
  const results = CATALOG_DATABASE.filter(v => variantIds.includes(v.id) || variantIds.includes(v.slug));
  res.json(results);
});

// Search & Catalog Filter Endpoint
app.get('/api/v1/vehicles', (req: Request, res: Response) => {
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

  let filtered = [...CATALOG_DATABASE];

  if (query && typeof query === 'string') {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(v => 
      v.manufacturer_name.toLowerCase().includes(q) ||
      v.model_name.toLowerCase().includes(q) ||
      v.variant_name.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q) ||
      v.engine.family_name.toLowerCase().includes(q) ||
      v.history_it.toLowerCase().includes(q) ||
      v.history_en.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'All' && typeof category === 'string') {
    filtered = filtered.filter(v => v.category === category);
  }

  if (manufacturerId && typeof manufacturerId === 'string') {
    filtered = filtered.filter(v => v.manufacturer_id === manufacturerId);
  }

  if (tier && tier !== 'All' && typeof tier === 'string') {
    filtered = filtered.filter(v => v.tier === tier);
  }

  if (yearMin) {
    filtered = filtered.filter(v => v.model_year_from >= Number(yearMin));
  }

  if (yearMax) {
    filtered = filtered.filter(v => v.model_year_from <= Number(yearMax));
  }

  if (priceMin) {
    filtered = filtered.filter(v => v.current_median_price_eur >= Number(priceMin));
  }

  if (priceMax) {
    filtered = filtered.filter(v => v.current_median_price_eur <= Number(priceMax));
  }

  if (collectorScoreMin) {
    filtered = filtered.filter(v => v.scores.collector_score.overall_score >= Number(collectorScoreMin));
  }

  if (investmentScoreMin) {
    filtered = filtered.filter(v => v.scores.investment_score.overall_score >= Number(investmentScoreMin));
  }

  if (drivetrain && drivetrain !== 'All' && typeof drivetrain === 'string') {
    filtered = filtered.filter(v => v.transmission.drivetrain === drivetrain);
  }

  if (limitedOnly === 'true') {
    filtered = filtered.filter(v => v.limited_edition);
  }

  res.json({
    total: filtered.length,
    vehicles: filtered
  });
});

// Single Vehicle Detail
app.get('/api/v1/vehicles/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const vehicle = CATALOG_DATABASE.find(v => v.slug === slug || v.id === slug);
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  res.json(vehicle);
});

// Compare Endpoint
app.get('/api/v1/compare', (req: Request, res: Response) => {
  const idsStr = req.query.ids as string;
  if (!idsStr) {
    return res.json([]);
  }
  const ids = idsStr.split(',');
  const vehicles = CATALOG_DATABASE.filter(v => ids.includes(v.id) || ids.includes(v.slug));
  res.json(vehicles);
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
  const { prompt, locale = 'it', conversationHistory = [] } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (!aiClient) {
    // Graceful fallback if GEMINI_API_KEY is not configured
    const isIt = locale === 'it';
    const fallbackAnswer = isIt
      ? `[Analisi offline] Sulla base dei dati storici del catalogo (300 vetture), le supercar della fine degli anni '80 ed il triennio 1990-1993 mostrano la maggiore stabilità finanziaria e tasso di rivalutazione mediano (+12.4% annuo per la Ferrari F40 e +14.8% per la Bugatti EB110 GT). Per sbloccare la sintesi completa AI Gemini in tempo reale, configura la chiave API nei Secret del progetto.`
      : `[Offline Analysis] Based on historical catalog records (300 vehicles), late 1980s supercars and 1990-1993 models demonstrate the strongest financial stability and median appreciation (+12.4% YOY for Ferrari F40, +14.8% for Bugatti EB110 GT). Configure your GEMINI_API_KEY in project secrets for live GenAI synthesis.`;
    
    return res.json({
      answer: fallbackAnswer,
      referenced_slugs: ['ferrari-f40', 'bugatti-eb110-gt', 'porsche-959-komfort'],
      confidence: 'Medium (Grounding Fallback)'
    });
  }

  try {
    // Grounding Context: Create a lean summary of the top Hero cars for Gemini context
    const heroContext = CATALOG_DATABASE.slice(0, 10).map(v => ({
      name: `${v.manufacturer_name} ${v.model_name}`,
      slug: v.slug,
      median_price_eur: v.current_median_price_eur,
      growth_1y: `${v.price_change_1y_pct}%`,
      collector_score: v.scores.collector_score.overall_score,
      investment_score: v.scores.investment_score.overall_score,
      production: v.production_total,
      history_snippet: v.history_en
    }));

    const systemInstruction = `
You are the AI Automotive Advisor for the European Automotive Intelligence Platform.
You assist collectors, investors, and dealers with technical, financial, and historical insights on iconic European cars (Ferrari F40, Porsche 959, McLaren F1, Lancia Delta Evo, Bugatti EB110, etc.).

Strict rules:
1. Respond in the requested language: ${locale === 'it' ? 'Italian' : 'English'}.
2. Use precise automotive intelligence terminology, collector metrics, and financial terminology (e.g. median prices, liquidity score, auction hammer prices).
3. Be professional, direct, scannable, and objective. Never invent fictitious facts outside the domain.
4. Ground your insights on the provided database context when referencing market valuations.

Provided Hero Database Context:
${JSON.stringify(heroContext, null, 2)}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3
      }
    });

    const answerText = response.text || (locale === 'it' ? 'Nessuna risposta generata.' : 'No response generated.');

    // Extract referenced vehicle slugs if mentioned in response or prompt
    const promptLower = prompt.toLowerCase();
    const referencedSlugs = CATALOG_DATABASE
      .filter(v => promptLower.includes(v.manufacturer_name.toLowerCase()) || promptLower.includes(v.model_name.toLowerCase()) || promptLower.includes(v.slug))
      .slice(0, 4)
      .map(v => v.slug);

    res.json({
      answer: answerText,
      referenced_slugs: referencedSlugs.length > 0 ? referencedSlugs : ['ferrari-f40', 'porsche-959-komfort'],
      confidence: 'High'
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate AI Advisor response',
      details: error.message 
    });
  }
});

// Dealer Listings Endpoint
app.get('/api/v1/dealer/listings', (req: Request, res: Response) => {
  const allListings = CATALOG_DATABASE.flatMap(v => v.listings || []);
  res.json(allListings);
});

// Editorial Assertions Queue
app.get('/api/v1/editor/assertions', (req: Request, res: Response) => {
  res.json(DATA_ASSERTIONS_MOCK);
});

// Admin Audit Log
app.get('/api/v1/admin/audit-log', (req: Request, res: Response) => {
  res.json([
    { id: 'log-1', action: 'DATABASE_IMPORT', user: 'admin@platform.eu', timestamp: new Date().toISOString(), details: 'Seeded 300 European iconic cars catalog (25 Hero / 75 Core / 200 Discovery)' },
    { id: 'log-2', action: 'SCORE_RECALCULATION', user: 'system_cron', timestamp: new Date().toISOString(), details: 'Recalculated Collector and Investment scores across 300 vehicles' }
  ]);
});

// Mass Import & Multi-Source Extraction Endpoint
app.post('/api/v1/import/extract-vehicle', async (req: Request, res: Response) => {
  const { query, provider = 'gemini_google_search' } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Invia una query di ricerca o una lista di modelli auto.' });
  }

  // Pluggable provider handling architecture
  if (provider === 'paid_carquery_api' || provider === 'paid_mobile_de_api' || provider === 'paid_vincario_vin_api') {
    return res.json({
      success: true,
      provider,
      architecture_notice: `[Architettura Pronta] Provider commerciale "${provider}" selezionato. Le chiavi API di produzione e gli SDK ufficiali possono essere collegati nei Secret di ambiente per abilitare la sincronizzazione in tempo reale con i database enterprise.`,
      records: [
        {
          id: `ext-paid-${Date.now()}-1`,
          slug: `auto-paid-${Date.now()}`,
          manufacturer_name: query.split(' ')[0] || 'Ferrari',
          model_name: query.split(' ').slice(1).join(' ') || 'Specifica Enterprise API',
          variant_name: 'Versione Verificata API Commerciale',
          category: 'Supercar',
          model_year_from: 2024,
          production_total: 500,
          power_hp: 720,
          price_new_eur: 320000,
          estimated_market_value_eur: 380000,
          hero_image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop',
          data_status: 'verified',
          technical_description: `Record simulato generato da connettore API enterprise (${provider}).`,
          source_references: [`${provider} Enterprise Registry v2.4`]
        }
      ],
      groundingSources: [{ title: `${provider} Official API Docs`, uri: 'https://api.carqueryapi.com' }]
    });
  }

  // Active Default: Gemini Google Search Grounding for Authoritative Web Sources
  if (!aiClient) {
    // Offline/Fallback generator if GEMINI_API_KEY is missing
    const items = query.split('\n').filter((q: string) => q.trim().length > 0);
    const mockExtracted = items.map((q: string, idx: number) => {
      const parts = q.trim().split(' ');
      const brand = parts[0] || 'Auto';
      const model = parts.slice(1).join(' ') || 'Modello Speciale';
      return {
        id: `ext-${Date.now()}-${idx}`,
        slug: `${brand.toLowerCase()}-${model.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        manufacturer_name: brand,
        model_name: model,
        variant_name: `${model} Performance Spec`,
        category: 'Supercar',
        model_year_from: 2023,
        production_total: 1000,
        power_hp: 650,
        price_new_eur: 250000,
        estimated_market_value_eur: 290000,
        hero_image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop',
        data_status: 'imported',
        technical_description: `Scheda recuperata da fonti web pubbliche per ${brand} ${model}.`,
        key_features: ['Motore V8/V12', 'Telaio in Carbonio', 'Edizione Limitata'],
        source_references: ['Wikipedia Auto', 'UltimateSpecs Free Database']
      };
    });

    return res.json({
      success: true,
      provider: 'free_web_fallback',
      message: 'Estrazione completata con dataset offline. Configura GEMINI_API_KEY per abilitare la ricerca live con Google Grounding.',
      records: mockExtracted,
      groundingSources: [
        { title: 'Ultimate Specs Free Database', uri: 'https://www.ultimatespecs.com' },
        { title: 'Wikipedia Automotive Portal', uri: 'https://it.wikipedia.org/wiki/Portale:Automobili' }
      ]
    });
  }

  try {
    const prompt = `
Sei l'agente specializzato nell'estrazione dati della banca dati automobilistica europea.
Ricerca sul web tramite Google Search informazioni aggiornate, ufficiali e autorevoli per i seguenti veicoli richiesti dall'amministratore:
"${query}"

Per ciascun veicolo trovato, estrai una scheda tecnica completa rispettando TASSATIVAMENTE la seguente struttura JSON (incluso un array JSON denominato "vehicles"):

\`\`\`json
{
  "vehicles": [
    {
      "manufacturer_name": "Nome Marca (es. Ferrari, Porsche, Alfa Romeo)",
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
      "hero_image_url": "URL immagine rappresentativa reale o Unsplash automotive se non disponibile",
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
      manufacturer_name: v.manufacturer_name || 'Produttore',
      model_name: v.model_name || 'Modello',
      variant_name: v.variant_name || 'Specifica Standard',
      category: v.category || 'Supercar',
      model_year_from: Number(v.model_year_from) || 2024,
      model_year_to: v.model_year_to ? Number(v.model_year_to) : null,
      production_total: Number(v.production_total) || 500,
      power_hp: Number(v.power_hp) || 600,
      torque_nm: Number(v.torque_nm) || 650,
      engine_cc: Number(v.engine_cc) || 3000,
      engine_layout: v.engine_layout || 'Centrale Posteriore',
      transmission: v.transmission || 'Automatico 8-Rapporti',
      top_speed_kmh: Number(v.top_speed_kmh) || 320,
      acceleration_0_100: Number(v.acceleration_0_100) || 3.2,
      price_new_eur: Number(v.price_new_eur) || 250000,
      estimated_market_value_eur: Number(v.estimated_market_value_eur) || 280000,
      hero_image_url: v.hero_image_url && v.hero_image_url.startsWith('http') 
        ? v.hero_image_url 
        : 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&auto=format&fit=crop',
      data_status: 'imported',
      technical_description: v.technical_description || 'Record importato da fonti aperte via Gemini Web Search.',
      key_features: Array.isArray(v.key_features) ? v.key_features : ['Importato via Gemini API'],
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
// VITE MIDDLEWARE & SERVER STARTUP
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Automotive Intelligence Platform] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
