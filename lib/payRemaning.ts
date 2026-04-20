'use client';
import { handleCashfreePayment } from '@/lib/cashfree';
import { OUTSTANDING_PAYMENT, VERIFY_PAYMENT } from '@/lib/queries';
import { handleRazorPayPayment } from '@/lib/razorpay';
import { getQueryParam } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { useClient } from 'urql';
import Cookies from 'js-cookie';

export function usePayRemainingAmount() {
  const client = useClient();
  const [isverifyDetail, setVerifyDetail] = useState<any>();
  const [isverifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [isRemaningPaymentDetail, setRemaningPaymentDetail] = useState<any>('');
  const [error, setError] = useState<any>(null);
  const isCorporateChannel = Cookies.get('isCorporateChannel');

  const cashfreeMode = process?.env?.CASHFREE_MODE;
  const razorpayKey = process.env.RAZORPAY_KEY;

  // Main method to call for payment
  const payRemaining = useCallback(
    async (bookingId: string) => {
      setError(null);
      try {
        const result = await client
          .mutation(
            OUTSTANDING_PAYMENT,
            { bookingId },
            {
              fetchOptions: {
                headers: {
                  'Channel-Id': isCorporateChannel
                    ? isCorporateChannel
                    : process.env.NEXT_PUBLIC_CHANNEL_ID || '',
                },
              },
            }
          )
          .toPromise();

        if (result.error) {
          throw result.error;
        }

        setRemaningPaymentDetail(result.data?.outstandingPayment ?? null);

        // Payment gateway logic
        if (result.data?.outstandingPayment?.paymentGateway === 'CASHFREE') {
          handleCashfreePayment({
            paymentSessionId:
              result.data?.outstandingPayment?.paymentGatewayCheckoutCode,
            callbackUrl: `/booking_confirm/${bookingId}?paymentId=${result.data?.outstandingPayment?.id}`,
            cashfreeMode,
          });
        } else if (
          result.data?.outstandingPayment?.paymentGateway === 'RAZORPAY'
        ) {
          handleRazorPayPayment({
            orderId:
              result.data?.outstandingPayment?.paymentGatewayCheckoutCode,
            reservationsId: result.data?.outstandingPayment?.id,
            razorpayKey,
          });
        }
      } catch (error) {
        setError(error);
        console.error('Error in payRemaining:', error);
      }
    },
    [client, cashfreeMode, razorpayKey]
  );

  // Payment verification logic (optional, can be exposed if needed)
  const paymentId = getQueryParam('paymentId');
  useEffect(() => {
    const verifyPayment = async () => {
      setVerifyLoading(true);
      try {
        const result = await client
          .query(
            VERIFY_PAYMENT,
            { paymentId },
            { requestPolicy: 'network-only' }
          )
          .toPromise();

        if (result.error) {
          throw result.error;
        }

        setVerifyDetail(result.data?.verifyPayment ?? null);
      } catch (error) {
        console.error('Error verifying payment:', error);
        // optionally: handle custom error state
      } finally {
        setVerifyLoading(false);
      }
    };

    if (paymentId) {
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
