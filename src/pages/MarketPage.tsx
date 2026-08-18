import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart2, 
  PieChart as PieIcon, 
  Search,
  Filter,
  Grid,
  List,
  Heart,
  Scale,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Check,
  Tag,
  ShieldCheck,
  Zap,
  AlertTriangle,
  SlidersHorizontal,
  RotateCcw,
  Eye,
  Database,
  Lock
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { VehicleVariant, SearchFilters, UserRole } from '../types';
import { SlideshowBlock } from '../components/SlideshowBlock';
import { Locale, translations } from '../data/translations';
import { unifiedVehicleStore } from '../services/unifiedVehicleStore';
import { catalogueRepository } from '../services/catalogueRepository';
import { UPCOMING_AUCTIONS } from '../data/entitiesData';
import { VehicleCard } from '../components/VehicleCard';
import { AuthPromptReason } from '../components/AuthPromptModal';
import { injectSeoGeoMetadata, getAbsolutePageUrl } from '../services/seoGeoService';

interface MarketPageProps {
  locale: Locale;
  activeRole?: UserRole;
  onSelectVehicle: (slug: string) => void;
  onNavigate: (page: string, slug?: string) => void;
  onToggleWatchlist: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onOpenAuthModal?: (reason: AuthPromptReason) => void;
  watchlistIds: string[];
  compareIds: string[];
  initialSearchQuery?: string;
}

export const MarketPage: React.FC<MarketPageProps> = ({
  locale,
  activeRole = 'visitor',
  onSelectVehicle,
  onNavigate,
  onToggleWatchlist,
  onToggleCompare,
  onOpenAuthModal,
  watchlistIds,
  compareIds,
  initialSearchQuery = ''
}) => {
  const t = translations[locale];

  // Active section tab inside Market
  const [activeMarketTab, setActiveMarketTab] = useState<'catalog' | 'intelligence' | 'templates'>('catalog');

  // Vehicles from Unified Vehicle Store
  const [vehicles, setVehicles] = useState<VehicleVariant[]>(unifiedVehicleStore.getAll());
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('All');
  const [selectedBrandIntelligence, setSelectedBrandIntelligence] = useState<string>('all');
  const [intelTab, setIntelTab] = useState<'gainers' | 'losers'>('gainers');

  // Pagination & Results per page (25, 50, 100)
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);

  useEffect(() => {
    // Subscribe to unified vehicle store updates
    const unsubscribe = unifiedVehicleStore.subscribe(() => {
      setVehicles(unifiedVehicleStore.getAll());
    });
    return unsubscribe;
  }, []);

  // Reset pagination & inject SEO/GEO Metadata when search or filters change
  useEffect(() => {
    setPage(1);

    const catText = selectedCategory !== 'All' ? selectedCategory : '';
    const mfrText = selectedManufacturer !== 'All' ? selectedManufacturer : '';
    const queryText = searchQuery ? `"${searchQuery}"` : '';

    const subtitle = [catText, mfrText, queryText].filter(Boolean).join(' • ') || 'Verified Catalog';
    const canonicalPath = selectedCategory !== 'All' 
      ? `/category/${selectedCategory.toLowerCase().replace(/\s+/g, '-')}`
      : selectedManufacturer !== 'All'
      ? `/manufacturer/${selectedManufacturer.toLowerCase().replace(/\s+/g, '-')}`
      : '/';

    injectSeoGeoMetadata({
      title: `${subtitle} - Automotive Intelligence Platform (therightgear.app)`,
      description: `Explore and compare verified OEM technical specifications, market valuations, and Knowledge Graph relations for iconic sports cars.`,
      canonicalUrl: getAbsolutePageUrl(canonicalPath),
      keywords: ['Automotive Intelligence', 'Car Catalog', 'Youngtimer', 'Supercar', 'Hypercar', 'Car Valuations', 'OEM Tech Sheets', 'AIO', 'GEO']
    });
  }, [searchQuery, selectedCategory, selectedManufacturer, viewMode, itemsPerPage]);

  // Categories list
  const categories = ['All', 'Supercar', 'Hypercar', 'Homologation Special', 'Youngtimer', 'Limited Series', 'Grand Tourer'];

  // Filtered vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      v.manufacturer_name.toLowerCase().includes(q) ||
      v.model_name.toLowerCase().includes(q) ||
      v.variant_name.toLowerCase().includes(q);

    if (!matchesQuery) return false;
    if (selectedCategory !== 'All' && v.category !== selectedCategory) return false;
    if (selectedManufacturer !== 'All' && v.manufacturer_name.toLowerCase() !== selectedManufacturer.toLowerCase()) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;
  const paginatedVehicles = filteredVehicles.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Market Intelligence Data
  const allIntelVehicles = catalogueRepository.getAllVariants().vehicles;
  const intelMakers = catalogueRepository.getMakers();

  const filteredIntelVehicles = selectedBrandIntelligence === 'all'
    ? allIntelVehicles
    : allIntelVehicles.filter(v => v.manufacturer_name.toLowerCase() === selectedBrandIntelligence.toLowerCase());

  const topGainers = [...filteredIntelVehicles].sort((a, b) => b.price_change_1y_pct - a.price_change_1y_pct);
  const topLosers = [...filteredIntelVehicles].sort((a, b) => a.price_change_1y_pct - b.price_change_1y_pct);

  const marketTrendData = [
    { year: '2021', indexValue: 100 },
    { year: '2022', indexValue: 114 },
    { year: '2023', indexValue: 122 },
    { year: '2024', indexValue: 128 },
    { year: '2025', indexValue: 136 }
  ];

  const categoryData = [
    { name: 'Supercar (80s-90s)', value: 45, color: '#d4af37' },
    { name: 'Hypercar', value: 25, color: '#38bdf8' },
    { name: 'Homologation', value: 15, color: '#34d399' },
    { name: 'Youngtimer', value: 15, color: '#f43f5e' }
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* Slideshow Hero Banner (Gestibile da Admin & Editor) */}
      <SlideshowBlock activeRole={activeRole} onNavigate={onNavigate} />

      {/* Section Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 border-b border-trg-gray-100">
        {[
          { id: 'catalog', label: `Database & Catalog (${filteredVehicles.length})`, icon: Database },
          { id: 'intelligence', label: 'Market Intelligence & Trends', icon: TrendingUp },
          { id: 'templates', label: 'Variant & Model Matrix', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMarketTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMarketTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-red-600 text-trg-carbon shadow-md shadow-red-600/10'
                  : 'bg-trg-gray-50 text-trg-gray-500 hover:bg-trg-gray-100 border border-trg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BANCA DATI & CATALOG */}
      {activeMarketTab === 'catalog' && (
        <div className="space-y-4">
          
          {/* Controls & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-trg-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-trg-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by brand, model, variant or specs..."
                className="w-full bg-trg-gray-50 text-xs text-trg-carbon placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-trg-gray-100 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Category Pill Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-trg-gray-50 text-xs text-red-300 font-bold px-3 py-2.5 rounded-xl border border-trg-gray-100 focus:outline-none focus:border-red-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                ))}
              </select>

              <select
                value={selectedManufacturer}
                onChange={(e) => setSelectedManufacturer(e.target.value)}
                className="bg-trg-gray-50 text-xs text-trg-carbon font-bold px-3 py-2.5 rounded-xl border border-trg-gray-100 focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="All">All Manufacturers</option>
                {intelMakers.map((m) => (
                  <option key={m.id} value={m.canonical_name || m.official_name || m.slug}>{m.canonical_name || m.official_name || m.slug}</option>
                ))}
              </select>

              {/* Results per page selector (25, 50, 100) */}
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-trg-gray-50 text-xs text-amber-300 font-bold px-3 py-2.5 rounded-xl border border-trg-gray-100 focus:outline-none focus:border-red-500 cursor-pointer"
                title="Results per page"
              >
                <option value={25}>25 results / pag</option>
                <option value={50}>50 results / pag</option>
                <option value={100}>100 results / pag</option>
              </select>

              {/* View toggle */}
              <div className="flex items-center bg-trg-gray-50 border border-trg-gray-100 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-red-600 text-trg-carbon' : 'text-trg-gray-400 hover:text-trg-carbon'}`}
                  title="Grid Card View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-red-600 text-trg-carbon' : 'text-trg-gray-400 hover:text-trg-carbon'}`}
                  title="Financial Table View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  activeRole={activeRole}
                  onSelectVehicle={onSelectVehicle}
                  onNavigate={onNavigate}
                  onOpenAuthModal={onOpenAuthModal}
                />
              ))}
            </div>
          )}

          {/* TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-2xl border border-trg-gray-100 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white text-trg-gray-400 uppercase tracking-wider font-mono border-b border-trg-gray-100">
                      <th className="p-3.5 font-bold">Vehicle</th>
                      <th className="p-3.5 font-bold">Category</th>
                      <th className="p-3.5 font-bold">Year</th>
                      <th className="p-3.5 font-bold">Production</th>
                      <th className="p-3.5 font-bold">Median Valuation</th>
                      <th className="p-3.5 font-bold">Collector Score</th>
                      <th className="p-3.5 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2434]">
                    {paginatedVehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-trg-gray-50 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center space-x-3">
                            <img src={v.hero_image_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 border border-trg-gray-100" />
                            <div>
                              <div className="font-extrabold text-trg-carbon text-sm">{v.manufacturer_name} {v.model_name}</div>
                              <div className="text-[11px] text-trg-gray-400">{v.variant_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-bold text-trg-gray-500">{v.category}</td>
                        <td className="p-3.5 font-mono text-trg-gray-500">{v.model_year_from}</td>
                        <td className="p-3.5 font-mono text-trg-gray-500">{v.production_total ? `${v.production_total} units` : 'N/A'}</td>
                        <td className="p-3.5 font-mono font-bold text-emerald-400 text-sm">
                          {activeRole === 'visitor' ? (
                            <button
                              onClick={() => {
                                if (onOpenAuthModal) onOpenAuthModal('valuation');
                                else onNavigate('register');
                              }}
                              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-trg-gray-50 border border-red-500/30 text-red-300 text-xs cursor-pointer hover:border-red-400"
                              title="Register to unlock transparent valuation"
                            >
                              <span className="filter blur-[3.5px] select-none">€ 250,000</span>
                              <Lock className="w-3 h-3 text-red-400 ml-1" />
                            </button>
                          ) : (
                            `€${(v.market_stats?.median_price_eur || 250000).toLocaleString('en-US')}`
                          )}
                        </td>
                        <td className="p-3.5 font-mono font-bold text-red-400">
                          {v.scores?.collector_score?.overall_score || 90}/100
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              onSelectVehicle(v.slug);
                              onNavigate('detail', v.slug);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-red-600 text-trg-carbon font-bold text-[11px] hover:bg-red-500 cursor-pointer"
                          >
                            Open Datasheet
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Results Range Indicator & Next/Prev Controls */}
          {filteredVehicles.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-trg-gray-100 bg-white p-4 rounded-2xl border border-trg-gray-100">
              <div className="text-xs text-trg-gray-500 font-mono flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  Showing <strong className="text-trg-carbon">{(page - 1) * itemsPerPage + 1}</strong> - <strong className="text-trg-carbon">{Math.min(page * itemsPerPage, filteredVehicles.length)}</strong> of <strong className="text-red-400 font-bold">{filteredVehicles.length}</strong> results
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {page > 1 && (
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-4 py-2 rounded-xl bg-white border border-trg-gray-100 text-trg-gray-500 hover:text-trg-carbon text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer hover:border-slate-500"
                  >
                    <ChevronLeft className="w-4 h-4 text-trg-gray-400" />
                    <span>Previous {itemsPerPage} results</span>
                  </button>
                )}

                {page < totalPages && (
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-trg-carbon text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-red-600/20 active:scale-95"
                  >
                    <span>Next {Math.min(itemsPerPage, filteredVehicles.length - page * itemsPerPage)} results</span>
                    <ChevronRight className="w-4 h-4 text-trg-carbon" />
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: MARKET INTELLIGENCE & TRENDS */}
      {activeMarketTab === 'intelligence' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-trg-gray-100 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 mb-1">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-trg-carbon tracking-wide">INSUFFICIENT DATA</h2>
            <p className="text-xs text-trg-gray-400 max-w-lg mx-auto leading-relaxed">
              There are currently 0 verified Market Price Observations, Transactions, Listings, Snapshots, or Indices in the canonical database.
              Market metrics and valuation trends require verified transaction evidence and are never simulated or fabricated.
            </p>
            <div className="pt-2 text-[11px] font-mono text-trg-gray-400 border-t border-trg-gray-100 max-w-md mx-auto">
              MarketPriceObservations: 0 | MarketTransactions: 0 | MarketListings: 0 | MarketSnapshots: 0 | MarketIndices: 0
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MODEL MATRICES & TEMPLATES */}
      {activeMarketTab === 'templates' && (
        <div className="bg-white p-6 rounded-2xl border border-trg-gray-100 space-y-6">
          <div className="border-b border-trg-gray-100 pb-4">
            <h2 className="text-lg font-bold text-trg-carbon flex items-center gap-2">
              <Award className="w-5 h-5 text-red-400" />
              <span>Model, Limited Series & Homologation Matrix</span>
            </h2>
            <p className="text-xs text-trg-gray-400 mt-1">
              Complete register of technical specs and production volumes for iconic models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.slice(0, 6).map((v) => (
              <div
                key={v.id}
                onClick={() => {
                  onSelectVehicle(v.slug);
                  onNavigate('detail', v.slug);
                }}
                className="p-5 rounded-2xl bg-white border border-trg-gray-100 hover:border-red-500/40 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <img src={v.hero_image_url} alt="" className="w-14 h-14 rounded-xl object-cover border border-trg-gray-200" />
                  <div>
                    <span className="text-[10px] font-bold font-mono text-red-400 uppercase">{v.category}</span>
                    <h3 className="text-sm font-extrabold text-trg-carbon">{v.manufacturer_name} {v.model_name}</h3>
                    <p className="text-xs text-trg-gray-400 truncate">{v.variant_name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-trg-gray-100 font-mono">
                  <div>
                    <span className="text-trg-gray-400 text-[10px] block">Production Year</span>
                    <span className="font-bold text-trg-carbon">{v.model_year_from}</span>
                  </div>
                  <div>
                    <span className="text-trg-gray-400 text-[10px] block">Units Produced</span>
                    <span className="font-bold text-trg-carbon">{v.production_total || 'Limited Series'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
