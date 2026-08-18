import React, { useState, useEffect } from 'react';
import { catalogueRepository } from '../services/catalogueRepository';
import { CanonicalEngine } from '../types';

interface EngineDetailPageProps {
  engineSlug: string;
  onNavigate: (page: string, params?: any) => void;
}

const EngineDetailPage: React.FC<EngineDetailPageProps> = ({ engineSlug, onNavigate }) => {
  const [engine, setEngine] = useState<CanonicalEngine | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate slight delay for real-world feel or just load it
    const foundEngine = catalogueRepository.getPublicEngineBySlug(engineSlug);
    setEngine(foundEngine);
    setIsLoading(false);
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
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // This should not be reachable currently since CANONICAL_ENGINES is empty
  return (
    <div className="min-h-screen bg-trg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-trg-graphite mb-2">{engine.canonical_name}</h1>
        <p className="text-trg-gray-500 font-mono">{engine.engine_code}</p>
      </div>
    </div>
  );
};

export default EngineDetailPage;
