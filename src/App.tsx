import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
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
import { ImportLabPage } from './pages/ImportLabPage';
import { AboutPage } from './pages/AboutPage';

import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfUsePage } from './pages/TermsOfUsePage';

import { MethodologyPage } from './pages/MethodologyPage';
import { DataPartnershipsPage } from './pages/DataPartnershipsPage';
import { AuthPromptModal, AuthPromptReason } from './components/AuthPromptModal';
import { Footer } from './components/Footer';

import { UserRole } from './types';
import { Locale } from './data/translations';
import { catalogueRepository } from './services/catalogueRepository';

import { PublicShell } from "./components/PublicShell";
import { RequireAuth } from "./components/RequireAuth";
import { useAuth } from './context/AuthContext';

export function App() {
  const [locale, setLocale] = useState<Locale>('en');
  const { effectiveRole, isAuthenticated, hasEffectiveCapability, isLoading } = useAuth();
  const activeRole = effectiveRole || "visitor";
  // For backward compatibility while refactoring, provide a dummy setter
  const setActiveRole = (role: UserRole) => { console.log('Mock setActiveRole called:', role); };
  const [currentPage, setCurrentPage] = useState<string>('market');
  const [selectedVehicleSlug, setSelectedVehicleSlug] = useState<string>('bmw-m3-sport-evolution');
  const [selectedEntitySlug, setSelectedEntitySlug] = useState<string>('nicola-materazzi');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Auth Prompt Modal state
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalReason, setAuthModalReason] = useState<AuthPromptReason>('general');

  // Watchlist & Compare state
  const [watchlistIds, setWatchlistIds] = useState<string[]>(['bmw-m3-e30-sport-evolution', 'bmw-m3-e30-2-3']);
  const [compareIds, setCompareIds] = useState<string[]>(['bmw-m3-e30-sport-evolution', 'bmw-m3-e30-evolution-2']);

  // URL Path Synchronizer for SEO / Clean URLs
  const parseLocation = () => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname.toLowerCase();
    const parts = path.split('/').filter(Boolean);

    if (parts.length === 0 || path === '/') {
      setCurrentPage('home');
    } else if (parts[0] === 'brands' && parts[1]) {
      setCurrentPage('explore');
      setSearchQuery(parts[1]);
    } else if (parts[0] === 'cars' && parts[1]) {
      if (parts.length === 2) {
        // Check if parts[1] is a variant slug first
        const matchedVariant = catalogueRepository.getAllVariants().vehicles.find(v => v.slug === parts[1] || v.id === parts[1]);
        if (matchedVariant) {
          setCurrentPage('detail');
          setSelectedVehicleSlug(matchedVariant.slug);
          const gen = catalogueRepository.getGenerations().find(g => g.id === matchedVariant.generation_id);
          const model = catalogueRepository.getModels().find(m => m.id === gen?.model_id);
          const maker = catalogueRepository.getMakers().find(mk => mk.id === matchedVariant.manufacturer_id);
          const makerSlug = maker?.slug || matchedVariant.manufacturer_name.toLowerCase().replace(/\s+/g, '-');
          const modelSlug = model?.slug || matchedVariant.model_name.toLowerCase().replace(/\s+/g, '-');
          const genSlug = gen?.slug || 'gen';
          const canonicalUrl = `/cars/${makerSlug}/${modelSlug}/${genSlug}/${matchedVariant.slug}`;
          if (typeof window !== 'undefined' && window.location.pathname !== canonicalUrl) {
            window.history.replaceState({ page: 'detail', slug: matchedVariant.slug }, '', canonicalUrl);
          }
        } else {
          // /cars/:makerSlug
          setCurrentPage('explore');
          setSearchQuery(parts[1]);
        }
      } else if (parts.length === 3) {
        // /cars/:makerSlug/:modelSlug
        setCurrentPage('explore');
        setSearchQuery(parts[2]);
      } else if (parts.length === 4) {
        // /cars/:makerSlug/:modelSlug/:generationSlug
        setCurrentPage('explore');
        setSearchQuery(parts[3]);
      } else if (parts.length >= 5) {
        // /cars/:makerSlug/:modelSlug/:generationSlug/:variantSlug
        setCurrentPage('detail');
        const matchedVariant = catalogueRepository.getVariantBySlug(parts[4]);
        setSelectedVehicleSlug(matchedVariant ? matchedVariant.slug : parts[4]);
      }
    } else if (parts[0] === 'vehicle' && parts[1]) {
      setCurrentPage('detail');
      setSelectedVehicleSlug(parts[1]);
      const matchedVariant = catalogueRepository.getAllVariants().vehicles.find(v => v.slug === parts[1] || v.id === parts[1]);
      if (matchedVariant) {
        const gen = catalogueRepository.getGenerations().find(g => g.id === matchedVariant.generation_id);
        const model = catalogueRepository.getModels().find(m => m.id === gen?.model_id);
        const maker = catalogueRepository.getMakers().find(mk => mk.id === matchedVariant.manufacturer_id);
        const makerSlug = maker?.slug || matchedVariant.manufacturer_name.toLowerCase().replace(/\s+/g, '-');
        const modelSlug = model?.slug || matchedVariant.model_name.toLowerCase().replace(/\s+/g, '-');
        const genSlug = gen?.slug || 'gen';
        const canonicalUrl = `/cars/${makerSlug}/${modelSlug}/${genSlug}/${matchedVariant.slug}`;
        if (typeof window !== 'undefined' && window.location.pathname !== canonicalUrl) {
          window.history.replaceState({ page: 'detail', slug: matchedVariant.slug }, '', canonicalUrl);
        }
      }
    } else if (parts[0] === 'entity' && parts[1]) {
      setCurrentPage('entity');
      setSelectedEntitySlug(parts[1]);
    } else if ((parts[0] === 'category' || parts[0] === 'manufacturer') && parts[1]) {
      setCurrentPage('explore');
      setSearchQuery(parts[1]);
    } else if (parts[0] === 'compare') {
      setCurrentPage('compare');
    } else if (parts[0] === 'graph') {
      setCurrentPage('graph');
    } else if (parts[0] === 'ai-advisor') {
      setCurrentPage('ai-advisor');
    } else if (parts[0] === 'editorial') {
      setCurrentPage('editorial');
    } else if (parts[0] === 'dealer-portal' || parts[0] === 'listings') {
      setCurrentPage('listings');
    } else if (parts[0] === 'watchlist') {
      setCurrentPage('watchlist');
    } else if (parts[0] === 'editor' && parts[1] === 'import-lab') {
      setCurrentPage('import-lab');
    } else if (parts[0] === 'super_admin') {
      setCurrentPage('super_admin');
    } else if (parts[0] === 'register' || parts[0] === 'login') {
      setCurrentPage('register');
    } else if (parts[0] === 'profile') {
      setCurrentPage('profile');
    } else if (parts[0] === 'about') {
      setCurrentPage('about');
    } else if (parts[0] === 'methodology') {
      setCurrentPage('methodology');
    } else if (parts[0] === 'data-partnerships') {
      setCurrentPage('data-partnerships');
    } else if (parts[0] === 'explore' || parts[0] === 'catalog') {
      setCurrentPage('explore');
    } else if (parts[0] === 'market') {
      setCurrentPage('market');
    }
  };

  useEffect(() => {
    parseLocation();
    const handlePopState = () => parseLocation();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenAuthModal = (reason: AuthPromptReason) => {
    setAuthModalReason(reason);
    setAuthModalOpen(true);
  };

  const handleToggleWatchlist = (id: string) => {
    if (activeRole === 'visitor') {
      handleOpenAuthModal('watchlist');
      return;
    }
    setWatchlistIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleCompare = (id: string) => {
    if (activeRole === 'visitor') {
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

  const handleNavigate = (page: string, params?: any) => {
    let slug = '';
    if (typeof params === 'string') {
      slug = params;
    } else if (params && typeof params === 'object') {
      slug = params.slug || params.makerSlug || params.variantSlug || '';
    }

    if ((page === 'watchlist' || page === 'compare') && activeRole === 'visitor') {
      handleOpenAuthModal(page === 'watchlist' ? 'watchlist' : 'compare');
      return;
    }
    setCurrentPage(page);

    let newPath = '/explore';

    if (page === 'detail' && slug) {
      if (slug.includes('/')) {
         newPath = `/cars/${slug}`;
         const slugParts = slug.split('/');
         setSelectedVehicleSlug(slugParts[slugParts.length - 1]);
      } else {
        setSelectedVehicleSlug(slug);
        const variant = catalogueRepository.getAllVariants().vehicles.find(v => v.slug === slug || v.id === slug);
        if (variant) {
          const gen = catalogueRepository.getGenerations().find(g => g.id === variant.generation_id);
          const model = catalogueRepository.getModels().find(m => m.id === gen?.model_id);
          const maker = catalogueRepository.getMakers().find(mk => mk.id === variant.manufacturer_id);
          const makerSlug = maker?.slug || variant.manufacturer_name.toLowerCase().replace(/\s+/g, '-');
          const modelSlug = model?.slug || variant.model_name.toLowerCase().replace(/\s+/g, '-');
          const genSlug = gen?.slug || 'gen';
          newPath = `/cars/${makerSlug}/${modelSlug}/${genSlug}/${variant.slug}`;
        } else {
          newPath = `/cars/variant/${slug}`;
        }
      }
    } else if (page === 'search-result') {
      newPath = params.url;
    } else if (page === 'brands') {
      newPath = `/brands/${slug}`;
    } else if (page === 'model') {
      newPath = `/cars/${slug}`;
    } else if (page === 'generation') {
      newPath = `/cars/${slug}`;
    } else if (page === 'entity' && slug) {
      setSelectedEntitySlug(slug);
      newPath = `/entity/${slug}`;
    } else if (page === 'compare') {
      newPath = '/compare';
    } else if (page === 'graph') {
      newPath = '/graph';
    } else if (page === 'ai-advisor') {
      newPath = '/ai-advisor';
    } else if (page === 'editorial') {
      newPath = '/editorial';
    } else if (page === 'super_admin') {
      newPath = '/admin';
    } else if (page === 'import-lab') {
      newPath = '/editor/import-lab';
    } else if (page === 'register') {
      newPath = '/register';
    } else if (page === 'profile') {
      newPath = '/profile';
    } else if (page === 'profile/organization') {
      newPath = '/profile/organization';
      newPath = '/profile';
    } else if (page === 'about') {
      newPath = '/about';
    
    } else if (page === 'contact') {
      newPath = '/contact';
    } else if (page === 'privacy') {
      newPath = '/privacy';
    } else if (page === 'terms') {
      newPath = '/terms';
    } else if (page === 'methodology') {
      newPath = '/methodology';
    } else if (page === 'data-partnerships') {
      newPath = '/data-partnerships';
    } else if (page === 'watchlist') {
      newPath = '/watchlist';
    } else if (page === 'listings' || page === 'dealer-portal') {
      newPath = '/dealer-portal';
    } else if (page === 'home') {
      newPath = '/';
    } else if (page === 'market' || page === 'explore') {
      newPath = '/explore';
    }

    if (typeof window !== 'undefined' && window.location.pathname !== newPath) {
      window.history.pushState({ page, slug }, '', newPath);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchHeader = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('explore');
  };



  return (
    <PublicShell
      activeRole={activeRole}
      setActiveRole={setActiveRole}
      watchlistCount={watchlistIds.length}
      onNavigate={handleNavigate}
      currentPage={currentPage}
      authModalOpen={authModalOpen}
      authModalReason={authModalReason}
      setAuthModalOpen={setAuthModalOpen}
    >
          {currentPage === 'home' && (
            <HomePage onNavigate={handleNavigate} />
          )}
          {(currentPage === 'explore' || currentPage === 'catalog' || currentPage === 'templates' || currentPage === 'brands' || currentPage === 'maker' || currentPage === 'model' || currentPage === 'generation') && (
            <ExplorePage onNavigate={handleNavigate} />
          )}
          {currentPage === 'market' && (
            <MarketIntelligencePage onNavigate={handleNavigate} />
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
            <RequireAuth onNavigate={handleNavigate} requiredCapability="PUBLISH_CANONICAL_DATA">
              <EditorialPage
                locale={locale}
                activeRole={activeRole}
                onNavigate={handleNavigate}
              />
            </RequireAuth>
          )}
          {currentPage === 'watchlist' && (
            <RequireAuth onNavigate={handleNavigate}>
              <WatchlistPage
                watchlistIds={watchlistIds}
                onRemoveWatchlist={handleToggleWatchlist}
                onNavigate={handleNavigate}
                onSelectVehicle={setSelectedVehicleSlug}
                locale={locale}
              />
            </RequireAuth>
          )}
          {currentPage === 'super_admin' && (
            <RequireAuth onNavigate={handleNavigate} requiredCapability="MANAGE_ROLES">
              <AdminPage
                locale={locale}
                activeRole={activeRole}
                setActiveRole={setActiveRole}
                onNavigate={handleNavigate}
              />
            </RequireAuth>
          )}
          {currentPage === 'import-lab' && (
            <RequireAuth onNavigate={handleNavigate} requiredCapability="MANAGE_ROLES">
              <ImportLabPage />
            </RequireAuth>
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
          {(currentPage === 'profile' || currentPage === 'profile/organization') && (
            <RequireAuth onNavigate={handleNavigate}>
              <ProfilePage
                locale={locale}
                activeRole={activeRole}
                setActiveRole={setActiveRole}
                watchlistIds={watchlistIds}
                onNavigate={handleNavigate}
                onSelectVehicle={setSelectedVehicleSlug}
              />
            </RequireAuth>
          )}
          {currentPage === 'about' && (
            <AboutPage onNavigate={handleNavigate} />
          )}
          
          {currentPage === 'contact' && (
            <ContactPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'privacy' && (
            <PrivacyPolicyPage />
          )}
          {currentPage === 'terms' && (
            <TermsOfUsePage />
          )}
          {currentPage === 'methodology' && (
            <MethodologyPage onNavigate={handleNavigate} />
          )}
          {currentPage === 'data-partnerships' && (
            <DataPartnershipsPage
              locale={locale}
              onNavigate={handleNavigate}
            />
          )}
    </PublicShell>
  );
}

export default App;
