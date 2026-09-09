import React from 'react';

interface GovFlowLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'splash';
  variant?: 'full' | 'symbol' | 'horizontal';
  theme?: 'dark' | 'light' | 'white';
  animated?: boolean;
  className?: string;
  showTagline?: boolean;
}

export const GovFlowLogo: React.FC<GovFlowLogoProps> = ({
  size = 'md',
  variant = 'horizontal',
  theme = 'dark',
  animated = false,
  className = '',
  showTagline = false,
}) => {
  // Dimension tokens
  const symbolDimensions = {
    xs: { width: 22, height: 22 },
    sm: { width: 28, height: 28 },
    md: { width: 36, height: 36 },
    lg: { width: 48, height: 48 },
    xl: { width: 64, height: 64 },
    splash: { width: 88, height: 88 },
  }[size];

  const titleSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
    splash: 'text-4xl sm:text-5xl',
  }[size];

  const taglineSizes = {
    xs: 'text-[9px]',
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
    xl: 'text-base',
    splash: 'text-xs sm:text-sm',
  }[size];

  // Palette based on theme
  // Blue + Teal as specified in guidelines
  const colors = {
    dark: {
      citizenNode: '#2563EB', // Blue 600
      serviceNodes: '#0D9488', // Teal 600
      stemNode: '#2563EB',
      lines: '#64748B', // Slate 500
      title: 'text-slate-900',
      tagline: 'text-slate-500',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    light: {
      citizenNode: '#3B82F6', // Blue 500
      serviceNodes: '#14B8A6', // Teal 500
      stemNode: '#38BDF8',
      lines: '#94A3B8',
      title: 'text-slate-800',
      tagline: 'text-slate-400',
      badge: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    white: {
      citizenNode: '#60A5FA', // Blue 400
      serviceNodes: '#2DD4BF', // Teal 400
      stemNode: '#38BDF8',
      lines: '#475569',
      title: 'text-white',
      tagline: 'text-slate-300',
      badge: 'bg-white/10 text-cyan-300 border-white/20',
    },
  }[theme];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* MINIMAL LOGO SYMBOL:
            ●       (Citizen)
           / \      (Connection)
          ●───●     (Public Services)
            │       (GovFlow Orchestration)
      */}
      <div 
        style={{ width: symbolDimensions.width, height: symbolDimensions.height }} 
        className="relative flex-shrink-0 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full ${animated ? 'transition-all duration-700' : ''}`}
        >
          {/* Connecting Triangle & Flow Stem */}
          <g className={animated ? 'animate-pulse' : ''}>
            {/* Left diagonal connector: Citizen -> Left Service Node */}
            <line
              x1="50"
              y1="22"
              x2="24"
              y2="66"
              stroke={colors.lines}
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Right diagonal connector: Citizen -> Right Service Node */}
            <line
              x1="50"
              y1="22"
              x2="76"
              y2="66"
              stroke={colors.lines}
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Horizontal bridge between services */}
            <line
              x1="24"
              y1="66"
              x2="76"
              y2="66"
              stroke={colors.lines}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Vertical stem down to GovFlow platform */}
            <line
              x1="50"
              y1="66"
              x2="50"
              y2="86"
              stroke={colors.citizenNode}
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>

          {/* Citizen Node (Top Apex) */}
          <circle
            cx="50"
            cy="22"
            r="10"
            fill={colors.citizenNode}
            className={animated ? 'transition-transform duration-500 hover:scale-110' : ''}
          />
          <circle cx="50" cy="22" r="4.5" fill="#FFFFFF" opacity="0.9" />

          {/* Left Service Node (State / Municipal) */}
          <circle
            cx="24"
            cy="66"
            r="8"
            fill={colors.serviceNodes}
          />
          <circle cx="24" cy="66" r="3.5" fill="#FFFFFF" opacity="0.85" />

          {/* Right Service Node (Central Ministries / DigiLocker) */}
          <circle
            cx="76"
            cy="66"
            r="8"
            fill={colors.serviceNodes}
          />
          <circle cx="76" cy="66" r="3.5" fill="#FFFFFF" opacity="0.85" />

          {/* Bottom Stem Anchor (Orchestration Engine) */}
          <circle
            cx="50"
            cy="86"
            r="5"
            fill={colors.stemNode}
          />
        </svg>
      </div>

      {/* Typography: Project Name & Optional Tagline */}
      {variant !== 'symbol' && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight ${titleSizes} ${colors.title}`}>
              GovFlow
            </span>
            <span className={`font-black tracking-wider text-xs px-1.5 py-0.5 rounded-md border font-mono ${colors.badge}`}>
              AI
            </span>
          </div>

          {showTagline && (
            <p className={`font-medium ${taglineSizes} ${colors.tagline} mt-0.5 tracking-normal`}>
              One Citizen. One Profile. Every Service. One Smart Journey.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
