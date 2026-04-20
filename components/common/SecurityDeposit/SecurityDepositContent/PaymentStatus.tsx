import { useSecurityDepositContext } from '@/contexts/SharedProvider';
import { DepositMode, DepositStatus, refund } from '@/lib/constants';
import { RenderDepositStatusProps } from 'deposit-refund';
import { CheckCircle } from 'lucide-react';
import React from 'react';

const PaymentStatus: React.FC<RenderDepositStatusProps> = ({
  depositStatus,
  depositMode,
}) => {
  const { depositPaymentDetail } = useSecurityDepositContext();

  const statusTextClassName =
    'flex items-center gap-2 justify-center text-sm text-accent-green-700 mt-4 font-semibold text-justify';

  const refundStatusType = depositPaymentDetail?.refund?.status;
  if (
    depositStatus === DepositStatus.PENDING &&
    depositMode === DepositMode.OFFLINE
  ) {
    return (
      <>
        <p className={statusTextClassName}>
          Requested to Pay in cash during check-in
        </p>
      </>
    );
  }

  if (depositStatus === DepositStatus.PAID) {
    if (depositMode === DepositMode.ONLINE) {
      return (
        <div className='rounded-xl bg-[var(--green1)] dark:bg-[#152925] px-4 py-3 mt-4'>
          <p className='text-sm font-semibold text-accent-green-700 '>
            Paid Online
          </p>
          <p className='text-sm text-accent-red-950 dark:text-white font-base mt-2'>
            Your refund will be available for collection here once your stay has
            concluded.
          </p>
        </div>
      );
    }

    return (
      <p className={statusTextClassName}>
        <CheckCircle className='h-4 w-4' strokeWidth={3} /> Paid in cash
      </p>
    );
  }

  if (refundStatusType === 'PROCESSED') {
    return (
      <>
        {depositPaymentDetail?.refund?.deductedAmount === 0 && (
          <p className={statusTextClassName}>{refund.noDamage}</p>
        )}

        <p className={`mb-2 ${statusTextClassName}`}>
          <CheckCircle className='h-4 w-4' strokeWidth={3} /> Refunded
        </p>
      </>
    );
  }
  if (
    refundStatusType === 'DECUCTIONS_COLLECTED' ||
    refundStatusType === 'SETTLED'
  ) {
    return (
      <>
        <p className={statusTextClassName}>
          <CheckCircle className='h-4 w-4' strokeWidth={3} />
          {refundStatusType === 'SETTLED' ? 'Settled' : 'Paid'}
        </p>
      </>
    );
  }

  if (
    depositPaymentDetail?.refund?.flow === 'REFUND_PAYMENT' &&
    depositPaymentDetail?.refund?.status === 'PROCESSING'
  ) {
    return (
      <>
        <p className={statusTextClassName}>
          Refund {refund.refundStatus.success.caption}
        </p>

        <div className='p-1 bg-orange-200'>
          <p className='text-sm text-accent-green-700 mt-6'>
            Refund Processing
          </p>
        </div>
      </>
    );
  }

  return null;
};

export default PaymentStatus;
