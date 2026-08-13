import React from 'react';

interface BrandLogoProps {
  variant?: 'light-bg' | 'dark-bg';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'light-bg', className = '' }) => {
  const src = '/brand/the-right-gear-logo-master.png';

  return (
    <img 
      src={src} 
      alt="The Right Gear" 
      className={`w-auto h-auto object-contain ${className}`}
      referrerPolicy="no-referrer"
      width={1184}
      height={159}
    />
  );
};
