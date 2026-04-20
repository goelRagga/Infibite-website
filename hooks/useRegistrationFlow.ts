'use client';

import { useCallback, useState, useEffect } from 'react';
import { ChatMessage } from './useAIFaq';
import { MESSAGE_TYPE, AI_CHAT_HUBSPOT } from '@/lib/constants';
import { trackEvent } from '@/lib/mixpanel';
import { useLeadCapture } from './useLeadCapture';
import { generateRandomString } from '@/lib/utils';

export type RegistrationStep = 'pending' | 'registered';

export interface UserInfo {
  phone: string;
  countryCode: string;
  firstName: string;
  lastName: string;
}

// Submit user data to HubSpot (same fields as LeadForm)
const submitToHubSpot = async (data: {
  phone: string;
  firstName: string;
  propertyUrl: string;
}) => {
  try {
    const randomEmail = `ai${generateRandomString()}bot@elivaas.com`;
    const payload = {
      fields: [
        { name: 'firstname', value: data.firstName || 'AI Bot Lead' },
        { name: 'email', value: randomEmail },
        { name: 'phone', value: data.phone },
        {
          name: 'city',
          value: `URL: ${data.propertyUrl}`,
        },
      ],
    };

    const response = await fetch(AI_CHAT_HUBSPOT.ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('HubSpot submission failed:', await response.text());
    }
  } catch (error) {
    console.error('HubSpot submission error:', error);
  }
};

interface UseRegistrationFlowProps {
  propertyUrl?: string;
}

interface RegisterUserResult {
  firstName: string;
  lastName: string;
  phone: string;
  countryCode: string;
}

interface UseRegistrationFlowReturn {
  registrationStep: RegistrationStep;
  userInfo: UserInfo;
  isRegistered: boolean;
  wasRestoredFromStorage: boolean;
  // Returns parsed user data, does NOT set isRegistered yet
  processRegistration: (data: {
    name: string;
    phone: string;
    countryCode: string;
  }) => Promise<RegisterUserResult>;
  // Call this AFTER adding messages to complete registration
  completeRegistration: (data: RegisterUserResult) => void;
  resetRegistration: () => void;
}

// Helper to create AI message
export const createAIMessage = (text: string): ChatMessage => ({
  id: Date.now().toString(),
  type: MESSAGE_TYPE.AI,
  content: JSON.stringify({
    text_md: text,
    list: [],
    images: [],
    contact_info: { map_url: '', phone: '', whatsapp: '', urls: [] },
    suggestions: [],
  }),
  timestamp: new Date(),
});

/**
 * Hook to manage user registration flow before AI chat
 * @param propertyUrl - Current property page URL for HubSpot submission
 */
export function useRegistrationFlow({
  propertyUrl = '',
}: UseRegistrationFlowProps = {}): UseRegistrationFlowReturn {
  const [registrationStep, setRegistrationStep] =
    useState<RegistrationStep>('pending');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    phone: '',
    countryCode: '+91',
    firstName: '',
    lastName: '',
  });
  const [wasRestoredFromStorage, setWasRestoredFromStorage] = useState(false);

  // Use lead capture hook - same key used for FloatingCta lead form
  const {
    hasLeadCaptured: hasRegisteredBefore,
    markLeadCaptured: markAsRegistered,
    clearLeadCapture: clearRegistration,
  } = useLeadCapture();

  const isRegistered = registrationStep === 'registered';

  // Check localStorage on mount to restore registration state
  useEffect(() => {
    if (hasRegisteredBefore()) {
      setRegistrationStep('registered');
      setWasRestoredFromStorage(true);
    }
  }, [hasRegisteredBefore]);

  // Process registration data and submit to HubSpot, but don't set isRegistered yet
  const processRegistration = useCallback(
    async (data: {
      name: string;
      phone: string;
      countryCode: string;
    }): Promise<RegisterUserResult> => {
      // Parse first and last name
      const fullName = data.name.trim();
      const nameParts = fullName.split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Submit to HubSpot
      await submitToHubSpot({
        phone: `${data.countryCode}${data.phone}`,
        firstName: fullName,
        propertyUrl,
      });

      // Track registration
      trackEvent('ai_chat_user_registered', {
        phone: `${data.countryCode}${data.phone}`,
        firstName,
        lastName,
      });

      return {
        firstName,
        lastName,
        phone: data.phone,
        countryCode: data.countryCode,
      };
    },
    [propertyUrl]
  );

  // Complete registration - call this AFTER adding messages
  const completeRegistration = useCallback(
    (data: RegisterUserResult) => {
      setUserInfo({
        phone: data.phone,
        countryCode: data.countryCode,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      setRegistrationStep('registered');
      // Persist to localStorage so user doesn't need to register again on reload
      markAsRegistered();
    },
    [markAsRegistered]
  );

  const resetRegistration = useCallback(() => {
    setRegistrationStep('pending');
    setUserInfo({ phone: '', countryCode: '+91', firstName: '', lastName: '' });
    clearRegistration();
  }, [clearRegistration]);

  return {
    registrationStep,
    userInfo,
    isRegistered,
    wasRestoredFromStorage,
    processRegistration,
    completeRegistration,
    resetRegistration,
  };
}
