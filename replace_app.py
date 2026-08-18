import re
with open("src/App.tsx", "r") as f:
    content = f.read()

replacement = """  return (
    <PublicShell
      locale={locale}
      setLocale={setLocale}
      activeRole={activeRole}
      setActiveRole={setActiveRole}
      watchlistCount={watchlistIds.length}
      compareCount={compareIds.length}
      onSearch={handleSearchHeader}
      onNavigate={handleNavigate}
      currentPage={currentPage}
      authModalOpen={authModalOpen}
      authModalReason={authModalReason}
      setAuthModalOpen={setAuthModalOpen}
    >
          {currentPage === 'home' && (
            <HomePage
              locale={locale}
              activeRole={activeRole}
              onNavigate={handleNavigate}
              onSelectVehicle={setSelectedVehicleSlug}
              onToggleWatchlist={handleToggleWatchlist}
              onToggleCompare={handleToggleCompare}
              onOpenAuthModal={handleOpenAuthModal}
              watchlistIds={watchlistIds}
              compareIds={compareIds}
            />
          )}
          {(currentPage === 'explore' || currentPage === 'catalog' || currentPage === 'templates') && (
            <ExplorePage
              locale={locale}
              activeRole={activeRole}
              onSelectVehicle={setSelectedVehicleSlug}
              onNavigate={handleNavigate}
              onToggleWatchlist={handleToggleWatchlist}
              onToggleCompare={handleToggleCompare}
              onOpenAuthModal={handleOpenAuthModal}
              watchlistIds={watchlistIds}
              compareIds={compareIds}
              initialSearchQuery={searchQuery}
            />
          )}
          {currentPage === 'market' && (
            <MarketIntelligencePage
              locale={locale}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'detail' && (
            <VehicleDetailPage
              slug={selectedVehicleSlug}
              locale={locale}
              activeRole={activeRole}
              onNavigate={handleNavigate}
              onToggleWatchlist={handleToggleWatchlist}
              onToggleCompare={handleToggleCompare}
              onOpenAuthModal={handleOpenAuthModal}
              watchlistIds={watchlistIds}
              compareIds={compareIds}
            />
          )}
          {currentPage === 'graph' && (
            <KnowledgeGraphPage
              locale={locale}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'compare' && (
            <ComparePage
              compareIds={compareIds}
              onRemoveCompare={handleToggleCompare}
              onNavigate={handleNavigate}
              locale={locale}
            />
          )}
          {currentPage === 'ai-advisor' && (
            <AiAdvisorPage
              locale={locale}
              onNavigate={handleNavigate}
            />
          )}
          {(currentPage === 'listings' || currentPage === 'dealer-portal') && (
            <DealerMarketplacePage
              locale={locale}
              activeRole={activeRole}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'editorial' && (
            <EditorialPage
              locale={locale}
              activeRole={activeRole}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'watchlist' && (
            <WatchlistPage
              watchlistIds={watchlistIds}
              onRemoveWatchlist={handleToggleWatchlist}
              onNavigate={handleNavigate}
              onSelectVehicle={setSelectedVehicleSlug}
              locale={locale}
            />
          )}
          {currentPage === 'admin' && (
            <AdminPage
              locale={locale}
              activeRole={activeRole}
              setActiveRole={setActiveRole}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'import-lab' && (
            <ImportLabPage />
          )}
          {currentPage === 'entity' && (
            <EntityDetailPage
              entitySlug={selectedEntitySlug}
              locale={locale}
              onNavigate={handleNavigate}
              onSelectVehicle={setSelectedVehicleSlug}
            />
          )}
          {currentPage === 'register' && (
            <RegisterPage
              locale={locale}
              activeRole={activeRole}
              setActiveRole={setActiveRole}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'profile' && (
            <ProfilePage
              locale={locale}
              activeRole={activeRole}
              setActiveRole={setActiveRole}
              watchlistIds={watchlistIds}
              onNavigate={handleNavigate}
              onSelectVehicle={setSelectedVehicleSlug}
            />
          )}
          {currentPage === 'about' && (
            <AboutPage
              locale={locale}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'methodology' && (
            <MethodologyPage
              locale={locale}
              onNavigate={handleNavigate}
            />
          )}
          {currentPage === 'data-partnerships' && (
            <DataPartnershipsPage
              locale={locale}
              onNavigate={handleNavigate}
            />
          )}
    </PublicShell>
  );
}

export default App;
"""

new_content = re.sub(r'  return \(\n    <div className="min-h-screen.*', replacement, content, flags=re.DOTALL)

with open("src/App.tsx", "w") as f:
    f.write(new_content)
