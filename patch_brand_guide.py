import re

with open("docs/VISUAL_BRAND_GUIDE.md", "r") as f:
    content = f.read()

content = re.sub(r'Version: 0.1.2', 'Version: 0.1.3', content)

logo_docs = """
## 1. OFFICIAL LOGO

**Master Asset:** `/public/brand/the-right-gear-logo-master.png`  
**Public URL:** `/brand/the-right-gear-logo-master.png`  
**Dimensions:** `1184 × 159 px`  
**Aspect Ratio:** `~ 7.45:1`

### Identity Rules
- **DO NOT** redraw, AI-vectorize, or approximate the logo.
- **DO NOT** distort, stretch, or crop the logo under any circumstances.
- **DO NOT** recolour the logo without explicit brand approval.
- **Header Implementation:** The public Header must use this official master asset.
- **Mobile Header:** Because of its extreme width, a two-row mobile Header is preferred over shrinking the logo below a readable threshold.
- **Derivatives:** Responsive derivations (e.g. `logo-on-light.png`, `logo-on-dark.png`) are permitted ONLY if generated from the exact binary master.
- **Legacy Files:** Files such as `logo.svg`, `logo_light.svg`, and `logo_dark.svg` are NO LONGER the official master identity and must be phased out of active public UI.
"""

content = re.sub(r'## 1\. LOGO AND IDENTITY.*?(?=## 2)', logo_docs, content, flags=re.DOTALL)

with open("docs/VISUAL_BRAND_GUIDE.md", "w") as f:
    f.write(content)
