import { IRepository } from './IRepository';
import { db } from '../../database/db';

export class ReviewRepository extends IRepository {
  getAll() {
    db.logQuery("SELECT", "Reviews", "Fetched all product reviews");
    return [...db.reviews];
  }

  getById(reviewId) {
    db.logQuery("SELECT", "Reviews", `WHERE review_id = '${reviewId}'`);
    return db.reviews.find(r => r.review_id === reviewId) || null;
  }

  getByProduct(productId) {
    db.logQuery("SELECT", "Reviews", `WHERE product_id = '${productId}'`);
    return db.reviews.filter(r => r.product_id === productId);
  }

  create(reviewData) {
    const newReview = {
      review_id: "rev-" + Date.now(),
      created_at: new Date().toISOString(),
      ...reviewData
    };
    db.reviews.unshift(newReview);
    
    // Recalculate average rating for product
    const productReviews = this.getByProduct(reviewData.product_id);
    const avgRating = Number((productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1));
    const product = db.products.find(p => p.product_id === reviewData.product_id);
    if (product) {
      product.rating = avgRating;
      product.review_count = productReviews.length;
    }
    
    db.logQuery("INSERT", "Reviews", `Added review for product ${reviewData.product_id}. New rating: ${avgRating}`);
    db.save();
    return newReview;
  }

  update(id, entity) {
    return null;
  }

  delete(id) {
    const idx = db.reviews.findIndex(r => r.review_id === id);
    if (idx === -1) return false;
    db.reviews.splice(idx, 1);
    db.logQuery("DELETE", "Reviews", `Deleted review ${id}`);
    db.save();
    return true;
  }
}
