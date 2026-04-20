'use client';

import React from 'react';
import CommonForm from '@/components/wordpressComponents/WPForms/CommonForm';
import { partnerFormFields } from '@/components/modules/ProfilePage/profilesidebarmenu/personaldetails/PersonalDetails';

const PartnerPageForm: React.FC<{
  className?: string;
  onClose?: () => void;
}> = ({ className = '' }) => {
  const endpoint =
    'https://api.hsforms.com/submissions/v3/integration/submit/44221819/14e51039-5fed-4f66-83e3-f2e515e8eb5f';

  return (
    <CommonForm
      className={className}
      sections={[
        { sectionKey: 'partner', fields: partnerFormFields, columns: 1 },
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
          { name: 'firstname', value: formData.partner.fullName },
          { name: 'email', value: formData.partner.email },
          { name: 'phone', value: formData.partner.phone },
          { name: 'property_location', value: formData.partner.location },
        ],
      })}
    />
  );
};

export default PartnerPageForm;
