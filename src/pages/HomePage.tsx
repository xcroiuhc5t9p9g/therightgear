import React, { useState } from 'react';
import { Search, ArrowRight, TrendingUp, Users, GitMerge, FileCheck, Calendar } from 'lucide-react';
import { catalogueRepository } from '../services/catalogueRepository';

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const makers = catalogueRepository.getMakers();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onNavigate('explore');
    }
  };

  return (
    <div className="w-full flex flex-col bg-trg-warm-white">
      {/* 1. HERO */}
      <section className="relative py-24 md:py-32 flex items-center justify-center border-b border-trg-gray-200 bg-white">
        <div className="max-w-[1024px] mx-auto px-4 w-full text-center">
          <p className="text-sm font-semibold tracking-widest text-trg-red uppercase mb-4">Automotive Intelligence</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-trg-carbon mb-6 font-sans">
            Iconic cars. Decoded.
          </h1>
          <p className="text-lg md:text-xl text-trg-gray-500 max-w-2xl mx-auto mb-12">
            Understand the engineering, history, people and market behind the cars that matter.
          </p>
          
          <div className="max-w-xl mx-auto relative group">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-trg-gray-400 group-focus-within:text-trg-red transition-colors" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search maker, model, generation or variant"
                className="w-full bg-white text-base md:text-lg text-trg-carbon placeholder-trg-gray-400 pl-12 pr-4 py-4 rounded-xl border border-trg-gray-300 shadow-sm focus:outline-none focus:border-trg-red focus:ring-4 focus:ring-trg-red/10 transition-all"
              />
              <button type="submit" className="absolute right-3 p-2 bg-trg-carbon hover:bg-trg-graphite text-white rounded-lg transition-colors">
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="text-sm text-trg-gray-500 py-1">Popular:</span>
            {['Ferrari', 'Porsche', 'BMW', 'Lancia'].map(maker => (
              <button 
                key={maker}
                onClick={() => onNavigate('maker', { makerSlug: maker.toLowerCase() })}
                className="text-sm font-medium text-trg-carbon hover:text-trg-red transition-colors px-3 py-1 rounded-full bg-trg-gray-100 hover:bg-trg-red/10"
              >
                {maker}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. EDITOR'S SELECTION */}
      <section className="py-20 md:py-24 max-w-[1440px] mx-auto px-4 md:px-8 w-full">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-trg-carbon tracking-tight mb-3">Editor's Selection</h2>
          <p className="text-lg text-trg-gray-500">A curated starting point into The Right Gear catalogue.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Mocked Editor Selection cards for visual structure */}
          {[
            { maker: 'Ferrari', model: 'F40', variant: 'Non-Cat, Non-Adjust', type: 'Supercars' },
            { maker: 'Porsche', model: '959', variant: 'Komfort', type: 'Supercars' },
            { maker: 'Lancia', model: 'Delta HF Integrale', variant: 'Evoluzione', type: 'Homologation Specials' },
            { maker: 'BMW', model: 'M3', variant: 'Sport Evolution (E30)', type: 'Homologation Specials' }
          ].map((car, idx) => (
            <div key={idx} className="group cursor-pointer flex flex-col bg-white rounded-xl overflow-hidden border border-trg-gray-200 hover:shadow-lg transition-all hover:border-trg-gray-300">
              <div className="aspect-[4/3] bg-trg-gray-100 relative overflow-hidden flex items-center justify-center">
                <span className="text-trg-gray-400 font-medium tracking-widest text-xs uppercase">Media Placeholder</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-trg-red mb-1">{car.maker}</span>
                <h3 className="text-lg font-bold text-trg-carbon mb-1">{car.model}</h3>
                <p className="text-sm text-trg-gray-500 mb-4">{car.variant}</p>
                <div className="mt-auto">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-trg-gray-100 text-xs font-medium text-trg-gray-700">
                    {car.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MARKET PULSE */}
      <section className="py-20 md:py-24 bg-white border-y border-trg-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-trg-carbon tracking-tight mb-3">Market Pulse</h2>
              <p className="text-lg text-trg-gray-500 max-w-2xl">Track how significant collector cars move over time.</p>
            </div>
            <button onClick={() => onNavigate('market')} className="text-trg-carbon hover:text-trg-red font-medium text-sm flex items-center gap-1 group transition-colors">
              Explore Market Intelligence <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Empty State */}
          <div className="bg-trg-warm-white rounded-2xl border border-trg-gray-200 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <TrendingUp className="w-12 h-12 text-trg-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-trg-carbon mb-2">Market intelligence is being connected.</h3>
            <p className="text-trg-gray-500 max-w-md mx-auto mb-6">
              The Right Gear is preparing an evidence-led view of valuations, transactions and market movement.
            </p>
            <button onClick={() => onNavigate('market')} className="px-6 py-2.5 bg-white border border-trg-gray-300 rounded-lg text-trg-carbon font-medium hover:bg-trg-gray-100 transition-colors">
              Explore Market Intelligence
            </button>
          </div>
        </div>
      </section>

      {/* 4. EXPLORE BY MAKER */}
      <section className="py-20 md:py-24 max-w-[1440px] mx-auto px-4 md:px-8 w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-trg-carbon tracking-tight mb-8">Explore by Maker</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {makers.slice(0, 12).map(maker => (
            <button 
              key={maker.id}
              onClick={() => onNavigate('maker', { makerSlug: maker.slug })}
              className="flex items-center justify-center p-6 bg-white border border-trg-gray-200 rounded-xl hover:border-trg-gray-400 hover:shadow-sm transition-all"
            >
              <span className="font-bold text-lg text-trg-carbon">{maker.canonical_name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. EXPLORE BY ERA */}
      <section className="py-20 md:py-24 bg-white border-y border-trg-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-trg-carbon tracking-tight mb-8">Explore by Era</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', 'Modern Icons'].map(era => (
              <button 
                key={era}
                onClick={() => onNavigate('explore')}
                className="py-4 px-2 text-center rounded-lg bg-trg-warm-white border border-trg-gray-200 hover:border-trg-gray-400 hover:bg-white text-trg-carbon font-medium transition-all"
              >
                {era}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EXPLORE BY CATEGORY */}
      <section className="py-20 md:py-24 max-w-[1440px] mx-auto px-4 md:px-8 w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-trg-carbon tracking-tight mb-8">Explore by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Classics', 'Youngtimers', 'Supercars', 'Hypercars', 'Homologation Specials', 'Limited Editions', 'Future Classics', 'Motorsport-derived Road Cars'].map(cat => (
            <button 
              key={cat}
              onClick={() => onNavigate('explore')}
              className="flex flex-col p-6 bg-white border border-trg-gray-200 rounded-xl hover:border-trg-gray-400 hover:shadow-md transition-all text-left"
            >
              <span className="font-bold text-lg text-trg-carbon">{cat}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 7. AUCTIONS & EVENTS */}
      <section className="py-20 md:py-24 bg-trg-graphite text-white border-y border-trg-carbon">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 w-full">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-white">Auctions & Events</h2>
            <p className="text-lg text-trg-gray-400">Where automotive history changes hands — and comes alive.</p>
          </div>
          
          <div className="bg-trg-carbon/50 rounded-2xl border border-trg-gray-700 p-12 text-center flex flex-col items-center justify-center min-h-[250px]">
            <Calendar className="w-12 h-12 text-trg-gray-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Event intelligence is currently being integrated.</h3>
            <p className="text-trg-gray-400">Global auction and event calendars will be available soon.</p>
          </div>
        </div>
      </section>

      {/* 8. PEOPLE */}
      <section className="py-20 md:py-24 max-w-[1440px] mx-auto px-4 md:px-8 w-full">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-trg-carbon tracking-tight mb-3">The people behind the icons.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {['Designers', 'Engineers', 'Entrepreneurs', 'Racing Figures'].map(role => (
            <button key={role} className="flex flex-col items-center justify-center p-12 bg-white border border-trg-gray-200 rounded-2xl hover:border-trg-gray-400 hover:shadow-md transition-all group">
              <Users className="w-8 h-8 text-trg-gray-400 mb-4 group-hover:text-trg-red transition-colors" />
              <h3 className="text-xl font-bold text-trg-carbon">{role}</h3>
            </button>
          ))}
        </div>
      </section>

      {/* 9. EXPLORE ITS DNA */}
      <section className="py-24 md:py-32 bg-trg-carbon text-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm font-semibold tracking-widest text-trg-gray-400 uppercase mb-4">Explore its DNA</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
            Every important car is part of a bigger story.
          </h2>
          <p className="text-lg md:text-xl text-trg-gray-400 mb-10">
            Discover the relationships between cars, generations, engines, people and the ideas that shaped them.
          </p>
          <button onClick={() => onNavigate('explore')} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-trg-carbon hover:bg-trg-gray-100 font-bold rounded-xl transition-colors">
            <GitMerge className="w-5 h-5" /> Explore its DNA
          </button>
        </div>
      </section>

      {/* 10. DATA INTEGRITY */}
      <section className="py-20 md:py-24 max-w-[1440px] mx-auto px-4 md:px-8 w-full text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-trg-carbon tracking-tight mb-16">
          Every fact should know where it came from.
        </h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-16">
          {['Sources', 'Assertions', 'Validation', 'Canonical Knowledge'].map((step, i) => (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-trg-gray-100 flex items-center justify-center mb-4">
                  <FileCheck className="w-6 h-6 text-trg-carbon" />
                </div>
                <span className="font-semibold text-trg-carbon">{step}</span>
              </div>
              {i < 3 && <ArrowRight className="w-6 h-6 text-trg-gray-300 hidden md:block rotate-90 md:rotate-0" />}
            </React.Fragment>
          ))}
        </div>
        
        <button onClick={() => onNavigate('methodology')} className="inline-flex items-center gap-1 text-trg-carbon hover:text-trg-red font-medium group transition-colors">
          Our methodology <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </section>
    </div>
  );
};
