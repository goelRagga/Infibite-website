'use client';

import React from 'react';
import CommonForm from '@/components/wordpressComponents/WPForms/CommonForm';
import {
  eventListingFormFields,
  eventListingFromAndTo,
} from '@/components/modules/ProfilePage/profilesidebarmenu/personaldetails/PersonalDetails';
import BookingConfirmLogo from '@/assets/bookingConfirmedCheck.svg';

const EventListingForm: React.FC<{
  className?: string;
  onClose?: () => void;
}> = ({ className = 'h-auto! md:h-[600px]', onClose }) => {
  const endpoint =
    'https://api.hsforms.com/submissions/v3/integration/submit/44221819/e24ac1fb-c473-4ebe-9b88-43d5c465749a';

  return (
    <CommonForm
      onClose={onClose}
      useCustomSuccessMessage={true}
      successMessage={
        <div className='text-center flex flex-col items-center gap-3 rounded-lg'>
          <BookingConfirmLogo />
          <h3 className='text-foreground text-base font-semibold'>
            Request received!
          </h3>
          <p className='text-foreground text-xs'>
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
          fields: eventListingFormFields,
          columns: 1,
        },
        { sectionKey: 'dateRange', fields: eventListingFromAndTo, columns: 1 },
      ]}
      endpoint={endpoint}
      validateField={({ name, value }) => {
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return 'This field is required';
        }

        if (name === 'number_of_guest') {
          const numValue = typeof value === 'string' ? parseInt(value) : value;
          if (isNaN(numValue) || numValue < 1) {
            return 'Number of guests must be at least 1';
          }
        }

        if (name === 'email' && typeof value === 'string') {
          if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
            return 'Invalid email address';
          }
        }

        if (name === 'daterange') {
          if (!value?.checkin || !value?.check_out) {
            return 'Please select both dates';
          }
        }

        return null;
      }}
      mapToPayload={(formData: any) => ({
        fields: [
          { name: 'firstname', value: formData.eventDetails.firstname },
          { name: 'email', value: formData.eventDetails.email },
          { name: 'phone', value: formData.eventDetails.phone },
          {
            name: 'number_of_guest',
            value: formData.eventDetails.number_of_guest,
          },
          { name: 'city', value: formData.eventDetails.city },
          { name: 'checkin', value: formData.dateRange.checkin },
          { name: 'check_out', value: formData.dateRange.check_out },
        ],
      })}
    />
  );
};

export default EventListingForm;
