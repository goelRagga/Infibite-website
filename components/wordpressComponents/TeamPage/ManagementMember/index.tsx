import React from 'react';
import { ManagementTeamMembers } from 'team-page';
import CustomImage from '@/components/common/CustomImage';
import Link from 'next/link';
import LinkedIn from '@/assets/linkedIn.svg';

const ManagementMember: React.FC<ManagementTeamMembers> = ({
  memberDesignation,
  memberImage,
  memberName,
  memberLinkedinUrl,
}) => {
  return (
    <>
      <div className='p-0 md:p-4 w-full'>
        <div className='rounded-xl bg-card h-[170px] sm:h-[176px] lg:h-[190px] xl:h-[272px] overflow-hidden w-full md:w-full'>
          <CustomImage
            src={memberImage || ''}
            alt={memberName || ''}
            width={400}
            height={400}
            className='w-full h-[170px] sm:h-[176px] lg:h-[190px] xl:h-[272px] object-cover'
          />
        </div>
        <h5 className='text-base md:text-xl text-foreground font-serif mt-3 flex items-center'>
          <span className='mr-0.5'>{memberName}</span>
          <Link href={memberLinkedinUrl || ''} target='_blank'>
            <LinkedIn />
          </Link>
        </h5>
        <p className='text-xs md:text-sm text-primary-500'>
          {memberDesignation}
        </p>
      </div>
    </>
  );
};

export default ManagementMember;
