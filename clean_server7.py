import re

with open('server.ts', 'r') as f:
    content = f.read()

# Clean single variant
single_var_regex = re.compile(r"app\.get\('/api/v1/variants/:variantId', \(req: Request, res: Response\) => \{.*?if \(found\) \{\s*return res\.json\(found\);\s*\}\s*res\.status\(404\)\.json\(\{ error: 'Variant not found' \}\);\n\}\);", re.DOTALL)

# But wait, looking at my previous regex for clean_server2.py, I actually already did this, but I guess it failed.
# Let's just strip everything from `// Return default demo payload for BMW M3 Sport Evolution` down to `});\n});`

single_var_regex2 = re.compile(r"// Return default demo payload for BMW M3 Sport Evolution.*?res\.json\(\{.*?\}\);\n\}\);", re.DOTALL)
content = single_var_regex2.sub(r"res.status(404).json({ error: 'Variant not found' });\n});", content)

# Clean specs
specs_regex = re.compile(r"app\.get\('/api/v1/variants/:variantId/specifications', \(req: Request, res: Response\) => \{.*?res\.json\(\{.*?\}\);\n\}\);", re.DOTALL)
content = specs_regex.sub(r"app.get('/api/v1/variants/:variantId/specifications', (req: Request, res: Response) => {\n  res.status(404).json({ error: 'Specifications not found' });\n});", content)

# Clean production
prod_regex = re.compile(r"app\.get\('/api/v1/variants/:variantId/production', \(req: Request, res: Response\) => \{.*?res\.json\(\{.*?\}\);\n\}\);", re.DOTALL)
content = prod_regex.sub(r"app.get('/api/v1/variants/:variantId/production', (req: Request, res: Response) => {\n  res.status(404).json({ error: 'Production record not found' });\n});", content)

# Clean media
media_regex = re.compile(r"app\.get\('/api/v1/variants/:variantId/media', \(req: Request, res: Response\) => \{.*?res\.json\(\{.*?\}\);\n\}\);", re.DOTALL)
content = media_regex.sub(r"app.get('/api/v1/variants/:variantId/media', (req: Request, res: Response) => {\n  res.status(404).json({ error: 'Media not found' });\n});", content)

with open('server.ts', 'w') as f:
    f.write(content)
