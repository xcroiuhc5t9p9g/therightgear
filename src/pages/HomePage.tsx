import React, { useEffect, useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft,
  ArrowRight,
  Star
} from 'lucide-react';
import { VehicleVariant, UserRole } from '../types';
import { VehicleCard } from '../components/VehicleCard';
import { SlideshowBlock } from '../components/SlideshowBlock';
import { Locale, translations } from '../data/translations';
import { unifiedVehicleStore } from '../services/unifiedVehicleStore';
import { generateOrganizationJsonLd, injectSeoGeoMetadata, getAbsolutePageUrl } from '../services/seoGeoService';
import { AuthPromptReason } from '../components/AuthPromptModal';

interface HomePageProps {
  locale: Locale;
  activeRole?: UserRole;
  onNavigate: (page: string, slug?: string) => void;
  onSelectVehicle: (slug: string) => void;
  onToggleWatchlist: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onOpenAuthModal?: (reason: AuthPromptReason) => void;
  watchlistIds: string[];
  compareIds: string[];
}

export const HomePage: React.FC<HomePageProps> = ({
  locale,
  activeRole = 'public',
  onNavigate,
  onSelectVehicle,
  onOpenAuthModal
}) => {
  const t = translations[locale];

  // Store state for featured vehicles
  const [featuredVehicles, setFeaturedVehicles] = useState<VehicleVariant[]>(unifiedVehicleStore.getInPrimoPiano());

  // Pagination for featured vehicles (6 items per page to prevent infinite scrolling)
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(featuredVehicles.length / ITEMS_PER_PAGE) || 1;
  const displayedVehicles = featuredVehicles.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    // Subscribe to store updates
    const unsubscribe = unifiedVehicleStore.subscribe(() => {
      const inPrimoPianoList = unifiedVehicleStore.getInPrimoPiano();
      setFeaturedVehicles(inPrimoPianoList.length > 0 ? inPrimoPianoList : unifiedVehicleStore.getPublished());
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const pageCanonicalUrl = getAbsolutePageUrl('/');
    const orgSchema = generateOrganizationJsonLd();
    injectSeoGeoMetadata({
      title: 'Automotive Intelligence Platform - Sports Car Database & Knowledge Graph',
      description: 'Intelligence platform and knowledge graph for iconic sports cars, youngtimers, and European supercars. Verified technical datasheets and historical market valuations.',
      canonicalUrl: pageCanonicalUrl,
      ogType: 'website',
      keywords: ['Supercar', 'Youngtimer', 'Knowledge Graph Automotive', 'Quotazioni Auto d Epoca', 'Collector Score']
    }, [orgSchema]);
  }, []);

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. BLOCCO SLIDESHOW SOTTO L'HEADER (GESTIBILE DA ADMIN & EDITOR) */}
      <SlideshowBlock activeRole={activeRole} onNavigate={onNavigate} />

      {/* 2. FEATURED VEHICLES SECTION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#232a3d] pb-4">
          <div className="flex items-center space-x-2 text-red-400">
            <Star className="w-5 h-5 fill-current" />
            <h2 className="text-xl font-extrabold text-white tracking-wide uppercase">
              Featured Vehicles
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {featuredVehicles.length} {featuredVehicles.length === 1 ? 'vehicle selected' : 'vehicles selected'}
          </span>
        </div>

        {/* Vehicle Cards Grid (Paginated at 6 items per page) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              activeRole={activeRole}
              onSelectVehicle={onSelectVehicle}
              onNavigate={onNavigate}
              onOpenAuthModal={onOpenAuthModal}
            />
          ))}
        </div>

        {/* Controls & Navigation to Market */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#1f2638]">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-300 font-mono">
              Showing <strong className="text-white">{(page - 1) * ITEMS_PER_PAGE + 1}</strong> - <strong className="text-white">{Math.min(page * ITEMS_PER_PAGE, featuredVehicles.length)}</strong> of <strong className="text-red-400 font-bold">{featuredVehicles.length}</strong> featured
            </span>

            {page > 1 && (
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3.5 py-2 rounded-xl bg-[#141824] border border-[#232b3e] text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            )}

            {page < totalPages && (
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-md shadow-red-600/20"
              >
                <span>Next {Math.min(ITEMS_PER_PAGE, featuredVehicles.length - page * ITEMS_PER_PAGE)} results</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => onNavigate('market')}
            className="px-5 py-2.5 rounded-xl bg-[#161c2b] hover:bg-red-600 hover:text-slate-950 text-red-400 border border-red-500/30 text-xs font-extrabold transition-all flex items-center space-x-2 cursor-pointer uppercase tracking-wider shadow-md"
          >
            <span>View All Vehicles in Market</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
