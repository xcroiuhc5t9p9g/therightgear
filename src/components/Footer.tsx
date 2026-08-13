import React from 'react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-trg-carbon text-trg-gray-300 py-16 border-t border-trg-gray-700">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <button onClick={() => onNavigate('home')} className="mb-6 block cursor-pointer">
              <BrandLogo variant="dark-bg" className="h-8 md:h-10 max-w-[220px] md:max-w-[280px]" />
            </button>
            <p className="text-trg-gray-400 max-w-sm text-sm font-medium leading-relaxed">
              Automotive intelligence for the cars that matter.
            </p>
          </div>

          {/* Catalogue Column */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">Catalogue</h3>
            <ul className="space-y-4">
              <li>
                <button onClick={() => onNavigate('explore')} className="text-sm hover:text-white transition-colors cursor-pointer">
                  Explore
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('market')} className="text-sm hover:text-white transition-colors cursor-pointer">
                  Market Intelligence
                </button>
              </li>
            </ul>
          </div>

          {/* About Column */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">About</h3>
            <ul className="space-y-4">
              <li>
                <button onClick={() => onNavigate('about')} className="text-sm hover:text-white transition-colors cursor-pointer">
                  About The Right Gear
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('methodology')} className="text-sm hover:text-white transition-colors cursor-pointer">
                  Methodology
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-sm hover:text-white transition-colors cursor-pointer">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="text-sm hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="text-sm hover:text-white transition-colors cursor-pointer">
                  Terms of Use
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-trg-gray-700/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-trg-gray-500">
            © 2026 The Right Gear
          </p>
        </div>
      </div>
    </footer>
  );
};
