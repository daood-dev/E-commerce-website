import React, { useState } from 'react';
import { X, CreditCard, Truck, ShieldCheck, Play, CheckCircle, AlertCircle, Cpu, FileCode2, Lock, Wallet, Smartphone, ShieldAlert } from 'lucide-react';
import { OrderController } from '../application/OrderController';
import { StripePaymentAdapter, PayPalPaymentAdapter, CryptoPaymentAdapter, CashOnDeliveryAdapter } from '../adapters/PaymentAdapters';
import { FedExShippingAdapter, DHLShippingAdapter, StandardPostalAdapter } from '../adapters/ShippingAdapters';

export function CheckoutModal({ isOpen, onClose, user, cartItems, promoCode, onOrderCompleted }) {
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState('stripe');
  const [selectedShippingCarrier, setSelectedShippingCarrier] = useState('fedex');

  // Address inputs
  const [street, setStreet] = useState(user?.street || '742 Evergreen Terrace');
  const [city, setCity] = useState(user?.city || 'Seattle');
  const [postalCode, setPostalCode] = useState(user?.postal_code || '98101');
  const [country, setCountry] = useState(user?.country || 'United States');

  // Mock Payment Details Inputs (Simulated - Not Real)
  const [cardHolder, setCardHolder] = useState(user?.name || 'Alex Mercer');
  const [cardNumber, setCardNumber] = useState('4242 8888 9999 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [paypalEmail, setPaypalEmail] = useState(user?.email || 'alex@example.com');
  const [cryptoWallet, setCryptoWallet] = useState('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
  const [codPhone, setCodPhone] = useState(user?.phone || '+1 (555) 234-5678');

  // Pipeline Execution State
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [pipelineLogs, setPipelineLogs] = useState([]);
  const [pipelineResult, setPipelineResult] = useState(null);

  if (!isOpen) return null;

  const getPaymentAdapter = () => {
    switch (selectedPaymentProvider) {
      case 'stripe': return new StripePaymentAdapter();
      case 'paypal': return new PayPalPaymentAdapter();
      case 'crypto': return new CryptoPaymentAdapter();
      case 'cod': return new CashOnDeliveryAdapter();
      default: return new StripePaymentAdapter();
    }
  };

  const getShippingAdapter = () => {
    switch (selectedShippingCarrier) {
      case 'fedex': return new FedExShippingAdapter();
      case 'dhl': return new DHLShippingAdapter();
      case 'postal': return new StandardPostalAdapter();
      default: return new FedExShippingAdapter();
    }
  };

  const handleExecuteCheckoutPipeline = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setActiveStepIndex(0);
    setPipelineLogs([]);
    setPipelineResult(null);

    const orderController = new OrderController();
    const paymentAdapter = getPaymentAdapter();
    const shippingAdapter = getShippingAdapter();

    // Mock payment payload
    const paymentDetails = {
      cardHolder,
      cardNumber,
      cardExpiry,
      cardCvc,
      paypalEmail,
      cryptoWallet,
      codPhone
    };

    const result = await orderController.processCheckout(
      {
        user,
        items: cartItems,
        shippingAddress: { street, city, postal_code: postalCode, country },
        paymentAdapter,
        shippingAdapter,
        promoCode,
        paymentDetails
      },
      (stepInfo) => {
        setActiveStepIndex(stepInfo.stepIndex);
        setPipelineLogs(stepInfo.log);
      }
    );

    setIsProcessing(false);
    setPipelineResult(result);

    if (result.success) {
      setTimeout(() => {
        onOrderCompleted(result.order);
      }, 2500);
    }
  };

  const filterNodes = [
    { title: "Validation Filter", desc: "Validates session, address & items payload" },
    { title: "Inventory Check", desc: "Queries ProductRepository & reserves stock" },
    { title: "Price & Discount", desc: "Calculates subtotal, promo %, tax & shipping fee" },
    { title: "Payment Adapter", desc: "Executes swappable IPaymentAdapter strategy" },
    { title: "Order Creation", desc: "Persists record to OrderRepository & updates stock" },
    { title: "Shipping Adapter", desc: "Executes swappable IShippingAdapter strategy" },
    { title: "Notification", desc: "Dispatches confirmation receipt invoice email" }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      background: 'rgba(5, 8, 15, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '1150px',
        maxHeight: '92vh',
        overflowY: 'auto',
        borderRadius: '24px',
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
        border: '1px solid rgba(99, 102, 241, 0.25)'
      }}>
        {/* Close Header */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#ffffff',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        {/* Left Column: Delivery Address & Simulated Payment Methods Form */}
        <div style={{ padding: '2rem', borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-emerald">SIMULATED CHECKOUT & MOCK PAYMENT</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem' }}>
            Delivery & Payment Setup
          </h2>

          <form onSubmit={handleExecuteCheckoutPipeline}>
            {/* Address inputs */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9ca3af', display: 'block', marginBottom: '0.35rem' }}>
                Delivery Destination Address
              </label>
              <input
                type="text"
                value={street}
                onChange={e => setStreet(e.target.value)}
                className="form-input"
                disabled={isProcessing}
                required
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="form-input"
                  disabled={isProcessing}
                  required
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  className="form-input"
                  disabled={isProcessing}
                  required
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#67e8f9', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <CreditCard size={14} /> Select Simulated Payment Method
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.85rem' }}>
                {[
                  { id: 'stripe', name: 'Credit Card (Stripe)', desc: 'Visa / Mastercard / Amex' },
                  { id: 'paypal', name: 'PayPal Express', desc: 'Digital Wallet' },
                  { id: 'crypto', name: 'Web3 Crypto', desc: 'USDC / ETH Wallet' },
                  { id: 'cod', name: 'Cash on Delivery', desc: 'Pay at Delivery' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPaymentProvider(p.id)}
                    disabled={isProcessing}
                    style={{
                      background: selectedPaymentProvider === p.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid',
                      borderColor: selectedPaymentProvider === p.id ? '#6366f1' : 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      padding: '0.65rem 0.85rem',
                      textAlign: 'left',
                      cursor: isProcessing ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#ffffff' }}>{p.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{p.desc}</div>
                  </button>
                ))}
              </div>

              {/* SIMULATED PAYMENT METHOD FORM FIELDS */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.75rem' }}>
                  <Lock size={12} /> Test / Demo Simulated Payment Form (No Real Money Charged)
                </div>

                {selectedPaymentProvider === 'stripe' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={cardHolder}
                      onChange={e => setCardHolder(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
                      disabled={isProcessing}
                    />
                    <input
                      type="text"
                      placeholder="Card Number (e.g. 4242 8888 9999 4242)"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
                      disabled={isProcessing}
                    />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={e => setCardExpiry(e.target.value)}
                        className="form-input"
                        style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
                        disabled={isProcessing}
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        value={cardCvc}
                        onChange={e => setCardCvc(e.target.value)}
                        className="form-input"
                        style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                )}

                {selectedPaymentProvider === 'paypal' && (
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '0.25rem' }}>PayPal Account Email</label>
                    <input
                      type="email"
                      value={paypalEmail}
                      onChange={e => setPaypalEmail(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
                      disabled={isProcessing}
                    />
                  </div>
                )}

                {selectedPaymentProvider === 'crypto' && (
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '0.25rem' }}>Simulated Web3 Wallet Address</label>
                    <input
                      type="text"
                      value={cryptoWallet}
                      onChange={e => setCryptoWallet(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '0.75rem', padding: '0.45rem 0.75rem', fontFamily: 'var(--font-mono)' }}
                      disabled={isProcessing}
                    />
                  </div>
                )}

                {selectedPaymentProvider === 'cod' && (
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginBottom: '0.25rem' }}>Phone Number for Delivery Verification</label>
                    <input
                      type="text"
                      value={codPhone}
                      onChange={e => setCodPhone(e.target.value)}
                      className="form-input"
                      style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
                      disabled={isProcessing}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Carrier Selector */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <Truck size={14} /> Shipping Carrier Selection
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                {[
                  { id: 'fedex', name: 'FedEx Express', speed: '2 Days ($15)' },
                  { id: 'dhl', name: 'DHL Worldwide', speed: '1 Day ($22.50)' },
                  { id: 'postal', name: 'Standard Post', speed: '5 Days ($5.99)' }
                ].map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedShippingCarrier(s.id)}
                    disabled={isProcessing}
                    style={{
                      background: selectedShippingCarrier === s.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid',
                      borderColor: selectedShippingCarrier === s.id ? '#10b981' : 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '10px',
                      padding: '0.65rem 0.5rem',
                      textAlign: 'center',
                      cursor: isProcessing ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#ffffff' }}>{s.name}</div>
                    <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{s.speed}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || cartItems.length === 0}
              className="btn-emerald"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '0.85rem',
                opacity: (isProcessing || cartItems.length === 0) ? 0.5 : 1
              }}
            >
              <Play size={18} /> {isProcessing ? 'Processing Pipe-and-Filter Pipeline...' : 'Place Order & Complete Purchase'}
            </button>
          </form>
        </div>

        {/* Right Column: Live Pipe-and-Filter Visualizer Monitor */}
        <div style={{ padding: '2rem', background: 'rgba(10, 15, 28, 0.95)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <span className="badge badge-emerald" style={{ marginBottom: '0.25rem' }}>ORDER PROCESSING ENGINE</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={20} color="#06b6d4" /> Pipe-and-Filter Execution
              </h3>
            </div>
            {isProcessing && (
              <span className="badge badge-cyan pulse-active">
                Processing...
              </span>
            )}
          </div>

          {/* Interactive Pipeline Step Nodes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
            {filterNodes.map((filter, idx) => {
              let statusClass = 'waiting';
              let statusIcon = <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6b7280' }} />;

              if (idx < activeStepIndex || (pipelineResult?.success && idx <= activeStepIndex)) {
                statusClass = 'passed';
                statusIcon = <CheckCircle size={16} color="#10b981" />;
              } else if (idx === activeStepIndex && isProcessing) {
                statusClass = 'running pulse-active';
                statusIcon = <Cpu size={16} color="#06b6d4" />;
              } else if (idx === activeStepIndex && pipelineResult && !pipelineResult.success) {
                statusClass = 'failed';
                statusIcon = <AlertCircle size={16} color="#f43f5e" />;
              }

              return (
                <div
                  key={idx}
                  className={`filter-step ${statusClass}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {statusIcon}
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>{filter.title}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{filter.desc}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#6b7280' }}>
                    Stage {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Real-time Execution Log Terminal */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <FileCode2 size={14} color="#a5b4fc" /> Processing Log Terminal
            </div>
            <div className="code-block" style={{ flex: 1, minHeight: '140px', maxHeight: '180px', overflowY: 'auto' }}>
              {pipelineLogs.length === 0 ? (
                <div style={{ opacity: 0.5, fontStyle: 'italic' }}>Waiting to launch pipeline...</div>
              ) : (
                pipelineLogs.map((log, i) => (
                  <div key={i} style={{ marginBottom: '0.4rem' }}>
                    <span style={{ color: '#06b6d4' }}>[{log.timestamp}]</span>{' '}
                    <span style={{ color: log.status === 'passed' ? '#34d399' : log.status === 'failed' ? '#fda4af' : '#fcd34d' }}>
                      [{log.step}]
                    </span>{' '}
                    {log.message}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
