import re

with open('server.ts', 'r') as f:
    content = f.read()

# 1. Clean /api/v1/models/:modelId/navigation
# Replace the isBmwM3 condition and blocks
nav_regex = re.compile(r"app\.get\('/api/v1/models/:modelId/navigation', \(req: Request, res: Response\) => \{.*?const isBmwM3 = modelId\.toLowerCase\(\)\.includes\('m3'\);.*?if \(isBmwM3\) \{.*?\}\s*// Fallback for other vehicles", re.DOTALL)
content = nav_regex.sub(r"app.get('/api/v1/models/:modelId/navigation', (req: Request, res: Response) => {\n  const { modelId } = req.params;\n\n  // Fallback for other vehicles", content)

with open('server.ts', 'w') as f:
    f.write(content)
