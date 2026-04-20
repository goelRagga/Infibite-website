'use client';

import React, { useState } from 'react';
import Svg from '../Shared/Svg';
import { ElicashCardProps } from 'elicash-card';
import useIsMobile from '@/hooks/useIsMobile';
import ResponsiveDialogDrawer from '../ResponsiveDialogDrawer';
import { Button } from '@/components/ui';
import ElicashIcon from '@/assets/elicash.svg';

const ElicashCard: React.FC<ElicashCardProps> = ({ className }) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className={`cursor-pointer flex items-center justify-between rounded-2xl border border-primary-100 px-6 py-4 ${className}`}
        style={{ background: 'var(--backgroundGradient8)' }}
      >
        <div className='flex items-center'>
          <div className='md:w-10 md:h-10 rounded-full flex items-center justify-start mr-2 md:mr-0'>
            <Svg
              src={
                isMobile
                  ? `${process.env.IMAGE_DOMAIN}/elicash_Gift_Icon_ecf28ca93e.svg`
                  : `${process.env.IMAGE_DOMAIN}/noto_wrapped_gift_844362e16d.svg`
              }
              width={isMobile ? '32' : '24'}
              height={isMobile ? '39' : '24'}
            />
          </div>
          <div className='leading-tight'>
            <h6
              className='text-sm font-semibold mb-1'
              style={{ color: 'var(--orange4)' }}
            >
              Congratulations
            </h6>
            <p className='text-xs text-foreground flex items-center gap-1'>
              You earned
              <ElicashIcon />
              <span className='text-xs font-semibold text-foreground'>
                2000 Elicash
              </span>
            </p>
          </div>
        </div>

        <Svg
          src={`${process.env.IMAGE_DOMAIN}/chevron_forward_c4553178c2.svg`}
          width='7'
          height='12'
          className='ml-4'
        />
      </div>

      <ResponsiveDialogDrawer
        contentClassName='sm:max-w-[400px]!'
        open={open}
        setOpen={setOpen}
      >
        <div className='flex flex-col items-center gap-3 text-center'>
          <Svg
            src={`${process.env.IMAGE_DOMAIN}/elicash_Gift_Icon_ecf28ca93e.svg`}
            width='96'
            height='96'
          />

          <p className='text-base text-foreground font-semibold md:font-normal pt-5 mb-[-5px]'>
            {isMobile ? 'Yay! You earned' : 'You successfully saved'}
          </p>

          <p
            className='text-xl md:text-2xl font-semibold text-primary flex items-center gap-1'
            style={{ color: 'var(--orange4)' }}
          >
            <Svg
              src={`${process.env.IMAGE_DOMAIN}/Group_6d3cad9fd5.svg`}
              width={isMobile ? '20' : '24'}
              height={isMobile ? '20' : '24'}
            />
            2000 Elicash
          </p>

          <p className='text-xs text-foreground'>
            Elicash will be credited to your wallet post your stay completion.
          </p>

          <Button className='mt-4 px-6 py-2 rounded-full shadow-none cursor-pointer bg-foreground w-[180px] h-[48px] text-white text-sm font-semibold'>
            Continue
          </Button>
        </div>
      </ResponsiveDialogDrawer>
    </>
  );
};

export default ElicashCard;
