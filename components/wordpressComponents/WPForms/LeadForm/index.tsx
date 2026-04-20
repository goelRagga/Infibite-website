'use client';

import React from 'react';
import CommonForm from '@/components/wordpressComponents/WPForms/CommonForm';
import { LeadFormFields } from '@/components/modules/ProfilePage/profilesidebarmenu/personaldetails/PersonalDetails';
import BookingConfirmLogo from '@/assets/bookingConfirmedCheck.svg';

const LeadForm: React.FC<{
  className?: string;
  onClose?: () => void;
}> = ({ className = 'h-[600px] md:h-[600px]', onClose }) => {
  const endpoint =
    'https://api.hsforms.com/submissions/v3/integration/submit/44221819/e24ac1fb-c473-4ebe-9b88-43d5c465749a';

  return (
    <CommonForm
      onClose={onClose}
      useCustomSuccessMessage={true}
      successMessage={
        <div className='text-center flex flex-col items-center gap-3 rounded-lg'>
          <BookingConfirmLogo />
          <h3 className='text-foreground text-base md:text-2xl font-semibold'>
            Request received!
          </h3>
          <p className='text-foreground text-xs md:text-base'>
            We'll be in touch soon to plan something memorable.
          </p>
        </div>
      }
      submitText='Enquire Now'
      className={className}
      buttonClassName='w-full h-12 bg-accent-red-900 rounded-full'
      sections={[
        {
          sectionKey: 'eventDetails',
          fields: LeadFormFields,
          columns: 1,
        },
      ]}
      endpoint={endpoint}
      validateField={({ name, value }) => {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return 'This field is required';
        }

        if (name === 'email' && typeof value === 'string') {
          if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
            return 'Invalid email address';
          }
        }

        return null;
      }}
      mapToPayload={(formData: any) => ({
        fields: [
          { name: 'firstname', value: formData.eventDetails.firstname },
          { name: 'email', value: formData.eventDetails.email },
          { name: 'phone', value: formData.eventDetails.phone },
          { name: 'city', value: formData.eventDetails.city },
        ],
      })}
    />
  );
};

export default LeadForm;
