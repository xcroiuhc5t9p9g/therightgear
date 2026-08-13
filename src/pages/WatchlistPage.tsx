import React from 'react';
import { Bookmark, Trash2, ArrowUpRight, DollarSign, Award, ChevronRight } from 'lucide-react';
import { catalogueRepository } from '../services/catalogueRepository';
import { VehicleVariant } from '../types';
import { Locale, translations } from '../data/translations';

interface WatchlistPageProps {
  watchlistIds: string[];
  onRemoveWatchlist: (id: string) => void;
  onNavigate: (page: string, slug?: string) => void;
  onSelectVehicle: (slug: string) => void;
  locale: Locale;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({
  watchlistIds,
  onRemoveWatchlist,
  onNavigate,
  onSelectVehicle,
  locale
}) => {
  const t = translations[locale];

  const savedVehicles: VehicleVariant[] = catalogueRepository.getAllVariants().vehicles.filter(v => watchlistIds.includes(v.id));

  const totalPortfolioValue = savedVehicles.reduce((acc, curr) => acc + (curr.current_median_price_eur || 0), 0);
  const scoredVehicles = savedVehicles.filter(v => v.scores?.collector_score?.overall_score != null);
  const avgCollectorScore = scoredVehicles.length > 0
    ? Math.round(scoredVehicles.reduce((acc, curr) => acc + (curr.scores?.collector_score?.overall_score || 0), 0) / scoredVehicles.length)
    : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-2">
        <div className="flex items-center space-x-2 text-red-400">
          <Bookmark className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Collector Portfolio Tracker</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">{t.watchlist_title}</h1>
        <p className="text-xs text-slate-400">
          Personalized vehicle portfolio tracked in real time for price shifts and upcoming auction lots.
        </p>
      </div>

      {/* Portfolio Stats Bar */}
      {savedVehicles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#121520] p-4 rounded-xl border border-[#23293a]">
            <div className="text-[11px] text-slate-400">Total Portfolio Value</div>
            <div className="text-2xl font-extrabold text-white font-mono-numbers mt-1">
              €{totalPortfolioValue.toLocaleString()}
            </div>
          </div>

          <div className="bg-[#121520] p-4 rounded-xl border border-[#23293a]">
            <div className="text-[11px] text-slate-400">Monitored Vehicles</div>
            <div className="text-2xl font-extrabold text-red-400 font-mono-numbers mt-1">
              {savedVehicles.length} Models
            </div>
          </div>

          <div className="bg-[#121520] p-4 rounded-xl border border-[#23293a]">
            <div className="text-[11px] text-slate-400">Average Collector Score</div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono-numbers mt-1">
              {avgCollectorScore} / 100
            </div>
          </div>
        </div>
      )}

      {/* Vehicles Grid */}
      {savedVehicles.length === 0 ? (
        <div className="bg-[#121520] p-12 rounded-2xl border border-[#23293a] text-center space-y-4">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-lg font-bold text-white">Your Watchlist is currently empty</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Add vehicles from the catalog index or detail pages to track their market performance over time.
          </p>
          <button
            onClick={() => onNavigate('explore')}
            className="px-5 py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedVehicles.map(car => (
            <div
              key={car.id}
              className="bg-[#121520] rounded-2xl border border-[#23293a] overflow-hidden p-4 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="relative h-36 rounded-xl overflow-hidden bg-slate-900">
                  <img src={car.hero_image_url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => onRemoveWatchlist(car.id)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg hover:bg-rose-600 text-white transition-colors cursor-pointer"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <div className="text-[10px] text-red-400 font-bold uppercase">{car.manufacturer_name}</div>
                  <div className="text-base font-extrabold text-white">{car.model_name}</div>
                  <div className="text-xs text-slate-400 truncate">{car.variant_name}</div>
                </div>

                <div className="flex justify-between items-center bg-[#171b28] p-2.5 rounded-lg border border-[#252c3f]">
                  <span className="text-xs text-slate-400">Median Price</span>
                  <span className="text-sm font-bold text-white font-mono-numbers">
                    €{car.current_median_price_eur ? `${(car.current_median_price_eur / 1000).toLocaleString()}k` : 'N/A'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => { onSelectVehicle(car.slug); onNavigate('detail', car.slug); }}
                className="w-full py-2 bg-[#1a1f2e] hover:bg-red-600 hover:text-slate-950 text-slate-200 text-xs font-bold rounded-xl transition-colors border border-[#283045] text-center cursor-pointer"
              >
                View Full Dossier
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
