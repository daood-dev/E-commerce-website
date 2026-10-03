import { OrderRepository } from '../../data/repositories/OrderRepository';
import { ProductRepository } from '../../data/repositories/ProductRepository';

export class OrderCreationFilter {
  static get filterName() {
    return "5. Order Creation Filter";
  }

  async process(context) {
    context.logStep(OrderCreationFilter.filterName, "running", "Persisting order record to database via OrderRepository & updating stock...");
    await new Promise(resolve => setTimeout(resolve, 550));

    const orderRepo = new OrderRepository();
    const productRepo = new ProductRepository();

    try {
      // 1. Deduct stock for all ordered items
      for (const item of context.items) {
        productRepo.reduceStock(item.product_id, item.quantity);
      }

      // 2. Create order record payload
      const orderPayload = {
        user_id: context.user.user_id,
        customer_name: context.user.name,
        customer_email: context.user.email,
        items: context.items,
        subtotal: context.subtotal,
        discount_amount: context.discountAmount,
        shipping_fee: context.shippingFee,
        tax_amount: context.taxAmount,
        total_amount: context.totalAmount,
        status: "Confirmed",
        payment: context.paymentResult,
        shipping_address: context.shippingAddress
      };

      const createdOrder = orderRepo.create(orderPayload);
      context.orderRecord = createdOrder;

      context.logStep(
        OrderCreationFilter.filterName,
        "passed",
        `Order Record ${createdOrder.order_id} stored successfully. Stock quantities updated in ProductRepository.`,
        { orderId: createdOrder.order_id, status: createdOrder.status }
      );
      return true;
    } catch (err) {
      context.abort(OrderCreationFilter.filterName, `Order Persistence Failed: ${err.message}`);
      return false;
    }
  }
}
