const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

const targetMenu = `{isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 border-b border-trg-gray-100">
                      <p className="text-sm text-trg-carbon font-medium truncate">{currentUser?.email}</p>
                      <p className="text-xs text-trg-gray-500 capitalize">{activeRole.replace('_', ' ')}</p>
                    </div>
                    <button onClick={() => { onNavigate('profile'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm">Profile</button>
                    <button onClick={() => { onNavigate('watchlist'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm flex justify-between">Watchlist {watchlistCount > 0 && <span className="bg-trg-red text-white text-[10px] px-1.5 py-0.5 rounded">{watchlistCount}</span>}</button>
                    {(activeRole === 'super_admin' || activeRole === 'super_admin' || activeRole === 'editor' || activeRole === 'senior_editor') && (
                      <button onClick={() => { onNavigate('super_admin'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm">Editor/Admin</button>
                    )}
                    <button onClick={() => { signOut(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium text-sm border-t border-trg-gray-100 mt-1 pt-2">Sign out</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { onNavigate('register'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium">Sign in</button>
                    <button onClick={() => { onNavigate('register'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium">Create account</button>
                  </>
                )}`;

const replacementMenu = `{isAuthenticated ? (
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
                              className={\`w-full text-left px-4 py-1.5 hover:bg-trg-gray-50 font-medium text-sm \${isCurrent ? 'text-trg-red font-bold' : 'text-trg-carbon'}\`}
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
                )}`;

if (!code.includes(targetMenu)) {
    console.log("Could not find target menu!");
    fs.writeFileSync('debug_header.txt', code);
} else {
    code = code.replace(targetMenu, replacementMenu);
    fs.writeFileSync('src/components/Header.tsx', code);
    console.log('Patched User Menu in Header');
}

