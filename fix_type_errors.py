import re

# Fix ExplorePage.tsx
with open("src/pages/ExplorePage.tsx", "r") as f:
    content = f.read()
content = content.replace("maker.name", "maker.canonical_name")
with open("src/pages/ExplorePage.tsx", "w") as f:
    f.write(content)

# Fix HomePage.tsx
with open("src/pages/HomePage.tsx", "r") as f:
    content = f.read()
content = content.replace("maker.name", "maker.canonical_name")
with open("src/pages/HomePage.tsx", "w") as f:
    f.write(content)

# Fix PublicShell.tsx search
with open("src/components/PublicShell.tsx", "r") as f:
    content = f.read()

new_search_logic = """  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.length >= 2) {
      const qLower = q.toLowerCase();
      const results: any[] = [];
      const makers = catalogueRepository.getMakers().filter(m => m.canonical_name.toLowerCase().includes(qLower));
      makers.forEach(m => results.push({
        id: m.id,
        title: m.canonical_name,
        type: 'MAKER',
        action: () => onNavigate('maker', { makerSlug: m.slug })
      }));
      setSuggestions(results.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };"""

content = re.sub(r'const handleSearch = \(q: string\) => \{.*?\};', new_search_logic, content, flags=re.DOTALL)
with open("src/components/PublicShell.tsx", "w") as f:
    f.write(content)

