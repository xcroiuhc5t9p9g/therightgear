import React from 'react';
import { ShieldCheck, Lock, Sparkles, Heart, Scale, TrendingUp, X } from 'lucide-react';

export type AuthPromptReason = 'watchlist' | 'compare' | 'valuation' | 'general';

interface AuthPromptModalProps {
  isOpen: boolean;
  reason: AuthPromptReason;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  reason,
  onClose,
  onNavigate
}) => {
  if (!isOpen) return null;

  const contentMap = {
    watchlist: {
      icon: Heart,
      badge: 'Garage & Favorites',
      title: 'Save Vehicles to Your Favorites',
      description: 'Register for free as a Collector or Operator to add models to your personal Watchlist, track price trends, and manage your virtual garage.',
      ctaText: 'Create Free Account'
    },
    compare: {
      icon: Scale,
      badge: 'Comparison Tool',
      title: 'Compare Technical Datasheets Side-by-Side',
      description: 'Access to the advanced comparison tool requires free registration. Sign up to compare up to 4 vehicles by engine, power-to-weight ratio, and collector scores.',
      ctaText: 'Register to Compare'
    },
    valuation: {
      icon: TrendingUp,
      badge: 'Protected Market Data',
      title: 'Unlock Valuations and Auction History',
      description: 'Median valuation estimates, Investment Scores, and certified auction result records are reserved for registered users. Create an account in seconds.',
      ctaText: 'Unlock Market Valuations'
    },
    general: {
      icon: Lock,
      badge: 'Restricted Area',
      title: 'Sign In to Unlock All Features',
      description: 'Join the platform to access the Knowledge Graph, real-time market analytics, collector garage, and advanced tools.',
      ctaText: 'Register Now'
    }
  };

  const current = contentMap[reason] || contentMap.general;
  const IconComponent = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#121522] border border-[#232a3f] rounded-3xl p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Badge */}
        <div className="space-y-3 text-center pt-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center shadow-inner">
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-red-400 text-[11px] font-mono font-bold">
            <Sparkles className="w-3 h-3 text-red-400" />
            <span>{current.badge}</span>
          </div>

          <h3 className="text-xl font-extrabold text-white tracking-tight">
            {current.title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed px-2">
            {current.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              onClose();
              onNavigate('register');
            }}
            className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-xl shadow-red-600/20 transition-all cursor-pointer"
          >
            {current.ctaText}
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#161a26] hover:bg-[#1e2333] text-slate-400 hover:text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            Continue as Guest / Unregistered User
          </button>
        </div>

        <div className="text-center pt-1 border-t border-[#1a2030]">
          <span className="text-[10px] text-slate-500 font-mono">
            Free registration in 30 seconds • No credit card required
          </span>
        </div>
      </div>
    </div>
  );
};
