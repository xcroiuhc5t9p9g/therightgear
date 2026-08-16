import React from 'react';
import { SimplePageHeader, Container } from '../components/ui-blocks';

interface ContactPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full bg-white min-h-screen">
      <SimplePageHeader 
        title="Contact"
        subtitle="Get in touch with The Right Gear."
      />
      <section className="py-12">
        <Container>
          <div className="max-w-prose-trg mx-auto prose prose-trg">
            <h2 className="text-2xl font-bold text-trg-carbon mb-6">Partnerships & Inquiries</h2>
            <p className="text-trg-gray-500 mb-8 leading-relaxed text-lg">
              The Right Gear is currently engaging with selected data providers, technical partners, and early stakeholders.
            </p>
            <div className="bg-trg-warm-white p-8 rounded-xl border border-trg-gray-200">
              <p className="text-trg-carbon font-bold text-lg mb-2">Direct Contact</p>
              <p className="text-trg-gray-500">contact@therightgear.com</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};
