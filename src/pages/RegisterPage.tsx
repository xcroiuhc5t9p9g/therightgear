import React, { useState } from 'react';
import { 
  User, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Lock,
  Mail,
  FileText,
  LogIn,
  UserPlus,
  AlertCircle,
  KeyRound,
  Check,
  X
} from 'lucide-react';
import { UserRole } from '../types';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { firebaseAuth, hasFirebaseConfig } from '../services/firebase';
import { Locale, translations } from '../data/translations';
// Removed fake user store

interface RegisterPageProps {
  locale: Locale;
  activeRole: UserRole;
  setActiveRole: (r: UserRole) => void;
  onNavigate: (page: string, slug?: string) => void;
}

// Password strength calculation helper
export const checkPasswordStrength = (pwd: string) => {
  const hasMinLen = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

  let score = 0;
  if (hasMinLen) score++;
  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  let label = 'Very Weak';
  let color = 'bg-red-500';
  let textColor = 'text-red-600';

  if (score >= 5) {
    label = 'Excellent (High Security)';
    color = 'bg-emerald-600';
    textColor = 'text-emerald-700';
  } else if (score >= 4) {
    label = 'Strong';
    color = 'bg-emerald-500';
    textColor = 'text-emerald-600';
  } else if (score >= 3) {
    label = 'Moderate';
    color = 'bg-amber-500';
    textColor = 'text-amber-600';
  } else if (score >= 2) {
    label = 'Weak';
    color = 'bg-amber-400';
    textColor = 'text-amber-700';
  }

  return { hasMinLen, hasUpper, hasLower, hasNumber, hasSpecial, score, label, color, textColor };
};

export const RegisterPage: React.FC<RegisterPageProps> = ({
  locale,
  activeRole,
  setActiveRole,
  onNavigate
}) => {
  const t = translations[locale];

  // Mode: 'register' vs 'login'
  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  // Account type tab: 'privato' or 'professionale'
  const [accountType, setAccountType] = useState<'privato' | 'professionale'>('privato');


  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Form Validation Errors
  const [regError, setRegError] = useState('');

  // Email dispatch status state
  const [emailStatus, setEmailStatus] = useState<{
    status: 'idle' | 'sending' | 'sent' | 'simulated' | 'error';
    message?: string;
  }>({ status: 'idle' });

  const triggerEmailConfirmation = (user: any) => {
    setEmailStatus({ status: 'sending' });
    fetch('/api/v1/email/send-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        companyOrTitle: user.companyOrTitle
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEmailStatus({
            status: data.status === 'sent' ? 'sent' : 'simulated',
            message: data.message
          });
        } else {
          setEmailStatus({
            status: 'error',
            message: data.error || 'Email dispatch error'
          });
        }
      })
      .catch(err => {
        setEmailStatus({
          status: 'error',
          message: err.message
        });
      });
  };

  // Private User Form State
  const [privateForm, setPrivateForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    preferredBrands: ['Ferrari', 'Porsche'],
    collectorGoal: 'Enthusiast & Market Valuation Tracking',
    newsletter: true
  });

  // Professional User Form State
  const [proForm, setProForm] = useState({
    companyName: '',
    vatNumber: '',
    businessType: 'Independent Specialist Dealer',
    inventorySize: '10 - 50 cars',
    contactPerson: '',
    workEmail: '',
    password: '',
    confirmPassword: '',
    phone: '',
    specializations: ['Supercars', 'Youngtimers']
  });

  const handleSocialAuth = async (provider: 'Google' | 'Apple') => {
    if (provider !== 'Google') {
      alert("Apple sign in is not configured yet.");
      return;
    }
    if (hasFirebaseConfig) {
      try {
        const googleProvider = new GoogleAuthProvider();
        await signInWithPopup(firebaseAuth, googleProvider);
        onNavigate('explore');
      } catch (err: any) {
        console.error('Social auth error:', err);
        setRegError(err.message || 'Error signing in with Google.');
      }
    } else {
      setRegError('Firebase Auth is not configured.');
    }
  };

  const handlePrivateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!privateForm.fullName || !privateForm.email) {
      setRegError('Please enter your full name and email address.');
      return;
    }

    const strength = checkPasswordStrength(privateForm.password);
    if (!strength.hasMinLen || !strength.hasUpper || !strength.hasLower || !strength.hasNumber) {
      setRegError('Password does not meet all security requirements.');
      return;
    }

    if (privateForm.password !== privateForm.confirmPassword) {
      setRegError('The two passwords entered do not match.');
      return;
    }

    if (hasFirebaseConfig) {
      try {
        await createUserWithEmailAndPassword(firebaseAuth, privateForm.email, privateForm.password);
        onNavigate('explore');
      } catch (err: any) {
        console.error('Registration error:', err);
        setRegError(err.message || 'Error creating account.');
      }
    } else {
      setRegError('Firebase Auth is not configured.');
    }
  };

  const handleProSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!proForm.companyName || !proForm.workEmail || !proForm.vatNumber) {
      setRegError('Please complete all required company details.');
      return;
    }

    const strength = checkPasswordStrength(proForm.password);
    if (!strength.hasMinLen || !strength.hasUpper || !strength.hasLower || !strength.hasNumber) {
      setRegError('Company password does not meet minimum security requirements.');
      return;
    }

    if (proForm.password !== proForm.confirmPassword) {
      setRegError('The two passwords entered do not match.');
      return;
    }

    if (hasFirebaseConfig) {
      try {
        await createUserWithEmailAndPassword(firebaseAuth, proForm.workEmail, proForm.password);
        onNavigate('explore');
      } catch (err: any) {
        console.error('Registration error:', err);
        setRegError(err.message || 'Error creating account.');
      }
    } else {
      setRegError('Firebase Auth is not configured.');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Please enter both email and password.');
      return;
    }

    if (hasFirebaseConfig) {
      try {
        await signInWithEmailAndPassword(firebaseAuth, loginEmail, loginPassword);
        // AuthContext will handle state
        onNavigate('explore');
      } catch (err: any) {
        console.error('Login error:', err);
        setLoginError('Invalid email or password.');
      }
    } else {
      // Fallback
      setLoginError('Firebase Auth is not configured.');
    }
  };

  const quickLoginAs = async (email: string) => {
    if (hasFirebaseConfig) {
      let pwd = 'PasswordSecure123!';
      if (email === 'riccardo.monaco@gmail.com') {
        pwd = 'Riccardo#2026Admin!';
      } else if (email === 'elena.rinaldi@automotive-intel.com') {
        pwd = 'EditorPassword123!';
      }
      try {
        await signInWithEmailAndPassword(firebaseAuth, email, pwd);
        onNavigate('explore');
      } catch (err) {
        setLoginError('Could not quick login via Firebase. Account may not exist.');
      }
    } else {
      setLoginError('Firebase Auth is not configured.');
    }
  };

  const brandOptions = ['Ferrari', 'Porsche', 'Lamborghini', 'McLaren', 'Bugatti', 'Lancia', 'Alfa Romeo', 'BMW M'];

  const privateStrength = checkPasswordStrength(privateForm.password);
  const proStrength = checkPasswordStrength(proForm.password);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Automotive Intelligence User Management & Secure Authentication</span>
        </div>
        
        <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          {authMode === 'register' ? 'Create Your Pro Account' : 'Sign In to Platform'}
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Reserved access to real-time market values, rarity index, and global auction history.
        </p>

        {/* Auth Mode Toggle Buttons */}
        <div className="pt-2 flex justify-center">
          <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => { setAuthMode('register'); setRegError(''); }}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                authMode === 'register'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New User Registration</span>
            </button>
            <button
              onClick={() => { setAuthMode('login'); setLoginError(''); }}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                authMode === 'login'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Already Registered? Sign In</span>
            </button>
          </div>
        </div>
      </div>

      { (
        /* Registration Form with Password Security Controls & Social Register */
        <div className="space-y-6">
          
          {/* Selector Tabs: Privato vs Professionale */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setAccountType('privato')}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-start space-x-4 shadow-sm ${
                accountType === 'privato'
                  ? 'bg-red-50/50 border-red-500 ring-2 ring-red-500/20 text-slate-900'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                accountType === 'privato' ? 'bg-red-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'
              }`}>
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Private User</div>
                <div className="text-xs text-red-600 font-semibold mt-0.5">Enthusiast & Collector</div>
                <div className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  Track market valuations, create custom watchlists, and receive alerts on market trends.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAccountType('professionale')}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-start space-x-4 shadow-sm ${
                accountType === 'professionale'
                  ? 'bg-purple-50/50 border-purple-500 ring-2 ring-purple-500/20 text-slate-900'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                accountType === 'professionale' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'
              }`}>
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Professional User</div>
                <div className="text-xs text-purple-600 font-semibold mt-0.5">Dealer, Auction House, Advisor</div>
                <div className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                  Publish inventory on marketplace, access liquidity analytics, and certify auction lots.
                </div>
              </div>
            </button>
          </div>

          {/* Registration Form Container */}
          <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">

            {/* Social Registration */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center">
                Quick Registration via Google or Apple
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialAuth('Google')}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center space-x-2.5 shadow-sm transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Register with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialAuth('Apple')}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-900 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center space-x-2.5 shadow-sm transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.82.13-9.68-1.92-14.59-6.14-3.13-2.62-7.02-7.23-11.66-13.82-7.05-10.02-12.63-21.2-16.74-33.56-4.11-12.37-6.17-23.77-6.17-34.2 0-14.56 3.73-26.65 11.2-36.27 7.46-9.62 16.73-14.5 27.81-14.63 4.82 0 10.12 1.25 15.89 3.76 5.77 2.5 9.77 3.76 12 3.76 1.83 0 5.92-1.32 12.27-3.97 6.35-2.65 11.83-3.83 16.44-3.55 12.27.97 22.37 5.77 30.29 14.38-11.01 6.64-16.39 15.86-16.14 27.68.25 9.3 3.86 17.15 10.82 23.54 6.96 6.39 15.22 10.03 24.78 10.92-2.54 7.54-6.03 15.02-10.47 22.44zM119.22 31.02c0-7.3 2.65-14.38 7.95-21.23 5.3-6.85 11.96-10.87 19.98-12.06.25 1.01.38 2 .38 2.97 0 7.16-2.73 14.28-8.19 21.36-5.46 7.08-12.16 11.08-20.12 12.02-.13-.99-.2-2-.2-3.06z"/>
                  </svg>
                  <span>Register with Apple</span>
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider relative">or with email and password</span>
            </div>

            {regError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{regError}</span>
              </div>
            )}
            
            {accountType === 'privato' ? (
              /* Privato Form */
              <form onSubmit={handlePrivateSubmit} className="space-y-5">
                <div className="flex items-center space-x-2 text-red-600 font-bold border-b border-slate-200 pb-3">
                  <User className="w-5 h-5" />
                  <h2>Private User Registration Form</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Riccardo Monaco"
                      value={privateForm.fullName}
                      onChange={e => setPrivateForm({...privateForm, fullName: e.target.value})}
                      className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Email Address *</label>
                    <input
                      required
                      type="email"
                      placeholder="riccardo.monaco@gmail.com"
                      value={privateForm.email}
                      onChange={e => setPrivateForm({...privateForm, email: e.target.value})}
                      className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Secure Password Requirements & Live Indicator */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <KeyRound className="w-4 h-4 text-red-600" />
                      <span>Secure Password Setup *</span>
                    </label>
                    {privateForm.password && (
                      <span className={`text-[11px] font-bold ${privateStrength.textColor}`}>
                        {privateStrength.label}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <input
                        required
                        type="password"
                        placeholder="Password (e.g. Auto#2026Secure)"
                        value={privateForm.password}
                        onChange={e => setPrivateForm({...privateForm, password: e.target.value})}
                        className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <input
                        required
                        type="password"
                        placeholder="Confirm Password"
                        value={privateForm.confirmPassword}
                        onChange={e => setPrivateForm({...privateForm, confirmPassword: e.target.value})}
                        className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  {/* Password Strength Progress Bar */}
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${privateStrength.color}`}
                      style={{ width: `${(privateStrength.score / 5) * 100}%` }}
                    />
                  </div>

                  {/* Password Requirements */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                    <div className={`flex items-center space-x-1 font-medium ${privateStrength.hasMinLen ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {privateStrength.hasMinLen ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                      <span>Minimum 8 characters</span>
                    </div>
                    <div className={`flex items-center space-x-1 font-medium ${privateStrength.hasUpper ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {privateStrength.hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                      <span>Uppercase Letter (A-Z)</span>
                    </div>
                    <div className={`flex items-center space-x-1 font-medium ${privateStrength.hasLower ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {privateStrength.hasLower ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                      <span>Lowercase Letter (a-z)</span>
                    </div>
                    <div className={`flex items-center space-x-1 font-medium ${privateStrength.hasNumber ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {privateStrength.hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-slate-400" />}
                      <span>At least 1 Number (0-9)</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">Primary Objective</label>
                  <select
                    value={privateForm.collectorGoal}
                    onChange={e => setPrivateForm({...privateForm, collectorGoal: e.target.value})}
                    className="w-full bg-white text-xs text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-red-500"
                  >
                    <option value="Enthusiast & Market Valuation Tracking">Enthusiast & Market Valuation Tracking</option>
                    <option value="First Supercar / Youngtimer Purchase">First Supercar / Youngtimer Purchase</option>
                    <option value="Collector Portfolio Management">Collector Portfolio Management</option>
                    <option value="Historical Technical Data Research">Historical & Technical Data Research</option>
                  </select>
                </div>

                {/* Preferred Brands checkboxes */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Brands of Interest</label>
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
                              ? 'bg-red-50 text-red-700 border-red-300'
                              : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
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
                    className="rounded border-slate-300 bg-white text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="newsletter-check" className="text-xs text-slate-700 cursor-pointer">
                    Receive monthly newsletter with Top Gainers & Losers analysis and global auction highlights.
                  </label>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              /* Professionale Form */
              <form onSubmit={handleProSubmit} className="space-y-5">
                <div className="flex items-center space-x-2 text-purple-700 font-bold border-b border-slate-200 pb-3">
                  <Building2 className="w-5 h-5" />
                  <h2>Professional User Registration Form (Dealer / Auctions)</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Company / Business Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Scuderia Classica Ltd."
                      value={proForm.companyName}
                      onChange={e => setProForm({...proForm, companyName: e.target.value})}
                      className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">VAT Number / Tax ID *</label>
                    <input
                      required
                      type="text"
                      placeholder="GB123456789"
                      value={proForm.vatNumber}
                      onChange={e => setProForm({...proForm, vatNumber: e.target.value})}
                      className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Password Sec for Pro */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                      <KeyRound className="w-4 h-4 text-purple-600" />
                      <span>Company Account Password *</span>
                    </label>
                    {proForm.password && (
                      <span className={`text-[11px] font-bold ${proStrength.textColor}`}>
                        {proStrength.label}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      required
                      type="password"
                      placeholder="Company Password"
                      value={proForm.password}
                      onChange={e => setProForm({...proForm, password: e.target.value})}
                      className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
                    />

                    <input
                      required
                      type="password"
                      placeholder="Confirm Company Password"
                      value={proForm.confirmPassword}
                      onChange={e => setProForm({...proForm, confirmPassword: e.target.value})}
                      className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Business Type</label>
                    <select
                      value={proForm.businessType}
                      onChange={e => setProForm({...proForm, businessType: e.target.value})}
                      className="w-full bg-white text-xs text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
                    >
                      <option value="Official Brand Dealership">Official Brand Dealership</option>
                      <option value="Independent Specialist Dealer">Independent Specialist Dealer</option>
                      <option value="Automotive Auction House">Automotive Auction House</option>
                      <option value="Automotive Advisor & Appraiser">Automotive Advisor & Appraiser</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Fleet / Inventory Size</label>
                    <select
                      value={proForm.inventorySize}
                      onChange={e => setProForm({...proForm, inventorySize: e.target.value})}
                      className="w-full bg-white text-xs text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
                    >
                      <option value="1 - 10 cars">1 - 10 cars</option>
                      <option value="10 - 50 cars">10 - 50 cars</option>
                      <option value="50+ cars">50+ cars</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Primary Contact Person *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. John Doe"
                      value={proForm.contactPerson}
                      onChange={e => setProForm({...proForm, contactPerson: e.target.value})}
                      className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">Company Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="info@scuderiaclassica.com"
                      value={proForm.workEmail}
                      onChange={e => setProForm({...proForm, workEmail: e.target.value})}
                      className="w-full bg-white text-xs text-slate-900 placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md shadow-purple-600/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
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
