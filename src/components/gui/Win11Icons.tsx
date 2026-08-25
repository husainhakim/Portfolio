import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

interface FolderProps extends IconProps {
  colorTheme?: "yellow" | "blue" | "blueGray" | "teal" | "warm" | "brown";
  badgeIcon?: React.ReactNode;
}

const THEMES = {
  yellow: { back: "#E8A33D", front: "#F7D154", accent: "#E59400" },
  blue: { back: "#2E75B5", front: "#5A9BD5", accent: "#1E5894" },
  blueGray: { back: "#546E7A", front: "#78909C", accent: "#37474F" },
  teal: { back: "#00796B", front: "#26A69A", accent: "#004D40" },
  warm: { back: "#D84315", front: "#FF7043", accent: "#BF360C" },
  brown: { back: "#6D4C41", front: "#8D6E63", accent: "#4E342E" },
};

export const Win11Folder = ({ colorTheme = "yellow", size = 24, className = "", badgeIcon }: FolderProps) => {
  const colors = THEMES[colorTheme] || THEMES.yellow;
  const gradientId = `folder-grad-${colorTheme}`;
  const frontGradId = `folder-front-${colorTheme}`;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 64 64" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="32" y1="12" x2="32" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor={colors.back} />
          <stop offset="1" stopColor={colors.accent} />
        </linearGradient>
        <linearGradient id={frontGradId} x1="32" y1="24" x2="32" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor={colors.front} />
          <stop offset="1" stopColor={colors.back} />
        </linearGradient>
        <filter id="shadow" x="0" y="0" width="70" height="70" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Back Flap */}
      <path 
        d="M6 16C6 13.7909 7.79086 12 10 12H24.5L29.5 18H54C56.2091 18 58 19.7909 58 22V52C58 54.2091 56.2091 56 54 56H10C7.79086 56 6 54.2091 6 52V16Z" 
        fill={`url(#${gradientId})`} 
      />
      
      {/* Front Flap */}
      <path 
        d="M5 28C5 25.7909 6.79086 24 9 24H55C57.2091 24 59 25.7909 59 28V52C59 54.2091 57.2091 56 55 56H9C6.79086 56 5 54.2091 5 52V28Z" 
        fill={`url(#${frontGradId})`} 
        filter="url(#shadow)"
      />

      {/* Badge Overlay */}
      {badgeIcon && (
        <g transform="translate(24, 30) scale(0.6)">
          {badgeIcon}
        </g>
      )}
    </svg>
  );
};

export const Win11Pdf = ({ size = 24, className = "" }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 64 64" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="pdfGrad" x1="32" y1="8" x2="32" y2="56" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F44336" />
        <stop offset="1" stopColor="#D32F2F" />
      </linearGradient>
    </defs>
    {/* Document Base */}
    <path 
      d="M14 8C14 5.79086 15.7909 4 18 4H38L50 16V56C50 58.2091 48.2091 60 46 60H18C15.7909 60 14 58.2091 14 56V8Z" 
      fill="#FAFAFA" 
      stroke="#E0E0E0" 
      strokeWidth="2"
    />
    <path d="M38 4V16H50" fill="#E0E0E0" />
    
    {/* Red PDF Label */}
    <rect x="18" y="24" width="28" height="18" rx="4" fill="url(#pdfGrad)" />
    <text x="32" y="36" fill="white" fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">PDF</text>
  </svg>
);
