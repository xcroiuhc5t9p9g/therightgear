import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification, 
  signInWithPopup, 
  GoogleAuthProvider,
  getAdditionalUserInfo
} from 'firebase/auth';
import { firebaseAuth, hasFirebaseConfig } from '../services/firebase';

interface AuthPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onNavigate }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');
      if (mode === 'signup') {
        setAuthMode('signup');
      } else {
        setAuthMode('signin');
      }
    }
  }, []);

  const handleGoogleAuth = async () => {
    setError('');
    if (!hasFirebaseConfig) {
      setError('Firebase Auth is not configured.');
      return;
    }
    try {
      const googleProvider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(firebaseAuth, googleProvider);
      const { isNewUser } = getAdditionalUserInfo(userCred) || { isNewUser: false };
      
      if (isNewUser) {
        if (typeof window !== 'undefined') { 
          localStorage.setItem('trg_pending_onboarding', 'true');
        }
        onNavigate('onboarding');
      } else {
        onNavigate('home');
      }
    } catch (err: any) {
      console.error('Social auth error:', err);
      setError(err.message || 'Error signing in with Google.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!hasFirebaseConfig) {
      setError('Firebase Auth is not configured.');
      return;
    }

    try {
      if (authMode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        if (password.length < 8) {
          setError('Password must be at least 8 characters long.');
          return;
        }
        if (!termsAccepted) {
          setError('You must accept the Terms of Use and Privacy Policy.');
          return;
        }
        const userCred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        if (userCred.user) {
          await sendEmailVerification(userCred.user);
          // Flag this user for onboarding upon verification
          if (typeof window !== 'undefined') { 
            localStorage.setItem('trg_pending_onboarding', 'true');
          }
          onNavigate('verify-email');
        }
      } else {
        const userCred = await signInWithEmailAndPassword(firebaseAuth, email, password);
        if (!userCred.user.emailVerified) {
          onNavigate('verify-email');
        } else {
          onNavigate('home');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Error authenticating.');
    }
  };

  return (
    <div className="w-full bg-trg-warm-white min-h-screen py-16 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-sm border border-trg-gray-200 mb-8">
        <h1 className="text-2xl font-bold text-trg-carbon mb-8 text-center">
          Welcome to The Right Gear
        </h1>

        <div className="flex bg-trg-gray-50 rounded-lg p-1 mb-8">
          <button
            onClick={() => { setAuthMode('signin'); setError(''); }}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${authMode === 'signin' ? 'bg-white shadow-sm text-trg-carbon' : 'text-trg-gray-500 hover:text-trg-carbon'}`}
          >
            Sign in
          </button>
          <button
            onClick={() => { setAuthMode('signup'); setError(''); }}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${authMode === 'signup' ? 'bg-white shadow-sm text-trg-carbon' : 'text-trg-gray-500 hover:text-trg-carbon'}`}
          >
            Create account
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg" role="alert">
            {error}
          </div>
        )}

        <button 
          onClick={handleGoogleAuth}
          className="w-full py-3 px-4 bg-white border border-trg-gray-200 hover:bg-trg-gray-50 text-trg-carbon font-bold rounded-xl transition-colors flex items-center justify-center space-x-3 mb-6"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 h-px bg-trg-gray-200"></div>
          <span className="text-xs font-bold text-trg-gray-400 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-trg-gray-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-trg-carbon mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white text-trg-carbon border border-trg-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-trg-carbon focus:ring-1 focus:ring-trg-carbon text-base sm:text-sm"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-bold text-trg-carbon mb-1.5">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white text-trg-carbon border border-trg-gray-300 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-trg-carbon focus:ring-1 focus:ring-trg-carbon text-base sm:text-sm"
              placeholder="••••••••"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[34px] text-trg-gray-400 hover:text-trg-carbon p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {authMode === 'signup' && (
            <div className="relative">
              <label className="block text-sm font-bold text-trg-carbon mb-1.5">Confirm password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white text-trg-carbon border border-trg-gray-300 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-trg-carbon focus:ring-1 focus:ring-trg-carbon text-base sm:text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {authMode === 'signup' && (
            <div className="pt-2 flex items-start gap-3">
              <div className="flex items-center h-5">
                <input 
                  id="terms" 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required 
                  className="w-4 h-4 rounded border-trg-gray-300 text-trg-carbon focus:ring-trg-carbon cursor-pointer" 
                />
              </div>
              <label htmlFor="terms" className="text-xs text-trg-gray-500 leading-relaxed cursor-pointer select-none">
                By creating an account, you agree to our <button type="button" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="underline hover:text-trg-carbon">Terms of Use</button> and <button type="button" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} className="underline hover:text-trg-carbon">Privacy Policy</button>.
              </label>
            </div>
          )}

          {authMode === 'signin' && (
            <div className="flex justify-start">
              <button 
                type="button" 
                onClick={() => onNavigate('forgot-password')}
                className="text-sm text-trg-gray-500 hover:text-trg-carbon font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-3.5 bg-trg-carbon hover:bg-trg-gray-700 text-white font-bold rounded-xl transition-colors"
            >
              {authMode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </div>
        </form>
      </div>

      <div className="flex items-center gap-4 text-xs font-medium text-trg-gray-500">
        <button onClick={() => onNavigate('privacy')} className="hover:text-trg-carbon transition-colors">Privacy Policy</button>
        <span>•</span>
        <button onClick={() => onNavigate('terms')} className="hover:text-trg-carbon transition-colors">Terms of Use</button>
      </div>
    </div>
  );
};
