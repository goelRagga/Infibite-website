import SdSuccess from '@/assets/bookingConfirmedCheck.svg';
import SdError from '@/assets/sdError.svg';
import { Button } from '@/components/ui/button';
import { useSecurityDepositContext } from '@/contexts/SharedProvider';
import { refund, securityDeposit } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { StatusProps } from 'deposit-refund';
import React from 'react';
import ResponsiveDialogDrawer from '@/components/common/ResponsiveDialogDrawer';

const SecurityPaymentStatus: React.FC<StatusProps> = ({
  isOpen,
  onClose,
  depositPaymentError,
  refundPaymentError,
  paymentDetails,
  isRefund,
}) => {
  const { depositPaymentDetail } = useSecurityDepositContext();
  const hasError = depositPaymentError || refundPaymentError;

  const getTitle = () => {
    if (isRefund && depositPaymentDetail?.refund?.status !== 'PENDING') {
      if (refundPaymentError) {
        return refund.refundStatus.failure.title;
      }

      switch (depositPaymentDetail?.refund?.flow) {
        case 'COLLECT_PAYMENT':
          return 'Balance Paid Successfully';
        case 'SETTLE_PAYMENT':
          return 'Amount Settled Successfully';
        default:
          return refund.refundStatus.success.title;
      }
    }

    return depositPaymentError
      ? securityDeposit.paymentStatus.deposit.failure.title
      : securityDeposit.paymentStatus.deposit.success.title;
  };

  const getDescription = () => {
    const amount = formatPrice(paymentDetails?.amount || '');

    if (isRefund && depositPaymentDetail?.refund?.status !== 'PENDING') {
      if (refundPaymentError) {
        return `Your refund of ₹ ${amount} ${refund.refundStatus.failure.caption}`;
      }

      switch (depositPaymentDetail?.refund?.flow) {
        case 'COLLECT_PAYMENT':
          return `You have successfully settled the balance amount of INR -${amount}. We hope to see you on your next stay soon.`;
        case 'SETTLE_PAYMENT':
          return `You have settled the amount of ₹ ${amount} successfully.`;
        default:
          return `Your refund of ₹ ${amount} ${refund.refundStatus.success.caption}`;
      }
    }

    return depositPaymentError
      ? securityDeposit.paymentStatus.deposit.failure.caption
      : `Your payment of ₹ ${amount} ${securityDeposit.paymentStatus.deposit.success.caption}`;
  };

  const getButtonVariant = () => {
    return hasError ? 'default' : 'outline';
  };

  const getButtonText = () => {
    return hasError ? 'Retry' : 'Continue';
  };

  return (
    <ResponsiveDialogDrawer
      open={isOpen}
      setOpen={onClose}
      contentClassName='max-w-[400px]!  max-h-[50dvh]!'
      footer={
        <div className='flex justify-center'>
          <Button
            size='lg'
            onClick={onClose}
            variant={getButtonVariant()}
            className='flex justify-center items-center rounded-full font-medium bg-primary-950 text-white px-8 dark:bg-[var(--accent-background)] dark:border-accent-yellow-950 dark:text-white'
          >
            {getButtonText()}
          </Button>
        </div>
      }
    >
      <div className='flex flex-col items-center justify-center gap-3  text-center'>
        <div>{hasError ? <SdError /> : <SdSuccess />}</div>

        {/* {!hasError && isRefund && (
          <div className='text-xl md:text-2xl font-semibold text-accent-green-700 mt-1'>
            ₹ {formatPrice(paymentDetails?.amount || '')}
          </div>
        )} */}

        <h2 className={`text-lg md:text-xl `}>{getTitle()}</h2>

        <p className='text-sm  leading-relaxed max-w-sm'>{getDescription()}</p>
      </div>
    </ResponsiveDialogDrawer>
  );
};

export default SecurityPaymentStatus;
