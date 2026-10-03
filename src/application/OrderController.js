import { PipelineEngine } from '../business/PipelineEngine';
import { PipelineContext } from '../business/PipelineContext';
import { OrderRepository } from '../data/repositories/OrderRepository';

export class OrderController {
  constructor() {
    this.pipelineEngine = new PipelineEngine();
    this.orderRepo = new OrderRepository();
  }

  async processCheckout({ user, items, shippingAddress, paymentAdapter, shippingAdapter, promoCode }, onStepChange) {
    const context = new PipelineContext({
      user,
      items,
      shippingAddress,
      paymentAdapter,
      shippingAdapter,
      promoCode
    });

    return await this.pipelineEngine.execute(context, onStepChange);
  }

  getUserOrders(userId) {
    return this.orderRepo.getByUser(userId);
  }

  getAllOrders() {
    return this.orderRepo.getAll();
  }

  updateOrderStatus(orderId, status) {
    return this.orderRepo.updateStatus(orderId, status);
  }
}
