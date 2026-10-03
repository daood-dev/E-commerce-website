export class NotificationFilter {
  static get filterName() {
    return "7. Notification Filter";
  }

  async process(context) {
    context.logStep(NotificationFilter.filterName, "running", "Generating order receipt invoice and sending customer email notification...");
    await new Promise(resolve => setTimeout(resolve, 400));

    const notificationMsg = {
      type: "ORDER_CONFIRMATION",
      recipient: context.user.email,
      subject: `Order #${context.orderRecord.order_id} Confirmed!`,
      message: `Hi ${context.user.name}, thank you for your order! Your total was $${context.totalAmount}. Tracking #: ${context.shipmentResult?.trackingNumber}`,
      timestamp: new Date().toISOString()
    };

    context.notifications.push(notificationMsg);

    context.logStep(
      NotificationFilter.filterName,
      "passed",
      `Invoice dispatched to ${context.user.email}. Checkout Pipeline completed successfully!`,
      { notificationMsg }
    );
    return true;
  }
}
