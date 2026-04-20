'use client';
import Phone from './Phone';
import WhatsAppComponent from './WhatsApp';
import { floatingCtaProps } from 'floatingCta-props';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, Suspense, useRef } from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import Lead from './Lead';
import Cookies from 'js-cookie';
import {
  corporateOffsitePhoneNumber,
  visaPhoneNumber,
  delhiPhoneNumber,
  goaPhoneNumber,
  maharashtraPhoneNumber,
  uttarakhandPhoneNumber,
} from '@/lib/constants';

const CITY_PHONE_NUMBERS: Record<string, string> = {
  delhi: delhiPhoneNumber,
  goa: goaPhoneNumber,
  corporate: corporateOffsitePhoneNumber,
  visa: visaPhoneNumber,
  alibaug: maharashtraPhoneNumber,
  igatpuri: maharashtraPhoneNumber,
  karjat: maharashtraPhoneNumber,
  lonavala: maharashtraPhoneNumber,
  nashik: maharashtraPhoneNumber,
  maharashtra: maharashtraPhoneNumber,
  uttarakhand: uttarakhandPhoneNumber,
  bhimtal: uttarakhandPhoneNumber,
  dehradun: uttarakhandPhoneNumber,
  haridwar: uttarakhandPhoneNumber,
  mukteshwar: uttarakhandPhoneNumber,
  mussoorie: uttarakhandPhoneNumber,
  nainital: uttarakhandPhoneNumber,
  ramnagar: uttarakhandPhoneNumber,
  ranikhet: uttarakhandPhoneNumber,
};

const FloatingCtaContent: React.FC<floatingCtaProps> = ({
  page,
  bottom,
  isWhatsApp = true,
  isPhone = true,
  isLead = true,
  customeNumber,
  events,
}) => {
  const searchParams = useSearchParams();
  const [showWhatsApp, setShowWhatsApp] = useState<boolean>(true);
  const [showPhone, setShowPhone] = useState<boolean>(true);
  const [useTel1, setuseTel1] = useState<boolean>(false);
  const [showIsDefault, setIsDefault] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const campaignApiCalled = useRef(false);
  // Non-blocking campaign API call using requestIdleCallback
  useEffect(() => {
    if (campaignApiCalled.current) return;
    campaignApiCalled.current = true;

    const makeCampaignApiCall = () => {
      try {
        // Get UTM parameters from cookies
        const utmSource = Cookies.get('utm_source') || '';
        const utmMedium = Cookies.get('utm_medium') || '';
        const utmCampaign = Cookies.get('utm_campaign') || '';
        const utmTerm = Cookies.get('utm_term') || '';
        const userUniqueId = Cookies.get('user_unique_id') || '';

        // Only proceed if mandatory fields exist (userUniqueId and utmCampaign)
        if (!userUniqueId || !utmCampaign) {
          return;
        }

        // Create a unique key from current UTM values
        const currentUtmKey = `${utmSource}|${utmMedium}|${utmCampaign}|${utmTerm}`;
        const storedUtmKey = localStorage.getItem('campaign_api_utm_key');

        // Skip if UTM params haven't changed since last API call
        if (storedUtmKey === currentUtmKey) {
          return;
        }

        const payload = {
          user_id: userUniqueId,
          unique_id: utmCampaign,
          meta: {
            source: utmSource,
            medium: utmMedium,
            campaign: utmCampaign,
            term: utmTerm,
          },
          platform: 'elivaas_website',
        };

        // Fire and forget - non-blocking API call
        fetch('https://gxm-service.app9.elivaas.com/api/campaign/update', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
          .then(() => {
            // Store the UTM key after successful API call
            localStorage.setItem('campaign_api_utm_key', currentUtmKey);
          })
          .catch(() => {
            // Silently fail - this is a non-critical tracking call
          });
      } catch {
        // Silently fail
      }
    };

    // Use requestIdleCallback for non-blocking execution, with setTimeout fallback
    if ('requestIdleCallback' in window) {
      (window as Window).requestIdleCallback(makeCampaignApiCall, {
        timeout: 3000,
      });
    } else {
      setTimeout(makeCampaignApiCall, 2000);
    }
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      // Try all possible case variations for WhatsApp parameter
      const whatsAppParam =
        searchParams?.get('isWhatsApp') ||
        searchParams?.get('isWhatsapp') ||
        searchParams?.get('iswhatsapp');

      const defaultActionParam = searchParams?.get('isDefaultCTA');

      const phoneParam = searchParams?.get('isPhoneCall');
      const tel1Param = searchParams?.get('isTel1');

      // Handle WhatsApp visibility
      if (whatsAppParam !== null) {
        const shouldShowWhatsApp = whatsAppParam.toLowerCase() === 'true';
        setShowWhatsApp(shouldShowWhatsApp);
        localStorage.setItem('isWhatsApp', String(shouldShowWhatsApp));
      } else {
        const whatsAppLocal = localStorage.getItem('isWhatsApp');
        if (whatsAppLocal !== null) {
          setShowWhatsApp(whatsAppLocal.toLowerCase() === 'true');
        }
      }

      // Handle Phone visibility
      if (phoneParam !== null) {
        const shouldShowPhone = phoneParam.toLowerCase() === 'true';
        setShowPhone(shouldShowPhone);
        localStorage.setItem('isPhoneCall', String(shouldShowPhone));
      } else {
        const phoneLocal = localStorage.getItem('isPhoneCall');
        if (phoneLocal !== null) {
          setShowPhone(phoneLocal.toLowerCase() === 'true');
        }
      }

      if (tel1Param !== null) {
        const shouldShowPhone = tel1Param.toLowerCase() === 'true';
        setuseTel1(shouldShowPhone);
      }

      // isTel1 ✅
      if (tel1Param !== null) {
        const shouldSetTel1 = tel1Param.toLowerCase() === 'true';
        localStorage.setItem('isTel1', String(shouldSetTel1));
      } else {
        const isTel1Local = localStorage.getItem('isTel1');
        if (isTel1Local !== null) {
          setuseTel1(isTel1Local.toLowerCase() === 'true');
        } else {
          setuseTel1(false);
        }
      }

      // Handle dafaul visibility
      if (defaultActionParam !== null) {
        const shouldShowDefault = defaultActionParam.toLowerCase() === 'true';
        setIsDefault(shouldShowDefault);
        localStorage.setItem('isDefaultCTA', String(shouldShowDefault));
      } else {
        const isDefaultCTA = localStorage.getItem('isDefaultCTA');
        const phoneLocal = localStorage.getItem('isPhoneCall');
        if (isDefaultCTA !== null) {
          setIsDefault(
            isDefaultCTA?.toLowerCase() === 'true' &&
              phoneLocal?.toLowerCase() !== 'true'
          );
        }
      }
    };

    handleVisibility();
  }, [searchParams]);

  const phoneNumber =
    page && CITY_PHONE_NUMBERS[page.toLowerCase().trim()]
      ? CITY_PHONE_NUMBERS[page.toLowerCase().trim()]
      : customeNumber;

  return (
    <div
      className={`fixed right-2 sm:right-3 z-20 inline-grid gap-4 w-15 bottom-8 sm:right-14 sm:w-10 sm:bottom-20`}
      style={{ bottom: bottom ? `calc(${bottom} + 10px)` : undefined }}
    >
      {showWhatsApp && isWhatsApp && <WhatsAppComponent events={events} />}
      {showPhone && isPhone && isMobile && (
        <Phone
          useTel1={useTel1}
          customeNumber={phoneNumber}
          isDefault={showIsDefault}
          events={events}
        />
      )}
      {isLead && <Lead />}
    </div>
  );
};

FloatingCtaContent.displayName = 'FloatingCtaContent';

const FloatingCta: React.FC<floatingCtaProps> = (props) => {
  const isCorporateChannel =
    Cookies.get('isCorporateChannel') &&
    Cookies.get('utm_source') === 'hotelzify';
  return (
    <Suspense
      fallback={
        <div className='fixed right-2 sm:right-3 z-20 inline-grid gap-4 w-15 bottom-8 sm:right-14 sm:w-10 sm:bottom-20' />
      }
    >
      {!isCorporateChannel && <FloatingCtaContent {...props} />}
    </Suspense>
  );
};

FloatingCta.displayName = 'FloatingCta';

export default React.memo(FloatingCta);
