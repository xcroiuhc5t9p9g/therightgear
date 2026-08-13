import React from 'react';
import { Database, Search, FileCheck, GitMerge } from 'lucide-react';

interface MethodologyPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const MethodologyPage: React.FC<MethodologyPageProps> = () => {
  return (
    <div className="w-full flex flex-col bg-trg-warm-white pb-24">
      {/* 1. HERO */}
      <section className="bg-white border-b border-trg-gray-200 py-16 md:py-24">
        <div className="max-w-[1024px] mx-auto px-4 w-full text-center">
          <p className="text-sm font-semibold tracking-widest text-trg-gray-400 uppercase mb-4">Methodology</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-trg-carbon mb-6">
            Evidence-led automotive data.
          </h1>
          <p className="text-lg md:text-xl text-trg-gray-500 max-w-3xl mx-auto">
            How The Right Gear acquires, validates, and publishes global automotive knowledge.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1024px] mx-auto px-4 md:px-8 w-full pt-16">
        
        {/* Core Principles */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-trg-carbon mb-10">Core Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl border border-trg-gray-200">
              <div className="w-12 h-12 bg-trg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <Database className="w-6 h-6 text-trg-carbon" />
              </div>
              <h3 className="text-xl font-bold text-trg-carbon mb-3">No Factual Invention</h3>
              <p className="text-trg-gray-600 leading-relaxed">
                We never invent or estimate automotive facts. If a specification is unknown, it remains explicitly marked as missing or "insufficient data". We do not use generative AI to silently hallucinate technical details.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-trg-gray-200">
              <div className="w-12 h-12 bg-trg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <FileCheck className="w-6 h-6 text-trg-carbon" />
              </div>
              <h3 className="text-xl font-bold text-trg-carbon mb-3">Provenance First</h3>
              <p className="text-trg-gray-600 leading-relaxed">
                Every factual claim must retain its source. We track where the data came from, when it was retrieved, and the level of trust assigned to that source.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-trg-gray-200">
              <div className="w-12 h-12 bg-trg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <GitMerge className="w-6 h-6 text-trg-carbon" />
              </div>
              <h3 className="text-xl font-bold text-trg-carbon mb-3">Conflict Preservation</h3>
              <p className="text-trg-gray-600 leading-relaxed">
                When authoritative sources disagree on a fact (such as production numbers or weight), we preserve the conflicting evidence rather than silently overwriting it with a single "winner".
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-trg-gray-200">
              <div className="w-12 h-12 bg-trg-gray-100 rounded-lg flex items-center justify-center mb-6">
                <Search className="w-6 h-6 text-trg-carbon" />
              </div>
              <h3 className="text-xl font-bold text-trg-carbon mb-3">Canonical Hierarchy</h3>
              <p className="text-trg-gray-600 leading-relaxed">
                We respect the strict hierarchy of Maker → Model → Generation → Variant. We do not collapse generations or flatten distinct variants into generic vehicle records.
              </p>
            </div>
          </div>
        </div>

        {/* Source Trust Hierarchy */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-trg-carbon mb-8">Source Trust Hierarchy</h2>
          <p className="text-trg-gray-600 mb-8 text-lg">
            Not all sources carry equal weight. We classify evidence into distinct trust levels to help resolve conflicts and establish canonical knowledge.
          </p>
          <div className="bg-white border border-trg-gray-200 rounded-xl overflow-hidden">
            {[
              { level: '1', title: 'Official Manufacturer', desc: 'Direct technical documentation, press releases, or official archives from the maker.' },
              { level: '2', title: 'Official Institution', desc: 'Government registries, homologation documents (e.g., FIA), or transport authorities.' },
              { level: '3', title: 'Structured Data Providers', desc: 'Licensed commercial automotive data feeds and specialized structured databases.' },
              { level: '4', title: 'Specialist Editorial', desc: 'Respected automotive journalism, historical marque experts, and published books.' },
              { level: '5', title: 'Community / Aggregators', desc: 'Crowdsourced platforms, enthusiast forums, and general encyclopedias.' }
            ].map((tier, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row border-b border-trg-gray-200 last:border-0 p-6 sm:p-8">
                <div className="w-16 h-16 shrink-0 bg-trg-gray-100 rounded-lg flex flex-col items-center justify-center mb-4 sm:mb-0 sm:mr-8">
                  <span className="text-xs font-bold text-trg-gray-500 uppercase">Level</span>
                  <span className="text-2xl font-bold text-trg-carbon">{tier.level}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-trg-carbon mb-2">{tier.title}</h3>
                  <p className="text-trg-gray-600">{tier.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Pipeline */}
        <div>
          <h2 className="text-3xl font-bold text-trg-carbon mb-8">The Data Pipeline</h2>
          <div className="prose prose-lg prose-slate max-w-none text-trg-gray-600">
            <p>
              The Right Gear does not automatically publish web-scraped data. Our architecture follows a strict, multi-stage pipeline:
            </p>
            <ol className="mt-6 space-y-4">
              <li><strong>Source Discovery:</strong> Candidate documents and structured feeds are identified.</li>
              <li><strong>Extraction:</strong> Facts are extracted from the source material, preserving the raw value and context.</li>
              <li><strong>Normalization:</strong> Raw values are converted into standard units (e.g., kW, kg, mm) for global comparison.</li>
              <li><strong>Data Assertions:</strong> A formal "Assertion" record is created, linking the normalized fact permanently to its source URL/ID.</li>
              <li><strong>Conflict Detection:</strong> The system identifies if the new Assertion contradicts existing evidence for the same entity.</li>
              <li><strong>Editorial Review & Canonical Selection:</strong> A human editor (or strict algorithmic rule for trusted providers) reviews the evidence and selects the canonical value for public display.</li>
            </ol>
            <p className="mt-8">
              This process ensures that what you see on The Right Gear is not merely an AI hallucination, but a traceable, verified fact.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
