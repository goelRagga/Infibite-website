import React, { useMemo } from 'react';
import CustomImage from '../CustomImage';

interface OfferDetailsModalProps {
  code: string;
  title: string;
  description: string;
  icon: string;
  discountPercentage: number;
  maximumDiscountAllowed: number;
  minimumNights: number;
  endDateTime: string;
  termsAndConditions: string;
}

// Reusable detail card component
const DetailCard: React.FC<{
  label: string;
  value: string | number;
  bgColor: string;
  textColor: string;
}> = ({ label, value, bgColor, textColor }) => (
  <div
    className={`flex justify-between items-center p-3 ${bgColor} rounded-lg`}
  >
    <span className='font-medium'>{label}</span>
    <span className={textColor}>{value}</span>
  </div>
);

// Offer header component
const OfferHeader: React.FC<{ icon: string; code: string; title: string }> = ({
  icon,
  code,
  title,
}) => (
  <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg dark:bg-[var(--prive-background)]'>
    <div>
      <CustomImage src={icon} alt={code} width={40} height={40} />
    </div>
    <div>
      <h3 className='text-lg sm:text-xl font-semibold text-foreground'>
        {title}
      </h3>
      <p className='text-sm text-foreground/70'>Code: {code}</p>
    </div>
  </div>
);

// Content section component
const ContentSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className='p-4 bg-gray-50 rounded-lg dark:bg-[var(--prive-background)]'>
    <h4 className='font-semibold mb-2'>{title}</h4>
    {children}
  </div>
);

const OfferDetailsModal: React.FC<OfferDetailsModalProps> = ({
  code,
  title,
  description,
  icon,
  termsAndConditions,
}) => {
  return (
    <div className='grid gap-4 text-xs/5 sm:text-sm'>
      <OfferHeader icon={icon} code={code} title={title} />

      {/* <OfferDetailsGrid
        discountPercentage={discountPercentage}
        maximumDiscountAllowed={maximumDiscountAllowed}
        minimumNights={minimumNights}
        endDateTime={endDateTime}
      /> */}

      <ContentSection title='Description'>
        <p className='text-sm text-foreground/80'>{description}</p>
      </ContentSection>

      <ContentSection title='Terms & Conditions'>
        <div
          className='text-sm text-foreground/80 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>li]:mb-1'
          dangerouslySetInnerHTML={{ __html: termsAndConditions }}
        />
      </ContentSection>
    </div>
  );
};

export default OfferDetailsModal;
