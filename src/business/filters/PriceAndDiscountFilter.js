import { DiscountRepository } from '../../data/repositories/DiscountRepository';

export class PriceAndDiscountFilter {
  static get filterName() {
    return "3. Price & Discount Calculation Filter";
  }

  async process(context) {
    context.logStep(PriceAndDiscountFilter.filterName, "running", "Calculating item subtotals, promo code discounts, tax, and shipping fees...");
    await new Promise(resolve => setTimeout(resolve, 450));

    // Calculate subtotal
    let subtotal = 0;
    context.items.forEach(item => {
      subtotal += item.price * item.quantity;
    });
    context.subtotal = Number(subtotal.toFixed(2));

    // Apply promo code discount if provided
    context.discountAmount = 0;
    if (context.promoCode) {
      const discountRepo = new DiscountRepository();
      const promo = discountRepo.getByCode(context.promoCode);
      if (promo) {
        context.discountAmount = Number(((context.subtotal * promo.percentage) / 100).toFixed(2));
      }
    }

    // Shipping fee via selected Shipping Adapter
    const shippingFee = context.shippingAdapter.calculateRate(context.shippingAddress, context.items.length);
    context.shippingFee = Number(shippingFee.toFixed(2));

    // Tax calculation (8.5%)
    const taxableSubtotal = Math.max(0, context.subtotal - context.discountAmount);
    context.taxAmount = Number((taxableSubtotal * 0.085).toFixed(2));

    // Final total calculation
    context.totalAmount = Number((taxableSubtotal + context.shippingFee + context.taxAmount).toFixed(2));

    context.logStep(
      PriceAndDiscountFilter.filterName,
      "passed",
      `Financial calculation completed. Subtotal: $${context.subtotal}, Discount: -$${context.discountAmount}, Shipping: $${context.shippingFee}, Tax: $${context.taxAmount} => Final Total: $${context.totalAmount}`,
      {
        subtotal: context.subtotal,
        discount: context.discountAmount,
        shipping: context.shippingFee,
        tax: context.taxAmount,
        total: context.totalAmount
      }
    );
    return true;
  }
}
