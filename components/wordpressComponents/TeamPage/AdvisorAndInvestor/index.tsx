import React from 'react';
import { AdvisorsAndInvestors } from 'team-page';
import CustomImage from '@/components/common/CustomImage';
import LinkedIn from '@/assets/linkedIn.svg';
import Link from 'next/link';

const AdvisorAndInvestorMember: React.FC<AdvisorsAndInvestors> = ({
  investorImage,
  investorLinkedinUrl,
  investorTitle,
}) => {
  return (
    <>
      <div className='p-0 md:p-4 w-full'>
        <div className='rounded-xl bg-card h-[170px] sm:h-[176px] lg:h-[190px] xl:h-[272px] overflow-hidden w-full md:w-full'>
          <CustomImage
            src={investorImage || ''}
            alt={investorTitle || ''}
            width={400}
            height={400}
            className='w-full h-[170px] sm:h-[176px] lg:h-[190px] xl:h-[272px] md:w-full object-cover'
          />
        </div>
        <h5 className='text-base md:text-xl text-foreground font-serif mt-3 leading-4 md:leading-6 flex items-center'>
          <span className='mr-0.5'>{investorTitle}</span>
          <Link href={investorLinkedinUrl || ''} target='_blank'>
            <LinkedIn />
          </Link>
        </h5>
        {/* <p className='text-xs md:text-sm text-primary-500'>{'Investor'}</p> */}
      </div>
    </>
  );
};

export default AdvisorAndInvestorMember;
