'use client';

import { Button } from '@/components/ui/button';

interface BenefitsSectionProps {
  title: string;
  targetAmount: number;
  currency: string;
  description: string;
  buttonText: string;
  onViewBenefits?: () => void;
  className?: string;
}

export default function BenefitsSection({
  title,
  targetAmount,
  currency,
  description,
  buttonText,
  onViewBenefits,
  className = '',
}: BenefitsSectionProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 lg:p-8 shadow-sm text-center ${className}`}
    >
      <h2 className='text-xl lg:text-2xl font-bold text-gray-900 mb-8'>
        {title}
      </h2>

      <div className='mb-6'>
        <div className='text-lg lg:text-xl text-gray-600 mb-2'>
          Spend{' '}
          <span className='font-bold'>
            {currency}
            {targetAmount.toLocaleString()}
          </span>
        </div>
        <p className='text-gray-500 text-sm lg:text-base'>{description}</p>
      </div>

      <Button
        onClick={onViewBenefits}
        variant='outline'
        className='border-red-600 text-red-600 hover:bg-red-50 rounded-full px-8 py-2 bg-transparent'
      >
        {buttonText}
      </Button>
    </div>
  );
}
