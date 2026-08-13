import React, { ReactNode, useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AuthPromptModal } from './AuthPromptModal';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { catalogueRepository } from '../services/catalogueRepository';

interface PublicShellProps {
  children: ReactNode;
  activeRole: UserRole;
  setActiveRole: (r: UserRole) => void;
  watchlistCount: number;
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
  authModalOpen: boolean;
  authModalReason: string | null;
  setAuthModalOpen: (open: boolean) => void;
}

export const PublicShell: React.FC<PublicShellProps> = ({

  children,
  activeRole,
  setActiveRole,
  watchlistCount,
  onNavigate,
  currentPage,
  authModalOpen,
  authModalReason,
  setAuthModalOpen
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);

      const { actualRole, previewRole, setPreviewRole } = useAuth();
  
  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.length >= 2) {
      const results = catalogueRepository.search(q);
      setSuggestions(results.map(r => ({
        ...r,
        action: () => onNavigate('search-result', r)
      })));
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="min-h-screen bg-trg-warm-white text-trg-carbon flex flex-col font-sans selection:bg-trg-red selection:text-white">
      {actualRole === 'super_admin' && previewRole && previewRole !== 'super_admin' && (
        <div className="bg-trg-red text-white px-4 py-2 text-xs font-bold flex justify-between items-center z-50">
          <span>VIEWING AS {previewRole.replace('_', ' ').toUpperCase()}</span>
          <button 
            onClick={() => setPreviewRole(null)}
            className="bg-black/20 hover:bg-black/40 px-3 py-1 rounded transition-colors"
          >
            Exit Preview
          </button>
        </div>
      )}
      <Header
        
        watchlistCount={watchlistCount}
        onSearch={handleSearch}
        onNavigate={onNavigate}
        query={query}
        setQuery={setQuery}
        suggestions={suggestions}
      />
      
      <main className="flex-1 min-w-0 flex flex-col">
        {children}
      </main>
      
      <Footer onNavigate={onNavigate} />
      
      <AuthPromptModal
        isOpen={authModalOpen}
        reason={authModalReason}
        onClose={() => setAuthModalOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
