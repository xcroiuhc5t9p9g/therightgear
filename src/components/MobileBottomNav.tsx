import React from 'react';
import { Compass, Heart, User, Network, ShieldCheck } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  watchlistCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onNavigate,
  watchlistCount,
}) => {
  const navItems = [
    { id: 'market', label: 'Market', icon: Compass },
    { id: 'graph', label: 'Knowledge', icon: Network },
    { id: 'watchlist', label: 'Preferiti', icon: Heart, badge: watchlistCount },
    { id: 'super_admin', label: 'Gestione', icon: ShieldCheck },
    { id: 'profile', label: 'Profilo', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0c0e12]/95 backdrop-blur-md border-t border-[#1f2430] z-40 px-2 py-1.5">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (item.id === 'market' && currentPage === 'explore');
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-red-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 bg-rose-500 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-mono-numbers">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

