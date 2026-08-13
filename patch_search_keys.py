import re

with open("src/components/Header.tsx", "r") as f:
    content = f.read()

# Make search handle keyboard navigation
# First we need to add selectedSuggestionIndex state
if "const [selectedIndex, setSelectedIndex] = useState(-1);" not in content:
    content = content.replace("const [searchFocused, setSearchFocused] = useState(false);", "const [searchFocused, setSearchFocused] = useState(false);\n  const [selectedIndex, setSelectedIndex] = useState(-1);")

# Update search focus / blur to handle key events
# Wait, let's just replace the whole Desktop Search part
old_desktop_search = """        {/* SEARCH (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-2xl relative">
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
              placeholder="Search maker, model or variant"
              className="w-full bg-white text-sm text-trg-carbon placeholder-trg-gray-400 pl-11 pr-4 py-2.5 rounded-lg border border-trg-gray-300 focus:outline-none focus:border-trg-red focus:ring-1 focus:ring-trg-red transition-all"
            />
          </div>
          
          {/* Search Suggestions Dropdown */}
          {searchFocused && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-trg-gray-200 shadow-xl overflow-hidden py-2 z-50">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion.action)}
                  className="w-full text-left px-4 py-3 hover:bg-trg-gray-50 flex items-center justify-between group"
                >
                  <div>
                    <div className="font-medium text-trg-carbon">{suggestion.title}</div>
                    {suggestion.subtitle && <div className="text-xs text-trg-gray-500 mt-0.5">{suggestion.subtitle}</div>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-trg-gray-400">{suggestion.type}</span>
                    <ArrowRight className="w-4 h-4 text-trg-gray-300 group-hover:text-trg-red transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>"""

new_desktop_search = """        {/* SEARCH (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-2xl relative">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-trg-gray-400" />
            <input
              id="desktop-search-input"
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
                  document.getElementById('desktop-search-input')?.blur();
                }
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="Search maker, model, generation or variant..."
              className="w-full bg-white text-sm text-trg-carbon placeholder-trg-gray-400 pl-11 pr-4 py-2.5 rounded-lg border border-trg-gray-300 focus:outline-none focus:border-trg-red focus:ring-1 focus:ring-trg-red transition-all"
            />
          </div>
          
          {/* Search Suggestions Dropdown */}
          {searchFocused && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg border border-trg-gray-200 shadow-xl overflow-hidden py-2 z-50">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
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
        </div>"""

content = content.replace(old_desktop_search, new_desktop_search)

# Add the global key listener effect inside Header
effect_code = """
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('desktop-search-input')?.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        document.getElementById('desktop-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);
"""

if "handleGlobalKeyDown" not in content:
    content = content.replace("  const handleSuggestionClick = (action: () => void) => {", effect_code + "\n  const handleSuggestionClick = (action: () => void) => {")

with open("src/components/Header.tsx", "w") as f:
    f.write(content)
