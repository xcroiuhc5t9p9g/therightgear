import React from 'react';
import { Handshake, Database, ShieldCheck, Server, ArrowRight, CheckCircle2, Layers, Cpu, Code2, Globe } from 'lucide-react';
import { Locale } from '../data/translations';

interface DataPartnershipsPageProps {
  locale: Locale;
  onNavigate: (page: string, slug?: string) => void;
}

export const DataPartnershipsPage: React.FC<DataPartnershipsPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16 text-slate-200">
      
      {/* Header */}
      <div className="space-y-4 border-b border-[#23293a] pb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
          <Handshake className="w-3.5 h-3.5" />
          <span>Enterprise & Provider Integration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Data Partnerships & Provider Ecosystem
        </h1>
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl font-light">
          Building automotive intelligence through trusted enterprise integrations. The Right Gear is actively evaluating licensed automotive data feeds to expand taxonomy, technical specifications, factory equipment, and market observations.
        </p>
      </div>

      {/* Strategic Vision */}
      <div className="bg-[#121520] p-8 rounded-2xl border border-[#23293a] space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Database className="w-5 h-5 text-red-400" />
          <span>Licensed Data Integration Categories</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          To provide the world's most authoritative automotive intelligence platform, we complement our core editorial Knowledge Graph with pluggable provider adapters designed to ingest licensed commercial data across ten primary verticals:
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          <div className="bg-[#171b29] p-3 rounded-xl border border-[#23293a] text-center">
            <span className="font-bold text-xs text-white block">Vehicle Taxonomy</span>
            <span className="text-[10px] text-slate-400">Maker/Model/Gen</span>
          </div>
          <div className="bg-[#171b29] p-3 rounded-xl border border-[#23293a] text-center">
            <span className="font-bold text-xs text-white block">Technical Specs</span>
            <span className="text-[10px] text-slate-400">Engine, Gearbox, Chassis</span>
          </div>
          <div className="bg-[#171b29] p-3 rounded-xl border border-[#23293a] text-center">
            <span className="font-bold text-xs text-white block">Factory Options</span>
            <span className="text-[10px] text-slate-400">Equipment, Paint, Trim</span>
          </div>
          <div className="bg-[#171b29] p-3 rounded-xl border border-[#23293a] text-center">
            <span className="font-bold text-xs text-white block">Original Pricing</span>
            <span className="text-[10px] text-slate-400">MSRP & List Prices</span>
          </div>
          <div className="bg-[#171b29] p-3 rounded-xl border border-[#23293a] text-center">
            <span className="font-bold text-xs text-white block">Dealer Listings</span>
            <span className="text-[10px] text-slate-400">Inventory & Asking</span>
          </div>

          <div className="bg-[#171b29] p-3 rounded-xl border border-[#23293a] text-center">
            <span className="font-bold text-xs text-white block">Auction Outcomes</span>
            <span className="text-[10px] text-slate-400">Hammer & Sales</span>
          </div>
          <div className="bg-[#171b29] p-3 rounded-xl border border-[#23293a] text-center">
            <span className="font-bold text-xs text-white block">Transaction Logs</span>
            <span className="text-[10px] text-slate-400">Historical Sales</span>
          </div>
          <div className="bg-[#171b29] p-3 rounded-xl border border-[#23293a] text-center">
            <span className="font-bold text-xs text-white block">VIN Decoding</span>
            <span className="text-[10px] text-slate-400">Chassis Identifiers</span>
          </div>
          <div className="bg-[#171b29] p-3 rounded-xl border border-[#23293a] text-center">
            <span className="font-bold text-xs text-white block">Market Analytics</span>
            <span className="text-[10px] text-slate-400">Indices & Valuations</span>
          </div>
          <div className="bg-[#171b29] p-3 rounded-xl border border-[#23293a] text-center">
            <span className="font-bold text-xs text-white block">Media Assets</span>
            <span className="text-[10px] text-slate-400">Licensed Photography</span>
          </div>
        </div>
      </div>

      {/* Conceptual Provider Architecture Diagram */}
      <div className="bg-[#121520] p-8 rounded-2xl border border-[#23293a] space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Provider Integration Architecture</h2>
          <p className="text-xs text-slate-400 mt-1">
            Pluggable adapter design ensuring clean separation between commercial APIs and canonical entities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-7 gap-2 text-center text-xs">
          <div className="bg-[#171b29] p-3 rounded-xl border border-[#23293a] flex flex-col justify-center">
            <span className="font-bold text-white text-[11px]">EXTERNAL DATA PROVIDER</span>
            <span className="text-[9px] text-slate-400 mt-1">API / Feed / Registry</span>
          </div>

          <div className="flex items-center justify-center text-red-400 font-bold">
            <ArrowRight className="w-4 h-4 hidden md:block" />
          </div>

          <div className="bg-[#171b29] p-3 rounded-xl border border-[#23293a] flex flex-col justify-center">
            <span className="font-bold text-white text-[11px]">PROVIDER ADAPTER</span>
            <span className="text-[9px] text-slate-400 mt-1">API Normalizer</span>
          </div>

          <div className="flex items-center justify-center text-red-400 font-bold">
            <ArrowRight className="w-4 h-4 hidden md:block" />
          </div>

          <div className="bg-[#171b29] p-3 rounded-xl border border-[#23293a] flex flex-col justify-center">
            <span className="font-bold text-white text-[11px]">IDENTITY MAPPING</span>
            <span className="text-[9px] text-slate-400 mt-1">Entity Resolver</span>
          </div>

          <div className="flex items-center justify-center text-red-400 font-bold">
            <ArrowRight className="w-4 h-4 hidden md:block" />
          </div>

          <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/30 flex flex-col justify-center">
            <span className="font-bold text-red-400 text-[11px]">THE RIGHT GEAR CANONICAL</span>
            <span className="text-[9px] text-red-300 mt-1">Entity Graph</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed italic border-t border-[#23293a] pt-4">
          All external provider feeds pass through our Identity Resolver, ensuring provider taxonomy maps cleanly onto canonical Maker → Model → Generation → Variant structures without creating duplicate or fragmented records.
        </p>
      </div>

      {/* Commercial Licensing Capabilities */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Server className="w-5 h-5 text-red-400" />
            <span>Licensing Rights Capabilities</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Our infrastructure is architected to support enterprise licensing models including:
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>In-memory caching & persistent storage rights</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Schema normalization & entity cross-referencing</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Public display with verified provider attribution</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>AI-assisted processing & derived metrics generation</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Handshake className="w-5 h-5 text-red-400" />
            <span>Partner Inquiry</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you an automotive data provider, auction house, registry, or marketplace interested in enterprise integration or data licensing?
          </p>
          <div className="pt-3">
            <a 
              href="mailto:partnerships@therightgear.app" 
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
            >
              <span>Contact Partnership Team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};
