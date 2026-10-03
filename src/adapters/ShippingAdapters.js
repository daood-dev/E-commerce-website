import { IShippingAdapter } from './IAdapters';

export class FedExShippingAdapter extends IShippingAdapter {
  getCarrierName() {
    return "FedEx Express (Priority Air)";
  }

  calculateRate(destinationAddress, totalWeight = 1) {
    return 15.00 + (totalWeight * 2.5);
  }

  async createShipment(orderId, destinationAddress) {
    await new Promise(resolve => setTimeout(resolve, 600));

    const trackingNumber = "FX" + Math.floor(100000000 + Math.random() * 900000000) + "US";
    return {
      carrier: "FedEx Express",
      trackingNumber,
      estimatedDeliveryDays: 2,
      status: "Label Created",
      labelUrl: `https://fedex.com/tracking/${trackingNumber}`
    };
  }
}

export class DHLShippingAdapter extends IShippingAdapter {
  getCarrierName() {
    return "DHL Express Worldwide";
  }

  calculateRate(destinationAddress, totalWeight = 1) {
    return 22.50 + (totalWeight * 3.0);
  }

  async createShipment(orderId, destinationAddress) {
    await new Promise(resolve => setTimeout(resolve, 750));

    const trackingNumber = "DHL" + Math.floor(1000000000 + Math.random() * 9000000000);
    return {
      carrier: "DHL Express",
      trackingNumber,
      estimatedDeliveryDays: 1,
      status: "Customs Manifest Prepared",
      labelUrl: `https://dhl.com/track/${trackingNumber}`
    };
  }
}

export class StandardPostalAdapter extends IShippingAdapter {
  getCarrierName() {
    return "Standard Postal Ground";
  }

  calculateRate(destinationAddress, totalWeight = 1) {
    return 5.99;
  }

  async createShipment(orderId, destinationAddress) {
    await new Promise(resolve => setTimeout(resolve, 500));

    const trackingNumber = "9400" + Math.floor(100000000000 + Math.random() * 900000000000);
    return {
      carrier: "Standard Postal Service",
      trackingNumber,
      estimatedDeliveryDays: 5,
      status: "Shipment Acceptance Pending",
      labelUrl: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`
    };
  }
}
