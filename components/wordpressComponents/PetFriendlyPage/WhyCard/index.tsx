import React from 'react';
import CustomImage from '@/components/common/CustomImage';

interface WhyCardPawProps {
  image?: string;
  title?: string;
  description?: string;
}

const WhyCardPaw: React.FC<WhyCardPawProps> = ({
  image,
  title,
  description,
}) => {
  return (
    <div className='overflow-hidden duration-300'>
      <div className='relative mb-1'>
        <CustomImage
          src={image || ''}
          alt='Villa'
          className='w-full h-[190] md:h-[200px] object-cover rounded-2xl'
          width={300}
          height={200}
        />
      </div>

      <div className='p-0 pb-1'>
        <h3 className='text-sm md:text-base text-black pt-2.5 pb-1.5'>
          {title}
        </h3>
        <p className='text-foreground mb-0 max-sm:mb-2.5 text-xs md:text-sm'>
          {description}
        </p>
      </div>
    </div>
  );
};

export default WhyCardPaw;
