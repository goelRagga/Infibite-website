'use client';
import { handleCashfreePayment } from '@/lib/cashfree';
import { OUTSTANDING_PAYMENT, VERIFY_PAYMENT } from '@/lib/queries';
import { handleRazorPayPayment } from '@/lib/razorpay';
import { getQueryParam } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { useClient } from 'urql';

export function usePayRemainingAmount() {
  const client = useClient();
  const [isverifyDetail, setVerifyDetail] = useState<any>();
  const [isverifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [isRemaningPaymentDetail, setRemaningPaymentDetail] = useState<any>('');
  const [error, setError] = useState<any>(null);

  const cashfreeMode = process?.env?.CASHFREE_MODE;
  const razorpayKey = process.env.RAZORPAY_KEY;

  // Main method to call for payment

  const payRemaining = useCallback(
    async (bookingId: string) => {
      setError(null);
      try {
        const result = await client
          .mutation(OUTSTANDING_PAYMENT, { bookingId })
          .toPromise();

        if (result.error) {
          throw result.error;
        }

        const data = result.data?.outstandingPayment;
        setRemaningPaymentDetail(data);

        // Payment gateway logic
        if (data?.paymentGateway === 'CASHFREE') {
          handleCashfreePayment({
            paymentSessionId: data?.paymentGatewayCheckoutCode,
            callbackUrl: `/booking_confirm/${bookingId}?paymentId=${data?.id}`,
            cashfreeMode,
          });
        } else if (data?.paymentGateway === 'RAZORPAY') {
          handleRazorPayPayment({
            orderId: data?.paymentGatewayCheckoutCode,
            reservationsId: data?.id,
            razorpayKey,
          });
        }
      } catch (error) {
        setError(error);
        console.error('Outstanding payment error:', error);
      }
    },
    [client, cashfreeMode, razorpayKey]
  );

  // Payment verification logic (optional, can be exposed if needed)
  const paymentId = getQueryParam('paymentId');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const result = await client
          .query(VERIFY_PAYMENT, { paymentId })
          .toPromise();

        if (result.error) {
          console.error('Verify payment error:', result.error);
          setVerifyLoading(false);
          return;
        }

        setVerifyDetail(result.data?.verifyPayment);
      } catch (error) {
        console.error('Unexpected error in verifyPayment:', error);
      } finally {
        setVerifyLoading(false);
      }
    };

    if (paymentId) {
      setVerifyLoading(true);
      verifyPayment();
    }
  }, [paymentId, client]);

  useEffect(() => {
    if (isverifyDetail?.status && isverifyDetail?.bookingId) {
      window.location.href = `/booking_confirm/${isverifyDetail?.bookingId}?status=${isverifyDetail?.status}`;
    }
  }, [isverifyDetail]);

  return {
    payRemaining,
    isverifyLoading,
    error,
    isRemaningPaymentDetail,
    isverifyDetail,
  };
}
