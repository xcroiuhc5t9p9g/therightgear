import React, { useState, useEffect } from 'react';
import { 
  Car, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  Heart, 
  Scale, 
  Bot, 
  Wrench, 
  Network, 
  DollarSign, 
  FileText, 
  Users, 
  Gauge, 
  History, 
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Layers,
  SlidersHorizontal,
  Play,
  Zap,
  Lock
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { VehicleVariant, VehicleFamilyNavigation, UserRole } from '../types';
import { fetchVehicleBySlug, askAiAdvisor, fetchModelNavigation } from '../services/api';
import { CATALOG_DATABASE } from '../data/catalogData';
import { Locale, translations } from '../data/translations';
import { VersionNavigator } from '../components/VersionNavigator';
import { VariantCompareModal } from '../components/VariantCompareModal';
import { getVehicleFamilyNavigation, BMW_M3_FAMILY_NAV } from '../data/vehicleHierarchyData';
import { generateVehicleJsonLd, injectSeoGeoMetadata, getAbsolutePageUrl } from '../services/seoGeoService';
import { AeoDirectAnswerCard } from '../components/AeoDirectAnswerCard';
import { AuthPromptReason } from '../components/AuthPromptModal';

interface VehicleDetailPageProps {
  slug: string;
  locale: Locale;
  activeRole?: UserRole;
  onNavigate: (page: string, slug?: string) => void;
  onToggleWatchlist: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onOpenAuthModal?: (reason: AuthPromptReason) => void;
  watchlistIds: string[];
  compareIds: string[];
}

export const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({
  slug,
  locale,
  activeRole = 'public',
  onNavigate,
  onToggleWatchlist,
  onToggleCompare,
  onOpenAuthModal,
  watchlistIds,
  compareIds
}) => {
  const t = translations[locale];
  const isIt = false;

  const [vehicle, setVehicle] = useState<VehicleVariant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  // Hierarchical Navigation state
  const [currentLevel, setCurrentLevel] = useState<'model' | 'generation' | 'variant'>('variant');
  const [activeGenId, setActiveGenId] = useState<string>('bmw-m3-e30');
  const [activeVarId, setActiveVarId] = useState<string>('bmw-m3-e30-sport-evolution');
  const [navData, setNavData] = useState<VehicleFamilyNavigation>(BMW_M3_FAMILY_NAV);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadVehicleAndHierarchy() {
      setLoading(true);
      const data = await fetchVehicleBySlug(slug);
      setVehicle(data);

      const modelKey = data ? data.model_name.toLowerCase() : 'bmw-m3';
      const hierarchyNav = await fetchModelNavigation(modelKey);
      setNavData(hierarchyNav);

      if (data) {
        setActiveImage(data.hero_image_url);
        if (data.generation_id) {
          setActiveGenId(data.generation_id);
        }
        setActiveVarId(data.id);

        // Inject SEO / GEO Schema.org and OpenGraph metadata dynamically
        const pageCanonicalUrl = getAbsolutePageUrl(`/vehicle/${data.slug}`);
        const schemas = generateVehicleJsonLd(data, pageCanonicalUrl);
        const prodYears = `${data.model_year_from}–${data.model_year_to || 'Pres.'}`;
        const shortDesc = data.history_it
          ? data.history_it.slice(0, 160) + '...'
          : `${data.variant_name} prodotta da ${data.manufacturer_name}. Scheda tecnica vericata, quotazione di mercato, specifiche motore e relazioni Knowledge Graph.`;

        injectSeoGeoMetadata({
          title: `${data.manufacturer_name} ${data.model_name} ${data.variant_name} (${prodYears}) - Specifiche & Quotazione | AIP`,
          description: shortDesc,
          canonicalUrl: pageCanonicalUrl,
          ogType: 'product',
          ogImage: data.hero_image_url,
          keywords: [data.manufacturer_name, data.model_name, data.variant_name, 'Scheda Tecnica', 'Quotazione', 'Collector Score', 'Knowledge Graph']
        }, schemas);
      }
      setLoading(false);
    }
    loadVehicleAndHierarchy();
  }, [slug]);

  const handleAskAiAboutCar = async () => {
    if (!vehicle) return;
    setAiLoading(true);
    const prompt = isIt 
      ? `Fornisci un'analisi finanziaria e collezionistica sintetica per la ${vehicle.manufacturer_name} ${vehicle.model_name} ${vehicle.variant_name}. Considera la rarità (${vehicle.production_total} unità) ed il valore di mercato mediano di €${vehicle.current_median_price_eur}.`
      : `Provide a concise financial and collector intelligence analysis for the ${vehicle.manufacturer_name} ${vehicle.model_name} ${vehicle.variant_name}. Consider rarity (${vehicle.production_total} units) and median price €${vehicle.current_median_price_eur}.`;
    
    const res = await askAiAdvisor(prompt, locale);
    setAiAnalysis(res.answer);
    setAiLoading(false);
  };

  const handleHierarchySelect = (level: 'model' | 'generation' | 'variant', genId?: string, varId?: string) => {
    setCurrentLevel('variant');
    
    let targetGenId = genId || activeGenId;
    let targetVarId = varId;

    if (level === 'model') {
      const firstGen = navData.generations[0];
      if (firstGen) {
        targetGenId = firstGen.id;
        if (firstGen.variants.length > 0) {
          targetVarId = firstGen.variants[0].id;
        }
      }
    } else if (level === 'generation' && targetGenId) {
      const matchingGen = navData.generations.find(g => g.id === targetGenId);
      if (matchingGen && matchingGen.variants.length > 0 && !targetVarId) {
        targetVarId = matchingGen.variants[0].id;
      }
    }

    if (targetGenId) setActiveGenId(targetGenId);
    if (targetVarId) {
      setActiveVarId(targetVarId);
      const matchingVehicle = CATALOG_DATABASE.find(v => v.id === targetVarId || v.slug === targetVarId);
      if (matchingVehicle) {
        setVehicle(matchingVehicle);
        setActiveImage(matchingVehicle.hero_image_url);
      }
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400">Caricamento scheda tecnica vettura...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Vettura non trovata nel database</h2>
        <button
          onClick={() => onNavigate('explore')}
          className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-xl cursor-pointer"
        >
          Torna all'indice
        </button>
      </div>
    );
  }

  const isWatchlist = watchlistIds.includes(vehicle.id);

  // Active generation item from navigation tree
  const activeGenItem = navData.generations.find(g => g.id === activeGenId) || navData.generations[0];

  const chartData = vehicle.price_history.map(p => ({
    period: p.period || String(p.year),
    median: Math.round(p.median_price_eur / 1000),
    avg: Math.round(p.average_price_eur / 1000)
  }));

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. UNIFIED BREADCRUMB NAVIGATOR: Casa Costruttrice > Modello > Generazioni > Varianti */}
      <VersionNavigator
        navigationData={navData}
        activeGenerationId={activeGenId}
        activeVariantId={activeVarId}
        currentLevel={currentLevel}
        locale={locale}
        onSelectLevel={handleHierarchySelect}
        onCompareTrigger={() => setIsCompareModalOpen(true)}
      />

      {/* UNIFIED SINGLE-PAGE VEHICLE RECORD */}
      <div className="space-y-8 animate-in fade-in duration-200">
        
        {/* Variant Header Section */}
        <div className="bg-[#121520] p-6 rounded-3xl border border-[#23293a] space-y-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#202738] pb-6">
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs">
                <span className="bg-red-500/15 text-red-400 px-2.5 py-0.5 rounded-full font-bold border border-red-500/30">
                  {vehicle.manufacturer_name}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-300 font-bold">{vehicle.model_name}</span>
                <span className="text-slate-500">·</span>
                <span className="text-red-300 font-mono font-extrabold bg-[#1a2130] px-2 py-0.5 rounded border border-[#2b354d]">
                  Gen {activeGenItem?.code || 'E30'}
                </span>
                {vehicle.limited_edition && (
                  <span className="bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30">
                    Serie Limitata
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {vehicle.variant_name}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span>Production years: <strong className="text-slate-200">{vehicle.model_year_from}–{vehicle.model_year_to || 'Pres.'}</strong></span>
                <span>•</span>
                <span>Total production: <strong className="text-slate-200">{vehicle.production_total.toLocaleString()} units</strong></span>
                <span>•</span>
                <span>Market code: <strong className="text-slate-200">{vehicle.market_code}</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  if (activeRole === 'public') {
                    if (onOpenAuthModal) onOpenAuthModal('compare');
                    else onNavigate('register');
                  } else {
                    setIsCompareModalOpen(true);
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                <span>Compare Variant</span>
              </button>

              <button
                onClick={() => {
                  if (activeRole === 'public') {
                    if (onOpenAuthModal) onOpenAuthModal('watchlist');
                    else onNavigate('register');
                  } else {
                    onToggleWatchlist(vehicle.id);
                  }
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 border cursor-pointer ${
                  isWatchlist
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-[#181d2a] text-slate-200 border-[#2a344a] hover:bg-[#222a3d]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWatchlist ? 'fill-current' : 'text-rose-400'}`} />
                <span>{isWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>
            </div>

          </div>

          {/* 1) FOTO PRINCIPALE & GALLERY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-3">
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#23293a] bg-black shadow-lg">
                <img 
                  src={activeImage || vehicle.hero_image_url} 
                  alt={vehicle.variant_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-200 font-medium">
                  📷 <strong>Foto Principale Vettura:</strong> {vehicle.manufacturer_name} {vehicle.variant_name}
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {vehicle.gallery_images && vehicle.gallery_images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                  <button
                    onClick={() => setActiveImage(vehicle.hero_image_url)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border shrink-0 transition-all cursor-pointer ${
                      activeImage === vehicle.hero_image_url ? 'border-red-400 ring-2 ring-red-500/30' : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={vehicle.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
                  </button>
                  {vehicle.gallery_images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden border shrink-0 transition-all cursor-pointer ${
                        activeImage === img ? 'border-red-400 ring-2 ring-red-500/30' : 'border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Collector & Investment Scores */}
            <div className="space-y-4 flex flex-col justify-between">
              
              <div className="bg-[#161b29] border border-[#232d42] rounded-2xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-[#20283a] pb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-red-400" />
                    <span>Collector Score</span>
                  </span>
                  <span className="text-2xl font-black text-red-400 font-mono">
                    {vehicle.scores.collector_score.overall_score}/100
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Rarity:</span>
                    <span className="font-mono font-bold text-red-300">{vehicle.scores.collector_score.rarity_weight}/100</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Historical Relevance:</span>
                    <span className="font-mono font-bold text-red-300">{vehicle.scores.collector_score.historical_relevance}/100</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Desirability:</span>
                    <span className="font-mono font-bold text-red-300">{vehicle.scores.collector_score.desirability}/100</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#161b29] border border-[#232d42] rounded-2xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between border-b border-[#20283a] pb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>Investment Score</span>
                  </span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {vehicle.scores.investment_score.overall_score}/100
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Current Median Value:</span>
                    <span className="font-mono font-bold text-emerald-400">€{vehicle.current_median_price_eur.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>1-Year Trend:</span>
                    <span className="font-mono font-bold text-emerald-400">+{vehicle.price_change_1y_pct}%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Market Liquidity:</span>
                    <span className="font-mono font-bold text-red-300">{vehicle.liquidity_score}/100</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Generative Engine Optimization Card (Visibile solo per Utenti Amministratori ed Editor per indicizzazione/SEO/AEO) */}
        {(activeRole === 'admin' || activeRole === 'editor') && (
          <AeoDirectAnswerCard
            variant={vehicle}
            canonicalUrl={getAbsolutePageUrl(`/vehicle/${vehicle.slug}`)}
          />
        )}

        {/* 2) DATI TECNICI VETTURA */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-white flex items-center gap-2 border-b border-[#23293a] pb-3">
            <Wrench className="w-5 h-5 text-red-400" />
            <span>Technical Datasheet</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* SUB-SECTION 1: Engine & Powertrain */}
            <div className="bg-[#121622] border border-[#22293a] rounded-2xl p-5 space-y-4 shadow-xl">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#202738] pb-3">
                <Gauge className="w-4 h-4 text-red-400" />
                <span>Engine & Powertrain</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#1c2233]">
                  <span className="text-slate-400">Engine Code:</span>
                  <span className="font-mono font-bold text-red-300">{vehicle.engine.engine_code}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1c2233]">
                  <span className="text-slate-400">Engine Family:</span>
                  <span className="font-bold text-slate-200">{vehicle.engine.family_name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1c2233]">
                  <span className="text-slate-400">Displacement:</span>
                  <span className="font-mono font-bold text-slate-200">{vehicle.engine.displacement_cc} cc</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1c2233]">
                  <span className="text-slate-400">Max Power:</span>
                  <span className="font-mono font-extrabold text-red-400">{vehicle.engine.power_hp} HP ({vehicle.engine.power_kw} kW)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1c2233]">
                  <span className="text-slate-400">Max Torque:</span>
                  <span className="font-mono font-bold text-slate-200">{vehicle.engine.torque_nm} Nm</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Aspiration:</span>
                  <span className="font-bold text-slate-200">{vehicle.engine.aspiration}</span>
                </div>
              </div>
            </div>

            {/* SUB-SECTION 2: Transmission & Chassis */}
            <div className="bg-[#121622] border border-[#22293a] rounded-2xl p-5 space-y-4 shadow-xl">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#202738] pb-3">
                <Wrench className="w-4 h-4 text-red-400" />
                <span>Transmission & Chassis</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#1c2233]">
                  <span className="text-slate-400">Transmission:</span>
                  <span className="font-bold text-slate-200">{vehicle.transmission.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1c2233]">
                  <span className="text-slate-400">Type & Gears:</span>
                  <span className="font-mono font-bold text-slate-200">{vehicle.transmission.gears} Gears {vehicle.transmission.type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1c2233]">
                  <span className="text-slate-400">Drivetrain:</span>
                  <span className="font-bold text-red-300">{vehicle.transmission.drivetrain}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1c2233]">
                  <span className="text-slate-400">Differential:</span>
                  <span className="font-bold text-slate-200">{vehicle.transmission.differential_type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1c2233]">
                  <span className="text-slate-400">Kerb Weight:</span>
                  <span className="font-mono font-bold text-slate-200">{vehicle.specs.kerb_weight_kg} kg</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Power-to-Weight Ratio:</span>
                  <span className="font-mono font-bold text-red-400">{vehicle.specs.power_to_weight_hp_ton} HP/ton</span>
                </div>
              </div>
            </div>

            {/* SUB-SECTION 3: Performance & Production */}
            <div className="bg-[#121622] border border-[#22293a] rounded-2xl p-5 space-y-4 shadow-xl">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 border-b border-[#202738] pb-3">
                <Zap className="w-4 h-4 text-red-400" />
                <span>Performance & Production</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#1c2233]">
                  <span className="text-slate-400">0–100 km/h:</span>
                  <span className="font-mono font-extrabold text-red-300">{vehicle.specs.acceleration_0_100}s</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1c2233]">
                  <span className="text-slate-400">Top Speed:</span>
                  <span className="font-mono font-bold text-slate-200">{vehicle.specs.top_speed_kph} km/h</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1c2233]">
                  <span className="text-slate-400">Total Production:</span>
                  <span className="font-mono font-bold text-slate-200">{vehicle.production_total.toLocaleString()} units</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1c2233]">
                  <span className="text-slate-400">Numbered Series:</span>
                  <span className="font-bold text-emerald-400">{vehicle.numbered_series ? 'Yes (#1 to #600)' : 'No'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#1c2233]">
                  <span className="text-slate-400">Production Plant:</span>
                  <span className="font-bold text-slate-200">{vehicle.production_site}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Maintenance Complexity:</span>
                  <span className="font-bold text-red-400">{vehicle.maintenance_complexity}</span>
                </div>
              </div>
            </div>

          </div>

          {/* SUB-SECTION 4: History & Technical Notes */}
          <div className="bg-[#121622] border border-[#22293a] rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-red-400" />
              <span>History & Technical Notes</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {vehicle.history_en || vehicle.history_it}
            </p>

            {vehicle.known_issues && vehicle.known_issues.length > 0 && (
              <div className="pt-3 border-t border-[#202738]">
                <div className="text-xs font-bold text-red-400 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Critical Items & Preventive Maintenance:</span>
                </div>
                <div className="space-y-1.5">
                  {vehicle.known_issues.map((issue, idx) => (
                    <div key={idx} className="bg-[#181f30] p-3 rounded-xl border border-[#29344c] text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-200">{issue.component}</div>
                        <div className="text-[11px] text-slate-400">{issue.description_en || issue.description_it}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-red-300 font-bold">{issue.estimated_fix_cost_eur}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Severity: {issue.severity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SUB-SECTION 5: Market Valuation */}
          <div className="bg-[#121622] border border-[#22293a] rounded-3xl p-6 space-y-4 shadow-xl relative overflow-hidden">
            
            {/* Blur Overlay for Unregistered User / Guest */}
            {activeRole === 'public' && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-full shadow-inner">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-white">Protected Market Valuations</h4>
                <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                  The median value, auction history, and appreciation trends of <strong>{vehicle.manufacturer_name} {vehicle.variant_name}</strong> are reserved for registered members.
                </p>
                <button
                  onClick={() => {
                    if (onOpenAuthModal) onOpenAuthModal('valuation');
                    else onNavigate('register');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/20 cursor-pointer transition-all"
                >
                  Sign Up Free to Unlock
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202738] pb-4">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>Market Valuation — Current Valuation & Trends</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Specific market valuation for <strong>{vehicle.manufacturer_name} {vehicle.variant_name}</strong> based on verified auctions and market listings.
                </p>
              </div>

              <div className="text-left sm:text-right bg-[#182030] p-3 rounded-2xl border border-[#2b364e]">
                <div className="text-xs text-slate-400 font-medium">Current Median Value:</div>
                <div className="text-xl font-black text-emerald-400 font-mono">
                  €{vehicle.current_median_price_eur.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  1-Year Trend: <span className="text-emerald-400 font-bold">+{vehicle.price_change_1y_pct}%</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222a3d" />
                  <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} unit="k€" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#141824', borderColor: '#2b354d', borderRadius: '12px', fontSize: '12px' }}
                    labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="median" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} name="Median (€k)" />
                  <Line type="monotone" dataKey="avg" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Average (€k)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

      {/* VARIANT COMPARISON MODAL */}
      <VariantCompareModal
        navigationData={navData}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        locale={locale}
        initialVariantId={activeVarId}
      />

    </div>
  );
};
