const fs = require('fs');

let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

const startStr = '<div className="py-2">';
const endStr = '</nav>';

const startIndex = header.lastIndexOf(startStr);
const endIndex = header.lastIndexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const newMobileMenu = `<div className="py-2">
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
              ) : (
                <>
                  <button onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Sign in</button>
                  <button onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Create account</button>
                </>
              )}
            </div>
          `;
  
  header = header.substring(0, startIndex) + newMobileMenu + header.substring(endIndex);
  fs.writeFileSync('src/components/Header.tsx', header);
  console.log("Mobile menu patched forcefully");
}
