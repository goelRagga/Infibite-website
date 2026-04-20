import React from 'react';
import { SampleCardProps } from './types';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

export const SampleCard: React.FC<SampleCardProps> = ({
  title,
  description,
  image,
  tag,
  price,
  rating,
}) => {
  return (
    <div className='group relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 h-full'>
      {/* Image section */}
      <div className='relative aspect-[4/3] overflow-hidden bg-gray-100'>
        {image ? (
          <img
            src={image}
            alt={title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            loading='lazy'
          />
        ) : (
          <div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
            <div className='text-gray-400 text-sm'>No Image</div>
          </div>
        )}

        {/* Overlays */}
        {tag && (
          <div className='absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-800'>
            {tag}
          </div>
        )}

        {price && (
          <div className='absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white'>
            {price}
          </div>
        )}
      </div>

      {/* Content section */}
      <div className='p-4 flex-1 flex flex-col'>
        <h3 className='font-serif text-lg font-semibold text-gray-900 mb-2 line-clamp-2'>
          {title}
        </h3>

        {description && (
          <p className='text-sm text-gray-600 mb-3 line-clamp-2 flex-1'>
            {description}
          </p>
        )}

        {rating && (
          <div className='flex items-center gap-1 mt-auto'>
            <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
            <span className='text-sm font-medium text-gray-700'>
              {rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SampleCard;
