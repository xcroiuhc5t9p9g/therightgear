import React from 'react';
import { 
  Home, 
  Compass, 
  TrendingUp, 
  Network, 
  Scale, 
  Bot, 
  Store, 
  FileCheck, 
  Bookmark, 
  ShieldCheck,
  Building2,
  ChevronRight
} from 'lucide-react';
import { Locale, translations } from '../data/translations';
import { UserRole } from '../types';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  locale: Locale;
  activeRole: UserRole;
  watchlistCount: number;
  compareCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  locale,
  activeRole,
  watchlistCount,
  compareCount
}) => {
  const t = translations[locale];

  const mainNav = [
    { id: 'home', label: t.nav_home, icon: Home },
    { id: 'explore', label: t.nav_explore, icon: Compass },
    { id: 'market', label: t.nav_market, icon: TrendingUp },
    { id: 'graph', label: t.nav_graph, icon: Network },
    { id: 'compare', label: t.nav_compare, icon: Scale, badge: compareCount },
    { id: 'ai-advisor', label: t.nav_ai_advisor, icon: Bot, isHighlight: true },
    { id: 'listings', label: t.nav_listings, icon: Store },
    { id: 'watchlist', label: t.nav_watchlist, icon: Bookmark, badge: watchlistCount },
  ];

  // Role restricted portals
  const roleNav = [
    { id: 'dealer-portal', label: t.nav_dealer_portal, icon: Building2, roles: ['dealer', 'admin'] },
    { id: 'editorial', label: t.nav_editorial, icon: FileCheck, roles: ['editor', 'data_manager', 'admin'] },
    { id: 'admin', label: t.nav_admin, icon: ShieldCheck, roles: ['admin'] }
  ];

  return (
    <aside className="w-64 bg-[#0d0f14] border-r border-[#1e2330] flex flex-col shrink-0 min-h-[calc(100vh-60px)]">
      <div className="p-4 space-y-6 flex-1">
        
        {/* Core Navigation Section */}
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5 px-3">
            Intelligence Suite
          </div>
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-red-500/15 text-red-300 border border-red-500/30 shadow-sm'
                      : item.isHighlight
                      ? 'bg-gradient-to-r from-red-600/10 to-red-700/5 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#151922]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : item.isHighlight ? 'text-red-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-red-500/20 text-red-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-red-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Role Specific Navigation */}
        {roleNav.some(r => r.roles.includes(activeRole)) && (
          <div className="pt-4 border-t border-[#1a1f2c]">
            <div className="text-[11px] font-semibold text-red-500/80 uppercase tracking-wider mb-2.5 px-3">
              Institutional Portals
            </div>
            <nav className="space-y-1">
              {roleNav
                .filter(item => item.roles.includes(activeRole))
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-[#151922]'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-600" />
                    </button>
                  );
                })}
            </nav>
          </div>
        )}

        {/* Catalog Quick Stats box */}
        <div className="mt-8 p-3.5 rounded-xl bg-gradient-to-b from-[#141722] to-[#10121a] border border-[#222838] space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400 font-medium">
            <span>Coverage</span>
            <span className="text-red-400 font-mono-numbers">300 Models</span>
          </div>
          <div className="w-full bg-[#1b202e] h-1.5 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-400 h-full w-[88%]" />
          </div>
          <div className="text-[10px] text-slate-500 flex justify-between pt-1">
            <span>25 Hero Datasheets</span>
            <span>100% Provenance</span>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="p-4 border-t border-[#1a1f2c] text-[10px] text-slate-500 flex justify-between items-center">
        <span>A.I. Engine v3.6</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
          Live Sync
        </span>
      </div>
    </aside>
  );
};
