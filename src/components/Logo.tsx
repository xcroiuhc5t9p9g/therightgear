import React from 'react';

interface LogoProps {
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  theme = 'dark',
  size = 'md',
  showSubtitle = false,
  className = ''
}) => {
  const isDark = theme === 'dark';
  
  const heightClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };

  const logoSrc = isDark ? '/logo_dark.svg' : '/logo_light.svg';

  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      <img
        src={logoSrc}
        alt="The Right Gear - Automotive Intelligence"
        className={`${heightClasses[size]} w-auto object-contain cursor-pointer`}
      />
      {showSubtitle && (
        <span className={`text-[10px] font-semibold tracking-[0.12em] uppercase font-sans mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Automotive Intelligence
        </span>
      )}
    </div>
  );
};


