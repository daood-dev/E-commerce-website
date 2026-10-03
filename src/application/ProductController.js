import { ProductRepository } from '../data/repositories/ProductRepository';
import { ReviewRepository } from '../data/repositories/ReviewRepository';

export class ProductController {
  constructor() {
    this.productRepo = new ProductRepository();
    this.reviewRepo = new ReviewRepository();
  }

  getProducts(categoryId = "cat-all", searchQuery = "") {
    let list = this.productRepo.getByCategory(categoryId);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return list;
  }

  getProductDetails(productId) {
    const product = this.productRepo.getById(productId);
    const reviews = this.reviewRepo.getByProduct(productId);
    return { product, reviews };
  }

  createProduct(productData) {
    return this.productRepo.create(productData);
  }

  updateStock(productId, newStock) {
    return this.productRepo.update(productId, { stock_quantity: Number(newStock) });
  }

  deleteProduct(productId) {
    return this.productRepo.delete(productId);
  }

  addReview(productId, userName, rating, comment) {
    return this.reviewRepo.create({
      product_id: productId,
      user_name: userName,
      rating: Number(rating),
      comment
    });
  }
}
