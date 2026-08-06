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
  const textColor = theme === 'dark' ? '#FFFFFF' : '#0A0E1A';

  // Dimension presets
  const heightMap = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Theme Logo SVG */}
      <svg
        viewBox="0 0 380 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${heightMap[size]} w-auto max-w-full transition-all duration-300`}
        aria-label="The Right Gear Logo"
      >
        <defs>
          {/* Red Gearbox Badge Gradient */}
          <linearGradient id="gearRedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EE1C25" />
            <stop offset="40%" stopColor="#C90C14" />
            <stop offset="100%" stopColor="#7F0208" />
          </linearGradient>

          {/* Badge Shadow / Glow */}
          <filter id="badgeShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#C90C14" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 1. BADGE BACKGROUND (Red Rounded Square) */}
        <rect
          x="2"
          y="2"
          width="56"
          height="56"
          rx="14"
          fill="url(#gearRedGradient)"
          filter="url(#badgeShadow)"
        />

        {/* 2. MANUAL TRANSMISSION H-SHIFTER ICON (White Gate) */}
        <g fill="#FFFFFF">
          {/* Left Channel (1st - 2nd) */}
          <rect x="15" y="14" width="5" height="32" rx="2.5" />
          {/* Middle Channel (3rd - 4th) */}
          <rect x="27.5" y="14" width="5" height="32" rx="2.5" />
          {/* Right Channel (5th - 6th / Reverse) */}
          <rect x="40" y="14" width="5" height="32" rx="2.5" />
          {/* Horizontal Crossbar Gate */}
          <rect x="15" y="27.5" width="30" height="5.5" rx="1.5" />
        </g>

        {/* 3. BRANDING TEXT "The Right Gear" */}
        <g fontStyle="italic" fontWeight="900" fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Arial Black', sans-serif">
          <text
            x="74"
            y="41"
            fill={textColor}
            fontSize="34"
            letterSpacing="-1"
            transform="skewX(-10)"
          >
            The Right Gear
          </text>
        </g>

        {/* 4. OPTIONAL SUBTITLE "AUTOMOTIVE INTELLIGENCE" */}
        {showSubtitle && (
          <text
            x="76"
            y="54"
            fill={theme === 'dark' ? '#EF4444' : '#DC2626'}
            fontSize="8.5"
            fontWeight="800"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="2.8"
            opacity="0.9"
          >
            AUTOMOTIVE INTELLIGENCE
          </text>
        )}
      </svg>
    </div>
  );
};
