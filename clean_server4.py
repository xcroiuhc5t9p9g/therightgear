import re

with open('server.ts', 'r') as f:
    content = f.read()

# Remove remaining SEO blocks
seo_regex = re.compile(r"\}\s*else if \(cleanPath\.startsWith\('/cars/bmw/m3/e30/evolution-ii'\)\) \{.*?(?=\}\s*else if \(cleanPath\.startsWith\('/entity/'\)\))", re.DOTALL)
content = seo_regex.sub("", content)

# Remove the fallback answer that includes Ferrari F40
fallback_regex = re.compile(r"const fallbackAnswer = req\.body\?.mode === 'OFFLINE'\s*\? `\[Analisi offline\].*?`\s*: `\[Offline Analysis\].*?`;", re.DOTALL)
content = fallback_regex.sub(r"const fallbackAnswer = req.body?.mode === 'OFFLINE'\n      ? `[Analisi offline] Nessun dato vettura disponibile.`\n      : `[Offline Analysis] No vehicle data available.`;", content)

# Remove the fallback answer referenced slugs
ref_slugs_regex = re.compile(r"referenced_slugs: \['ferrari-f40', 'bugatti-eb110-gt', 'porsche-959-komfort'\]")
content = ref_slugs_regex.sub(r"referenced_slugs: []", content)

# Remove system instruction text that mentions Ferrari F40
sys_inst_regex = re.compile(r"\(Ferrari F40, Porsche 959, McLaren F1, Lancia Delta Evo, Bugatti EB110, etc\.\)")
content = sys_inst_regex.sub(r"", content)

# Remove referenced_slugs: referencedSlugs.length > 0 ? referencedSlugs : ['ferrari-f40', 'porsche-959-komfort'],
fallback_ref_regex = re.compile(r"referenced_slugs: referencedSlugs\.length > 0 \? referencedSlugs : \['ferrari-f40', 'porsche-959-komfort'\],")
content = fallback_ref_regex.sub(r"referenced_slugs: referencedSlugs,", content)

with open('server.ts', 'w') as f:
    f.write(content)
