import React, { useState } from 'react';
import { Package, Laptop, Watch, Home, Headphones, Shirt } from 'lucide-react';

export function ProductImage({ src, alt, categoryId, style, className }) {
  const [hasError, setHasError] = useState(false);

  const getCategoryTheme = (catId) => {
    switch (catId) {
      case 'cat-electronics':
        return { bg: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', icon: Laptop, color: '#818cf8', title: 'Tech Electronics' };
      case 'cat-wearables':
        return { bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', icon: Watch, color: '#38bdf8', title: 'Wearable Tech' };
      case 'cat-smarthome':
        return { bg: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)', icon: Home, color: '#34d399', title: 'Smart Home' };
      case 'cat-audio':
        return { bg: 'linear-gradient(135deg, #4c1d95 0%, #2e1065 100%)', icon: Headphones, color: '#c084fc', title: 'High-Res Audio' };
      case 'cat-apparel':
        return { bg: 'linear-gradient(135deg, #701a75 0%, #4a044e 100%)', icon: Shirt, color: '#f0abfc', title: 'Apparel & Fashion' };
      default:
        return { bg: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', icon: Package, color: '#a5b4fc', title: 'Nexus Product' };
    }
  };

  const theme = getCategoryTheme(categoryId);
  const IconComponent = theme.icon;

  if (hasError || !src) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: theme.bg,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          textAlign: 'center',
          userSelect: 'none',
          ...style
        }}
        className={className}
      >
        <div style={{
          width: '54px',
          height: '54px',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.75rem',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)'
        }}>
          <IconComponent size={28} color={theme.color} />
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, maxWidth: '90%' }}>
          {alt}
        </span>
        <span style={{ fontSize: '0.7rem', color: theme.color, marginTop: '0.3rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {theme.title}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      style={style}
      className={className}
    />
  );
}
