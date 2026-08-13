import re

with open("src/components/Header.tsx", "r") as f:
    content = f.read()

if "import { BrandLogo }" not in content:
    content = content.replace("import { Search, Menu, X, ArrowRight } from 'lucide-react';", "import { Search, Menu, X, ArrowRight } from 'lucide-react';\nimport { BrandLogo } from './BrandLogo';")

# replace the img tag
# old: <img src="/logo.svg" alt="The Right Gear" className="h-8" />
# The rules say: "width: clamp(145px, 16vw, 220px);" or responsive.
# We will use responsive classes on BrandLogo.
new_logo = '<BrandLogo variant="light-bg" className="h-6 sm:h-8 md:h-10 max-w-[140px] sm:max-w-[165px] md:max-w-[220px]" />'

content = re.sub(r'<img src="/logo\.svg" alt="The Right Gear" className=".*?" />', new_logo, content)

with open("src/components/Header.tsx", "w") as f:
    f.write(content)
