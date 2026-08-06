import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Car, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  Lock,
  Mail,
  Briefcase,
  FileText,
  Award
} from 'lucide-react';
import { UserRole } from '../types';
import { Locale, translations } from '../data/translations';

interface RegisterPageProps {
  locale: Locale;
  activeRole: UserRole;
  setActiveRole: (r: UserRole) => void;
  onNavigate: (page: string, slug?: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  locale,
  activeRole,
  setActiveRole,
  onNavigate
}) => {
  const t = translations[locale];

  // User type tab: 'privato' or 'professionale'
  const [accountType, setAccountType] = useState<'privato' | 'professionale'>('privato');
  const [submitted, setSubmitted] = useState(false);

  // Private User Form State
  const [privateForm, setPrivateForm] = useState({
    fullName: '',
    email: '',
    password: '',
    preferredBrands: ['Ferrari', 'Porsche'],
    collectorGoal: 'Appassionato e Monitoraggio Quotazioni',
    newsletter: true
  });

  // Professional User Form State
  const [proForm, setProForm] = useState({
    companyName: '',
    vatNumber: '',
    businessType: 'Dealer Indipendente Specialist',
    inventorySize: '10 - 50 vetture',
    contactPerson: '',
    workEmail: '',
    phone: '',
    licenseCode: '',
    specializations: ['Supercar Europee', 'Youngtimer']
  });

  const handlePrivateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (privateForm.fullName && privateForm.email) {
      setActiveRole('registered_user');
      setSubmitted(true);
    }
  };

  const handleProSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (proForm.companyName && proForm.workEmail && proForm.vatNumber) {
      setActiveRole('dealer');
      setSubmitted(true);
    }
  };

  const brandOptions = ['Ferrari', 'Porsche', 'Lamborghini', 'McLaren', 'Bugatti', 'Lancia', 'Alfa Romeo', 'BMW M'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#121624] via-[#181d2e] to-[#0f121d] p-6 lg:p-8 rounded-2xl border border-[#232a3d] space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Automotive Intelligence Dynamic Registration</span>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Create Your Account on The Right Gear
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Select your registration path to access the historical database, auction financial reports, and specialized tools.
        </p>
      </div>

      {submitted ? (
        /* Success Screen */
        <div className="bg-[#121520] p-8 rounded-2xl border border-emerald-500/30 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Registration Completed Successfully!</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              {accountType === 'privato' 
                ? 'Welcome to the collector community. Your Private User profile is now active.' 
                : 'Your request for a Professional Account (Dealer / Auction House) has been submitted successfully.'}
            </p>
          </div>

          <div className="p-4 bg-[#171b28] rounded-xl border border-[#252d42] max-w-md mx-auto text-left text-xs space-y-2">
            <div className="text-red-400 font-bold uppercase tracking-wider text-[10px]">Account Summary</div>
            <div className="text-slate-200">
              <span className="text-slate-400">Account Type: </span> 
              <span className="font-bold capitalize">{accountType === 'privato' ? 'Private Collector Account' : 'Professional Operator Account (Dealer / Auctions)'}</span>
            </div>
            <div className="text-slate-200">
              <span className="text-slate-400">Assigned Role: </span> 
              <span className="font-bold text-emerald-400">{activeRole.replace('_', ' ').toUpperCase()}</span>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate(accountType === 'privato' ? 'home' : 'dealer-portal')}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{accountType === 'privato' ? 'Go to Homepage' : 'Access Dealer Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Dynamic Registration Selection & Forms */
        <div className="space-y-6">
          
          {/* Selector Tabs: Privato vs Professionale */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setAccountType('privato')}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-start space-x-4 ${
                accountType === 'privato'
                  ? 'bg-gradient-to-br from-[#1a2030] to-[#131724] border-red-500/80 ring-1 ring-red-500/30 text-white shadow-xl'
                  : 'bg-[#121520] border-[#23293a] text-slate-400 hover:border-[#323d57] hover:text-slate-200'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                accountType === 'privato' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-[#181c28] text-slate-500'
              }`}>
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Private User</div>
                <div className="text-xs text-red-400/90 font-medium mt-0.5">Enthusiast & Collector</div>
                <div className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  Track valuations, build custom watchlists, and receive alerts on market trends.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAccountType('professionale')}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-start space-x-4 ${
                accountType === 'professionale'
                  ? 'bg-gradient-to-br from-[#1a2030] to-[#131724] border-purple-500/80 ring-1 ring-purple-500/30 text-white shadow-xl'
                  : 'bg-[#121520] border-[#23293a] text-slate-400 hover:border-[#323d57] hover:text-slate-200'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                accountType === 'professionale' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-[#181c28] text-slate-500'
              }`}>
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Professional User</div>
                <div className="text-xs text-purple-400/90 font-medium mt-0.5">Dealer, Auction House, Advisor</div>
                <div className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  List inventory on the marketplace, access liquidity analytics, and certify auction lots.
                </div>
              </div>
            </button>
          </div>

          {/* Form Container */}
          <div className="bg-[#121520] p-6 lg:p-8 rounded-2xl border border-[#23293a] space-y-6">
            
            {accountType === 'privato' ? (
              /* Privato Form */
              <form onSubmit={handlePrivateSubmit} className="space-y-5">
                <div className="flex items-center space-x-2 text-red-400 border-b border-[#222838] pb-3">
                  <User className="w-5 h-5" />
                  <h2 className="text-base font-bold text-white">Private User Registration Form</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. John Doe"
                      value={privateForm.fullName}
                      onChange={e => setPrivateForm({...privateForm, fullName: e.target.value})}
                      className="w-full bg-[#171b28] text-xs text-white placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-[#283248] focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Email Address *</label>
                    <input
                      required
                      type="email"
                      placeholder="john.doe@example.com"
                      value={privateForm.email}
                      onChange={e => setPrivateForm({...privateForm, email: e.target.value})}
                      className="w-full bg-[#171b28] text-xs text-white placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-[#283248] focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Password *</label>
                    <input
                      required
                      type="password"
                      placeholder="••••••••••••"
                      value={privateForm.password}
                      onChange={e => setPrivateForm({...privateForm, password: e.target.value})}
                      className="w-full bg-[#171b28] text-xs text-white placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-[#283248] focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Primary Goal</label>
                    <select
                      value={privateForm.collectorGoal}
                      onChange={e => setPrivateForm({...privateForm, collectorGoal: e.target.value})}
                      className="w-full bg-[#171b28] text-xs text-white px-3.5 py-2.5 rounded-xl border border-[#283248] focus:outline-none focus:border-red-500"
                    >
                      <option value="Enthusiast & Market Valuation Tracking">Enthusiast & Market Valuation Tracking</option>
                      <option value="First Supercar / Youngtimer Purchase">First Supercar / Youngtimer Purchase</option>
                      <option value="Collector Portfolio Management">Collector Portfolio Management</option>
                      <option value="Historical Technical Data Research">Historical Technical Data Research</option>
                    </select>
                  </div>
                </div>

                {/* Preferred Brands checkboxes */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">Key Brands of Interest</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {brandOptions.map(brand => {
                      const isSelected = privateForm.preferredBrands.includes(brand);
                      return (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => {
                            setPrivateForm({
                              ...privateForm,
                              preferredBrands: isSelected
                                ? privateForm.preferredBrands.filter(b => b !== brand)
                                : [...privateForm.preferredBrands, brand]
                            });
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-red-500/20 text-red-300 border-red-500/50'
                              : 'bg-[#171b28] text-slate-400 border-[#283248] hover:text-slate-200'
                          }`}
                        >
                          {brand}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Newsletter Checkbox */}
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="newsletter-check"
                    checked={privateForm.newsletter}
                    onChange={e => setPrivateForm({...privateForm, newsletter: e.target.checked})}
                    className="rounded border-[#283248] bg-[#171b28] text-red-500 focus:ring-red-500"
                  />
                  <label htmlFor="newsletter-check" className="text-xs text-slate-300 cursor-pointer">
                    Receive monthly newsletter with Top Gainers & Losers analysis and auction highlights.
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-600/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Complete Private Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              /* Professionale Form */
              <form onSubmit={handleProSubmit} className="space-y-5">
                <div className="flex items-center space-x-2 text-purple-400 border-b border-[#222838] pb-3">
                  <Building2 className="w-5 h-5" />
                  <h2 className="text-base font-bold text-white">Professional User Registration Form (Dealer / Auctions)</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Company Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Scuderia Classica Ltd."
                      value={proForm.companyName}
                      onChange={e => setProForm({...proForm, companyName: e.target.value})}
                      className="w-full bg-[#171b28] text-xs text-white placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-[#283248] focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">VAT / Tax ID Number *</label>
                    <input
                      required
                      type="text"
                      placeholder="GB123456789"
                      value={proForm.vatNumber}
                      onChange={e => setProForm({...proForm, vatNumber: e.target.value})}
                      className="w-full bg-[#171b28] text-xs text-white placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-[#283248] focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Business Type</label>
                    <select
                      value={proForm.businessType}
                      onChange={e => setProForm({...proForm, businessType: e.target.value})}
                      className="w-full bg-[#171b28] text-xs text-white px-3.5 py-2.5 rounded-xl border border-[#283248] focus:outline-none focus:border-purple-500"
                    >
                      <option value="Authorized Franchise Dealer">Authorized Franchise Dealer</option>
                      <option value="Independent Specialist Dealer">Independent Specialist Dealer</option>
                      <option value="Automotive Auction House">Automotive Auction House</option>
                      <option value="Automotive Advisor / Appraiser">Automotive Advisor / Appraiser</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Inventory / Fleet Size</label>
                    <select
                      value={proForm.inventorySize}
                      onChange={e => setProForm({...proForm, inventorySize: e.target.value})}
                      className="w-full bg-[#171b28] text-xs text-white px-3.5 py-2.5 rounded-xl border border-[#283248] focus:outline-none focus:border-purple-500"
                    >
                      <option value="1 - 10 vehicles">1 - 10 vehicles</option>
                      <option value="10 - 50 vehicles">10 - 50 vehicles</option>
                      <option value="50+ vehicles">50+ vehicles</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Contact Person *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Mark Smith"
                      value={proForm.contactPerson}
                      onChange={e => setProForm({...proForm, contactPerson: e.target.value})}
                      className="w-full bg-[#171b28] text-xs text-white placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-[#283248] focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Business Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="info@scuderiaclassica.com"
                      value={proForm.workEmail}
                      onChange={e => setProForm({...proForm, workEmail: e.target.value})}
                      className="w-full bg-[#171b28] text-xs text-white placeholder-slate-500 px-3.5 py-2.5 rounded-xl border border-[#283248] focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Submit Professional Account Request</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
