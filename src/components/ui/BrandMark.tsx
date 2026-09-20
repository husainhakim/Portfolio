import React from "react";

interface BrandMarkProps {
  size?: number;
  className?: string;
  color?: string;
}

export function BrandMark({ size = 24, className, color = "currentColor" }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Husain Hakim - Brand Mark"
    >
      <path
        d="M64 64H256V192H448V448H320V320C320 284.65 291.35 256 256 256C220.65 256 192 284.65 192 320V448H64V64Z"
        fill={color}
      />
    </svg>
  );
}
