'use client';
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface MobileHeaderProps {
  title?: string;
  onBack?: any;
  rightActionLabel?: string;
  onRightAction?: () => void;
  className?: string;
  rightActionClassName?: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  onBack,
  rightActionLabel,
  onRightAction,
  className = '',
  rightActionClassName = '',
}) => {
  const router = useRouter();
  return (
    <header
      className={cn(
        'flex items-center justify-between px-4 py-4 bg-white border-b sticky top-0 z-50 w-full dark:bg-background dark:border-0',
        className
      )}
    >
      <button
        type='button'
        aria-label='Back'
        onClick={onBack ? onBack : () => router.back()}
        className='p-0 w-10 m-0 bg-transparent border-none outline-none flex items-center'
      >
        <ArrowLeft className='absolute left-[20px]' />
      </button>
      <h1 className='flex-1 w-80 text-center text-xl font-serif text-[#2C1B18] leading-none w-full dark:text-white'>
        {title}
      </h1>
      {rightActionLabel ? (
        <button
          type='button'
          onClick={onRightAction}
          className={cn(
            'w-10 text-accent-red-900 font-bold text-lg px-0 bg-transparent border-none outline-none',
            rightActionClassName
          )}
        >
          {rightActionLabel}
        </button>
      ) : (
        // To keep spacing consistent if no right action
        <span className='w-10' />
      )}
    </header>
  );
};

export default MobileHeader;
