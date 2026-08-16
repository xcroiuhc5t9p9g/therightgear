import React from 'react';
import { HeroBlock, Container } from '../components/ui-blocks';

interface MethodologyPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const MethodologyPage: React.FC<MethodologyPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-white min-h-screen">
      <HeroBlock 
        title="Methodology"
        subtitle="How we structure and verify automotive intelligence."
      />
      <section className="py-20">
        <Container>
          <div className="max-w-prose-trg mx-auto prose prose-trg">
            <h2 className="text-2xl font-bold text-trg-carbon mb-6">Evidence-led Knowledge</h2>
            <p className="text-trg-gray-500 mb-8 leading-relaxed text-lg">
              Every important automotive claim should retain its provenance. We structure data using an assertion model, ensuring that technical specifications and historical facts are linked back to their original sources.
            </p>

            <h2 className="text-2xl font-bold text-trg-carbon mb-6">The Canonical Hierarchy</h2>
            <p className="text-trg-gray-500 mb-8 leading-relaxed text-lg">
              We organize the automotive world using a strict canonical hierarchy: <strong>Maker &rarr; Model &rarr; Generation &rarr; Variant &rarr; Vehicle Instance</strong>. This ensures that a specific homologation special is semantically distinct from its base model, preventing data pollution.
            </p>

            <h2 className="text-2xl font-bold text-trg-carbon mb-6">Data Conflict & Resolution</h2>
            <p className="text-trg-gray-500 mb-8 leading-relaxed text-lg">
              Automotive history is full of conflicting numbers. Rather than overwriting data when a new source appears, our graph preserves competing assertions. Canonical values are explicitly selected through an editorial process, maintaining the full history of evidence.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
};
