'use client';

import React from 'react';
import ElivaasEYLogo from '@/assets/elivaasEYLogo.svg';
import ElivaasDarkLogo from '@/assets/elivaasDark.svg';
import EYPageForm from '@/components/wordpressComponents/WPForms/EYPageForm';
import { EYFormSectionProps } from 'EY-FormSection';
import Svg from '@/components/common/Shared/Svg';
import { cn } from '@/lib/utils';

const EYFormSection: React.FC<EYFormSectionProps> = ({
  logo,
  regexpage,
  svgClassName,
}) => {
  return (
    <>
      <div className='flex gap-3 items-center w-full'>
        <ElivaasDarkLogo />{' '}
        {logo && (
          <Svg
            src={logo}
            className={svgClassName ? svgClassName : 'h-10 sm:h-12'}
          />
        )}{' '}
        {!logo && <ElivaasEYLogo />}
      </div>

      <div>
        <EYPageForm regexpage={regexpage} />
      </div>
    </>
  );
};

export default EYFormSection;
