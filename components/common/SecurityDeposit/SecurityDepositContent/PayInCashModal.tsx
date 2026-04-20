'use client';

import React, { useState } from 'react';
import ResponsiveDialogDrawer from '../../ResponsiveDialogDrawer';
import { Button } from '@/components/ui';
import Link from 'next/link';
import { SecurityDepositProps } from 'deposit-refund';
import { useSecurityDepositContext } from '@/contexts/SharedProvider';
import { refund } from '@/lib/constants';
import { renderRefundAmount } from './AmountDetails';
import useIsMobile from '@/hooks/useIsMobile';

const PayInCash: React.FC<SecurityDepositProps> = ({
  isOpen,
  setIsOpen,
  renderAmountDisplay,
  renderTerms,
  handlePaymentClick,
  handleRefund,
  isProcessing,
}) => {
  const { isRefund, depositPaymentDetail } = useSecurityDepositContext();

  const handleCancel = () => {
    setIsOpen(false);
  };

  const renderFooterActions = () => {
    return (
      <>
        <div className='flex sm:justify-center justify-between justify-center gap-2'>
          <Button
            size={'lg'}
            className='border-accent-red-900 min-w-[170px] text-accent-red-900 rounded-full font-semibold dark:bg-background dark:text-[var(--accent-text)] dark:border-[var(--accent-text)]'
            variant='outline'
            color='secondary'
            onClick={handleCancel}
          >
            Back
          </Button>
          <Button
            size={'lg'}
            className='border-accent-red-900 min-w-[170px] bg-accent-red-900 hover:bg-accent-red-950 text-white rounded-full font-semibold dark:bg-[var(--accent-background)] dark:border-accent-yellow-950 dark:text-white'
            variant='secondary'
            color='primary'
            onClick={() =>
              isRefund &&
              depositPaymentDetail?.refund?.flow === 'COLLECT_PAYMENT'
                ? handlePaymentClick('DEDUCTION_COLLECTION')
                : isRefund
                  ? handleRefund()
                  : handlePaymentClick('OFFLINE')
            }
            // disabled={!isRefund || isProcessing}
          >
            {isRefund ? 'Proceed' : 'Confirm'}
          </Button>
        </div>
        <p className='text-xs text-foreground text-center mt-2 sm:mt-3'>
          By proceeding you agree to our{' '}
          <Link
            href='/explore/privacy-policy'
            className='text-accent-red-900 dark:text-[var(--prive2)]'
          >
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link
            href='/explore/terms-and-conditions'
            className='text-accent-red-900 dark:text-[var(--prive2)]'
          >
            T&C.
          </Link>
        </p>
      </>
    );
  };

  const renderPayInCashContent = () => (
    <div>
      <div>
        <p className='text-xs mb-6'>
          Do you want to pay the{' '}
          <span className='font-semibold'>“Security Deposit”</span> in cash
          during check-in?
        </p>
        <div className='rounded-lg border border-primary-100 py-4 px-4 bg-white text-sm font-semibold dark:bg-[var(--prive1)] dark:border-primary-800'>
          {renderAmountDisplay()}
        </div>
      </div>
      <div className='grid sm:text-sm h-full text-primary-800 space-y-3 mt-6'>
        <p className='text-xs font-semibold dark:text-[var(--prive6)]'>
          Instructions on where and when to pay
        </p>
        <ol className='list-disc pl-5 space-y-2 text-xs space-y-3 dark:text-primary-100'>
          <li>Pay at the Villa on check-in date</li>
          <li>An executive will be assigned to collect the cash</li>
          <li>
            Your cash payment will reflect on the system within 24 hours payment
            collection by our executives
          </li>
        </ol>
      </div>
    </div>
  );

  const renderRefundContent = () => {
    return (
      <div>
        <div>
          {depositPaymentDetail?.refund?.totalAmount === 0 ? (
            <p className='text-xs mb-6'>
              Do you want to
              <span className='font-semibold'>&nbsp;“Settle balance”</span>?
            </p>
          ) : (
            <div className='flex flex-col gap-2'>
              <p className='text-sm font-semibold'>
                Do you wish to continue with the refund process?
              </p>
              <p className='text-xs mb-6 font-base'>
                Your refund is on its way! It may take 3–5 business days to
                appear in your bank account.
              </p>
            </div>
          )}

          <div className='rounded-lg border border-primary-100 pb-3 px-4 bg-white text-sm font-semibold dark:bg-[var(--prive1)] dark:border-primary-800'>
            {/* {depositPaymentDetail?.refund?.totalAmount === 0
              ? refund.refundStatus.settle.proceedSettlement
              : refund.refundProcessing} */}
            {renderRefundAmount(true, depositPaymentDetail?.refund, isRefund)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <ResponsiveDialogDrawer
      open={isOpen}
      setOpen={setIsOpen}
      title={
        isRefund
          ? depositPaymentDetail?.refund?.totalAmount === 0
            ? 'Security Deposit - Settle balance'
            : 'Security Deposit - Refund'
          : 'Security Deposit - Cash Payment'
      }
      contentClassName='sm:max-w-[792px]! sm:h-auto h-[500px] dark:bg-background border-none'
      footer={renderFooterActions()}
    >
      {isRefund ? renderRefundContent() : renderPayInCashContent()}
    </ResponsiveDialogDrawer>
  );
};

export default PayInCash;
