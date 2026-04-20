'use client';
import { useSecurityDepositContext } from '@/contexts/SharedProvider';
import useIsMobile from '@/hooks/useIsMobile';
import React, { useState } from 'react';
import ResponsiveDialogDrawer from '../../ResponsiveDialogDrawer';
import { DeductionsDrawerProps } from 'property-damage-types';
import DamageDetails from './DamageDetails';
import { Button } from '@/components/ui';

const DeductionsDrawer: React.FC<DeductionsDrawerProps> = ({
  open,
  title,
  content,
  className,
  onClose,
  drawerAction,
}) => {
  const [isProofsDrawerOpen, setIsProofsDrawerOpen] = useState<boolean>(false);
  const [viewDamage, setViewDamage] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [selectedDamage, setSelectedDamage] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const wordLimit = 10;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleProofsDrawerOpen = (damage: any) => {
    setSelectedDamage(damage);
    setIsProofsDrawerOpen(true);
    setViewDamage(true);
  };

  const handleProofsDrawerClose = () => {
    setIsProofsDrawerOpen(false);
  };

  const handleDrawerClose = () => {
    onClose();
    // setIsProofsDrawerOpen(false);
  };
  const { depositPaymentDetail } = useSecurityDepositContext();
  const isMobile = useIsMobile();
  return (
    <>
      <ResponsiveDialogDrawer
        open={open}
        setOpen={handleDrawerClose}
        title={title}
        contentClassName='sm:max-w-[792px]! sm:h-auto sm:max-h-[60dvh] max-h-[100dvh]! dark:bg-background border-none'
        footer={
          <>
            <div className='flex flex-col md:flex-row justify-center gap-3 pt-4'>
              {!isMobile && (
                <Button
                  size={'lg'}
                  className='border-accent-red-900 min-w-[180px] text-accent-red-900 rounded-full font-semibold dark:bg-background dark:text-[var(--accent-text)] dark:border-[var(--accent-text)]'
                  variant='outline'
                  color='secondary'
                  onClick={handleDrawerClose}
                >
                  Back
                </Button>
              )}
              <>{drawerAction}</>
            </div>
            <p className='text-xs text-foreground text-center mt-2 sm:mt-4'>
              By proceeding, I acknowledge that the mentioned damages were
              caused by me during my stay.
            </p>
          </>
        }
      >
        <div className='grid gap-4 text-xs/5 sm:text-sm h-full pb-6 max-h-max! sm:h-[60dvh] overflow-y-auto dark:px-4 py-0'>
          <div>
            <p className='text-xs mb-6 mt-3'>{content}</p>

            <div className='mt-6'>
              <DamageDetails depositPaymentDetail={depositPaymentDetail} />
            </div>
          </div>
        </div>
      </ResponsiveDialogDrawer>
    </>
  );
};

export default DeductionsDrawer;
