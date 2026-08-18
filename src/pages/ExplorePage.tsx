import React, { useState } from 'react';
import { Search, TrendingUp, Calendar, Users, ArrowRight } from 'lucide-react';
import { catalogueRepository } from '../services/catalogueRepository';
import { HeroBlock, SectionHeader, ContentCard, EmptyStatePanel, Container } from '../components/ui-blocks';

interface ExplorePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const makers = catalogueRepository.getMakers();

  return (
    <div className="w-full bg-white">
      {/* 1. HERO */}
      <HeroBlock 
        title="Catalogue"
        subtitle="Explore the global knowledge graph of iconic cars and motorcycles."
      />

      {/* 2. SEARCH PROMPT */}
      <section className="py-12 border-b border-trg-gray-200">
        <Container>
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-trg-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  onNavigate('search-result', { q: query.trim() });
                }
              }}
              placeholder="Search makers, models, generations, variants..."
              className="w-full bg-trg-warm-white text-base text-trg-carbon placeholder-trg-gray-400 pl-12 pr-4 py-4 rounded-xl border border-trg-gray-200 focus:outline-none focus:border-trg-red focus:bg-white transition-all shadow-sm"
            />
          </div>
        </Container>
      </section>

      {/* 3. FEATURED MAKERS */}
      <section className="py-20">
        <Container>
          <SectionHeader title="Makers" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {makers.slice(0, 12).map(maker => (
              <button 
                key={maker.id}
                onClick={() => onNavigate('maker', { makerSlug: maker.slug })}
                className="flex items-center justify-center p-3 sm:p-6 bg-white border border-trg-gray-200 rounded-xl hover:border-trg-gray-400 hover:shadow-sm transition-all text-center min-h-[44px]"
              >
                <span className="font-bold text-base sm:text-lg text-trg-carbon">{maker.canonical_name}</span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. FEATURED MODELS */}
      <section className="py-20 bg-trg-warm-white border-y border-trg-gray-200">
        <Container>
          <SectionHeader title="Featured Models" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <ContentCard 
                key={i}
                tag="Model"
                title={`Highlight Model ${i}`}
                description="This area is reserved for featured vehicles connecting generations and variants."
              />
            ))}
          </div>
        </Container>
      </section>

      {/* 5. & 6. BY CATEGORY & ERA */}
      <section className="py-20">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <SectionHeader title="By Category" />
            <div className="flex flex-wrap gap-3">
              {['Classics', 'Supercars', 'Homologation', 'Limited Editions', 'Youngtimers'].map(cat => (
                <button key={cat} onClick={() => onNavigate('search-result', { q: cat })} className="px-5 py-3 bg-white border border-trg-gray-200 rounded-lg text-trg-carbon font-medium hover:border-trg-gray-400 transition-colors min-h-[44px]">
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <SectionHeader title="By Era" />
            <div className="flex flex-wrap gap-3">
              {['1950s', '1960s', '1970s', '1980s', '1990s', '2000s'].map(era => (
                <button key={era} onClick={() => onNavigate('search-result', { q: era })} className="px-5 py-3 bg-white border border-trg-gray-200 rounded-lg text-trg-carbon font-medium hover:border-trg-gray-400 transition-colors min-h-[44px]">
                  {era}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* 7. DESIGNERS */}
      <section className="py-20 bg-trg-warm-white border-y border-trg-gray-200 text-center">
        <Container>
          <h2 className="text-fluid-h2 font-bold text-trg-carbon tracking-tight mb-8">Designers & Engineers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Marcello Gandini', 'Giorgetto Giugiaro', 'Leonardo Fioravanti', 'Gordon Murray'].map(name => (
              <div key={name} className="flex flex-col items-center justify-center p-3 sm:p-6 bg-white border border-trg-gray-200 rounded-xl min-h-[44px]">
                <Users className="w-6 h-6 text-trg-gray-400 mb-3" />
                <span className="font-bold text-trg-carbon">{name}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 8. MARKET SNAPSHOT PREVIEW */}
      <section className="py-20">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <SectionHeader title="Market Snapshot" />
            <EmptyStatePanel 
              icon={<TrendingUp className="w-8 h-8" />}
              title="Integration in progress"
              description="Market intelligence will be populated here soon."
              action={
                <button onClick={() => onNavigate('market')} className="mt-4 px-6 py-2 bg-white border border-trg-gray-300 rounded-lg text-sm font-medium hover:bg-trg-gray-100 min-h-[44px]">
                  View Market
                </button>
              }
            />
          </div>
          <div>
            <SectionHeader title="Upcoming Events" />
            <EmptyStatePanel 
              icon={<Calendar className="w-8 h-8" />}
              title="Calendars coming soon"
              description="Global auctions and events will be listed here."
            />
          </div>
        </Container>
      </section>
    </div>
  );
};
