import React from 'react';

interface StatCardProps {
  stat: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ stat, className }) => {
  return (
    <>
      {stat && (
        <div
          className={`${
            className
              ? className
              : 'bg-white2 rounded-full px-4 py-2 text-accent-red-900 text-xs md:text-sm chipShadow border border-white md:text-start text-center md:flex justify-center items-center md:h-[50px] w-[145px] md:w-auto'
          } w-full inline-flex items-center gap-1 [&_img]:w-4 [&_img]:h-4 [&_img]:object-contain [&_img]:inline-block [&_img]:align-middle`}
          style={{ background: className ? className : 'var(--white2)' }}
        >
          <span className='w-full' dangerouslySetInnerHTML={{ __html: stat }} />
        </div>
      )}
    </>
  );
};

export default StatCard;
