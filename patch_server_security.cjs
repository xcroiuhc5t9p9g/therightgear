const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const securityHeaders = `
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy-Report-Only", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com https://www.googletagmanager.com; frame-src 'self' https://therightgear.firebaseapp.com https://automotive-ai-platform.firebaseapp.com https://apis.google.com; connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://www.googleapis.com; style-src 'self' 'unsafe-inline'; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https:; frame-ancestors 'self';");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  // HSTS is usually added by Cloudflare, but we can add it here too
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
});

`;

code = code.replace("app.use(express.json());", securityHeaders + "app.use(express.json());");

fs.writeFileSync('server.ts', code);
