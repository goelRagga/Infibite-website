'use client';

import { Spinner } from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { emptyStates } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import TransactionItem from '../TranscationItem';

type EmptyStateType = 'all' | 'expired' | 'upcoming';

interface ElicashTabContentProps {
  transactions: any[];
  isLoading: boolean;
  error: string | null;
  emptyStateType: EmptyStateType;
}

export default function ElicashTabContent({
  transactions,
  isLoading,
  error,
  emptyStateType,
}: ElicashTabContentProps) {
  const emptyState = emptyStates[emptyStateType];
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/villas?adults=1');
  };

  const hasTransactions = transactions && transactions.length > 0;

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-8'>
        <div className='text-gray-600'>
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className=''>
      {!hasTransactions ? (
        <div className='text-center px-6 py-8 lg:py-12'>
          <h3 className='text-2xl lg:text-3xl font-semibold text-gray-800 mb-6 lg:mb-8 font-serif'>
            {emptyState.title}
          </h3>
          <p className='text-gray-600 text-base lg:text-lg mb-8 lg:mb-10 max-w-sm lg:max-w-md mx-auto leading-relaxed'>
            {emptyState.description}
          </p>
          <Button
            onClick={handleButtonClick}
            className='bg-red-900 hover:bg-red-800 text-white px-12 lg:px-16 py-4 lg:py-5 rounded-xl font-medium text-base lg:text-lg'
          >
            {emptyState.buttonText}
          </Button>
        </div>
      ) : (
        <div className='px-2 md:px-6'>
          {transactions.map((transaction, index) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              isLast={index === transactions.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
