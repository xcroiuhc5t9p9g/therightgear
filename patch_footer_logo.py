import re

with open("src/components/Footer.tsx", "r") as f:
    content = f.read()

if "import { BrandLogo }" not in content:
    content = content.replace("import React from 'react';", "import React from 'react';\nimport { BrandLogo } from './BrandLogo';")

# replace the img tag
new_logo = '<BrandLogo variant="dark-bg" className="h-8 md:h-10 max-w-[220px] md:max-w-[280px]" />'
content = re.sub(r'<img src="/logo.*?\.svg" alt="The Right Gear" className=".*?" />', new_logo, content)

with open("src/components/Footer.tsx", "w") as f:
    f.write(content)
