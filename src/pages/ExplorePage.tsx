import React from 'react';
import { Search, Filter, TrendingUp, Calendar, Users, Grid, Database, GitMerge, ArrowRight } from 'lucide-react';
import { catalogueRepository } from '../services/catalogueRepository';

interface ExplorePageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onNavigate }) => {
  const makers = catalogueRepository.getMakers();

  return (
    <div className="w-full flex flex-col bg-trg-warm-white">
      {/* 1. HERO */}
      <section className="bg-white border-b border-trg-gray-200 py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 w-full">
          <p className="text-sm font-semibold tracking-widest text-trg-gray-400 uppercase mb-4">Explore</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-trg-carbon mb-6">
            Find a car. Follow its story.
          </h1>
          <p className="text-lg text-trg-gray-500 max-w-3xl mb-10">
            Explore significant automobiles from around the world through engineering, history, market context, people and connections.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-trg-gray-400" />
              <input
                type="text"
                placeholder="Search maker, model, generation or variant"
                className="w-full bg-white text-base text-trg-carbon placeholder-trg-gray-400 pl-12 pr-4 py-3.5 rounded-xl border border-trg-gray-300 shadow-sm focus:outline-none focus:border-trg-red focus:ring-2 focus:ring-trg-red/10 transition-all"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-trg-gray-100 hover:bg-trg-gray-200 text-trg-carbon font-medium rounded-xl transition-colors whitespace-nowrap">
              <Filter className="w-4 h-4" /> Advanced Search
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 w-full py-16 space-y-24">
        
        {/* 1. Market Movers */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-trg-carbon tracking-tight mb-2">Market Movers</h2>
              <p className="text-trg-gray-500">Track recent valuation changes.</p>
            </div>
            <button onClick={() => onNavigate('market')} className="text-sm font-medium text-trg-carbon hover:text-trg-red flex items-center gap-1 group">
              View Market Intelligence <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="bg-white rounded-xl border border-trg-gray-200 p-10 text-center flex flex-col items-center justify-center min-h-[200px]">
            <TrendingUp className="w-8 h-8 text-trg-gray-300 mb-3" />
            <p className="text-trg-carbon font-medium">Market data integration in progress.</p>
          </div>
        </section>

        {/* 2. Explore by Maker */}
        <section>
          <h2 className="text-2xl font-bold text-trg-carbon tracking-tight mb-2">Explore by Maker</h2>
          <p className="text-trg-gray-500 mb-8">Browse the global catalogue by manufacturer.</p>
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

        {/* 3. Explore by Era */}
        <section>
          <h2 className="text-2xl font-bold text-trg-carbon tracking-tight mb-2">Explore by Era</h2>
          <p className="text-trg-gray-500 mb-8">Discover vehicles from specific decades.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', 'Modern Icons'].map(era => (
              <button 
                key={era}
                className="py-4 px-2 text-center rounded-lg bg-white border border-trg-gray-200 hover:border-trg-gray-400 text-trg-carbon font-medium transition-all"
              >
                {era}
              </button>
            ))}
          </div>
        </section>

        {/* 4. Explore by Category */}
        <section>
          <h2 className="text-2xl font-bold text-trg-carbon tracking-tight mb-2">Explore by Category</h2>
          <p className="text-trg-gray-500 mb-8">Browse by vehicle classification.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Classics', 'Youngtimers', 'Supercars', 'Hypercars', 'Homologation Specials', 'Limited Editions', 'Future Classics', 'Motorsport-derived Road Cars'].map(cat => (
              <button 
                key={cat}
                className="flex flex-col p-6 bg-white border border-trg-gray-200 rounded-xl hover:border-trg-gray-400 hover:shadow-sm transition-all text-left"
              >
                <span className="font-bold text-lg text-trg-carbon">{cat}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 5. Auctions & Events */}
        <section>
          <h2 className="text-2xl font-bold text-trg-carbon tracking-tight mb-2">Auctions & Events</h2>
          <p className="text-trg-gray-500 mb-8">Global auction and event intelligence.</p>
          <div className="bg-white rounded-xl border border-trg-gray-200 p-10 text-center flex flex-col items-center justify-center min-h-[200px]">
            <Calendar className="w-8 h-8 text-trg-gray-300 mb-3" />
            <p className="text-trg-carbon font-medium">Event intelligence is currently being integrated.</p>
          </div>
        </section>

        {/* 6. Designers & Engineers */}
        <section>
          <h2 className="text-2xl font-bold text-trg-carbon tracking-tight mb-2">Designers & Engineers</h2>
          <p className="text-trg-gray-500 mb-8">Discover the people whose ideas shaped the cars that matter.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="bg-white border border-trg-gray-200 rounded-xl p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-trg-gray-100 mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-trg-gray-300" />
                </div>
                <h3 className="font-bold text-trg-carbon">Person Name</h3>
                <p className="text-sm text-trg-gray-500">Role / Active Period</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Curated Collections */}
        <section>
          <h2 className="text-2xl font-bold text-trg-carbon tracking-tight mb-2">Curated Collections</h2>
          <p className="text-trg-gray-500 mb-8">Editorial selections of significant vehicles.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Homologation Heroes', 'Analogue Supercars', 'The Turbo Era'].map(collection => (
              <button key={collection} className="group relative aspect-[16/9] rounded-xl overflow-hidden border border-trg-gray-200 flex items-center justify-center bg-trg-graphite">
                <div className="absolute inset-0 bg-trg-carbon/40 group-hover:bg-trg-carbon/20 transition-all z-10"></div>
                <h3 className="relative z-20 text-white font-bold text-2xl px-6 text-center">{collection}</h3>
              </button>
            ))}
          </div>
        </section>

        {/* 8. Explore its DNA */}
        <section>
          <div className="bg-trg-graphite text-white rounded-2xl p-12 text-center border border-trg-carbon">
            <GitMerge className="w-12 h-12 text-trg-gray-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Explore its DNA</h2>
            <p className="text-trg-gray-400 max-w-2xl mx-auto mb-8">
              Navigate the complete automotive knowledge graph to discover relationships between entities.
            </p>
            <button className="px-6 py-3 bg-white text-trg-carbon font-semibold rounded-lg hover:bg-trg-gray-100 transition-colors">
              Launch Graph Explorer
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
