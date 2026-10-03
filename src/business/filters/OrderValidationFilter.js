export class OrderValidationFilter {
  static get filterName() {
    return "1. Order Validation Filter";
  }

  async process(context) {
    context.logStep(OrderValidationFilter.filterName, "running", "Validating order items, customer session, and shipping address...");
    await new Promise(resolve => setTimeout(resolve, 400));

    if (!context.user || !context.user.user_id) {
      context.abort(OrderValidationFilter.filterName, "Validation Failed: No active customer session found.");
      return false;
    }

    if (!context.items || context.items.length === 0) {
      context.abort(OrderValidationFilter.filterName, "Validation Failed: Shopping cart is empty.");
      return false;
    }

    if (!context.shippingAddress || !context.shippingAddress.street || !context.shippingAddress.city) {
      context.abort(OrderValidationFilter.filterName, "Validation Failed: Incomplete shipping address provided.");
      return false;
    }

    if (!context.paymentAdapter) {
      context.abort(OrderValidationFilter.filterName, "Validation Failed: No Payment Adapter selected.");
      return false;
    }

    if (!context.shippingAdapter) {
      context.abort(OrderValidationFilter.filterName, "Validation Failed: No Shipping Carrier Adapter selected.");
      return false;
    }

    context.logStep(
      OrderValidationFilter.filterName, 
      "passed", 
      `Order validated successfully: ${context.items.length} items for user ${context.user.name}`,
      { itemsCount: context.items.length, address: context.shippingAddress.city }
    );
    return true;
  }
}
