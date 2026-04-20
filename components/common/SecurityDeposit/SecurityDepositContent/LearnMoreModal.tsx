import React, { useMemo } from 'react';
import ResponsiveDialogDrawer from '../../ResponsiveDialogDrawer';

const LearnMore = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) => {
  const SDMessage = useMemo(
    () =>
      'Any damages caused by the guest will be subject to charge penalty from this amount. Any damages caused by the guest will be subject to charge penalty from this amount.',
    []
  );

  return (
    <ResponsiveDialogDrawer
      contentClassName='sm:max-w-[792px]! dark:bg-background border-none'
      open={open}
      setOpen={setOpen}
      title='Security Deposit'
    >
      <div className='grid gap-4 text-xs/5 sm:text-sm h-full pb-6 max-h-max! sm:h-[40dvh] overflow-y-auto dark:px-4 py-0'>
        <div className='prose prose-sm max-w-none'>
          <h4 className='text-lg font-semibold mb-3'>Security Deposit Terms</h4>
          <p className='mb-4'>{SDMessage}</p>

          <h5 className='text-md font-semibold mb-2'>Important Information:</h5>
          <ul className='list-disc pl-5 space-y-2'>
            <li>The security deposit is fully refundable upon check-out</li>
            <li>
              Any damages or additional charges will be deducted from this
              amount
            </li>
            <li>Refunds are processed within 3-5 business days</li>
            <li>Payment can be made online or in cash during check-in</li>
          </ul>
        </div>
      </div>
    </ResponsiveDialogDrawer>
  );
};

export default LearnMore;
