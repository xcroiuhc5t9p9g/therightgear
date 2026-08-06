import React, { useState } from 'react';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomePage } from './pages/HomePage';
import { MarketPage } from './pages/MarketPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { MarketIntelligencePage } from './pages/MarketIntelligencePage';
import { KnowledgeGraphPage } from './pages/KnowledgeGraphPage';
import { ComparePage } from './pages/ComparePage';
import { AiAdvisorPage } from './pages/AiAdvisorPage';
import { DealerMarketplacePage } from './pages/DealerMarketplacePage';
import { EditorialPage } from './pages/EditorialPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { AdminPage } from './pages/AdminPage';
import { ModelTemplatesPage } from './pages/ModelTemplatesPage';
import { EntityDetailPage } from './pages/EntityDetailPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthPromptModal, AuthPromptReason } from './components/AuthPromptModal';

import { UserRole } from './types';
import { Locale } from './data/translations';

export function App() {
  const [locale, setLocale] = useState<Locale>('en');
  const [activeRole, setActiveRole] = useState<UserRole>('registered_user');
  const [currentPage, setCurrentPage] = useState<string>('market');
  const [selectedVehicleSlug, setSelectedVehicleSlug] = useState<string>('ferrari-f40');
  const [selectedEntitySlug, setSelectedEntitySlug] = useState<string>('nicola-materazzi');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Auth Prompt Modal state
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalReason, setAuthModalReason] = useState<AuthPromptReason>('general');

  // Watchlist & Compare state
  const [watchlistIds, setWatchlistIds] = useState<string[]>(['v-ferrari-f40', 'v-mclaren-f1']);
  const [compareIds, setCompareIds] = useState<string[]>(['v-ferrari-f40', 'v-porsche-959']);

  const handleOpenAuthModal = (reason: AuthPromptReason) => {
    setAuthModalReason(reason);
    setAuthModalOpen(true);
  };

  const handleToggleWatchlist = (id: string) => {
    if (activeRole === 'public') {
      handleOpenAuthModal('watchlist');
      return;
    }
    setWatchlistIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleCompare = (id: string) => {
    if (activeRole === 'public') {
      handleOpenAuthModal('compare');
      return;
    }
    setCompareIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleNavigate = (page: string, slug?: string) => {
    if ((page === 'watchlist' || page === 'compare') && activeRole === 'public') {
      handleOpenAuthModal(page === 'watchlist' ? 'watchlist' : 'compare');
      return;
    }
    setCurrentPage(page);
    if (slug) {
      if (page === 'entity') {
        setSelectedEntitySlug(slug);
      } else {
        setSelectedVehicleSlug(slug);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchHeader = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('explore');
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white pb-16 lg:pb-0">
      
      {/* Top Header */}
      <Header
        locale={locale}
        setLocale={setLocale}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        watchlistCount={watchlistIds.length}
        compareCount={compareIds.length}
        onSearch={handleSearchHeader}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />

      <div className="flex flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6">
        
        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {currentPage === 'home' && (
            <HomePage
              locale={locale}
              activeRole={activeRole}
              onNavigate={handleNavigate}
              onSelectVehicle={setSelectedVehicleSlug}
              onToggleWatchlist={handleToggleWatchlist}
              onToggleCompare={handleToggleCompare}
              onOpenAuthModal={handleOpenAuthModal}
              watchlistIds={watchlistIds}
              compareIds={compareIds}
            />
          )}

          {(currentPage === 'market' || currentPage === 'explore' || currentPage === 'catalog' || currentPage === 'templates') && (
            <MarketPage
              locale={locale}
              activeRole={activeRole}
              onSelectVehicle={setSelectedVehicleSlug}
              onNavigate={handleNavigate}
              onToggleWatchlist={handleToggleWatchlist}
              onToggleCompare={handleToggleCompare}
              onOpenAuthModal={handleOpenAuthModal}
              watchlistIds={watchlistIds}
              compareIds={compareIds}
              initialSearchQuery={searchQuery}
            />
          )}

          {currentPage === 'detail' && (
            <VehicleDetailPage
              slug={selectedVehicleSlug}
              locale={locale}
              activeRole={activeRole}
              onNavigate={handleNavigate}
              onToggleWatchlist={handleToggleWatchlist}
              onToggleCompare={handleToggleCompare}
              onOpenAuthModal={handleOpenAuthModal}
              watchlistIds={watchlistIds}
              compareIds={compareIds}
            />
          )}

          {currentPage === 'graph' && (
            <KnowledgeGraphPage
              locale={locale}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'compare' && (
            <ComparePage
              compareIds={compareIds}
              onRemoveCompare={handleToggleCompare}
              onNavigate={handleNavigate}
              locale={locale}
            />
          )}

          {currentPage === 'ai-advisor' && (
            <AiAdvisorPage
              locale={locale}
              onNavigate={handleNavigate}
            />
          )}

          {(currentPage === 'listings' || currentPage === 'dealer-portal') && (
            <DealerMarketplacePage
              locale={locale}
              activeRole={activeRole}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'editorial' && (
            <EditorialPage
              locale={locale}
              activeRole={activeRole}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'watchlist' && (
            <WatchlistPage
              watchlistIds={watchlistIds}
              onRemoveWatchlist={handleToggleWatchlist}
              onNavigate={handleNavigate}
              onSelectVehicle={setSelectedVehicleSlug}
              locale={locale}
            />
          )}

          {currentPage === 'admin' && (
            <AdminPage
              locale={locale}
              activeRole={activeRole}
              setActiveRole={setActiveRole}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'entity' && (
            <EntityDetailPage
              entitySlug={selectedEntitySlug}
              locale={locale}
              onNavigate={handleNavigate}
              onSelectVehicle={setSelectedVehicleSlug}
            />
          )}

          {currentPage === 'register' && (
            <RegisterPage
              locale={locale}
              activeRole={activeRole}
              setActiveRole={setActiveRole}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'profile' && (
            <ProfilePage
              locale={locale}
              activeRole={activeRole}
              setActiveRole={setActiveRole}
              watchlistIds={watchlistIds}
              onNavigate={handleNavigate}
              onSelectVehicle={setSelectedVehicleSlug}
            />
          )}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        watchlistCount={watchlistIds.length}
      />

      {/* Registration Invitation Modal for Guests */}
      <AuthPromptModal
        isOpen={authModalOpen}
        reason={authModalReason}
        onClose={() => setAuthModalOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default App;

