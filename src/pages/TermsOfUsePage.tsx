import React from 'react';
import { SimplePageHeader } from '../components/ui-blocks';

export const TermsOfUsePage: React.FC = () => {
  return (
    <div className="w-full bg-white min-h-screen">
      <SimplePageHeader 
        title="Terms of Use"
        subtitle="Rules for using The Right Gear platform."
      />

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto prose prose-trg">
          <p className="text-sm text-trg-gray-500 mb-8 uppercase tracking-wider font-bold">Last Updated: August 2026</p>

          <h2 className="text-2xl font-bold text-trg-carbon mb-4">1. Acceptance of Terms</h2>
          <p className="text-trg-gray-500 mb-8 leading-relaxed">
            By accessing or using The Right Gear, you agree to be bound by these Terms of Use. If you do not agree to these terms, you may not use the platform.
          </p>

          <h2 className="text-2xl font-bold text-trg-carbon mb-4">2. Intellectual Property</h2>
          <p className="text-trg-gray-500 mb-8 leading-relaxed">
            The Right Gear's knowledge graph, structuring, methodology, and original editorial content are the intellectual property of The Right Gear. You may not scrape, mass-download, or reproduce our database without explicit commercial agreement.
          </p>

          <h2 className="text-2xl font-bold text-trg-carbon mb-4">3. User Accounts</h2>
          <p className="text-trg-gray-500 mb-8 leading-relaxed">
            You are responsible for safeguarding your account credentials. We reserve the right to suspend or terminate accounts that violate these terms, attempt to compromise platform security, or engage in unauthorized automated access.
          </p>

          <h2 className="text-2xl font-bold text-trg-carbon mb-4">4. Disclaimers</h2>
          <p className="text-trg-gray-500 mb-8 leading-relaxed">
            Automotive data, including historical specifications and market valuations, is provided for informational purposes only. The Right Gear does not guarantee absolute accuracy and is not responsible for financial or investment decisions made based on this platform.
          </p>
        </div>
      </section>
    </div>
  );
};
