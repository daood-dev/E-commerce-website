import React from 'react';
import { PackageCheck, Truck, CheckCircle2, Clock, MapPin, ExternalLink } from 'lucide-react';

export function OrderTrackerView({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="glass-panel" style={{ maxWidth: '1000px', margin: '2rem auto', padding: '3rem 2rem', textAlign: 'center', color: '#9ca3af' }}>
        <PackageCheck size={48} color="#6366f1" style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '0.5rem' }}>No active orders found</h3>
        <p style={{ fontSize: '0.9rem' }}>Place an order using the storefront checkout to trace live status timeline updates.</p>
      </div>
    );
  }

  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Confirmed': return 1;
      case 'Processing': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  const statusSteps = [
    { title: 'Pending', desc: 'Order Placed' },
    { title: 'Confirmed', desc: 'Payment Verified' },
    { title: 'Processing', desc: 'Warehouse Packed' },
    { title: 'Shipped', desc: 'Carrier Dispatched' },
    { title: 'Delivered', desc: 'Package Handed Over' }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <PackageCheck size={28} color="#6366f1" /> Order History & Live Shipment Tracking
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {orders.map(order => {
          const currentIdx = getStatusStepIndex(order.status);

          return (
            <div
              key={order.order_id}
              className="glass-panel"
              style={{
                padding: '1.75rem',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Top Order Metadata */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Order #{order.order_id}</span>
                    <span className="badge badge-emerald">{order.status}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                    Placed on {new Date(order.order_date).toLocaleString()}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                    ${order.total_amount.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                    {order.items.length} item(s) • Paid via {order.payment?.provider || 'Credit Card'}
                  </div>
                </div>
              </div>

              {/* Status Timeline Bar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                position: 'relative'
              }}>
                {statusSteps.map((step, idx) => {
                  const isDone = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={idx} style={{ textAlign: 'center', position: 'relative' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isDone ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)' : 'rgba(255, 255, 255, 0.05)',
                        border: '2px solid',
                        borderColor: isCurrent ? '#06b6d4' : isDone ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                        margin: '0 auto 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        boxShadow: isCurrent ? '0 0 15px rgba(6, 182, 212, 0.5)' : 'none'
                      }}>
                        {isDone ? <CheckCircle2 size={16} /> : <Clock size={14} color="#9ca3af" />}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: isDone ? '#ffffff' : '#6b7280' }}>
                        {step.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{step.desc}</div>
                    </div>
                  );
                })}
              </div>

              {/* Items & Shipping Carrier Details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1rem',
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '1rem',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                {/* Order Item Thumbnails */}
                <div>
                  <h5 style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Purchased Items</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={item.image_url}
                          alt={item.name}
                          style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Qty: {item.quantity} × ${item.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carrier Details */}
                <div>
                  <h5 style={{ fontSize: '0.8rem', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Carrier & Dispatch Info</h5>
                  {order.shipment ? (
                    <div style={{ fontSize: '0.85rem', color: '#e5e7eb' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        <Truck size={16} color="#06b6d4" /> <strong>{order.shipment.carrier}</strong>
                      </div>
                      <div style={{ color: '#9ca3af', marginBottom: '0.4rem' }}>
                        Tracking #: <code style={{ color: '#67e8f9', fontFamily: 'var(--font-mono)' }}>{order.shipment.trackingNumber}</code>
                      </div>
                      <a
                        href={order.shipment.labelUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#6366f1', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}
                      >
                        Track Package on External Carrier Site <ExternalLink size={12} />
                      </a>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Shipment preparing in warehouse...</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
