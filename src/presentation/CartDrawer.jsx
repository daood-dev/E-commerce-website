import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShoppingCart } from 'lucide-react';
import { CartController } from '../application/CartController';

export function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onProceedToCheckout }) {
  const [promoCode, setPromoCode] = useState('WELCOME10');
  const [appliedPromo, setAppliedPromo] = useState('WELCOME10');

  const cartController = new CartController();
  const { subtotal, discountAmount, promoDetails } = cartController.calculateCartTotals(cartItems, appliedPromo);

  if (!isOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setAppliedPromo(promoCode.trim().toUpperCase());
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      background: 'rgba(5, 8, 15, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '450px',
        height: '100%',
        borderRadius: 0,
        borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem'
      }}>
        {/* Drawer Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingCart size={20} color="#6366f1" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
              Your Shopping Cart ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#9ca3af', padding: '4rem 1rem' }}>
              <ShoppingCart size={48} color="#6366f1" style={{ opacity: 0.4, marginBottom: '1rem' }} />
              <p style={{ fontSize: '1rem', fontWeight: 600 }}>Your cart is empty</p>
              <p style={{ fontSize: '0.82rem', marginTop: '0.5rem' }}>Browse the catalog and add items to begin checkout.</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div
                key={item.product_id}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '12px',
                  padding: '0.85rem',
                  marginBottom: '0.85rem'
                }}
              >
                {/* Product Thumbnail */}
                <img
                  src={item.image_url}
                  alt={item.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/400x400/1e293b/6366f1?text=${encodeURIComponent(item.name)}`;
                  }}
                  style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    background: '#0f172a'
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                    {item.name}
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700 }}>
                    ${item.price.toFixed(2)}
                  </div>

                  {/* Quantity Controller */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: '#ffffff',
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        color: '#ffffff',
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => onRemoveItem(item.product_id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#f43f5e',
                    cursor: 'pointer',
                    padding: '0.4rem',
                    opacity: 0.8
                  }}
                  title="Remove Item"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Promo Code Form */}
        {cartItems.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem', marginTop: 'auto' }}>
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Tag size={14} color="#9ca3af" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Promo Code (e.g. WELCOME10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.2rem', padding: '0.5rem 0.5rem 0.5rem 2.2rem', fontSize: '0.8rem' }}
                />
              </div>
              <button type="submit" className="btn-secondary" style={{ padding: '0.5rem 0.85rem', fontSize: '0.8rem' }}>
                Apply
              </button>
            </form>

            {/* Financial Summary */}
            <div style={{ fontSize: '0.88rem', color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Promo Code ({promoDetails?.code} -{promoDetails?.percentage}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>Total (Excl. Tax & Shipping)</span>
                <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.1rem' }}>${(subtotal - discountAmount).toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed Action */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout(appliedPromo);
              }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
            >
              Proceed to Pipe Checkout <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
