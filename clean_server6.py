import re

with open('server.ts', 'r') as f:
    content = f.read()

# Clean /api/v1/models/:modelId
models_regex = re.compile(r"app\.get\('/api/v1/models/:modelId', \(req: Request, res: Response\) => \{.*?const isBmwM3 = modelId\.toLowerCase\(\)\.includes\('m3'\);.*?if \(isBmwM3\) \{.*?\}\s*const v = CATALOG_DATABASE\.find", re.DOTALL)
content = models_regex.sub(r"app.get('/api/v1/models/:modelId', (req: Request, res: Response) => {\n  const { modelId } = req.params;\n  const v = CATALOG_DATABASE.find", content)

# Clean sitemaps
sitemap_regex = re.compile(r"\n    '/brands/bmw',\n    '/cars/bmw/m3',\n    '/cars/bmw/m3/e30',\n    '/cars/bmw/m3/e30/m3-2-3',\n    '/cars/bmw/m3/e30/evolution-ii',\n    '/cars/bmw/m3/e30/sport-evolution',")
content = sitemap_regex.sub("", content)

# Clean sitemaps ferrari/bmw 
content = content.replace("    'ferrari',\n", "")
content = content.replace("    'bmw',\n", "")

# Clean AI instruction categories
content = content.replace("e.g., Ferrari 296 GTB, McLaren 720S", "e.g., modern flagships")
content = content.replace("e.g., Ferrari F40, Bugatti EB110 SS, McLaren F1", "e.g., limited-run pinnacles")
content = content.replace("e.g., BMW M3 E30, Lancia Delta HF Integrale Evo 2", "e.g., 1980s-2000s icons")
content = content.replace("e.g., Ferrari 250 GTO, Porsche 356", "e.g., vintage legends")

# Clean generic fallback names
content = content.replace("query.split(' ')[0] || 'Ferrari'", "query.split(' ')[0] || 'Brand'")
content = content.replace("Nome Marca (es. Ferrari, Porsche, Alfa Romeo)", "Nome Marca (es. Brand, Altro)")

# Clean targetVariantId in target
content = content.replace("const { targetVariantId = 'bmw-m3-e30-sport-evolution', mode = 'LIVE' } = req.body || {};", "const { targetVariantId = '', mode = 'LIVE' } = req.body || {};")

with open('server.ts', 'w') as f:
    f.write(content)
