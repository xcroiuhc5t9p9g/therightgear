import React from 'react';
import { SimplePageHeader, Container } from '../components/ui-blocks';

interface FAQPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-white min-h-screen">
      <SimplePageHeader 
        title="FAQ & How it Works"
        subtitle="Common questions about The Right Gear and our automotive knowledge platform."
      />
      <section className="py-12">
        <Container>
          <div className="max-w-prose-trg mx-auto prose prose-trg">
            
            <h2 className="text-2xl font-bold text-trg-carbon mb-4">What is The Right Gear?</h2>
            <p className="text-trg-gray-500 mb-8 leading-relaxed text-lg">
              The Right Gear is an Automotive Intelligence Platform. We are not a classifieds site or a general car database. We focus purely on historically significant, culturally important, and investment-relevant cars, combining technical information, provenance, and market intelligence into a unified knowledge graph.
            </p>

            <h2 className="text-2xl font-bold text-trg-carbon mb-4">How does the Catalogue work?</h2>
            <p className="text-trg-gray-500 mb-8 leading-relaxed text-lg">
              Our catalogue follows a strict canonical hierarchy: <strong>Maker → Model → Generation → Variant</strong>. We never collapse these layers into generic groups. For instance, a "BMW M3 Sport Evolution" is treated as a specific homologation variant, structurally distinct from the generic E30 generation.
            </p>

            <h2 className="text-2xl font-bold text-trg-carbon mb-4">Where does the data come from?</h2>
            <p className="text-trg-gray-500 mb-8 leading-relaxed text-lg">
              All factual automotive data is rigorously sourced. Our assertions originate from official manufacturer records, trusted institutions, and specialist editorial research. We preserve the source of every claim. <strong>We do not invent facts, nor do we rely on AI memory to generate technical specifications.</strong>
            </p>

            <h2 className="text-2xl font-bold text-trg-carbon mb-4">Do you use AI on the platform?</h2>
            <p className="text-trg-gray-500 mb-8 leading-relaxed text-lg">
              Yes, but strictly for discovery, extraction, and structured normalization. AI helps us build the knowledge graph by reading trusted documents and identifying assertions, but every piece of canonical knowledge undergoes editorial review before it becomes public. AI never autonomously writes our facts.
            </p>

            <h2 className="text-2xl font-bold text-trg-carbon mb-4">What is Market Intelligence?</h2>
            <p className="text-trg-gray-500 mb-8 leading-relaxed text-lg">
              Market Intelligence tracks real observed market transactions, including auction results and verified dealer listings. We do not display simulated transactions, fabricated price histories, or fake metrics. If data is insufficient, we clearly state so.
            </p>

          </div>
        </Container>
      </section>
    </div>
  );
};
