import React, { useState, useEffect } from 'react';
import { catalogueRepository } from '../services/catalogueRepository';
import { CanonicalEngine } from '../types';

interface EngineDetailPageProps {
  engineSlug: string;
  onNavigate: (page: string, params?: any) => void;
}

export const EngineDetailPage: React.FC<EngineDetailPageProps> = ({ engineSlug, onNavigate }) => {
  const [engine, setEngine] = useState<CanonicalEngine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadEngine() {
      setIsLoading(true);
      try {
        const foundEngine = await catalogueRepository.getPublicEngineBySlug(engineSlug);
        if (!cancelled) {
          setEngine(foundEngine);
        }
      } catch (e) {
        if (!cancelled) {
          setEngine(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    loadEngine();
    return () => {
      cancelled = true;
    };
  }, [engineSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-trg-warm-white flex items-center justify-center">
        <p className="text-trg-gray-500 font-mono text-sm uppercase tracking-wider">Loading...</p>
      </div>
    );
  }

  // Honest empty/not-found state
  if (!engine) {
    return (
      <div className="min-h-screen bg-trg-warm-white flex items-center justify-center">
        <div className="text-center p-8 bg-white border border-trg-gray-200 rounded-sm max-w-md shadow-sm">
          <h1 className="text-xl font-bold text-trg-graphite mb-4">Engine Not Found</h1>
          <p className="text-trg-gray-500 mb-6">Engine data currently unavailable.</p>
          <button
            onClick={() => onNavigate('home')}
            className="px-6 py-2 bg-trg-graphite text-white font-medium text-sm hover:bg-black transition-colors"
          >
            Return to Catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-trg-warm-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-mono uppercase tracking-wider text-trg-gray-500 hover:text-trg-graphite mb-4 flex items-center gap-1"
          >
            ← Back to Catalogue
          </button>
          <h1 className="text-3xl font-bold text-trg-graphite tracking-tight font-serif">
            {engine.name} ({engine.canonical_code})
          </h1>
          <p className="text-sm font-mono text-trg-gray-500 uppercase tracking-wider mt-1">
            Canonical Engine Specification
          </p>
        </div>

        <div className="bg-white border border-trg-gray-200 rounded-sm p-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-trg-gray-100">
            <div>
              <p className="text-xs font-mono text-trg-gray-400 uppercase">Manufacturer</p>
              <p className="text-sm font-semibold text-trg-graphite">{engine.manufacturer_name}</p>
            </div>
            <div>
              <p className="text-xs font-mono text-trg-gray-400 uppercase">Architecture</p>
              <p className="text-sm font-semibold text-trg-graphite">{engine.architecture}</p>
            </div>
            <div>
              <p className="text-xs font-mono text-trg-gray-400 uppercase">Displacement</p>
              <p className="text-sm font-semibold text-trg-graphite">{engine.displacement_cc ? `${engine.displacement_cc} cc` : 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-mono text-trg-gray-400 uppercase">Aspiration</p>
              <p className="text-sm font-semibold text-trg-graphite">{engine.aspiration || 'Naturally Aspirated'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-mono text-trg-gray-500 uppercase tracking-wider">Engine Family History</h2>
            <p className="text-sm text-trg-gray-700 leading-relaxed">
              {engine.description_en || 'Authoritative engine history pending synchronization.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EngineDetailPage;
