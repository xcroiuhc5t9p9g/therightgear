import React from 'react';
import { ChevronRight, User, Users, Wrench, Flag, ArrowRight } from 'lucide-react';
import { Container } from '../components/ui-blocks';
import { KEY_ENTITIES } from '../data/entitiesData';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
}

const HomeSectionHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-6">
    <div>
      <h2 className="text-[26px] md:text-[32px] font-bold text-trg-carbon tracking-tight leading-tight">{title}</h2>
      {subtitle && <p className="text-sm md:text-base text-trg-gray-500 mt-1">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0 mt-2 sm:mt-0">{action}</div>}
  </div>
);

const HomeEmptyState: React.FC<{ text: string }> = ({ text }) => (
  <div className="w-full bg-trg-warm-white/40 border border-trg-gray-200 rounded-lg py-12 px-6 flex items-center justify-center text-center">
    <span className="text-sm text-trg-gray-500 font-medium">{text}</span>
  </div>
);

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const recentlyAddedPeople = KEY_ENTITIES.filter(
    p => p.entityClass === 'PERSON' &&
         p.roles.some(role => role === 'DESIGNER' || role === 'ENGINEER' || role === 'RACING_FIGURE') &&
         p.publicationStatus === 'PUBLISHED' &&
         p.publishedAt
  ).sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime())
  .slice(0, 4);

  return (
    <div className="w-full bg-white flex flex-col py-8 md:py-12">
      <Container>
        <div className="flex flex-col gap-10 md:gap-14">
          
          {/* 1. MARKET INTELLIGENCE */}
          <section>
            <HomeSectionHeader 
              title="Market Intelligence" 
              subtitle="Validated auction results and financial observations."
              action={
                <button onClick={() => onNavigate('market')} className="text-sm font-bold text-trg-carbon hover:text-trg-red flex items-center gap-1 transition-colors">
                  View Market <ArrowRight className="w-4 h-4" />
                </button>
              }
            />
            <HomeEmptyState text="Market intelligence data is currently under development." />
          </section>

          {/* 2. EVENTS & AUCTIONS */}
          <section className="border-t border-trg-gray-100 pt-10 md:pt-14">
            <HomeSectionHeader 
              title="Events & Auctions" 
              subtitle="Upcoming global automotive events and catalogues."
            />
            <HomeEmptyState text="Official calendars will appear here once the event integration is activated." />
          </section>

          {/* 3. THE PEOPLE BEHIND THE MACHINES */}
          <section className="border-t border-trg-gray-100 pt-10 md:pt-14">
            <HomeSectionHeader 
              title="The People Behind the Machines" 
              subtitle="The designers, engineers, and drivers who shaped automotive history."
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { id: 'designers', role: 'Designers', icon: <Users className="w-5 h-5 text-trg-gray-500 group-hover:text-trg-carbon transition-colors" /> },
                { id: 'engineers', role: 'Engineers', icon: <Wrench className="w-5 h-5 text-trg-gray-500 group-hover:text-trg-carbon transition-colors" /> },
                { id: 'racing', role: 'Racing Figures', icon: <Flag className="w-5 h-5 text-trg-gray-500 group-hover:text-trg-carbon transition-colors" /> }
              ].map(category => (
                <button
                  key={category.id}
                  onClick={() => onNavigate('people-prototype', { category: category.id })}
                  className="bg-white border border-trg-gray-200 rounded-lg p-5 flex flex-row items-center gap-4 hover:border-trg-gray-300 hover:shadow-sm transition-all group text-left"
                >
                  <div className="bg-trg-warm-white p-2.5 rounded-md border border-trg-gray-100 shrink-0">
                    {category.icon}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-base font-bold text-trg-carbon group-hover:text-trg-red transition-colors">{category.role}</h3>
                  </div>
                  <ChevronRight className="w-4 h-4 text-trg-gray-300 group-hover:text-trg-gray-500 transition-colors shrink-0" />
                </button>
              ))}
            </div>
            
            {/* RECENTLY ADDED */}
            <div>
              <h3 className="text-xs font-bold text-trg-gray-500 tracking-wider uppercase mb-4">
                Recently Added
              </h3>
              
              {recentlyAddedPeople.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentlyAddedPeople.map(person => (
                    <button 
                      key={person.id}
                      onClick={() => onNavigate('person', person.slug)}
                      className="bg-white border border-trg-gray-200 rounded-lg p-3 flex flex-row items-center gap-3 hover:border-trg-gray-300 hover:shadow-sm transition-all group text-left"
                    >
                      {person.avatarUrl ? (
                        <img 
                          src={person.avatarUrl} 
                          alt={person.name} 
                          className="w-12 h-12 rounded-md object-cover border border-trg-gray-100 shrink-0"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-trg-warm-white border border-trg-gray-100 shrink-0 flex items-center justify-center">
                          <User className="w-5 h-5 text-trg-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0 flex-grow">
                        <div className="text-sm font-bold text-trg-carbon truncate group-hover:text-trg-red transition-colors">
                          {person.name}
                        </div>
                        <div className="text-xs text-trg-gray-500 truncate mt-0.5">
                          {person.entityClass === 'PERSON' ? person.roles.join(', ') : ''}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="w-full bg-white border border-trg-gray-100 rounded-lg py-6 px-4 flex items-center justify-center text-center">
                  <span className="text-sm text-trg-gray-400">No people profiles published yet.</span>
                </div>
              )}
            </div>
          </section>

        </div>
      </Container>
    </div>
  );
};
