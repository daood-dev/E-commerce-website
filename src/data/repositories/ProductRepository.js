import { IRepository } from './IRepository';
import { db } from '../../database/db';

export class ProductRepository extends IRepository {
  getAll() {
    db.logQuery("SELECT", "Products", "Fetched all products");
    return [...db.products];
  }

  getById(productId) {
    db.logQuery("SELECT", "Products", `WHERE product_id = '${productId}'`);
    return db.products.find(p => p.product_id === productId) || null;
  }

  getByCategory(categoryId) {
    db.logQuery("SELECT", "Products", `WHERE category_id = '${categoryId}'`);
    if (categoryId === "cat-all" || !categoryId) return this.getAll();
    return db.products.filter(p => p.category_id === categoryId);
  }

  search(query) {
    db.logQuery("SEARCH", "Products", `LIKE '%${query}%'`);
    if (!query) return this.getAll();
    const q = query.toLowerCase();
    return db.products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q)
    );
  }

  create(productData) {
    const newProduct = {
      product_id: "prod-" + Date.now(),
      created_at: new Date().toISOString(),
      rating: 5.0,
      review_count: 0,
      image_url: productData.image_url || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
      ...productData
    };
    db.products.push(newProduct);
    db.logQuery("INSERT", "Products", `Created product ${newProduct.product_id} (${newProduct.name})`);
    db.save();
    return newProduct;
  }

  update(productId, productData) {
    const idx = db.products.findIndex(p => p.product_id === productId);
    if (idx === -1) return null;
    db.products[idx] = { ...db.products[idx], ...productData };
    db.logQuery("UPDATE", "Products", `Updated product ${productId}`);
    db.save();
    return db.products[idx];
  }

  reduceStock(productId, quantity) {
    const product = this.getById(productId);
    if (!product) throw new Error(`Product ${productId} not found`);
    if (product.stock_quantity < quantity) {
      throw new Error(`Insufficient stock for product ${product.name}. Requested: ${quantity}, Available: ${product.stock_quantity}`);
    }
    product.stock_quantity -= quantity;
    db.logQuery("UPDATE STOCK", "Products", `Reduced ${quantity} units from product ${productId}. New stock: ${product.stock_quantity}`);
    db.save();
    return product;
  }

  delete(productId) {
    const idx = db.products.findIndex(p => p.product_id === productId);
    if (idx === -1) return false;
    const removed = db.products.splice(idx, 1);
    db.logQuery("DELETE", "Products", `Deleted product ${productId}`);
    db.save();
    return true;
  }
}
