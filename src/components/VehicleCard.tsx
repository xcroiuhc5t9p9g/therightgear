import React from 'react';
import { Lock } from 'lucide-react';
import { VehicleVariant, UserRole } from '../types';

interface VehicleCardProps {
  vehicle: VehicleVariant;
  activeRole?: UserRole;
  onSelectVehicle: (slug: string) => void;
  onNavigate: (page: string, slug?: string) => void;
  onOpenAuthModal?: (reason: 'valuation' | 'watchlist' | 'compare') => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  activeRole = 'visitor',
  onSelectVehicle,
  onNavigate,
  onOpenAuthModal
}) => {
  const handleClick = () => {
    onSelectVehicle(vehicle.slug);
    onNavigate('detail', vehicle.slug);
  };

  const medianPrice = vehicle?.current_median_price_eur || vehicle?.market_stats?.median_price_eur || 250000;
  const formattedPrice = typeof medianPrice === 'number' ? medianPrice.toLocaleString('it-IT') : '250.000';

  return (
    <div className="bg-[#121520] border border-[#23293a] hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group shadow-lg">
      {/* 1. Foto Principale */}
      <div 
        onClick={handleClick}
        className="relative aspect-[16/10] bg-slate-900 overflow-hidden cursor-pointer"
      >
        <img
          src={vehicle?.hero_image_url || ''}
          alt={`${vehicle?.manufacturer_name || ''} ${vehicle?.model_name || ''}`}
          className="w-full h-full object-cover motion-safe:group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* 2. Sotto immagine principale: Nome casa costruttrice, Modello, Anno inizio costruzione */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            {vehicle?.manufacturer_name}
          </div>
          <h3 
            onClick={handleClick}
            className="text-base font-extrabold text-white group-hover:text-amber-300 transition-colors cursor-pointer"
          >
            {vehicle?.model_name}
          </h3>
          <div className="text-xs text-slate-400 font-mono">
            Production Start Year: <strong className="text-slate-200">{vehicle?.model_year_from}</strong>
          </div>

          {/* Market Valuation (Blurred for Guest / Unregistered User) */}
          <div className="pt-2 flex items-center justify-between text-xs border-t border-[#1d2335]">
            <span className="text-slate-400 font-mono">Valuation:</span>
            {activeRole === 'visitor' ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenAuthModal) {
                    onOpenAuthModal('valuation');
                  } else {
                    onNavigate('register');
                  }
                }}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-red-500/30 text-red-400 text-xs cursor-pointer hover:border-red-400 transition-all shadow-sm"
                title="Register to unlock transparent valuation"
              >
                <span className="filter blur-[3.5px] select-none font-mono font-extrabold text-red-400">
                  € 250.000
                </span>
                <Lock className="w-3.5 h-3.5 text-red-400" />
              </button>
            ) : (
              <span className="font-mono font-extrabold text-emerald-400">
                €{formattedPrice}
              </span>
            )}
          </div>
        </div>

        {/* 3. Pulsante "Explore" */}
        <div className="pt-2">
          <button
            onClick={handleClick}
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-all shadow-md shadow-red-600/20 cursor-pointer uppercase tracking-wider"
          >
            Explore
          </button>
        </div>
      </div>
    </div>
  );
};

