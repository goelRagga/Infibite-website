'use client';

import React, { useState } from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import { Button } from '@/components/ui';
import ResponsiveDialogDrawer from '@/components/common/ResponsiveDialogDrawer';
import SingleBlogPageForm from '../WPForms/SingleBlogPageForm';

interface SingleBlogModalFormProps {
  data?: any;
  isBlogDetail?: boolean;
  title?: string;
  description?: string;
  ctaTitle?: string;
  formTitle?: string;
  formComponent?: React.ReactNode;
  className?: string;
}

const SingleBlogModalForm: React.FC<SingleBlogModalFormProps> = ({
  data,
  title,
  description,
  ctaTitle,
  formTitle,
  formComponent,
  className,
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className='flex flex-col md:flex-row bg-card p-6 mt-5 mb-5 rounded-2xl'>
        <div className='flex-5/6'>
          <h4 className='md:text-2xl text-xl font-serif text-foreground mb-1'>
            {title}
          </h4>
          <p className='text-sm text-foreground'>{description}</p>
        </div>
        <div className='flex-1/6 mt-5'>
          <Button
            onClick={() => setOpen(true)}
            variant={'default'}
            size={'sm'}
            className='pl-6 pr-6 w-full h-[52px] bg-accent-red-900 hover:bg-accent-red-950 cursor-pointer rounded-full text-sm text-card font-semibold'
          >
            {ctaTitle}
          </Button>
        </div>
      </div>
      <ResponsiveDialogDrawer
        open={open}
        setOpen={setOpen}
        title={formTitle}
        contentClassName={`sm:max-w-[792px]! md:max-w-[100vw]! lg:max-w-[792px]! md:h-[630px] bg-card no-scrollbar ${className}`}
      >
        {formComponent}
      </ResponsiveDialogDrawer>
    </>
  );
};

export default SingleBlogModalForm;
