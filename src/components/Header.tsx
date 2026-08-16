import { useSearchController } from '../hooks/useSearchController';
import { SearchDiscoveryPanel } from './SearchDiscoveryPanel';
import { Container } from "./ui-blocks";
import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, ArrowRight, User } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  watchlistCount: number;
  onNavigate: (page: string, params?: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  watchlistCount,
  onNavigate,
}) => {
  const { isAuthenticated, effectiveRole: activeRole, actualRole, previewRole, setPreviewRole, signOut, currentUser, emailVerified } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { query, setQuery, suggestions, discoveryActions, searchFocused, setSearchFocused, selectedIndex, setSelectedIndex, handleSuggestionClick, handleKeyDown } = useSearchController(onNavigate);

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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <header className="bg-white border-b border-trg-gray-200 sticky top-0 z-40">
      <Container className="h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
          <BrandLogo className="w-[150px] sm:w-[180px] lg:w-[210px] h-auto flex-shrink-0" />
        </div>

        {/* SEARCH BAR (Desktop) */}
        <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-trg-gray-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchFocused(true);
                setSelectedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search makers, models, generations, variants..."
              className="w-full bg-white text-sm text-trg-carbon placeholder-trg-gray-400 pl-11 pr-4 py-2.5 rounded-lg border border-trg-gray-300 focus:outline-none focus:border-trg-red focus:ring-1 focus:ring-trg-red transition-all"
            />
          </div>
          
          {/* Search Suggestions Dropdown */}
          {searchFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-trg-gray-200 shadow-xl overflow-hidden py-2 z-50 max-h-[500px] overflow-y-auto">
              <SearchDiscoveryPanel
                  query={query}
                  suggestions={suggestions}
                  discoveryActions={discoveryActions}
                  selectedIndex={selectedIndex} 
                 onNavigate={onNavigate}
                 handleSuggestionClick={handleSuggestionClick}
              />
            </div>
          )}
        </div>

        {/* NAVIGATION (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          
          <div ref={userMenuRef} className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-10 h-10 rounded-full bg-trg-gray-200 flex items-center justify-center cursor-pointer hover:bg-trg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-trg-red"
            >
              <User className="w-5 h-5 text-trg-carbon" />
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-trg-gray-200 shadow-xl py-2 z-50">
                {!isAuthenticated ? (
                  <div className="py-1">
                    <button onClick={() => { onNavigate('auth', { mode: 'signin' }); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm">Login</button>
                    <button onClick={() => { onNavigate('auth', { mode: 'signup' }); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm">Registrati</button>
                  </div>
                ) : (
                  !emailVerified ? (
                    <>
                      <div className="px-4 py-3 border-b border-trg-gray-100 bg-slate-50">
                        <p className="text-sm text-trg-carbon font-medium truncate">{currentUser?.email}</p>
                        <p className="text-xs text-amber-600 font-bold mt-1">Email verification required</p>
                      </div>
                      <div className="py-1">
                        <button onClick={() => { onNavigate('verify-email'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm">Verify email</button>
                      </div>
                      <div className="border-t border-trg-gray-100 mt-1"></div>
                      <button onClick={() => { signOut(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-red-50 text-trg-red font-bold text-sm pt-2">Sign out</button>
                    </>
                  ) : (
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
                                  setPreviewRole(role === 'super_admin' ? null : role);
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
                      <button onClick={() => { signOut(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-red-50 text-trg-red font-bold text-sm pt-2">Sign out</button>
                    </>
                  )
                )}
              </div>
            )}
          </div>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => {
              setSearchFocused(false);
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="w-10 h-10 flex items-center justify-center text-trg-carbon hover:bg-trg-gray-100 rounded-full transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </Container>

      {/* MOBILE SEARCH (Row 2, always visible on mobile) */}
      <div className="md:hidden border-t border-trg-gray-100 bg-white px-4 py-2">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-trg-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchFocused(true);
              setSelectedIndex(-1);
            }}
              onKeyDown={handleKeyDown}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search makers, models..."
            className="w-full bg-trg-gray-50 text-sm text-trg-carbon placeholder-trg-gray-500 pl-11 pr-4 py-2.5 rounded-lg border border-trg-gray-200 focus:outline-none focus:border-trg-red focus:bg-white transition-all"
          />
        </div>
        
        {/* Mobile Search Suggestions Dropdown */}
        {searchFocused && (
          <div className="absolute left-4 right-4 mt-2 bg-white rounded-lg border border-trg-gray-200 shadow-xl overflow-hidden py-2 z-50 max-h-[400px] overflow-y-auto">
             <SearchDiscoveryPanel
                  query={query}
                  suggestions={suggestions}
                  discoveryActions={discoveryActions}
                  selectedIndex={selectedIndex} 
                 onNavigate={onNavigate}
                 handleSuggestionClick={handleSuggestionClick}
              />
          </div>
        )}
      </div>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-trg-gray-200 shadow-xl overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          <div className="p-4 flex flex-col gap-6">

            <nav className="flex flex-col gap-2">
              
              {isAuthenticated ? (
                !emailVerified ? (
                  <>
                    <div className="py-2 border-b border-trg-gray-100">
                      <p className="text-sm text-trg-carbon font-medium truncate">{currentUser?.email}</p>
                      <p className="text-xs text-amber-600 font-bold mt-1">Email verification required</p>
                    </div>
                    <button onClick={() => { onNavigate('verify-email'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Verify email</button>
                    <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-red py-2 mt-2 w-full block">Sign out</button>
                  </>
                ) : (
                  <>
                    <div className="py-2 border-b border-trg-gray-100 mb-2">
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
                    
                    <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-red py-2 border-t border-trg-gray-200 mt-4 w-full block">Sign out</button>
                  </>
                )
              ) : (
                <>
                  <button onClick={() => { onNavigate('auth', { mode: 'signin' }); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Login</button>
                  <button onClick={() => { onNavigate('auth', { mode: 'signup' }); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Registrati</button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
