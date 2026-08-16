import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendEmailVerification } from 'firebase/auth';

interface VerifyEmailPageProps {
  onNavigate: (page: string) => void;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ onNavigate }) => {
  const { currentUser, signOut, emailVerified, isLoading, reloadAuth } = useAuth();
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      onNavigate('auth');
    } else if (!isLoading && currentUser && emailVerified) {
      const pendingOnboarding = typeof window !== 'undefined' ? localStorage.getItem('trg_pending_onboarding') : null;
      if (pendingOnboarding === 'true') {
        onNavigate('onboarding');
      } else {
        onNavigate('home');
      }
    }
  }, [isLoading, currentUser, emailVerified, onNavigate]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const handleResend = async () => {
    if (!currentUser) return;
    setIsResending(true);
    setResendStatus(null);
    try {
      await sendEmailVerification(currentUser);
      setResendStatus('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/too-many-requests') {
        setResendStatus('Too many requests. Please try again later.');
      } else {
        setResendStatus(err.message || 'Error sending verification email.');
      }
    }
    setIsResending(false);
  };

  const handleCheckVerification = async () => {
    if (!currentUser) return;
    setIsChecking(true);
    try {
      await reloadAuth();
      // Use a timeout to allow the context to update, then check if we are verified.
      // If we are verified, the useEffect will trigger onNavigate('home').
      // If we are not, we show a message.
      setTimeout(() => {
        if (currentUser && !currentUser.emailVerified) {
           setResendStatus('Email is not verified yet. Please check your inbox.');
        }
        setIsChecking(false);
      }, 500);
    } catch (err) {
      console.error(err);
      setIsChecking(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };
  
  if (!currentUser) {
    return null; // Handled by useEffect
  }

  if (emailVerified) {
    return null; // Handled by useEffect
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-trg-gray-200 max-w-md w-full space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-trg-carbon">Verify your email</h1>
          <p className="text-trg-gray-500 text-sm">
            We sent a verification link to: <br/>
            <span className="font-bold text-trg-carbon">{currentUser.email}</span>
          </p>
        </div>

        {resendStatus && (
          <div className="p-3 bg-trg-gray-100 border border-trg-gray-200 rounded-lg text-sm text-trg-carbon">
            {resendStatus}
          </div>
        )}

        <div className="space-y-3 pt-2">
          <button
            onClick={handleCheckVerification}
            disabled={isChecking}
            className="w-full py-3 px-4 bg-trg-carbon hover:bg-trg-graphite text-white rounded-xl font-bold transition-colors flex items-center justify-center space-x-2"
          >
            {isChecking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            <span>I've verified my email</span>
          </button>
          <button
            onClick={handleResend}
            disabled={isResending}
            className="w-full py-3 px-4 bg-white hover:bg-trg-gray-100 border border-trg-gray-200 text-trg-gray-700 rounded-xl font-bold transition-colors flex items-center justify-center space-x-2"
          >
            {isResending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            <span>Resend verification email</span>
          </button>
          <button
            onClick={handleSignOut}
            className="w-full py-3 px-4 text-trg-gray-400 hover:text-trg-gray-700 font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
