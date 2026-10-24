import React from 'react';

interface CompanyLogoProps {
  customLogoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  customLogoUrl,
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  if (customLogoUrl) {
    const sizeClasses = {
      sm: 'h-8 max-w-[140px]',
      md: 'h-12 max-w-[200px]',
      lg: 'h-16 max-w-[260px]',
      xl: 'h-20 max-w-[320px]',
    };
    return (
      <img
        src={customLogoUrl}
        alt="Company Logo"
        referrerPolicy="no-referrer"
        className={`object-contain ${sizeClasses[size]} ${className}`}
      />
    );
  }

  // Vector recreated logo matching Yokohama Trading & Logistics branding
  const scaleMap = {
    sm: { scale: 'scale-75 origin-left', text: 'text-sm' },
    md: { scale: 'scale-90 origin-left', text: 'text-base' },
    lg: { scale: 'scale-100 origin-left', text: 'text-lg' },
    xl: { scale: 'scale-110 origin-left', text: 'text-xl' },
  };

  return (
    <div className={`flex items-center gap-2.5 ${scaleMap[size].scale} ${className}`}>
      {/* Dynamic Chevron Wings Logo Emblem */}
      <div className="relative shrink-0 flex items-center justify-center w-11 h-11 bg-slate-900 rounded-lg p-1.5 shadow-sm border border-slate-800">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dynamic Red Chevron Wings */}
          <path
            d="M10 20 L40 50 L10 80 L25 80 L55 50 L25 20 Z"
            fill="#DC2626"
          />
          <path
            d="M30 20 L60 50 L30 80 L45 80 L75 50 L45 20 Z"
            fill="#EF4444"
          />
          <path
            d="M50 20 L80 50 L50 80 L65 80 L95 50 L65 20 Z"
            fill="#F87171"
          />
          {/* Clean Anchor / Ship keel accent */}
          <circle cx="50" cy="50" r="7" fill="#FFFFFF" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <span className="font-extrabold tracking-tight text-slate-900 font-sans text-[18px]">
          YOKOHAMA
        </span>
        {showSubtitle && (
          <span className="text-[10px] font-bold tracking-wider text-sky-700 font-sans mt-0.5">
            TRADING & LOGISTICS
          </span>
        )}
      </div>
    </div>
  );
};
