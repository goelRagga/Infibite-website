'use client';

import { Button } from '@/components/ui';
import ElicashIcon from '@/assets/ElicashIconNew.svg';
import { useRouter } from 'next/navigation';

interface props {
  elicash: any;
}

const ElicashCard = ({ elicash }: props) => {
  const router = useRouter();
  const handleBookNowClick = () => {
    router.push('/villas');
  };
  return (
    <div className='w-full h-auto py-2 px-5'>
      <div className='w-full h-auto flex flex-wrap justify-between items-center gap-2'>
        <div className='w-full h-auto flex items-center justify-between gap-1 px-2 py-1 rounded-3xl bg-[var(--grey14)] text-white text-sm'>
          <div className='flex items-center gap-1'>
            <ElicashIcon />
            <p className='text-[var(--black11)] text-xs'>
              Get{' '}
              <span className='font-bold'>₹ {elicash.exchangeRate.earn}</span>{' '}
              for every{' '}
              <span className='text-[var(--black11)] text-xs font-bold'>
                ₹ {elicash.exchangeRate.spend}
              </span>{' '}
              spent
            </p>
          </div>
          <Button
            onClick={handleBookNowClick}
            variant='outline'
            className='border-accent-red-900 text-xs text-[var(--red3)] font-semibold rounded-full px-4 py-2 bg-white'
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ElicashCard;
