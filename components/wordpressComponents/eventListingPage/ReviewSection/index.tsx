'use client';

import React from 'react';
import Star from '@/assets/star.svg';

interface ReviewSectionProps {
  description?: string;
  rating?: number;
  name?: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  description,
  rating,
  name,
}) => {
  return (
    <div className='bg-white rounded-2xl overflow-hidden p-6 border border-primary-100 flex flex-col justify-between items-center'>
      <div>
        <p className='text-foreground text-xs md:text-sm text-center'>
          {description}
        </p>
      </div>
      <div className='flex justify-center items-center gap-1 py-5'>
        {Array.from({ length: rating || 0 }).map((_, index) => (
          <Star key={index} />
        ))}
      </div>
      <div>
        <p className='text-xs md:text-sm text-primary-500 font-semibold'>
          {name}
        </p>
      </div>
    </div>
  );
};

export default ReviewSection;
