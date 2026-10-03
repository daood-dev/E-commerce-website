import React, { useState } from 'react';
import { Search, Star, ShoppingBag, Eye, CheckCircle2, AlertTriangle, Filter } from 'lucide-react';
import { db } from '../database/db';
import { ProductImage } from './ProductImage';
import { VortexLogo } from './VortexLogo';

export function StorefrontView({ products, onAddToCart, onSelectProduct }) {
  const [selectedCategory, setSelectedCategory] = useState("cat-all");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(2000);

  const categories = db.categories;

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "cat-all" || p.category_id === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = p.price <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Hero Showcase Banner */}
      <div className="glass-panel" style={{
        padding: '3rem 2.5rem',
        marginBottom: '2.5rem',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(99, 102, 241, 0.25)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '340px',
          height: '340px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '750px' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <VortexLogo size="lg" />
          </div>
          <span className="badge badge-primary" style={{ marginBottom: '1rem', padding: '0.35rem 0.85rem' }}>
            NEW GENERATION TECH & APPAREL GEAR
          </span>
          <h1 className="gradient-text" style={{ fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem' }}>
            Experience Ultra Performance Tech & Apparel
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '1.08rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Discover aerospace-grade smartwatches, 4K OLED gaming monitors, techwear bombers, ANC audio, and smart home automation with instant checkout and express global delivery.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem'
      }}>
        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat.category_id}
              onClick={() => setSelectedCategory(cat.category_id)}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: selectedCategory === cat.category_id ? '#6366f1' : 'rgba(255, 255, 255, 0.1)',
                background: selectedCategory === cat.category_id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(18, 24, 38, 0.6)',
                color: selectedCategory === cat.category_id ? '#a5b4fc' : '#9ca3af',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search & Price Controls */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search catalog products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(18, 24, 38, 0.6)', padding: '0.4rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <Filter size={15} color="#9ca3af" />
            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Max: ${maxPrice}</span>
            <input
              type="range"
              min="30"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ accentColor: '#6366f1', cursor: 'pointer', width: '90px' }}
            />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', color: '#9ca3af' }}>
          <ShoppingBag size={48} color="#6366f1" style={{ marginBottom: '1rem', opacity: 0.6 }} />
          <h3>No matching products found</h3>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Try clearing your search terms or broadening the category filter.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.75rem'
        }}>
          {filteredProducts.map(product => {
            const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 15;
            const isOutOfStock = product.stock_quantity <= 0;

            return (
              <div
                key={product.product_id}
                className="glass-panel glass-panel-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '18px',
                  overflow: 'hidden'
                }}
              >
                {/* Product Item Image Container */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '230px',
                  backgroundColor: '#0f172a',
                  overflow: 'hidden'
                }}>
                  <ProductImage
                    src={product.image_url}
                    alt={product.name}
                    categoryId={product.category_id}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                  />

                  {/* Stock Status Badge */}
                  <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
                    {isOutOfStock ? (
                      <span className="badge badge-rose">
                        <AlertTriangle size={12} /> Out of Stock
                      </span>
                    ) : isLowStock ? (
                      <span className="badge badge-amber">
                        <AlertTriangle size={12} /> Only {product.stock_quantity} Left
                      </span>
                    ) : (
                      <span className="badge badge-emerald">
                        <CheckCircle2 size={12} /> {product.stock_quantity} In Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6366f1', fontWeight: 700 }}>
                      {categories.find(c => c.category_id === product.category_id)?.name || 'Gadget'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Star size={14} color="#f59e0b" fill="#f59e0b" />
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f3f4f6' }}>{product.rating}</span>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>({product.review_count})</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                    {product.name}
                  </h3>

                  <p style={{
                    fontSize: '0.85rem',
                    color: '#9ca3af',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.description}
                  </p>

                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#9ca3af', display: 'block' }}>Price</span>
                      <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>${product.price.toFixed(2)}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => onSelectProduct(product)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          color: '#ffffff',
                          padding: '0.55rem',
                          borderRadius: '10px',
                          cursor: 'pointer'
                        }}
                        title="View Product Details & Reviews"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => onAddToCart(product)}
                        disabled={isOutOfStock}
                        className="btn-primary"
                        style={{
                          padding: '0.55rem 1rem',
                          opacity: isOutOfStock ? 0.4 : 1,
                          cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <ShoppingBag size={16} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
