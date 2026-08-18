import React, { useState, useMemo } from 'react';
import { catalogueRepository } from '../services/catalogueRepository';

interface CarsPageProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export const CarsPage: React.FC<CarsPageProps> = ({ onNavigate }) => {
  const [selectedMaker, setSelectedMaker] = useState<string>('');
  
  const makers = useMemo(() => catalogueRepository.getMakers(), []);
  
  const models = useMemo(() => {
    if (!selectedMaker) return [];
    return catalogueRepository.getModelsByMaker(selectedMaker);
  }, [selectedMaker]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-light text-trg-carbon mb-8">Cars</h1>
      <p className="text-sm text-trg-gray-500 mb-12">Advanced discovery of the The Right Gear automotive knowledge catalogue.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 border-r border-gray-100 pr-4">
          <h2 className="text-[10px] uppercase tracking-widest text-trg-gray-400 font-semibold mb-4">Browse by Maker</h2>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            <button
              onClick={() => setSelectedMaker('')}
              className={`block w-full text-left px-3 py-2 text-sm ${!selectedMaker ? 'bg-gray-100 font-medium text-trg-carbon' : 'text-trg-gray-500 hover:bg-gray-50'}`}
            >
              All Makers
            </button>
            {makers.map(maker => (
              <button
                key={maker.id}
                onClick={() => setSelectedMaker(maker.slug)}
                className={`block w-full text-left px-3 py-2 text-sm ${selectedMaker === maker.slug ? 'bg-gray-100 font-medium text-trg-carbon' : 'text-trg-gray-500 hover:bg-gray-50'}`}
              >
                {maker.canonical_name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-3">
          {!selectedMaker ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {makers.map(maker => (
                <a
                  key={maker.id}
                  href={`/brands/${maker.slug}`}
                  onClick={(e) => { e.preventDefault(); onNavigate('brands', { makerSlug: maker.slug }); }}
                  className="p-4 border border-gray-100 hover:border-gray-300 transition-colors bg-white block"
                >
                  <h3 className="text-lg font-medium text-trg-carbon mb-1">{maker.canonical_name}</h3>
                  <p className="text-[10px] text-trg-gray-400 uppercase tracking-widest">{maker.country_code || '—'}</p>
                </a>
              ))}
            </div>
          ) : (
            <div>
              <div className="mb-6 flex justify-between items-end border-b border-gray-200 pb-2">
                <h2 className="text-xl font-medium text-trg-carbon">Models</h2>
                <span className="text-[10px] uppercase tracking-widest text-trg-gray-400">{models.length} Models</span>
              </div>
              <div className="divide-y divide-gray-100">
                {models.map(model => (
                  <a
                    key={model.id}
                    href={`/cars/${selectedMaker}/${model.slug}`}
                    onClick={(e) => { e.preventDefault(); onNavigate('model', { makerSlug: selectedMaker, modelSlug: model.slug }); }}
                    className="group block py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-center px-4">
                      <div className="text-sm font-medium text-trg-carbon group-hover:text-trg-red transition-colors">{model.canonical_name}</div>
                      <div className="text-xs text-trg-gray-400">{model.introduced_year || '—'} – {model.discontinued_year || 'Present'}</div>
                    </div>
                  </a>
                ))}
                {models.length === 0 && (
                  <div className="py-8 text-center text-trg-gray-400 text-sm italic">
                    No models found for this maker.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
