import React, { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { firebaseAuth, hasFirebaseConfig } from '../services/firebase';

interface ForgotPasswordPageProps {
  onNavigate: (page: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    if (!hasFirebaseConfig) {
      setStatusMessage({ type: 'error', text: 'Firebase Auth is not configured.' });
      setIsSubmitting(false);
      return;
    }

    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      setStatusMessage({
        type: 'success',
        text: 'If an account exists for this email address, a password reset link has been sent.'
      });
      setEmail('');
    } catch (err: any) {
      // Enumeration protection: don't reveal if account exists.
      console.error('Password reset error:', err);
      // To prevent user enumeration, we display success even if the email wasn't found, 
      // but Firebase might throw 'auth/user-not-found'. We catch all and display the same message.
      setStatusMessage({
        type: 'success',
        text: 'If an account exists for this email address, a password reset link has been sent.'
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-trg-gray-200 max-w-md w-full space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-trg-gray-100 text-trg-gray-500 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-trg-carbon">Reset your password</h1>
          <p className="text-trg-gray-500 text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {statusMessage && (
          <div className={`p-4 rounded-xl text-sm font-bold ${
            statusMessage.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-bold text-trg-carbon">Email Address</label>
            <input
              required
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-trg-gray-100 text-xs text-trg-carbon placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-trg-gray-200 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !email}
              className="w-full py-3 px-4 bg-trg-carbon disabled:opacity-50 hover:bg-trg-graphite text-white rounded-xl font-bold transition-colors flex items-center justify-center space-x-2 shadow-md"
            >
              <span>{isSubmitting ? 'Sending...' : 'Send reset link'}</span>
              {!isSubmitting && <Send className="w-4 h-4" />}
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-trg-gray-100">
          <button
            onClick={() => onNavigate('auth', { mode: 'signin' })}
            className="w-full py-2 px-4 text-trg-gray-500 hover:text-trg-carbon font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to sign in</span>
          </button>
        </div>
      </div>
    </div>
  );
};
