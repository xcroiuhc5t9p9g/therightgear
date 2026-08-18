import React, { useState } from 'react';
import { 
  Car, 
  Award, 
  Gauge, 
  TrendingUp, 
  Heart, 
  Scale, 
  ChevronRight, 
  Layers, 
  Zap, 
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { catalogueRepository } from '../services/catalogueRepository';
import { VehicleVariant } from '../types';
import { VehicleCard } from './VehicleCard';

interface ModelTemplatesShowcaseProps {
  onSelectVehicle: (slug: string) => void;
  onNavigate: (page: string, slug?: string) => void;
  onToggleWatchlist: (id: string) => void;
  onToggleCompare: (id: string) => void;
  watchlistIds: string[];
  compareIds: string[];
}

export const ModelTemplatesShowcase: React.FC<ModelTemplatesShowcaseProps> = ({
  onSelectVehicle,
  onNavigate,
  onToggleWatchlist,
  onToggleCompare,
  watchlistIds,
  compareIds
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    { id: 'All', label: 'All Template Models', icon: Layers },
    { id: 'Supercar', label: 'Analog Supercars (V8/V10)', icon: Zap },
    { id: 'Hypercar', label: 'Exceptional Hypercars (V12/Quad-Turbo)', icon: Award },
    { id: 'Homologation Special', label: 'Homologation & Rally Icons', icon: Sparkles },
    { id: 'Youngtimer', label: 'Youngtimer Legends', icon: Gauge },
  ];

  const filteredVehicles = catalogueRepository.getAllVariants().vehicles.filter(v => {
    if (selectedCategory === 'All') return true;
    return v.category === selectedCategory;
  });

  return (
    <section className="space-y-6 bg-[#10131d] p-6 sm:p-8 rounded-3xl border border-[#23293a] shadow-xl">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#222838]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold">
            <Car className="w-3.5 h-3.5" />
            <span>Car Model Template Datasheets</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Sample Models & Vehicle Templates Catalog
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Select one of the iconic models below to explore the detailed 23-section technical datasheet, maintenance cost estimation, and market analysis.
          </p>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="self-start md:self-auto px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-amber-400 hover:to-red-600 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-red-600/10 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <span>Explore Full Index (300)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-[#161a26] text-slate-300 hover:bg-[#202638] hover:text-white border border-[#252d42]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {filteredVehicles.map((car) => (
          <VehicleCard
            key={car.id}
            vehicle={car}
            onSelectVehicle={onSelectVehicle}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  );
};
