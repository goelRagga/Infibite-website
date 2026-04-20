'use client';

import { Phone } from 'lucide-react';
import { trackEvent } from '@/lib/mixpanel';
import { phoneNumber } from '@/lib/constants';
import React, { useEffect, useRef } from 'react';

export interface floatingCtaProps {
  isDefault: boolean;
  useTel1?: boolean;
  customeNumber?: string;
  phoneNumber1?: string;
  events?: any;
}

let hasAppendedElfsight = false;

const PhoneCTA: React.FC<floatingCtaProps> = ({
  isDefault,
  useTel1,
  customeNumber,
  phoneNumber1,
  events,
}) => {
  const elfsightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasAppendedElfsight && elfsightRef.current) {
      const el = document.createElement('div');
      el.className = useTel1
        ? 'elfsight-app-1a86950f-d047-45a7-a013-fcb439ef12ab'
        : 'elfsight-app-08ba2da2-4df4-4aa9-a904-cd2fa717f057';
      el.setAttribute('data-elfsight-app-lazy', '');
      elfsightRef.current.appendChild(el);

      hasAppendedElfsight = true;

      // Optionally trigger Elfsight to re-scan
      if ((window as any).Elfsight) {
        (window as any).Elfsight.load();
      }
    }
  }, [useTel1]);

  const callEventTrack = () => {
    trackEvent('call_us_floater_clicked', {
      page_name: events?.page_name,
      property_id: events?.property_id,
      property_name: events?.property_name,
      is_checkin_out_entered: events?.is_checkin_out_entered,
    });
  };

  return (
    <div
      className={`relative w-[42px] h-[42px] sm:w-[70px] sm:h-[70px] rounded-full bg-white shadow-lg flex justify-center items-center z-20 overflow-hidden cursor-pointer ${
        isDefault ? 'sm:bg-white' : ''
      }`}
    >
      <a
        href={`tel:${customeNumber ? customeNumber : useTel1 ? phoneNumber1 : phoneNumber}`}
        onClick={callEventTrack}
        className='flex justify-center items-center w-full h-full'
      >
        <button
          className={`w-full h-full rounded-full flex justify-center items-center transition-all duration-300 hover:scale-110 ${
            isDefault
              ? 'bg-white border-white'
              : 'bg-accent-red-900 border-accent-red-900'
          }`}
        >
          <div className='icon'>
            <Phone
              className={`w-[22px] h-[22px] sm:w-[35px] sm:h-[35px] transition-transform duration-300 hover:scale-110 text-green-600 ${
                isDefault ? 'text-red-500' : 'text-white'
              }`}
            />
          </div>
        </button>
      </a>
      <div ref={elfsightRef}></div>
    </div>
  );
};

PhoneCTA.displayName = 'PhoneCTA';

export default React.memo(PhoneCTA);
