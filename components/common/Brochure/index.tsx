import { BrochureProps } from 'brochure';
import React from 'react';
import CustomImage from '@/components/common/CustomImage';
import Link from 'next/link';
import Image from 'next/image';

const Brochure: React.FC<BrochureProps> = ({
  className,
  brochureUrl,
  iconUrl,
  text,
  textSize = 'text-[10px]',
  onClick,
}) => {
  const content = (
    <>
      <div className='flex items-center justify-center gap-1'>
        <Image
          src={
            iconUrl ||
            'https://d31za8na64dkj7.cloudfront.net/brochure_Download_cbf0adfc73.svg'
          }
          alt='brochure'
          width={20}
          height={20}
          className='w-5 h-5'
          objectFit='contain'
          priority={true}
          quality={100}
        />
        <p className={`${textSize} text-accent-red-900 font-medium`}>
          {text || 'Download Brochure'}
        </p>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center ${className}`}
        aria-label='Download Brochure'
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={brochureUrl || ''}
      target='_blank'
      rel='noopener noreferrer'
      className={`flex flex-col items-center justify-center ${className} `}
      aria-label='Download brochure'
    >
      {content}
    </Link>
  );
};

export default Brochure;
