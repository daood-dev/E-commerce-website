import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, Package, ShoppingBag, DollarSign, Tag, 
  Users, ShieldCheck, Terminal, Activity, RefreshCw, UserCheck, 
  UserPlus, CheckCircle2, Search, Filter, Layers, Database
} from 'lucide-react';
import { ProductController } from '../application/ProductController';
import { OrderController } from '../application/OrderController';
import { DiscountRepository } from '../data/repositories/DiscountRepository';
import { UserRepository } from '../data/repositories/UserRepository';
import { db } from '../database/db';

export function AdminDashboard({ products, onRefreshData }) {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'users' | 'orders' | 'discounts' | 'system'

  // Product Add / Edit Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null or product object
  
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState('cat-electronics');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80');
  const [prodDesc, setProdDesc] = useState('');

  // Inventory Filter State
  const [inventoryCatFilter, setInventoryCatFilter] = useState('cat-all');
  const [inventorySearch, setInventorySearch] = useState('');

  // User Management Form State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('password123');
  const [newUserRole, setNewUserRole] = useState('Customer');
  const [userSearch, setUserSearch] = useState('');

  // Discount Form State
  const [newCode, setNewCode] = useState('');
  const [newPercentage, setNewPercentage] = useState('15');

  // Order Filter State
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  const productController = new ProductController();
  const orderController = new OrderController();
  const discountRepo = new DiscountRepository();
  const userRepo = new UserRepository();

  const allOrders = orderController.getAllOrders();
  const allDiscounts = discountRepo.getAll();
  const allUsers = userRepo.getAll();
  const queryLogs = db.queryLogs || [];

  const totalRevenue = allOrders.reduce((sum, o) => sum + o.total_amount, 0);

  // PRODUCT CRUD HANDLERS
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory('cat-electronics');
    setProdPrice('');
    setProdStock('');
    setProdImageUrl('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80');
    setProdDesc('');
    setShowAddModal(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdCategory(p.category_id);
    setProdPrice(p.price);
    setProdStock(p.stock_quantity);
    setProdImageUrl(p.image_url);
    setProdDesc(p.description);
    setShowAddModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!prodName || !prodPrice || prodStock === '') return;

    if (editingProduct) {
      // Update existing product
      db.logQuery("UPDATE", "Products", `Updated product ${editingProduct.product_id} (${prodName})`);
      const idx = db.products.findIndex(p => p.product_id === editingProduct.product_id);
      if (idx !== -1) {
        db.products[idx] = {
          ...db.products[idx],
          name: prodName,
          category_id: prodCategory,
          price: Number(prodPrice),
          stock_quantity: Number(prodStock),
          image_url: prodImageUrl,
          description: prodDesc
        };
        db.save();
      }
    } else {
      // Create new product
      productController.createProduct({
        name: prodName,
        category_id: prodCategory,
        price: Number(prodPrice),
        stock_quantity: Number(prodStock),
        image_url: prodImageUrl,
        description: prodDesc
      });
    }

    setShowAddModal(false);
    onRefreshData();
  };

  const handleQuickStockUpdate = (productId, currentStock) => {
    const qty = prompt("Enter new stock quantity:", currentStock);
    if (qty !== null && !isNaN(qty)) {
      productController.updateStock(productId, Number(qty));
      onRefreshData();
    }
  };

  const handleDeleteProduct = (productId) => {
    if (confirm("Are you sure you want to delete this product?")) {
      productController.deleteProduct(productId);
      onRefreshData();
    }
  };

  // USER MANAGEMENT HANDLERS
  const handleToggleUserRole = (userId, currentRole) => {
    const newRole = currentRole === 'Admin' ? 'Customer' : 'Admin';
    if (confirm(`Change role of user ${userId} to '${newRole}'?`)) {
      userRepo.update(userId, { role: newRole });
      onRefreshData();
    }
  };

  const handleDeleteUser = (userId) => {
    if (confirm("Are you sure you want to delete this user account?")) {
      userRepo.delete(userId);
      onRefreshData();
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    userRepo.create({
      name: newUserName,
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole
    });

    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    onRefreshData();
  };

  // ORDER STATUS HANDLER
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    orderController.updateOrderStatus(orderId, newStatus);
    onRefreshData();
  };

  // PROMO CODE HANDLER
  const handleCreateDiscount = (e) => {
    e.preventDefault();
    if (!newCode || !newPercentage) return;
    discountRepo.create({ code: newCode, percentage: Number(newPercentage) });
    setNewCode('');
    onRefreshData();
  };

  // SYSTEM LOG HANDLERS
  const handleClearLogs = () => {
    db.queryLogs = [];
    db.save();
    onRefreshData();
  };

  const handleResetDB = () => {
    if (confirm("Reset database to initial seed defaults? All custom changes will be reset.")) {
      db.resetToDefaults();
      onRefreshData();
    }
  };

  // Filtered Products for Inventory View
  const filteredInventory = products.filter(p => {
    const matchesCat = inventoryCatFilter === 'cat-all' || p.category_id === inventoryCatFilter;
    const matchesSearch = !inventorySearch || 
      p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.product_id.toLowerCase().includes(inventorySearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filtered Users View
  const filteredUsers = allUsers.filter(u => {
    return !userSearch || 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase());
  });

  // Filtered Orders View
  const filteredOrders = allOrders.filter(o => {
    return orderStatusFilter === 'all' || o.status.toLowerCase() === orderStatusFilter.toLowerCase();
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Console Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-emerald" style={{ marginBottom: '0.5rem', padding: '0.35rem 0.85rem' }}>
            <ShieldCheck size={14} /> ADMINISTRATOR CONTROL CONSOLE
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.2 }}>
            Vortex System & Operations Dashboard
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleOpenAddModal}
            className="btn-emerald"
            style={{ padding: '0.75rem 1.25rem' }}
          >
            <Plus size={18} /> Add Catalog Product
          </button>
          
          <button
            onClick={() => setShowAddUserModal(true)}
            className="btn-primary"
            style={{ padding: '0.75rem 1.25rem' }}
          >
            <UserPlus size={18} /> Add User / Admin
          </button>
        </div>
      </div>

      {/* Metrics Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Total Gross Revenue</span>
            <DollarSign size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>${totalRevenue.toFixed(2)}</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Catalog Products</span>
            <Package size={18} color="#6366f1" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{products.length} Items</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Completed Orders</span>
            <ShoppingBag size={18} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{allOrders.length} Orders</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600 }}>Registered Users</span>
            <Users size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{allUsers.length} Accounts</div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', flexWrap: 'wrap' }}>
        {[
          { id: 'inventory', label: `Inventory Stock (${products.length})`, icon: Package },
          { id: 'users', label: `User Accounts (${allUsers.length})`, icon: Users },
          { id: 'orders', label: `Customer Orders (${allOrders.length})`, icon: ShoppingBag },
          { id: 'discounts', label: `Promo Codes (${allDiscounts.length})`, icon: Tag },
          { id: 'system', label: `System Audit Logs (${queryLogs.length})`, icon: Terminal }
        ].map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '3px solid #10b981' : '3px solid transparent',
                color: isActive ? '#ffffff' : '#9ca3af',
                padding: '0.75rem 1.25rem',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
            >
              <IconComponent size={16} color={isActive ? '#10b981' : '#9ca3af'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: INVENTORY STOCK MANAGER */}
      {activeTab === 'inventory' && (
        <div>
          {/* Inventory Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { id: 'cat-all', name: 'All Categories' },
                { id: 'cat-electronics', name: 'Electronics' },
                { id: 'cat-wearables', name: 'Wearables' },
                { id: 'cat-smarthome', name: 'Smart Home' },
                { id: 'cat-audio', name: 'Audio' },
                { id: 'cat-apparel', name: 'Apparel & Fashion' }
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => setInventoryCatFilter(c.id)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: inventoryCatFilter === c.id ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                    background: inventoryCatFilter === c.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(18, 24, 38, 0.6)',
                    color: inventoryCatFilter === c.id ? '#6ee7b7' : '#9ca3af',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', minWidth: '240px' }}>
              <Search size={15} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search items by name or ID..."
                value={inventorySearch}
                onChange={e => setInventorySearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.4rem', padding: '0.45rem 2.4rem', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#9ca3af' }}>
                  <th style={{ padding: '1rem' }}>Product Item</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Price ($)</th>
                  <th style={{ padding: '1rem' }}>Stock Units</th>
                  <th style={{ padding: '1rem' }}>Rating</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map(p => (
                  <tr key={p.product_id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img 
                        src={p.image_url} 
                        alt={p.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/400x400/1e293b/6366f1?text=${encodeURIComponent(p.name)}`;
                        }}
                        style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} 
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#ffffff' }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>ID: {p.product_id}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#67e8f9', fontWeight: 600 }}>{p.category_id}</td>
                    <td style={{ padding: '1rem', fontWeight: 800, color: '#ffffff' }}>${p.price.toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className={`badge ${p.stock_quantity > 15 ? 'badge-emerald' : p.stock_quantity > 0 ? 'badge-amber' : 'badge-rose'}`}>
                        {p.stock_quantity} Units
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#f59e0b', fontWeight: 700 }}>★ {p.rating}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                          title="Edit full product details"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleQuickStockUpdate(p.product_id, p.stock_quantity)}
                          style={{ background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', color: '#67e8f9', padding: '0.35rem 0.65rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                          title="Quick update stock"
                        >
                          Stock
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.product_id)}
                          style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fda4af', padding: '0.35rem 0.65rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem' }}
                          title="Delete product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: USER ACCOUNTS & ROLES */}
      {activeTab === 'users' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>System User Accounts & Role Permissions</h3>
            <div style={{ position: 'relative', minWidth: '260px' }}>
              <Search size={15} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search user by name, email, or role..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.4rem', padding: '0.45rem 2.4rem', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#9ca3af' }}>
                  <th style={{ padding: '1rem' }}>User Name</th>
                  <th style={{ padding: '1rem' }}>Email Address</th>
                  <th style={{ padding: '1rem' }}>Account Role</th>
                  <th style={{ padding: '1rem' }}>User ID</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => {
                  const isAdminRole = u.role === 'Admin';
                  return (
                    <tr key={u.user_id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#ffffff' }}>
                        {u.name}
                      </td>
                      <td style={{ padding: '1rem', color: '#9ca3af' }}>{u.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${isAdminRole ? 'badge-emerald' : 'badge-primary'}`}>
                          {isAdminRole ? <ShieldCheck size={12} /> : <Users size={12} />} {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.78rem', color: '#6b7280' }}>{u.user_id}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleToggleUserRole(u.user_id, u.role)}
                            style={{
                              background: isAdminRole ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              border: `1px solid ${isAdminRole ? 'rgba(99, 102, 241, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                              color: isAdminRole ? '#a5b4fc' : '#6ee7b7',
                              padding: '0.35rem 0.65rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '0.78rem',
                              fontWeight: 700
                            }}
                          >
                            {isAdminRole ? 'Demote to Customer' : 'Promote to Admin'}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u.user_id)}
                            style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fda4af', padding: '0.35rem 0.65rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER ORDERS PIPELINE */}
      {activeTab === 'orders' && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {['all', 'confirmed', 'processing', 'shipped', 'delivered'].map(st => (
              <button
                key={st}
                onClick={() => setOrderStatusFilter(st)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: orderStatusFilter === st ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                  background: orderStatusFilter === st ? 'rgba(16, 185, 129, 0.2)' : 'rgba(18, 24, 38, 0.6)',
                  color: orderStatusFilter === st ? '#6ee7b7' : '#9ca3af',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  cursor: 'pointer'
                }}
              >
                {st} Orders
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredOrders.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                No orders match the selected filter status.
              </div>
            ) : (
              filteredOrders.map(o => (
                <div key={o.order_id} className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.85rem', marginBottom: '0.85rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.05rem' }}>Order #{o.order_id}</span>
                        <span style={{ fontSize: '0.82rem', color: '#9ca3af' }}>• {o.created_at}</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#67e8f9', marginTop: '0.2rem', fontWeight: 600 }}>
                        Customer: {o.customer_name} ({o.customer_email})
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '0.82rem', color: '#9ca3af', fontWeight: 600 }}>Pipeline Status:</span>
                      <select
                        value={o.status}
                        onChange={e => handleUpdateOrderStatus(o.order_id, e.target.value)}
                        className="form-input"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: '150px', background: '#0f172a', color: '#34d399', fontWeight: 700 }}
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', fontWeight: 700 }}>
                        Order Line Items ({o.items?.length || 0})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {o.items?.map((item, idx) => (
                          <div key={idx} style={{ fontSize: '0.83rem', color: '#e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                            <span>• {item.name} x {item.quantity}</span>
                            <span style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', fontWeight: 700 }}>
                        Adapter Details & Shipping
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#9ca3af', lineHeight: 1.5 }}>
                        <div>Payment Method: <strong style={{ color: '#ffffff' }}>{o.payment_method || 'Credit Card'}</strong></div>
                        <div>Carrier: <strong style={{ color: '#ffffff' }}>{o.shipping_carrier || 'FedEx Express'}</strong></div>
                        <div>Tracking Code: <code style={{ color: '#67e8f9' }}>{o.tracking_number || 'TRACK-99201'}</code></div>
                        <div style={{ marginTop: '0.4rem', fontWeight: 800, color: '#10b981', fontSize: '1rem' }}>
                          Total Amount Paid: ${o.total_amount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PROMO CODES */}
      {activeTab === 'discounts' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>Create Promo Code</h3>
            <form onSubmit={handleCreateDiscount} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Promo Code Text</label>
                <input
                  type="text"
                  placeholder="e.g. SUMMER25"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value.toUpperCase())}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Discount Percentage (%)</label>
                <input
                  type="number"
                  placeholder="25"
                  value={newPercentage}
                  onChange={e => setNewPercentage(e.target.value)}
                  className="form-input"
                  min="1"
                  max="90"
                  required
                />
              </div>

              <button type="submit" className="btn-emerald" style={{ justifyContent: 'center', padding: '0.75rem', marginTop: '0.25rem' }}>
                <Tag size={16} /> Add Promo Code
              </button>
            </form>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>Active System Promo Codes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {allDiscounts.map(d => (
                <div key={d.discount_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div>
                    <span style={{ fontWeight: 800, color: '#10b981', fontSize: '1.05rem' }}>{d.code}</span>
                    <span style={{ fontSize: '0.85rem', color: '#9ca3af', marginLeft: '0.6rem' }}>({d.percentage}% Discount Off Total)</span>
                  </div>
                  <span className="badge badge-emerald">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM AUDIT LOGS & DATABASE ENGINE */}
      {activeTab === 'system' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>Real-time Database Query & Pipeline Audit Stream</h3>
              <p style={{ fontSize: '0.83rem', color: '#9ca3af' }}>Tracks relational repository operations, checkout filter pipelines, and auth events.</p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleClearLogs}
                className="btn-secondary"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
              >
                Clear Audit Stream
              </button>

              <button
                onClick={handleResetDB}
                style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fda4af', padding: '0.45rem 0.85rem', borderRadius: '10px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 }}
              >
                Reset DB to Seed State
              </button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '16px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem', fontFamily: 'monospace' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#9ca3af' }}>
                  <th style={{ padding: '0.75rem' }}>Time</th>
                  <th style={{ padding: '0.75rem' }}>Operation</th>
                  <th style={{ padding: '0.75rem' }}>Entity / Target</th>
                  <th style={{ padding: '0.75rem' }}>Log Details</th>
                </tr>
              </thead>
              <tbody>
                {queryLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                      No audit log entries recorded yet. Perform actions in the store to trigger query logging.
                    </td>
                  </tr>
                ) : (
                  [...queryLogs].reverse().map((log, idx) => {
                    const opColor = {
                      INSERT: '#10b981',
                      UPDATE: '#f59e0b',
                      DELETE: '#f43f5e',
                      SELECT: '#6366f1'
                    }[log.operation] || '#06b6d4';

                    return (
                      <tr key={log.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                        <td style={{ padding: '0.65rem', color: '#9ca3af' }}>{log.timestamp}</td>
                        <td style={{ padding: '0.65rem' }}>
                          <span style={{ background: `${opColor}25`, border: `1px solid ${opColor}50`, color: opColor, padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem' }}>
                            {log.operation}
                          </span>
                        </td>
                        <td style={{ padding: '0.65rem', color: '#ffffff', fontWeight: 700 }}>{log.entity}</td>
                        <td style={{ padding: '0.65rem', color: '#94a3b8' }}>{log.details}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(5, 8, 15, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '580px', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem' }}>
              {editingProduct ? `Edit Product Details (#${editingProduct.product_id})` : 'Add New Product to Catalog'}
            </h2>
            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Product Name</label>
                <input type="text" placeholder="Product Name" value={prodName} onChange={e => setProdName(e.target.value)} className="form-input" required />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Category</label>
                <select value={prodCategory} onChange={e => setProdCategory(e.target.value)} className="form-input">
                  <option value="cat-electronics">Electronics</option>
                  <option value="cat-wearables">Wearables</option>
                  <option value="cat-smarthome">Smart Home</option>
                  <option value="cat-audio">Audio</option>
                  <option value="cat-apparel">Apparel & Fashion</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Price ($)</label>
                  <input type="number" step="0.01" placeholder="99.99" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="form-input" required />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Stock Quantity</label>
                  <input type="number" placeholder="25" value={prodStock} onChange={e => setProdStock(e.target.value)} className="form-input" required />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Image URL</label>
                <input type="text" placeholder="https://..." value={prodImageUrl} onChange={e => setProdImageUrl(e.target.value)} className="form-input" required />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Description</label>
                <textarea placeholder="Product specification & features..." value={prodDesc} onChange={e => setProdDesc(e.target.value)} className="form-input" rows={3} />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-emerald">
                  <CheckCircle2 size={16} /> {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE USER / ADMIN MODAL */}
      {showAddUserModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(5, 8, 15, 0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem' }}>Register New User or Administrator</h2>
            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Full User Name</label>
                <input type="text" placeholder="e.g. Elena Vance" value={newUserName} onChange={e => setNewUserName(e.target.value)} className="form-input" required />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Account Role</label>
                <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} className="form-input">
                  <option value="Customer">Customer Role</option>
                  <option value="Admin">System Administrator Role</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Email Address</label>
                <input type="email" placeholder="user@example.com" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} className="form-input" required />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 600, display: 'block', marginBottom: '0.2rem' }}>Password</label>
                <input type="password" placeholder="••••••••" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} className="form-input" required />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddUserModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-emerald">
                  <UserPlus size={16} /> Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
