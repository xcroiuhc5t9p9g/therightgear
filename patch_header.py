import re

with open("src/components/Header.tsx", "r") as f:
    content = f.read()

# Remove activeRole from Header component props
content = re.sub(r'activeRole,\s*', '', content)
content = re.sub(r'activeRole: UserRole;\s*', '', content)
content = re.sub(r'setActiveRole: \(role: UserRole\) => void;\s*', '', content)
content = re.sub(r'setActiveRole,\s*', '', content)
content = re.sub(r'activeRole: any,\s*', '', content)

# Remove the user menu conditionals that check activeRole
# Replace the whole dropdown content with just Sign In / Create Account
dropdown_regex = r'\{userMenuOpen && \(\s*<div className="absolute right-0 mt-2.*?</div>\s*\)\}'
new_dropdown = """{userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg border border-trg-gray-200 shadow-xl py-2 z-50">
                <button onClick={() => { onNavigate('register'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium">Sign in</button>
                <button onClick={() => { onNavigate('register'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-trg-gray-50 text-trg-carbon font-medium">Create account</button>
              </div>
            )}"""
content = re.sub(dropdown_regex, new_dropdown, content, flags=re.DOTALL)

# Mobile menu dropdown replace
mobile_dropdown_regex = r'\{activeRole === \'public\' \? \(.*?\) : \(.*?\)\}'
new_mobile_dropdown = """<>
                  <button onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Sign in</button>
                  <button onClick={() => { onNavigate('register'); setMobileMenuOpen(false); }} className="text-left font-bold text-lg text-trg-carbon py-2">Create account</button>
                </>"""
content = re.sub(mobile_dropdown_regex, new_mobile_dropdown, content, flags=re.DOTALL)

with open("src/components/Header.tsx", "w") as f:
    f.write(content)
