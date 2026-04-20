'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import PhoneNumberInput from '../../PhoneInputField';
import { Spinner } from '../../Spinner';
import { usePhoneContext } from '@/contexts/SharedProvider';
import FloatingLabelInput from '../../InputField/FloatingInput';

interface PhoneLoginFormProps {
  onPhoneLogin: (phoneNumber: string, countryCode: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function PhoneLoginForm({
  onPhoneLogin,
  isLoading,
  error,
}: PhoneLoginFormProps) {
  const { phoneNumber, setPhoneNumber, countryCode, setCountryCode } =
    usePhoneContext();

  const isValidMobileNumber = (phone: string) => {
    return phone.length >= 10 && /^\d+$/.test(phone);
  };

  const handleContinueClick = () => {
    if (!isValidMobileNumber(phoneNumber)) {
      return;
    }
    onPhoneLogin(phoneNumber, countryCode);
  };

  return (
    <div className='space-y-4'>
      <PhoneNumberInput
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        countryCode={countryCode}
        setCountryCode={setCountryCode}
      />
      {error && (
        <p className='text-xs text-accent-red-500 dark:text-white -mt-2'>
          {error}
        </p>
      )}{' '}
      <Button
        onClick={handleContinueClick}
        className='w-full h-12 bg-accent-red-900 hover:bg-accent-red-950 rounded-full font-medium disabled:bg-secondary-600 dark:bg-[var(--accent-text)] dark:text-white '
        disabled={
          !phoneNumber || !isValidMobileNumber(phoneNumber) || isLoading
        }
      >
        {isLoading ? <Spinner /> : 'Continue'}
      </Button>
    </div>
  );
}
