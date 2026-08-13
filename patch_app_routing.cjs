const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { RequireAuth }')) {
  code = code.replace(
    'import { PublicShell } from "./components/PublicShell";',
    'import { PublicShell } from "./components/PublicShell";\nimport { RequireAuth } from "./components/RequireAuth";'
  );
}

// Replace EditorialPage routing
code = code.replace(
  /\{currentPage === 'editorial' && hasEffectiveCapability\('PUBLISH_CANONICAL_DATA'\) && \([\s\S]*?<\/>\n          \)\}/,
  ""
); // I'll just regex replace them carefully.

// It's safer to just replace all instances manually
code = code.replace(
  /\{currentPage === 'editorial' && hasEffectiveCapability\('PUBLISH_CANONICAL_DATA'\) && \([\s\S]*?\}\s*\)/,
  `{currentPage === 'editorial' && (
            <RequireAuth onNavigate={handleNavigate} requiredCapability="PUBLISH_CANONICAL_DATA">
              <EditorialPage
                locale={locale}
                activeRole={activeRole}
                onNavigate={handleNavigate}
              />
            </RequireAuth>
          )}`
);

code = code.replace(
  /\{currentPage === 'watchlist' && isAuthenticated && \([\s\S]*?\}\s*\)/,
  `{currentPage === 'watchlist' && (
            <RequireAuth onNavigate={handleNavigate}>
              <WatchlistPage
                watchlistIds={watchlistIds}
                onRemoveWatchlist={handleToggleWatchlist}
                onNavigate={handleNavigate}
                onSelectVehicle={setSelectedVehicleSlug}
                locale={locale}
              />
            </RequireAuth>
          )}`
);

code = code.replace(
  /\{currentPage === 'super_admin' && hasEffectiveCapability\('MANAGE_ROLES'\) && \([\s\S]*?\}\s*\)/,
  `{currentPage === 'super_admin' && (
            <RequireAuth onNavigate={handleNavigate} requiredCapability="MANAGE_ROLES">
              <AdminPage
                locale={locale}
                activeRole={activeRole}
                setActiveRole={setActiveRole}
                onNavigate={handleNavigate}
              />
            </RequireAuth>
          )}`
);

code = code.replace(
  /\{currentPage === 'import-lab' && hasEffectiveCapability\('MANAGE_ROLES'\) && \([\s\S]*?\}\s*\)/,
  `{currentPage === 'import-lab' && (
            <RequireAuth onNavigate={handleNavigate} requiredCapability="MANAGE_ROLES">
              <ImportLabPage />
            </RequireAuth>
          )}`
);

code = code.replace(
  /\{\(currentPage === 'profile' \|\| currentPage === 'profile\/organization'\) && isAuthenticated && \([\s\S]*?\}\s*\)/,
  `{(currentPage === 'profile' || currentPage === 'profile/organization') && (
            <RequireAuth onNavigate={handleNavigate}>
              <ProfilePage
                locale={locale}
                activeRole={activeRole}
                setActiveRole={setActiveRole}
                watchlistIds={watchlistIds}
                onNavigate={handleNavigate}
                onSelectVehicle={setSelectedVehicleSlug}
              />
            </RequireAuth>
          )}`
);

fs.writeFileSync('src/App.tsx', code);
console.log('Patched App.tsx routing');
