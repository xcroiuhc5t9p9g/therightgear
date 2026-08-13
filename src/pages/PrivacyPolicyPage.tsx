import React from 'react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="w-full flex flex-col bg-trg-warm-white pb-24">
      <section className="bg-white border-b border-trg-gray-200 py-16 md:py-24">
        <div className="max-w-[1024px] mx-auto px-4 w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-trg-carbon mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-trg-gray-500">Effective Date: October 2026</p>
        </div>
      </section>

      <div className="max-w-[800px] mx-auto px-4 w-full pt-16">
        <div className="prose prose-lg prose-slate max-w-none text-trg-gray-700">
          <p>
            The Right Gear ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our platform.
          </p>
          <p>
            As a European-operated platform serving a global audience, we design our privacy architecture to align with strong data protection principles, including the General Data Protection Regulation (GDPR).
          </p>

          <h2 className="text-2xl font-bold text-trg-carbon mt-12 mb-4">1. Information We Collect</h2>
          <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name and email address, that you voluntarily give to us when you register with the platform or contact us.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the platform, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the platform.</li>
            <li><strong>Platform Interaction:</strong> Data related to your use of The Right Gear, such as vehicles added to your watchlist, comparison history, and search queries.</li>
          </ul>

          <h2 className="text-2xl font-bold text-trg-carbon mt-12 mb-4">2. Use of Your Information</h2>
          <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Create and manage your account.</li>
            <li>Deliver targeted functionality such as personal watchlists and market alerts.</li>
            <li>Improve the platform and our data models.</li>
            <li>Respond to your customer service requests.</li>
          </ul>

          <h2 className="text-2xl font-bold text-trg-carbon mt-12 mb-4">3. Data Storage and Security</h2>
          <p>
            We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>

          <h2 className="text-2xl font-bold text-trg-carbon mt-12 mb-4">4. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please contact us via the Contact page.
          </p>
        </div>
      </div>
    </div>
  );
};
