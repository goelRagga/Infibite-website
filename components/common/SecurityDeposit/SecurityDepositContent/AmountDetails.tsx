import { Separator } from '@/components/ui';
import { useSecurityDepositContext } from '@/contexts/SharedProvider';
import useIsMobile from '@/hooks/useIsMobile';
import { formatPrice } from '@/lib/utils';

const renderRefundAmount = (
  isPopup: boolean = false,
  refundDetails: any,
  isRefund?: boolean | null
) => {
  const amountLabel =
    refundDetails?.flow === 'COLLECT_PAYMENT' &&
    refundDetails?.status !== 'DECUCTIONS_COLLECTED'
      ? 'Amount to pay'
      : refundDetails?.status === 'DECUCTIONS_COLLECTED'
        ? 'Amount paid'
        : (isRefund && refundDetails?.status !== 'DECUCTIONS_COLLECTED') ||
            refundDetails?.flow === 'REFUND_PAYMENT'
          ? 'Refund amount'
          : 'Amount to pay';

  return (
    <div className='flex items-center justify-between mt-3'>
      <h6 className='text-base font-semibold text-foreground'>{amountLabel}</h6>
      <h6 className='text-base font-semibold text-foreground'>
        &#8377;{formatPrice(refundDetails?.totalAmount)}
      </h6>
    </div>
  );
};
const AmountDetails = () => {
  const { isRefund, depositPaymentDetail } = useSecurityDepositContext();
  const isMobile = useIsMobile();
  return (
    <>
      {!isRefund ? (
        <div className='space-y-4 text-sm'>
          <div className='flex justify-between '>
            <span className='text-muted-foreground dark:text-primary-100 font-semibold'>
              Amount&nbsp;
              <span className='text-accent-green-700 text-xs font-medium'>
                (REFUNDABLE)
              </span>
            </span>
            <span className='text-muted-foreground dark:text-primary-100 font-semibold '>
              {depositPaymentDetail?.securityDepositAmount ? (
                <>
                  <span className='text-xs line-through text-secondary-600 mr-1'>
                    &#8377;
                    {formatPrice(
                      depositPaymentDetail?.originalSecurityDepositAmount
                    )}
                  </span>
                  &#8377;{' '}
                  {formatPrice(depositPaymentDetail?.securityDepositAmount)}
                </>
              ) : (
                <>
                  &#8377;
                  {formatPrice(
                    depositPaymentDetail?.originalSecurityDepositAmount
                  )}
                </>
              )}
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className='space-y-4 text-sm mt-5'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground dark:text-primary-100 font-medium'>
                Amount paid&nbsp;
                <span className='text-accent-green-700 text-xs font-medium'>
                  (REFUNDABLE)
                </span>
              </span>
              <span className='text-muted-foreground dark:text-primary-100 font-medium'>
                &#8377;{formatPrice(depositPaymentDetail?.refund?.amount)}
              </span>
            </div>
          </div>
          <div className='space-y-4 text-sm mt-5'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground dark:text-primary-100 font-medium'>
                Damage deductions
              </span>
              <span className='text-[var(--red1)] dark:text-primary-100 font-medium'>
                - &#8377;
                {formatPrice(depositPaymentDetail?.refund?.deductedAmount)}
              </span>
            </div>
          </div>
          <Separator className='mt-3.5 border-t-1 dark:border-primary-800' />
          {renderRefundAmount(false, depositPaymentDetail?.refund, isRefund)}
        </>
      )}
    </>
  );
};

export { renderRefundAmount };
export default AmountDetails;
