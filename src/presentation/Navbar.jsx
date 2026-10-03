import React, { useState } from 'react';
import { ShoppingCart, User, LogOut, LogIn, ShieldCheck, ChevronDown, Clock, Users, Headset } from 'lucide-react';
import { VortexLogo } from './VortexLogo';

export function Navbar({ activeMode, setActiveMode, cartCount, onOpenCart, currentUser, onOpenLoginModal, onLogout }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isAdmin = currentUser?.role === 'Admin';

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      background: 'rgba(9, 13, 22, 0.9)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.9rem 2rem'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        {/* Brand Logo Component */}
        <VortexLogo size="md" onClick={() => setActiveMode('store')} />

        {/* Navigation Bar Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          <button
            onClick={() => setActiveMode('store')}
            style={{
              background: 'none',
              border: 'none',
              color: activeMode === 'store' ? '#ffffff' : '#9ca3af',
              fontWeight: activeMode === 'store' ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              borderBottom: activeMode === 'store' ? '2px solid #06b6d4' : '2px solid transparent',
              paddingBottom: '0.25rem'
            }}
          >
            Storefront
          </button>

          <button
            onClick={() => setActiveMode('partners')}
            style={{
              background: 'none',
              border: 'none',
              color: activeMode === 'partners' ? '#ffffff' : '#9ca3af',
              fontWeight: activeMode === 'partners' ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              borderBottom: activeMode === 'partners' ? '2px solid #06b6d4' : '2px solid transparent',
              paddingBottom: '0.25rem'
            }}
          >
            <Users size={15} /> Partners
          </button>

          <button
            onClick={() => setActiveMode('contact')}
            style={{
              background: 'none',
              border: 'none',
              color: activeMode === 'contact' ? '#ffffff' : '#9ca3af',
              fontWeight: activeMode === 'contact' ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              borderBottom: activeMode === 'contact' ? '2px solid #06b6d4' : '2px solid transparent',
              paddingBottom: '0.25rem'
            }}
          >
            <Headset size={15} /> Support & Contact
          </button>

          <button
            onClick={() => setActiveMode('orders')}
            style={{
              background: 'none',
              border: 'none',
              color: activeMode === 'orders' ? '#ffffff' : '#9ca3af',
              fontWeight: activeMode === 'orders' ? 700 : 500,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              borderBottom: activeMode === 'orders' ? '2px solid #06b6d4' : '2px solid transparent',
              paddingBottom: '0.25rem'
            }}
          >
            <Clock size={15} /> Track Orders
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveMode('admin')}
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#6ee7b7',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.8rem',
                borderRadius: '8px'
              }}
            >
              <ShieldCheck size={14} /> Admin Panel
            </button>
          )}
        </nav>

        {/* Right Side Actions: Cart & Account Dropdown + Mandatory Sign In Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="btn-primary"
            style={{ position: 'relative', padding: '0.55rem 1.1rem' }}
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                background: '#f43f5e',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 800,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(244, 63, 94, 0.6)'
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* User Session Badge / Sign In Trigger */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.45rem 0.85rem',
                borderRadius: '10px'
              }}>
                <User size={16} color={isAdmin ? '#10b981' : '#6366f1'} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                  {currentUser.name} ({currentUser.role})
                </span>
              </div>

              {/* Direct 1-Click Logout Button */}
              <button
                type="button"
                onClick={onLogout}
                style={{
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: '#fda4af',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.82rem',
                  fontWeight: 700
                }}
                title="Click to logout immediately"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => onOpenLoginModal('customer')}
                className="btn-emerald"
                style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }}
              >
                <LogIn size={15} /> Sign In to Purchase
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
