'use client';

import React, { useState } from 'react';
import { CorporateTestimonialsProps } from 'corporate-page';
import CustomImage from '@/components/common/CustomImage';

const CorporateTestimonials: React.FC<CorporateTestimonialsProps> = ({
  corporateTestimonialContent,
  corporateTestimonialLogo,
  corporateTestimonialName,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className='flex  items-center flex-col p-4 rounded-xl'
      style={{ background: 'var(--black5)' }}
    >
      <p
        className={`text-white text-sm ${
          expanded ? '' : 'line-clamp-2'
        } transition-all duration-300`}
      >
        {corporateTestimonialContent}
      </p>

      {corporateTestimonialContent &&
        corporateTestimonialContent.split(' ').length > 10 && (
          <div className='w-full flex justify-start'>
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className='font-semibold cursor-pointer text-xs mt-2 focus:outline-none'
              style={{ color: 'var(--blue1)' }}
            >
              {expanded ? 'Read less' : 'Read more'}
            </button>
          </div>
        )}

      <div className='flex items-center gap-2 mt-4 w-full'>
        <div className='w-[70px] h-[30px] bg-white rounded-2xl flex items-center justify-center overflow-hidden'>
          <CustomImage
            src={corporateTestimonialLogo || ''}
            width={60}
            height={30}
            alt='Testimonial Logo'
            className='object-contain'
          />
        </div>
        <h4 className='text-white text-sm md:text-base'>
          {corporateTestimonialName}
        </h4>
      </div>
    </div>
  );
};

export default CorporateTestimonials;
