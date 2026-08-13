const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetEditorial = `{currentPage === 'editorial' && hasEffectiveCapability('PUBLISH_CANONICAL_DATA') && (
            <EditorialPage
              locale={locale}
              activeRole={activeRole}
              onNavigate={handleNavigate}
            />
          )}`;
const replacementEditorial = `{currentPage === 'editorial' && (
            <RequireAuth onNavigate={handleNavigate} requiredCapability="PUBLISH_CANONICAL_DATA">
              <EditorialPage
                locale={locale}
                activeRole={activeRole}
                onNavigate={handleNavigate}
              />
            </RequireAuth>
          )}`;

const targetWatchlist = `{currentPage === 'watchlist' && isAuthenticated && (
            <WatchlistPage
              watchlistIds={watchlistIds}
              onRemoveWatchlist={handleToggleWatchlist}
              onNavigate={handleNavigate}
              onSelectVehicle={setSelectedVehicleSlug}
              locale={locale}
            />
          )}`;
const replacementWatchlist = `{currentPage === 'watchlist' && (
            <RequireAuth onNavigate={handleNavigate}>
              <WatchlistPage
                watchlistIds={watchlistIds}
                onRemoveWatchlist={handleToggleWatchlist}
                onNavigate={handleNavigate}
                onSelectVehicle={setSelectedVehicleSlug}
                locale={locale}
              />
            </RequireAuth>
          )}`;

const targetAdmin = `{currentPage === 'super_admin' && hasEffectiveCapability('MANAGE_ROLES') && (
            <AdminPage
              locale={locale}
              activeRole={activeRole}
              setActiveRole={setActiveRole}
              onNavigate={handleNavigate}
            />
          )}`;
const replacementAdmin = `{currentPage === 'super_admin' && (
            <RequireAuth onNavigate={handleNavigate} requiredCapability="MANAGE_ROLES">
              <AdminPage
                locale={locale}
                activeRole={activeRole}
                setActiveRole={setActiveRole}
                onNavigate={handleNavigate}
              />
            </RequireAuth>
          )}`;

const targetImportLab = `{currentPage === 'import-lab' && hasEffectiveCapability('MANAGE_ROLES') && (
            <ImportLabPage />
          )}`;
const replacementImportLab = `{currentPage === 'import-lab' && (
            <RequireAuth onNavigate={handleNavigate} requiredCapability="MANAGE_ROLES">
              <ImportLabPage />
            </RequireAuth>
          )}`;

const targetProfile = `{(currentPage === 'profile' || currentPage === 'profile/organization') && isAuthenticated && (
            <ProfilePage
              locale={locale}
              activeRole={activeRole}
              setActiveRole={setActiveRole}
              watchlistIds={watchlistIds}
              onNavigate={handleNavigate}
              onSelectVehicle={setSelectedVehicleSlug}
            />
          )}`;
const replacementProfile = `{(currentPage === 'profile' || currentPage === 'profile/organization') && (
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
          )}`;

code = code.replace(targetEditorial, replacementEditorial);
code = code.replace(targetWatchlist, replacementWatchlist);
code = code.replace(targetAdmin, replacementAdmin);
code = code.replace(targetImportLab, replacementImportLab);
code = code.replace(targetProfile, replacementProfile);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched protected routes.");
