'use client';

import React from 'react';
import CommonForm from '@/components/wordpressComponents/WPForms/CommonForm';
import {
  contactFormFields,
  contactFormFieldsMessage,
} from '@/components/modules/ProfilePage/profilesidebarmenu/personaldetails/PersonalDetails';

const ContactPageForm: React.FC<{
  className?: string;
  onClose?: () => void;
}> = ({ className = '' }) => {
  const endpoint =
    'https://api.hsforms.com/submissions/v3/integration/submit/44221819/e24ac1fb-c473-4ebe-9b88-43d5c465749a';

  return (
    <CommonForm
      className={className}
      sections={[
        { sectionKey: 'personalInfo', fields: contactFormFields, columns: 2 },
        { sectionKey: 'message', fields: contactFormFieldsMessage, columns: 1 },
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

        return null;
      }}
      mapToPayload={(formData: any) => ({
        fields: [
          { name: 'firstname', value: formData.personalInfo.fullName },
          { name: 'company', value: formData.personalInfo.company },
          { name: 'email', value: formData.personalInfo.email },
          { name: 'phone', value: formData.personalInfo.phone },
          { name: 'message', value: formData.message.message },
        ],
      })}
    />
  );
};

export default ContactPageForm;
