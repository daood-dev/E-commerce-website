import React, { useState } from 'react';
import { X, Star, ShoppingBag, Send, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { ProductController } from '../application/ProductController';
import { ProductImage } from './ProductImage';

export function ProductDetailModal({ product, onClose, onAddToCart }) {
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'reviews'
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const productController = new ProductController();
  const { reviews } = productController.getProductDetails(product.product_id);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewerName || !comment) return;
    productController.addReview(product.product_id, reviewerName, rating, comment);
    setReviewerName('');
    setComment('');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      background: 'rgba(5, 8, 15, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflowY: 'auto',
        borderRadius: '24px',
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
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
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        {/* Left Column: Product Image Showcase */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.9)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ width: '100%', height: '320px', borderRadius: '16px', overflow: 'hidden' }}>
            <ProductImage
              src={product.image_url}
              alt={product.name}
              categoryId={product.category_id}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            gap: '1.5rem',
            marginTop: '2rem',
            width: '100%',
            justifyContent: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#9ca3af', fontSize: '0.8rem' }}>
              <ShieldCheck size={16} color="#10b981" /> 2-Yr Warranty
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#9ca3af', fontSize: '0.8rem' }}>
              <Truck size={16} color="#06b6d4" /> Express Shipping
            </div>
          </div>
        </div>

        {/* Right Column: Product Specs & Reviews */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#6366f1', fontWeight: 800, letterSpacing: '0.05em' }}>
            PRODUCT SPECIFICATIONS
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', margin: '0.5rem 0' }}>
            {product.name}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Star size={16} color="#f59e0b" fill="#f59e0b" />
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>{product.rating}</span>
            </div>
            <span style={{ color: '#6b7280' }}>•</span>
            <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{product.review_count} verified reviews</span>
          </div>

          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem' }}>
            ${product.price.toFixed(2)}
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '1.25rem' }}>
            <button
              onClick={() => setActiveTab('specs')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'specs' ? '2px solid #6366f1' : '2px solid transparent',
                color: activeTab === 'specs' ? '#ffffff' : '#9ca3af',
                padding: '0.5rem 1rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'reviews' ? '2px solid #6366f1' : '2px solid transparent',
                color: activeTab === 'reviews' ? '#ffffff' : '#9ca3af',
                padding: '0.5rem 1rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, minHeight: '180px' }}>
            {activeTab === 'specs' ? (
              <div>
                <p style={{ color: '#9ca3af', lineHeight: 1.6, fontSize: '0.92rem', marginBottom: '1.25rem' }}>
                  {product.description}
                </p>

                <div className="code-block" style={{ marginBottom: '1rem' }}>
                  <div style={{ color: '#06b6d4', fontWeight: 700, marginBottom: '0.25rem' }}>DATA ACCESS MODEL (Repository Pattern):</div>
                  {JSON.stringify({
                    product_id: product.product_id,
                    stock_quantity: product.stock_quantity,
                    category_id: product.category_id,
                    created_at: product.created_at
                  }, null, 2)}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '0.5rem' }}>
                  {reviews.map(r => (
                    <div key={r.review_id} style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '0.75rem 1rem',
                      borderRadius: '10px',
                      marginBottom: '0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>{r.user_name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} size={12} color="#f59e0b" fill="#f59e0b" />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#9ca3af' }}>{r.comment}</p>
                    </div>
                  ))}
                </div>

                {/* Add Review Form */}
                <form onSubmit={handleSubmitReview} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={reviewerName}
                      onChange={e => setReviewerName(e.target.value)}
                      className="form-input"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                    />
                    <select
                      value={rating}
                      onChange={e => setRating(Number(e.target.value))}
                      className="form-input"
                      style={{ width: '100px', padding: '0.4rem', fontSize: '0.8rem' }}
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Write your review..."
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      className="form-input"
                      style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                    />
                    <button type="submit" className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      <Send size={14} /> Submit
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Add to Cart Action */}
          <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="btn-emerald"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
            >
              <ShoppingBag size={18} /> Add Item to Shopping Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
