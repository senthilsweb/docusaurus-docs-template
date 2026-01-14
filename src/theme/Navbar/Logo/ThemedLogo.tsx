import React from 'react';

interface ThemedLogoProps {
  className?: string;
}

/**
 * A theme-aware logo component that uses CSS custom properties
 * to sync with the current theme's primary color.
 */
export default function ThemedLogo({ className }: ThemedLogoProps): JSX.Element {
  return (
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 40 40" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <style>
        {`
          .themed-logo-bg {
            fill: var(--ifm-color-primary, #4A154B);
          }
        `}
      </style>
      {/* Rounded rectangle background using CSS variable */}
      <rect width="40" height="40" rx="10" className="themed-logo-bg" />
      {/* Grid pattern in top-right */}
      <rect x="26" y="4" width="5" height="5" rx="1" fill="rgba(255,255,255,0.7)" />
      <rect x="32" y="4" width="5" height="5" rx="1" fill="rgba(255,255,255,0.4)" />
      <rect x="26" y="10" width="5" height="5" rx="1" fill="rgba(255,255,255,0.4)" />
      <rect x="32" y="10" width="5" height="5" rx="1" fill="rgba(255,255,255,0.4)" />
      {/* Terminal symbol */}
      <text 
        x="12" 
        y="28" 
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" 
        fontSize="20" 
        fontWeight="700" 
        fill="white"
      >
        &gt;
      </text>
    </svg>
  );
}
