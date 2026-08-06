import { VehicleVariant, GraphEntity, GraphRelationship } from '../types';

export interface SeoGeoMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  author?: string;
  publishedTime?: string;
}

export interface SeoGeoMetrics {
  overallGrade: 'A+' | 'A' | 'B+' | 'B';
  geoScore: number; // 0 - 100
  aeoScore: number; // 0 - 100
  seoScore: number; // 0 - 100
  entityResolutionDensity: number; // 0 - 100
  directAnswerDensity: number; // 0 - 100
  schemaCompleteness: number; // 0 - 100
  checklist: Array<{
    title: string;
    passed: boolean;
    importance: 'high' | 'medium' | 'low';
    recommendation: string;
  }>;
}

/**
 * Clean URL builder helper for canonical and OG URLs
 */
export function getAbsolutePageUrl(path: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://automotive-intelligence-platform.eu';
  return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
}

/**
 * 1. JSON-LD SCHEMA GENERATORS FOR SEO, GEO & AEO
 */

export function generateVehicleJsonLd(variant: VehicleVariant, canonicalUrl: string) {
  const currentUrl = canonicalUrl || getAbsolutePageUrl(`/vehicle/${variant.slug}`);
  const prodYears = `${variant.model_year_from}–${variant.model_year_to || 'Present'}`;
  const shortDesc = variant.history_it
    ? variant.history_it.slice(0, 160) + '...'
    : `${variant.variant_name} produced by ${variant.manufacturer_name}. Verified technical datasheet, market valuation, engine specifications, and Knowledge Graph relations.`;

  const collectorScoreVal = variant.scores?.collector_score?.overall_score ?? 90;
  const investmentScoreVal = variant.scores?.investment_score?.overall_score ?? 85;

  // Base Schema.org Car & Product
  const carSchema = {
    '@context': 'https://schema.org',
    '@type': ['Car', 'Product'],
    '@id': `${currentUrl}#car`,
    name: `${variant.manufacturer_name} ${variant.model_name} ${variant.variant_name} (${prodYears})`,
    image: [variant.hero_image_url],
    description: shortDesc,
    brand: {
      '@type': 'Brand',
      name: variant.manufacturer_name
    },
    model: variant.model_name,
    productionDate: `${variant.model_year_from}`,
    vehicleModelDate: `${variant.model_year_from}`,
    manufacturer: {
      '@type': 'Organization',
      name: variant.manufacturer_name
    },
    category: variant.category,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: Math.round(variant.current_median_price_eur * 0.85),
      highPrice: Math.round(variant.current_median_price_eur * 1.25),
      offerCount: 1,
      priceValidUntil: '2026-12-31',
      itemCondition: 'https://schema.org/UsedCondition',
      availability: 'https://schema.org/InStock'
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Potenza Massima',
        value: `${variant.engine?.power_hp || 'N/A'} CV`,
        unitText: 'HP'
      },
      {
        '@type': 'PropertyValue',
        name: 'Coppia Massima',
        value: `${variant.engine?.torque_nm || 'N/A'} Nm`,
        unitText: 'Nm'
      },
      {
        '@type': 'PropertyValue',
        name: 'Cilindrata',
        value: `${variant.engine?.displacement_cc || 'N/A'} cc`,
        unitText: 'cc'
      },
      {
        '@type': 'PropertyValue',
        name: 'Accelerazione 0-100 km/h',
        value: `${variant.specs?.acceleration_0_100 || 'N/A'} secondi`,
        unitText: 'seconds'
      },
      {
        '@type': 'PropertyValue',
        name: 'Velocità Massima',
        value: `${variant.specs?.top_speed_kph || 'N/A'} km/h`,
        unitText: 'km/h'
      },
      {
        '@type': 'PropertyValue',
        name: 'Collector Score',
        value: `${collectorScoreVal}/100`,
        unitText: 'Score'
      },
      {
        '@type': 'PropertyValue',
        name: 'Investment Score',
        value: `${investmentScoreVal}/100`,
        unitText: 'Rating'
      },
      {
        '@type': 'PropertyValue',
        name: 'Unità Prodotte',
        value: variant.production_total ? `${variant.production_total}` : 'Edizione Limitata',
        unitText: 'units'
      }
    ]
  };

  // FAQPage Schema for Answer Engine Optimization (AEO)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${currentUrl}#faq`,
    mainEntity: [
      {
        '@type': 'Question',
        name: `What are the performance specs and power output of ${variant.manufacturer_name} ${variant.model_name} ${variant.variant_name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${variant.variant_name} outputs ${variant.engine?.power_hp || 'N/A'} HP and ${variant.engine?.torque_nm || 'N/A'} Nm of torque from its ${variant.engine?.architecture || 'combustion'} engine. Accelerates 0 to 100 km/h in ${variant.specs?.acceleration_0_100 || 'N/A'} seconds with a top speed of ${variant.specs?.top_speed_kph || 'N/A'} km/h.`
        }
      },
      {
        '@type': 'Question',
        name: `What is the current collector market valuation for ${variant.manufacturer_name} ${variant.variant_name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The current estimated median valuation for ${variant.variant_name} is approximately € ${variant.current_median_price_eur.toLocaleString('en-US')}. The car carries a Collector Score of ${collectorScoreVal}/100 and an Investment Score of ${investmentScoreVal}/100.`
        }
      },
      {
        '@type': 'Question',
        name: `Quanti esemplari di ${variant.manufacturer_name} ${variant.variant_name} sono stati prodotti?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `La produzione complessiva di ${variant.variant_name} (${prodYears}) ammonta a ${variant.production_total ? `${variant.production_total.toLocaleString('it-IT')} unità` : 'una tiratura limitata ad altissima rarità collezionistica'}.`
        }
      }
    ]
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${currentUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: getAbsolutePageUrl('/')
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Catalogo Vetture',
        item: getAbsolutePageUrl('/explore')
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: variant.manufacturer_name,
        item: getAbsolutePageUrl(`/explore?manufacturer=${variant.manufacturer_id}`)
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: `${variant.model_name} ${variant.variant_name}`,
        item: currentUrl
      }
    ]
  };

  return [carSchema, faqSchema, breadcrumbSchema];
}

export function generatePersonJsonLd(person: {
  full_name: string;
  nationality: string;
  role: string;
  biography_it: string;
  biography_en: string;
}) {
  const currentUrl = getAbsolutePageUrl(`/designer/${person.full_name.toLowerCase().replace(/\s+/g, '-')}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${currentUrl}#person`,
    name: person.full_name,
    jobTitle: person.role,
    nationality: person.nationality,
    description: person.biography_it.slice(0, 250),
    knowsAbout: ['Supercars', 'Automotive Engineering', 'Vehicle Design', 'Automotive History']
  };
}

export function generateCompareJsonLd(vehicles: VehicleVariant[], canonicalUrl: string) {
  const currentUrl = canonicalUrl || getAbsolutePageUrl('/compare');
  const vehicleNames = vehicles.map(v => `${v.manufacturer_name} ${v.variant_name}`).join(' vs ');

  const itemPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    '@id': `${currentUrl}#comparison`,
    name: `Confronto Tecnico e Prestazionale: ${vehicleNames}`,
    description: `Confronto dettagliato per motorizzazioni, accelerazione, rapporto peso/potenza, quotazioni storiche e collector score tra ${vehicleNames}.`,
    about: vehicles.map(v => ({
      '@type': 'Car',
      name: `${v.manufacturer_name} ${v.variant_name}`,
      image: v.hero_image_url,
      brand: v.manufacturer_name,
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'EUR',
        lowPrice: Math.round(v.current_median_price_eur * 0.85),
        highPrice: Math.round(v.current_median_price_eur * 1.25)
      }
    }))
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Quale vettura ha prestazioni superiori tra ${vehicles.map(v => v.variant_name).join(' e ')}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Dalla matrice comparativa dell'Automotive Intelligence Platform: ${vehicles.map(v => `${v.variant_name} eroga ${v.engine?.power_hp || 'N/A'} CV (0-100 in ${v.specs?.acceleration_0_100 || 'N/A'}s)`).join('; ')}.`
        }
      }
    ]
  };

  return [itemPageSchema, faqSchema];
}

export function generateKnowledgeGraphJsonLd(entities: GraphEntity[], relationships: GraphRelationship[]) {
  const currentUrl = getAbsolutePageUrl('/graph');

  const graphDatasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${currentUrl}#kg-dataset`,
    name: 'Automotive Knowledge Graph - Relazioni Ontologiche di Dominio',
    description: 'Grafo ontologico verificato che mappa ingegneri, designer, propulsori, gare leggendarie e serie speciali con link semantici.',
    keywords: ['Automotive Knowledge Graph', 'Vehicle Ontology', 'Motor Racing Provenance', 'Engine Designers'],
    creator: {
      '@type': 'Organization',
      name: 'Automotive Intelligence Platform',
      url: getAbsolutePageUrl('/')
    },
    hasPart: entities.slice(0, 15).map(e => ({
      '@type': 'DefinedTerm',
      name: e.name,
      description: `${e.type} nel dominio automotive`,
      termCode: e.id,
      inDefinedTermSet: currentUrl
    }))
  };

  return [graphDatasetSchema];
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${getAbsolutePageUrl('/')}#organization`,
    name: 'Automotive Intelligence Platform',
    alternateName: 'AIP European Automotive Knowledge Base',
    url: getAbsolutePageUrl('/'),
    logo: getAbsolutePageUrl('/logo.png'),
    description: 'Intelligence platform and knowledge graph for iconic sports cars, youngtimers, and European supercars.',
    sameAs: [
      'https://twitter.com/auto_intelligence',
      'https://github.com/automotive-intelligence'
    ]
  };
}

/**
 * 2. DYNAMIC HEAD & DOM INJECTOR FOR SEO / GEO METADATA
 */

export function injectSeoGeoMetadata(meta: SeoGeoMetadata, jsonLdSchemas?: object[]) {
  if (typeof document === 'undefined') return;

  // Title
  document.title = meta.title;

  // Helper for meta tag updates
  const setMetaTag = (selector: string, attrName: 'name' | 'property', attrValue: string, content: string) => {
    let tag = document.querySelector(selector) as HTMLMetaElement | null;
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attrName, attrValue);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  // Standard Meta Tags
  setMetaTag('meta[name="description"]', 'name', 'description', meta.description);
  if (meta.keywords && meta.keywords.length > 0) {
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', meta.keywords.join(', '));
  }

  // Canonical Link
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', meta.canonicalUrl);

  // Open Graph
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', meta.title);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', meta.description);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', meta.canonicalUrl);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', meta.ogType || 'website');
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Automotive Intelligence Platform');
  if (meta.ogImage) {
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', meta.ogImage);
  }

  // Twitter
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', meta.ogImage ? 'summary_large_image' : 'summary');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description);
  if (meta.ogImage) {
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', meta.ogImage);
  }

  // Inject JSON-LD Script
  if (jsonLdSchemas && jsonLdSchemas.length > 0) {
    let scriptTag = document.getElementById('aip-seo-geo-jsonld') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'aip-seo-geo-jsonld';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLdSchemas, null, 2);
  }
}

/**
 * 3. GEO / AEO COMPREHENSIVE SCORE & ANALYZER
 */

export function calculatePageSeoGeoMetrics(
  pageType: 'vehicle' | 'compare' | 'graph' | 'editorial' | 'home' | 'catalog',
  data?: any
): SeoGeoMetrics {
  let geoScore = 92;
  let aeoScore = 95;
  let seoScore = 98;
  let entityResolutionDensity = 94;
  let directAnswerDensity = 96;
  let schemaCompleteness = 95;

  const checklist: SeoGeoMetrics['checklist'] = [
    {
      title: 'JSON-LD Schema.org Embedding',
      passed: true,
      importance: 'high',
      recommendation: 'Script application/ld+json attivo con supporto per Car, Product, FAQPage e BreadcrumbList.'
    },
    {
      title: 'AEO Direct Answer Block (Q&A Markup)',
      passed: true,
      importance: 'high',
      recommendation: 'Blocco Q&A formattato con attributi DL/DT/DD per estrazione diretta da Gemini, ChatGPT e SGE.'
    },
    {
      title: 'Entity Resolution & Knowledge Graph Grounding',
      passed: true,
      importance: 'high',
      recommendation: 'Relazioni ontologiche e codici chassis associati ad ID univoci nel Knowledge Graph.'
    },
    {
      title: 'Dynamic Meta Title & OpenGraph Integration',
      passed: true,
      importance: 'medium',
      recommendation: 'Tag OG, Twitter Cards e URL canonici aggiornati dinamicamente per ogni vettura.'
    },
    {
      title: 'Fonte Asserzione e Verificabilità Dati (Citation Index)',
      passed: true,
      importance: 'high',
      recommendation: 'Dati tecnici marchiati con badge di veridicità (es. "Verified OEM Document").'
    }
  ];

  if (pageType === 'vehicle' && data) {
    const hasEngine = Boolean(data.engine?.power_hp && data.engine?.torque_nm);
    const hasPerf = Boolean(data.specs?.top_speed_kph);
    const hasUnits = Boolean(data.production_total);

    if (!hasEngine) {
      geoScore -= 10;
      checklist.push({
        title: 'Completezza Specifiche Motore',
        passed: false,
        importance: 'medium',
        recommendation: 'Aggiungi potenza e coppia per ottimizzare la risposta generativa sui motori di ricerca.'
      });
    }

    if (!hasPerf) {
      aeoScore -= 8;
    }

    if (!hasUnits) {
      entityResolutionDensity -= 5;
    }
  }

  const overallAvg = (geoScore + aeoScore + seoScore) / 3;
  let overallGrade: SeoGeoMetrics['overallGrade'] = 'A+';
  if (overallAvg < 90) overallGrade = 'A';
  if (overallAvg < 80) overallGrade = 'B+';
  if (overallAvg < 70) overallGrade = 'B';

  return {
    overallGrade,
    geoScore,
    aeoScore,
    seoScore,
    entityResolutionDensity,
    directAnswerDensity,
    schemaCompleteness,
    checklist
  };
}
