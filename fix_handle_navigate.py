import re

with open("src/App.tsx", "r") as f:
    content = f.read()

new_handle_navigate = """  const handleNavigate = (page: string, params?: any) => {
    let slug = '';
    if (typeof params === 'string') {
      slug = params;
    } else if (params && typeof params === 'object') {
      slug = params.slug || params.makerSlug || params.variantSlug || '';
    }
"""

content = content.replace("  const handleNavigate = (page: string, slug?: string) => {", new_handle_navigate)

# Also fix SearchCommandPalette import removal which was incomplete
content = content.replace("import { SearchCommandPalette } from './components/SearchCommandPalette';", "")

with open("src/App.tsx", "w") as f:
    f.write(content)

