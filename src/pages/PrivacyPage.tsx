import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Locale } from '../data/translations';

interface PrivacyPageProps {
  locale: Locale;
  onNavigate: (page: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-8 px-4 font-sans text-slate-100">
      
      {/* Header */}
      <div className="space-y-4">
        <div className="text-[11px] font-semibold text-[#D71920] uppercase tracking-wider font-mono">
          PRIVACY & COMPLIANCE
        </div>
        <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-400 text-xs font-mono">
          Last updated: August 2026
        </p>
      </div>

      <div className="bg-[#171A1F] border border-[#2B303B] rounded-xl p-6 md:p-8 space-y-8 text-xs text-slate-300 leading-relaxed">
        
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D71920]" />
            1. About this Privacy Policy
          </h2>
          <p>
            The Right Gear respects your privacy and is committed to protecting your personal data. This privacy policy informs you about how we look after your personal data when you visit our globally accessible platform and tells you about your privacy rights.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            2. Who operates The Right Gear
          </h2>
          <p>
            The Right Gear is operated by a European entity. <span className="font-mono text-[#D71920]">[LEGAL_CONFIGURATION_REQUIRED]</span>
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            3. Data Controller
          </h2>
          <p>
            The Right Gear acts as the Data Controller for the personal data collected through this platform. <span className="font-mono text-[#D71920]">[LEGAL_CONFIGURATION_REQUIRED]</span>
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            4. Global availability of the service
          </h2>
          <p>
            The Right Gear is a globally accessible service operated by a European entity. While we welcome users internationally, our personal-data processing is described consistently with applicable European data-protection requirements, including GDPR where applicable.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            5. Personal data collected
          </h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you, including Identity Data, Contact Data, Technical Data, Profile Data, and Usage Data.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            6. How data is collected
          </h2>
          <p>
            We use different methods to collect data from and about you including through direct interactions (e.g. creating an account, contacting us) and automated technologies or interactions (e.g. cookies, server logs).
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            7. Purposes of processing
          </h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to register you as a new user, manage our relationship with you, improve our platform, and respond to your inquiries.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            8. Legal bases under applicable EU law
          </h2>
          <p>
            We rely on several legal bases to process your data, including performance of a contract, necessary for our legitimate interests, and consent.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            9. Account and authentication
          </h2>
          <p>
            When you create an account, we use third-party authentication services to securely manage your identity.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            10. Contact and partnership enquiries
          </h2>
          <p>
            If you contact us, we will process your contact details and the content of your message to respond to your inquiry.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            11. Technical/security logs
          </h2>
          <p>
            We maintain technical and security logs to ensure the stability and security of our platform.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            12. Cookies and analytics
          </h2>
          <p>
            We use cookies and similar tracking technologies to track the activity on our platform and hold certain information.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            13. Service providers and processors
          </h2>
          <p>
            We may share your personal data with external third parties who act as processors to provide IT and system administration services. <span className="font-mono text-[#D71920]">[LEGAL_CONFIGURATION_REQUIRED]</span>
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            14. International data transfers
          </h2>
          <p>
            Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ. <span className="font-mono text-[#D71920]">[LEGAL_CONFIGURATION_REQUIRED]</span>
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            15. Data retention
          </h2>
          <p>
            We will only retain your personal data for as long as reasonably necessary to fulfil the purposes we collected it for. <span className="font-mono text-[#D71920]">[LEGAL_CONFIGURATION_REQUIRED]</span>
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            16. GDPR and applicable privacy rights
          </h2>
          <p>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to access, rectification, erasure, restriction, portability, objection, and withdrawal of consent.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            17. Exercising rights
          </h2>
          <p>
            To exercise any of these rights, please contact us. We try to respond to all legitimate requests within one month.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            18. Right to complain to a supervisory authority
          </h2>
          <p>
            You have the right to make a complaint at any time to the relevant supervisory authority for data protection issues. We would, however, appreciate the chance to deal with your concerns before you approach them.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            19. Automated decision-making
          </h2>
          <p>
            We do not use your personal data for automated decision-making that has legal or similarly significant effects on you.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            20. Security
          </h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            21. Children
          </h2>
          <p>
            Our platform is not intended for children and we do not knowingly collect data relating to children.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            22. Changes to this Policy
          </h2>
          <p>
            We keep our privacy policy under regular review. This version was last updated on the date stated at the top of this page.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            23. Contact
          </h2>
          <p>
            For privacy-related inquiries or data requests, please visit our{' '}
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
