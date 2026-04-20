'use client';

import CustomImage from '@/components/common/CustomImage';

interface OfferCardProps {
  title: string;
  description: string;
  image: string;
  className?: string;
}

export default function OfferCard({
  title,
  description,
  image,
  className = '',
}: OfferCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-sm ${className}`}
    >
      <div className='aspect-video relative'>
        <CustomImage
          src={image || '/placeholder.svg'}
          alt={title}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='p-4 lg:p-6'>
        <h3 className='text-lg lg:text-xl font-bold text-gray-900 mb-2'>
          {title}
        </h3>
        <p className='text-gray-600 text-sm lg:text-base leading-relaxed'>
          {description}
        </p>
      </div>
    </div>
  );
}
