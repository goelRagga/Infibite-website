'use client';

import WhatsappIcon from '@/assets/whatsappWhite.svg';
import { trackEvent } from '@/lib/mixpanel';
import { whatsAppNumber } from '@/lib/constants';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface floatingWhatsAppProps {
  events?: any;
}

const WhatsAppComponent: React.FC<floatingWhatsAppProps> = ({ events }) => {
  const [isSource, setSource] = useState<any>('');
  const searchParams = useSearchParams();
  const utmSource = useRef(searchParams?.get('utm_source'));

  useEffect(() => {
    if (utmSource?.current) {
      localStorage.setItem('utm_source', utmSource?.current);
    }
  }, [utmSource]);

  useEffect(() => {
    if (localStorage?.getItem('utm_source')) {
      setSource(localStorage.getItem('utm_source'));
    }
  }, [localStorage?.getItem('utm_source')]);

  const whatsappEventTrack = () => {
    trackEvent('whatsapp_floater_clicked', events);
  };

  // Determine the message based on utm_source
  const message = useMemo(() => {
    switch (isSource) {
      case 'google':
        return 'Hello%2C+Please+assist+me+to+book+a+luxurious+stay+with+ELIVAAS.';
      case 'adwords':
        return 'Hello%2C+Please+assist+me+to+book+a+luxurious+stay+with+ELIVAAS.';
      case 'fb':
        return 'Hey%2C+Please+assist+me+to+book+a+luxurious+stay+with+ELIVAAS.';
      default:
        return 'Hey+there%2C+Please+assist+me+to+book+a+luxurious+stay+with+ELIVAAS.';
    }
  }, [isSource]);

  return (
    <div className='relative w-[42px] h-[42px] sm:w-[70px] sm:h-[70px] rounded-full bg-white shadow-lg flex justify-center items-center z-20 overflow-hidden cursor-pointer '>
      <Link
        href={`https://api.whatsapp.com/send/?phone=${whatsAppNumber}&text=${message}&type=phone_number&app_absent=0`}
        onClick={whatsappEventTrack}
        target='_blank'
        className='flex justify-center items-center w-full h-full'
      >
        <div className='icon'>
          <WhatsappIcon className='w-[22px] h-[22px] sm:w-[35px] sm:h-[35px]  transition-transform duration-300 hover:scale-110 text-green-600' />
        </div>
      </Link>
    </div>
  );
};

WhatsAppComponent.displayName = 'WhatsAppComponent';

export default React.memo(WhatsAppComponent);
