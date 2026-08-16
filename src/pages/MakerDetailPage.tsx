import React, { useMemo } from 'react';
import { ArrowRight, User } from 'lucide-react';
import { catalogueRepository } from '../services/catalogueRepository';

interface MakerDetailPageProps {
  makerSlug: string;
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export const MakerDetailPage: React.FC<MakerDetailPageProps> = ({ makerSlug, onNavigate }) => {
  const maker = useMemo(() => catalogueRepository.getMakerBySlug(makerSlug), [makerSlug]);
  const models = useMemo(() => maker ? catalogueRepository.getModelsByMaker(maker.slug) : [], [maker]);
  const relatedPeople = useMemo(() => maker ? catalogueRepository.getPeopleByMaker(maker.slug) : [], [maker]);

  if (!maker) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h2 className="text-xl font-medium text-trg-carbon mb-2">Maker Not Found</h2>
        <p className="text-trg-gray-500 mb-6 text-sm">We couldn't find the requested manufacturer in our current catalogue.</p>
        <button 
          onClick={() => onNavigate('home')}
          className="text-xs uppercase tracking-widest font-semibold text-trg-gray-500 hover:text-trg-carbon transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
      {/* Breadcrumb */}
      <nav className="mb-10 lg:mb-16">
        <ol className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-trg-gray-400">
          <li>
            <a 
              href="/"
              onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
              className="hover:text-trg-carbon transition-colors"
            >
              Home
            </a>
          </li>
          <li><span className="text-gray-300">/</span></li>
          <li>
            <span>Brands</span>
          </li>
          <li><span className="text-gray-300">/</span></li>
          <li className="text-trg-carbon font-semibold">
            {maker.canonical_name}
          </li>
        </ol>
      </nav>

      {/* Maker Identity */}
      <div className="flex flex-row items-center gap-4 md:gap-6 lg:gap-10 mb-12">
        {maker.logo_url ? (
          <div className="w-[70px] md:w-32 flex-shrink-0">
            <img 
              src={maker.logo_url} 
              alt={maker.canonical_name}
              className="w-full h-auto object-contain mix-blend-multiply"
            />
          </div>
        ) : null}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-trg-red">
              Maker
            </span>
            {maker.active && (
              <span className="text-[10px] uppercase tracking-widest text-trg-gray-400 border border-gray-200 px-2 py-0.5 rounded-sm">
                Active
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-trg-carbon tracking-tight mb-1">
            {maker.canonical_name}
          </h1>
          {maker.official_name && (
            <p className="text-trg-gray-500 text-lg font-light">
              {maker.official_name}
            </p>
          )}
        </div>
      </div>

      {/* Intro & Metadata */}
      <div className="mb-16">
        <p className="text-sm text-trg-gray-500 italic mb-8">
          Data currently under research.
        </p>

        {/* Compact Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-t border-b border-gray-200 py-6">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Country</div>
            <div className="text-sm text-trg-carbon font-medium">{maker.country_code || '—'}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Founded</div>
            <div className="text-sm text-trg-carbon font-medium">{maker.founded_year || '—'}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Status</div>
            <div className="text-sm text-trg-carbon font-medium">{maker.active ? 'Active' : 'Defunct'}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Models</div>
            <div className="text-sm text-trg-carbon font-medium">{models.length}</div>
          </div>
        </div>
      </div>

      {/* People Behind the Maker */}
      {relatedPeople.length > 0 && (
        <section className="mb-16">
          <h2 className="text-[10px] uppercase tracking-widest text-gray-400 mb-6 font-semibold">People Behind the Maker</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedPeople.map(person => (
              <a 
                key={person.slug}
                href={`/people/${person.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('person', { personSlug: person.slug });
                }}
                className="group flex items-center gap-4 p-3 border border-gray-200 bg-white hover:border-gray-300 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-50 flex-shrink-0 border border-gray-100 overflow-hidden">
                  {person.portrait_url ? (
                    <img 
                      src={person.portrait_url} 
                      alt={person.canonical_name} 
                      className="w-full h-full object-cover mix-blend-multiply filter grayscale group-hover:grayscale-0 transition-all duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-trg-carbon truncate">{person.canonical_name}</h3>
                  <div className="text-[10px] text-trg-gray-500 uppercase tracking-widest mt-0.5 truncate">
                    {person.roles.slice(0, 2).join(' · ')}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-trg-carbon transition-colors transform group-hover:translate-x-1 flex-shrink-0 mr-1" />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Models Directory */}
      {models.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-trg-carbon">
            <h2 className="text-[10px] uppercase tracking-widest font-semibold text-trg-carbon">Models</h2>
            <span className="text-[10px] uppercase tracking-widest text-trg-gray-400">
              {models.length === 1 ? '1 Model' : `${models.length} Models`}
            </span>
          </div>

          <div className="flex flex-col border border-gray-200 bg-white">
            {/* Desktop Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
              <div className="col-span-5">Model</div>
              <div className="col-span-4">Production</div>
              <div className="col-span-2 text-right">Generations</div>
              <div className="col-span-1"></div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100">
              {models.map(model => {
                const generationCount = catalogueRepository.getGenerationsByModel(model.id).length;
                return (
                  <a
                    key={model.id}
                    href={`/cars/${maker.slug}/${model.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('model', { makerSlug: maker.slug, modelSlug: model.slug });
                    }}
                    className="group block px-4 py-4 md:py-3 hover:bg-gray-50 transition-colors"
                  >
                    {/* Desktop View */}
                    <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 text-sm font-medium text-trg-carbon truncate">
                        {model.canonical_name}
                      </div>
                      <div className="col-span-4 text-xs text-trg-gray-500">
                        {model.introduced_year || 'Unknown'} — {model.discontinued_year || 'Present'}
                      </div>
                      <div className="col-span-2 text-xs text-trg-gray-500 text-right">
                        {generationCount}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-trg-carbon transition-colors transform group-hover:translate-x-1" />
                      </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden flex items-center justify-between">
                      <div className="flex-1 min-w-0 pr-4">
                        <h3 className="text-sm font-medium text-trg-carbon truncate mb-1">
                          {model.canonical_name}
                        </h3>
                        <div className="text-[11px] text-trg-gray-500">
                          {model.introduced_year || 'Unknown'} — {model.discontinued_year || 'Present'} · {generationCount} {generationCount === 1 ? 'generation' : 'generations'}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-trg-carbon transition-colors transform group-hover:translate-x-1 flex-shrink-0" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
