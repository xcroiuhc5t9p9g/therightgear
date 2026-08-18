import React from 'react';
import { HeroBlock } from '../components/ui-blocks';

export const NotFoundPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-white min-h-screen">
      <HeroBlock 
        title="Page Not Found"
        subtitle="The requested page does not exist or has been moved."
        action={
          <button onClick={() => onNavigate ? onNavigate('home') : window.location.href = '/'} className="px-8 py-3 bg-trg-carbon text-white font-bold rounded-lg hover:bg-trg-gray-700 transition-colors">
            Return Home
          </button>
        }
      />
    </div>
  );
};
