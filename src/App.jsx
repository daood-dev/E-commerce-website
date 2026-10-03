import React, { useState, useEffect } from 'react';
import { Navbar } from './presentation/Navbar';
import { StorefrontView } from './presentation/StorefrontView';
import { ProductDetailModal } from './presentation/ProductDetailModal';
import { CartDrawer } from './presentation/CartDrawer';
import { CheckoutModal } from './presentation/CheckoutModal';
import { OrderTrackerView } from './presentation/OrderTrackerView';
import { AdminDashboard } from './presentation/AdminDashboard';
import { ContactView } from './presentation/ContactView';
import { PartnersView } from './presentation/PartnersView';
import { LoginModal } from './presentation/LoginModal';
import { VortexLogo } from './presentation/VortexLogo';

import { ProductController } from './application/ProductController';
import { CartController } from './application/CartController';
import { AuthController } from './application/AuthController';
import { OrderController } from './application/OrderController';
import { db } from './database/db';

export function App() {
  const [activeMode, setActiveMode] = useState('store'); // 'store' | 'admin' | 'orders' | 'partners' | 'contact'
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Modals & Drawers state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPromoCode, setCheckoutPromoCode] = useState('');
  
  // Login Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalTab, setLoginModalTab] = useState('customer'); // 'customer' | 'admin'

  const [toastMessage, setToastMessage] = useState(null);

  const productController = new ProductController();
  const cartController = new CartController();
  const authController = new AuthController();
  const orderController = new OrderController();

  const reloadData = () => {
    const user = authController.getCurrentSession();
    setCurrentUser(user);
    setProducts(productController.getProducts());
    if (user) {
      setUserOrders(orderController.getUserOrders(user.user_id));
    } else {
      setUserOrders([]);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenLoginModal = (tab = 'customer') => {
    setLoginModalTab(tab);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    reloadData();
    showToast(`Logged in successfully as ${user.name} (${user.role})!`);
    if (user.role === 'Admin') {
      setActiveMode('admin');
    }
  };

  const handleLogout = () => {
    authController.logout();
    setCurrentUser(null);
    setCartItems([]);
    if (activeMode === 'admin') {
      setActiveMode('store');
    }
    showToast("Logged out of session.");
    reloadData();
  };

  // ENFORCE MANDATORY SIGN-IN BEFORE ADDING TO CART OR PURCHASING
  const handleAddToCart = (product, quantity = 1) => {
    if (!currentUser) {
      showToast("🔒 Sign In Required: Please Sign In or Register an account to buy items!");
      handleOpenLoginModal('customer');
      return;
    }

    const updated = cartController.addToCart(cartItems, product, quantity);
    setCartItems(updated);
    showToast(`Added '${product.name}' to shopping cart!`);
  };

  const handleUpdateCartQuantity = (productId, newQty) => {
    const updated = cartController.updateQuantity(cartItems, productId, newQty);
    setCartItems(updated);
  };

  const handleRemoveCartItem = (productId) => {
    const updated = cartController.removeFromCart(cartItems, productId);
    setCartItems(updated);
  };

  const handleProceedToCheckout = (promoCode) => {
    if (!currentUser) {
      showToast("🔒 Sign In Required: Please Sign In or Register to place your order!");
      handleOpenLoginModal('customer');
      return;
    }

    if (cartItems.length === 0) {
      showToast("Your cart is empty.");
      return;
    }

    setCheckoutPromoCode(promoCode);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (newOrder) => {
    setCartItems([]);
    setIsCheckoutOpen(false);
    reloadData();
    showToast(`🎉 Order #${newOrder.order_id} placed successfully!`);
    setActiveMode('orders');
  };

  const handleResetDatabase = () => {
    if (confirm("Reset database to initial seed state?")) {
      db.resetToDefaults();
      setCartItems([]);
      reloadData();
      showToast("Database reset to initial seed state!");
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 100,
          background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
          color: '#ffffff',
          padding: '0.85rem 1.4rem',
          borderRadius: '14px',
          boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
          fontWeight: 700,
          fontSize: '0.9rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onOpenLoginModal={handleOpenLoginModal}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {activeMode === 'store' && (
          <StorefrontView
            products={products}
            onAddToCart={handleAddToCart}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {activeMode === 'partners' && (
          <PartnersView />
        )}

        {activeMode === 'contact' && (
          <ContactView />
        )}

        {activeMode === 'orders' && (
          <OrderTrackerView orders={userOrders} />
        )}

        {activeMode === 'admin' && (
          currentUser?.role === 'Admin' ? (
            <AdminDashboard
              products={products}
              onRefreshData={reloadData}
            />
          ) : (
            <div className="glass-panel" style={{ maxWidth: '600px', margin: '4rem auto', padding: '3rem 2rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '1rem' }}>Admin Authentication Required</h2>
              <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
                You must authenticate with Admin credentials to access the Administration Console.
              </p>
              <button
                onClick={() => handleOpenLoginModal('admin')}
                className="btn-emerald"
                style={{ padding: '0.8rem 1.5rem' }}
              >
                Authenticate as Admin
              </button>
            </div>
          )
        )}
      </main>

      {/* Commercial E-Commerce Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '3rem 1.5rem 1.5rem',
        marginTop: '4rem',
        background: 'rgba(9, 13, 22, 0.95)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ marginBottom: '0.75rem' }}>
              <VortexLogo size="md" />
            </div>
            <p style={{ fontSize: '0.82rem', color: '#9ca3af', lineHeight: 1.6, marginBottom: '1rem' }}>
              Next-generation high performance electronics, smart home automation, wearables, audio, and techwear apparel.
            </p>

            {/* Social Media Pages Links */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {[
                { name: 'Twitter / X', url: 'https://twitter.com', label: '𝕏' },
                { name: 'GitHub', url: 'https://github.com', label: '🐙' },
                { name: 'YouTube', url: 'https://youtube.com', label: '▶' },
                { name: 'LinkedIn', url: 'https://linkedin.com', label: 'in' },
                { name: 'Instagram', url: 'https://instagram.com', label: '📸' },
                { name: 'Discord', url: 'https://discord.com', label: '💬' }
              ].map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  title={`Follow Vortex Tech on ${s.name}`}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    textDecoration: 'none',
                    fontWeight: 700,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(6, 182, 212, 0.3)';
                    e.currentTarget.style.borderColor = '#06b6d4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.75rem' }}>Shop Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: '#9ca3af' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveMode('store')}>Storefront Catalog</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveMode('partners')}>Our Industry Partners</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveMode('contact')}>Support & Contact Us</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveMode('orders')}>Track Order Shipment</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.75rem' }}>Customer Care</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: '#9ca3af' }}>
              <span>24/7 Express Support Hotline</span>
              <span>2-Year Global Warranty</span>
              <span>30-Day Return Policy</span>
              <span style={{ cursor: 'pointer', color: '#6366f1' }} onClick={handleResetDatabase}>Reset Database State</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 700, marginBottom: '0.75rem' }}>System Portals</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => handleOpenLoginModal('customer')}
                style={{ background: 'none', border: 'none', color: '#06b6d4', fontSize: '0.82rem', textAlign: 'left', cursor: 'pointer', fontWeight: 600 }}
              >
                Customer Sign In / Register
              </button>
              <button
                onClick={() => handleOpenLoginModal('admin')}
                style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '0.82rem', textAlign: 'left', cursor: 'pointer', fontWeight: 600 }}
              >
                🔐 Admin Console Portal
              </button>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '1.25rem',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '0.78rem'
        }}>
          © 2026 VORTEX TECH INC. All rights reserved. • Built with Layered Architecture, MVC, Pipe-and-Filter, Repository & Adapter Patterns.
        </div>
      </footer>

      {/* Login & Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialTab={loginModalTab}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout & Pipe-and-Filter Visualizer Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        user={currentUser}
        cartItems={cartItems}
        promoCode={checkoutPromoCode}
        onOrderCompleted={handleOrderCompleted}
      />
    </div>
  );
}

export default App;
