'use client';

import React from 'react';
import CommonForm from '@/components/wordpressComponents/WPForms/CommonForm';
import {
  LeadFormFields,
  eventListingFormFields,
  eventListingFromAndTo,
  eventListingCompanyField,
  eventListingLocationField,
  corporateFields,
  corporateFieldsCompanyName,
  corporateFieldsMessage,
  blogFormFieldsPersonalDetails,
  blogFormFieldsLocation,
  blogFormFieldsBookingDetails,
  blogFormFieldsGuests,
} from '@/components/modules/ProfilePage/profilesidebarmenu/personaldetails/PersonalDetails';
import BookingConfirmLogo from '@/assets/bookingConfirmedCheck.svg';
import { formatDateWithFullYear } from '@/components/common/Shared/FormatDate';
import { trackEvent } from '@/lib/mixpanel';

type FormType = 'blog' | 'lead' | 'event' | 'corporate';

interface SingleBlogPageFormProps {
  className?: string;
  onClose?: () => void;
  formType?: FormType;
  onSuccess?: (result: any) => void;
  onSubmit?: (formData: any) => void;
  isCorporateOffsite?: boolean;
}

const SingleBlogPageForm: React.FC<SingleBlogPageFormProps> = ({
  className = '',
  onClose,
  formType = 'blog',
  onSuccess,
  onSubmit,
  isCorporateOffsite = false,
}) => {
  // Single endpoint for all forms
  const endpoint =
    'https://api.hsforms.com/submissions/v3/integration/submit/44221819/e24ac1fb-c473-4ebe-9b88-43d5c465749a';

  // Lead Form Configuration
  if (formType === 'lead') {
    return (
      <CommonForm
        onClose={onClose}
        onSuccess={onSuccess}
        useCustomSuccessMessage={onSuccess ? false : true}
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
        className={className || 'h-auto md:h-[600px]'}
        buttonClassName='w-full h-12 bg-accent-red-900 rounded-full'
        sections={[
          {
            sectionKey: 'eventDetails',
            fields: LeadFormFields,
            columns: 1,
          },
        ]}
        endpoint={endpoint}
        onSubmit={(formData: any) => {
          trackEvent('enquiry_now_submit', {
            firstname: formData.eventDetails.firstname,
            email: formData.eventDetails.email,
            phone: formData.eventDetails.phone,
            city: formData.eventDetails.city,
          });
          // Call parent onSubmit if provided
          if (onSubmit) {
            onSubmit(formData);
          }
        }}
        validateField={({ name, value }) => {
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            return 'This field is required';
          }

          if (name === 'email' && typeof value === 'string') {
            if (
              !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
            ) {
              return 'Invalid email address';
            }
          }

          if (name === 'phone' && typeof value === 'string') {
            const phoneLength = value.replace(/[^0-9]/g, '').length;
            if (phoneLength < 8) {
              return 'Phone number must be at least 8 digits';
            }
            if (phoneLength > 10) {
              return 'Phone number must not exceed 10 digits';
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
  }

  // Event Listing Form Configuration
  if (formType === 'event') {
    const baseFields = isCorporateOffsite
      ? eventListingFormFields.filter((field) => field.name !== 'city')
      : eventListingFormFields;

    const eventSections = [
      {
        sectionKey: 'eventDetails',
        fields: baseFields,
        columns: isCorporateOffsite ? 2 : 1,
      },
    ];

    // Add location and company field sections for corporate-offsite only
    if (isCorporateOffsite) {
      eventSections.push({
        sectionKey: 'location',
        fields: eventListingLocationField,
        columns: 1,
      });
      eventSections.push({
        sectionKey: 'company',
        fields: eventListingCompanyField,
        columns: 1,
      });
    }

    eventSections.push({
      sectionKey: 'dateRange',
      fields: eventListingFromAndTo,
      columns: 1,
    });

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
        className={className || 'h-auto! md:h-[600px]'}
        buttonClassName='w-full h-12 bg-accent-red-900 rounded-full'
        sections={eventSections}
        endpoint={endpoint}
        validateField={({ name, value }) => {
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            return 'This field is required';
          }

          if (name === 'number_of_guest') {
            const numValue =
              typeof value === 'string' ? parseInt(value) : value;
            if (isNaN(numValue) || numValue < 1) {
              return 'Number of guests must be at least 1';
            }
          }

          if (name === 'email' && typeof value === 'string') {
            if (
              !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
            ) {
              return 'Invalid email address';
            }
          }

          if (name === 'phone' && typeof value === 'string') {
            const phoneLength = value.replace(/[^0-9]/g, '').length;
            if (phoneLength < 8) {
              return 'Phone number must be at least 8 digits';
            }
            if (phoneLength > 10) {
              return 'Phone number must not exceed 10 digits';
            }
          }

          if (name === 'daterange') {
            if (!value?.checkin || !value?.check_out) {
              return 'Please select both dates';
            }
          }

          if (name === 'company' && isCorporateOffsite) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
              return 'Company name is required';
            }
          }

          return null;
        }}
        mapToPayload={(formData: any) => {
          const fields = [
            { name: 'firstname', value: formData.eventDetails.firstname },
            { name: 'email', value: formData.eventDetails.email },
            { name: 'phone', value: formData.eventDetails.phone },
            {
              name: 'number_of_guest',
              value: formData.eventDetails.number_of_guest,
            },
          ];

          // Get city from location section for corporate-offsite, otherwise from eventDetails
          const cityValue = isCorporateOffsite
            ? formData.location?.city
            : formData.eventDetails.city;
          if (cityValue) {
            fields.push({ name: 'city', value: cityValue });
          }

          // Add company field if it exists (for corporate-offsite)
          if (isCorporateOffsite && formData.company?.company) {
            fields.push({
              name: 'company',
              value: formData.company.company,
            });
          }

          // Add date fields
          fields.push(
            {
              name: 'checkin',
              value: formatDateWithFullYear(formData.dateRange.checkin),
            },
            {
              name: 'check_out',
              value: formatDateWithFullYear(formData.dateRange.check_out),
            }
          );

          return { fields };
        }}
      />
    );
  }

  // Corporate Form Configuration
  if (formType === 'corporate') {
    return (
      <CommonForm
        className={className}
        sections={[
          { sectionKey: 'personalInfo', fields: corporateFields, columns: 2 },
          {
            sectionKey: 'personalInfo',
            fields: corporateFieldsCompanyName,
            columns: 1,
          },
          { sectionKey: 'message', fields: corporateFieldsMessage, columns: 1 },
        ]}
        endpoint={endpoint}
        validateField={({ name, value }) => {
          if (!value || (typeof value === 'string' && value.trim() === '')) {
            return 'This field is required';
          }

          if (name === 'email' && typeof value === 'string') {
            if (
              !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
            ) {
              return 'Invalid email address';
            }
          }

          if (name === 'phone' && typeof value === 'string') {
            const phoneLength = value.replace(/[^0-9]/g, '').length;
            if (phoneLength < 8) {
              return 'Phone number must be at least 8 digits';
            }
            if (phoneLength > 10) {
              return 'Phone number must not exceed 10 digits';
            }
          }

          return null;
        }}
        mapToPayload={(formData: any) => {
          const { firstname, lastname, email, phone, company, city } =
            formData.personalInfo;
          const message = formData.message?.message;
          return {
            fields: [
              { name: 'firstname', value: firstname },
              { name: 'lastname', value: lastname || '-' },
              { name: 'company', value: company },
              { name: 'email', value: email },
              { name: 'phone', value: phone },
              { name: 'city', value: city },
              { name: 'message', value: message },
            ],
          };
        }}
      />
    );
  }

  // Default Blog Form Configuration
  return (
    <CommonForm
      onClose={onClose}
      className={className}
      sections={[
        {
          sectionKey: 'personalInfo',
          sectionTitle: '',
          fields: blogFormFieldsPersonalDetails,
          columns: 2,
        },
        {
          sectionKey: 'location',
          sectionTitle: '',
          fields: blogFormFieldsLocation,
          columns: 1,
        },
        {
          sectionKey: 'guests',
          fields: blogFormFieldsGuests,
          columns: 1,
        },
        {
          sectionKey: 'dateRange',
          fields: blogFormFieldsBookingDetails,
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

        if (name === 'phone' && typeof value === 'string') {
          const phoneLength = value.replace(/[^0-9]/g, '').length;
          if (phoneLength < 8) {
            return 'Phone number must be at least 8 digits';
          }
          if (phoneLength > 10) {
            return 'Phone number must not exceed 10 digits';
          }
        }

        if (name === 'guests') {
          const numValue = typeof value === 'string' ? parseInt(value) : value;
          if (isNaN(numValue) || numValue < 1) {
            return 'Number of guests must be at least 1';
          }
        }

        return null;
      }}
      mapToPayload={(formData: any) => {
        const { personalInfo, location, dateRange, guests } = formData;
        return {
          fields: [
            { name: 'firstname', value: personalInfo.firstName },
            { name: 'lastname', value: personalInfo.lastName },
            { name: 'email', value: personalInfo.email },
            { name: 'phone', value: personalInfo.phone },
            {
              name: 'checkin',
              value: formatDateWithFullYear(dateRange.checkin),
            },
            {
              name: 'check_out',
              value: formatDateWithFullYear(dateRange.check_out),
            },
            { name: 'numberOfGuests', value: guests.guests.toString() },
            { name: 'city', value: location.location },
          ].filter((field) => field.value?.toString().trim() !== ''),
        };
      }}
    />
  );
};

export default SingleBlogPageForm;
