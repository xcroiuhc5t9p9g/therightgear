import re

with open("server.ts", "r") as f:
    content = f.read()

# Remove the existing app.get that handles SSR routes
content = re.sub(
    r"  // SSR / Prerender Middleware for HTML page routes\n  app\.get\(\[\n    '/',\n.*?  \], \(req: Request, res: Response, next: any\) => \{\n.*?    return res\.send\(html\);\n  \}\);\n",
    "",
    content,
    flags=re.DOTALL
)

# Update the Vite middleware section
new_vite_section = """  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.get('*', async (req: Request, res: Response, next: any) => {
      if (req.path.startsWith('/api/') || req.path.includes('.')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response, next: any) => {
      if (req.path.startsWith('/api/') || req.path.includes('.')) {
        return next();
      }
      const host = req.get('host') || 'therightgear.app';
      const protocol = req.protocol === 'https' || host.includes('ai.studio') || host.includes('run.app') ? 'https' : 'http';
      const html = renderHtmlPage(req.path, host, protocol);
      res.header('Content-Type', 'text/html; charset=utf-8');
      return res.send(html);
    });
  }"""

content = re.sub(
    r"  if \(process\.env\.NODE_ENV !== 'production'\) \{\n    const \{ createServer: createViteServer \} = await import\('vite'\);\n    const vite = await createViteServer\(\{\n      server: \{ middlewareMode: true \},\n      appType: 'spa',\n    \}\);\n    app\.use\(vite\.middlewares\);\n  \} else \{\n    const distPath = path\.join\(process\.cwd\(\), 'dist'\);\n    app\.use\(express\.static\(distPath\)\);\n    app\.get\('\*', \(req: Request, res: Response\) => \{\n      res\.sendFile\(path\.join\(distPath, 'index\.html'\)\);\n    \}\);\n  \}",
    new_vite_section,
    content,
    flags=re.DOTALL
)

with open("server.ts", "w") as f:
    f.write(content)
