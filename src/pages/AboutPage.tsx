import React from 'react';
import { Database, GitMerge, FileCheck, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full flex flex-col bg-trg-warm-white pb-24">
      {/* 1. HERO */}
      <section className="bg-white border-b border-trg-gray-200 py-16 md:py-24">
        <div className="max-w-[1024px] mx-auto px-4 w-full text-center">
          <p className="text-sm font-semibold tracking-widest text-trg-gray-400 uppercase mb-4">About The Right Gear</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-trg-carbon mb-6">
            The trusted reference layer for the cars that matter.
          </h1>
          <p className="text-lg md:text-xl text-trg-gray-500 max-w-3xl mx-auto">
            The Right Gear is an early-stage European Automotive Intelligence platform building global automotive data infrastructure.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1024px] mx-auto px-4 md:px-8 w-full pt-16">
        <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-trg-carbon prose-a:text-trg-red prose-a:no-underline hover:prose-a:underline">
          <p className="lead text-xl text-trg-carbon font-medium mb-12">
            The automotive world generates vast amounts of unstructured, conflicting, and fragmented data. We are building the infrastructure to decode it.
          </p>

          <h2 className="text-3xl font-bold text-trg-carbon mb-6">The Platform</h2>
          <p className="mb-8 text-trg-gray-600">
            The Right Gear combines historical automotive knowledge, technical information, market intelligence, and provenance into one coherent experience. We believe that to truly understand an iconic car, you must understand its DNA — the relationships between generations, the people who designed them, the engines that powered them, and the market that values them.
          </p>

          <h2 className="text-3xl font-bold text-trg-carbon mb-6">Our Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12 not-prose">
            <div className="bg-white border border-trg-gray-200 p-8 rounded-xl">
              <Database className="w-8 h-8 text-trg-carbon mb-4" />
              <h3 className="font-bold text-trg-carbon mb-3">Structured Data</h3>
              <p className="text-sm text-trg-gray-500">We model the global automotive world as a precise knowledge graph, not a list of articles.</p>
            </div>
            <div className="bg-white border border-trg-gray-200 p-8 rounded-xl">
              <FileCheck className="w-8 h-8 text-trg-carbon mb-4" />
              <h3 className="font-bold text-trg-carbon mb-3">Provenance First</h3>
              <p className="text-sm text-trg-gray-500">Every claim requires evidence. We preserve conflicting sources rather than inventing artificial truth.</p>
            </div>
            <div className="bg-white border border-trg-gray-200 p-8 rounded-xl">
              <GitMerge className="w-8 h-8 text-trg-carbon mb-4" />
              <h3 className="font-bold text-trg-carbon mb-3">AI & Editorial</h3>
              <p className="text-sm text-trg-gray-500">We combine AI-assisted extraction and normalization with strict human editorial control.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-trg-carbon mb-6">Project Status</h2>
          <p className="mb-8 text-trg-gray-600">
            The Right Gear is currently in early-stage development. We are actively building our core data models, establishing data pipelines, and forming relationships with commercial data providers and technology partners.
          </p>

          <div className="mt-16 pt-16 border-t border-trg-gray-200 flex flex-col md:flex-row gap-6 justify-between items-center not-prose">
            <div>
              <h3 className="font-bold text-trg-carbon mb-2">Learn more about our data approach</h3>
              <p className="text-sm text-trg-gray-500">Read our guidelines for evidence, sourcing, and conflict resolution.</p>
            </div>
            <button onClick={() => onNavigate('methodology')} className="inline-flex items-center gap-2 px-6 py-3 bg-trg-carbon text-white font-medium rounded-lg hover:bg-trg-graphite transition-colors whitespace-nowrap">
              View Methodology <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
