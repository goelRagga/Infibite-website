import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CustomImage from '@/components/common/CustomImage';

interface VillaCardProps {
  link?: string;
  images?: string;
  cityName?: string;
  cityLocation?: string;
  amenities?: { guest: string; bedrooom: string; bathroom: string }[];
  price?: string;
}

const VillaCard: React.FC<VillaCardProps> = ({
  link = '#',
  images,
  cityName,
  cityLocation,
  amenities,
  price,
}) => {
  const rareFind = 'Rare Find';
  return (
    <div className='overflow-hidden gap-0 border border-primary-100 rounded-3xl bg-primary-50 shadow-none p-2.5 transition-shadow duration-300'>
      <div className='relative mb-1'>
        <CustomImage
          src={images || ''}
          alt='Villa'
          className='w-full h-[194px] object-cover rounded-2xl'
          width={284}
          height={194}
        />
        <Badge
          variant='secondary'
          className='absolute top-3 left-3 bg-secondary-50 text-foreground font-semibold'
        >
          {rareFind}
        </Badge>
      </div>

      <div className='p-0 pb-1'>
        <h3 className='text-base font-serif text-primary-800 pt-2.5 pb-1.5'>
          {cityName}
        </h3>

        <p className='text-foreground mb-0 max-sm:mb-2.5 text-sm'>
          {cityLocation}
        </p>

        {amenities?.map((value?: any, index?: number) => (
          <p
            key={index}
            className='mt-2.5 text-primary-800 font-normal text-xs max-sm:mb-4'
          >
            {value?.guest} guests | {value?.bedrooom} bedroom |{' '}
            {value?.bathroom} bathroom
          </p>
        ))}

        <div className='mt-4 flex items-center'>
          <span className='text-foreground font-semibold text-lg'>
            ₹ {price}
          </span>
          <span className='text-foreground font-normal text-sm'>/night</span>
        </div>
      </div>
    </div>
  );
};

export default VillaCard;
