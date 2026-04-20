// src/utils/cashfree.ts
const loadCashfreeScript = () => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js'; // Ensure this URL is correct
    script.async = true;
    script.onload = () => {
      console.log('Cashfree script loaded successfully');
      resolve();
    };
    script.onerror = (event) => {
      console.log('Failed to load Cashfree script:', event);
      reject(new Error('Failed to load Cashfree script'));
    };
    document.body.appendChild(script);
  });
};

interface CashfreeOptions {
  paymentSessionId: string;
  callbackUrl: string;
  cashfreeMode?: any;
}

export const handleCashfreePayment = async ({
  paymentSessionId,
  callbackUrl,
  cashfreeMode,
}: CashfreeOptions) => {
  await loadCashfreeScript();

  const cashfree = (window as any).Cashfree({
    mode: cashfreeMode,
  });

  const checkoutOptions = {
    paymentSessionId: paymentSessionId,
    redirectTarget: '_modal',
  };

  cashfree.checkout(checkoutOptions).then((result: any) => {
    if (result.error) {
      // This will be true whenever user clicks on close icon inside the modal or any error happens during the payment
      console.log(
        'User has closed the popup or there is some payment error. Check for Payment Status',
        result.error
      );
      // window.location.href = callbackUrl;
    }
    if (result.redirect) {
      // This will be true when the payment redirection page couldn't be opened in the same window
      // This is an exceptional case only when the page is opened inside an inAppBrowser
      // In this case the customer will be redirected to return url once payment is completed
      console.log('Payment will be redirected');
    }
    if (result.paymentDetails) {
      // This will be called whenever the payment is completed irrespective of transaction status
      console.log(
        'Payment has been completed. Check for Payment Status',
        result.paymentDetails.paymentMessage
      );
      window.location.href = callbackUrl;
    }
  });
};
