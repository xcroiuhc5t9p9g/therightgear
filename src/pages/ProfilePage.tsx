import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Building2, 
  Bookmark, 
  CheckCircle2, 
  Settings, 
  Mail, 
  Sparkles, 
  FileCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { UserRole } from '../types';
import { HERO_VEHICLES } from '../data/catalogData';
import { Locale, translations } from '../data/translations';

interface ProfilePageProps {
  locale: Locale;
  activeRole: UserRole;
  setActiveRole: (r: UserRole) => void;
  watchlistIds: string[];
  onNavigate: (page: string, slug?: string) => void;
  onSelectVehicle: (slug: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  locale,
  activeRole,
  setActiveRole,
  watchlistIds,
  onNavigate,
  onSelectVehicle
}) => {
  const t = translations[locale];

  const [userName, setUserName] = useState('Riccardo Monaco');
  const [userEmail, setUserEmail] = useState('riccardo.monaco@gmail.com');
  const [companyName, setCompanyName] = useState('The Right Gear Collector Group');
  const [preferredCurrency, setPreferredCurrency] = useState<'EUR' | 'USD' | 'GBP'>('EUR');
  const [isSaved, setIsSaved] = useState(false);

  const watchlistVehicles = HERO_VEHICLES.filter(v => watchlistIds.includes(v.id));

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Top Banner */}
      <div className="bg-[#121520] p-6 lg:p-8 rounded-2xl border border-[#23293a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400 text-2xl font-bold shadow-lg">
            <User className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{userName}</h1>
              <span className="bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold">
                {activeRole.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{userEmail}</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('register')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-slate-950 font-bold text-xs shadow-md hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Change / Edit Account</span>
        </button>
      </div>

      {/* Role Management Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className={`p-4 rounded-xl border transition-all ${
          activeRole === 'registered_user' || activeRole === 'premium_user'
            ? 'bg-[#181d2c] border-red-500/50 text-white'
            : 'bg-[#121520] border-[#222838] text-slate-400'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5 text-red-400">
              <User className="w-4 h-4" />
              <span>Private User</span>
            </span>
            {activeRole === 'registered_user' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
          <p className="text-[11px] text-slate-300">Access to vehicle dossiers and personal watchlist.</p>
          <button
            onClick={() => setActiveRole('registered_user')}
            className="mt-3 text-[11px] text-red-400 hover:underline font-bold cursor-pointer"
          >
            Select Private Role
          </button>
        </div>

        <div className={`p-4 rounded-xl border transition-all ${
          activeRole === 'dealer'
            ? 'bg-[#181d2c] border-purple-500/50 text-white'
            : 'bg-[#121520] border-[#222838] text-slate-400'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5 text-purple-400">
              <Building2 className="w-4 h-4" />
              <span>Dealer / Operator</span>
            </span>
            {activeRole === 'dealer' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
          <p className="text-[11px] text-slate-300">Manage listings and dealer network portal.</p>
          <button
            onClick={() => setActiveRole('dealer')}
            className="mt-3 text-[11px] text-purple-400 hover:underline font-bold cursor-pointer"
          >
            Select Dealer Role
          </button>
        </div>

        <div className={`p-4 rounded-xl border transition-all ${
          activeRole === 'admin' || activeRole === 'editor'
            ? 'bg-[#181d2c] border-rose-500/50 text-white'
            : 'bg-[#121520] border-[#222838] text-slate-400'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span className="flex items-center gap-1.5 text-rose-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin / Editorial</span>
            </span>
            {activeRole === 'admin' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
          <p className="text-[11px] text-slate-300">Data assertion governance, graph, and RBAC.</p>
          <button
            onClick={() => setActiveRole('admin')}
            className="mt-3 text-[11px] text-rose-400 hover:underline font-bold cursor-pointer"
          >
            Select Admin Role
          </button>
        </div>

      </div>

      {/* Account Settings Form */}
      <div className="bg-[#121520] p-6 lg:p-8 rounded-2xl border border-[#23293a] space-y-6">
        <div className="flex items-center justify-between border-b border-[#222838] pb-4">
          <div className="flex items-center space-x-2 text-red-400">
            <Settings className="w-5 h-5" />
            <h2 className="text-base font-bold text-white">Profile Details & Preferences</h2>
          </div>
          {isSaved && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Changes Saved!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Full Name</label>
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full bg-[#171b28] text-xs text-white px-3.5 py-2.5 rounded-xl border border-[#283248] focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Contact Email</label>
              <input
                type="email"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                className="w-full bg-[#171b28] text-xs text-white px-3.5 py-2.5 rounded-xl border border-[#283248] focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Organization / Company</label>
              <input
                type="text"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full bg-[#171b28] text-xs text-white px-3.5 py-2.5 rounded-xl border border-[#283248] focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Preferred Currency</label>
              <select
                value={preferredCurrency}
                onChange={e => setPreferredCurrency(e.target.value as any)}
                className="w-full bg-[#171b28] text-xs text-white px-3.5 py-2.5 rounded-xl border border-[#283248] focus:outline-none focus:border-red-500"
              >
                <option value="EUR">Euro (€)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Save Profile Settings
            </button>
          </div>
        </form>
      </div>

      {/* Watchlist Quick Summary */}
      <div className="bg-[#121520] p-6 rounded-2xl border border-[#23293a] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-red-400">
            <Bookmark className="w-5 h-5" />
            <h2 className="text-base font-bold text-white">Monitored Vehicles in Watchlist ({watchlistVehicles.length})</h2>
          </div>
          <button
            onClick={() => onNavigate('watchlist')}
            className="text-xs text-red-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {watchlistVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {watchlistVehicles.map(car => (
              <div
                key={car.id}
                onClick={() => { onSelectVehicle(car.slug); onNavigate('detail', car.slug); }}
                className="p-3 rounded-xl bg-[#171a26] hover:bg-[#1f2434] border border-[#242b3d] flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img src={car.hero_image_url} alt={car.variant_name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{car.manufacturer_name} {car.model_name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{car.variant_name}</div>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-red-400 shrink-0">
                  €{(car.current_median_price_eur / 1000).toFixed(0)}k
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">No vehicles currently saved in watchlist.</p>
        )}
      </div>

    </div>
  );
};
