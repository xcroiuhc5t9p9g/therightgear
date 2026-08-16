import React from 'react';
import { ChevronRight, ArrowRight, User } from 'lucide-react';
import { PERSON_FIXTURES } from '../data/uiPeopleFixtures';
import { EntityIntroLayout } from '../components/EntityIntroLayout';

interface PersonPageProps {
  slug: string;
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

export const PersonPage: React.FC<PersonPageProps> = ({ slug, onNavigate }) => {
  const person = PERSON_FIXTURES[slug];

  if (!person) {
    return (
      <div className="bg-[#F7F7F5] min-h-screen text-[#171A1F] pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-widest text-gray-500 font-medium mb-12">
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
            <span className="text-gray-900">People</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-900">{slug}</span>
          </nav>
          
          <div className="w-full bg-white py-20 min-h-[40vh] flex flex-col items-center justify-center border border-gray-200 rounded-sm">
            <User className="w-12 h-12 text-gray-300 mb-4" />
            <h2 className="text-xl font-light tracking-tight text-[#0B0D10] mb-2">Canonical Person Record Pending</h2>
            <p className="text-sm text-gray-500 mb-8">The full biography and relational knowledge graph for {slug} are currently being structured.</p>
            <button onClick={() => onNavigate('home')} className="px-6 py-2 bg-[#0B0D10] text-white rounded-sm font-medium hover:bg-[#171A1F] transition-colors text-sm">
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F7F5] min-h-screen text-[#171A1F] pb-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
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
          <span className="text-gray-900">People</span>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-900">{person.canonical_name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-4">
        
        
        <EntityIntroLayout
          identity={
            <header className="mb-2">
              <div className="flex flex-wrap gap-2 mb-4">
                {person.roles.map((role: string) => (
                  <span key={role} className="text-[10px] font-bold tracking-widest uppercase text-[#D71920] border border-[#D71920]/20 bg-white px-2.5 py-1 rounded-sm shadow-sm">
                    {role}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-[#0B0D10] mb-6">
                {person.canonical_name}
              </h1>
              <section className="prose prose-sm md:prose-base text-gray-600 mb-12 max-w-none">
                <p className="leading-relaxed text-lg">
                  {person.short_profile}
                </p>
              </section>
            </header>
          }
          primaryMedia={
            <div className="w-full aspect-[3/4] max-w-[320px] bg-white p-2 border border-gray-200 shadow-sm rounded-sm flex items-center justify-center">
              <ImageWithFallback 
                src={person.portrait_url} 
                alt={person.canonical_name}
                className="w-full h-full object-cover mix-blend-multiply filter grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          }
          content={
            <div className="space-y-10 border-t border-gray-200 pt-10">
              {person.related_organizations && person.related_organizations.length > 0 && (
                <section>
                  <h2 className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 font-semibold">Related Organizations</h2>
                  <div className="flex flex-col gap-3">
                    {person.related_organizations.map((org: any) => (
                      <a 
                        key={org.slug}
                        href={`/brands/${org.slug}`}
                        onClick={(e) => {
                          if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
                          e.preventDefault();
                          onNavigate('brands', org.slug);
                        }}
                        className="group flex items-center justify-between p-4 bg-white border border-gray-200 shadow-sm rounded-sm hover:border-[#D71920] transition-colors"
                      >
                        <span className="font-medium text-[#171A1F] group-hover:text-[#D71920] transition-colors">{org.canonical_name}</span>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#D71920] transition-colors" />
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {person.related_machines && person.related_machines.length > 0 && (
                <section>
                  <h2 className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 font-semibold">Related Machines</h2>
                  <div className="flex flex-col gap-3">
                    {person.related_machines.map((machine: any) => (
                      <a 
                        key={machine.model_slug}
                        href={`/cars/${machine.maker_slug}/${machine.model_slug}`}
                        onClick={(e) => {
                          if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
                          e.preventDefault();
                          onNavigate('model', { makerSlug: machine.maker_slug, modelSlug: machine.model_slug });
                        }}
                        className="group flex items-center justify-between p-4 bg-white border border-gray-200 shadow-sm rounded-sm hover:border-[#D71920] transition-colors"
                      >
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">{machine.maker}</div>
                          <div className="font-medium text-[#171A1F] group-hover:text-[#D71920] transition-colors">{machine.canonical_name}</div>
                          {(machine.production_range || machine.generations_count) && (
                            <div className="text-xs text-gray-500 mt-2 font-mono">
                              {machine.production_range} {machine.generations_count && `· ${machine.generations_count} Generations`}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#D71920] transition-colors" />
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {person.related_generations && person.related_generations.length > 0 && (
                <section>
                  <h2 className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 font-semibold">Related Generations</h2>
                  <div className="flex flex-col gap-3">
                    {person.related_generations.map((gen: any) => (
                      <a 
                        key={gen.gen_slug}
                        href={`/cars/${gen.maker_slug}/${gen.model_slug}/${gen.gen_slug}`}
                        onClick={(e) => {
                          if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
                          e.preventDefault();
                          onNavigate('generation', `${gen.maker_slug}/${gen.model_slug}/${gen.gen_slug}`);
                        }}
                        className="group flex items-center justify-between p-4 bg-white border border-gray-200 shadow-sm rounded-sm hover:border-[#D71920] transition-colors"
                      >
                        <span className="font-medium text-[#171A1F] group-hover:text-[#D71920] transition-colors">{gen.canonical_name}</span>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#D71920] transition-colors" />
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>
          }
        />

        {/* Explore Related Knowledge */}
        <section className="pt-16 pb-8 border-t border-gray-200">
          <h2 className="text-xl md:text-2xl font-light tracking-tight text-[#0B0D10] mb-8">
            Explore Related Knowledge
          </h2>
          <div className="flex flex-wrap gap-3">
            {person.related_organizations?.map((org: any) => (
              <a 
                key={`explore-${org.slug}`}
                href={`/brands/${org.slug}`}
                onClick={(e) => {
                  if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  onNavigate('brands', org.slug);
                }}
                className="px-4 py-2 bg-white border border-gray-200 shadow-sm text-xs font-medium text-[#171A1F] hover:text-[#D71920] hover:border-[#D71920] rounded-sm transition-colors"
              >
                {org.canonical_name}
              </a>
            ))}
            {person.related_machines?.map((machine: any) => (
              <a 
                key={`explore-${machine.model_slug}`}
                href={`/cars/${machine.maker_slug}/${machine.model_slug}`}
                onClick={(e) => {
                  if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  onNavigate('model', { makerSlug: machine.maker_slug, modelSlug: machine.model_slug });
                }}
                className="px-4 py-2 bg-white border border-gray-200 shadow-sm text-xs font-medium text-[#171A1F] hover:text-[#D71920] hover:border-[#D71920] rounded-sm transition-colors"
              >
                {machine.canonical_name}
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
