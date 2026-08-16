import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Capability } from '../types/security';

interface RequireAuthProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  requiredCapability?: Capability;
}


export const RequireAuth: React.FC<RequireAuthProps> = ({ children, onNavigate, requiredCapability }) => {
  const { isAuthenticated, isLoading, hasEffectiveCapability, emailVerified } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      onNavigate('register');
    } else if (!isLoading && isAuthenticated && !emailVerified) {
      onNavigate('verify-email');
    }
  }, [isLoading, isAuthenticated, emailVerified, onNavigate]);

  if (isLoading) {

    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  if (!emailVerified) {
    return null; // Will redirect in useEffect
  }

  if (requiredCapability && !hasEffectiveCapability(requiredCapability)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-slate-600">You do not have the required permissions to view this page.</p>
        <button onClick={() => onNavigate('home')} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold">
          Return to Explore
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
