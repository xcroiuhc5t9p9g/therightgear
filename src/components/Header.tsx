import React, { useState, useEffect, useRef } from 'react';
import { Search, Compass, User, X, Command, Car, ShieldCheck, FileCheck, Building2, ChevronDown, Sun, Moon, UserPlus, Scale, Heart, Sparkles, Wrench, Palette, Layers, Database } from 'lucide-react';
import { UserRole } from '../types';
import { Locale, translations } from '../data/translations';
import { useTheme } from '../context/ThemeContext';
import { MANUFACTURERS } from '../data/catalogData';
import { KEY_ENTITIES } from '../data/entitiesData';
import { unifiedVehicleStore } from '../services/unifiedVehicleStore';
import { Logo } from './Logo';

interface HeaderProps {
  locale: Locale;
  setLocale?: (l: Locale) => void;
  activeRole: UserRole;
  setActiveRole: (r: UserRole) => void;
  watchlistCount: number;
  compareCount: number;
  onSearch: (q: string) => void;
  onNavigate: (page: string, slug?: string) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({
  locale,
  activeRole,
  setActiveRole,
  watchlistCount,
  compareCount,
  onSearch,
  onNavigate,
  currentPage,
}) => {
  const t = translations[locale];
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered Suggestion Items categorized strictly
  const trimmedQuery = query.trim().toLowerCase();
  const allVehicles = unifiedVehicleStore.getAll();
  
  const suggestedBrands = trimmedQuery.length >= 1 
    ? MANUFACTURERS.filter(m => m.official_name.toLowerCase().includes(trimmedQuery) || m.slug.toLowerCase().includes(trimmedQuery)).slice(0, 3)
    : [];

  const suggestedVehicles = trimmedQuery.length >= 1
    ? allVehicles.filter(v => 
        v.model_name.toLowerCase().includes(trimmedQuery) || 
        v.variant_name.toLowerCase().includes(trimmedQuery) || 
        v.manufacturer_name.toLowerCase().includes(trimmedQuery) ||
        v.slug.toLowerCase().includes(trimmedQuery)
      ).slice(0, 4)
    : [];

  const suggestedDesigners = trimmedQuery.length >= 1
    ? KEY_ENTITIES.filter(e => 
        e.type === 'Designer' && 
        (e.name.toLowerCase().includes(trimmedQuery) || e.roleTitle.toLowerCase().includes(trimmedQuery))
      ).slice(0, 3)
    : [];

  const suggestedEngineers = trimmedQuery.length >= 1
    ? KEY_ENTITIES.filter(e => 
        e.type === 'Engineer' && 
        (e.name.toLowerCase().includes(trimmedQuery) || e.roleTitle.toLowerCase().includes(trimmedQuery))
      ).slice(0, 3)
    : [];

  const suggestedCoachbuilders = trimmedQuery.length >= 1
    ? KEY_ENTITIES.filter(e => 
        e.type === 'Coachbuilder / Design House' && 
        (e.name.toLowerCase().includes(trimmedQuery) || e.roleTitle.toLowerCase().includes(trimmedQuery))
      ).slice(0, 3)
    : [];

  const hasSuggestions = 
    suggestedBrands.length > 0 || 
    suggestedVehicles.length > 0 || 
    suggestedDesigners.length > 0 || 
    suggestedEngineers.length > 0 || 
    suggestedCoachbuilders.length > 0;

  // Keyboard shortcut Cmd/Ctrl + K or /
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const el = document.getElementById('global-search-input');
        if (el) el.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const el = document.getElementById('global-search-input');
        if (el) el.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      onNavigate('market');
      setSearchFocused(false);
      setMobileSearchOpen(false);
    }
  };

  const isEditorOrAdmin = activeRole === 'editor' || activeRole === 'admin' || activeRole === 'data_manager';

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#0c0e12]/95 backdrop-blur-md border-b border-[#1f2430]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => onNavigate('market')}
              className="flex items-center text-left group cursor-pointer hover:opacity-95 transition-opacity"
              aria-label="The Right Gear Home"
            >
              <Logo theme={theme} size="md" />
            </button>
          </div>

          {/* Desktop Global Search - Suggest As You Type */}
          <div className="hidden md:flex flex-1 max-w-[560px] mx-2 relative items-center" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="global-search-input"
                type="text"
                value={query}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  onSearch(e.target.value);
                  setSearchFocused(true);
                }}
                placeholder="Search Manufacturer, Model, Designer, Engineer, Coachbuilder..."
                className="w-full bg-[#151923] text-xs text-slate-100 placeholder-slate-500 pl-10 pr-16 py-2.5 rounded-xl border border-[#232a3d] focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/30 transition-all font-sans"
              />
              <div className="absolute right-3 flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-[#1c2232] px-1.5 py-0.5 rounded border border-[#2a3348] pointer-events-none">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            </form>

            {/* Suggest As You Type Overlay Panel */}
            {searchFocused && hasSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#121520] border border-[#283146] rounded-2xl shadow-2xl z-50 p-3 space-y-3 max-h-[460px] overflow-y-auto animate-fadeIn">
                
                {/* 1) Automobile Manufacturer (Produttore Auto) */}
                {suggestedBrands.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider px-2 mb-1.5 flex items-center space-x-1">
                      <Building2 className="w-3 h-3 text-red-400" />
                      <span>Produttori Auto (Manufacturer)</span>
                    </div>
                    <div className="space-y-1">
                      {suggestedBrands.map(b => (
                        <button
                          key={b.id}
                          onClick={() => {
                            onSearch(b.official_name);
                            onNavigate('market');
                            setSearchFocused(false);
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-slate-200 hover:bg-[#1a2030] hover:text-red-300 transition-all text-left cursor-pointer border border-transparent hover:border-red-500/20"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-bold">{b.official_name}</span>
                            <span className="text-[10px] font-mono text-slate-500">({b.country_code})</span>
                          </div>
                          <span className="text-[10px] text-red-400 font-semibold">Pagina Brand →</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2) Car Model & Variants (Modello Auto e Varianti) */}
                {suggestedVehicles.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider px-2 mb-1.5 flex items-center space-x-1">
                      <Car className="w-3 h-3 text-sky-400" />
                      <span>Modelli Auto & Varianti Specs</span>
                    </div>
                    <div className="space-y-1">
                      {suggestedVehicles.map(v => (
                        <button
                          key={v.id}
                          onClick={() => {
                            onNavigate('detail', v.slug);
                            setSearchFocused(false);
                          }}
                          className="w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-xl text-xs text-slate-200 hover:bg-[#1a2030] hover:text-sky-300 transition-all text-left cursor-pointer group border border-transparent hover:border-sky-500/20"
                        >
                          <img src={v.hero_image_url} alt={v.model_name} className="w-8 h-8 rounded object-cover shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="font-bold truncate">{v.manufacturer_name} {v.model_name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{v.variant_name}</div>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-red-400 shrink-0">
                            Scheda Dati →
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3) Designers */}
                {suggestedDesigners.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider px-2 mb-1.5 flex items-center space-x-1">
                      <Palette className="w-3 h-3 text-purple-400" />
                      <span>Designer</span>
                    </div>
                    <div className="space-y-1">
                      {suggestedDesigners.map(e => (
                        <button
                          key={e.id}
                          onClick={() => {
                            onNavigate('entity', e.slug);
                            setSearchFocused(false);
                          }}
                          className="w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:bg-purple-950/40 hover:border-purple-500/30 border border-transparent transition-all text-left cursor-pointer"
                        >
                          <img src={e.avatarUrl} alt={e.name} className="w-7 h-7 rounded-full object-cover shrink-0 border border-purple-500/40" />
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-purple-300">{e.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{e.roleTitle}</div>
                          </div>
                          <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30 font-mono font-bold shrink-0">
                            BIO
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4) Engineers */}
                {suggestedEngineers.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 mb-1.5 flex items-center space-x-1">
                      <Wrench className="w-3 h-3 text-emerald-400" />
                      <span>Ingegneri</span>
                    </div>
                    <div className="space-y-1">
                      {suggestedEngineers.map(e => (
                        <button
                          key={e.id}
                          onClick={() => {
                            onNavigate('entity', e.slug);
                            setSearchFocused(false);
                          }}
                          className="w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:bg-emerald-950/40 hover:border-emerald-500/30 border border-transparent transition-all text-left cursor-pointer"
                        >
                          <img src={e.avatarUrl} alt={e.name} className="w-7 h-7 rounded-full object-cover shrink-0 border border-emerald-500/40" />
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-emerald-300">{e.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{e.roleTitle}</div>
                          </div>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30 font-mono font-bold shrink-0">
                            TECH FILE
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5) Coachbuilder / Carrozzeria */}
                {suggestedCoachbuilders.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider px-2 mb-1.5 flex items-center space-x-1">
                      <Layers className="w-3 h-3 text-rose-400" />
                      <span>Carrozzeria & Centro Stile</span>
                    </div>
                    <div className="space-y-1">
                      {suggestedCoachbuilders.map(e => (
                        <button
                          key={e.id}
                          onClick={() => {
                            onNavigate('entity', e.slug);
                            setSearchFocused(false);
                          }}
                          className="w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs text-slate-200 hover:bg-rose-950/40 hover:border-rose-500/30 border border-transparent transition-all text-left cursor-pointer"
                        >
                          <img src={e.avatarUrl} alt={e.name} className="w-7 h-7 rounded-md object-cover shrink-0 border border-rose-500/40" />
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-rose-300">{e.name}</div>
                            <div className="text-[10px] text-slate-400 truncate">{e.roleTitle}</div>
                          </div>
                          <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded border border-rose-500/30 font-mono font-bold shrink-0">
                            STILE
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Navigation Items & User Menu */}
          <div className="flex items-center space-x-3 shrink-0">
            
            {/* Primary Main Menu Link: MARKET (Unica Banca Dati Veicoli) */}
            <button
              onClick={() => onNavigate('market')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                currentPage === 'market' || currentPage === 'explore' || currentPage === 'home'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-[#151923] text-slate-200 hover:text-white border border-[#232a3d] hover:border-[#323d57]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>MARKET</span>
            </button>

            {/* Mobile Search Icon Trigger */}
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-[#1a1f2c]"
              aria-label="Open Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="h-4 w-px bg-[#232938] hidden sm:block" />

            {/* Role & User Profile Matrix Dropdown Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  profileMenuOpen
                    ? 'bg-[#1a202c] border-red-500/50 text-white ring-1 ring-red-500/20'
                    : 'bg-[#12151e] border-[#232a3d] hover:border-[#323d57] text-slate-200'
                }`}
                title="Profilo & Gestione Utente"
              >
                <div className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                  {activeRole === 'admin' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  ) : isEditorOrAdmin ? (
                    <FileCheck className="w-3.5 h-3.5 text-purple-400" />
                  ) : activeRole.includes('dealer') || activeRole.includes('corporate') ? (
                    <Building2 className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-red-400" />
                  )}
                </div>
                <span className="hidden lg:inline-block text-xs font-semibold text-slate-200 capitalize">
                  {activeRole === 'public' ? 'Guest / Unregistered' :
                   activeRole === 'registered_user' ? 'Registered User' :
                   activeRole === 'premium_user' ? 'Subscriber' :
                   activeRole === 'dealer' ? 'Dealer' :
                   activeRole === 'corporate_premium' ? 'Corporate Sub' :
                   activeRole === 'editor' ? 'Editor' :
                   activeRole === 'data_manager' ? 'Data Manager' :
                   activeRole === 'admin' ? 'Admin' : 'Guest'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileMenuOpen ? 'rotate-180 text-red-400' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-[#121520] border border-[#283146] rounded-2xl shadow-2xl z-50 p-3 space-y-3 animate-fadeIn">
                  
                  {/* Account Matrix Header */}
                  <div className="p-3 bg-[#181c28] rounded-xl border border-[#232a3d] space-y-2">
                    <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">User Profile Matrix</div>
                    <div className="text-xs font-bold text-red-400 flex items-center justify-between">
                      <span>
                        {activeRole === 'public' && 'Unregistered User (Guest)'}
                        {activeRole === 'registered_user' && 'Registered User'}
                        {activeRole === 'premium_user' && 'Premium Subscriber'}
                        {activeRole === 'dealer' && 'Business Dealer'}
                        {activeRole === 'corporate_premium' && 'Corporate Subscriber'}
                        {activeRole === 'editor' && 'Editorial Member'}
                        {activeRole === 'data_manager' && 'Data Manager'}
                        {activeRole === 'admin' && 'System Administrator'}
                      </span>
                      <span className="text-[9px] bg-red-500/20 text-red-300 px-1.5 py-0.2 rounded border border-red-500/30 font-mono">
                        {activeRole === 'public' ? 'UNREGISTERED' : 'ACTIVE'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#252d42] grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          onNavigate('profile');
                          setProfileMenuOpen(false);
                        }}
                        className="px-2 py-1.5 bg-[#1f2638] hover:bg-[#28324a] text-slate-200 text-[11px] font-bold rounded-lg border border-[#2e3a54] flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <User className="w-3 h-3 text-red-400" />
                        <span>Profilo</span>
                      </button>

                      <button
                        onClick={() => {
                          onNavigate('register');
                          setProfileMenuOpen(false);
                        }}
                        className="px-2 py-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-300 text-[11px] font-bold rounded-lg border border-red-500/30 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <UserPlus className="w-3 h-3 text-red-400" />
                        <span>Piani & Matrix</span>
                      </button>
                    </div>

                    {/* Saved Watchlist & Compare Contextual Actions */}
                    <div className="pt-2 border-t border-[#252d42] space-y-1">
                      <button
                        onClick={() => {
                          if (activeRole === 'public') {
                            onNavigate('register');
                          } else {
                            onNavigate('watchlist');
                          }
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#1a202c] hover:bg-[#222a3a] text-slate-200 text-xs font-semibold border border-[#2a344a] cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
                          <span>Lista Preferiti (Watchlist)</span>
                        </div>
                        {watchlistCount > 0 && (
                          <span className="bg-rose-500 text-white font-extrabold text-[10px] px-1.5 py-0.2 rounded-full font-mono-numbers">
                            {watchlistCount}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          if (activeRole === 'public') {
                            onNavigate('register');
                          } else {
                            onNavigate('compare');
                          }
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#1a202c] hover:bg-[#222a3a] text-slate-200 text-xs font-semibold border border-[#2a344a] cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <Scale className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Confronta Veicoli</span>
                        </div>
                        {compareCount > 0 && (
                          <span className="bg-indigo-500 text-white font-extrabold text-[10px] px-1.5 py-0.2 rounded-full font-mono-numbers">
                            {compareCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Back-Office & Gestione Banca Dati Section */}
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                      Back-Office & Gestione Dati
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          onNavigate('admin');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-red-950/40 hover:border-red-500/30 border border-transparent transition-all cursor-pointer text-left"
                      >
                        <Database className="w-4 h-4 text-red-400 shrink-0" />
                        <div>
                          <div className="font-bold text-red-300">Gestione Banca Dati Veicoli</div>
                          <div className="text-[10px] text-slate-400">Importa CSV/JSON, modifica e pubblica</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          onNavigate('editorial');
                          setProfileMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-purple-950/40 hover:border-purple-500/30 border border-transparent transition-all cursor-pointer text-left"
                      >
                        <FileCheck className="w-4 h-4 text-purple-400 shrink-0" />
                        <div>
                          <div className="font-bold text-purple-300">Console Redazionale</div>
                          <div className="text-[10px] text-slate-400">Verifica fonti e asserzioni</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          toggleTheme();
                        }}
                        className="w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 border border-transparent transition-all cursor-pointer text-left"
                      >
                        {theme === 'dark' ? (
                          <>
                            <Sun className="w-4 h-4 text-red-400 shrink-0" />
                            <div>
                              <div className="font-bold text-red-300">Tema: Modalità Chiara</div>
                              <div className="text-[10px] text-slate-400">Imposta lo sfondo chiaro</div>
                            </div>
                          </>
                        ) : (
                          <>
                            <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
                            <div>
                              <div className="font-bold text-indigo-300">Tema: Modalità Scura</div>
                              <div className="text-[10px] text-slate-400">Imposta lo sfondo scuro</div>
                            </div>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Switch Role Quick Matrix Matrix Selector */}
                  <div className="pt-2 border-t border-[#1f2536] space-y-1.5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
                      Select Role & Visit Mode
                    </div>

                    <button
                      onClick={() => {
                        setActiveRole('public');
                        setProfileMenuOpen(false);
                      }}
                      className={`w-full py-1.5 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        activeRole === 'public'
                          ? 'bg-red-600 text-white border-red-400 shadow-md'
                          : 'bg-[#171b28] text-red-300 border-[#2a344c] hover:bg-red-500/10'
                      }`}
                    >
                      <span>Unregistered User</span>
                      <span className="text-[9px] font-mono opacity-80">(Public View)</span>
                    </button>

                    <div className="grid grid-cols-2 gap-1 text-[10px] pt-1">
                      {[
                        { id: 'registered_user', label: 'Registered User' },
                        { id: 'premium_user', label: 'Subscriber' },
                        { id: 'dealer', label: 'Dealer' },
                        { id: 'corporate_premium', label: 'Corporate Sub' },
                        { id: 'editor', label: 'Editor' },
                        { id: 'data_manager', label: 'Data Manager' },
                        { id: 'admin', label: 'Admin' }
                      ].map((r) => (
                        <button
                          key={r.id}
                          onClick={() => {
                            setActiveRole(r.id as UserRole);
                            setProfileMenuOpen(false);
                          }}
                          className={`px-1.5 py-1 rounded-lg border text-center font-bold transition-all cursor-pointer truncate ${
                            activeRole === r.id
                              ? 'bg-red-600 text-white border-red-400'
                              : 'bg-[#171b28] text-slate-300 border-[#283146] hover:bg-[#20273a] hover:text-white'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Search Overlay with Suggest-As-You-Type */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-[#0c0e12]/98 backdrop-blur-lg p-4 flex flex-col md:hidden overflow-y-auto">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#222838]">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-red-400" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                placeholder="Cerca marca, modello, designer, ingegnere..."
                className="w-full bg-[#161a26] text-sm text-white placeholder-slate-500 pl-9 pr-4 py-2.5 rounded-xl border border-[#2d364c] focus:outline-none focus:border-red-500"
              />
            </form>
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-[#161a26] border border-[#283044]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Suggestion List */}
          {hasSuggestions && (
            <div className="pt-4 space-y-4">
              {suggestedBrands.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-2">Produttori Auto</div>
                  <div className="space-y-1">
                    {suggestedBrands.map(b => (
                      <button
                        key={b.id}
                        onClick={() => {
                          onSearch(b.official_name);
                          onNavigate('market');
                          setMobileSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-lg bg-[#181c28] text-xs font-bold text-slate-200"
                      >
                        <span>{b.official_name}</span>
                        <span className="text-red-400 text-[10px]">Vedi Produttore →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {suggestedVehicles.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-2">Modelli & Varianti</div>
                  <div className="space-y-1">
                    {suggestedVehicles.map(v => (
                      <button
                        key={v.id}
                        onClick={() => {
                          onNavigate('detail', v.slug);
                          setMobileSearchOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 p-2 rounded-lg bg-[#181c28] text-xs text-left"
                      >
                        <img src={v.hero_image_url} alt="" className="w-8 h-8 rounded object-cover" />
                        <div>
                          <div className="font-bold text-slate-100">{v.manufacturer_name} {v.model_name}</div>
                          <div className="text-[10px] text-slate-400">{v.variant_name}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(suggestedDesigners.length > 0 || suggestedEngineers.length > 0 || suggestedCoachbuilders.length > 0) && (
                <div>
                  <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-2">Figure Storiche & Carrozzerie</div>
                  <div className="space-y-1">
                    {[...suggestedDesigners, ...suggestedEngineers, ...suggestedCoachbuilders].map(e => (
                      <button
                        key={e.id}
                        onClick={() => {
                          onNavigate('entity', e.slug);
                          setMobileSearchOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 p-2 rounded-lg bg-[#181c28] text-xs text-left"
                      >
                        <img src={e.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-purple-300">{e.name}</div>
                          <div className="text-[10px] text-slate-400">{e.roleTitle}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

