import React from 'react';
import CustomImage from '@/components/common/CustomImage';
import RatingIcon from '@/assets/startIcon.svg';
import Image from 'next/image';

interface Review {
  rating: number;
  reviewText: string;
  userName: string;
  userProfilePicture: string;
}

interface TestimonialCardProps {
  reviews: Review;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ reviews }) => {
  return (
    <div
      className='bg-white p-6 rounded-lg shadow-md h-full'
      style={{ background: 'linear-gradient(90deg,#fffcfb 28.15%,#fef8f5)' }}
    >
      <div className='flex mb-4'>
        {[...Array(reviews.rating)].map((_, i) => (
          <RatingIcon key={i} className='w-3 h-3 text-yellow-400' />
        ))}
      </div>

      <p className='text-foreground mb-4 text-xs md:text-sm'>
        {reviews.reviewText}
      </p>

      <div className='flex items-center'>
        <div className='relative w-10 h-10 rounded-full overflow-hidden mr-3'>
          <Image
            src={reviews.userProfilePicture}
            alt={reviews.userName}
            fill
            className='object-cover'
          />
        </div>
        <span className='text-xs md:text-sm text-foreground'>
          {reviews.userName}
        </span>
      </div>
    </div>
  );
};

export default TestimonialCard;
