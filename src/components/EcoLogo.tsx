import { useState } from 'react';

interface EcoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function EcoLogo({ size = 'lg', className = '' }: EcoLogoProps) {
  const [failed, setFailed] = useState(false);

  const dims =
    size === 'sm'
      ? 'w-10 h-10 rounded-[12px]'
      : size === 'md'
        ? 'w-14 h-14 rounded-[16px]'
        : 'w-28 h-28 rounded-[24px]';

  if (failed) {
    return (
      <div
        className={`${dims} ${className} bg-gradient-to-br from-[#2ECC71] to-[#1E9E52] flex items-center justify-center shadow-lg shadow-[#2ECC71]/25 select-none`}
        aria-label="EcoBox"
      >
        <svg viewBox="0 0 64 64" className="w-3/4 h-3/4" fill="none">
          <rect x="14" y="20" width="36" height="34" rx="6" fill="#27AE60" stroke="#ECFDF5" strokeWidth="2" />
          <path d="M12 20h40l-4-6H16l-4 6z" fill="#F1C40F" />
          <rect x="26" y="10" width="12" height="4" rx="2" fill="#F1C40F" />
          <path d="M46 10c4 0 8 4 8 8-4 0-8-4-8-8z" fill="#A3E635" />
          <text x="32" y="43" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="800" fontFamily="sans-serif">
            E
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`${dims} ${className} overflow-hidden shadow-lg shadow-[#2ECC71]/20 ring-2 ring-white/80 dark:ring-white/10 shrink-0 bg-[#2ECC71]/10`}
    >
      <img
        src="/assets/aistudio/IMG_20261112_235244_337_14acc7cd.jpg"
        alt="Логотип EcoBox"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
