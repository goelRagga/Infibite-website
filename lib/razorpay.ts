// src/utils/razorpay.ts

import { trackEvent } from './mixpanel';

const loadRazorpayScript = () => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      trackEvent('payment_page_viewed');
      resolve();
    };
    script.onerror = () => {
      console.log('Failed to load Razorpay script');
      reject(new Error('Failed to load Razorpay script'));
    };
    document.body.appendChild(script);
  });
};

interface RazorpayOptions {
  orderId: string;
  reservationsId: string;
  razorpayKey: any;
  type?: string;
  handleSuccess?: (orderId: string, reservationsId: string) => void;
}

export const handleRazorPayPayment = async ({
  orderId,
  reservationsId,
  razorpayKey,
  type = 'DEFAULT',
  handleSuccess = (orderId: string, reservationsId: string) => {},
}: RazorpayOptions) => {
  await loadRazorpayScript();
  const options = {
    // key: 'rzp_test_8euGYtcxqjANa7', // Replace with your Razorpay key
    key: razorpayKey, // Replace with your Razorpay key
    order_id: orderId,
    // callback_url: callbackUrl,
    notes: {
      address: 'Razorpay Corporate Office',
    },
    theme: {
      color: '#000',
    },
    handler: (response: any) => {
      // Function called when payment is successful
      if (type == 'DEFAULT') {
        const currentUrl = new URL(window.location.href);

        const newUrl = `/booking_confirm/${reservationsId}`;

        // currentUrl.searchParams.set('paymentId', reservationsId);
        // window.location.href = currentUrl.toString(); // Redirect to the updated URL
        window.location.href = newUrl;
      } else if (type == 'SECURITY_DEPOSIT') {
        handleSuccess(orderId, reservationsId);
        //Do whatever to do after success for security deposit
      }
    },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
};
