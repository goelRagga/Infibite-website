'use client';

import React from 'react';
import CommonForm from '@/components/wordpressComponents/WPForms/CommonForm';
import {
  corporateFields,
  corporateFieldsCompanyName,
  corporateFieldsMessage,
} from '@/components/modules/ProfilePage/profilesidebarmenu/personaldetails/PersonalDetails';

const CorporatePageForm: React.FC<{
  className?: string;
  onClose?: () => void;
}> = ({ className = '' }) => {
  const endpoint =
    'https://api.hsforms.com/submissions/v3/integration/submit/44221819/aef72094-39be-47d5-8ce8-e279af857ed0';

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
      mapToPayload={(formData: any) => {
        const { firstname, lastname, email, phone, company } =
          formData.personalInfo;
        const message = formData.message?.message;
        return {
          fields: [
            { name: 'firstname', value: firstname },
            { name: 'lastname', value: lastname || '-' },
            { name: 'company', value: company },
            { name: 'email', value: email },
            { name: 'phone', value: phone },
            { name: 'message', value: message },
          ],
        };
      }}
    />
  );
};

export default CorporatePageForm;
