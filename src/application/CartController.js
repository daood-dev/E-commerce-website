import { DiscountRepository } from '../data/repositories/DiscountRepository';

export class CartController {
  constructor() {
    this.discountRepo = new DiscountRepository();
  }

  addToCart(cartItems, product, quantity = 1) {
    const existingIndex = cartItems.findIndex(i => i.product_id === product.product_id);
    const updated = [...cartItems];

    if (existingIndex > -1) {
      const newQty = updated[existingIndex].quantity + quantity;
      if (newQty <= product.stock_quantity) {
        updated[existingIndex].quantity = newQty;
      }
    } else {
      updated.push({
        product_id: product.product_id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        max_stock: product.stock_quantity,
        quantity: Math.min(quantity, product.stock_quantity)
      });
    }
    return updated;
  }

  updateQuantity(cartItems, productId, quantity) {
    if (quantity <= 0) {
      return cartItems.filter(i => i.product_id !== productId);
    }
    return cartItems.map(item => {
      if (item.product_id === productId) {
        return { ...item, quantity: Math.min(quantity, item.max_stock) };
      }
      return item;
    });
  }

  removeFromCart(cartItems, productId) {
    return cartItems.filter(i => i.product_id !== productId);
  }

  calculateCartTotals(cartItems, promoCode = "") {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discountAmount = 0;
    let promoDetails = null;

    if (promoCode) {
      const discount = this.discountRepo.getByCode(promoCode);
      if (discount) {
        discountAmount = (subtotal * discount.percentage) / 100;
        promoDetails = discount;
      }
    }

    return {
      subtotal: Number(subtotal.toFixed(2)),
      discountAmount: Number(discountAmount.toFixed(2)),
      promoDetails
    };
  }
}
