import re

# 1. PublicShell.tsx
with open("src/components/PublicShell.tsx", "r") as f:
    content = f.read()
content = content.replace("import { UserRole } from '../store/userManagementStore';", "import { UserRole } from '../types';")
with open("src/components/PublicShell.tsx", "w") as f:
    f.write(content)

# 2. ExplorePage.tsx
with open("src/pages/ExplorePage.tsx", "r") as f:
    content = f.read()
content = content.replace("import { brandsData } from '../data/brandsData';", "")
content = content.replace("const makers = brandsData;", "import { catalogueRepository } from '../services/catalogueRepository';\n  const makers = catalogueRepository.getMakers();")
content = content.replace("maker.name", "maker.name") # Wait, what does Maker have? Let's check Maker type.
with open("src/pages/ExplorePage.tsx", "w") as f:
    f.write(content)

# 3. HomePage.tsx and MarketIntelligencePage.tsx
for file in ["src/pages/HomePage.tsx", "src/pages/MarketIntelligencePage.tsx"]:
    with open(file, "r") as f:
        content = f.read()
    content = content.replace("import { useNavigation } from '../hooks/useNavigation';", "")
    with open(file, "w") as f:
        f.write(content)

# 4. ProfilePage.tsx
with open("src/pages/ProfilePage.tsx", "r") as f:
    content = f.read()
content = content.replace("catalogueRepository.getVehicleById(id)", "catalogueRepository.getAllVariants().vehicles.find(v => v.id === id)")
with open("src/pages/ProfilePage.tsx", "w") as f:
    f.write(content)

