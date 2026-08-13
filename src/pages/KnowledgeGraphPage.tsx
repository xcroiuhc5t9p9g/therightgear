import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Search, 
  ChevronRight, 
  User, 
  Wrench, 
  Car, 
  Building, 
  Flag, 
  Info,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';
import { GraphEntity, GraphRelationship } from '../types';
import { catalogueRepository } from '../services/catalogueRepository';
import { Locale, translations } from '../data/translations';
import { generateKnowledgeGraphJsonLd, injectSeoGeoMetadata, getAbsolutePageUrl } from '../services/seoGeoService';

interface KnowledgeGraphPageProps {
  locale: Locale;
  onNavigate: (page: string, slug?: string) => void;
}

export const KnowledgeGraphPage: React.FC<KnowledgeGraphPageProps> = ({ locale, onNavigate }) => {
  const t = translations[locale];

  const { GRAPH_ENTITIES, GRAPH_RELATIONSHIPS } = React.useMemo(() => {
    const entities: GraphEntity[] = [];
    const relationships: GraphRelationship[] = [];
    const hierarchy = catalogueRepository.getHierarchy();
    
    hierarchy.makers.forEach(maker => {
      entities.push({ id: maker.id, name: maker.canonical_name || maker.official_name || maker.slug, type: 'MANUFACTURER', slug: maker.slug, attributes: { Country: maker.country_code || '' } });
    });
    hierarchy.models.forEach(model => {
      entities.push({ id: model.id, name: model.canonical_name || (model as any).model_name || model.slug, type: 'MODEL', slug: model.slug, attributes: { Maker: model.maker_id } });
      relationships.push({ id: `rel-${model.id}-${model.maker_id}`, subject_entity_id: model.id, predicate: 'MANUFACTURED_BY', object_entity_id: model.maker_id, confidence_score: 1.0 });
    });
    hierarchy.generations.forEach(gen => {
      entities.push({ id: gen.id, name: gen.canonical_name || (gen as any).generation_name || gen.slug, type: 'GENERATION', slug: gen.slug, attributes: { Model: gen.model_id } });
      relationships.push({ id: `rel-${gen.id}-${gen.model_id}`, subject_entity_id: gen.id, predicate: 'PART_OF_MODEL', object_entity_id: gen.model_id, confidence_score: 1.0 });
    });
    hierarchy.variants.forEach(v => {
      entities.push({ id: v.id, name: `${v.manufacturer_name} ${v.variant_name}`, type: 'VARIANT', slug: v.slug, attributes: { Year: String(v.model_year_from || '') } });
      relationships.push({ id: `rel-${v.id}-${v.generation_id}`, subject_entity_id: v.id, predicate: 'PART_OF_GENERATION', object_entity_id: v.generation_id, confidence_score: 1.0 });
    });

    return { GRAPH_ENTITIES: entities, GRAPH_RELATIONSHIPS: relationships };
  }, []);

  const [selectedEntityId, setSelectedEntityId] = useState<string>(GRAPH_ENTITIES[0]?.id || 'bmw');
  const [entityFilter, setEntityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedEntity = GRAPH_ENTITIES.find(e => e.id === selectedEntityId) || GRAPH_ENTITIES[0];

  useEffect(() => {
    const pageCanonicalUrl = getAbsolutePageUrl('/graph');
    const schemas = generateKnowledgeGraphJsonLd(GRAPH_ENTITIES, GRAPH_RELATIONSHIPS);
    injectSeoGeoMetadata({
      title: 'Automotive Knowledge Graph - Grafo Ontologico Verificato | AIP',
      description: 'Mappa interattiva e verficata delle relazioni tra ingegneri, designer, motori e vetture storiche nel patrimonio automotive europeo.',
      canonicalUrl: pageCanonicalUrl,
      ogType: 'website',
      keywords: ['Knowledge Graph Automotive', 'Ingegneri', 'Designer', 'Motori', 'Ontologia Vetture']
    }, schemas);
  }, []);

  // Incoming and outgoing edges for selected entity
  const outgoingEdges = GRAPH_RELATIONSHIPS.filter(r => r.subject_entity_id === selectedEntityId);
  const incomingEdges = GRAPH_RELATIONSHIPS.filter(r => r.object_entity_id === selectedEntityId);

  const filteredEntities = GRAPH_ENTITIES.filter(e => {
    const matchesFilter = entityFilter === 'All' || e.type === entityFilter;
    const matchesQuery = !searchQuery || e.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const getEntityName = (id: string) => {
    const found = GRAPH_ENTITIES.find(e => e.id === id);
    return found ? found.name : id;
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'Variant': return <Car className="w-4 h-4 text-red-400" />;
      case 'Designer': return <User className="w-4 h-4 text-blue-400" />;
      case 'Engineer': return <Wrench className="w-4 h-4 text-emerald-400" />;
      case 'Engine': return <SlidersHorizontal className="w-4 h-4 text-purple-400" />;
      case 'Factory': return <Building className="w-4 h-4 text-rose-400" />;
      case 'Event': return <Flag className="w-4 h-4 text-yellow-400" />;
      default: return <Network className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-2">
        <div className="flex items-center space-x-2 text-blue-400">
          <Network className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Automotive Knowledge Graph Mesh</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">{t.graph_explorer_title}</h1>
        <p className="text-xs text-slate-400 max-w-2xl">
          Verified relational graph connecting models, designers, engineers, engine families, and historic manufacturing plants.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Entity Selector List */}
        <div className="lg:col-span-4 bg-[#121520] p-4 rounded-2xl border border-[#23293a] space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search graph node..."
              className="w-full bg-[#171b28] text-xs text-slate-200 placeholder-slate-500 pl-8 pr-3 py-2 rounded-lg border border-[#283045] focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-1 text-[11px]">
            {['All', 'Variant', 'Designer', 'Engineer', 'Engine', 'Factory', 'Event'].map(type => (
              <button
                key={type}
                onClick={() => setEntityFilter(type)}
                className={`px-2 py-1 rounded border transition-colors cursor-pointer ${
                  entityFilter === type
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500 font-bold'
                    : 'bg-[#171b28] text-slate-400 border-[#283045] hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredEntities.map(entity => (
              <button
                key={entity.id}
                onClick={() => setSelectedEntityId(entity.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedEntityId === entity.id
                    ? 'bg-blue-500/15 border-blue-500 text-white'
                    : 'bg-[#171a26] border-[#232a3c] text-slate-300 hover:bg-[#1f2536]'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  {getEntityIcon(entity.type)}
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{entity.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{entity.subtitle}</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Selected Entity Inspector Panel */}
        <div className="lg:col-span-8 bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-6">
          
          {/* Entity Profile Card */}
          <div className="flex items-start justify-between border-b border-[#202636] pb-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#181d2b] rounded-xl border border-[#2a324a]">
                {getEntityIcon(selectedEntity.type)}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                  {selectedEntity.type}
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">{selectedEntity.name}</h2>
                <p className="text-xs text-slate-400">{selectedEntity.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Connected Relational Edges */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Direct Inherited Relationships ({outgoingEdges.length + incomingEdges.length})
            </h3>

            <div className="space-y-3">
              {outgoingEdges.map(edge => (
                <div key={edge.id} className="bg-[#171a26] p-3.5 rounded-xl border border-[#242c3f] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{selectedEntity.name}</span>
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono-numbers font-bold text-[10px] border border-red-500/30">
                      {edge.predicate}
                    </span>
                    <button
                      onClick={() => setSelectedEntityId(edge.object_entity_id)}
                      className="font-bold text-blue-400 hover:underline cursor-pointer"
                    >
                      {getEntityName(edge.object_entity_id)}
                    </button>
                  </div>
                  <p className="text-xs text-slate-300">
                    {edge.explanation_en || edge.explanation_it}
                  </p>
                  <div className="flex items-center space-x-2 text-[10px] text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified with Confidence Score {edge.confidence_score}%</span>
                  </div>
                </div>
              ))}

              {incomingEdges.map(edge => (
                <div key={edge.id} className="bg-[#171a26] p-3.5 rounded-xl border border-[#242c3f] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={() => setSelectedEntityId(edge.subject_entity_id)}
                      className="font-bold text-blue-400 hover:underline cursor-pointer"
                    >
                      {getEntityName(edge.subject_entity_id)}
                    </button>
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono-numbers font-bold text-[10px] border border-blue-500/30">
                      {edge.predicate}
                    </span>
                    <span className="font-bold text-white">{selectedEntity.name}</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {edge.explanation_en || edge.explanation_it}
                  </p>
                </div>
              ))}

              {outgoingEdges.length === 0 && incomingEdges.length === 0 && (
                <div className="text-xs text-slate-500 py-6 text-center">
                  No connected relationships for this node.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
