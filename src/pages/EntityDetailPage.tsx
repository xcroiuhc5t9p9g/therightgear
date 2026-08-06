import React, { useEffect } from 'react';
import { 
  User, 
  Building2, 
  Award, 
  CheckCircle2, 
  ArrowLeft, 
  Car, 
  Bot, 
  Network, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Globe
} from 'lucide-react';
import { KEY_ENTITIES, KeyEntity } from '../data/entitiesData';
import { HERO_VEHICLES } from '../data/catalogData';
import { Locale, translations } from '../data/translations';
import { generatePersonJsonLd, injectSeoGeoMetadata, getAbsolutePageUrl } from '../services/seoGeoService';

interface EntityDetailPageProps {
  entitySlug: string;
  locale: Locale;
  onNavigate: (page: string, slug?: string) => void;
  onSelectVehicle: (slug: string) => void;
}

export const EntityDetailPage: React.FC<EntityDetailPageProps> = ({
  entitySlug,
  locale,
  onNavigate,
  onSelectVehicle
}) => {
  const t = translations[locale];

  const entity = KEY_ENTITIES.find(e => e.slug === entitySlug) || KEY_ENTITIES[0];

  useEffect(() => {
    const canonical = getAbsolutePageUrl(`/designer/${entity.slug}`);
    const personSchema = generatePersonJsonLd({
      full_name: entity.name,
      nationality: entity.nationality,
      role: entity.type === 'Engineer' ? 'Engineer' : 'Designer',
      biography_it: entity.biographyIt,
      biography_en: entity.biographyEn
    });

    injectSeoGeoMetadata({
      title: `${entity.name} - ${entity.roleTitle} | Automotive Intelligence`,
      description: locale === 'it' ? entity.biographyIt.slice(0, 160) : entity.biographyEn.slice(0, 160),
      canonicalUrl: canonical,
      ogType: 'website',
      keywords: [entity.name, entity.type, 'Automotive Designer', 'Supercar Engineer', 'Automotive Intelligence']
    }, [personSchema]);
  }, [entity, locale]);

  // Find vehicles linked to this entity
  const associatedVehicles = HERO_VEHICLES.filter(v => 
    entity.associatedVehicleSlugs.includes(v.slug) ||
    v.designers.some(d => d.full_name.toLowerCase().includes(entity.name.toLowerCase()) || entity.name.toLowerCase().includes(d.full_name.toLowerCase())) ||
    v.engineers.some(e => e.full_name.toLowerCase().includes(entity.name.toLowerCase()) || entity.name.toLowerCase().includes(e.full_name.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Back Button Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-slate-300 hover:text-red-400 bg-[#141824] px-3.5 py-2 rounded-xl border border-[#232a3d] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-[#121520] px-3 py-1.5 rounded-lg border border-[#222838]">
          <Globe className="w-3.5 h-3.5 text-red-400" />
          <span>Knowledge Graph Certified Entity</span>
        </div>
      </div>

      {/* Main Banner Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#111420] via-[#171b29] to-[#0d101a] border border-[#232a3d] p-6 lg:p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <img
            src={entity.avatarUrl}
            alt={entity.name}
            className="w-28 h-28 lg:w-36 lg:h-36 rounded-2xl object-cover border-2 border-red-500/40 shadow-xl shadow-red-600/10 shrink-0"
          />

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-red-500/15 border border-red-500/30 text-red-300 text-[11px] font-bold uppercase tracking-wider">
                {entity.type}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#1a2030] text-slate-300 text-[11px] font-medium border border-[#283248]">
                {entity.nationality} ({entity.countryCode})
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#1a2030] text-red-400 text-[11px] font-mono font-bold border border-[#283248]">
                {entity.yearsActive}
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {entity.name}
            </h1>

            <p className="text-red-400/90 text-sm font-semibold">
              {entity.roleTitle}
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate('ai-advisor')}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Ask AI Advisor about {entity.name}</span>
              </button>

              <button
                onClick={() => onNavigate('graph')}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#1d2232] hover:bg-[#252c42] text-slate-200 font-semibold text-xs border border-[#303950] transition-all cursor-pointer"
              >
                <Network className="w-4 h-4 text-blue-400" />
                <span>View Relationship Graph</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Biography & Achievements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Biography Column */}
        <div className="lg:col-span-2 bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-4">
          <div className="flex items-center space-x-2 text-red-400 border-b border-[#222838] pb-3">
            <User className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white">Historical Biography & Technical Profile</h2>
          </div>

          <div className="text-sm text-slate-300 leading-relaxed space-y-3 font-sans">
            <p className="whitespace-pre-line">
              {entity.biographyEn || entity.biographyIt}
            </p>

            {(entity.companyInfoEn || entity.companyInfoIt) && (
              <div className="mt-4 p-4 rounded-xl bg-[#171b28] border border-[#252e42] space-y-1">
                <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>Corporate Roles & Operations</span>
                </div>
                <p className="text-xs text-slate-300 leading-normal">
                  {entity.companyInfoEn || entity.companyInfoIt}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Key Achievements & Innovations Sidebar */}
        <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-4">
          <div className="flex items-center space-x-2 text-purple-400 border-b border-[#222838] pb-3">
            <Award className="w-5 h-5" />
            <h2 className="text-base font-bold text-white">Key Contributions & Innovations</h2>
          </div>

          <ul className="space-y-3">
            {(entity.keyAchievementsEn || entity.keyAchievementsIt).map((ach, i) => (
              <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Associated Cars & Projects Section */}
      <section className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Car className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-bold text-white">
              Associated Vehicles & Projects ({associatedVehicles.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Click any car to view its full technical datasheet
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {associatedVehicles.map((car) => (
            <div
              key={car.id}
              onClick={() => {
                onSelectVehicle(car.slug);
                onNavigate('detail', car.slug);
              }}
              className="p-4 rounded-xl bg-[#161a26] hover:bg-[#1f2536] border border-[#242c3f] transition-all cursor-pointer group space-y-3"
            >
              <div className="relative h-40 rounded-lg overflow-hidden bg-slate-800">
                <img
                  src={car.hero_image_url}
                  alt={car.variant_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-red-400 border border-red-500/30">
                  €{(car.current_median_price_eur / 1000).toFixed(0)}k
                </div>
              </div>

              <div>
                <div className="text-xs font-extrabold text-white group-hover:text-red-400 transition-colors">
                  {car.manufacturer_name} {car.model_name}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {car.variant_name} ({car.model_year_from})
                </div>
              </div>

              <div className="pt-2 border-t border-[#23293b] flex items-center justify-between text-[11px] text-slate-400">
                <span>{car.engine.architecture} • {car.engine.power_hp} HP</span>
                <span className="text-red-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  View File <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
