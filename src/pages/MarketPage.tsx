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
import { HERO_VEHICLES, MANUFACTURERS } from '../data/catalogData';
import { UPCOMING_AUCTIONS } from '../data/entitiesData';
import { VehicleCard } from '../components/VehicleCard';
import { AuthPromptReason } from '../components/AuthPromptModal';

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
  activeRole = 'public',
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

  // Reset pagination when search or filters change
  useEffect(() => {
    setPage(1);
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
  const filteredIntelVehicles = selectedBrandIntelligence === 'all'
    ? HERO_VEHICLES
    : HERO_VEHICLES.filter(v => v.manufacturer_name.toLowerCase() === selectedBrandIntelligence.toLowerCase());

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
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 border-b border-[#202738]">
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
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/10'
                  : 'bg-[#171b28] text-slate-300 hover:bg-[#202638] border border-[#262f44]'
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
          <div className="bg-[#121520] p-4 rounded-2xl border border-[#23293a] flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by brand, model, variant or specs..."
                className="w-full bg-[#171b28] text-xs text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Category Pill Filters */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-[#171b28] text-xs text-red-300 font-bold px-3 py-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
                ))}
              </select>

              <select
                value={selectedManufacturer}
                onChange={(e) => setSelectedManufacturer(e.target.value)}
                className="bg-[#171b28] text-xs text-slate-200 font-bold px-3 py-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="All">All Manufacturers</option>
                {MANUFACTURERS.map((m) => (
                  <option key={m.id} value={m.official_name}>{m.official_name}</option>
                ))}
              </select>

              {/* Results per page selector (25, 50, 100) */}
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-[#171b28] text-xs text-amber-300 font-bold px-3 py-2.5 rounded-xl border border-[#262f44] focus:outline-none focus:border-red-500 cursor-pointer"
                title="Results per page / Risultati per pagina"
              >
                <option value={25}>25 results / pag</option>
                <option value={50}>50 results / pag</option>
                <option value={100}>100 results / pag</option>
              </select>

              {/* View toggle */}
              <div className="flex items-center bg-[#171b28] border border-[#262f44] rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Grid Card View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
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
            <div className="bg-[#121520] rounded-2xl border border-[#23293a] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#161a26] text-slate-400 uppercase tracking-wider font-mono border-b border-[#232a3d]">
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
                      <tr key={v.id} className="hover:bg-[#171c2b] transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center space-x-3">
                            <img src={v.hero_image_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#232a3d]" />
                            <div>
                              <div className="font-extrabold text-white text-sm">{v.manufacturer_name} {v.model_name}</div>
                              <div className="text-[11px] text-slate-400">{v.variant_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-bold text-slate-300">{v.category}</td>
                        <td className="p-3.5 font-mono text-slate-300">{v.model_year_from}</td>
                        <td className="p-3.5 font-mono text-slate-300">{v.production_total ? `${v.production_total} units` : 'N/A'}</td>
                        <td className="p-3.5 font-mono font-bold text-emerald-400 text-sm">
                          {activeRole === 'public' ? (
                            <button
                              onClick={() => {
                                if (onOpenAuthModal) onOpenAuthModal('valuation');
                                else onNavigate('register');
                              }}
                              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-900 border border-red-500/30 text-red-300 text-xs cursor-pointer hover:border-red-400"
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
                            className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-[11px] hover:bg-red-500 cursor-pointer"
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1f2638] bg-[#121520] p-4 rounded-2xl border border-[#23293a]">
              <div className="text-xs text-slate-300 font-mono flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  Showing <strong className="text-white">{(page - 1) * itemsPerPage + 1}</strong> - <strong className="text-white">{Math.min(page * itemsPerPage, filteredVehicles.length)}</strong> of <strong className="text-red-400 font-bold">{filteredVehicles.length}</strong> results
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {page > 1 && (
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-4 py-2 rounded-xl bg-[#171c28] border border-[#262f44] text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer hover:border-slate-500"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                    <span>Previous {itemsPerPage} results</span>
                  </button>
                )}

                {page < totalPages && (
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer shadow-lg shadow-red-600/20 active:scale-95"
                  >
                    <span>Next {Math.min(itemsPerPage, filteredVehicles.length - page * itemsPerPage)} results</span>
                    <ChevronRight className="w-4 h-4 text-white" />
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
          
          {/* Top Gainers & Losers Controls */}
          <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222838] pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-red-400" />
                  <span>Appreciation & Trend Rankings (Gainers / Losers)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Percentage price variation analysis over the last 12 months by brand and model.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-400">Manufacturer:</span>
                <select
                  value={selectedBrandIntelligence}
                  onChange={(e) => setSelectedBrandIntelligence(e.target.value)}
                  className="bg-[#171a26] text-xs text-red-300 font-bold px-3 py-2 rounded-xl border border-[#283248] focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="all">All Brands ({HERO_VEHICLES.length} Vehicles)</option>
                  {MANUFACTURERS.map((m) => (
                    <option key={m.id} value={m.official_name}>{m.official_name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Gainers vs Losers Tabs */}
            <div className="flex space-x-2 border-b border-[#222838]">
              <button
                onClick={() => setIntelTab('gainers')}
                className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  intelTab === 'gainers'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Top Gainers (+ Appreciation)</span>
              </button>

              <button
                onClick={() => setIntelTab('losers')}
                className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  intelTab === 'losers'
                    ? 'border-rose-500 text-rose-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>Top Losers (- Decline)</span>
              </button>
            </div>

            {/* Vehicle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(intelTab === 'gainers' ? topGainers : topLosers).map((car) => {
                const isGainer = car.price_change_1y_pct >= 0;
                return (
                  <div
                    key={car.id}
                    onClick={() => {
                      onSelectVehicle(car.slug);
                      onNavigate('detail', car.slug);
                    }}
                    className="p-4 rounded-xl bg-[#161a26] hover:bg-[#1f2536] border border-[#242c3f] transition-all cursor-pointer group space-y-3"
                  >
                    <div className="relative h-40 rounded-lg overflow-hidden bg-slate-800">
                      <img
                        src={car.hero_image_url}
                        alt={car.variant_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold border backdrop-blur-md ${
                        isGainer
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-950/80 text-rose-400 border-rose-500/30'
                      }`}>
                        {isGainer ? '+' : ''}{car.price_change_1y_pct}%
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-extrabold text-white group-hover:text-red-400 transition-colors">
                        {car.manufacturer_name} {car.model_name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {car.variant_name} ({car.model_year_from})
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#23293b] flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Median Value</span>
                      <span className="text-red-400 font-mono font-bold text-xs">
                        €{(car.current_median_price_eur / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recharts Indices & Auctions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-red-400" />
                <span>Median Market Index Trend (2021-2025)</span>
              </h2>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={marketTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222838" />
                    <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#171a26', borderColor: '#2d3548', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="indexValue" stroke="#d4af37" fill="#d4af3722" strokeWidth={3} name="Base Index 100" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-red-400" />
                <span>Asset Category Breakdown</span>
              </h2>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#171a26', borderColor: '#2d3548', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1 text-xs">
                {categoryData.map((c) => (
                  <div key={c.name} className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                      <span>{c.name}</span>
                    </span>
                    <span className="font-bold font-mono">{c.value}%</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Upcoming Global Auctions */}
          <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-4">
            <div className="flex items-center space-x-2 text-red-400">
              <Calendar className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">International Collector Auctions Calendar</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {UPCOMING_AUCTIONS.map((auction) => (
                <div key={auction.id} className="p-4 rounded-xl bg-[#161a26] border border-[#242c3f] space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-red-400 font-bold">
                    <span>{auction.startDate} - {auction.endDate}</span>
                    <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">{auction.estimatedLotsCount} LOTS</span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{auction.title}</h3>

                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{auction.location} ({auction.organizer})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: MODEL MATRICES & TEMPLATES */}
      {activeMarketTab === 'templates' && (
        <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-6">
          <div className="border-b border-[#222838] pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-red-400" />
              <span>Model, Limited Series & Homologation Matrix</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
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
                className="p-5 rounded-2xl bg-[#161a26] border border-[#242c3f] hover:border-red-500/40 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <img src={v.hero_image_url} alt="" className="w-14 h-14 rounded-xl object-cover border border-[#293246]" />
                  <div>
                    <span className="text-[10px] font-bold font-mono text-red-400 uppercase">{v.category}</span>
                    <h3 className="text-sm font-extrabold text-white">{v.manufacturer_name} {v.model_name}</h3>
                    <p className="text-xs text-slate-400 truncate">{v.variant_name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#121520] p-3 rounded-xl border border-[#202738] font-mono">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Production Year</span>
                    <span className="font-bold text-slate-200">{v.model_year_from}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Units Produced</span>
                    <span className="font-bold text-slate-200">{v.production_total || 'Limited Series'}</span>
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
