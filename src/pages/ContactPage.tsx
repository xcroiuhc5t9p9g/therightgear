import React, { useState } from 'react';
import { Mail, Database, Terminal, Building2, MessageSquare, AlertCircle } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="w-full flex flex-col bg-trg-warm-white pb-24">
      {/* 1. HERO */}
      <section className="bg-white border-b border-trg-gray-200 py-16 md:py-24">
        <div className="max-w-[1024px] mx-auto px-4 w-full text-center">
          <p className="text-sm font-semibold tracking-widest text-trg-gray-400 uppercase mb-4">Contact</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-trg-carbon mb-6">
            Let's talk.
          </h1>
          <p className="text-lg md:text-xl text-trg-gray-500 max-w-2xl mx-auto">
            The Right Gear is developing relationships with automotive data providers, technology companies, industry specialists and partners around the world.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 w-full pt-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left Column: Inquiry Types */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-trg-carbon mb-8">How can we collaborate?</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-trg-gray-200 rounded-xl p-6 hover:border-trg-gray-300 transition-colors">
                <Database className="w-6 h-6 text-trg-carbon mb-4" />
                <h3 className="font-bold text-trg-carbon mb-2">Data Partnerships</h3>
                <p className="text-sm text-trg-gray-500">Provide structured automotive data, market observations, or historical records.</p>
              </div>
              <div className="bg-white border border-trg-gray-200 rounded-xl p-6 hover:border-trg-gray-300 transition-colors">
                <Terminal className="w-6 h-6 text-trg-carbon mb-4" />
                <h3 className="font-bold text-trg-carbon mb-2">Technology Partnerships</h3>
                <p className="text-sm text-trg-gray-500">Integrate AI, semantic search, graph databases, or web infrastructure.</p>
              </div>
              <div className="bg-white border border-trg-gray-200 rounded-xl p-6 hover:border-trg-gray-300 transition-colors">
                <Building2 className="w-6 h-6 text-trg-carbon mb-4" />
                <h3 className="font-bold text-trg-carbon mb-2">Industry Collaboration</h3>
                <p className="text-sm text-trg-gray-500">Auction houses, dealers, restorers, and specialist automotive platforms.</p>
              </div>
              <div className="bg-white border border-trg-gray-200 rounded-xl p-6 hover:border-trg-gray-300 transition-colors">
                <MessageSquare className="w-6 h-6 text-trg-carbon mb-4" />
                <h3 className="font-bold text-trg-carbon mb-2">General Enquiries</h3>
                <p className="text-sm text-trg-gray-500">Editorial corrections, press, investments, or general platform questions.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white border border-trg-gray-200 rounded-2xl p-8 lg:p-10 shadow-sm">
            {formSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <AlertCircle className="w-12 h-12 text-trg-gray-400" />
                <h3 className="text-xl font-bold text-trg-carbon">Contact form integration is currently being configured.</h3>
                <p className="text-trg-gray-500">
                  We are unable to process messages at this time. Please check back later.
                </p>
                <button 
                  onClick={() => setFormSubmitted(false)}
                  className="mt-6 px-6 py-2 bg-trg-gray-100 text-trg-carbon hover:bg-trg-gray-200 font-medium rounded-lg transition-colors"
                >
                  Return to form
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-trg-carbon">Name</label>
                    <input type="text" id="name" required className="w-full bg-white border border-trg-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-trg-red focus:ring-1 focus:ring-trg-red transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-trg-carbon">Email</label>
                    <input type="email" id="email" required className="w-full bg-white border border-trg-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-trg-red focus:ring-1 focus:ring-trg-red transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="company" className="block text-sm font-medium text-trg-carbon">Company / Organisation</label>
                    <input type="text" id="company" className="w-full bg-white border border-trg-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-trg-red focus:ring-1 focus:ring-trg-red transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="country" className="block text-sm font-medium text-trg-carbon">Country <span className="text-trg-gray-400 font-normal">(optional)</span></label>
                    <input type="text" id="country" className="w-full bg-white border border-trg-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-trg-red focus:ring-1 focus:ring-trg-red transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="reason" className="block text-sm font-medium text-trg-carbon">Reason for contact</label>
                  <select id="reason" required className="w-full bg-white border border-trg-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-trg-red focus:ring-1 focus:ring-trg-red transition-all appearance-none">
                    <option value="">Select a reason...</option>
                    <option value="data">Data Partnership</option>
                    <option value="tech">Technology Partnership</option>
                    <option value="industry">Industry Collaboration</option>
                    <option value="press">Press / Media</option>
                    <option value="investment">Investment</option>
                    <option value="general">General Enquiry</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-trg-carbon">Message</label>
                  <textarea id="message" rows={5} required className="w-full bg-white border border-trg-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-trg-red focus:ring-1 focus:ring-trg-red transition-all resize-none"></textarea>
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="privacy" required className="mt-1 w-4 h-4 text-trg-red border-trg-gray-300 rounded focus:ring-trg-red" />
                  <label htmlFor="privacy" className="text-sm text-trg-gray-500">
                    I agree to the <button type="button" onClick={() => onNavigate('privacy')} className="text-trg-carbon hover:text-trg-red underline">Privacy Policy</button> and consent to the processing of my data for this enquiry.
                  </label>
                </div>

                <button type="submit" className="w-full bg-trg-carbon hover:bg-trg-graphite text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" /> Send Message
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
