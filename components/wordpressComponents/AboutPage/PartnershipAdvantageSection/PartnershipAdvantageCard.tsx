import React from 'react';
import Svg from '@/components/common/Shared/Svg';

interface PartnershipAdvantageCardProps {
  title: string;
  content: string;
  imgSrc: string;
  reverse?: boolean;
  className?: string;
}

const PartnershipAdvantageCard: React.FC<PartnershipAdvantageCardProps> = ({
  title,
  content,
  imgSrc,
  reverse = false,
  className = '',
}) => {
  return (
    <div
      className={`bg-card mb-3 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 ${
        reverse ? 'md:flex-row-reverse' : ''
      } ${className}`}
    >
      <div className='flex-1/12'>
        <Svg src={imgSrc} width='95' height='auto' />
      </div>
      <div className='flex-11/12'>
        <h4 className='text-xl text-center md:text-left font-serif text-foreground mb-1'>
          {title}
        </h4>
        <p className='text-xs md:text-sm text-foreground text-center md:text-left'>
          {content}
        </p>
      </div>
    </div>
  );
};

export default PartnershipAdvantageCard;
