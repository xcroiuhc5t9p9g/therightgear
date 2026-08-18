import re

with open("src/components/PublicShell.tsx", "r") as f:
    content = f.read()

new_search_logic = """  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.length >= 2) {
      const results = catalogueRepository.search(q);
      setSuggestions(results.map(r => ({
        ...r,
        action: () => onNavigate('search-result', r)
      })));
    } else {
      setSuggestions([]);
    }
  };"""

content = re.sub(r'const handleSearch = \(q: string\) => \{.*?\};', new_search_logic, content, flags=re.DOTALL)

with open("src/components/PublicShell.tsx", "w") as f:
    f.write(content)

