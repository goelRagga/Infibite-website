import React from 'react';
import { FounderTeamMembers } from 'team-page';
import CustomImage from '@/components/common/CustomImage';
import LinkedIn from '@/assets/linkedIn.svg';
import Link from 'next/link';

const FoundingMember: React.FC<FounderTeamMembers> = ({
  memberDescription,
  memberDesignation,
  memberImage,
  memberLinkedinUrl,
  memberName,
}) => {
  return (
    <>
      <div className='flex flex-col md:flex-row border border-card w-full'>
        <div className='md:w-1/2 h-[250px] md:[400px] overflow-hidden md:h-[300px] xl:h-auto'>
          <CustomImage
            src={memberImage || ''}
            alt={memberName || ''}
            width={500}
            height={500}
            className='w-full object-cover md:h-[400px] xl:h-auto'
          />
        </div>
        <div className='md:w-1/2 flex items-center'>
          <div className='px-4 md:px-6 py-4 md:py-0'>
            <h4 className='text-xl font-serif text-foreground flex items-center'>
              <span className='mr-0.5'>{memberName}</span>
              <Link href={memberLinkedinUrl || ''} target='_blank'>
                <LinkedIn />
              </Link>
            </h4>
            <h5 className='text-primary-500 text-sm mb-4'>
              {memberDesignation}
            </h5>
            <div
              className='max-w-none text-xs text-primary-800 
              [&_ul]:ml-3 md:[&_ul]:ml-3 
              [&_ul]:list-disc [&_ul]:pl-0 md:[&_ul]:pl-0 
              [&_ul>li]:pb-[5px] [&_ul>li_.pl-2]:!pl-0'
              dangerouslySetInnerHTML={{ __html: memberDescription || '' }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FoundingMember;
