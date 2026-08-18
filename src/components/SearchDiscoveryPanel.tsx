import { SearchResult } from '../types';
import React from 'react';
import { ArrowRight } from 'lucide-react';

const HighlightMatch = ({ text, query }: { text: string, query: string }) => {
  if (!query) return <>{text}</>;
  
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return <>{text}</>;

  let result = text;
  // This is a naive highlight for multiple tokens
  return <span className="font-medium text-trg-carbon">{text}</span>;
};

export const SearchDiscoveryPanel = ({ 
  query, 
  suggestions, 
  discoveryActions,
  selectedIndex, 
  onNavigate, 
  handleSuggestionClick 
}: { 
  query: string;
  suggestions: SearchResult[];
  discoveryActions?: any[];
  selectedIndex: number;
  onNavigate: (page: string, params?: any) => void;
  handleSuggestionClick: (action: () => void) => void;
}) => {
  const isQuerying = query.trim().length >= 2;

  if (isQuerying) {
    if (suggestions.length === 0 && (!discoveryActions || discoveryActions.length === 0)) {
      return (
        <div className="px-4 py-6 text-sm text-trg-gray-500 text-center">
          No matching records found.
        </div>
      );
    }

    // Group suggestions by type
    const grouped = suggestions.reduce((acc, curr) => {
      const t = curr.type;
      if (!acc[t]) acc[t] = [];
      acc[t].push(curr);
      return acc;
    }, {} as Record<string, SearchResult[]>);

    const groupOrder = ['MAKER', 'MODEL', 'GENERATION', 'VARIANT', 'ENGINE', 'PERSON', 'ORGANIZATION'];

    const sortedGroups = Object.entries(grouped).sort(([a], [b]) => {
      const idxA = groupOrder.indexOf(a);
      const idxB = groupOrder.indexOf(b);
      return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
    });

    let globalIndexCounter = 0;

    return (
      <div className="py-2">
        {discoveryActions && discoveryActions.length > 0 && (
          <div className="mb-4 last:mb-0">
            <h4 className="text-[10px] font-bold text-trg-gray-400 uppercase tracking-wider mb-2 px-4 md:px-6">
              DISCOVER
            </h4>
            <ul className="flex flex-col">
              {discoveryActions.map((action) => {
                const globalIdx = globalIndexCounter++;
                return (
                  <li key={action.id}>
                    <a
                      href={action.url}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(() => {
                            if (action.url.includes('#models')) {
                              const slug = action.url.split('/')[2].split('#')[0];
                              onNavigate('brands', { makerSlug: slug });
                            } else {
                              onNavigate('search-result', { url: action.url });
                            }
                        });
                      }}
                      className={`w-full text-left px-4 md:px-6 py-2.5 flex items-center justify-between group border-b border-transparent ${globalIdx === selectedIndex ? 'border-trg-gray-100' : 'hover:border-trg-gray-100'}`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm truncate text-trg-red font-medium`}>
                            {action.title}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pl-2">
                        <ArrowRight className={`w-4 h-4 transition-colors shrink-0 ${globalIdx === selectedIndex ? 'text-trg-red' : 'text-trg-gray-300 group-hover:text-trg-red'}`} />
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {sortedGroups.map(([type, items]: [string, SearchResult[]]) => (
          <div key={type} className="mb-4 last:mb-0">
            <h4 className="text-[10px] font-bold text-trg-gray-400 uppercase tracking-wider mb-2 px-4 md:px-6">
              {type === 'PERSON' ? 'PEOPLE' : type.replace('_', ' ')}
            </h4>
            <ul className="flex flex-col">
              {items.map((suggestion) => {
                const globalIdx = globalIndexCounter++;
                return (
                  <li key={suggestion.id}>
                    <a
                      href={suggestion.url}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(() => {
                          if (suggestion.type === 'MAKER') onNavigate('brands', { makerSlug: suggestion.makerSlug });
                          else if (suggestion.type === 'MODEL') onNavigate('model', { makerSlug: suggestion.makerSlug, modelSlug: suggestion.modelSlug });
                          else if (suggestion.type === 'GENERATION') onNavigate('generation', { makerSlug: suggestion.makerSlug, modelSlug: suggestion.modelSlug, generationSlug: suggestion.generationSlug });
                          else if (suggestion.type === 'VARIANT') onNavigate('vehicle', { vehicleSlug: suggestion.variantSlug });
                          else if (suggestion.type === 'ENGINE') onNavigate('engines', { entitySlug: suggestion.id });
                          else if (suggestion.type === 'PERSON') onNavigate('people', { personSlug: suggestion.id });
                          else if (suggestion.type === 'ORGANIZATION') onNavigate('entity', { entitySlug: suggestion.id });
                        });
                      }}
                      className={`w-full text-left px-4 md:px-6 py-2.5 flex items-center justify-between group border-b border-transparent ${globalIdx === selectedIndex ? 'border-trg-gray-100' : 'hover:border-trg-gray-100'}`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm truncate font-medium text-trg-carbon`}>
                            {suggestion.title}
                          </div>
                          {suggestion.subtitle && (
                            <div className="text-xs text-trg-gray-500 mt-0.5 truncate">{suggestion.subtitle}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pl-2">
                        <ArrowRight className={`w-4 h-4 transition-colors shrink-0 ${globalIdx === selectedIndex ? 'text-trg-red' : 'text-trg-gray-300 group-hover:text-trg-red'}`} />
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  // DISCOVERY STATE (Query < 2)
  return (
    <div className="py-2">
      <div className="px-4 py-8 text-center">
        <h3 className="text-[10px] uppercase tracking-widest font-semibold text-trg-gray-400 mb-8">Search The Right Gear</h3>
        <div className="flex flex-row flex-wrap justify-center items-center gap-8 md:gap-12">
          <a href="/cars" onClick={(e) => { e.preventDefault(); onNavigate('cars'); }} className="text-sm font-medium text-trg-carbon hover:text-trg-red transition-colors">Cars</a>
          <a href="/motorcycles" onClick={(e) => { e.preventDefault(); onNavigate('motorcycles'); }} className="text-sm font-medium text-trg-carbon hover:text-trg-red transition-colors">Motorbikes</a>
          <a href="/events" onClick={(e) => { e.preventDefault(); onNavigate('events'); }} className="text-sm font-medium text-trg-carbon hover:text-trg-red transition-colors">Events</a>
          <a href="/market" onClick={(e) => { e.preventDefault(); onNavigate('market'); }} className="text-sm font-medium text-trg-carbon hover:text-trg-red transition-colors">Market</a>
        </div>
      </div>
    </div>
  );
};
