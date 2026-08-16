import React, { useState } from 'react';
import { User, Settings, Bookmark, CheckCircle2, Building2, ShieldCheck, ChevronRight, AlertCircle, AlertTriangle } from 'lucide-react';
import { Locale } from '../data/translations';
import { catalogueRepository } from '../services/catalogueRepository';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types/security';

interface ProfilePageProps {
  locale: Locale;
  activeRole: string;
  setActiveRole: (role: string) => void;
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
  const { currentUser, actualRole } = useAuth();
  
  // This state would normally be populated from Firestore
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    email: currentUser?.email || '',
    accountStatus: 'ACTIVE', 
  });
  
  const [userName, setUserName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [currentTab, setCurrentTab] = useState<'personal' | 'organization'>('personal');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const getStatusBadge = () => {
    switch (profile.accountStatus) {
      case 'ACTIVE': return <span className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase"><CheckCircle2 className="w-3 h-3 mr-1" /> Active</span>;
      case 'PENDING': return <span className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded uppercase"><AlertCircle className="w-3 h-3 mr-1" /> Pending</span>;
      case 'SUSPENDED': return <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-[10px] font-bold rounded uppercase"><AlertTriangle className="w-3 h-3 mr-1" /> Suspended</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-trg-carbon font-display tracking-tight">Account Settings</h1>
        <p className="text-trg-gray-500 mt-2 text-sm">Manage your personal and corporate details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1">
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setCurrentTab('personal')}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                currentTab === 'personal'
                  ? 'border-trg-carbon bg-trg-carbon text-white shadow-lg'
                  : 'border-trg-gray-200 bg-white text-trg-carbon hover:border-trg-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5" />
                <span className="font-semibold text-sm">Personal Info</span>
              </div>
            </button>
            
            {actualRole === 'corporate_user' && (
              <button
                onClick={() => { setCurrentTab('organization'); onNavigate('profile/organization'); }}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  currentTab === 'organization'
                    ? 'border-trg-carbon bg-trg-carbon text-white shadow-lg'
                    : 'border-trg-gray-200 bg-white text-trg-carbon hover:border-trg-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5" />
                  <span className="font-semibold text-sm">Corporate Profile</span>
                </div>
              </button>
            )}
          </nav>
        </div>

        <div className="lg:col-span-3 space-y-8">
          {currentTab === 'personal' && (
            <div className="bg-white rounded-2xl border border-trg-gray-200 p-6 sm:p-8">
               <div className="flex justify-between items-start mb-6 border-b border-trg-gray-100 pb-4">
                 <div>
                   <h2 className="text-xl font-bold text-trg-carbon font-display">Personal Information</h2>
                   <p className="text-sm text-trg-gray-500">Update your account identity.</p>
                 </div>
                 {getStatusBadge()}
               </div>
               <form onSubmit={handleSaveSettings} className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-trg-carbon uppercase tracking-wider mb-2">Display Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-trg-warm-white border border-trg-gray-200 rounded-lg px-4 py-2.5 text-sm text-trg-carbon focus:outline-none focus:border-trg-red focus:ring-1 focus:ring-trg-red transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-trg-carbon uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profile.email || ''}
                    disabled
                    className="w-full bg-trg-gray-100 border border-trg-gray-200 rounded-lg px-4 py-2.5 text-sm text-trg-gray-500 cursor-not-allowed"
                  />
                </div>
                <div className="pt-4 border-t border-trg-gray-100">
                  <button
                    type="submit"
                    className="bg-trg-carbon text-white px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    Save Changes
                  </button>
                  {isSaved && <span className="ml-4 text-sm text-emerald-600 font-medium">Saved successfully</span>}
                </div>
              </form>
            </div>
          )}

          {currentTab === 'organization' && actualRole === 'corporate_user' && (
            <div className="bg-white rounded-2xl border border-trg-gray-200 p-6 sm:p-8">
               <div className="flex justify-between items-start mb-6 border-b border-trg-gray-100 pb-4">
                 <div>
                   <h2 className="text-xl font-bold text-trg-carbon font-display">Corporate Profile</h2>
                   <p className="text-sm text-trg-gray-500">Manage your verified organization details.</p>
                 </div>
                 {getStatusBadge()}
               </div>
               
               {profile.accountStatus === 'PENDING' && (
                 <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm flex items-start">
                   <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
                   <div>
                     <p className="font-bold">Verification Pending</p>
                     <p className="mt-1">Your corporate profile is currently under review by our editorial team. Some features may be restricted until verification is complete.</p>
                   </div>
                 </div>
               )}
               
               {profile.accountStatus === 'SUSPENDED' && (
                 <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-sm flex items-start">
                   <AlertTriangle className="w-5 h-5 mr-3 shrink-0" />
                   <div>
                     <p className="font-bold">Account Suspended</p>
                     <p className="mt-1">Your corporate account has been suspended. Please contact support.</p>
                   </div>
                 </div>
               )}
               
               <form onSubmit={handleSaveSettings} className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-xs font-bold text-trg-carbon uppercase tracking-wider mb-2">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    disabled={profile.accountStatus === 'SUSPENDED'}
                    className="w-full bg-trg-warm-white border border-trg-gray-200 rounded-lg px-4 py-2.5 text-sm text-trg-carbon focus:outline-none focus:border-trg-red focus:ring-1 focus:ring-trg-red transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-trg-carbon uppercase tracking-wider mb-2">VAT Number / Tax ID</label>
                  <input
                    type="text"
                    disabled={profile.accountStatus !== 'ACTIVE'}
                    className="w-full bg-trg-warm-white border border-trg-gray-200 rounded-lg px-4 py-2.5 text-sm text-trg-carbon focus:outline-none focus:border-trg-red focus:ring-1 focus:ring-trg-red transition-all"
                  />
                </div>
                <div className="pt-4 border-t border-trg-gray-100">
                  <button
                    type="submit"
                    disabled={profile.accountStatus === 'SUSPENDED'}
                    className="bg-trg-carbon text-white px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-black transition-colors disabled:opacity-50"
                  >
                    Save Corporate Details
                  </button>
                  {isSaved && <span className="ml-4 text-sm text-emerald-600 font-medium">Saved successfully</span>}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
