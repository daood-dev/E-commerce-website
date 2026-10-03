import React, { useState } from 'react';
import { Layers, Cpu, Database, Network, ArrowDown, FileCode, CheckCircle, Terminal } from 'lucide-react';
import { db } from '../database/db';

export function ArchitectureInspector() {
  const [selectedPatternTab, setSelectedPatternTab] = useState('layered'); // 'layered' | 'mvc' | 'pipeline' | 'repository' | 'adapter'

  const logs = db.queryLogs || [];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>SEMESTER PROJECT TELEMETRY & DOCUMENTATION</span>
        <h1 className="gradient-text" style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0.25rem 0' }}>
          Software Architecture Patterns Showcase
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1rem' }}>
          Interactive visualization and live telemetry log of all design patterns implemented in this e-commerce system.
        </p>
      </div>

      {/* Pattern Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {[
          { id: 'layered', label: '1. Layered Architecture', icon: Layers, color: '#6366f1' },
          { id: 'mvc', label: '2. MVC Pattern', icon: Network, color: '#a855f7' },
          { id: 'pipeline', label: '3. Pipe-and-Filter Engine', icon: Cpu, color: '#06b6d4' },
          { id: 'repository', label: '4. Repository Pattern', icon: Database, color: '#10b981' },
          { id: 'adapter', label: '5. Adapter Pattern', icon: Terminal, color: '#f59e0b' }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = selectedPatternTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedPatternTab(tab.id)}
              style={{
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: isActive ? tab.color : 'rgba(255, 255, 255, 0.1)',
                background: isActive ? `${tab.color}22` : 'rgba(18, 24, 38, 0.6)',
                color: isActive ? '#ffffff' : '#9ca3af',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} color={isActive ? tab.color : '#9ca3af'} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* PATTERN 1: LAYERED ARCHITECTURE */}
      {selectedPatternTab === 'layered' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.5rem' }}>
              System Architectural Stack
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { layer: "Presentation Layer", sub: "StorefrontView, CartDrawer, CheckoutModal, AdminDashboard", color: "#6366f1" },
                { layer: "Application Layer", sub: "AuthController, ProductController, CartController, OrderController", color: "#a855f7" },
                { layer: "Business Layer", sub: "Pricing Engine, Inventory Rules, 7 Checkout Pipeline Filters", color: "#06b6d4" },
                { layer: "Data Access Layer", sub: "ProductRepository, OrderRepository, PaymentAdapters", color: "#10b981" },
                { layer: "Database Layer", sub: "In-Memory / LocalStorage Relational Engine", color: "#f59e0b" }
              ].map((item, idx) => (
                <React.Fragment key={idx}>
                  <div style={{
                    padding: '1.1rem',
                    borderRadius: '12px',
                    background: `${item.color}15`,
                    border: `1px solid ${item.color}44`
                  }}>
                    <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1rem' }}>{item.layer}</div>
                    <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.2rem' }}>{item.sub}</div>
                  </div>
                  {idx < 4 && (
                    <div style={{ textAlign: 'center' }}>
                      <ArrowDown size={18} color="#6b7280" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
              Why Layered Architecture?
            </h3>
            <ul style={{ color: '#9ca3af', lineHeight: 1.7, fontSize: '0.92rem', paddingLeft: '1.25rem' }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong style={{ color: '#ffffff' }}>Separation of Concerns:</strong> High-level presentation components never directly access SQL/database queries or raw file persistence.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong style={{ color: '#ffffff' }}>Maintainability & Testability:</strong> Business rules (discount formulas, stock threshold rules) exist inside the Business Layer and can be unit-tested in isolation.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong style={{ color: '#ffffff' }}>Interchangeable Data Layer:</strong> The Data Access Layer uses the Repository Pattern, making it effortless to swap local mock DBs for real PostgreSQL/MySQL servers.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* PATTERN 2: MVC PATTERN */}
      {selectedPatternTab === 'mvc' && (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.5rem' }}>
            Model-View-Controller (MVC) Structure
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '1.5rem', borderRadius: '14px' }}>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>VIEW</span>
              <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.5rem' }}>Presentation Component Views</h4>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.5 }}>
                Renders user interface, receives user click events (e.g. "Add to Cart", "Execute Pipeline"), and passes events to Controllers.
              </p>
            </div>

            <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '1.5rem', borderRadius: '14px' }}>
              <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>CONTROLLER</span>
              <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.5rem' }}>Application Controllers</h4>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.5 }}>
                `ProductController`, `CartController`, `OrderController`. Handles payload validation, instantiates services/pipelines, and returns model outputs.
              </p>
            </div>

            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1.5rem', borderRadius: '14px' }}>
              <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>MODEL</span>
              <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.5rem' }}>Domain Data Models</h4>
              <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.5 }}>
                Encapsulates data structures for Product, Order, User, CartItem, PaymentResult, and Shipment entities.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PATTERN 3: PIPE-AND-FILTER */}
      {selectedPatternTab === 'pipeline' && (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            Order Processing Pipe-and-Filter Architecture
          </h3>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Each filter box is an independent, single-responsibility processing stage. Data flows linearly through pipes via `PipelineContext`.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {[
              { num: 1, title: 'Order Validation Filter', detail: 'Verifies empty cart, user session, and address format' },
              { num: 2, title: 'Inventory Check Filter', detail: 'Queries ProductRepository and reserves stock' },
              { num: 3, title: 'Price & Discount Filter', detail: 'Calculates subtotal, promo code %, tax and shipping rate' },
              { num: 4, title: 'Payment Processing Filter', detail: 'Calls selected IPaymentAdapter strategy (Stripe, PayPal, etc.)' },
              { num: 5, title: 'Order Creation Filter', detail: 'Stores order record in OrderRepository and updates catalog stock' },
              { num: 6, title: 'Shipping Processing Filter', detail: 'Calls selected IShippingAdapter strategy (FedEx, DHL, Postal)' },
              { num: 7, title: 'Notification Filter', detail: 'Generates confirmation invoice email notification' }
            ].map(f => (
              <div key={f.num} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '1rem', borderRadius: '12px' }}>
                <span className="badge badge-cyan" style={{ marginBottom: '0.4rem' }}>Filter #{f.num}</span>
                <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '0.35rem' }}>{f.title}</h4>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PATTERN 4: REPOSITORY PATTERN LOG MONITOR */}
      {selectedPatternTab === 'repository' && (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={22} color="#10b981" /> Live Repository Query Telemetry Log
            </h3>
            <span className="badge badge-emerald">Real-time Data Access Layer</span>
          </div>

          <div className="code-block" style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {logs.length === 0 ? (
              <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>No repository queries recorded yet. Browse storefront or place an order.</div>
            ) : (
              logs.slice().reverse().map(l => (
                <div key={l.id} style={{ marginBottom: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', pb: '0.4rem' }}>
                  <span style={{ color: '#06b6d4' }}>[{l.timestamp}]</span>{' '}
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>[{l.operation}]</span>{' '}
                  <span style={{ color: '#10b981' }}>{l.entity}</span>: {l.details}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* PATTERN 5: ADAPTER PATTERN */}
      {selectedPatternTab === 'adapter' && (
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
            Adapter Pattern Strategies
          </h3>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            External third-party payment gateways and shipping carrier APIs have different interface signatures. The system defines unified interfaces (`IPaymentAdapter` and `IShippingAdapter`) so any provider can plug in seamlessly.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h4 style={{ color: '#f59e0b', marginBottom: '0.5rem' }}>IPaymentAdapter Implementations</h4>
              <ul style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, paddingLeft: '1rem' }}>
                <li><code>StripePaymentAdapter</code> - Credit Card Tokenization</li>
                <li><code>PayPalPaymentAdapter</code> - Express Checkout API</li>
                <li><code>CryptoPaymentAdapter</code> - Web3 Wallet Verification</li>
                <li><code>CashOnDeliveryAdapter</code> - Physical COD Verification</li>
              </ul>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.25rem', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <h4 style={{ color: '#34d399', marginBottom: '0.5rem' }}>IShippingAdapter Implementations</h4>
              <ul style={{ color: '#9ca3af', fontSize: '0.85rem', lineHeight: 1.6, paddingLeft: '1rem' }}>
                <li><code>FedExShippingAdapter</code> - FedEx Air Priority API</li>
                <li><code>DHLShippingAdapter</code> - DHL Worldwide Express API</li>
                <li><code>StandardPostalAdapter</code> - Ground Postal Tracking</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
