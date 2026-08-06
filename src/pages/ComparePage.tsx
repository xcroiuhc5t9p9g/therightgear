import React, { useState, useEffect } from 'react';
import { Scale, X, Plus, Sparkles, Bot, ArrowRight } from 'lucide-react';
import { VehicleVariant } from '../types';
import { fetchCompareVehicles, askAiAdvisor } from '../services/api';
import { HERO_VEHICLES } from '../data/catalogData';
import { Locale, translations } from '../data/translations';
import { generateCompareJsonLd, injectSeoGeoMetadata, getAbsolutePageUrl } from '../services/seoGeoService';

interface ComparePageProps {
  compareIds: string[];
  onRemoveCompare: (id: string) => void;
  onNavigate: (page: string, slug?: string) => void;
  locale: Locale;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  compareIds,
  onRemoveCompare,
  onNavigate,
  locale
}) => {
  const t = translations[locale];
  const [vehicles, setVehicles] = useState<VehicleVariant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [aiSynthesis, setAiSynthesis] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      let loadedVehicles: VehicleVariant[] = [];
      if (compareIds.length === 0) {
        // Fallback default cars for initial demo if empty
        loadedVehicles = [HERO_VEHICLES[0], HERO_VEHICLES[1]];
      } else {
        setLoading(true);
        loadedVehicles = await fetchCompareVehicles(compareIds);
      }
      setVehicles(loadedVehicles);
      setLoading(false);

      // Inject SEO / GEO Metadata for Compare Page
      const pageCanonicalUrl = getAbsolutePageUrl('/compare');
      const carNames = loadedVehicles.map(v => `${v.manufacturer_name} ${v.variant_name}`).join(' vs ');
      const schemas = generateCompareJsonLd(loadedVehicles, pageCanonicalUrl);
      injectSeoGeoMetadata({
        title: `Confronto Prestazioni e Valore: ${carNames} | AIP`,
        description: `Confronto tecnico, accelerazione, potenza, quotazioni di mercato e collector score tra ${carNames}.`,
        canonicalUrl: pageCanonicalUrl,
        ogType: 'website',
        keywords: ['Confronto Vetture', 'Specifiche Tecniche', 'Quotazioni', ...loadedVehicles.map(v => v.manufacturer_name)]
      }, schemas);
    }
    loadData();
  }, [compareIds]);

  const handleRunAiHeadToHead = async () => {
    if (vehicles.length < 2) return;
    setAiLoading(true);
    const carNames = vehicles.map(v => `${v.manufacturer_name} ${v.model_name}`).join(' vs ');
    const prompt = locale === 'it'
      ? `Esegui un confronto diretto collezionistico e di investimento tra: ${carNames}. Valuta liquida d'asta, mantenimento del valore e prospettiva a 5 anni.`
      : `Provide a head-to-head collector and investment comparison between: ${carNames}. Analyze auction liquidity, value retention, and 5-year outlook.`;

    const res = await askAiAdvisor(prompt, locale);
    setAiSynthesis(res.answer);
    setAiLoading(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-red-400 mb-1">
            <Scale className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Multidimensional Head-to-Head</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">{t.compare_vehicles_title}</h1>
          <p className="text-xs text-slate-400">
            Compare up to 4 vehicles on performance metrics, investment scores, and market valuation trends.
          </p>
        </div>

        {vehicles.length >= 2 && (
          <button
            onClick={handleRunAiHeadToHead}
            disabled={aiLoading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-red-600/20 cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>{aiLoading ? 'Running AI Analysis...' : 'AI Head-to-Head Synthesis'}</span>
          </button>
        )}
      </div>

      {/* AI Synthesis Box */}
      {aiSynthesis && (
        <div className="bg-gradient-to-r from-[#171c2c] to-[#121624] p-5 rounded-2xl border border-red-500/30 text-xs text-slate-200 leading-relaxed space-y-2">
          <div className="font-bold text-red-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>AI Head-to-Head Evaluation</span>
          </div>
          <p>{aiSynthesis}</p>
        </div>
      )}

      {/* Comparison Matrix Table */}
      <div className="bg-[#121520] rounded-2xl border border-[#23293a] overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-200 border-collapse">
          <thead>
            <tr className="border-b border-[#23293a]">
              <th className="p-4 w-48 text-slate-400 uppercase text-[10px] tracking-wider bg-[#161a28]">
                Comparison Metrics
              </th>
              {vehicles.map(car => (
                <th key={car.id} className="p-4 min-w-[220px] bg-[#121520]">
                  <div className="space-y-2">
                    <div className="relative h-28 rounded-lg overflow-hidden bg-slate-900">
                      <img src={car.hero_image_url} alt="" className="w-full h-full object-cover" />
                      {compareIds.includes(car.id) && (
                        <button
                          onClick={() => onRemoveCompare(car.id)}
                          className="absolute top-2 right-2 p-1 bg-black/60 rounded-full hover:bg-rose-600 transition-colors text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div>
                      <div className="text-[10px] text-red-400 font-bold uppercase">{car.manufacturer_name}</div>
                      <div className="text-sm font-extrabold text-white">{car.model_name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{car.variant_name}</div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#1e2434]">
            {/* Price */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-[#161a28]">{t.median_price}</td>
              {vehicles.map(c => (
                <td key={c.id} className="p-4 font-bold text-white font-mono-numbers text-sm">
                  €{c.current_median_price_eur.toLocaleString()}
                </td>
              ))}
            </tr>

            {/* 1Y Price Trend */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-[#161a28]">1Y Price Trend (YoY)</td>
              {vehicles.map(c => (
                <td key={c.id} className="p-4 font-bold text-emerald-400 font-mono-numbers">
                  +{c.price_change_1y_pct}%
                </td>
              ))}
            </tr>

            {/* Collector Score */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-[#161a28]">{t.collector_score}</td>
              {vehicles.map(c => (
                <td key={c.id} className="p-4 font-bold text-red-400 font-mono-numbers text-sm">
                  {c.scores.collector_score.overall_score} / 100
                </td>
              ))}
            </tr>

            {/* Investment Score */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-[#161a28]">{t.investment_score}</td>
              {vehicles.map(c => (
                <td key={c.id} className="p-4 font-bold text-emerald-400 font-mono-numbers text-sm">
                  {c.scores.investment_score.overall_score} / 100
                </td>
              ))}
            </tr>

            {/* Power */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-[#161a28]">Max Power Output</td>
              {vehicles.map(c => (
                <td key={c.id} className="p-4 font-mono-numbers font-medium text-white">
                  {c.engine.power_hp} HP ({c.engine.displacement_cc} cc)
                </td>
              ))}
            </tr>

            {/* Acceleration */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-[#161a28]">0-100 km/h (0-62 mph)</td>
              {vehicles.map(c => (
                <td key={c.id} className="p-4 font-mono-numbers font-medium text-white">
                  {c.specs.acceleration_0_100} s
                </td>
              ))}
            </tr>

            {/* Top Speed */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-[#161a28]">Top Speed</td>
              {vehicles.map(c => (
                <td key={c.id} className="p-4 font-mono-numbers font-medium text-white">
                  {c.specs.top_speed_kph} km/h
                </td>
              ))}
            </tr>

            {/* Production Units */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-[#161a28]">Total Production</td>
              {vehicles.map(c => (
                <td key={c.id} className="p-4 font-mono-numbers font-medium text-white">
                  {c.production_total ? `${c.production_total} units` : 'N/A'}
                </td>
              ))}
            </tr>

            {/* Annual Maintenance Budget */}
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-[#161a28]">Est. Annual Maintenance</td>
              {vehicles.map(c => (
                <td key={c.id} className="p-4 font-mono-numbers font-medium text-red-300">
                  €{c.annual_est_maintenance_eur.toLocaleString()} / yr
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
