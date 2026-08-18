import React from 'react';

interface MotorcyclesPageProps {
  onNavigate: (route: string, params?: Record<string, string>) => void;
}

export const MotorcyclesPage: React.FC<MotorcyclesPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-center min-h-[50vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-light text-trg-carbon mb-4">Motorbikes</h1>
      <p className="text-sm text-trg-gray-500 italic">Data currently under research.</p>
    </div>
  );
};
