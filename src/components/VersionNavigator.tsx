import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  ChevronLeft, 
  SlidersHorizontal, 
  X, 
  Search, 
  Sparkles, 
  Layers, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck
} from 'lucide-react';
import { VehicleFamilyNavigation, GenerationNavigationItem, VariantNavigationItem } from '../types';
import { Locale } from '../data/translations';

function getGenerationDisplayLabel(gen?: GenerationNavigationItem | null, index?: number): string {
  if (!gen) return 'Generation';
  if (gen.code && gen.name) return `${gen.code} · ${gen.name}`;
  if (gen.code) return gen.code;
  if (gen.name) return gen.name;
  return typeof index === 'number' && index >= 0 ? `Generation ${index + 1}` : 'Generation';
}

function getGenerationCodeLabel(gen?: GenerationNavigationItem | null, index?: number): string {
  if (!gen) return 'Gen';
  if (gen.code) return gen.code;
  if (gen.name) return gen.name;
  return typeof index === 'number' && index >= 0 ? `Gen ${index + 1}` : 'Gen';
}

interface VersionNavigatorProps {
  navigationData: VehicleFamilyNavigation;
  activeGenerationId?: string;
  activeVariantId?: string;
  currentLevel: 'model' | 'generation' | 'variant';
  locale: Locale;
  onSelectLevel: (level: 'model' | 'generation' | 'variant', genId?: string, varId?: string) => void;
  onCompareTrigger?: () => void;
  isLoading?: boolean;
}

export const VersionNavigator: React.FC<VersionNavigatorProps> = ({
  navigationData,
  activeGenerationId,
  activeVariantId,
  currentLevel,
  locale,
  onSelectLevel,
  onCompareTrigger,
  isLoading = false,
}) => {
  const isIt = false;
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [drawerSearchQuery, setDrawerSearchQuery] = useState('');
  const [generationDropdownOpen, setGenerationDropdownOpen] = useState(false);
  const [variantDropdownOpen, setVariantDropdownOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Flatten all variants across generations for Prev/Next chronological navigation
  const allVariants = navigationData.generations.flatMap(gen => 
    gen.variants.map(v => ({
      ...v,
      generationId: gen.id,
      generationCode: gen.code,
      generationName: gen.name
    }))
  );

  // Current active generation & variant items
  const activeGen = navigationData.generations.find(g => g.id === activeGenerationId) || navigationData.generations[0];
  const activeVar = activeGen?.variants.find(v => v.id === activeVariantId) || activeGen?.variants[0];

  // Find index for Previous / Next buttons
  const currentVariantIndex = allVariants.findIndex(v => v.id === activeVar?.id);
  const prevVariant = currentVariantIndex > 0 ? allVariants[currentVariantIndex - 1] : null;
  const nextVariant = currentVariantIndex >= 0 && currentVariantIndex < allVariants.length - 1 ? allVariants[currentVariantIndex + 1] : null;

  // Handle drawer Escape key and focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileDrawerOpen) setMobileDrawerOpen(false);
        setGenerationDropdownOpen(false);
        setVariantDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileDrawerOpen]);

  // Focus search input when drawer opens
  useEffect(() => {
    if (mobileDrawerOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [mobileDrawerOpen]);

  // Filtered variants inside drawer (fully null-safe)
  const filteredGenerations = navigationData.generations.map((gen, idx) => {
    const q = drawerSearchQuery.toLowerCase().trim();
    if (!q) return gen;
    const genCodeLabel = getGenerationCodeLabel(gen, idx).toLowerCase();
    const filteredVars = gen.variants.filter(v => 
      (v.name && v.name.toLowerCase().includes(q)) ||
      (v.years && v.years.toLowerCase().includes(q)) ||
      (gen.code && gen.code.toLowerCase().includes(q)) ||
      (gen.name && gen.name.toLowerCase().includes(q)) ||
      (gen.years && gen.years.toLowerCase().includes(q)) ||
      genCodeLabel.includes(q)
    );
    return { ...gen, variants: filteredVars };
  }).filter(gen => gen.variants.length > 0);

  if (isLoading) {
    return (
      <div className="w-full bg-[#121622] border border-[#22293a] rounded-xl p-4 animate-pulse flex items-center justify-between">
        <div className="h-5 bg-slate-800 rounded w-1/3"></div>
        <div className="h-8 bg-slate-800 rounded w-28"></div>
      </div>
    );
  }

  const activeGenIndex = activeGen ? navigationData.generations.indexOf(activeGen) : -1;
  const activeGenCodeDisplay = activeGen ? getGenerationCodeLabel(activeGen, activeGenIndex) : 'Tutte';

  return (
    <nav className="w-full bg-[#121622]/90 backdrop-blur-md border border-[#22293a] rounded-2xl p-3.5 sm:p-4 shadow-xl mb-6">
      
      {/* ------------------------------------------------------------------- */}
      {/* DESKTOP UNIFIED BREADCRUMB NAVIGATOR */}
      {/* ------------------------------------------------------------------- */}
      <div className="hidden lg:flex items-center justify-between gap-4">
        
        {/* Unified Navigable Breadcrumb Sequence: Casa Costruttrice > Modello > Generazioni > Variants */}
        <div className="flex items-center gap-2 text-xs font-medium">
          
          {/* 1. Casa Costruttrice */}
          <div className="flex items-center gap-1.5 bg-[#171d2b] px-3 py-2 rounded-xl border border-[#2b354d]">
            <span className="text-slate-400 font-normal">Manufacturer:</span>
            <button 
              onClick={() => onSelectLevel('model')}
              className="font-extrabold text-white hover:text-red-400 transition-colors"
            >
              {navigationData.manufacturer.name ?? 'Manufacturer'}
            </button>
          </div>

          <ChevronRight className="w-4 h-4 text-red-500/80 shrink-0" />

          {/* 2. Modello */}
          <div className="flex items-center gap-1.5 bg-[#171d2b] px-3 py-2 rounded-xl border border-[#2b354d]">
            <span className="text-slate-400 font-normal">Model:</span>
            <button 
              onClick={() => onSelectLevel('model')}
              className="font-extrabold text-red-400 hover:underline transition-colors"
            >
              {navigationData.model.name ?? 'Model'}
            </button>
          </div>

          <ChevronRight className="w-4 h-4 text-red-500/80 shrink-0" />

          {/* 3. Generazione (Interactive Selector) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setGenerationDropdownOpen(!generationDropdownOpen);
                setVariantDropdownOpen(false);
              }}
              className="flex items-center space-x-1.5 bg-[#171d2b] hover:bg-[#1f273a] text-slate-100 px-3 py-2 rounded-xl border border-[#2b354d] text-xs transition-all cursor-pointer shadow-sm"
              aria-expanded={generationDropdownOpen}
              aria-label="Seleziona Generazione"
            >
              <span className="text-slate-400 font-normal">Generazione:</span>
              <span className="font-black text-red-300">{activeGenCodeDisplay}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {generationDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-[#141926] border border-[#2b354d] rounded-2xl shadow-2xl z-50 p-2 space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-red-400 px-2.5 py-1.5 flex items-center justify-between border-b border-[#20283b]">
                  <span>Available Generations</span>
                  <span className="text-slate-500 font-mono">{navigationData.generations.length} totali</span>
                </div>
                {navigationData.generations.map((gen, index) => (
                  <button
                    key={gen.id}
                    onClick={() => {
                      onSelectLevel('generation', gen.id);
                      setGenerationDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left ${
                      gen.id === activeGen?.id
                        ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/30'
                        : 'text-slate-300 hover:bg-[#1e2638]'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        <span className="text-red-400">{getGenerationCodeLabel(gen, index)}</span>
                        {gen.name && <span className="text-slate-300">· {gen.name}</span>}
                      </div>
                      <div className="text-[10px] text-slate-400">{gen.years ? `${gen.years} · ` : ''}{gen.variants.length} versioni</div>
                    </div>
                    {gen.id === activeGen?.id && <Check className="w-4 h-4 text-red-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <ChevronRight className="w-4 h-4 text-red-500/80 shrink-0" />

          {/* 4. Variante (Interactive Selector) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setVariantDropdownOpen(!variantDropdownOpen);
                setGenerationDropdownOpen(false);
              }}
              className="flex items-center space-x-1.5 bg-[#171d2b] hover:bg-[#1f273a] text-slate-100 px-3 py-2 rounded-xl border border-[#2b354d] text-xs transition-all cursor-pointer max-w-[300px] shadow-sm"
              aria-expanded={variantDropdownOpen}
              aria-label="Seleziona Variante"
            >
              <span className="text-slate-400 font-normal">Variante:</span>
              <span className="font-extrabold text-white truncate">{activeVar?.name || 'Seleziona'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {variantDropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 bg-[#141926] border border-[#2b354d] rounded-2xl shadow-2xl z-50 p-2 max-h-80 overflow-y-auto space-y-1 custom-scrollbar">
                <div className="text-[10px] uppercase tracking-wider font-extrabold text-red-400 px-2.5 py-1.5 flex items-center justify-between border-b border-[#20283b]">
                  <span>Variants {activeGenCodeDisplay}</span>
                  <span className="text-slate-500 font-mono">{activeGen?.variants.length ?? 0} versioni</span>
                </div>
                {activeGen?.variants.map(varItem => (
                  <button
                    key={varItem.id}
                    onClick={() => {
                      onSelectLevel('variant', activeGen.id, varItem.id);
                      setVariantDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left ${
                      varItem.id === activeVar?.id
                        ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/30'
                        : 'text-slate-300 hover:bg-[#1e2638]'
                    }`}
                  >
                    <div className="pr-2">
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{varItem.name}</span>
                        {varItem.limitedEdition && (
                          <span className="text-[9px] bg-red-500/20 text-red-300 px-1 py-0.2 rounded font-mono">L.E.</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{varItem.years ? `${varItem.years} ` : ''}{varItem.powerHp ? `· ${varItem.powerHp} CV` : ''}</div>
                    </div>
                    {varItem.id === activeVar?.id && <Check className="w-4 h-4 text-red-400 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Sequential Controls (Prev / Next & Compare) */}
        <div className="flex items-center space-x-2 shrink-0">
          
          {onCompareTrigger && (
            <button
              onClick={onCompareTrigger}
              className="px-3 py-2 rounded-xl bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25 border border-indigo-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Compare versions</span>
            </button>
          )}

          <button
            disabled={!prevVariant}
            onClick={() => prevVariant && onSelectLevel('variant', prevVariant.generationId, prevVariant.id)}
            className="px-2.5 py-2 rounded-xl bg-[#171d2b] hover:bg-[#202738] disabled:opacity-30 disabled:pointer-events-none text-slate-200 border border-[#2b354d] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            title={prevVariant ? `Precedente: ${prevVariant.name ?? ''}` : ''}
            aria-label="Previous Variant"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden xl:inline">Precedente</span>
          </button>

          <button
            disabled={!nextVariant}
            onClick={() => nextVariant && onSelectLevel('variant', nextVariant.generationId, nextVariant.id)}
            className="px-2.5 py-2 rounded-xl bg-[#171d2b] hover:bg-[#202738] disabled:opacity-30 disabled:pointer-events-none text-slate-200 border border-[#2b354d] text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            title={nextVariant ? `Successiva: ${nextVariant.name ?? ''}` : ''}
            aria-label="Next Variant"
          >
            <span className="hidden xl:inline">Successiva</span>
            <ArrowRight className="w-3.5 h-3.5 text-red-400" />
          </button>
        </div>

      </div>

      {/* ------------------------------------------------------------------- */}
      {/* MOBILE VIEW */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex lg:hidden flex-col gap-2">
        
        {/* Abbreviated Mobile Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <span>{navigationData.manufacturer.name ?? 'Manufacturer'}</span>
              <span>·</span>
              <button onClick={() => onSelectLevel('model')} className="text-white hover:underline">
                {navigationData.model.name ?? 'Model'}
              </button>
            </div>
            <div className="text-sm font-extrabold text-red-400 flex items-center gap-1.5 mt-0.5">
              <span>{activeGenCodeDisplay}</span>
              <span className="text-slate-500">·</span>
              <span className="truncate max-w-[200px]">{activeVar?.name}</span>
            </div>
          </div>

          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-600/20 active:scale-95 transition-all"
            aria-label="Change version"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{isIt ? 'Cambia versione' : 'Change version'}</span>
          </button>
        </div>

      </div>

      {/* ------------------------------------------------------------------- */}
      {/* MOBILE BOTTOM SHEET / DRAWER */}
      {/* ------------------------------------------------------------------- */}
      {mobileDrawerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end flex-col lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={isIt ? 'Selettore Gerarchico Versione' : 'Version Selector'}
        >
          {/* Backdrop dismissal */}
          <div className="flex-1" onClick={() => setMobileDrawerOpen(false)} />

          {/* Drawer container */}
          <div 
            ref={drawerRef}
            className="w-full bg-[#121622] border-t border-[#2a3449] rounded-t-3xl max-h-[85vh] flex flex-col p-4 shadow-2xl animate-in slide-in-from-bottom duration-200"
          >
            {/* Drawer Drag Bar & Close */}
            <div className="flex items-center justify-between pb-3 border-b border-[#202738]">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <span>{navigationData.manufacturer.name ?? ''} {navigationData.model.name ?? ''}</span>
                  <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-mono">
                    {navigationData.generations.length} {isIt ? 'gen' : 'generations'}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isIt ? 'Seleziona generazione e versione desiderata' : 'Select desired generation and variant'}
                </p>
              </div>

              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-2 rounded-xl bg-[#1b2232] text-slate-300 hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center border border-[#2b354d]"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Filter */}
            <div className="relative my-3">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-red-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={drawerSearchQuery}
                onChange={(e) => setDrawerSearchQuery(e.target.value)}
                placeholder={isIt ? 'Filtra versione (es. E30, CSL, Sport Evo...)' : 'Filter variant (e.g. E30, CSL, Sport Evo...)'}
                className="w-full bg-[#171d2b] text-xs text-slate-100 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-[#2b354d] focus:outline-none focus:border-red-500 min-h-[44px]"
              />
            </div>

            {/* Fast Family Overview CTA */}
            <div className="mb-3 flex items-center gap-2">
              <button
                onClick={() => {
                  onSelectLevel('model');
                  setMobileDrawerOpen(false);
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all text-center border ${
                  currentLevel === 'model'
                    ? 'bg-red-600 text-white border-red-400'
                    : 'bg-[#18202e] text-slate-200 border-[#2b364e] hover:bg-[#20293b]'
                }`}
              >
                🏛️ {isIt ? 'Main Model Family Overview' : 'Main Model Family Overview'}
              </button>
            </div>

            {/* Generations & Variants List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
              {filteredGenerations.map((gen, idx) => (
                <div key={gen.id} className="bg-[#171d2b] rounded-2xl border border-[#232d42] p-3">
                  
                  <div className="flex items-center justify-between pb-2 border-b border-[#232d42]">
                    <button
                      onClick={() => {
                        onSelectLevel('generation', gen.id);
                        setMobileDrawerOpen(false);
                      }}
                      className="text-left group"
                    >
                      <div className="text-xs font-black text-red-400 group-hover:underline flex items-center gap-1.5">
                        <span>{getGenerationCodeLabel(gen, idx)}</span>
                        {gen.name && <span className="text-slate-400 font-normal">· {gen.name}</span>}
                      </div>
                      <div className="text-[10px] text-slate-400">{gen.years ?? ''}</div>
                    </button>

                    <button
                      onClick={() => {
                        onSelectLevel('generation', gen.id);
                        setMobileDrawerOpen(false);
                      }}
                      className="text-[10px] font-bold text-slate-300 hover:text-red-400 bg-[#121622] px-2 py-1 rounded border border-[#2b354d]"
                    >
                      {isIt ? 'Vedi Generazione' : 'View Generation'}
                    </button>
                  </div>

                  {/* Variants under Generation */}
                  <div className="mt-2 space-y-1.5">
                    {gen.variants.map(v => {
                      const isActive = v.id === activeVar?.id && currentLevel === 'variant';
                      return (
                        <button
                          key={v.id}
                          onClick={() => {
                            onSelectLevel('variant', gen.id, v.id);
                            setMobileDrawerOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all text-left min-h-[44px] ${
                            isActive
                              ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/40'
                              : 'bg-[#121622] text-slate-300 hover:bg-[#1a2233] border border-transparent'
                          }`}
                        >
                          <div>
                            <div className="font-bold flex items-center gap-1.5">
                              <span>{v.name}</span>
                              {v.limitedEdition && (
                                <span className="text-[9px] bg-red-500/20 text-red-300 px-1 py-0.2 rounded font-mono">L.E.</span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">{v.years ? `${v.years} ` : ''}{v.powerHp ? `· ${v.powerHp} CV` : ''}</div>
                          </div>

                          {isActive && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                              <Check className="w-3 h-3" /> {isIt ? 'Attiva' : 'Active'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </nav>
  );
};
