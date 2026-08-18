import { Container } from "./ui-blocks";
import React from 'react';

interface FooterProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-trg-warm-white text-trg-gray-500 py-6 border-t border-trg-gray-200 text-sm">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
          <span>&copy; {currentYear} The Right Gear</span>
          <span className="hidden md:inline text-trg-gray-300">|</span>
          <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className="hover:text-trg-red transition-colors focus:outline-none focus:ring-2 focus:ring-trg-red rounded">
            About
          </a>
          <span className="hidden md:inline text-trg-gray-300">|</span>
          <a href="/privacy" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }} className="hover:text-trg-red transition-colors focus:outline-none focus:ring-2 focus:ring-trg-red rounded">
            Privacy Policy
          </a>
          <span className="hidden md:inline text-trg-gray-300">|</span>
          <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="hover:text-trg-red transition-colors focus:outline-none focus:ring-2 focus:ring-trg-red rounded">
            Terms of Use
          </a>
          <span className="hidden md:inline text-trg-gray-300">|</span>
          <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="hover:text-trg-red transition-colors focus:outline-none focus:ring-2 focus:ring-trg-red rounded">
            Contact
          </a>
        </div>
      </Container>
    </footer>
  );
};
