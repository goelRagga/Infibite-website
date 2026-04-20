'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import React, { memo, useCallback, useMemo, useState } from 'react';

import OtpDialog from '@/components/modules/ProfilePage/profilesidebarmenu/personaldetails/OtpDialog';
import { Label } from '@/components/ui/label';
import countryCodes from '@/lib/countryCodes.json';
import { cn } from '@/lib/utils';

interface PhoneNumberInputProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  countryCode: string;
  setCountryCode: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  isVerified?: boolean;
  isCountryCode?: boolean;
  labelClassName?: string;
  isChatbot?: boolean;
}

interface Country {
  name: string;
  dial_code: string;
  code: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = memo(
  ({
    phoneNumber,
    setPhoneNumber,
    countryCode,
    setCountryCode,
    placeholder = 'Enter Mobile Number',
    disabled = false,
    error,
    isVerified = false,
    isCountryCode = true,
    labelClassName,
    isChatbot = false,
  }) => {
    const [otpOpen, setOtpOpen] = useState(false);

    const isInputDisabled = useMemo(() => isVerified, [isVerified]);

    const showClear = useMemo(
      () =>
        !isInputDisabled &&
        phoneNumber &&
        phoneNumber.length > 0 &&
        !isVerified,
      [isInputDisabled, phoneNumber, isVerified]
    );

    const handlePhoneChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numeric characters and max 10 digits
        const numericValue = e.target.value.replace(/[^0-9]/g, '');
        if (numericValue.length <= 10) {
          setPhoneNumber(numericValue);
        }
      },
      [setPhoneNumber]
    );

    const handleCountryCodeChange = useCallback(
      (val: string) => {
        setCountryCode(val);
      },
      [setCountryCode]
    );

    const handleClear = useCallback(() => {
      setPhoneNumber('');
    }, [setPhoneNumber]);

    const handleOtpClose = useCallback(() => {
      setOtpOpen(false);
    }, []);

    const countryOptions = useMemo(() => {
      const uniqueDialCodesMap = new Map<string, Country>();

      countryCodes.forEach((country) => {
        if (!uniqueDialCodesMap.has(country.dial_code)) {
          uniqueDialCodesMap.set(country.dial_code, country);
        }
      });

      const uniqueCountries = Array.from(uniqueDialCodesMap.values());

      return uniqueCountries.map((country) => (
        <SelectItem
          key={country.dial_code}
          value={country.dial_code}
          className={cn(
            'typography-body-regular cursor-pointer',
            isChatbot
              ? 'focus:bg-gray-100 text-gray-900 hover:bg-gray-100'
              : 'focus:bg-gray-100 dark:focus:bg-[var(--grey8)]'
          )}
        >
          {country.dial_code}
        </SelectItem>
      ));
    }, [countryCodes, isChatbot]);

    const containerClassName = useMemo(
      () =>
        cn(
          `relative flex items-center border rounded-xl overflow-hidden mt-0 focus-within:ring-0 dark:focus-within:ring-0 h-[56px]`,
          isChatbot ? 'bg-white' : 'bg-white dark:bg-[var(--grey8)]',
          'dark:border-gray-200',
          error
            ? 'border-red-500'
            : isInputDisabled
              ? 'border-gray-200'
              : 'border-gray-200'
        ),
      [error, isInputDisabled, isChatbot]
    );

    const inputClassName = useMemo(
      () =>
        cn(
          `peer pt-5 pb-1 h-[68px] md:h-14 px-6 rounded-none shawdow-none border-0 focus-visible:ring-0 focus-visible:border-0 focus:outline-none focus:ring-2`,
          isChatbot
            ? 'bg-white text-gray-900'
            : 'bg-white dark:bg-[var(--brown2)]',
          error ? 'border-red-500' : 'border-primary-100',
          isInputDisabled && 'text-typography-label-semibold cursor-not-allowed'
        ),
      [error, isInputDisabled, isChatbot]
    );

    const selectTriggerClassName = useMemo(
      () =>
        cn(
          `w-24 md:w-24 cursor-pointer border-0 bg-transparent h-full shadow-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 md:p-4 ${
            isVerified ? 'opacity-50 cursor-not-allowed' : ''
          }`,
          isChatbot
            ? 'text-gray-400 [&_[data-slot=select-value]]:!text-gray-400 [&_span]:!text-gray-400 [&_*]:!text-gray-400'
            : 'text-black [&_[data-slot=select-value]]:!text-black [&_span]:!text-black [&_*]:!text-black'
        ),
      [isVerified, isChatbot]
    );

    return (
      <div className='w-full md:h-[56px]'>
        <div className={containerClassName}>
          {isCountryCode && (
            <Select
              value={countryCode}
              onValueChange={handleCountryCodeChange}
              disabled={isVerified}
            >
              <SelectTrigger
                className={cn(
                  selectTriggerClassName,
                  'py-8.5 md:py-7 md:border-0 border-0 rounded-tr-none rounded-br-none md:rounded-tr-none md:rounded-br-none'
                )}
              >
                <SelectValue
                  placeholder='+91'
                  className={isChatbot ? '!text-gray-400' : '!text-black'}
                />
              </SelectTrigger>
              <SelectContent
                className={cn(
                  'max-h-60 overflow-y-auto shadow-none border border-gray-200 cursor-pointer',
                  isChatbot ? 'bg-white' : 'dark:bg-background'
                )}
              >
                {countryOptions}
              </SelectContent>
            </Select>
          )}

          <div className='relative w-full md:h-[56px] '>
            <Input
              id='phone'
              type='tel'
              placeholder=' '
              className={inputClassName}
              value={phoneNumber}
              disabled={isVerified}
              onChange={handlePhoneChange}
            />

            <Label
              htmlFor='phone'
              className={cn(
                `absolute top-2 text-sm transition-all px-6 md:peer-placeholder-shown:top-5 peer-placeholder-shown:top-6 md:peer-focus:top-2 peer-focus:top-2 peer-focus:text-sm typography-small-regular ${isChatbot ? 'text-gray-400!' : 'dark:text-white'}`,
                labelClassName ||
                  'text-[var(--primary-500)] peer-focus:text-[var(--primary-500)]'
              )}
            >
              Enter Mobile Number
            </Label>

            {isInputDisabled && (
              <span className='absolute right-3 top-1/2 -translate-y-1/2 text-[var(--accent-green-700)] typography-label-semibold'>
                Verified
              </span>
            )}

            {showClear && (
              <button
                type='button'
                onClick={handleClear}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black'
              >
                <X className='w-4 h-4' />
              </button>
            )}
          </div>
        </div>

        {error && <p className='text-sm text-red-500 mt-1'>{error}</p>}

        {otpOpen && <OtpDialog open={otpOpen} onClose={handleOtpClose} />}
      </div>
    );
  }
);

PhoneNumberInput.displayName = 'PhoneNumberInput';

export default PhoneNumberInput;
