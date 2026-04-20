// components/common/Shared/Timeline.tsx

import React from 'react';

interface TimelineProps {
  isLast: boolean;
}

export default function Timeline({ isLast }: TimelineProps) {
  return (
    <div className='absolute left-[0px] top-0 bottom-0 w-[14px] flex flex-col items-center z-0'>
      <div className='w-2 h-2 rounded-full bg-primary-200 z-10' />
      {!isLast && <div className='flex-1 w-[1px] bg-primary-200' />}
    </div>
  );
}
