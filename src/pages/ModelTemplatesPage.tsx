import React from 'react';
import { ModelTemplatesShowcase } from '../components/ModelTemplatesShowcase';
import { Locale } from '../data/translations';

interface ModelTemplatesPageProps {
  locale: Locale;
  onSelectVehicle: (slug: string) => void;
  onNavigate: (page: string, slug?: string) => void;
  onToggleWatchlist: (id: string) => void;
  onToggleCompare: (id: string) => void;
  watchlistIds: string[];
  compareIds: string[];
}

export const ModelTemplatesPage: React.FC<ModelTemplatesPageProps> = ({
  locale,
  onSelectVehicle,
  onNavigate,
  onToggleWatchlist,
  onToggleCompare,
  watchlistIds,
  compareIds,
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Intro Hero Banner for Templates */}
      <div className="bg-gradient-to-r from-[#121622] via-[#161c2c] to-[#121520] p-6 sm:p-8 rounded-3xl border border-[#232a3c] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-bold text-xs">
            <span>Vehicle Data Architecture v0.2</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Sample Models & Automotive Templates
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Explore interactive model templates designed as an information standard for collector cars, supercars, hypercars, and race homologations. Click any vehicle to consult complete spec analysis, design history, and financial model.
          </p>
        </div>
      </div>

      {/* Main Showcase Grid */}
      <ModelTemplatesShowcase
        onSelectVehicle={onSelectVehicle}
        onNavigate={onNavigate}
        onToggleWatchlist={onToggleWatchlist}
        onToggleCompare={onToggleCompare}
        watchlistIds={watchlistIds}
        compareIds={compareIds}
      />
    </div>
  );
};
