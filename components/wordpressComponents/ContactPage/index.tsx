'use client';

import React, { useState } from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import LeftSideContentSection from './LeftSideContentSection';
import MapSection from './MapSection';
import ContactAddressSection from './ContactAddressSection';
import { ContactPageTemplate } from '@/lib/wordpress/types';
import FormSectionContactPage from './FormSectionContactPage';
import CustomBreadcrumb from '@/components/common/Breadcrumbs';
import ResponsiveDialogDrawer from '@/components/common/ResponsiveDialogDrawer';
import { Button } from '@/components/ui';
import MobileHeader from '@/components/common/MobileHeader';

const ContactPage: React.FC<ContactPageTemplate> = ({
  templateName,
  contactPage,
}) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const contactPageHeading = contactPage?.contactPageHeading;
  const contactPageSubHeading = contactPage?.contactPageSubHeading;
  const customerSupportDescription = contactPage?.customerSupportDescription;
  const customerSupportEmailAddress = contactPage?.customerSupportEmailAddress;
  const customerSupportPhoneNumber = contactPage?.customerSupportPhoneNumber;
  const customerSupportTitle = contactPage?.customerSupportTitle;
  const addressMapLink = contactPage?.addressMapLink;
  const mediaEnquiriesTitle = contactPage?.mediaEnquiriesTitle;
  const mediaEnquiriesDescription = contactPage?.mediaEnquiriesDescription;
  const mediaEnquiriesEmailAddress = contactPage?.mediaEnquiriesEmailAddress;
  const officeAddress = contactPage?.officeAddress;

  const BreadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Contact', href: '/contact' },
  ];

  const getInTouchAnytime = 'Get in Touch, Anytime';
  const description =
    'Need help picking the right place? ‘Contact Us’ and we’ll help you book the one that feels like home.';
  const contactUs = 'Contact Us';
  const findTitle = 'Find Us Here';
  const findDescription =
    'Here’s where all the magic happens. You’re welcome to visit!';

  return (
    <>
      {isTablet && <MobileHeader title='Contact Us' />}
      <div className='mx-auto px-5 md:px-10 pt-5 pb-0'>
        {!isTablet && <CustomBreadcrumb items={BreadcrumbItems} />}
      </div>
      <div className='mx-auto px-5 md:px-10 pt-5 pb-10 flex flex-col-reverse lg:flex-row gap-6 lg:gap-8'>
        <div className='w-full lg:w-1/2'>
          <LeftSideContentSection
            contactPageHeading={contactPageHeading}
            contactPageSubHeading={contactPageSubHeading}
            customerSupportTitle={customerSupportTitle}
            customerSupportDescription={customerSupportDescription}
            customerSupportEmailAddress={customerSupportEmailAddress}
            customerSupportPhoneNumber={customerSupportPhoneNumber}
            mediaEnquiriesTitle={mediaEnquiriesTitle}
            mediaEnquiriesDescription={mediaEnquiriesDescription}
            mediaEnquiriesEmailAddress={mediaEnquiriesEmailAddress}
          />
        </div>
        {!isTablet && (
          <div className='w-full md:w-1/2'>
            <FormSectionContactPage />
          </div>
        )}
        {isTablet && (
          <>
            <div
              className='p-6 rounded-2xl'
              style={{ background: 'var(--white3)' }}
            >
              <h5 className='text-xl text-foreground font-serif mb-0'>
                {getInTouchAnytime}
              </h5>
              <p className='text-sm text-foreground pt-2 pb-4'>{description}</p>
              <Button
                onClick={() => {
                  setOpen(true);
                }}
                className='text-white bg-accent-red-900 hover:bg-accent-red-950 border border-accent-red-900 cursor-pointer w-full text-sm font-semibold h-[50px] px-10 rounded-full py-4'
              >
                {contactUs}
              </Button>
            </div>
          </>
        )}
        {isTablet && (
          <ResponsiveDialogDrawer
            open={open}
            setOpen={setOpen}
            contentClassName='h-screen h-auto bg-card gap-0 fixed! bottom-0!'
            title={'Personal Details'}
          >
            <div className='relative h-auto overflow-auto pt-0 mb-20'>
              <FormSectionContactPage />
            </div>
          </ResponsiveDialogDrawer>
        )}
      </div>
      <div className='px-5 md:px-10 pt-5 pb-10 md:pb-15 flex flex-col lg:flex-row gap-4 md:gap-6'>
        <div className='w-full lg:w-1/2'>
          {isTablet && (
            <div className='mb-5'>
              <h2 className='text-2xl font-serif text-foreground'>
                {findTitle}
              </h2>
              <p className='text-secondary-700 text-base mb-1.5'>
                {findDescription}
              </p>
            </div>
          )}
          <MapSection addressMapLink={addressMapLink} />
        </div>
        <div className='w-full lg:w-1/2 flex items-center'>
          <ContactAddressSection officeAddress={officeAddress} />
        </div>
      </div>
    </>
  );
};

export default ContactPage;
