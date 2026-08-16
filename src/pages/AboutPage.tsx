import React from 'react';
import { SimplePageHeader, SectionHeader, Container } from '../components/ui-blocks';

interface AboutPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-white min-h-screen">
      <SimplePageHeader 
        title="About The Right Gear"
        subtitle="The reference layer for the cars that matter."
      />
      <section className="py-12">
        <Container>
          <div className="max-w-prose-trg mx-auto prose prose-trg">
            <h2 className="text-2xl font-bold text-trg-carbon mb-6">Our Mission</h2>
            <p className="text-trg-gray-500 mb-8 leading-relaxed text-lg">
              The Right Gear is an early-stage global automotive intelligence platform. We are building the data infrastructure required to connect history, technical specifications, and market data for iconic cars and motorcycles.
            </p>

            <h2 className="text-2xl font-bold text-trg-carbon mb-6">Scope & Focus</h2>
            <p className="text-trg-gray-500 mb-8 leading-relaxed text-lg">
              Our catalogue is not a general list of every car ever made. We focus purely on historically significant, culturally important, and investment-relevant vehicles. From 1950s classics to modern hypercars, our scope is defined by relevance rather than mere production volume.
            </p>

            <h2 className="text-2xl font-bold text-trg-carbon mb-6">Current Stage</h2>
            <p className="text-trg-gray-500 mb-8 leading-relaxed text-lg">
              We are currently in active development, establishing the fundamental knowledge graph and selected data partnerships. This preview environment demonstrates our layout, logic, and infrastructure as we prepare for full market integration.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
};
