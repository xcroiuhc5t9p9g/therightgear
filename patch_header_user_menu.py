import re

with open("src/components/Header.tsx", "r") as f:
    content = f.read()

# Make UserMenu stateful and render it correctly.
# First, let's inject a new state for userMenuOpen
user_menu_state = """  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);"""

content = content.replace("  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);", user_menu_state)

# Replace the desktop user button
old_user_button = """          <div className="w-8 h-8 rounded-full bg-trg-gray-200 flex items-center justify-center cursor-pointer hover:bg-trg-gray-300 transition-colors">
            <span className="text-xs font-bold text-trg-carbon">U</span>
          </div>"""

new_user_button = """          <div className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-8 h-8 rounded-full bg-trg-gray-200 flex items-center justify-center cursor-pointer hover:bg-trg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-trg-red"
            >
              <span className="text-xs font-bold text-trg-carbon">U</span>
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg border border-trg-gray-200 shadow-xl py-2 z-50">
                {activeRole === 'public' ? (
                  <>
                    <button onClick={() => { onNavigate('register'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium">Sign in</button>
                    <button onClick={() => { onNavigate('register'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium">Create account</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { onNavigate('profile'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium">My Profile</button>
                    <button onClick={() => { onNavigate('watchlist'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium">Watchlist</button>
                    {(activeRole === 'admin' || activeRole === 'editor' || activeRole === 'senior_editor') && (
                      <>
                        <div className="border-t border-trg-gray-200 my-1"></div>
                        <button onClick={() => { onNavigate('editorial'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium">Editorial</button>
                        <button onClick={() => { onNavigate('import-lab'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium">Import Lab</button>
                        <button onClick={() => { onNavigate('admin'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium">Admin</button>
                      </>
                    )}
                    <div className="border-t border-trg-gray-200 my-1"></div>
                    <button onClick={() => { setActiveRole('public'); setUserMenuOpen(false); onNavigate('home'); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-red font-medium">Sign out</button>
                  </>
                )}
              </div>
            )}
          </div>"""

content = content.replace(old_user_button, new_user_button)

# Also fix the search overlay to close on outside click (if needed, but for now just fix keyboard)
with open("src/components/Header.tsx", "w") as f:
    f.write(content)

