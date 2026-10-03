import { OrderRepository } from '../../data/repositories/OrderRepository';

export class ShippingProcessingFilter {
  static get filterName() {
    return "6. Shipping Processing Filter";
  }

  async process(context) {
    const carrierName = context.shippingAdapter.getCarrierName();
    context.logStep(
      ShippingProcessingFilter.filterName,
      "running",
      `Executing Shipping Adapter strategy [${carrierName}] to dispatch order ${context.orderRecord?.order_id}...`
    );

    try {
      const shipment = await context.shippingAdapter.createShipment(
        context.orderRecord.order_id,
        context.shippingAddress
      );

      context.shipmentResult = shipment;

      // Update order with shipping details
      const orderRepo = new OrderRepository();
      orderRepo.update(context.orderRecord.order_id, {
        shipment: shipment,
        status: "Processing"
      });

      context.logStep(
        ShippingProcessingFilter.filterName,
        "passed",
        `Shipment created with ${shipment.carrier}. Tracking Number: ${shipment.trackingNumber}`,
        { shipment }
      );
      return true;
    } catch (err) {
      context.abort(ShippingProcessingFilter.filterName, `Shipping Adapter Failure: ${err.message}`);
      return false;
    }
  }
}
