import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart2, 
  PieChart as PieIcon, 
  DollarSign, 
  Globe, 
  Award, 
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  Calendar,
  MapPin,
  ExternalLink,
  ChevronRight,
  Filter,
  Car
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { HERO_VEHICLES, MANUFACTURERS } from '../data/catalogData';
import { UPCOMING_AUCTIONS } from '../data/entitiesData';
import { Locale, translations } from '../data/translations';

interface MarketIntelligencePageProps {
  locale: Locale;
  onNavigate: (page: string, slug?: string) => void;
  onSelectVehicle?: (slug: string) => void;
}

export const MarketIntelligencePage: React.FC<MarketIntelligencePageProps> = ({ 
  locale, 
  onNavigate,
  onSelectVehicle 
}) => {
  const t = translations[locale];

  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');

  // Filter vehicles by brand
  const filteredVehicles = selectedBrand === 'all'
    ? HERO_VEHICLES
    : HERO_VEHICLES.filter(v => v.manufacturer_name.toLowerCase() === selectedBrand.toLowerCase());

  const topGainers = [...filteredVehicles].sort((a, b) => b.price_change_1y_pct - a.price_change_1y_pct);
  const topLosers = [...filteredVehicles].sort((a, b) => a.price_change_1y_pct - b.price_change_1y_pct);

  // Aggregate Market trend over 5 years
  const marketTrendData = [
    { year: '2021', indexValue: 100, volumeEurM: 680 },
    { year: '2022', indexValue: 114, volumeEurM: 790 },
    { year: '2023', indexValue: 122, volumeEurM: 840 },
    { year: '2024', indexValue: 128, volumeEurM: 910 },
    { year: '2025', indexValue: 136, volumeEurM: 980 }
  ];

  // Category distribution
  const categoryData = [
    { name: 'Supercar (80s-90s)', value: 45, color: '#d4af37' },
    { name: 'Hypercar', value: 25, color: '#38bdf8' },
    { name: 'Homologation', value: 15, color: '#34d399' },
    { name: 'Youngtimer', value: 15, color: '#f43f5e' }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-[#121520] p-6 lg:p-8 rounded-2xl border border-[#23293a] space-y-3">
        <div className="flex items-center space-x-2 text-emerald-400">
          <TrendingUp className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Market Intelligence & Auction Index</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{t.market_analytics_title}</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Dedicated market intelligence dashboard: analyze Top Gainers and Top Losers by Brand and Model, inspect auction indices, and discover upcoming international auctions and concours events.
        </p>
      </div>

      {/* Core Market KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#121520] p-4 rounded-xl border border-[#23293a]">
          <div className="text-[11px] text-slate-400">HAGI European Composite Index</div>
          <div className="text-2xl font-extrabold text-white font-mono-numbers mt-1">136.4 pts</div>
          <div className="text-[10px] text-emerald-400 mt-1 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +6.2% YOY
          </div>
        </div>

        <div className="bg-[#121520] p-4 rounded-xl border border-[#23293a]">
          <div className="text-[11px] text-slate-400">European Auction Volume (2025)</div>
          <div className="text-2xl font-extrabold text-white font-mono-numbers mt-1">€980 Mio</div>
          <div className="text-[10px] text-red-400 mt-1">RM Sotheby's, Bonhams, Gooding</div>
        </div>

        <div className="bg-[#121520] p-4 rounded-xl border border-[#23293a]">
          <div className="text-[11px] text-slate-400">Average Days on Market</div>
          <div className="text-2xl font-extrabold text-white font-mono-numbers mt-1">42 Days</div>
          <div className="text-[10px] text-slate-400 mt-1">High liquidity on TIER Hero assets</div>
        </div>

        <div className="bg-[#121520] p-4 rounded-xl border border-[#23293a]">
          <div className="text-[11px] text-slate-400">Median Annual Appreciation</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono-numbers mt-1">+8.4% / yr</div>
          <div className="text-[10px] text-emerald-400 mt-1">1985-1995 Supercars leading</div>
        </div>
      </div>

      {/* Brand & Model Filters for Top Gainers / Losers */}
      <section className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222838] pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-red-400">
              <Filter className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">Top Gainers & Losers by Brand & Model</h2>
            </div>
            <p className="text-xs text-slate-400">
              Filter 12-month value changes by selecting your target manufacturer.
            </p>
          </div>

          {/* Brand Selector Dropdown */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-400">Manufacturer:</span>
            <select
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="bg-[#171a26] text-xs text-red-300 font-bold px-3 py-2 rounded-xl border border-[#283248] focus:outline-none focus:border-red-500"
            >
              <option value="all">All Brands ({HERO_VEHICLES.length} Vehicles)</option>
              {MANUFACTURERS.map(m => (
                <option key={m.id} value={m.official_name}>{m.official_name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Selector Gainers vs Losers */}
        <div className="flex space-x-2 border-b border-[#222838]">
          <button
            onClick={() => setActiveTab('gainers')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gainers'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Top Gainers (+ Appreciation)</span>
          </button>

          <button
            onClick={() => setActiveTab('losers')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'losers'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Top Losers (- Depreciation)</span>
          </button>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(activeTab === 'gainers' ? topGainers : topLosers).map((car) => {
            const isGainer = car.price_change_1y_pct >= 0;
            return (
              <div
                key={car.id}
                onClick={() => {
                  if (onSelectVehicle) onSelectVehicle(car.slug);
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
      </section>

      {/* Upcoming Auctions & Events Worldwide */}
      <section className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-5">
        <div className="flex items-center space-x-2 text-red-400">
          <Calendar className="w-5 h-5" />
          <h2 className="text-lg font-bold text-white">Upcoming International Auctions & Events</h2>
        </div>

        <p className="text-xs text-slate-300">
          Official calendar of global auctions and concours d'elegance to inspect or acquire collector vehicles.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {UPCOMING_AUCTIONS.map((auction) => (
            <div
              key={auction.id}
              className="p-5 rounded-xl bg-[#161a26] border border-[#242c3f] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-red-400 font-bold">
                  <span>{auction.startDate} - {auction.endDate}</span>
                  <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">{auction.estimatedLotsCount} LOTS</span>
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{auction.title}</h3>

                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{auction.location} ({auction.organizer})</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#232a3a] flex items-center justify-between text-xs">
                <span className="text-slate-400">Est. Volume: <strong className="text-white">€{auction.expectedVolumeEurM}M</strong></span>
                <button
                  onClick={() => onNavigate('explore')}
                  className="text-red-400 hover:underline font-bold text-[11px] flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Catalog</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Market Growth Chart */}
        <div className="lg:col-span-2 bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-red-400" />
            <span>Catalog Median Value Index Trend (2021-2025)</span>
          </h2>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={marketTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222838" />
                <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#171a26', borderColor: '#2d3548', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="indexValue" stroke="#d4af37" fill="#d4af3722" strokeWidth={3} name="Base 100 Value Index" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie */}
        <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-red-400" />
            <span>Category Distribution</span>
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
            {categoryData.map(c => (
              <div key={c.name} className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </span>
                <span className="font-bold font-mono-numbers">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
