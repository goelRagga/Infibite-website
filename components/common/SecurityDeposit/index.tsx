import { Button, Separator } from '@/components/ui';
import { Badge } from '@/components/ui/badge';
import { useSecurityDepositContext } from '@/contexts/SharedProvider';
import {
  COLLECT_PAYMENT_MUTATION,
  REFUND_MUTATION,
  VERIFY_PAYMENT,
} from '@/lib/queries';
import { handleRazorPayPayment } from '@/lib/razorpay';
import { cn } from '@/lib/utils';
import { SecurityDepositCardProps } from 'deposit-refund';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { useClient } from 'urql';
import AmountDetails from './SecurityDepositContent/AmountDetails';
import LearnMore from './SecurityDepositContent/LearnMoreModal';
import PayInCash from './SecurityDepositContent/PayInCashModal';
import PaymentOptions from './SecurityDepositContent/PaymentOptions';
import SecurityPaymentStatus from './SecurityDepositContent/SecurityPaymentStatus';

const SECURITY_DEPOSIT_CONSTANTS = {
  defaultAmount: '20,000',
  displayAmount: '28,000',
  damageDeduction: '0',
  labels: {
    title: 'Security Deposit',
    refundableTag: '(REFUNDABLE)',
    damageDeductions: 'Damage Deductions',
    amount: 'Amount',
    learnMore: 'Learn More',
    onlinePayment: 'Online Payment',
    cashPayment: 'Pay In Cash',
    back: 'Back',
    confirm: 'Confirm',
    instructionsTitle: 'Instructions on where and when to pay',
    cashModalTitle: 'Security Deposit - Cash Payment',
    modalTitle: 'Security Deposit',
  },
  messages: {
    sdMessage:
      'Any damages caused by the guest will be subject to charge penalty from this amount. Any damages caused by the guest will be subject to charge penalty from this amount.',
    cashModalInfo:
      'Do you want to pay the Security Deposit in cash during check-in?',
    learnMoreModalHeading: 'Security Deposit Terms',
    learnMoreImportantHeading: 'Important Information:',
    privacyAgreement: 'By proceeding you agree to our Privacy Policy and T&C.',
  },
  listItems: {
    learnMore: [
      'The security deposit is fully refundable upon check-out',
      'Any damages or additional charges will be deducted from this amount',
      'Refunds are processed within 3-5 business days',
      'Payment can be made online or in cash during check-in',
    ],
    cashInstructions: [
      'Pay at the Villa on check-in date',
      'An executive will be assigned to collect the cash',
      'Your cash payment will reflect on the system within 24 hours payment collection by our executives',
    ],
  },
};

const SecurityDepositSection: React.FC<SecurityDepositCardProps> = ({
  className,
  bookingId,
  getSecurityDepositDetail,
}) => {
  const router = useRouter();
  const [viewMoreModalOpen, setViewMoreModalOpen] = useState(false);
  const { depositPaymentDetail, isRefund, setIsRefund, setLoading } =
    useSecurityDepositContext();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const client = useClient();
  const paymentGateway = process.env.PAYMENT_GATEWAY
    ? process.env.PAYMENT_GATEWAY
    : 'RAZORPAY';

  const depositAmount = depositPaymentDetail?.refund?.totalAmount;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [collectPaymentsData, setCollectPaymentsData] = useState<any>();
  const [paymentError, setPaymentError] = useState<boolean>(false);
  const [refundError, setRefundError] = useState<boolean>(false);
  const [refundResponseData, setRefundResponseData] = useState<any>();
  const [paymentStatusDialog, setPaymentStatusDialog] =
    useState<boolean>(false);
  const [isverifyDetail, setVerifyDetail] = useState<any>();
  const [isverifyLoading, setVerifyLoading] = useState<boolean>(false);

  const { labels, messages } = SECURITY_DEPOSIT_CONSTANTS;

  const razorpayKey = process.env.RAZORPAY_KEY;
  const paymentID = collectPaymentsData?.id;

  const handleViewMore = useCallback(() => {
    setViewMoreModalOpen(true);
  }, []);

  const handlePaymentStatusClose = () => {
    setPaymentStatusDialog(false);
  };

  const getPaymentGatewayCheckoutCode = async (paymentGatewayType: string) => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);

      const result = await client
        .mutation(COLLECT_PAYMENT_MUTATION, {
          paymentGateway:
            paymentGatewayType === 'OFFLINE' ? 'OFFLINE' : paymentGateway,
          bookingId,
          type:
            depositPaymentDetail?.refund?.flow === 'COLLECT_PAYMENT'
              ? 'DEDUCTION_COLLECTION'
              : 'SECURITY_DEPOSIT',
          amount:
            depositPaymentDetail?.refund?.flow === 'COLLECT_PAYMENT'
              ? Math.abs(depositAmount)
              : undefined,
        })
        .toPromise();

      if (result.error) {
        throw result.error;
      }

      setCollectPaymentsData(result.data?.collectPayments);

      if (result.data?.collectPayments?.paymentGateway === 'OFFLINE') {
        getSecurityDepositDetail();
      }

      setLoading(false);
      setPaymentError(false);
    } catch (error) {
      setLoading(false);
      setPaymentError(true);
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getRefundMutation = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const result = await client
        .mutation(REFUND_MUTATION, { bookingId })
        .toPromise();

      if (result.error) {
        console.error('GraphQL Error:', result.error);
        setRefundError(true);
        return;
      }

      const refundData = result.data?.refund;
      setRefundResponseData(refundData);

      if (
        refundData?.status === 'PROCESSED' ||
        refundData?.status === 'SETTLED'
      ) {
        setPaymentStatusDialog(true);
      }

      if (refundData?.status === 'FAILED') {
        setRefundError(true);
      }

      setLoading(false);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (
    orderId: string,
    reservationsId: string
  ) => {
    try {
      setVerifyLoading(true);

      const result = await client
        .query(
          VERIFY_PAYMENT,
          { paymentId: paymentID },
          { requestPolicy: 'network-only' }
        )
        .toPromise();

      if (result.error) {
        console.error('Verify payment error:', result.error);
        setPaymentError(true);
        return;
      }

      const verifyPaymentData = result.data;
      const paymentStatus = verifyPaymentData?.verifyPayment?.status;

      if (paymentStatus === 'CAPTURED') {
        setPaymentStatusDialog(true);
        getSecurityDepositDetail();
      } else {
        setPaymentError(true);
      }

      setVerifyDetail(verifyPaymentData?.verifyPayment);
      setRefundResponseData(verifyPaymentData?.verifyPayment);
    } catch (error) {
      console.error('Unexpected error:', error);
      setPaymentError(true);
    } finally {
      setVerifyLoading(false);
    }
  };

  useEffect(() => {
    if (collectPaymentsData?.paymentGateway === 'RAZORPAY') {
      handleRazorPayPayment({
        orderId: collectPaymentsData?.paymentGatewayCheckoutCode,
        reservationsId: collectPaymentsData?.id,
        razorpayKey,
        type: 'SECURITY_DEPOSIT',
        handleSuccess: (orderId: string, reservationsId: string) =>
          handlePaymentSuccess(orderId, reservationsId),
      });
    }
  }, [collectPaymentsData]);

  useEffect(() => {
    if (depositPaymentDetail?.refund !== null) {
      setIsRefund(true);
    } else {
      setIsRefund(false);
    }
  }, [depositPaymentDetail]);

  useEffect(() => {
    if (
      collectPaymentsData?.paymentGateway === 'OFFLINE' &&
      collectPaymentsData?.status === 'CREATED'
    ) {
      getSecurityDepositDetail();
      setIsOpen(false);
    }
  }, [collectPaymentsData]);

  useEffect(() => {
    const allowedStatuses = ['SETTLED', 'PROCESSED', 'PROCESSING'];

    if (allowedStatuses.includes(refundResponseData?.status)) {
      getSecurityDepositDetail();
      setIsOpen(false);
    }
  }, [refundResponseData]);

  useEffect(() => {
    if (refundResponseData?.cashgram?.url) {
      router.push(refundResponseData?.cashgram?.url);
    }
  }, [refundResponseData]);

  return (
    <div
      className={cn(
        'rounded-2xl md:border md:border-primary-100 border overflow-hidden bg-card md:bg-white relative z-10 px-4 md:px-6 py-6 dark:bg-[var(--black5)]! dark:border-secondary-950',
        className
      )}
    >
      {/* {SD HEADER} */}
      <div className='flex items-center justify-between'>
        <h3 className='text-xl text-foreground font-serif'>{labels.title}</h3>

        {/* PENDING CHIP */}
        {!isRefund && depositPaymentDetail?.securityDepositStatus && (
          <span className='relative'>
            {depositPaymentDetail.securityDepositStatus === 'PENDING' && (
              <span className='absolute inline-flex h-full w-15 left-2 animate-ping rounded-full bg-[var(--red1)] opacity-20'></span>
            )}
            <Badge
              className={cn(
                'text-white relative text-xs font-semibold rounded-2xl px-3 py-2 uppercase',
                depositPaymentDetail.securityDepositStatus === 'PAID' &&
                  'bg-accent-green-700',
                depositPaymentDetail.securityDepositStatus === 'PENDING' &&
                  'bg-[var(--red1)]'
              )}
            >
              {depositPaymentDetail.securityDepositStatus}
            </Badge>
          </span>
        )}
      </div>

      <div className='mt-6'>
        <p className='text-sm text-foreground line-clamp-2'>
          {messages.sdMessage}
        </p>
        <Button
          variant='link'
          className='text-accent-red-900 p-0 font-semibold underline hover:no-underline dark:text-[var(--prive2)]'
          onClick={handleViewMore}
        >
          {labels.learnMore}
        </Button>
        {/* AMOUNT DETAILS */}
        <div className='mt-3.5 border-t-1 pt-3 w-full dark:border-primary-800'>
          <AmountDetails />
        </div>{' '}
        <Separator className='mt-3.5 border-t-1 dark:border-primary-800' />
        {/* PAYMENT TERMS */}
        <PaymentOptions
          getPaymentGatewayCheckoutCode={getPaymentGatewayCheckoutCode}
          handleRefund={getRefundMutation}
          setIsOpen={setIsOpen}
          refundResponseData={refundResponseData}
          isProcessing={isProcessing}
        />
      </div>

      {/* Learn More Modal */}
      <LearnMore open={viewMoreModalOpen} setOpen={setViewMoreModalOpen} />

      {/* Cash Payment Modal */}
      <PayInCash
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        renderAmountDisplay={() => <AmountDetails />}
        handlePaymentClick={getPaymentGatewayCheckoutCode}
        handleRefund={getRefundMutation}
        isProcessing={isProcessing}
      />

      {paymentStatusDialog && (
        <SecurityPaymentStatus
          isOpen={paymentStatusDialog}
          onClose={handlePaymentStatusClose}
          depositPaymentError={paymentError}
          paymentDetails={
            isRefund && depositPaymentDetail?.refund?.status !== 'PENDING'
              ? refundResponseData
              : isverifyDetail
          }
          refundPaymentError={refundError}
          isRefund={isRefund}
        />
      )}
    </div>
  );
};

export default SecurityDepositSection;
