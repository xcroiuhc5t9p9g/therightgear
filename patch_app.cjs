const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '  const { effectiveRole } = useAuth();',
  `  const { effectiveRole, isAuthenticated, hasEffectiveCapability, isLoading } = useAuth();`
);

// We need to render a loading state if isLoading is true
code = code.replace(
  '  return (\n    <PublicShell',
  `  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <PublicShell`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Patched App.tsx');
