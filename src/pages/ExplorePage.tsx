import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Heart, 
  Scale, 
  SlidersHorizontal, 
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { VehicleVariant, SearchFilters } from '../types';
import { fetchVehicles, fetchManufacturers } from '../services/api';
import { MANUFACTURERS } from '../data/catalogData';
import { Locale, translations } from '../data/translations';

interface ExplorePageProps {
  locale: Locale;
  onSelectVehicle: (slug: string) => void;
  onNavigate: (page: string, slug?: string) => void;
  onToggleWatchlist: (id: string) => void;
  onToggleCompare: (id: string) => void;
  watchlistIds: string[];
  compareIds: string[];
  initialSearchQuery?: string;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  locale,
  onSelectVehicle,
  onNavigate,
  onToggleWatchlist,
  onToggleCompare,
  watchlistIds,
  compareIds,
  initialSearchQuery = ''
}) => {
  const t = translations[locale];

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [vehicles, setVehicles] = useState<VehicleVariant[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter State
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialSearchQuery,
    category: 'All',
    tier: 'All',
    manufacturerId: '',
    yearMin: 1950,
    yearMax: 2025,
    priceMin: 0,
    priceMax: 25000000,
    collectorScoreMin: 0,
    investmentScoreMin: 0,
    drivetrain: 'All',
    limitedEditionOnly: false
  });

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Pagination & Results per page (25, 50, 100)
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(25);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetchVehicles(filters);
      setVehicles(res.vehicles);
      setTotalCount(res.total);
      setLoading(false);
    }
    loadData();
    setPage(1);
  }, [filters]);

  useEffect(() => {
    setPage(1);
  }, [viewMode, itemsPerPage]);

  const totalPages = Math.ceil(vehicles.length / itemsPerPage) || 1;
  const paginatedVehicles = vehicles.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const categories = ['All', 'Supercar', 'Hypercar', 'Homologation Special', 'Youngtimer', 'Grand Tourer', 'Sports Car', 'Luxury Sedan'];
  const tiers = ['All', 'Hero', 'Core', 'Discovery'];
  const drivetrains = ['All', 'RWD', 'AWD', 'FWD'];

  const resetFilters = () => {
    setFilters({
      query: '',
      category: 'All',
      tier: 'All',
      manufacturerId: '',
      yearMin: 1950,
      yearMax: 2025,
      priceMin: 0,
      priceMax: 25000000,
      collectorScoreMin: 0,
      investmentScoreMin: 0,
      drivetrain: 'All',
      limitedEditionOnly: false
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#121520] p-5 rounded-2xl border border-[#22283a]">
        <div>
          <h1 className="text-2xl font-extrabold text-white">{t.explore_catalog_title}</h1>
          <p className="text-xs text-slate-400 mt-1">
            Index of 300 iconic global models with analytical filters and financial records.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View toggle */}
          <div className="flex items-center bg-[#181c2b] p-1 rounded-xl border border-[#2a3146]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-red-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Financial Matrix Table"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-[#1d2334] text-slate-200 text-xs font-medium border border-[#30384f] hover:border-red-500/50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4 text-red-400" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Filters Panel */}
        <div className={`space-y-5 bg-[#121520] p-5 rounded-2xl border border-[#22283a] ${filterDrawerOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-[#202636]">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-red-400" />
              <span>Search Parameters</span>
            </span>
            <button
              onClick={resetFilters}
              className="text-slate-500 hover:text-red-400 text-xs flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Query Input */}
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">Keyword / Model</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={filters.query || ''}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                placeholder="e.g. F40, V12, Twin-Turbo..."
                className="w-full bg-[#181c2a] text-xs text-slate-200 placeholder-slate-500 pl-8 pr-3 py-2 rounded-lg border border-[#282f42] focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Tier filter */}
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">{t.filter_tier}</label>
            <div className="grid grid-cols-3 gap-1.5">
              {tiers.map(tOption => (
                <button
                  key={tOption}
                  onClick={() => setFilters({ ...filters, tier: tOption })}
                  className={`py-1.5 text-[11px] font-semibold rounded-lg border text-center transition-colors ${
                    filters.tier === tOption
                      ? 'bg-red-500/20 text-red-300 border-red-500'
                      : 'bg-[#181c2a] text-slate-400 border-[#282f42] hover:text-white'
                  }`}
                >
                  {tOption}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">{t.filter_category}</label>
            <select
              value={filters.category || 'All'}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full bg-[#181c2a] text-xs text-slate-200 p-2 rounded-lg border border-[#282f42] focus:outline-none focus:border-red-500"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Manufacturer Filter */}
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">{t.filter_manufacturer}</label>
            <select
              value={filters.manufacturerId || ''}
              onChange={(e) => setFilters({ ...filters, manufacturerId: e.target.value })}
              className="w-full bg-[#181c2a] text-xs text-slate-200 p-2 rounded-lg border border-[#282f42] focus:outline-none focus:border-red-500"
            >
              <option value="">All Manufacturers</option>
              {MANUFACTURERS.map(m => (
                <option key={m.id} value={m.id}>{m.official_name}</option>
              ))}
            </select>
          </div>

          {/* Results per page Filter (25, 50, 100) */}
          <div className="space-y-1">
            <label className="text-[11px] text-amber-400 font-medium">Results per page / Risultati</label>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="w-full bg-[#181c2a] text-xs text-amber-300 font-bold p-2 rounded-lg border border-[#282f42] focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value={25}>25 per page / 25 per pagina</option>
              <option value={50}>50 per page / 50 per pagina</option>
              <option value={100}>100 per page / 100 per pagina</option>
            </select>
          </div>

          {/* Collector Score Minimum */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Min. {t.collector_score}</span>
              <span className="text-red-400 font-bold font-mono-numbers">{filters.collectorScoreMin}/100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.collectorScoreMin || 0}
              onChange={(e) => setFilters({ ...filters, collectorScoreMin: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Investment Score Minimum */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">Min. {t.investment_score}</span>
              <span className="text-emerald-400 font-bold font-mono-numbers">{filters.investmentScoreMin}/100</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.investmentScoreMin || 0}
              onChange={(e) => setFilters({ ...filters, investmentScoreMin: Number(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Drivetrain filter */}
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 font-medium">{t.filter_drivetrain}</label>
            <div className="grid grid-cols-4 gap-1">
              {drivetrains.map(d => (
                <button
                  key={d}
                  onClick={() => setFilters({ ...filters, drivetrain: d })}
                  className={`py-1 text-[11px] rounded border text-center font-medium transition-colors ${
                    filters.drivetrain === d
                      ? 'bg-red-500/20 text-red-300 border-red-500'
                      : 'bg-[#181c2a] text-slate-400 border-[#282f42] hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Limited edition toggle */}
          <div className="pt-2 border-t border-[#202636]">
            <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.limitedEditionOnly || false}
                onChange={(e) => setFilters({ ...filters, limitedEditionOnly: e.target.checked })}
                className="rounded accent-amber-500 w-4 h-4"
              />
              <span>Limited Editions Only</span>
            </label>
          </div>
        </div>

        {/* Vehicle Results Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Found <strong className="text-red-400 font-mono-numbers">{totalCount}</strong> vehicles</span>
            {loading && <span className="text-red-400 animate-pulse">Loading index...</span>}
          </div>

          {/* GRID VIEW */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginatedVehicles.map((car) => {
                const isWatchlist = watchlistIds.includes(car.id);
                const isCompare = compareIds.includes(car.id);

                return (
                  <div
                    key={car.id}
                    className="bg-[#121520] rounded-2xl border border-[#23293a] overflow-hidden hover:border-red-500/50 transition-all group flex flex-col justify-between"
                  >
                    <div className="relative h-44 bg-slate-900 cursor-pointer" onClick={() => { onSelectVehicle(car.slug); onNavigate('detail', car.slug); }}>
                      <img
                        src={car.hero_image_url}
                        alt={car.variant_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121520] via-transparent to-black/30" />

                      <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          car.tier === 'Hero' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {car.tier}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 text-[10px]">
                          {car.category}
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5 flex items-center space-x-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleWatchlist(car.id); }}
                          className={`p-1.5 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
                            isWatchlist ? 'bg-rose-500 text-white font-bold' : 'bg-slate-900/70 text-slate-300 hover:text-white'
                          }`}
                          title={isWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWatchlist ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleCompare(car.id); }}
                          className={`p-1.5 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
                            isCompare ? 'bg-indigo-500 text-white font-bold' : 'bg-slate-900/70 text-slate-300 hover:text-white'
                          }`}
                          title={isCompare ? 'Remove from Comparison' : 'Add to Comparison'}
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
                        <div>
                          <div className="text-[11px] text-red-400 font-semibold">{car.manufacturer_name}</div>
                          <div className="text-base font-extrabold text-white">{car.model_name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-white font-mono-numbers">
                            €{(car.current_median_price_eur / 1000).toLocaleString()}k
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 space-y-2.5">
                      <div className="text-[11px] text-slate-400 line-clamp-1">{car.variant_name}</div>

                      <div className="grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="bg-[#171a27] p-1.5 rounded border border-[#252b3d]">
                          <span className="text-[10px] text-slate-500 block">{t.collector_score}</span>
                          <span className="font-bold text-red-400 font-mono-numbers">{car.scores.collector_score.overall_score}</span>
                        </div>
                        <div className="bg-[#171a27] p-1.5 rounded border border-[#252b3d]">
                          <span className="text-[10px] text-slate-500 block">{t.investment_score}</span>
                          <span className="font-bold text-emerald-400 font-mono-numbers">{car.scores.investment_score.overall_score}</span>
                        </div>
                      </div>

                      {/* Card Actions: Watchlist & Compare */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleWatchlist(car.id); }}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center space-x-1 border cursor-pointer ${
                            isWatchlist
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-[#181d2a] text-slate-300 border-[#2a344a] hover:bg-[#222a3d] hover:text-white'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isWatchlist ? 'fill-rose-400 text-rose-400' : 'text-rose-400'}`} />
                          <span className="truncate">{isWatchlist ? 'In Watchlist' : 'add to watch list'}</span>
                        </button>

                        <button
                          onClick={(e) => { e.stopPropagation(); onToggleCompare(car.id); }}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center space-x-1 border cursor-pointer ${
                            isCompare
                              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                              : 'bg-[#181d2a] text-slate-300 border-[#2a344a] hover:bg-[#222a3d] hover:text-white'
                          }`}
                        >
                          <Scale className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="truncate">{isCompare ? 'In Compare' : 'Compare'}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => { onSelectVehicle(car.slug); onNavigate('detail', car.slug); }}
                        className="w-full py-1.5 rounded-lg bg-[#1a1f2e] hover:bg-red-600 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all border border-[#293145] text-center cursor-pointer"
                      >
                        {t.view_detail}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* DENSE FINANCIAL MATRIX TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="bg-[#121520] rounded-2xl border border-[#23293a] overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#171b29] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#23293a]">
                  <tr>
                    <th className="p-3">Vehicle & Variant</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Year</th>
                    <th className="p-3">Median Price</th>
                    <th className="p-3">1Y Trend</th>
                    <th className="p-3">Collector Score</th>
                    <th className="p-3">Investment Score</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2333]">
                  {paginatedVehicles.map((car) => (
                    <tr key={car.id} className="hover:bg-[#181c2b] transition-colors">
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <img src={car.hero_image_url} alt="" className="w-9 h-9 rounded object-cover bg-slate-800 shrink-0" />
                          <div>
                            <div className="font-bold text-white hover:text-red-300 cursor-pointer" onClick={() => { onSelectVehicle(car.slug); onNavigate('detail', car.slug); }}>
                              {car.manufacturer_name} {car.model_name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{car.variant_name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-[#1b202e] border border-[#2a3146] text-[10px]">
                          {car.category}
                        </span>
                      </td>
                      <td className="p-3 font-mono-numbers">{car.model_year_from}</td>
                      <td className="p-3 font-mono-numbers font-bold text-white">
                        €{(car.current_median_price_eur / 1000).toLocaleString()}k
                      </td>
                      <td className="p-3 font-mono-numbers">
                        <span className={`text-[11px] font-bold ${car.price_change_1y_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {car.price_change_1y_pct >= 0 ? '+' : ''}{car.price_change_1y_pct}%
                        </span>
                      </td>
                      <td className="p-3 font-mono-numbers">
                        <span className="font-bold text-red-400">{car.scores.collector_score.overall_score}</span>/100
                      </td>
                      <td className="p-3 font-mono-numbers">
                        <span className="font-bold text-emerald-400">{car.scores.investment_score.overall_score}</span>/100
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => { onSelectVehicle(car.slug); onNavigate('detail', car.slug); }}
                          className="px-2.5 py-1 rounded bg-red-500/10 text-red-300 hover:bg-red-600 hover:text-slate-950 font-bold text-[11px] transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Results Range Indicator & Next/Prev Controls */}
          {vehicles.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1f2638] bg-[#121520] p-4 rounded-2xl border border-[#23293a]">
              <div className="text-xs text-slate-300 font-mono flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  Showing <strong className="text-white">{(page - 1) * itemsPerPage + 1}</strong> - <strong className="text-white">{Math.min(page * itemsPerPage, vehicles.length)}</strong> of <strong className="text-red-400 font-bold">{vehicles.length}</strong> results
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
                    <span>Next {Math.min(itemsPerPage, vehicles.length - page * itemsPerPage)} results</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
