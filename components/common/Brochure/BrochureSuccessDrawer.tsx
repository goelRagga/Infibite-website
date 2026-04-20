'use client';

import React from 'react';
import { CheckCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui';
import CustomImage from '@/components/common/CustomImage';
import { trackEvent } from '@/lib/mixpanel';

interface BrochureSuccessDrawerProps {
  brochureUrl?: string;
  onClose?: () => void;
  propertyName?: string;
  location?: string;
  city?: string;
  phoneNumber?: string;
  showThankYouMessage?: boolean;
}

const BrochureSuccessDrawer: React.FC<BrochureSuccessDrawerProps> = ({
  brochureUrl,
  propertyName,
  showThankYouMessage = true,
}) => {
  const shortPropertyName = propertyName?.split(' ')?.slice(0, 2)?.join(' ');
  const whatsappUrl = `https://api.whatsapp.com/send/?phone=&text=Brochure%20link%20for%20${shortPropertyName}%C3%A9a%20is%20here:%20${brochureUrl}`;

  const handleWhatsAppClick = () => {
    trackEvent('share_whatsApp_brochure');
    window.open(whatsappUrl, '_blank');
  };

  const handleDownloadPDF = () => {
    if (brochureUrl) {
      trackEvent('download_brochure');
      window.open(brochureUrl, '_blank');
    }
  };

  return (
    <div className='mt-2 md:mt-4 flex flex-col items-center justify-center px-6 py-8 bg-white h-auto overflow-hidden dark:border-primary-800 dark:bg-[var(--prive-background)]'>
      {showThankYouMessage && (
        <>
          <div className='mb-6'>
            <CheckCircle
              className='w-16 h-16 sm:w-20 sm:h-20 text-green-600'
              strokeWidth={1.5}
            />
          </div>
          <h2 className='text-xl font-serif text-gray-900 mb-3 dark:text-white'>
            Thank you!
          </h2>
          <p className='text-sm text-foreground mb-8 text-center px-4'>
            You will be hearing from us soon!
          </p>
        </>
      )}

      <div className='flex flex-col gap-4 w-full max-w-sm'>
        <Button
          onClick={handleWhatsAppClick}
          className='w-full h-14 rounded-full bg-[var(--green3)] hover:bg-[var(--green2)] text-white font-semibold flex items-center justify-center gap-2'
        >
          <div>
            <CustomImage
              src={`${process.env.IMAGE_DOMAIN}/whatsapp_Icon_23a8adeb5b.svg`}
              alt='WhatsApp'
              width={24}
              height={24}
              className='w-6 h-6'
              imageType='svg'
              objectFit='contain'
              priority={true}
              quality={100}
              format='svg'
            />
          </div>
          Receive on WhatsApp
        </Button>

        <Button
          onClick={handleDownloadPDF}
          className='w-full h-14 rounded-full bg-accent-red-900 hover:bg-accent-red-950 text-white font-semibold flex items-center justify-center gap-2'
        >
          <FileText className='w-7 h-7' />
          <span>Download PDF</span>
        </Button>
      </div>
    </div>
  );
};

export default BrochureSuccessDrawer;
