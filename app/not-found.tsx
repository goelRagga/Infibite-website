import CustomImage from '@/components/common/CustomImage';
import { memo } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | ELIVAAS Luxury Villas',
  description:
    'Oops! This page doesn’t exist. Explore ELIVAAS luxury villas and book your next premium getaway.',
};
const NotFound = memo(function NotFound() {
  return (
    <div className='w-screen flex justify-center items-center py-24 box-border'>
      <div className='flex flex-col items-center space-y-2 text-center'>
        <div>
          <CustomImage
            src={`${process.env.IMAGE_DOMAIN}/page_Not_Found_6e527bea78.svg`}
            alt='ELIVAAS Logo'
            title='ELIVAAS Logo'
            width={200}
            height={200}
            className='mx-auto'
          />
          <h1 className='text-[9em] font-semibold leading-none'>404</h1>
        </div>
        <div>
          <h4 className='text-2xl font-normal'>Page Not Found</h4>
        </div>
      </div>
    </div>
  );
});

export default NotFound;
