'use client';

import React from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import ContactPageForm from '@/components/wordpressComponents/WPForms/ContactPageForm';

const FormSectionContactPage: React.FC<{}> = ({}) => {
  const isMobile = useIsMobile();

  const getInTouch = 'Get in Touch, Anytime';

  return (
    <>
      <div
        className='w-full h-full p-0 md:p-6 rounded-2xl md:h-100 overflow-hidden'
        style={{
          background: !isMobile ? 'var(--white3)' : '',
        }}
      >
        {!isMobile && (
          <h2 className='text-2xl text-foreground font-serif mb-1'>
            {getInTouch}
          </h2>
        )}

        <ContactPageForm onClose={() => {}} />
      </div>
    </>
  );
};

export default FormSectionContactPage;
