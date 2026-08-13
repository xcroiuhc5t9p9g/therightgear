const fs = require('fs');
let code = fs.readFileSync('src/pages/RegisterPage.tsx', 'utf8');

code = code.replace(
  "  const [submitted, setSubmitted] = useState(false);\n  const [registeredUserObj, setRegisteredUserObj] = useState<AppUser | null>(null);",
  ""
);

code = code.replace(
  /\{submitted \? \([\s\S]*?\} \(\n              \/\* Professionale Form \*\//,
  `{ (
              /* Professionale Form */`
);

fs.writeFileSync('src/pages/RegisterPage.tsx', code);
console.log('Patched types in RegisterPage');
