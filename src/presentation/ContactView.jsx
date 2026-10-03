import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="badge badge-primary" style={{ marginBottom: '0.5rem', padding: '0.35rem 0.85rem' }}>
          24/7 GLOBAL CUSTOMER SUPPORT
        </span>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.25rem 0' }}>
          Get in Touch with NEXUS Support
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
          Have a question about an order, product specification, or express shipment? Our support engineers are standing by.
        </p>
      </div>

      {/* Office & Support Showcase Hero Image */}
      <div className="glass-panel" style={{
        position: 'relative',
        height: '240px',
        borderRadius: '24px',
        overflow: 'hidden',
        marginBottom: '2.5rem',
        border: '1px solid rgba(99, 102, 241, 0.3)'
      }}>
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
          alt="Vortex Tech Corporate Headquarters"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(9, 13, 22, 0.95) 0%, rgba(9, 13, 22, 0.4) 100%)',
          display: 'flex',
          alignItems: 'center',
          padding: '2rem 3rem'
        }}>
          <div>
            <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>GLOBAL HEADQUARTERS</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>San Francisco Tech Campus</h2>
            <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>Vortex Tech Inc. • 100 Enterprise Way, Suite 400 • San Francisco, CA 94105</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* Left Column: Contact Details Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '0.75rem', borderRadius: '12px', color: '#6366f1' }}>
              <Mail size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>Email Customer Support</h4>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.35rem' }}>Direct email inquiry response within 2 hours.</p>
              <a href="mailto:support@nexustech.com" style={{ color: '#06b6d4', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>support@nexustech.com</a>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '0.75rem', borderRadius: '12px', color: '#10b981' }}>
              <Phone size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>Toll-Free Phone Hotline</h4>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', marginBottom: '0.35rem' }}>Available Monday–Sunday, 8am–10pm EST.</p>
              <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.95rem' }}>+1 (800) 555-NEXUS</div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '18px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.75rem', borderRadius: '12px', color: '#06b6d4' }}>
              <MapPin size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>Global Corporate Campus</h4>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.5 }}>
                Nexus Tech Inc. <br />
                100 Enterprise Way, Suite 400 <br />
                San Francisco, CA 94105, United States
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Message Form */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <CheckCircle2 size={54} color="#10b981" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.4rem', color: '#ffffff', fontWeight: 800, marginBottom: '0.5rem' }}>Message Sent Successfully!</h3>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Thank you, {name}. A support specialist has received your inquiry and will email {email} shortly.
              </p>
              <button onClick={() => setSubmitted(false)} className="btn-secondary">Send Another Message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={20} color="#6366f1" /> Send Us a Direct Message
              </h3>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Your Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-input" placeholder="Alex Mercer" required />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" placeholder="alex@example.com" required />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Subject</label>
                <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="form-input" placeholder="Order Inquiry / Product Spec Question" required />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>Message</label>
                <textarea value={message} onChange={e => setMessage(e.target.value)} className="form-input" rows={4} placeholder="How can our support team assist you today?" required />
              </div>

              <button type="submit" className="btn-emerald" style={{ justifyContent: 'center', padding: '0.85rem', marginTop: '0.5rem' }}>
                <Send size={16} /> Send Message to Support
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
