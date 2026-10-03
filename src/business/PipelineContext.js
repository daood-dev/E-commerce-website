// PipelineContext encapsulates the data payload that flows through the Pipe-and-Filter checkout pipeline

export class PipelineContext {
  constructor({ user, items, shippingAddress, paymentAdapter, shippingAdapter, promoCode }) {
    this.user = user;
    this.items = items || []; // [{ product_id, quantity, unit_price, product_name, image_url }]
    this.shippingAddress = shippingAddress;
    this.paymentAdapter = paymentAdapter;
    this.shippingAdapter = shippingAdapter;
    this.promoCode = promoCode || "";

    // Dynamically mutated by filters
    this.subtotal = 0;
    this.discountAmount = 0;
    this.taxAmount = 0;
    this.shippingFee = 0;
    this.totalAmount = 0;
    this.paymentResult = null;
    this.shipmentResult = null;
    this.orderRecord = null;
    this.notifications = [];
    
    // Status tracking for debugging / UI visualizer
    this.executionLog = [];
    this.isAborted = false;
    this.abortReason = null;
  }

  logStep(filterName, status, message, dataPayload = {}) {
    this.executionLog.push({
      step: filterName,
      status, // 'running' | 'passed' | 'failed'
      timestamp: new Date().toLocaleTimeString(),
      message,
      dataPayload
    });
  }

  abort(filterName, reason) {
    this.isAborted = true;
    this.abortReason = reason;
    this.logStep(filterName, "failed", `Pipeline Aborted: ${reason}`);
  }
}
