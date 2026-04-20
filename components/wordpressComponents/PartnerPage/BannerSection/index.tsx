'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { partnerWithUsPage } from 'partner-page';
import PartnerPageForm from '@/components/wordpressComponents/WPForms/PartnerPageForm';
import ResponsiveDialogDrawer from '@/components/common/ResponsiveDialogDrawer';
import CustomImage from '@/components/common/CustomImage';
import { motion } from 'framer-motion';
import useIsMobile from '@/hooks/useIsMobile';

const BannerSection: React.FC<partnerWithUsPage> = ({
  partnerWithUsHeading,
  partnerWithUsSubHeading,
  partnerWithUsBanner,
}) => {
  const ctaName = 'Request a callback';
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  return (
    <>
      <div className={`relative w-full h-[520px] md:h-[450px] `}>
        <CustomImage
          src={partnerWithUsBanner || ''}
          alt={partnerWithUsHeading || ''}
          fill
          className='object-cover w-full h-full'
          priority
        />

        {/* Overlay Content */}
        <motion.div
          className='absolute inset-x-5 bottom-5 md:bottom-12 md:left-10 md:inset-x-auto md:w-[400px] backdrop-blur-xl rounded-2xl overflow-hidden z-10 p-6 md:p-10'
          style={{ background: 'rgba(255,255,255,0.7)' }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {isMobile ? (
            <h2 className='text-foreground text-center md:text-left text-lg sm:text-xl md:text-4xl md:leading-10 font-serif mb-4'>
              {partnerWithUsHeading}
            </h2>
          ) : (
            <h1 className='text-foreground text-center md:text-left text-lg sm:text-xl md:text-4xl md:leading-10 font-serif mb-4'>
              {partnerWithUsHeading}
            </h1>
          )}

          <p className='text-foreground text-xs md:text-sm text-center md:text-left mb-4 max-w-xl'>
            {partnerWithUsSubHeading}
          </p>
          <span>
            <Link
              className='font-semibold italic text-xs mb-4 mx-auto sm:mx-0 flex items-center gap-2 bg-white rounded-full px-4 py-2 w-41 cursor-pointer'
              href={`tel:+91-7969469960`}
              prefetch={false}
            >
              <Phone className='w-4 h-4' />
              +91-7969469960
            </Link>
          </span>
          <div className='flex justify-center md:justify-start'>
            <Button
              onClick={() => setOpen(true)}
              className='text-white font-semibold text-xs rounded-full h-12 px-6 py-3 bg-accent-red-900 hover:bg-accent-red-950'
            >
              {ctaName}
            </Button>
          </div>
        </motion.div>
      </div>
      <ResponsiveDialogDrawer
        contentClassName='h-screen h-auto sm:h-[470px] sm:max-w-[480px]! bg-card gap-0 fixed! bottom-0!'
        title="Let's Get Started"
        open={open}
        setOpen={setOpen}
      >
        <div className='relative h-auto overflow-auto pt-0 mb-20'>
          <PartnerPageForm onClose={() => setOpen(false)} />
        </div>
      </ResponsiveDialogDrawer>
    </>
  );
};

export default BannerSection;
