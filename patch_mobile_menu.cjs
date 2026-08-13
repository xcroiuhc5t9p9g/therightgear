const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

const targetMobileMenu = `{isAuthenticated ? (
                <>
                  <div className="py-2">
                    <p className="text-sm text-trg-carbon font-medium truncate">{currentUser?.email}</p>
                    <p className="text-xs text-trg-gray-500 capitalize">{actualRole?.replace('_', ' ')}</p>
                  </div>
                  <button onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">My Profile</button>
                  <button onClick={() => { onNavigate('watchlist'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Watchlist</button>
                  
                  {actualRole === 'corporate_user' && (
                     <button onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Corporate Profile</button>
                  )}

                  {(actualRole === 'super_admin' || actualRole === 'editor') && (
                     <button onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Editor/Admin</button>
                  )}
                  
                  {actualRole === 'super_admin' && (
                     <div className="border-t border-trg-gray-200 mt-2 pt-2 flex flex-col gap-2">
                       <span className="text-xs font-bold uppercase text-trg-gray-400">View As</span>
                       {(['visitor', 'private_user', 'corporate_user', 'editor', 'super_admin'] as const).map(role => (
                         <button key={role} onClick={() => { setPreviewRole(role === 'super_admin' ? null : role); setMobileMenuOpen(false); }} className={\`text-left font-bold text-lg py-1 \${previewRole === role || (role === 'super_admin' && !previewRole) ? 'text-trg-red' : 'text-trg-carbon'}\`}>
                           <span className="capitalize">{role.replace('_', ' ')}</span>
                         </button>
                       ))}
                     </div>
                  )}
                  
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2 border-t border-trg-gray-200 mt-2">Sign out</button>
                </>
              ) : (`;

const replacementMobileMenu = `{isAuthenticated ? (
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
                         <button key={role} onClick={() => { setPreviewRole(role === 'super_admin' ? null : role); setMobileMenuOpen(false); }} className={\`text-left font-bold text-lg py-1 \${previewRole === role || (role === 'super_admin' && !previewRole) ? 'text-trg-red' : 'text-trg-carbon'}\`}>
                           <span className="capitalize">{role.replace('_', ' ')}</span>
                         </button>
                       ))}
                     </div>
                  )}
                  
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2 border-t border-trg-gray-200 mt-2 w-full block">Sign out</button>
                </>
              ) : (`

if (!code.includes(targetMobileMenu)) {
    console.log("Could not find mobile target menu!");
    fs.writeFileSync('debug_header.txt', code);
} else {
    code = code.replace(targetMobileMenu, replacementMobileMenu);
    fs.writeFileSync('src/components/Header.tsx', code);
    console.log('Patched Mobile Menu in Header');
}
