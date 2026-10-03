import React, { useState, useEffect } from 'react';
import { X, User, ShieldCheck, LogIn, UserPlus, Zap, CheckCircle2 } from 'lucide-react';
import { AuthController } from '../application/AuthController';
import { VortexLogo } from './VortexLogo';

export function LoginModal({ isOpen, onClose, onLoginSuccess, initialTab = 'customer' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'customer' | 'admin' | 'create_custom'
  
  // Customer Login Form
  const [custEmail, setCustEmail] = useState('alex@example.com');
  const [custPassword, setCustPassword] = useState('password123');

  // Admin Login Form
  const [adminEmail, setAdminEmail] = useState('admin@ecommerce.org');
  const [adminPassword, setAdminPassword] = useState('adminpass123');

  // Custom Account Registration Form
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [customRole, setCustomRole] = useState('Customer'); // 'Customer' | 'Admin'

  const [errorMessage, setErrorMessage] = useState('');

  const authController = new AuthController();

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setErrorMessage('');
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleCustomerLogin = (e) => {
    e?.preventDefault();
    setErrorMessage('');
    const res = authController.loginCustomer(custEmail, custPassword);
    if (!res.success) {
      setErrorMessage(res.error);
      return;
    }
    onLoginSuccess(res.user);
    onClose();
  };

  const handleAdminLogin = (e) => {
    e?.preventDefault();
    setErrorMessage('');
    const res = authController.loginAdmin(adminEmail, adminPassword);
    if (!res.success) {
      setErrorMessage(res.error);
      return;
    }
    onLoginSuccess(res.user);
    onClose();
  };

  const handleCreateCustomAccount = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!customName.trim()) {
      setErrorMessage('Please enter your custom name.');
      return;
    }
    if (!customEmail.trim() || !customPassword.trim()) {
      setErrorMessage('Please fill in email and password.');
      return;
    }

    const res = authController.registerCustomAccount({
      name: customName,
      email: customEmail,
      password: customPassword,
      role: customRole
    });

    if (!res.success) {
      setErrorMessage(res.error);
      return;
    }

    onLoginSuccess(res.user);
    onClose();
  };

  const handleInstantCustomerLogin = () => {
    const res = authController.loginCustomer('alex@example.com', 'password123');
    if (res.success) {
      onLoginSuccess(res.user);
      onClose();
    }
  };

  const handleInstantAdminLogin = () => {
    const res = authController.loginAdmin('admin@ecommerce.org', 'adminpass123');
    if (res.success) {
      onLoginSuccess(res.user);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      background: 'rgba(5, 8, 15, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '540px',
        borderRadius: '24px',
        position: 'relative',
        padding: '2rem',
        border: '1px solid rgba(99, 102, 241, 0.3)'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#ffffff',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header with Logo */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ marginBottom: '0.85rem' }}>
            <VortexLogo size="md" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>
            System Authentication Portal
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
            Sign in with demo accounts or create your own custom User/Admin name below.
          </p>
        </div>

        {/* 1-Click Quick Demo Login Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={handleInstantCustomerLogin}
            style={{
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              color: '#a5b4fc',
              padding: '0.55rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Zap size={14} /> Quick Customer Login
          </button>

          <button
            type="button"
            onClick={handleInstantAdminLogin}
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#6ee7b7',
              padding: '0.55rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <Zap size={14} /> Quick Admin Login
          </button>
        </div>

        {/* Tab Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '0.35rem',
          background: 'rgba(18, 24, 38, 0.8)',
          padding: '0.3rem',
          borderRadius: '12px',
          marginBottom: '1.25rem',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab('customer'); setErrorMessage(''); }}
            style={{
              padding: '0.55rem 0.3rem',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              background: activeTab === 'customer' ? 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)' : 'transparent',
              color: activeTab === 'customer' ? '#ffffff' : '#9ca3af'
            }}
          >
            <User size={14} /> Customer
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('admin'); setErrorMessage(''); }}
            style={{
              padding: '0.55rem 0.3rem',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              background: activeTab === 'admin' ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)' : 'transparent',
              color: activeTab === 'admin' ? '#ffffff' : '#9ca3af'
            }}
          >
            <ShieldCheck size={14} /> Admin
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('create_custom'); setErrorMessage(''); }}
            style={{
              padding: '0.55rem 0.3rem',
              borderRadius: '9px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              background: activeTab === 'create_custom' ? 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)' : 'transparent',
              color: activeTab === 'create_custom' ? '#ffffff' : '#9ca3af'
            }}
          >
            <UserPlus size={14} /> Create Name
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: '#fda4af',
            padding: '0.65rem 0.85rem',
            borderRadius: '10px',
            fontSize: '0.83rem',
            marginBottom: '1rem',
            fontWeight: 600
          }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* TAB 1: CUSTOMER LOGIN */}
        {activeTab === 'customer' && (
          <form onSubmit={handleCustomerLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                Customer Email Address
              </label>
              <input
                type="email"
                value={custEmail}
                onChange={e => setCustEmail(e.target.value)}
                className="form-input"
                placeholder="alex@example.com"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                Customer Password
              </label>
              <input
                type="password"
                value={custPassword}
                onChange={e => setCustPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '0.85rem', marginTop: '0.25rem' }}>
              <LogIn size={16} /> Login as Customer
            </button>
          </form>
        )}

        {/* TAB 2: ADMIN LOGIN */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.65rem 0.85rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={15} /> Restricted Access - Administrator Role
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                Admin Email Address
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                className="form-input"
                placeholder="admin@ecommerce.org"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                Admin Secret Password / Key
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn-emerald" style={{ justifyContent: 'center', padding: '0.85rem', marginTop: '0.25rem' }}>
              <ShieldCheck size={16} /> Authenticate as Admin
            </button>
          </form>
        )}

        {/* TAB 3: CREATE CUSTOM NAME ACCOUNT (CUSTOMER OR ADMIN) */}
        {activeTab === 'create_custom' && (
          <form onSubmit={handleCreateCustomAccount} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#67e8f9', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>
                Enter Custom Name (User or Admin Name)
              </label>
              <input
                type="text"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                className="form-input"
                placeholder="e.g. Marcus Vance or Chief Admin"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Account Role</label>
              <select
                value={customRole}
                onChange={e => setCustomRole(e.target.value)}
                className="form-input"
              >
                <option value="Customer">Customer Role</option>
                <option value="Admin">System Administrator Role</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Email Address</label>
              <input
                type="email"
                value={customEmail}
                onChange={e => setCustomEmail(e.target.value)}
                className="form-input"
                placeholder="mycustomname@example.com"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Password</label>
              <input
                type="password"
                value={customPassword}
                onChange={e => setCustomPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn-emerald" style={{ justifyContent: 'center', padding: '0.85rem', marginTop: '0.5rem' }}>
              <CheckCircle2 size={16} /> Create Custom {customRole} & Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
