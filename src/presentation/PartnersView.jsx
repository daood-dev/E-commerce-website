import React from 'react';
import { Cpu, Truck, CreditCard, Zap, CheckCircle2 } from 'lucide-react';

export function PartnersView() {
  const partners = [
    {
      category: "Hardware & Display Technology",
      icon: Cpu,
      color: "#6366f1",
      image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80",
      list: [
        { name: "NVIDIA RTX", desc: "Ray tracing AI graphic acceleration in Titan Blade laptops & desktop gear." },
        { name: "Samsung Display", desc: "240Hz 4K Quantum Dot OLED panels & Micro-OLED displays." },
        { name: "Intel Processor", desc: "Multi-core high throughput processing architecture." }
      ]
    },
    {
      category: "Acoustics & Spatial Audio",
      icon: Zap,
      color: "#06b6d4",
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
      list: [
        { name: "Dolby Atmos", desc: "Spatial multi-channel height surround sound certification." },
        { name: "Audio-Technica", desc: "Precision magnetic cartridges and acoustic transducers." },
        { name: "ESS Sabre DAC", desc: "32-bit ultra low jitter Digital-to-Analog audio conversion." }
      ]
    },
    {
      category: "Logistics & Global Shipping",
      icon: Truck,
      color: "#10b981",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
      list: [
        { name: "FedEx Express", desc: "Priority 2-day express air delivery across North America." },
        { name: "DHL Worldwide", desc: "Customs-cleared 24h international priority dispatch." },
        { name: "USPS Ground", desc: "Reliable eco-friendly standard postal network." }
      ]
    },
    {
      category: "Payment Security & Fintech",
      icon: CreditCard,
      color: "#f59e0b",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
      list: [
        { name: "Stripe Infrastructure", desc: "PCI-DSS Level 1 tokenized credit card gateway." },
        { name: "PayPal Express", desc: "Encrypted digital wallet payment authorization." },
        { name: "Web3 Crypto Gateway", desc: "Decentralized USDC & ETH transaction verification." }
      ]
    }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="badge badge-emerald" style={{ marginBottom: '0.5rem', padding: '0.35rem 0.85rem' }}>
          STRATEGIC HARDWARE & LOGISTICS ALLIANCES
        </span>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.25rem 0' }}>
          Our Industry Partners
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto' }}>
          We collaborate with world leaders in semiconductor engineering, acoustic design, logistics, and fintech security to deliver premier tech products.
        </p>
      </div>

      {/* Grid of Partner Categories with Images */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {partners.map((group, idx) => {
          const Icon = group.icon;
          return (
            <div
              key={idx}
              className="glass-panel"
              style={{
                borderRadius: '24px',
                overflow: 'hidden',
                border: `1px solid ${group.color}33`,
                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Partner Category Header Image */}
              <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden' }}>
                <img
                  src={group.image}
                  alt={group.category}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/800x400/1e293b/6366f1?text=${encodeURIComponent(group.category)}`;
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, transparent 80%)'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem'
                }}>
                  <div style={{ background: `${group.color}33`, padding: '0.5rem', borderRadius: '10px', color: group.color }}>
                    <Icon size={20} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>{group.category}</h3>
                </div>
              </div>

              {/* List of Partners */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                {group.list.map((p, pIdx) => (
                  <div
                    key={pIdx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle2 size={14} color={group.color} /> {p.name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#9ca3af', lineHeight: 1.5 }}>
                      {p.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
