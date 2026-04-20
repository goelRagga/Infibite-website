import { Button } from '@/components/ui';
import { useSecurityDepositContext } from '@/contexts/SharedProvider';
import { refund, SecurityRefundDetails } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import { PaymentOptionsProps } from 'deposit-refund';
import { motion, useInView } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { Spinner } from '../../Spinner';
import PaymentStatus from './PaymentStatus';
import DeductionsDrawer from '../Refund/DamageDeductions';

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  getPaymentGatewayCheckoutCode,
  setIsOpen,
  handleRefund,
  refundResponseData,
  isProcessing,
}) => {
  const { isRefund, depositPaymentDetail } = useSecurityDepositContext();
  const depositStatus = depositPaymentDetail?.securityDepositStatus;
  const depositMode = depositPaymentDetail?.securityDepositMode;

  const buttonsRef = useRef(null);
  const isButtonsInView = useInView(buttonsRef, {
    once: true,
    margin: '-50px 0px',
    amount: 0.3,
  });

  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const refundStatus = depositPaymentDetail?.refund?.status === 'PENDING';

  const isPending = depositPaymentDetail?.refund?.status === 'PENDING';

  useEffect(() => {
    if (
      refundResponseData?.status === 'SETTLED' ||
      refundResponseData?.status === 'PROCESSED' ||
      refundResponseData?.status === 'PROCESSING'
    ) {
      setDrawerOpen(false);
    }
  }, [refundResponseData]);

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
  };

  const renderViewDetails = (isDrawerAction: boolean = false) => {
    if (isDrawerAction) return null;
    return (
      <>
        <Button
          size='lg'
          variant='outline'
          className='h-[40px] md:h-[38px] w-full text-xs md:text-sm border border-accent-red-900 text-accent-red-900 font-semibold rounded-lg px-3 md:px-4 py-2 hover:bg-accent-red-50 dark:hover:bg-[var(--brown9)] dark:border-accent-yellow-950 dark:border-1 dark:bg-[var(--grey8)] dark:text-accent-yellow-950'
          onClick={handleOpenDrawer}
        >
          View details
        </Button>
      </>
    );
  };

  const renderRefundButton = (
    label: string,
    onClick: () => void,
    isDrawerAction: boolean = false
  ) => {
    if (isDrawerAction) {
      return (
        <Button
          size='lg'
          className='border-accent-green-700 min-w-[180px] w-full sm:w-auto text-white bg-accent-green-700 rounded-full font-semibold hover:bg-accent-green-600'
          onClick={onClick}
        >
          {label}
        </Button>
      );
    }

    return (
      <Button
        size='lg'
        className='h-[40px] md:h-[38px] w-full text-xs md:text-sm border text-white font-semibold rounded-lg px-3 md:px-4 py-2 bg-accent-green-700 hover:bg-accent-green-600'
        onClick={onClick}
        // disabled={disabled || isProcessing}
      >
        {label}
      </Button>
    );
  };

  const renderRefundOptions = (
    depositPaymentDetail: any,
    isDrawerAction: boolean = false
  ) => {
    if (
      depositPaymentDetail?.refund?.deductedAmount === 0 &&
      depositPaymentDetail?.refund?.flow === 'REFUND_PAYMENT'
    ) {
      return (
        <div
          className={isDrawerAction ? 'flex flex-col items-center gap-2' : ''}
        >
          <p className='text-sm text-accent-green-700 font-medium py-3'>
            {refund.noDamage}
          </p>
          {renderRefundButton(
            'Get refund',
            () => setIsOpen(true),
            isDrawerAction
          )}
        </div>
      );
    }

    if (
      depositPaymentDetail?.refund?.amount >=
        depositPaymentDetail?.refund?.deductedAmount &&
      depositPaymentDetail?.refund?.flow === 'REFUND_PAYMENT'
    ) {
      if (isDrawerAction) {
        return (
          <div className='flex flex-col items-center gap-2'>
            {renderRefundButton(
              'Get Refund',
              () => {
                isDrawerOpen ? handleRefund() : setIsOpen(true);
              },
              isDrawerAction
            )}
          </div>
        );
      }

      return (
        <>
          <div className='flex flex-col md:flex-row gap-3 pt-4'>
            <div className='w-full md:w-1/2'>
              {renderViewDetails(isDrawerAction)}
            </div>

            <div className='w-full md:w-1/2'>
              {renderRefundButton(
                'Get Refund',
                () => {
                  isDrawerOpen ? handleRefund() : setIsOpen(true);
                },
                isDrawerAction
              )}
            </div>
          </div>
        </>
      );
    }

    if (depositPaymentDetail?.refund?.flow === 'COLLECT_PAYMENT') {
      if (isDrawerAction) {
        return (
          <div className='flex flex-col items-center gap-2'>
            {renderRefundButton(
              `Pay ₹${formatPrice(depositPaymentDetail?.refund?.totalAmount)}`,
              () => {
                getPaymentGatewayCheckoutCode('RAZORPAY');
              },
              isDrawerAction
            )}
          </div>
        );
      }

      return (
        <>
          <div className='flex flex-col md:flex-row gap-3 pt-4'>
            <div className='w-full md:w-1/2'>
              {renderViewDetails(isDrawerAction)}
            </div>

            <div className='w-full md:w-1/2'>
              {renderRefundButton(
                `Pay ₹${formatPrice(depositPaymentDetail?.refund?.totalAmount)}`,
                () => {
                  getPaymentGatewayCheckoutCode('RAZORPAY');
                },
                isDrawerAction
              )}
            </div>
          </div>
        </>
      );
    }

    if (depositPaymentDetail?.refund?.flow === 'SETTLE_PAYMENT') {
      if (isDrawerAction) {
        return (
          <div className='flex flex-col items-center gap-2'>
            {renderRefundButton(
              'Settle balance',
              () => {
                isDrawerOpen
                  ? handleRefund('DEDUCTION_COLLECTION')
                  : setIsOpen(true);
              },
              isDrawerAction
            )}
          </div>
        );
      }

      return (
        <>
          <div className='flex flex-col md:flex-row gap-3 pt-4'>
            <div className='w-full md:w-1/2'>
              {renderViewDetails(isDrawerAction)}
            </div>

            <div className='w-full md:w-1/2'>
              {renderRefundButton(
                'Settle balance',
                () => {
                  isDrawerOpen
                    ? handleRefund('DEDUCTION_COLLECTION')
                    : setIsOpen(true);
                },
                isDrawerAction
              )}
            </div>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div>
      {!isRefund ? (
        <div className='grid grid-cols-1 gap-4'>
          {depositPaymentDetail?.securityDepositMode ? (
            <>
              <div>
                <PaymentStatus
                  depositStatus={
                    depositPaymentDetail?.securityDepositStatus || ''
                  }
                  depositMode={depositPaymentDetail?.securityDepositMode}
                />
              </div>
              {depositStatus === 'PENDING' && depositMode === 'OFFLINE' && (
                <Button
                  variant='outline'
                  className='h-[52px] md:h-[38px] cursor-pointer w-full bg-accent-red-900 hover:bg-accent-red-950 hover:text-white text-sm border border-accent-red-900 text-primary-50 font-semibold rounded-lg px-4 py-4'
                  onClick={() => getPaymentGatewayCheckoutCode('RAZORPAY')}
                >
                  Pay online instead
                </Button>
              )}
            </>
          ) : (
            <div
              ref={buttonsRef}
              className='mt-6 flex md:grid md:grid-cols-1 gap-4 '
            >
              {/* <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={
                  isButtonsInView
                    ? {
                        opacity: 1,
                        y: 0,
                      }
                    : { opacity: 0, y: 10 }
                }
                transition={{
                  duration: 0.5,
                  ease: 'easeOut',
                  delay: 0.1,
                }}
              >
                <Button
                  variant='outline'
                  className='h-[52px] md:h-[38px] cursor-pointer w-full text-sm border border-accent-red-900 text-accent-red-900 font-semibold rounded-lg px-4 py-4 dark:hover:bg-[var(--brown9)] dark:border-accent-yellow-950 dark:border-1 dark:bg-[var(--grey8)] dark:text-accent-yellow-950'
                  onClick={() => setIsOpen(true)}
                >
                  Pay In Cash
                </Button>
              </motion.div> */}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isButtonsInView
                    ? {
                        opacity: 1,
                        y: 0,
                      }
                    : { opacity: 0, y: 20 }
                }
                transition={{
                  duration: 0.5,
                  ease: 'easeOut',
                  delay: 0.3,
                }}
              >
                <Button
                  variant='outline'
                  className='h-[52px] md:h-[38px] cursor-pointer w-full md:w-full bg-accent-red-900 hover:text-white text-sm border border-accent-red-900 text-primary-50 font-semibold rounded-lg px-4 py-4 hover:bg-accent-red-950 dark:bg-[var(--accent-background)] dark:border-accent-yellow-950 dark:text-white'
                  onClick={() => getPaymentGatewayCheckoutCode('RAZORPAY')}
                >
                  Online Payment
                </Button>
              </motion.div>
            </div>
          )}
        </div>
      ) : (
        <>
          {refundStatus ? (
            <>{renderRefundOptions(depositPaymentDetail, false)}</>
          ) : (
            <div className='flex flex-col gap-1.5'>
              <PaymentStatus />
              {depositPaymentDetail?.refund?.deductedAmount !== 0 &&
                renderViewDetails()}
            </div>
          )}
        </>
      )}

      <DeductionsDrawer
        open={isDrawerOpen}
        title='Deduction'
        content={SecurityRefundDetails?.content}
        drawerAction={
          isPending && renderRefundOptions(depositPaymentDetail, true)
        }
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default PaymentOptions;
