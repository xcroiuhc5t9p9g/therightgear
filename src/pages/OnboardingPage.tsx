import React, { useState } from 'react';
import { User, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { UserProfile } from '../types/security';

interface OnboardingPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [profileType, setProfileType] = useState<'enthusiast' | 'professional' | null>(null);
  
  // Enthusiast fields
  const [displayName, setDisplayName] = useState('');
  const [country, setCountry] = useState('');
  
  // Professional fields
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [activity, setActivity] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !profileType) return;
    
    setIsSubmitting(true);
    try {
      const profileData: Partial<UserProfile> = {
        uid: currentUser.uid,
        email: currentUser.email || '',
        createdAt: new Date().toISOString(),
        role: 'private_user', // default role
        accountStatus: 'ACTIVE',
        profileType: profileType,
      };

      if (profileType === 'enthusiast') {
        profileData.displayName = displayName;
        profileData.country = country;
      } else {
        profileData.displayName = fullName;
        profileData.companyName = company;
        profileData.professionalActivity = activity;
        profileData.country = country;
        profileData.professionalProfileStatus = 'unverified';
      }

      await setDoc(doc(db, 'users', currentUser.uid), profileData, { merge: true });
      
      // Clear pending onboarding flag
      if (typeof window !== 'undefined') {
        localStorage.removeItem('trg_pending_onboarding');
      }
      
      onNavigate('home');
    } catch (err) {
      console.error('Error saving onboarding data:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-trg-warm-white min-h-[85vh] py-16 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-trg-carbon mb-3">
            {step === 1 ? 'How will you use The Right Gear?' : 'Complete your profile'}
          </h1>
          <p className="text-trg-gray-500">
            {step === 1 
              ? 'Select the profile type that best describes you.' 
              : 'Add a few details to finalize your account.'}
          </p>
        </div>

        {step === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => { setProfileType('enthusiast'); setStep(2); }}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-trg-gray-200 hover:border-trg-carbon shadow-sm transition-all text-left group relative"
            >
              <div className="w-12 h-12 bg-trg-gray-100 rounded-full flex items-center justify-center mb-6 text-trg-carbon group-hover:bg-trg-carbon group-hover:text-white transition-colors">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-trg-carbon mb-3">ENTHUSIAST</h2>
              <p className="text-sm text-trg-gray-500 leading-relaxed mb-6">
                For enthusiasts and collectors researching iconic cars for personal interest.
              </p>
              <div className="flex items-center text-sm font-bold text-trg-carbon opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Select profile</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </button>

            <button
              onClick={() => { setProfileType('professional'); setStep(2); }}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-trg-gray-200 hover:border-trg-carbon shadow-sm transition-all text-left group relative"
            >
              <div className="w-12 h-12 bg-trg-gray-100 rounded-full flex items-center justify-center mb-6 text-trg-carbon group-hover:bg-trg-carbon group-hover:text-white transition-colors">
                <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-trg-carbon mb-3">PROFESSIONAL</h2>
              <p className="text-sm text-trg-gray-500 leading-relaxed mb-6">
                For dealers, brokers, advisors, restorers, specialists, auction houses, media and other automotive professionals.
              </p>
              <div className="flex items-center text-sm font-bold text-trg-carbon opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Select profile</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-trg-gray-200 shadow-sm max-w-xl mx-auto">
            <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-trg-gray-100">
              <div className="w-10 h-10 bg-trg-gray-100 rounded-full flex items-center justify-center text-trg-carbon">
                {profileType === 'enthusiast' ? <User className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs font-bold text-trg-gray-400 uppercase tracking-wider">Selected Profile</p>
                <p className="font-bold text-trg-carbon capitalize">{profileType}</p>
              </div>
              <div className="flex-1 text-right">
                <button onClick={() => setStep(1)} className="text-sm font-bold text-trg-gray-500 hover:text-trg-carbon underline">Change</button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {profileType === 'enthusiast' ? (
                <>
                  <div>
                    <label className="block text-sm font-bold text-trg-carbon mb-1.5">Display name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-white text-trg-carbon border border-trg-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-trg-carbon focus:ring-1 focus:ring-trg-carbon"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-trg-carbon mb-1.5">Country <span className="font-normal text-trg-gray-400">(Optional)</span></label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white text-trg-carbon border border-trg-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-trg-carbon focus:ring-1 focus:ring-trg-carbon"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-trg-carbon mb-1.5">Full name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-white text-trg-carbon border border-trg-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-trg-carbon focus:ring-1 focus:ring-trg-carbon"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-trg-carbon mb-1.5">Company / Organization</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-white text-trg-carbon border border-trg-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-trg-carbon focus:ring-1 focus:ring-trg-carbon"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-trg-carbon mb-1.5">Professional activity</label>
                    <select
                      value={activity}
                      onChange={(e) => setActivity(e.target.value)}
                      className="w-full bg-white text-trg-carbon border border-trg-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-trg-carbon focus:ring-1 focus:ring-trg-carbon"
                      required
                    >
                      <option value="" disabled>Select activity</option>
                      <option value="Dealer">Dealer</option>
                      <option value="Collector">Collector</option>
                      <option value="Broker / Advisor">Broker / Advisor</option>
                      <option value="Restorer">Restorer</option>
                      <option value="Workshop / Specialist">Workshop / Specialist</option>
                      <option value="Auction House">Auction House</option>
                      <option value="Media">Media</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-trg-carbon mb-1.5">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white text-trg-carbon border border-trg-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-trg-carbon focus:ring-1 focus:ring-trg-carbon"
                      required
                    />
                  </div>
                </>
              )}

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-trg-carbon hover:bg-trg-gray-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : profileType === 'enthusiast' ? 'Start exploring' : 'Continue to The Right Gear'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
