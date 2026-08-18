import re
with open("src/pages/HomePage.tsx", "r") as f:
    content = f.read()

content = content.replace("import { SearchCommandPalette } from '../components/SearchCommandPalette';", "")
content = content.replace("import { brandsData } from '../data/brandsData';", "import { catalogueRepository } from '../services/catalogueRepository';\nconst brandsData = catalogueRepository.getMakers();")
content = re.sub(r'<SearchCommandPalette\s*isOpen=\{searchOpen\}\s*onClose=\{.*?\}\s*onNavigate=\{onNavigate\}\s*/>', '', content)

with open("src/pages/HomePage.tsx", "w") as f:
    f.write(content)

