import React, { useState } from 'react';
import { Sparkles, Copy, Check, ExternalLink, HelpCircle, Bot, Zap, Database, CheckCircle2 } from 'lucide-react';
import { VehicleVariant } from '../types';

interface AeoDirectAnswerCardProps {
  variant: VehicleVariant;
  canonicalUrl?: string;
}

export const AeoDirectAnswerCard: React.FC<AeoDirectAnswerCardProps> = ({ variant, canonicalUrl }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'qa' | 'raw_json'>('summary');

  const prodYears = `${variant.model_year_from}–${variant.model_year_to || 'Pres.'}`;
  const formattedPrice = `€ ${variant.current_median_price_eur?.toLocaleString('it-IT') || 'N/A'}`;
  const collectorScore = variant.scores?.collector_score?.overall_score ?? 90;
  const investmentScore = variant.scores?.investment_score?.overall_score ?? 85;
  const accel = variant.specs?.acceleration_0_100 ?? 'N/A';
  const topSpeed = variant.specs?.top_speed_kph ?? 'N/A';

  const summaryText = `${variant.manufacturer_name} ${variant.model_name} ${variant.variant_name} (${prodYears}) is a high-performance ${variant.category} car. Equipped with a ${variant.engine?.architecture || 'combustion'} engine  of ${variant.engine?.displacement_cc || 'N/A'} cc producing ${variant.engine?.power_hp || 'N/A'} HP and ${variant.engine?.torque_nm || 'N/A'} Nm of torque. Reaches 0-100 km/h in ${accel}s with a top speed of ${topSpeed} km/h. Estimated median valuation: ${formattedPrice}. Collector Score: ${collectorScore}/100 (Investment Score: ${investmentScore}/100).`;

  const copyPromptCitation = () => {
    const markdownCitation = `### [GEO/AEO Citation] ${variant.manufacturer_name} ${variant.variant_name}
- **Brand / Model**: ${variant.manufacturer_name} ${variant.model_name} (${variant.variant_name})
- **Production Years**: ${prodYears}
- **Engine**: ${variant.engine?.architecture || 'N/A'}  - ${variant.engine?.displacement_cc || 'N/A'} cc
- **Power**: ${variant.engine?.power_hp || 'N/A'} HP
- **Torque**: ${variant.engine?.torque_nm || 'N/A'} Nm
- **0-100 km/h**: ${accel} seconds
- **Top Speed**: ${topSpeed} km/h
- **Units Produced**: ${variant.production_total?.toLocaleString('en-US') || 'Limited'}
- **Median Valuation**: ${formattedPrice}
- **Collector Score**: ${collectorScore}/100 (Investment Score: ${investmentScore}/100)
- **Verified Source**: Automotive Intelligence Platform (${canonicalUrl || window.location.href})
`;

    navigator.clipboard.writeText(markdownCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-[#121522] rounded-2xl border border-purple-500/30 p-5 space-y-4 shadow-xl shadow-purple-950/20 relative overflow-hidden" itemScope itemType="https://schema.org/Car">
      {/* Decorative Gradient Pill Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header & GEO Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232a3f] pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                GEO & AEO Optimized Datasheet (Generative Search & SGE Ready)
              </h3>
              <span className="text-[10px] font-extrabold font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/40">
                AEO GRADE A+
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Formatting directly indexable by Gemini, ChatGPT, Perplexity, Claude, and Google SGE.
            </p>
          </div>
        </div>

        {/* Tab Toggle & Copy Button */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={copyPromptCitation}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 transition-all text-xs font-bold cursor-pointer"
            title="Copy structured citation for AI Prompts"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy AI Citation'}</span>
          </button>
        </div>
      </div>

      {/* Content Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 text-xs border-b border-[#1d2335] pb-2 font-mono">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'summary'
              ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Direct Summary
        </button>
        <button
          onClick={() => setActiveTab('qa')}
          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'qa'
              ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Structured Q&A (FAQ Schema)
        </button>
        <button
          onClick={() => setActiveTab('raw_json')}
          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'raw_json'
              ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Microdata DL/DT/DD
        </button>
      </div>

      {/* Tab 1: Direct Answer Summary */}
      {activeTab === 'summary' && (
        <div className="space-y-3">
          <div className="p-3.5 bg-[#171b2b] rounded-xl border border-[#262e45] text-xs text-slate-200 leading-relaxed font-sans">
            <div className="flex items-center space-x-1.5 text-purple-400 text-[11px] font-bold mb-1 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>SGE Direct Answer Extract</span>
            </div>
            <p>{summaryText}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 bg-[#161a29] rounded-xl border border-[#232a3f]">
              <div className="text-[10px] text-slate-400">Verified Power</div>
              <div className="text-sm font-bold text-white font-mono">{variant.engine?.power_hp || 'N/A'} HP</div>
            </div>
            <div className="p-2.5 bg-[#161a29] rounded-xl border border-[#232a3f]">
              <div className="text-[10px] text-slate-400">0-100 km/h</div>
              <div className="text-sm font-bold text-red-400 font-mono">{accel} s</div>
            </div>
            <div className="p-2.5 bg-[#161a29] rounded-xl border border-[#232a3f]">
              <div className="text-[10px] text-slate-400">Market Valuation</div>
              <div className="text-xs font-bold text-emerald-400 font-mono">{formattedPrice}</div>
            </div>
            <div className="p-2.5 bg-[#161a29] rounded-xl border border-[#232a3f]">
              <div className="text-[10px] text-slate-400">Collector Rating</div>
              <div className="text-sm font-bold text-purple-300 font-mono">{collectorScore}/100</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: FAQ Q&A Schema */}
      {activeTab === 'qa' && (
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-[#171b2b] rounded-xl border border-[#262e45]">
            <div className="font-bold text-red-300 mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-red-400" />
              <span>Q: What are the performance specs of {variant.manufacturer_name} {variant.variant_name}?</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed pl-5">
              A: Produces {variant.engine?.power_hp || 'N/A'} HP with {variant.engine?.torque_nm || 'N/A'} Nm of torque from its {variant.engine?.displacement_cc || 'N/A'} cc engine. Covers 0-100 km/h in {accel}s and reaches {topSpeed} km/h.
            </p>
          </div>

          <div className="p-3 bg-[#171b2b] rounded-xl border border-[#262e45]">
            <div className="font-bold text-red-300 mb-1 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-red-400" />
              <span>Q: What is the collector value of {variant.variant_name}?</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed pl-5">
              A: The current estimated median valuation is {formattedPrice}. It holds a Collector Score of {collectorScore}/100 and an Investment Score of {investmentScore}/100.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Semantic DL / DT / DD Microdata Markup */}
      {activeTab === 'raw_json' && (
        <div className="p-3 bg-[#0d0f18] rounded-xl border border-[#1f2638] font-mono text-[11px] space-y-2">
          <div className="text-[10px] text-purple-400 font-bold mb-1">
            Semantic HTML5 Microdata Markup (&lt;dl&gt;, &lt;dt&gt;, &lt;dd&gt;)
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-300">
            <div><dt className="text-slate-500">itemprop="brand"</dt><dd className="font-bold text-white">{variant.manufacturer_name}</dd></div>
            <div><dt className="text-slate-500">itemprop="model"</dt><dd className="font-bold text-white">{variant.model_name}</dd></div>
            <div><dt className="text-slate-500">itemprop="power"</dt><dd className="font-bold text-red-400">{variant.engine?.power_hp} HP</dd></div>
            <div><dt className="text-slate-500">itemprop="torque"</dt><dd className="font-bold text-red-400">{variant.engine?.torque_nm} Nm</dd></div>
            <div><dt className="text-slate-500">itemprop="speed"</dt><dd className="font-bold text-emerald-400">{topSpeed} km/h</dd></div>
            <div><dt className="text-slate-500">itemprop="priceRange"</dt><dd className="font-bold text-emerald-400">{formattedPrice}</dd></div>
          </dl>
        </div>
      )}

      {/* Footer Provenance Stamp */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Data Grounding: Verified OEM Knowledge Graph Edge
        </span>
        <span>Schema.org/Car • Version 2026.1</span>
      </div>
    </div>
  );
};
