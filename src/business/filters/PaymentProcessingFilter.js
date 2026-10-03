export class PaymentProcessingFilter {
  static get filterName() {
    return "4. Payment Processing Filter";
  }

  async process(context) {
    const providerName = context.paymentAdapter.getProviderName();
    context.logStep(
      PaymentProcessingFilter.filterName, 
      "running", 
      `Executing Payment Adapter strategy [${providerName}] for amount $${context.totalAmount}...`
    );

    try {
      const paymentResult = await context.paymentAdapter.processPayment(context.totalAmount, context.paymentDetails || {});
      
      if (!paymentResult.success) {
        context.abort(PaymentProcessingFilter.filterName, `Payment Failed: ${paymentResult.error}`);
        return false;
      }

      context.paymentResult = paymentResult;
      context.logStep(
        PaymentProcessingFilter.filterName,
        "passed",
        `Payment Authorized via ${paymentResult.provider}. Transaction ID: ${paymentResult.transactionId}`,
        { paymentResult }
      );
      return true;
    } catch (err) {
      context.abort(PaymentProcessingFilter.filterName, `Payment Adapter Error: ${err.message}`);
      return false;
    }
  }
}
