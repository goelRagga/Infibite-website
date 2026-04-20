'use client';

import DetailsForm from '@/components/common/DetailsForm';
import { eyFormEmailField } from '@/components/modules/ProfilePage/profilesidebarmenu/personaldetails/PersonalDetails';
import { Button } from '@/components/ui';
import {
  CHECK_AUTHENTICATION_EMAIL,
  GENERATE_OTP_EMAIL,
  GET_USER_DETAILS,
} from '@/lib/queries';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import OtpInput from 'react-otp-input';
import { useClient } from 'urql';

interface EYPageFormProps {
  className?: string;
  regexpage?: 'ey' | 'burnsmcd' | 'tbo';
}

const EYPageForm: React.FC<EYPageFormProps> = ({
  className = '',
  regexpage,
}) => {
  const router = useRouter();
  const client = useClient();

  // State variables
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [email, setEmail] = useState('');
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(30);
  const [emailTouched, setEmailTouched] = useState(false);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState({});
  const [inlineHTML, setInlineHTML] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data state for DetailsForm component
  const [formData, setFormData] = useState({
    personalInfo: {
      email: '',
    },
  });
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>(
    {}
  );

  // Email validation function
  const validateEmail = (email: string): boolean => {
    const eyRegex = /^[^\s@]+@(elivaas\.com|ey\.in|in\.ey\.com)$/i;
    const burnsmcdRegex = /^[^\s@]+@(elivaas\.com|burnsmcd\.in|burnsmcd\.in)$/i;
    const tboRegex = /^[^\s@]+@(elivaas\.com|tbo\.com)$/i;

    const regex =
      regexpage === 'burnsmcd'
        ? burnsmcdRegex
        : regexpage === 'tbo'
          ? tboRegex
          : eyRegex;
    return regex.test(email);
  };

  // Timer effect for OTP expiration
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (showOtpSection && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsOtpExpired(true);
            clearInterval(interval!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showOtpSection, timer]);

  // Handle form data changes from DetailsForm
  const handleSectionChange = (
    section: 'personalInfo',
    updated: Partial<(typeof formData)[typeof section]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updated,
      },
    }));

    // Update email state when form data changes
    if (updated.email !== undefined) {
      setEmail(updated.email);
      handleEmailChange({
        target: { value: updated.email },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  // Handle email input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Update form data
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        email: value,
      },
    }));

    if (emailTouched) {
      if (!value) {
        setEmailError('Email is required');
        setFormErrors((prev) => ({ ...prev, email: 'Email is required' }));
      } else if (!validateEmail(value)) {
        const eyMessage =
          'Please enter a valid EY email (@in.ey.com, @elivaas.com)';
        const burnsmcdMessage =
          'Please enter a valid burnsmcd email (@burnsmcd.in)';
        const tboMessage = 'Please enter a valid TBO email (@tbo.com)';

        const errorMsg =
          regexpage == 'burnsmcd'
            ? burnsmcdMessage
            : regexpage == 'tbo'
              ? tboMessage
              : eyMessage;
        setEmailError(errorMsg);
        setFormErrors((prev) => ({ ...prev, email: errorMsg }));
      } else {
        setEmailError('');
        setFormErrors((prev) => ({ ...prev, email: null }));
      }
    }
  };

  // Handle initial form submission (send OTP)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailTouched(true);

    if (!email.trim()) {
      setEmailError('Email is required');
      setFormErrors((prev) => ({ ...prev, email: 'Email is required' }));
      return;
    }

    if (!validateEmail(email)) {
      const eyMessage =
        'Please enter a valid EY email (@in.ey.com, @elivaas.com)';
      const burnsmcdMessage =
        'Please enter a valid burnsmcd email (@burnsmcd.in)';
      const tboMessage = 'Please enter a valid TBO email (@tbo.com)';

      const errorMsg =
        regexpage == 'burnsmcd'
          ? burnsmcdMessage
          : regexpage == 'tbo'
            ? tboMessage
            : eyMessage;
      setEmailError(errorMsg);
      setFormErrors((prev) => ({ ...prev, email: errorMsg }));
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const result = await client
        .query(GENERATE_OTP_EMAIL, { email })
        .toPromise();

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Success
      setShowOtpSection(true);
      setTimer(30);
      setIsOtpExpired(false);
      setEmailError('');
      setFormErrors((prev) => ({ ...prev, email: null }));
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to send OTP';
      setEmailError(errorMsg);
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // Handle OTP input changes
  const handleOtpChange = (newOtp: string[]) => {
    setOtp(newOtp);
    setOtpError(null);
  };

  // Fetch user details after successful authentication
  const fetchUserDetails = async (
    accessToken: string,
    refreshToken: string
  ) => {
    try {
      const result = await client
        .query(
          GET_USER_DETAILS,
          {},
          {
            fetchOptions: {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          }
        )
        .toPromise();

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.data) {
        const updatedObj = result.data?.me;
        const userDataObj = {
          ...userData,
          ...updatedObj,
        };

        setUserData(userDataObj);
        Cookies.set('userData', JSON.stringify(userDataObj) || '', {
          expires: 30,
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Handle OTP verification
  const handleOtpVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      setOtpError('Please enter all 6 digits');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await client
        .query(
          CHECK_AUTHENTICATION_EMAIL,
          { code, email },
          {
            fetchOptions: {
              headers: {
                'Channel-Id': process.env.NEXT_PUBLIC_CHANNEL_ID || '',
              },
            },
          }
        )
        .toPromise();

      if (result.error) {
        throw new Error(result.error.message);
      }

      const authData = result.data?.authenticateEmail;

      if (authData?.accessToken) {
        Cookies.set('accessToken', authData.accessToken || '', { expires: 30 });
        Cookies.set('refreshToken', authData.refreshToken || '', {
          expires: 30,
        });

        await fetchUserDetails(authData.accessToken, authData.refreshToken);

        setTimeout(() => {
          router.push('/');
        }, 100);
      }
    } catch (err: any) {
      setOtpError(err.message || 'OTP verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP resend
  const handleResendOtp = async () => {
    if (!email || emailError) return;

    try {
      const result = await client
        .query(
          GENERATE_OTP_EMAIL,
          { email },
          {
            fetchOptions: {
              headers: {
                'Channel-Id': process.env.NEXT_PUBLIC_CHANNEL_ID || '',
              },
            },
          }
        )
        .toPromise();

      if (result.error) {
        throw new Error(result.error.message);
      }

      // Reset OTP state
      setOtp(Array(6).fill(''));
      setOtpError(null);
      setTimer(30);
      setIsOtpExpired(false);
    } catch (err: any) {
      setEmailError(err.message || 'Failed to resend OTP');
    }
  };

  // Format timer display
  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const welcomeTitle = 'Welcome to ELIVAAS';
  const welcomeDescription =
    'Unlock exclusive benefits by entering your official EY email address.';
  const welcomeDescriptionCorporateBNM =
    'Unlock exclusive benefits by entering your official BURNS and McDONNELL email address.';
  const welcomeDescriptionCorporateTBO =
    'Unlock exclusive benefits by entering your official TBO email address.';
  const verifyEmail = 'Verify Email';
  const verifyDescription = 'Enter the verification code sent to';
  const resendOTPIn = 'Resend OTP in';
  const notReceiveCode = 'Didn’t receive a code?';
  const resendOTP = 'Resend OTP';

  return (
    <>
      {inlineHTML ? (
        <div
          className='mt-10'
          dangerouslySetInnerHTML={{ __html: inlineHTML }}
        />
      ) : (
        <>
          {!showOtpSection && (
            <div className='mt-5 md:mt-10 mb-0 sm:mb-6'>
              <h1 className='text-foreground text-lg md:text-2xl font-serif'>
                {welcomeTitle}
              </h1>
              <p className='text-foreground text-xs md:text-sm pt-2'>
                {regexpage == 'burnsmcd'
                  ? welcomeDescriptionCorporateBNM
                  : regexpage == 'tbo'
                    ? welcomeDescriptionCorporateTBO
                    : welcomeDescription}
              </p>
            </div>
          )}

          <div className={`flex flex-col ${className}`}>
            {!showOtpSection ? (
              <form onSubmit={handleSubmit} className='flex flex-col'>
                <div className='mb-6'>
                  <DetailsForm
                    fields={eyFormEmailField}
                    onChange={(updated) =>
                      handleSectionChange('personalInfo', updated)
                    }
                    sectionTitle=''
                    columns={1}
                    data={{ ...formData.personalInfo, id: '' }}
                    errors={formErrors}
                  />
                </div>

                {error && (
                  <p className='text-red-500 align-left mb-4'>
                    Invalid email otp combination
                  </p>
                )}

                <div className='mt-0 w-full bg-white p-0 flex items-center justify-center gap-4 md:static md:p-0 md:mt-2 md:bg-transparent'>
                  <Button
                    type='submit'
                    disabled={isSubmitting || !email || emailError !== ''}
                    className={`text-white bg-accent-red-900 border-0 cursor-pointer w-full text-sm font-semibold h-[50px] px-10 rounded-full py-4 disabled:bg-secondary-600 ${
                      isSubmitting || !email || emailError !== ''
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : 'Continue'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className='flex flex-col'>
                <div className='mb-3 md:mb-6'>
                  <h3 className='text-lg mt-6 font-semibold mb-4'>
                    {verifyEmail}
                  </h3>
                  <p className='text-xs md:text-sm text-foreground mb-4'>
                    {verifyDescription}{' '}
                    <span className='font-semibold'>{email}</span>
                  </p>

                  <OtpInput
                    value={otp.join('')}
                    onChange={(val: string) => handleOtpChange(val.split(''))}
                    numInputs={6}
                    inputType='tel'
                    renderInput={(props) => <input {...props} />}
                    containerStyle={
                      'w-full flex items-center justify-center md:justify-start gap-2'
                    }
                    inputStyle={`border sm:max-w-[15%] sm:min-w-[15%] min-w-[15%] h-[45px] w-[100%] rounded-lg ${
                      otpError ? 'border-accent-red-500 ' : 'border-primary-100'
                    }`}
                  />
                  {otpError && (
                    <p className='text-red-500 text-xs md:text-sm text-center mb-4'>
                      Invalid email otp combination
                    </p>
                  )}
                  {/* Timer */}
                  <div className='mb-4 mt-2'>
                    {timer > 0 ? (
                      <span className='text-sm text-foreground'>
                        {resendOTPIn}{' '}
                        <span className='font-semibold'>
                          {formatTimer(timer)}
                        </span>
                      </span>
                    ) : (
                      <div className='mt-2'>
                        <span className='text-foreground text-xs md:text-sm'>
                          {notReceiveCode}
                        </span>{' '}
                        <button
                          onClick={handleResendOtp}
                          className='text-xs md:text-sm text-accent-red-900 hover:underline cursor-pointer'
                        >
                          {resendOTP}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className='mt-0 w-full bg-white md:p-0 flex items-center justify-center gap-4 md:static md:mt-0 md:bg-transparent'>
                  <Button
                    type='button'
                    onClick={handleOtpVerify}
                    disabled={isSubmitting || otp.join('').length < 6}
                    className={`disabled:bg-secondary-600 text-white bg-accent-red-900 border-0 cursor-pointer w-[150px] md:w-[180px] text-sm font-semibold h-[50px] px-10 rounded-full py-4 ${
                      isSubmitting || otp.join('').length < 6
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default EYPageForm;
