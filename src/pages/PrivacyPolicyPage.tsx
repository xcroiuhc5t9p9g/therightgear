import React from 'react';
import { SimplePageHeader } from '../components/ui-blocks';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="w-full bg-white min-h-screen">
      <SimplePageHeader 
        title="Privacy Policy"
        subtitle="How we handle your data."
      />

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto prose prose-trg">
          <p className="text-sm text-trg-gray-500 mb-8 uppercase tracking-wider font-bold">Last Updated: August 2026</p>

          <h2 className="text-2xl font-bold text-trg-carbon mb-4">1. Introduction</h2>
          <p className="text-trg-gray-500 mb-8 leading-relaxed">
            The Right Gear is committed to protecting your privacy. This policy explains our data collection, processing, and storage practices, adhering to global privacy standards including GDPR principles.
          </p>

          <h2 className="text-2xl font-bold text-trg-carbon mb-4">2. Data We Collect</h2>
          <p className="text-trg-gray-500 mb-4 leading-relaxed">
            We only collect data necessary to provide our services. This includes:
          </p>
          <ul className="list-disc pl-6 text-trg-gray-500 mb-8 leading-relaxed space-y-2">
            <li><strong>Account Information:</strong> Email addresses and basic profile information when you register.</li>
            <li><strong>Usage Data:</strong> Interaction metrics, search queries, and watchlist items to improve the intelligence platform.</li>
            <li><strong>Technical Data:</strong> Standard server logs, IP addresses, and device information for security and optimization.</li>
          </ul>

          <h2 className="text-2xl font-bold text-trg-carbon mb-4">3. How We Use Your Data</h2>
          <p className="text-trg-gray-500 mb-8 leading-relaxed">
            We use your data to maintain account security, personalize your experience (such as your watchlist), and improve the quality of our automotive knowledge graph. We do not sell your personal data to third parties.
          </p>

          <h2 className="text-2xl font-bold text-trg-carbon mb-4">4. Your Rights</h2>
          <p className="text-trg-gray-500 mb-8 leading-relaxed">
            You have the right to access, rectify, or erase your personal data. You may also export your data or object to certain processing activities. To exercise these rights, please contact us.
          </p>
        </div>
      </section>
    </div>
  );
};
