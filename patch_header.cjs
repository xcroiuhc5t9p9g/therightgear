const fs = require('fs');

let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

// 1. Add `actualRole`, `previewRole`, `setPreviewRole` to useAuth call
header = header.replace(
  'const { isAuthenticated, activeRole, signOut, currentUser } = useAuth();',
  'const { isAuthenticated, effectiveRole: activeRole, actualRole, previewRole, setPreviewRole, signOut, currentUser } = useAuth();'
);

// 2. Replace the desktop dropdown menu
const desktopMenuRegex = /<div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-trg-gray-200 shadow-xl py-2 z-50">[\s\S]*?<\/div>\s*<\/div>\s*<\/nav>/m;

const newDesktopMenu = `<div className="absolute right-0 mt-2 w-64 bg-white rounded-lg border border-trg-gray-200 shadow-xl py-2 z-50">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 border-b border-trg-gray-100">
                      <p className="text-sm text-trg-carbon font-medium truncate">{currentUser?.email}</p>
                      <p className="text-xs text-trg-gray-500 capitalize">{actualRole?.replace('_', ' ')}</p>
                    </div>
                    
                    <button onClick={() => { onNavigate('profile'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm">My Profile</button>
                    <button onClick={() => { onNavigate('watchlist'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm flex justify-between">Watchlist {watchlistCount > 0 && <span className="bg-trg-red text-white text-[10px] px-1.5 py-0.5 rounded">{watchlistCount}</span>}</button>
                    
                    {actualRole === 'corporate_user' && (
                      <button onClick={() => { onNavigate('profile'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm">Corporate Profile</button>
                    )}

                    {(actualRole === 'super_admin' || actualRole === 'editor') && (
                      <div className="border-t border-trg-gray-100 mt-1 pt-1">
                         <div className="px-4 py-1 text-[10px] font-bold text-trg-gray-400 uppercase tracking-wider">Administration</div>
                         <button onClick={() => { onNavigate('admin'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm">Users & Roles</button>
                         <button onClick={() => { onNavigate('editorial'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm">Editorial</button>
                      </div>
                    )}
                    
                    {actualRole === 'super_admin' && (
                      <div className="border-t border-trg-gray-100 mt-1 pt-1">
                        <div className="px-4 py-1 text-[10px] font-bold text-trg-gray-400 uppercase tracking-wider">View as</div>
                        {(['visitor', 'private_user', 'corporate_user', 'editor', 'super_admin'] as const).map(role => (
                          <button 
                            key={role}
                            onClick={() => { 
                              setPreviewRole(role === 'super_admin' ? null : role); 
                              setUserMenuOpen(false); 
                            }} 
                            className={\`w-full text-left px-4 py-1.5 hover:bg-trg-gray-50 font-medium text-sm flex items-center justify-between \${previewRole === role || (role === 'super_admin' && !previewRole) ? 'text-trg-red' : 'text-trg-carbon'}\`}
                          >
                            <span className="capitalize">{role.replace('_', ' ')}</span>
                            {(previewRole === role || (role === 'super_admin' && !previewRole)) && <span className="w-1.5 h-1.5 rounded-full bg-trg-red"></span>}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <button onClick={() => { signOut(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm border-t border-trg-gray-100 mt-1 pt-2">Sign out</button>
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
        </nav>`;

header = header.replace(desktopMenuRegex, newDesktopMenu);

// 3. Add the Preview Banner at the top of the header if previewRole is active
const headerTagRegex = /<header className="bg-trg-warm-white border-b border-trg-gray-200 sticky top-0 z-50">/m;
const previewBanner = `<header className="bg-trg-warm-white border-b border-trg-gray-200 sticky top-0 z-50">
      {previewRole && (
        <div className="bg-trg-carbon text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 flex justify-between items-center">
          <span>VIEWING AS {previewRole.replace('_', ' ')}</span>
          <button onClick={() => setPreviewRole(null)} className="text-trg-gray-300 hover:text-white underline decoration-trg-gray-500 underline-offset-2">Exit Preview</button>
        </div>
      )}`;

header = header.replace(headerTagRegex, previewBanner);

fs.writeFileSync('src/components/Header.tsx', header);
