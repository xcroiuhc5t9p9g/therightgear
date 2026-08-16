import React, { useState } from 'react';
import { Store, Building2, ShieldCheck, Mail, Phone, MapPin, ExternalLink, Plus, CheckCircle } from 'lucide-react';
import { catalogueRepository } from '../services/catalogueRepository';
import { DealerListing, UserRole } from '../types';
import { Locale, translations } from '../data/translations';

interface DealerMarketplacePageProps {
  locale: Locale;
  activeRole: UserRole;
  onNavigate: (page: string, slug?: string) => void;
}

export const DealerMarketplacePage: React.FC<DealerMarketplacePageProps> = ({
  locale,
  activeRole,
  onNavigate
}) => {
  const t = translations[locale];
  
  // Extract all dealer listings from cars
  const allListings: DealerListing[] = catalogueRepository.getAllVariants().vehicles.flatMap(v => v.listings || []);

  const [contactModalListing, setContactModalListing] = useState<DealerListing | null>(null);
  const [inquirySent, setInquirySent] = useState(false);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 mb-1">
            <Store className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Global Dealer Network</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">{t.dealer_listings_title}</h1>
          <p className="text-xs text-slate-400">
            Verified listings from accredited dealers and automotive specialists across Europe.
          </p>
        </div>

        {(activeRole === 'corporate_user' || activeRole === 'super_admin') && (
          <button onClick={() => onNavigate('contact')} className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-blue-600/20 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>List Vehicle in Network</span>
          </button>
        )}
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-[#121520] rounded-2xl border border-[#23293a] overflow-hidden hover:border-blue-500/50 transition-all space-y-4 p-5 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#202636] pb-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-white">
                    {(listing as any).dealer_name || listing.partner_dealer_name || 'Accredited Dealer'}
                  </span>
                </div>
                {(listing.dealer_verified || (listing as any).verification_status === 'Verified') && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                  </span>
                )}
              </div>

              <div>
                <div className="text-base font-bold text-white">
                  {listing.title || (listing as any).vehicle_title}
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {listing.dealer_city ? `${listing.dealer_city}, ${listing.dealer_country}` : ((listing as any).dealer_location || 'Europe')}
                  </span>
                </div>
              </div>

              <div className="bg-[#171b28] p-3 rounded-xl border border-[#262e42] flex justify-between items-center">
                <span className="text-xs text-slate-400">Asking Price</span>
                <span className="text-base font-bold text-red-400 font-mono-numbers">
                  €{(listing.price_eur || (listing as any).asking_price_eur || 0).toLocaleString()}
                </span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {listing.description_en || (listing as any).description || listing.description_it}
              </p>
            </div>

            <button
              onClick={() => { setContactModalListing(listing); setInquirySent(false); }}
              className="w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-bold text-xs transition-colors border border-blue-500/30 text-center cursor-pointer"
            >
              Contact Dealer
            </button>
          </div>
        ))}
      </div>

      {/* Inquiry Modal */}
      {contactModalListing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121520] border border-[#283146] rounded-2xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-lg font-bold text-white">Contact {contactModalListing.dealer_name || contactModalListing.partner_dealer_name}</h2>
            <p className="text-xs text-slate-300">
              Inquiry for: <strong className="text-red-400">{contactModalListing.title || (contactModalListing as any).vehicle_title}</strong>
            </p>

            {inquirySent ? (
              <div className="p-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs space-y-2 text-center">
                <CheckCircle className="w-8 h-8 mx-auto" />
                <p className="font-bold">Inquiry sent successfully!</p>
                <p className="text-slate-300">The dealer will respond directly to your email within 24 business hours.</p>
                <button
                  onClick={() => setContactModalListing(null)}
                  className="mt-3 px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setInquirySent(true); }} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Full Name</label>
                  <input required type="text" placeholder="John Doe" className="w-full bg-[#181c2a] text-slate-200 p-2 rounded-lg border border-[#293248]" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Contact Email</label>
                  <input required type="email" placeholder="john@example.com" className="w-full bg-[#181c2a] text-slate-200 p-2 rounded-lg border border-[#293248]" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Message / Question</label>
                  <textarea rows={3} placeholder="I would like to receive provenance history and condition details..." className="w-full bg-[#181c2a] text-slate-200 p-2 rounded-lg border border-[#293248]" />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setContactModalListing(null)}
                    className="px-3 py-2 bg-[#181c2a] text-slate-400 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg cursor-pointer"
                  >
                    Send Inquiry
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
