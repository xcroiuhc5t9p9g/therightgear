import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, ArrowRight, User } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  watchlistCount: number;
  onSearch: (query: string) => void;
  onNavigate: (page: string, params?: any) => void;
  query: string;
  setQuery: (q: string) => void;
  suggestions: any[];
}

export const Header: React.FC<HeaderProps> = ({
  watchlistCount,
  onSearch,
  onNavigate,
  query,
  setQuery,
  suggestions
}) => {
  const { isAuthenticated, effectiveRole: activeRole, actualRole, previewRole, setPreviewRole, signOut, currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleSuggestionClick = (action: () => void) => {
    action();
    setSearchFocused(false);
    setQuery('');
    setSelectedIndex(-1);
    searchInputRef.current?.blur();
  };

  return (
    <header className="sticky top-0 z-50 bg-trg-warm-white border-b border-trg-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* LOGO */}
        <button 
          onClick={() => onNavigate('home')} 
          className="flex-shrink-0 focus:outline-none"
          aria-label="The Right Gear — Home"
        >
          <BrandLogo variant="light-bg" className="h-6 sm:h-8 md:h-10 max-w-[140px] sm:max-w-[165px] md:max-w-[220px]" />
        </button>

        {/* SEARCH (Desktop) */}
        <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-2xl relative">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-trg-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                onSearch(e.target.value);
                setSelectedIndex(-1);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setSelectedIndex(prev => Math.max(prev - 1, -1));
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    handleSuggestionClick(suggestions[selectedIndex].action);
                  }
                } else if (e.key === 'Escape') {
                  setSearchFocused(false);
                  searchInputRef.current?.blur();
                }
              }}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search maker, model, generation or variant"
              className="w-full bg-white text-sm text-trg-carbon placeholder-trg-gray-400 pl-11 pr-4 py-2.5 rounded-lg border border-trg-gray-300 focus:outline-none focus:border-trg-red focus:ring-1 focus:ring-trg-red transition-all"
            />
          </div>
          
          {/* Search Suggestions Dropdown */}
          {searchFocused && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-trg-gray-200 shadow-xl overflow-hidden py-2 z-50 max-h-96 overflow-y-auto">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
                  onClick={() => handleSuggestionClick(suggestion.action)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between group ${idx === selectedIndex ? 'bg-trg-gray-100' : 'hover:bg-trg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    {suggestion.thumbnail && (
                      <img src={suggestion.thumbnail} alt="" className="w-10 h-10 object-contain bg-white rounded border border-trg-gray-100" />
                    )}
                    <div>
                      <div className="font-medium text-trg-carbon">{suggestion.title}</div>
                      {suggestion.subtitle && <div className="text-xs text-trg-gray-500 mt-0.5">{suggestion.subtitle}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-trg-gray-400">{suggestion.type}</span>
                    <ArrowRight className={`w-4 h-4 transition-colors ${idx === selectedIndex ? 'text-trg-red' : 'text-trg-gray-300 group-hover:text-trg-red'}`} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* NAVIGATION (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onNavigate('explore')}
            className="text-sm font-semibold text-trg-carbon hover:text-trg-red tracking-wide uppercase transition-colors"
          >
            Explore
          </button>
          
          <div ref={userMenuRef} className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-10 h-10 rounded-full bg-trg-gray-200 flex items-center justify-center cursor-pointer hover:bg-trg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-trg-red"
            >
              <User className="w-5 h-5 text-trg-carbon" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-trg-gray-200 shadow-xl py-2 z-50">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 border-b border-trg-gray-100 bg-slate-50">
                      <p className="text-sm text-trg-carbon font-medium truncate">{currentUser?.email}</p>
                      <p className="text-xs text-trg-gray-500 font-bold capitalize mt-1">
                        {actualRole === 'super_admin' ? 'Super Admin' : actualRole?.replace('_', ' ')}
                      </p>
                    </div>

                    <div className="py-1">
                      <button onClick={() => { onNavigate('profile'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm">Profile</button>
                      <button onClick={() => { onNavigate('watchlist'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm flex justify-between items-center">
                        Watchlist 
                        {watchlistCount > 0 && <span className="bg-trg-red text-white text-[10px] px-1.5 py-0.5 rounded font-bold">{watchlistCount}</span>}
                      </button>
                    </div>

                    {actualRole === 'super_admin' && (
                      <>
                        <div className="border-t border-trg-gray-100 my-1"></div>
                        <div className="px-4 py-1">
                          <p className="text-[10px] font-bold text-trg-gray-400 uppercase tracking-wider mb-1">Administration</p>
                        </div>
                        <button onClick={() => { onNavigate('super_admin'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-1.5 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm">Users & Roles</button>
                      </>
                    )}

                    {(actualRole === 'super_admin' || actualRole === 'editor') && (
                      <>
                        <div className="border-t border-trg-gray-100 my-1"></div>
                        <div className="px-4 py-1">
                          <p className="text-[10px] font-bold text-trg-gray-400 uppercase tracking-wider mb-1">Editorial</p>
                        </div>
                        <button onClick={() => { onNavigate('editorial'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-1.5 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm">Editorial</button>
                        {actualRole === 'super_admin' && (
                          <button onClick={() => { onNavigate('import-lab'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-1.5 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm">Import Lab</button>
                        )}
                      </>
                    )}

                    {actualRole === 'super_admin' && (
                      <>
                        <div className="border-t border-trg-gray-100 my-1"></div>
                        <div className="px-4 py-1">
                          <p className="text-[10px] font-bold text-trg-gray-400 uppercase tracking-wider mb-1">View As</p>
                        </div>
                        {['visitor', 'private_user', 'corporate_user', 'editor', 'super_admin'].map((role) => {
                          const isCurrent = previewRole ? previewRole === role : (role === 'super_admin');
                          return (
                            <button
                              key={role}
                              onClick={() => {
                                setPreviewRole(role === 'super_admin' ? null : role as any);
                                setUserMenuOpen(false);
                              }}
                              className={`w-full text-left px-4 py-1.5 hover:bg-trg-gray-50 font-medium text-sm ${isCurrent ? 'text-trg-red font-bold' : 'text-trg-carbon'}`}
                            >
                              {role.replace('_', ' ')}
                            </button>
                          );
                        })}
                      </>
                    )}

                    <div className="border-t border-trg-gray-100 mt-1"></div>
                    <button onClick={() => { signOut(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm pt-2">Sign out</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { onNavigate('register'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium">Sign in</button>
                    <button onClick={() => { onNavigate('register'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium">Create account</button>
                  </>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button 
          className="md:hidden p-2 text-trg-carbon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE SEARCH BAR (Row 2) */}
      <div className="md:hidden border-t border-trg-gray-200 px-4 py-3 relative z-40 bg-trg-warm-white">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-trg-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
            }}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            placeholder="Search maker, model, generation or variant"
            className="w-full bg-white text-sm text-trg-carbon placeholder-trg-gray-400 pl-11 pr-4 py-2.5 rounded-lg border border-trg-gray-300 focus:outline-none focus:border-trg-red focus:ring-1 focus:ring-trg-red transition-all"
          />
        </div>
        
        {/* Mobile Search Suggestions Dropdown */}
        {searchFocused && suggestions.length > 0 && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-lg border border-trg-gray-200 shadow-xl overflow-hidden py-2 z-50 max-h-80 overflow-y-auto">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSuggestionClick(suggestion.action)}
                className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-trg-gray-50 border-b border-trg-gray-100 last:border-0"
              >
                <div>
                  <div className="font-medium text-trg-carbon">{suggestion.title}</div>
                  {suggestion.subtitle && <div className="text-xs text-trg-gray-500 mt-0.5">{suggestion.subtitle}</div>}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-trg-gray-400 ml-2">{suggestion.type}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* MOBILE MENU EXPANDED */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-trg-warm-white border-t border-trg-gray-200 p-4 space-y-6">
          <nav className="flex flex-col gap-4">
            <button 
              onClick={() => { onNavigate('explore'); setMobileMenuOpen(false); }}
              className="text-left font-bold text-lg text-trg-carbon py-2"
            >
              Explore
            </button>
            <div className="border-t border-trg-gray-200 pt-4 flex flex-col gap-4">
              {isAuthenticated ? (
                <>
                  <div className="py-2">
                    <p className="text-sm text-trg-carbon font-medium truncate">{currentUser?.email}</p>
                    <p className="text-xs text-trg-gray-500 font-bold capitalize mt-1">
                      {actualRole === 'super_admin' ? 'Super Admin' : actualRole?.replace('_', ' ')}
                    </p>
                  </div>
                  
                  <button onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Profile</button>
                  <button onClick={() => { onNavigate('watchlist'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2 flex justify-between items-center w-full">
                    Watchlist
                    {watchlistCount > 0 && <span className="bg-trg-red text-white text-xs px-2 py-0.5 rounded font-bold">{watchlistCount}</span>}
                  </button>

                  {actualRole === 'super_admin' && (
                    <>
                      <div className="border-t border-trg-gray-200 mt-2 pt-2"></div>
                      <span className="text-xs font-bold uppercase text-trg-gray-400 block mb-1">Administration</span>
                      <button onClick={() => { onNavigate('super_admin'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2 block w-full">Users & Roles</button>
                    </>
                  )}

                  {(actualRole === 'super_admin' || actualRole === 'editor') && (
                    <>
                      <div className="border-t border-trg-gray-200 mt-2 pt-2"></div>
                      <span className="text-xs font-bold uppercase text-trg-gray-400 block mb-1">Editorial</span>
                      <button onClick={() => { onNavigate('editorial'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2 block w-full">Editorial</button>
                      {actualRole === 'super_admin' && (
                        <button onClick={() => { onNavigate('import-lab'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2 block w-full">Import Lab</button>
                      )}
                    </>
                  )}
                  
                  {actualRole === 'super_admin' && (
                     <div className="border-t border-trg-gray-200 mt-2 pt-2 flex flex-col gap-2">
                       <span className="text-xs font-bold uppercase text-trg-gray-400 block mb-1">View As</span>
                       {(['visitor', 'private_user', 'corporate_user', 'editor', 'super_admin'] as const).map(role => (
                         <button key={role} onClick={() => { setPreviewRole(role === 'super_admin' ? null : role); setMobileMenuOpen(false); }} className={`text-left font-bold text-lg py-1 ${previewRole === role || (role === 'super_admin' && !previewRole) ? 'text-trg-red' : 'text-trg-carbon'}`}>
                           <span className="capitalize">{role.replace('_', ' ')}</span>
                         </button>
                       ))}
                     </div>
                  )}
                  
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2 border-t border-trg-gray-200 mt-2 w-full block">Sign out</button>
                </>
              ) : (
                <>
                  <button onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Sign in</button>
                  <button onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Create account</button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
