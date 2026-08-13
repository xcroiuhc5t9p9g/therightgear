import re

with open("src/components/Header.tsx", "r") as f:
    content = f.read()

old_mobile_profile = """            <div className="border-t border-trg-gray-200 pt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-trg-gray-200 flex items-center justify-center">
                <span className="font-bold text-trg-carbon">U</span>
              </div>
              <span className="font-medium text-trg-carbon">Profile</span>
            </div>"""

new_mobile_profile = """            <div className="border-t border-trg-gray-200 pt-4 flex flex-col gap-4">
              {activeRole === 'public' ? (
                <>
                  <button onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Sign in</button>
                  <button onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Create account</button>
                </>
              ) : (
                <>
                  <button onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">My Profile</button>
                  <button onClick={() => { onNavigate('watchlist'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Watchlist</button>
                  {(activeRole === 'admin' || activeRole === 'editor' || activeRole === 'senior_editor') && (
                    <>
                      <button onClick={() => { onNavigate('editorial'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Editorial</button>
                      <button onClick={() => { onNavigate('import-lab'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Import Lab</button>
                      <button onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Admin</button>
                    </>
                  )}
                  <button onClick={() => { setActiveRole('public'); setMobileMenuOpen(false); onNavigate('home'); }} className="text-left font-bold text-lg text-trg-red py-2">Sign out</button>
                </>
              )}
            </div>"""

content = content.replace(old_mobile_profile, new_mobile_profile)

with open("src/components/Header.tsx", "w") as f:
    f.write(content)
