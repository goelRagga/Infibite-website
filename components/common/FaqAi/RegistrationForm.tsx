'use client';

import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import Image from 'next/image';
import PhoneNumberInput from '@/components/common/PhoneInputField';
import { AI_CHAT_MESSAGES } from '@/lib/constants';

const { REGISTRATION } = AI_CHAT_MESSAGES;

// Typing text animation component
const TypingText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: delay / 1000 }}
    >
      {text}
    </motion.span>
  );
};

interface RegistrationFormProps {
  onSubmit: (data: {
    name: string;
    phone: string;
    countryCode: string;
  }) => Promise<void>;
  onComplete: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSubmit,
  onComplete,
}) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validate name - only letters and spaces allowed
  const isValidName = (value: string): boolean => {
    return /^[a-zA-Z\s]+$/.test(value.trim());
  };

  const validateForm = useCallback(() => {
    const newErrors: { name?: string; phone?: string } = {};

    if (!name.trim()) {
      newErrors.name = REGISTRATION.ERROR_NAME_REQUIRED;
    } else if (!isValidName(name)) {
      newErrors.name = REGISTRATION.ERROR_NAME_INVALID;
    }

    if (!phoneNumber.trim()) {
      newErrors.phone = REGISTRATION.ERROR_PHONE_REQUIRED;
    } else if (phoneNumber.length !== 10) {
      newErrors.phone = REGISTRATION.ERROR_PHONE_INVALID;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, phoneNumber]);

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm() || isLoading) return;

      setIsLoading(true);
      try {
        await onSubmit({
          name: name.trim(),
          phone: phoneNumber,
          countryCode,
        });
        // Directly complete registration and go to chat
        onComplete();
      } finally {
        setIsLoading(false);
      }
    },
    [
      name,
      phoneNumber,
      countryCode,
      validateForm,
      onSubmit,
      isLoading,
      onComplete,
    ]
  );

  const isFormValid =
    name.trim() && isValidName(name) && phoneNumber.length === 10;

  return (
    <div className='h-full p-4 bg-white overflow-y-auto'>
      {/* Greeting Message */}
      <div className='max-w-[85%] rounded-lg px-3 mb-4 py-2 relative rounded-tl-none bg-primary-50 text-gray-800'>
        <h1 className='text-sm sm:text-md font-bold text-accent-red-900'>
          <TypingText text={REGISTRATION.GREETING_TITLE_1} delay={0} />
          <TypingText text={REGISTRATION.GREETING_TITLE_2} delay={200} />
        </h1>
        <motion.p
          className='text-xs text-gray-600 mt-1'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {REGISTRATION.GREETING_SUBTITLE}
        </motion.p>
      </div>

      {/* Registration Form with Promo Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1 }}
        className='bg-primary-50 rounded-2xl p-5 relative overflow-hidden border border-primary-100'
      >
        {/* Discount icon */}
        <div className='absolute top-4 right-4'>
          <Image
            src='/assets/discount.svg'
            alt='Discount'
            width={34}
            height={34}
          />
        </div>

        {/* Promo Header */}
        <h2 className='text-xl font-serif font-normal mb-2 text-[#533D3B]'>
          {REGISTRATION.PROMO_TITLE}
        </h2>
        <p className='text-sm text-primary-700 pr-12 mb-4'>
          {REGISTRATION.PROMO_DESCRIPTION}
        </p>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className='flex flex-col gap-4'>
          {/* Name Field */}
          <div className='space-y-1'>
            <Label htmlFor='name' className='text-sm font-medium text-gray-700'>
              {REGISTRATION.LABEL_NAME}
            </Label>
            <Input
              id='name'
              type='text'
              placeholder={REGISTRATION.PLACEHOLDER_NAME}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className={`h-12 rounded-xl border-gray-200! bg-white! text-primary-950! placeholder:text-gray-400! focus:border-accent-red-900 ${
                errors.name ? 'border-red-500' : 'border-gray-200!'
              }`}
            />
            {errors.name && (
              <p className='text-xs text-red-500'>{errors.name}</p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className='space-y-1'>
            <Label className='text-sm font-medium text-gray-700'>
              {REGISTRATION.LABEL_PHONE}
            </Label>
            <PhoneNumberInput
              isChatbot={true}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              disabled={isLoading}
              error={errors.phone}
              labelClassName='text-gray-400 peer-focus:text-gray-400'
            />
          </div>
          {/* Submit Button */}
          <Button
            type='submit'
            disabled={!isFormValid || isLoading}
            className={`w-full h-12 mt-2 rounded-full font-medium text-white bg-accent-red-900 hover:bg-accent-red-950 ${
              !isFormValid || isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading
              ? REGISTRATION.BUTTON_REGISTERING
              : REGISTRATION.BUTTON_CONTINUE}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default RegistrationForm;
