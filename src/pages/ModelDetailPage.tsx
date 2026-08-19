import React, { useState, useEffect } from 'react';
import { catalogueRepository } from '../services/catalogueRepository';
import { ChevronRight } from 'lucide-react';
import { Maker, Model, Generation } from '../types';
import { EntityIntroLayout } from '../components/EntityIntroLayout';

interface ModelDetailPageProps {
  makerSlug: string;
  modelSlug: string;
  onNavigate: (page: string, params?: any) => void;
}

const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [error, setError] = React.useState(false);
  const handleError = () => setError(true);
  
  if (error || !src) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center text-gray-400 text-xs tracking-wide uppercase ${className}`}>
        No image available
      </div>
    );
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={handleError}
      loading="lazy"
    />
  );
};

const normalizeOrdinal = (name: string) => {
  if (name.startsWith('1th')) return name.replace('1th', '1st');
  if (name.startsWith('2th')) return name.replace('2th', '2nd');
  if (name.startsWith('3th')) return name.replace('3th', '3rd');
  return name;
};

export function ModelDetailPage({ makerSlug, modelSlug, onNavigate }: ModelDetailPageProps) {
  const [maker, setMaker] = useState<Maker | null>(null);
  const [model, setModel] = useState<Model | null>(null);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      setLoading(true);
      try {
        const [mk, md] = await Promise.all([
          catalogueRepository.getMakerBySlug(makerSlug),
          catalogueRepository.getModelBySlug(makerSlug, modelSlug)
        ]);
        let gens: Generation[] = [];
        if (md) {
          gens = await catalogueRepository.getGenerationsByModel(md.id);
          gens.sort((a, b) => (a.production_start || 0) - (b.production_start || 0));
        }
        if (!cancelled) {
          setMaker(mk);
          setModel(md);
          setGenerations(gens);
        }
      } catch (e) {
        if (!cancelled) {
          setMaker(null);
          setModel(null);
          setGenerations([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    loadData();
    return () => {
      cancelled = true;
    };
  }, [makerSlug, modelSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center text-gray-500 font-mono text-sm uppercase tracking-wider">
        Loading Model Details...
      </div>
    );
  }

  if (!model || !maker) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center text-gray-500">
        Model not found
      </div>
    );
  }

  // Derived properties
  const startYear = model.introduced_year || generations[0]?.production_start;
  const endYear = model.discontinued_year ? model.discontinued_year : 'Present';
  const productionRange = startYear ? `${startYear} — ${endYear}` : '';

  return (
    <div className="bg-[#F7F7F5] min-h-screen text-[#171A1F] pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        
        <EntityIntroLayout
          breadcrumb={
            <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-widest text-gray-500 font-medium">
              <a 
                href="/"
                onClick={(e) => {
                  if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  onNavigate('home');
                }}
                className="hover:text-gray-900 transition-colors"
              >
                Home
              </a>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <a 
                href={`/brands/${maker.slug}`}
                onClick={(e) => {
                  if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  onNavigate('brands', maker.slug);
                }}
                className="hover:text-gray-900 transition-colors"
              >
                {maker.canonical_name}
              </a>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-900">{model.canonical_name}</span>
            </nav>
          }
          identity={
            <header className="mb-2">
              <div className="text-xs font-bold tracking-widest uppercase text-[#D71920] mb-3">
                {maker.canonical_name}
              </div>
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#0B0D10] mb-2">
                {model.canonical_name}
              </h1>
              {productionRange && (
                <div className="text-sm tracking-wide text-gray-500 font-mono">
                  {productionRange}
                </div>
              )}
            </header>
          }
          primaryMedia={
            model.hero_image_url ? (
              <div className="w-full aspect-[16/9] max-h-[320px] bg-white border border-gray-100 rounded-sm overflow-hidden flex items-center justify-center">
                <ImageWithFallback 
                   src={model.hero_image_url} 
                   alt={`${maker.canonical_name} ${model.canonical_name}`}
                  className="w-full h-full object-contain mix-blend-multiply p-2"
                />
              </div>
            ) : null
          }
          content={
            <>
              <section className="prose prose-sm md:prose-base text-gray-600 mb-10 max-w-none">
                <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-semibold">Overview</h2>
                <p className="leading-relaxed">
                  Honda Civic is one of the most important global compact cars ever produced. Introduced in 1972, it evolved across eleven generations into a reference point for efficiency, everyday usability, engineering accessibility, and enthusiast culture. Depending on the era and market, the Civic has ranged from lightweight economy car to performance icon, making it a key model in the modern automotive landscape.
                </p>
              </section>

              <section className="border-t border-gray-200 pt-8">
                <h2 className="text-xs uppercase tracking-widest text-gray-400 mb-6 font-semibold">Key Facts</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-sm">
                  <div>
                    <dt className="text-gray-400 text-[10px] uppercase tracking-widest mb-1.5">Manufacturer</dt>
                    <dd className="font-medium text-[#171A1F]">
                      <a 
                        href={`/brands/${maker.slug}`}
                        onClick={(e) => {
                          if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
                          e.preventDefault();
                          onNavigate('brands', maker.slug);
                        }}
                        className="hover:text-[#D71920] transition-colors focus:outline-none focus:underline"
                      >
                        {maker.canonical_name}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-400 text-[10px] uppercase tracking-widest mb-1.5">Production</dt>
                    <dd className="font-medium text-[#171A1F]">{productionRange}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400 text-[10px] uppercase tracking-widest mb-1.5">Generations</dt>
                    <dd className="font-medium text-[#171A1F]">{generations.length}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400 text-[10px] uppercase tracking-widest mb-1.5">Category</dt>
                    <dd className="font-medium text-[#171A1F]">Compact Car</dd>
                  </div>
                  <div>
                    <dt className="text-gray-400 text-[10px] uppercase tracking-widest mb-1.5">Status</dt>
                    <dd className="font-medium text-amber-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Under Research
                    </dd>
                  </div>
                  <div className="sm:col-span-2 mt-2">
                    <dt className="text-gray-400 text-[10px] uppercase tracking-widest mb-3">Searchable Codes</dt>
                    <dd className="flex flex-wrap gap-2">
                      {['EK', 'EG', 'EF', 'FD', 'FK', 'FL'].map(code => {
                         const matchingGens = generations.filter(gen => gen.generation_code?.includes(code));
                         if (matchingGens.length === 1) {
                           const resolvedGen = matchingGens[0];
                           return (
                             <a key={code} href={`/cars/${maker.slug}/${model.slug}/${resolvedGen.slug}`} onClick={(e) => { if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return; e.preventDefault(); onNavigate('generation', `${maker.slug}/${model.slug}/${resolvedGen.slug}`); }} className="px-2.5 py-1 bg-white text-gray-600 hover:text-[#D71920] font-mono text-[11px] rounded-sm border border-gray-200 hover:border-[#D71920] shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[#D71920] inline-block" title={`View ${resolvedGen.canonical_name}`} >
                               {code}</a>
                           );
                         }
                         
                         return (
                           <span key={code} className="px-2.5 py-1 bg-white text-gray-600 font-mono text-[11px] rounded-sm border border-gray-200 shadow-sm cursor-default" title={matchingGens.length > 1 ? 'Ambiguous code (multiple generations)' : undefined}>
                             {code}
                           </span>
                         );
                      })}
                    </dd>
                  </div>
                </dl>
              </section>
            </>
          }
        />
        
        {/* Generations Section */}
        <section className="mb-24">
          <div className="mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-light tracking-tight text-[#0B0D10]">
              Generations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generations.map((gen) => {
              const genStart = gen.production_start || '';
              const genEnd = gen.production_end ? gen.production_end : (gen.production_start ? 'Present' : '');
              const genYears = genStart ? `${genStart}${genEnd ? '—' + genEnd : ''}` : '';
              
              return (
                <a
                  key={gen.id}
                  href={`/cars/${maker.slug}/${model.slug}/${gen.slug}`}
                  onClick={(e) => {
                    if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
                    e.preventDefault();
                    onNavigate('generation', `${maker.slug}/${model.slug}/${gen.slug}`);
                  }}
                  className="group flex flex-col items-start text-left bg-white p-4 rounded-sm border border-transparent shadow-sm hover:border-gray-200 hover:shadow-md transition-all duration-200 h-full"
                >
                  <div className="w-full aspect-[16/9] bg-gray-50 mb-4 overflow-hidden rounded-sm relative shrink-0">
                    <ImageWithFallback 
                      src={gen.hero_image_url || ''} 
                      alt={gen.canonical_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col flex-1 w-full justify-between">
                    <div>
                      <h3 className="text-base font-medium text-[#171A1F] mb-1 group-hover:text-[#D71920] transition-colors line-clamp-1">
                        {normalizeOrdinal(gen.canonical_name)}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center w-full mt-4 pt-4 border-t border-gray-50">
                      <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded-sm">
                        {gen.generation_code || gen.slug.toUpperCase()}
                      </span>
                      {genYears && (
                        <span className="text-[11px] text-gray-400 font-medium">
                          {genYears}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* People Teaser Section */}
        <section className="pt-16 pb-8 border-t border-gray-200">
          <h2 className="text-xl md:text-2xl font-light tracking-tight text-[#0B0D10] mb-8">
            People connected to the {model.canonical_name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-3xl">
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-gray-400 mb-5 font-semibold">Designers</h3>
              <ul className="space-y-4">
                {['Humirou Yoshikawa', 'Kohichi Hirata', 'Daisuke Sawai', 'Jarad Hall', 'Yuki Ishii'].map(person => (
                  <li key={person}>
                    <a href={`/people/${person.toLowerCase().replace(/\s+/g, '-')}`} onClick={(e) => { if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return; e.preventDefault(); onNavigate('person', person.toLowerCase().replace(/\s+/g, '-')); }} className="text-sm font-medium text-[#171A1F] hover:text-[#D71920] transition-colors flex items-center group" >
                      {person}
                      <ChevronRight className="w-3 h-3 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-gray-400 mb-5 font-semibold">Engineers</h3>
              <ul className="space-y-4">
                {['Hiroshi Kizawa', 'Soichiro Honda', 'Mitsuru Kariya', 'Gary Evert', 'Tomoyuki Yamagami'].map(person => (
                  <li key={person}>
                    <a href={`/people/${person.toLowerCase().replace(/\s+/g, '-')}`} onClick={(e) => { if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return; e.preventDefault(); onNavigate('person', person.toLowerCase().replace(/\s+/g, '-')); }} className="text-sm font-medium text-[#171A1F] hover:text-[#D71920] transition-colors flex items-center group" >
                      {person}
                      <ChevronRight className="w-3 h-3 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a></li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
export default ModelDetailPage;
