'use client';
import React from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import { Star } from 'lucide-react';

interface ReviewCommentsProps {
  review?: {
    rating?: number;
    comments?: string;
  };
  user?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

const ReviewComments: React.FC<ReviewCommentsProps> = ({ review, user }) => {
  const isMobile = useIsMobile();

  const firstLetter = user?.name?.charAt(0);

  return (
    <div className='border-t border-t-[#FFFFFF1A] mt-4 md:mt-6 pt-4 md:pt-8'>
      <div className='flex flex-row items-center justify-between'>
        <div className='flex flex-row items-center gap-2'>
          <div>
            <span className='text-[var(--black12)] text-sm bg-[var(--grey16)] font-semibold rounded-full w-8 h-8 flex items-center justify-center'>
              {firstLetter}
            </span>
          </div>
          <div>
            {user?.name && (
              <span className='text-secondary-200 text-xs font-semibold'>
                {user?.name}
              </span>
            )}
            <div className='flex flex-row items-center gap-0'>
              {Array.from({
                length: review?.rating || 5,
              }).map((_, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 ${length ? '' : ''} fill-accent-yellow-500`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='pt-3'>
        <p className='text-[var(--black4)] text-sm md:text-base'>
          {review?.comments}
        </p>
      </div>
    </div>
  );
};

export default ReviewComments;
