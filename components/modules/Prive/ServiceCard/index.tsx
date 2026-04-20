import * as React from 'react';
import Image from 'next/image';
import { CardContent } from '@/components/ui/card';
import CustomImage from '@/components/common/CustomImage';

interface ServiceCardProps {
  imageSrc: string;
  title: string;
  description: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  imageSrc,
  title,
  description,
}) => {
  return (
    <div className='h-[370px] relative rounded-3xl max-w-[340px] shadow-lg p-0.25 bg-gradient-to-b from-[#EFBF8E] to-[#2D1A06]'>
      <div
        className='rounded-3xl p-2 h-full'
        style={{ background: 'var(--prive3)' }}
      >
        <div className='w-full h-[220px] relative'>
          <CustomImage
            src={imageSrc}
            alt={title}
            height={434}
            width={574}
            quality={40}
            className='object-cover rounded-3xl'
          />
        </div>
        <CardContent className='text-center py-6'>
          <h3
            className='text-xl font-serif mb-0.5 text-center'
            style={{ color: 'var(--prive2)' }}
          >
            {title}
          </h3>
          <p className='text-white text-xs font-sans leading-relaxed text-center line-clamp-4'>
            {description}
          </p>
        </CardContent>
      </div>
    </div>
  );
};

export default ServiceCard;
