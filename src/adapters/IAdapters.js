// Adapter Pattern Interfaces
// Allows external Payment Gateways and Shipping Carriers to plug seamlessly into system business logic

export class IPaymentAdapter {
  processPayment(amount, paymentDetails) {
    throw new Error("Payment adapter must implement processPayment(amount, paymentDetails)");
  }

  getProviderName() {
    throw new Error("Payment adapter must implement getProviderName()");
  }
}

export class IShippingAdapter {
  calculateRate(destinationAddress, totalWeight) {
    throw new Error("Shipping adapter must implement calculateRate(destinationAddress, totalWeight)");
  }

  createShipment(orderId, destinationAddress) {
    throw new Error("Shipping adapter must implement createShipment(orderId, destinationAddress)");
  }

  getCarrierName() {
    throw new Error("Shipping adapter must implement getCarrierName()");
  }
}
