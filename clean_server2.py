import re

with open('server.ts', 'r') as f:
    content = f.read()

# Clean generations array
content = re.sub(r"app\.get\('/api/v1/models/:modelId/generations', \(req: Request, res: Response\) => \{.*?res\.json\(\[.*?\]\);\n\}\);", "app.get('/api/v1/models/:modelId/generations', (req: Request, res: Response) => {\n  res.json([]);\n});", content, flags=re.DOTALL)

# Clean generation details
content = re.sub(r"app\.get\('/api/v1/generations/:generationId', \(req: Request, res: Response\) => \{.*?res\.json\(\{.*?\}\);\n\}\);", "app.get('/api/v1/generations/:generationId', (req: Request, res: Response) => {\n  res.status(404).json({ error: 'Generation not found' });\n});", content, flags=re.DOTALL)

# Clean variants for generation
content = re.sub(r"app\.get\('/api/v1/generations/:generationId/variants', \(req: Request, res: Response\) => \{.*?res\.json\(\[.*?\]\);\n\}\);", "app.get('/api/v1/generations/:generationId/variants', (req: Request, res: Response) => {\n  res.json([]);\n});", content, flags=re.DOTALL)

# Clean single variant fallback
variant_fallback_regex = re.compile(r"app\.get\('/api/v1/variants/:variantId', \(req: Request, res: Response\) => \{.*?if \(found\) \{\s*return res\.json\(found\);\s*\}\s*// Return default demo payload for BMW M3 Sport Evolution.*?res\.json\(\{\s*id: 'bmw-m3-e30-sport-evolution'.*?\n\}\);\n\}\);", re.DOTALL)

content = variant_fallback_regex.sub(r"app.get('/api/v1/variants/:variantId', (req: Request, res: Response) => {\n  const { variantId } = req.params;\n  const found = CATALOG_DATABASE.find(v => v.id === variantId || v.slug === variantId);\n  if (found) {\n    return res.json(found);\n  }\n  res.status(404).json({ error: 'Variant not found' });\n});", content)

with open('server.ts', 'w') as f:
    f.write(content)
