import { IPaymentAdapter } from './IAdapters';

export class StripePaymentAdapter extends IPaymentAdapter {
  getProviderName() {
    return "Stripe Credit Card (Visa/MC/Amex)";
  }

  async processPayment(amount, paymentDetails) {
    // Simulate API call to Stripe Gateway
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (paymentDetails?.cardNumber && paymentDetails.cardNumber.endsWith("0000")) {
      return {
        success: false,
        error: "Stripe declined card: Test card ending in 0000 triggered simulated decline."
      };
    }

    const transactionId = "ch_stripe_" + Math.random().toString(36).substring(2, 11);
    return {
      success: true,
      provider: "Stripe",
      transactionId,
      amountAuthorized: amount,
      timestamp: new Date().toISOString(),
      receiptUrl: `https://stripe.com/receipts/${transactionId}`
    };
  }
}

export class PayPalPaymentAdapter extends IPaymentAdapter {
  getProviderName() {
    return "PayPal Express Checkout";
  }

  async processPayment(amount, paymentDetails) {
    await new Promise(resolve => setTimeout(resolve, 900));

    const transactionId = "PAYID-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    return {
      success: true,
      provider: "PayPal",
      transactionId,
      amountAuthorized: amount,
      payerEmail: paymentDetails?.paypalEmail || "customer@paypal-user.com",
      timestamp: new Date().toISOString()
    };
  }
}

export class CryptoPaymentAdapter extends IPaymentAdapter {
  getProviderName() {
    return "Web3 Crypto (USDC / ETH)";
  }

  async processPayment(amount, paymentDetails) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const txHash = "0x" + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('');
    return {
      success: true,
      provider: "CryptoWeb3",
      transactionId: txHash,
      network: "Ethereum Mainnet",
      amountAuthorized: amount,
      timestamp: new Date().toISOString()
    };
  }
}

export class CashOnDeliveryAdapter extends IPaymentAdapter {
  getProviderName() {
    return "Cash on Delivery (COD)";
  }

  async processPayment(amount, paymentDetails) {
    await new Promise(resolve => setTimeout(resolve, 400));

    const transactionId = "COD-VERIFIED-" + Math.floor(100000 + Math.random() * 900000);
    return {
      success: true,
      provider: "CashOnDelivery",
      transactionId,
      amountAuthorized: amount,
      note: "Payment to be collected upon physical package delivery",
      timestamp: new Date().toISOString()
    };
  }
}
