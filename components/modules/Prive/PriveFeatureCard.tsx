import CustomImage from '@/components/common/CustomImage';
import React from 'react';

export interface PriveFeatureCardProps {
  data: {
    title: string;
    description: string;
    image: string;
    topHeading: string;
  };
}

interface LocationTagProps {
  label: string;
}

export const LocationTag: React.FC<LocationTagProps> = ({ label }) => {
  return (
    <div
      className='
        absolute 
        left-1/2 md:left-3
        top-3 
        -translate-x-1/2 md:translate-x-0
        w-[238px] 
        h-[33px]
        flex 
        flex-row 
        justify-center 
        items-center 
        gap-[10px]
        px-2 
        py-1 
        rounded-3xl
        bg-[rgba(39,38,38,0.35)] 
        shadow-[0px_0px_18px_0px_#5D5D5D40]
        backdrop-blur-[50px]
        text-white
        text-xs
      '
    >
      {label}
    </div>
  );
};

export const PriveFeatureCard = ({ data }: PriveFeatureCardProps) => {
  return (
    <div className='relative rounded-3xl overflow-hidden shadow-lg h-[450px] w-full '>
      <CustomImage
        src={data.image}
        alt={data.title || 'Prive Feature'}
        fill
        className='object-cover rounded-3xl'
      />

      <div className='absolute inset-0 bg-gradient-to-b from-transparent from-[62.24%] to-black to-[85.71%]' />

      {data.topHeading && <LocationTag label={data.topHeading} />}

      <div className='absolute bottom-0 w-full px-4 pb-6 text-white'>
        <h3 className='text-base font-serif'>{data.title}</h3>
        <p className='text-xs'>{data.description}</p>
      </div>
    </div>
  );
};

export default PriveFeatureCard;
