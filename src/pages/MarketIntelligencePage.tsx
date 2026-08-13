import React from 'react';
import { TrendingUp, BarChart3, Search, Activity, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface MarketIntelligencePageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const MarketIntelligencePage: React.FC<MarketIntelligencePageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full flex flex-col bg-trg-warm-white">
      {/* 1. HERO */}
      <section className="bg-white border-b border-trg-gray-200 py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 w-full">
          <p className="text-sm font-semibold tracking-widest text-trg-gray-400 uppercase mb-4">Market Intelligence</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-trg-carbon mb-6">
            Collector Car Market Intelligence
          </h1>
          <p className="text-lg text-trg-gray-500 max-w-3xl mb-10">
            Evidence-led market context for significant automobiles from around the world.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-trg-gray-400" />
              <input
                type="text"
                placeholder="Search vehicles to view market data"
                className="w-full bg-white text-base text-trg-carbon placeholder-trg-gray-400 pl-12 pr-4 py-3.5 rounded-xl border border-trg-gray-300 shadow-sm focus:outline-none focus:border-trg-red focus:ring-2 focus:ring-trg-red/10 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 w-full py-16 space-y-16">
        
        {/* INSUFFICIENT DATA BANNER */}
        <div className="bg-white border border-trg-gray-200 rounded-xl p-8 md:p-12 text-center flex flex-col items-center">
          <TrendingUp className="w-12 h-12 text-trg-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-trg-carbon mb-2">INSUFFICIENT DATA</h2>
          <p className="text-trg-gray-500 max-w-lg mx-auto">
            Market data integrations are currently in development. When complete, this area will provide evidence-led valuations, real transactions, and historical price observation indices.
          </p>
        </div>

        {/* Visual Template Structure (Empty) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-50 pointer-events-none grayscale">
          {/* Market Overview */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-xl font-bold text-trg-carbon mb-4">Market Overview Template</h3>
            <div className="bg-white border border-trg-gray-200 rounded-xl h-64 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-trg-gray-300" />
            </div>
          </div>

          {/* Top Appreciating */}
          <div>
            <h3 className="text-xl font-bold text-trg-carbon mb-4 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-emerald-500" /> Top Appreciating
            </h3>
            <div className="bg-white border border-trg-gray-200 rounded-xl p-6 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center border-b border-trg-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="w-3/4 h-4 bg-trg-gray-100 rounded"></div>
                  <div className="w-1/4 h-4 bg-trg-gray-100 rounded ml-4"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Declining */}
          <div>
            <h3 className="text-xl font-bold text-trg-carbon mb-4 flex items-center gap-2">
              <ArrowDownRight className="w-5 h-5 text-red-500" /> Top Declining
            </h3>
            <div className="bg-white border border-trg-gray-200 rounded-xl p-6 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center border-b border-trg-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="w-3/4 h-4 bg-trg-gray-100 rounded"></div>
                  <div className="w-1/4 h-4 bg-trg-gray-100 rounded ml-4"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Active */}
          <div>
            <h3 className="text-xl font-bold text-trg-carbon mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Most Active
            </h3>
            <div className="bg-white border border-trg-gray-200 rounded-xl p-6 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center border-b border-trg-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="w-3/4 h-4 bg-trg-gray-100 rounded"></div>
                  <div className="w-1/4 h-4 bg-trg-gray-100 rounded ml-4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
