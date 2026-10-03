import React from 'react';

export function VortexLogo({ size = 'md', showText = true, onClick }) {
  const dimensions = {
    sm: { box: 32, icon: 20, font: '1rem', sub: '0.65rem' },
    md: { box: 42, icon: 26, font: '1.25rem', sub: '0.72rem' },
    lg: { box: 56, icon: 34, font: '1.75rem', sub: '0.85rem' }
  }[size] || { box: 42, icon: 26, font: '1.25rem', sub: '0.72rem' };

  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none'
      }}
    >
      {/* Visual Emblem Mark */}
      <div style={{
        width: `${dimensions.box}px`,
        height: `${dimensions.box}px`,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 50%, #a855f7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(6, 182, 212, 0.45)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Abstract 3D Vortex Swirl Emblem SVG */}
        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90C72.0914 90 90 72.0914 90 50"
            stroke="white"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M50 25C36.1929 25 25 36.1929 25 50C25 63.8071 36.1929 75 50 75"
            stroke="#a5b4fc"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="50" cy="50" r="12" fill="#ffffff" />
          <polygon points="50,30 65,50 50,70 35,50" fill="url(#vortex-glow)" />
          <defs>
            <linearGradient id="vortex-glow" x1="35" y1="30" x2="65" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#67e8f9" />
              <stop offset="1" stopColor="#818cf8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div>
          <div style={{
            fontSize: dimensions.font,
            fontWeight: 900,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            lineHeight: 1
          }}>
            VORTEX <span style={{ color: '#06b6d4', fontWeight: 500 }}>TECH</span>
          </div>
          <div style={{
            fontSize: dimensions.sub,
            color: '#9ca3af',
            fontWeight: 600,
            letterSpacing: '0.05em',
            marginTop: '0.15rem'
          }}>
            HIGH PERFORMANCE STORE
          </div>
        </div>
      )}
    </div>
  );
}
