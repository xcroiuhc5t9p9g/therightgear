import React from 'react';
import { Scale } from 'lucide-react';
import { Locale } from '../data/translations';

interface TermsPageProps {
  locale: Locale;
  onNavigate: (page: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-8 px-4 font-sans text-slate-100">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="text-[11px] font-semibold text-[#D71920] uppercase tracking-wider font-mono">
          LEGAL & COMPLIANCE
        </div>
        <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
          Terms of Use
        </h1>
        <p className="text-slate-400 text-xs font-mono">
          Last updated: August 2026
        </p>
      </div>

      <div className="bg-[#171A1F] border border-[#2B303B] rounded-xl p-6 md:p-8 space-y-8 text-xs text-slate-300 leading-relaxed">
        
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#D71920]" />
            1. About The Right Gear
          </h2>
          <p>
            The Right Gear is a globally accessible automotive intelligence platform connecting the cars, people, engineering, history, and markets that matter.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            2. Operator of the service
          </h2>
          <p>
            The Right Gear is operated by a European entity. <span className="font-mono text-[#D71920]">[LEGAL_CONFIGURATION_REQUIRED]</span>
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            3. Global availability
          </h2>
          <p>
            Our services are accessible globally. These Terms of Use apply regardless of your jurisdiction, subject to any mandatory provisions of applicable law.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            4. Acceptance of Terms
          </h2>
          <p>
            By accessing or using The Right Gear platform, you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            5. Nature of the service
          </h2>
          <p>
            The Right Gear provides aggregated structured data, historical research, and market observations. We are an intelligence platform, not a classified marketplace or auction house.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            6. Automotive information
          </h2>
          <p>
            Catalogue information is aggregated from historical research, public archives, and licensed data sources. While we strive for accuracy, automotive histories often contain conflicting evidence. We do not guarantee the absolute accuracy of specifications or historical claims.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            7. Market information
          </h2>
          <p>
            All market observations, historical auction indicators, transaction ranges, and appreciation indices published on The Right Gear are provided for informational and educational purposes only.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            8. No financial/investment advice
          </h2>
          <p>
            Information provided does <strong className="text-white">not constitute financial advice, investment recommendations, or formal appraisals.</strong> Collector automobile markets fluctuate, and historical performance is no guarantee of future financial results.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            9. Accuracy and provenance
          </h2>
          <p>
            We aim to maintain the provenance of our data through our assertion system. However, users must independently verify any information before making purchasing or collection decisions.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            10. Third-party data and sources
          </h2>
          <p>
            Our platform may integrate or link to third-party data providers. We do not endorse and are not responsible for the contents or reliability of any third-party data or websites.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            11. User accounts
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            12. Acceptable use
          </h2>
          <p>
            You agree not to use the platform for any unlawful purpose, to solicit others to perform unlawful acts, or to scrape, automate, or mass-download our structured knowledge graph without explicit authorization.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            13. Intellectual property
          </h2>
          <p>
            The Right Gear compiles structured automotive specifications, engineering histories, model hierarchies, and knowledge relationships. Our original content, features, and functionality are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            14. User-submitted content
          </h2>
          <p>
            If you submit content or feedback to us, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and distribute that content in connection with our services.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            15. External services and links
          </h2>
          <p>
            We may provide links to external websites. We have no control over the content and practices of these sites and cannot accept responsibility for their respective privacy policies or terms.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            16. Availability and modifications
          </h2>
          <p>
            We reserve the right to modify or discontinue, temporarily or permanently, the platform or any features or portions thereof without prior notice.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            17. Suspension and termination
          </h2>
          <p>
            We may terminate or suspend access to our platform immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            18. Liability subject to mandatory applicable law
          </h2>
          <p>
            In no event shall The Right Gear, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the platform.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            19. Users in different jurisdictions
          </h2>
          <p>
            Depending on your jurisdiction, some of the above limitations of liability may not apply to you.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            20. Governing law and jurisdiction
          </h2>
          <p>
            <span className="font-mono text-[#D71920]">[LEGAL_CONFIGURATION_REQUIRED]</span>
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            21. Changes to Terms
          </h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our platform after those revisions become effective, you agree to be bound by the revised terms.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            22. Contact
          </h2>
          <p>
            If you have any questions regarding these terms, please reach out via our{' '}
            <button
              onClick={() => onNavigate('contact')}
              className="text-[#D71920] underline hover:text-white transition-colors cursor-pointer"
            >
              Contact page
            </button>.
          </p>
        </div>
      </div>
    </div>
  );
};
