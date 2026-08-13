import React from 'react';

export const TermsOfUsePage: React.FC = () => {
  return (
    <div className="w-full flex flex-col bg-trg-warm-white pb-24">
      <section className="bg-white border-b border-trg-gray-200 py-16 md:py-24">
        <div className="max-w-[1024px] mx-auto px-4 w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-trg-carbon mb-6">
            Terms of Use
          </h1>
          <p className="text-lg text-trg-gray-500">Effective Date: October 2026</p>
        </div>
      </section>

      <div className="max-w-[800px] mx-auto px-4 w-full pt-16">
        <div className="prose prose-lg prose-slate max-w-none text-trg-gray-700">
          <p>
            These Terms of Use constitute a legally binding agreement made between you and The Right Gear concerning your access to and use of the platform.
          </p>

          <h2 className="text-2xl font-bold text-trg-carbon mt-12 mb-4">1. Intellectual Property Rights</h2>
          <p>
            Unless otherwise indicated, the platform and its proprietary data architecture, including the structure of the Automotive Knowledge Graph, databases, software, and design are our proprietary property. Data assertions, facts, and specifications belong to the public domain or their respective rightsholders, but the specific compilation, normalization, and presentation on this platform is protected by database rights.
          </p>

          <h2 className="text-2xl font-bold text-trg-carbon mt-12 mb-4">2. Platform Use Constraints</h2>
          <p>You may not access or use the platform for any purpose other than that for which we make the platform available. You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Systematically retrieve data or other content from the platform to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us (no automated scraping).</li>
            <li>Use the platform or its data to construct a competing database or intelligence platform.</li>
            <li>Circumvent, disable, or otherwise interfere with security-related features of the platform.</li>
          </ul>

          <h2 className="text-2xl font-bold text-trg-carbon mt-12 mb-4">3. Market Data Disclaimer</h2>
          <p>
            The Right Gear provides market intelligence and historical pricing data for informational purposes only. This data does not constitute financial, investment, or purchasing advice. We make no representations regarding the future value or liquidity of any vehicle.
          </p>

          <h2 className="text-2xl font-bold text-trg-carbon mt-12 mb-4">4. Modifications</h2>
          <p>
            We reserve the right, in our sole discretion, to make changes or modifications to these Terms of Use at any time and for any reason. We will alert you about any changes by updating the "Effective Date" of these Terms of Use.
          </p>
        </div>
      </div>
    </div>
  );
};
