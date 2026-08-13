import React, { useState } from 'react';
import { X, SlidersHorizontal, Check, Shield, Zap, Gauge, Award, DollarSign, Wrench } from 'lucide-react';
import { VehicleFamilyNavigation, VariantNavigationItem } from '../types';
import { Locale } from '../data/translations';
import { catalogueRepository } from '../services/catalogueRepository';

interface VariantCompareModalProps {
  navigationData: VehicleFamilyNavigation;
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  initialVariantId?: string;
}

export const VariantCompareModal: React.FC<VariantCompareModalProps> = ({
  navigationData,
  isOpen,
  onClose,
  locale,
  initialVariantId
}) => {
  const isIt = false;
  const allVariants = navigationData.generations.flatMap(g => 
    g.variants.map(v => ({ ...v, generationCode: g.code }))
  );

  // Default select up to 3 variants
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    const defaultIds = [
      initialVariantId || allVariants[0]?.id || 'bmw-m3-e30-2-3',
      allVariants[2]?.id || 'bmw-m3-e30-sport-evolution',
      allVariants[7]?.id || 'bmw-m3-e46-csl'
    ].filter(Boolean);
    return Array.from(new Set(defaultIds)).slice(0, 3);
  });

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(prev => prev.filter(item => item !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds(prev => [...prev, id]);
      }
    }
  };

  // Helper to fetch full or mock specs for variant
  const getVariantDetails = (vItem: VariantNavigationItem) => {
    const catalogMatch = catalogueRepository.getVariantBySlug(vItem.slug) || catalogueRepository.getAllVariants().vehicles.find(x => x.id === vItem.id);
    if (catalogMatch) return catalogMatch;

    // Fallback benchmark for demo variants
    return {
      id: vItem.id,
      variant_name: vItem.name,
      model_year_from: parseInt(vItem.years.split('–')[0]) || 1990,
      model_year_to: parseInt(vItem.years.split('–')[1]) || undefined,
      engine: {
        family_name: 'BMW S14 / S50 / S54 Motorsport',
        displacement_cc: vItem.powerHp ? vItem.powerHp * 10 : 2467,
        power_hp: vItem.powerHp || 238,
        torque_nm: vItem.powerHp ? Math.round(vItem.powerHp * 1.1) : 240
      },
      transmission: {
        type: 'Manual',
        gears: 5,
        drivetrain: 'RWD'
      },
      specs: {
        kerb_weight_kg: 1200 + (vItem.powerHp ? (vItem.powerHp - 200) * 0.8 : 0),
        acceleration_0_100: vItem.powerHp ? parseFloat((8.5 - vItem.powerHp * 0.01).toFixed(1)) : 6.1,
        top_speed_kph: vItem.powerHp ? Math.min(310, Math.round(220 + vItem.powerHp * 0.2)) : 248
      },
      production_total: vItem.productionTotal || 600,
      scores: {
        collector_score: { overall_score: Math.min(99, 85 + (vItem.limitedEdition ? 10 : 5)) }
      },
      current_median_price_eur: vItem.limitedEdition ? 180000 : 75000,
      maintenance_complexity: vItem.powerHp && vItem.powerHp > 400 ? 'Very High' : 'High'
    };
  };

  const selectedVariantsDetails = selectedIds.map(id => {
    const vItem = allVariants.find(v => v.id === id) || allVariants[0];
    return {
      navItem: vItem,
      details: getVariantDetails(vItem)
    };
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-6xl bg-[#121622] border border-[#2b354d] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#202738] flex items-center justify-between bg-[#151a29]">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-red-400" />
              <h2 className="text-lg font-extrabold text-white">
                {isIt ? `Confronto Versioni ${navigationData.model.name}` : `${navigationData.model.name} Variant Comparison`}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isIt ? 'Seleziona fino a 3 varianti della stessa famiglia per analizzare differenze tecniche e collezionistiche' : 'Select up to 3 variants to analyze technical & collector benchmark differences'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1b2232] text-slate-300 hover:text-white border border-[#2b354d] transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Variant Picker Bar */}
        <div className="p-4 border-b border-[#202738] bg-[#0e111a] flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-slate-400 mr-2">{isIt ? 'Varianti selezionate (max 3):' : 'Selected variants (max 3):'}</span>
          {allVariants.map(v => {
            const isSelected = selectedIds.includes(v.id);
            return (
              <button
                key={v.id}
                onClick={() => toggleSelect(v.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-red-500/20 text-red-300 border-red-500/50 font-bold'
                    : 'bg-[#151a28] text-slate-300 border-[#252f44] hover:bg-[#1f273b]'
                }`}
              >
                <span>{v.generationCode} · {v.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-red-400" />}
              </button>
            );
          })}
        </div>

        {/* Comparison Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          
          <div className={`grid grid-cols-1 md:grid-cols-${selectedVariantsDetails.length} gap-4`}>
            {selectedVariantsDetails.map(({ navItem, details }) => (
              <div 
                key={navItem.id}
                className="bg-[#161c2b] border border-[#263148] rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-lg"
              >
                {/* Variant Card Top */}
                <div className="border-b border-[#242e44] pb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                    {navItem.generationCode}
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-2 leading-snug">
                    {navItem.name}
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-1">
                    {navItem.years} · {navItem.limitedEdition ? (isIt ? 'Serie Limitata' : 'Limited Edition') : (isIt ? 'Produzione di Serie' : 'Standard Run')}
                  </div>
                </div>

                {/* Specs List */}
                <div className="space-y-3 text-xs">
                  
                  <div className="flex justify-between items-center py-1.5 border-b border-[#20283b]">
                    <span className="text-slate-400">{isIt ? 'Motore' : 'Engine'}</span>
                    <span className="font-bold text-slate-100">{details.engine?.family_name || 'BMW Motorsport Inline-4'}</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#20283b]">
                    <span className="text-slate-400">{isIt ? 'Cilindrata' : 'Displacement'}</span>
                    <span className="font-mono font-bold text-slate-200">{details.engine?.displacement_cc} cc</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#20283b]">
                    <span className="text-slate-400">{isIt ? 'Potenza Max' : 'Max Power'}</span>
                    <span className="font-mono font-bold text-red-400">{details.engine?.power_hp} HP</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#20283b]">
                    <span className="text-slate-400">{isIt ? 'Coppia Max' : 'Max Torque'}</span>
                    <span className="font-mono font-bold text-slate-200">{details.engine?.torque_nm} Nm</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#20283b]">
                    <span className="text-slate-400">{isIt ? 'Cambio & Trazione' : 'Gearbox & Drive'}</span>
                    <span className="font-bold text-slate-200">{details.transmission?.gears}M {details.transmission?.type} ({details.transmission?.drivetrain})</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#20283b]">
                    <span className="text-slate-400">{isIt ? 'Peso a Vuoto' : 'Kerb Weight'}</span>
                    <span className="font-mono font-bold text-slate-200">{details.specs?.kerb_weight_kg} kg</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#20283b]">
                    <span className="text-slate-400">0–100 km/h</span>
                    <span className="font-mono font-bold text-red-300">{details.specs?.acceleration_0_100}s</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#20283b]">
                    <span className="text-slate-400">{isIt ? 'Velocità Max' : 'Top Speed'}</span>
                    <span className="font-mono font-bold text-slate-200">{details.specs?.top_speed_kph} km/h</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#20283b]">
                    <span className="text-slate-400">{isIt ? 'Produzione Totale' : 'Total Production'}</span>
                    <span className="font-mono font-bold text-slate-200">
                      {typeof details.production_total === 'number' ? details.production_total.toLocaleString() : details.production_total}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#20283b]">
                    <span className="text-slate-400">Collector Score</span>
                    <span className="font-mono font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                      {details.scores?.collector_score?.overall_score || 95}/100
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#20283b]">
                    <span className="text-slate-400">{isIt ? 'Valore Mediano' : 'Median Value'}</span>
                    <span className="font-mono font-extrabold text-emerald-400">
                      €{(details.current_median_price_eur || 120000).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-400">{isIt ? 'Manutenzione' : 'Maintenance'}</span>
                    <span className="font-bold text-red-300">{details.maintenance_complexity || 'High'}</span>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#202738] bg-[#151a29] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-500 transition-all"
          >
            {isIt ? 'Chiudi Confronto' : 'Close Comparison'}
          </button>
        </div>

      </div>
    </div>
  );
};
