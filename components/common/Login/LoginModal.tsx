'use client';
import ElivaasDark from '@/assets/elivaasDark.svg';
import ElivaasLight from '@/assets/elivaasLight.svg';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui';
import {
  usePhoneContext,
  useUserContext,
  useLoyaltyDialog,
} from '@/contexts/SharedProvider';
import useIsMobile from '@/hooks/useIsMobile';
import useIsTablet from '@/hooks/useIsTablet';
import { STEP_CONFIG } from '@/lib/constants';
import { trackEvent } from '@/lib/mixpanel';
import {
  CHECK_AUTHENTICATION,
  GENERATE_OTP,
  GET_USER_DETAILS,
} from '@/lib/queries';
import { cn, getGraphQLErrorMessage } from '@/lib/utils';
import {
  shouldShowLoyaltyDialog,
  markLoyaltyDialogAsShown,
} from '@/lib/loyaltyDialogUtils';
import { useAuth0 } from '@auth0/auth0-react';
import { useClient } from 'urql';
import Cookies from 'js-cookie';
import { MoveLeft, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GoogleLoginForm from './Content/GoogleLogin';
import OtpVerificationForm from './Content/OTPVerificationForm';
import PhoneLoginForm from './Content/PhoneLoginForm';
import SignupForm from './Content/SignupForm';
import { toast } from 'sonner';

interface LoginModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  trigger?: React.ReactNode;
  loggedInUrl?: string;
  type?: 'drawer' | 'dialog';
  isCloseButton?: boolean;
}

async function authenticateOtpRequest(
  client: ReturnType<typeof useClient>,
  phone: string,
  code: string
) {
  const result = await client
    .query(CHECK_AUTHENTICATION, {
      phone,
      code,
    })
    .toPromise();

  if (result.error) {
    throw new Error('Authentication failed due to GraphQL errors.');
  }

  if (result.data?.authenticate?.accessToken) {
    return {
      accessToken: result.data.authenticate.accessToken,
      refreshToken: result.data.authenticate.refreshToken,
      isNewUser: result.data.authenticate.isNewUser || false,
    };
  } else {
    throw new Error(
      'Authentication failed: Invalid OTP or no tokens received.'
    );
  }
}

async function refreshAccessToken(
  client: ReturnType<typeof useClient>,
  refreshToken: string
): Promise<string> {
  try {
    const result = await client
      .query(CHECK_AUTHENTICATION, {
        refreshToken,
      })
      .toPromise();

    if (result.data?.authenticate?.accessToken) {
      Cookies.set('accessToken', result.data.authenticate.accessToken, {
        expires: 30,
      });
      Cookies.set('refreshToken', result.data.authenticate.refreshToken, {
        expires: 30,
      });
      return result.data.authenticate.accessToken;
    } else {
      throw new Error('Refresh token is invalid or expired.');
    }
  } catch (error) {
    throw error;
  }
}

async function fetchUserDetails(
  client: ReturnType<typeof useClient>,
  accessToken: string,
  refreshToken: string = ''
) {
  try {
    const result = await client.query(GET_USER_DETAILS, {}).toPromise();

    if (result.data?.me) {
      return result.data.me;
    } else {
      throw new Error('Failed to fetch user details: No user data received.');
    }
  } catch (error: any) {
    if (
      refreshToken &&
      (error?.networkError?.status === 401 ||
        error?.message?.includes('access token expired'))
    ) {
      try {
        const newAccessToken = await refreshAccessToken(client, refreshToken);

        const retryResult = await client
          .query(
            GET_USER_DETAILS,
            {},
            {
              requestPolicy: 'network-only',
            }
          )
          .toPromise();

        if (retryResult.data?.me) {
          return retryResult.data.me;
        } else {
          throw new Error('Retry failed: No user data received.');
        }
      } catch (refreshError) {
        throw refreshError;
      }
    }

    throw error;
  }
}

async function generateOtpRequest(
  client: ReturnType<typeof useClient>,
  phone: string
) {
  const result = await client.query(GENERATE_OTP, { phone }).toPromise();

  if (result.error) {
    throw new Error('Failed to generate OTP due to GraphQL errors.');
  }

  if (result.data) {
    return true;
  } else {
    throw new Error('OTP generation failed: No data or success indicator.');
  }
}

export default function LoginModal({
  open,
  setOpen,
  trigger,
  loggedInUrl,
  type,
  isCloseButton,
}: LoginModalProps) {
  const {
    loginWithPopup,
    isAuthenticated,
    user,
    getAccessTokenSilently,
    isLoading: auth0Loading,
  } = useAuth0();

  const router = useRouter();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const [step, setStep] = useState<'login' | 'otp' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isPhoneLoading, setIsPhoneLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [googleAuthProcessed, setGoogleAuthProcessed] = useState(false);
  const { setUserData } = useUserContext();
  const { phoneNumber, setPhoneNumber, countryCode, setCountryCode } =
    usePhoneContext();
  const { setLoyaltyDialogOpen } = useLoyaltyDialog();
  const client = useClient();

  const currentConfig = useMemo(() => {
    return step === 'otp'
      ? STEP_CONFIG.otp(phoneNumber, countryCode)
      : STEP_CONFIG[step];
  }, [step, phoneNumber, countryCode]);

  const resetModal = () => {
    setStep('login');
    setPhoneNumber('');
    setCountryCode('+91');
    setError(null);
    setPhoneError(null);
    setGoogleAuthProcessed(false);
    setIsLoading(false);
    setIsGoogleLoading(false);
    setIsPhoneLoading(false);
  };

  const handleDialogClose = (value: boolean) => {
    setOpen(value);
    if (!value) resetModal();
  };

  // Utility function to handle URQL errors
  const handleUrqlError = (error: any) => {
    console.error('URQL Error:', error);
    if (error?.graphQLErrors?.[0]) {
      const message = error.graphQLErrors[0].message || 'An error occurred';
      setError(message);
    } else {
      setError('An unexpected error occurred');
    }
  };

  const handleHubspotSubmit = (signupData: any) => {
    console.log('Submitting to HubSpot:', signupData);
  };

  // Wrapper function for fetchUserDetails to match expected signature
  const fetchUserDetailsWrapper = async (
    accessToken: string,
    refreshToken: string
  ) => {
    return await fetchUserDetails(client, accessToken, refreshToken);
  };

  const handlePhoneLogin = async (phone: string, code: string) => {
    trackEvent('phone_login_clicked', {
      phone_number: phone,
      country_code: code,
    });
    setIsPhoneLoading(true);
    setError(null);
    setPhoneError(null);
    const fullPhoneNumber = code + phone;

    try {
      await generateOtpRequest(client, fullPhoneNumber);
      setPhoneNumber(phone);
      setCountryCode(code);
      setStep('otp');
    } catch (err: any) {
      setPhoneError(
        'Failed to send OTP. Please check your number and try again.'
      );
    } finally {
      setIsPhoneLoading(false);
    }
  };

  const handleOtpVerified = async (otp: string) => {
    trackEvent('otp_entered', {
      phone_number: phoneNumber,
      country_code: countryCode,
      otp: otp,
    });
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError(null);
    const fullPhoneNumber = countryCode + phoneNumber;

    try {
      const authResult = await authenticateOtpRequest(
        client,
        fullPhoneNumber,
        otp
      );
      trackEvent('otp_entered', {
        phone_number: phoneNumber,
        country_code: countryCode,
        otp: otp,
        is_success: true,
      });
      Cookies.set('accessToken', authResult.accessToken, { expires: 30 });
      Cookies.set('refreshToken', authResult.refreshToken, { expires: 30 });

      const userDetails = await fetchUserDetails(
        client,
        authResult.accessToken,
        authResult.refreshToken
      );

      const existingUserData = Cookies.get('userData');
      let userData = {};

      if (existingUserData) {
        try {
          userData = JSON.parse(existingUserData);
        } catch (e) {
          /* silently fail */
        }
      }

      const userDataObj = {
        ...userData,
        ...userDetails,
        countryCode,
        phone: phoneNumber,
      };

      Cookies.set('userData', JSON.stringify(userDataObj), { expires: 30 });

      setUserData(userDataObj);

      trackEvent('creds_entered', {
        'First Name': userDataObj?.firstName,
        'Last Name': userDataObj?.lastName,
        email: userDataObj?.email,
        phone: userDataObj?.phoneNumber,
      });
      const newUserIntentPhone =
        userDetails?.firstLoginIntent === 'phone' &&
        !(userDetails.firstName || userDetails.email);

      const newUserIntentGoogle =
        userDetails?.firstLoginIntent === 'email' && !userDetails.phone;

      const isNewUser = newUserIntentPhone || newUserIntentGoogle;

      if (isNewUser) {
        setStep('signup');
        trackEvent('enter_creds_page_viewed');
      } else {
        handleClose(userDataObj);
      }
    } catch (err: any) {
      trackEvent('otp_entered', {
        phone_number: phoneNumber,
        country_code: countryCode,
        otp: otp,
        is_success: false,
      });
      if (err?.graphQLErrors?.[0]) {
        setError('OTP entered is invalid. Please enter a valid OTP');
      } else {
        setError('OTP verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError(null);
    const fullPhoneNumber = countryCode + phoneNumber;

    try {
      await generateOtpRequest(client, fullPhoneNumber);
    } catch (err: any) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginInitiate = async () => {
    setIsGoogleLoading(true);
    setError(null);
    setPhoneError(null);
    setGoogleAuthProcessed(false);
    try {
      await loginWithPopup({
        authorizationParams: {
          connection: 'google-oauth2',
          prompt: 'login',
          scope: 'openid profile email offline_access',
        },
      });
    } catch (err) {
      setError('Failed to initiate Google login. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  const handleClose = (
    userDataForDialog?: any,
    options?: { fromNewUserSignup?: boolean }
  ) => {
    setOpen(false);

    // Check if loyalty dialog should be shown (only for new user signup)
    const userData = userDataForDialog || Cookies.get('userData');
    let parsedUserData = null;

    if (typeof userData === 'string') {
      try {
        parsedUserData = JSON.parse(userData);
      } catch (e) {
        /* silently fail */
      }
    } else {
      parsedUserData = userData;
    }

    if (shouldShowLoyaltyDialog(parsedUserData, options)) {
      // Show loyalty dialog after a short delay to ensure login modal is closed
      setTimeout(() => {
        setLoyaltyDialogOpen(true);
      }, 300);
    }

    // Navigate to logged in URL if provided
    if (loggedInUrl) {
      setTimeout(() => {
        router.push(loggedInUrl, { scroll: false });
      }, 500);
    }
  };

  useEffect(() => {
    const processGoogleAuth = async () => {
      if (isAuthenticated && user && open && !googleAuthProcessed) {
        setGoogleAuthProcessed(true);
        setIsGoogleLoading(true);
        setError(null);
        setPhoneError(null);

        try {
          const tokenResponse = await getAccessTokenSilently({
            detailedResponse: true,
            authorizationParams: {
              audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
              scope: 'openid profile email offline_access',
            },
          });

          if (tokenResponse?.access_token) {
            Cookies.set('accessToken', tokenResponse?.access_token || '', {
              expires: 30,
            });

            try {
              const userDetails = await fetchUserDetails(
                client,
                tokenResponse?.access_token
              );

              const existingUserData = Cookies.get('userData');
              let userData = {};

              if (existingUserData) {
                try {
                  userData = JSON.parse(existingUserData);
                } catch (e) {
                  /* silently fail */
                }
              }

              const userDataObj = {
                ...userData,
                ...userDetails,
              };

              Cookies.set('userData', JSON.stringify(userDataObj), {
                expires: 30,
              });
              setUserData(userDataObj);

              const newUserIntentPhone =
                userDetails?.firstLoginIntent === 'phone' &&
                !(userDetails.firstName || userDetails.email);

              const newUserIntentGoogle =
                userDetails?.firstLoginIntent === 'email' && !userDetails.phone;

              const isNewUser = newUserIntentPhone || newUserIntentGoogle;

              if (isNewUser) {
                setStep('signup');
              } else {
                handleClose(userDataObj);
              }
            } catch (fetchError) {
              handleClose();
            }
          } else {
            setError('Failed to get access token after Google login.');
          }
        } catch (err: any) {
          if (err?.graphQLErrors?.[0]) {
            setError('Google login failed. Please try again.');
          } else {
            setError('An unexpected error occurred during Google login.');
          }
        } finally {
          setIsGoogleLoading(false);
        }
      }
    };

    processGoogleAuth();
  }, [
    isAuthenticated,
    user,
    getAccessTokenSilently,
    client,
    open,
    googleAuthProcessed,
  ]);

  const handleSignupComplete = (userData: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    handleClose(userData, { fromNewUserSignup: true });
  };

  const handleSignupError = (response: any) => {
    toast.error(getGraphQLErrorMessage(response), {
      duration: 4000,
      position: 'bottom-right',
    });
  };

  const handleBackNavigation = () => {
    if (step === 'signup') {
      handleDialogClose(false);
    } else if (step === 'otp') {
      setStep('login');
    } else if (step === 'login') {
      handleDialogClose(false);
    }
    setError(null);
    setPhoneError(null);
  };

  const renderContent = () => {
    switch (step) {
      case 'signup':
        return (
          <SignupForm
            onSignupComplete={handleSignupComplete}
            onError={handleSignupError}
            fetchUserDetails={fetchUserDetailsWrapper}
            handleUrqlError={handleUrqlError}
            handleHubspotSubmit={handleHubspotSubmit}
          />
        );
      case 'otp':
        return (
          <OtpVerificationForm
            phoneNumber={phoneNumber}
            countryCode={countryCode}
            onOtpSubmit={handleOtpVerified}
            onResendOtp={handleResendOtp}
            isLoading={isLoading}
            error={error}
          />
        );
      default:
        return (
          <>
            <PhoneLoginForm
              onPhoneLogin={handlePhoneLogin}
              isLoading={isPhoneLoading}
              error={phoneError}
            />

            <GoogleLoginForm
              onGoogleLoginClick={handleGoogleLoginInitiate}
              isLoading={isGoogleLoading || auth0Loading}
              error={error}
            />
          </>
        );
    }
  };

  const CoreContent = (
    <div className='w-full lg:w-1/2 md:bg-primary-50 px-5 py-5 relative overflow-y-auto flex flex-col gap-3 dark:bg-background'>
      {!isTablet &&
        (step === 'login' ? (
          <div>
            <div className='block dark:hidden'>
              <ElivaasDark />
            </div>
            <div className='hidden dark:block'>
              <ElivaasLight />
            </div>
          </div>
        ) : (
          step === 'otp' && (
            <div className='mt-8'>
              <button
                onClick={handleBackNavigation}
                className='flex items-center text-accent-red-900 gap-2 text-xs font-semibold cursor-pointer dark:text-[var(--accent-text)] '
              >
                <MoveLeft className='w-5 h-5 mr-1' /> Change Number
              </button>
            </div>
          )
        ))}

      <div className='relative'>
        <div className='text-center sm:text-left md:my-6'>
          {isTablet && step !== 'login' && (
            <div className='absolute left-0 top-4 -translate-y-1/2'>
              <button
                onClick={handleBackNavigation}
                className='flex items-center text-foreground gap-2 text-xs font-medium dark:text-white'
              >
                <ArrowLeft className='w-6 h-6' />
              </button>
            </div>
          )}
          <h2 className='font-serif text-xl sm:text-2xl font-medium mb-1 '>
            {currentConfig.title}
          </h2>
          {step === 'otp' ? (
            <p className='text-gray-600 text-xs font-medium mt-10 sm:mt-0 dark:text-white'>
              Enter the OTP sent via SMS/WhatsApp to &nbsp;
              <span className='font-semibold text-foreground text-justify dark:text-[var(--accent-text)]'>
                {countryCode} {phoneNumber}
              </span>
            </p>
          ) : (
            <p
              className={cn(
                'text-foreground text-xs',
                step === 'signup' ? 'mt-0' : 'mt-0'
              )}
            >
              {currentConfig.description}
            </p>
          )}
        </div>
      </div>
      <div className='flex flex-col h-full p-2 space-y-6'>
        <div className='space-y-6 flex-1'>{renderContent()}</div>
        <div className='text-center text-xs text-gray-500 mt-auto leading-relaxed dark:text-white'>
          By proceeding you agree to our{' '}
          <Link
            href='/explore/privacy-policy'
            className='text-accent-red-900 hover:text-accent-red-950 dark:text-[var(--accent-text)]'
            prefetch={false}
            target='_blank'
          >
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link
            href='/explore/terms-and-conditions'
            className='text-accent-red-900 hover:text-accent-red-950  dark:text-[var(--accent-text)]'
            prefetch={false}
            target='_blank'
          >
            T&C
          </Link>
          .
        </div>
      </div>
    </div>
  );

  if (isTablet && type !== 'drawer') {
    return (
      <>
        {trigger && <div onClick={() => setOpen(true)}>{trigger}</div>}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='fixed inset-0 z-50 bg-black h-[50vh]'
            >
              <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className='absolute inset-0'
              >
                <Image
                  src={
                    isMobile ? currentConfig.mobileImage : currentConfig.image
                  }
                  alt={currentConfig.alt}
                  layout='fill'
                  objectFit='contain'
                  priority
                />
              </motion.div>
              {/* <div className='absolute inset-0 bg-gradient-to-b  from-black/20 to-black/60' /> */}
              {/* <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className='absolute top-0 left-0 right-0 z-10 flex items-center justify-center p-4 pt-12'
              >
                <div className='text-white'>
                  <ElivaasLight className='scale-[.8]' />
                </div>
                <div className='w-6 h-6' />
              </motion.div> */}
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  duration: 0.6,
                }}
                className='fixed bottom-0 left-0 right-0 bg-primary-50 max-h-[75dvh] min-h-[60vh] overflow-hidden py-4 rounded-t-3xl dark:bg-background'
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className='px-6 pb-0 overflow-y-auto max-h-[calc(75dvh-2rem)]'
                >
                  <div className='relative mb-6'>
                    <div className='absolute left-0 top-4 -translate-y-1/2'>
                      <button
                        onClick={handleBackNavigation}
                        className='flex items-center text-foreground gap-2 text-xs font-semibold'
                      >
                        <ArrowLeft className='w-6 h-6' />
                      </button>
                    </div>
                    <div className='text-center'>
                      <h2 className='font-serif text-xl font-medium mb-1'>
                        {currentConfig.title}
                      </h2>
                      {step === 'otp' ? (
                        <div className='text-center mt-8'>
                          <p className='text-sm text-foreground'>
                            Enter the OTP sent via SMS/WhatsApp to
                          </p>
                          <p className='text-base text-foreground font-semibold mt-1 dark:text-[var(--accent-text)]'>
                            {countryCode} {phoneNumber}
                          </p>
                        </div>
                      ) : (
                        <p
                          className={cn(
                            'text-foreground text-xs',
                            step === 'signup' ? 'mt-0' : 'mt-0'
                          )}
                        >
                          {currentConfig.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='space-y-6'>{renderContent()}</div>

                  <div className='text-center text-xs text-gray-500 mt-6 leading-relaxed dark:text-white'>
                    By proceeding you agree to our{' '}
                    <Link
                      href='/explore/privacy-policy'
                      className='text-accent-red-900 hover:text-accent-red-950 dark:text-[var(--accent-text)]'
                      prefetch={false}
                      target='_blank'
                    >
                      Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link
                      href='/explore/terms-and-conditions'
                      className='text-accent-red-900 hover:text-accent-red-950 dark:text-[var(--accent-text)]'
                      prefetch={false}
                      target='_blank'
                    >
                      T&C
                    </Link>
                    .
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return isTablet ? (
    <Drawer open={open} onOpenChange={handleDialogClose}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent className='bg-white bottom-0! min-h-[80dvh]'>
        <DrawerTitle className='sr-only'>{currentConfig.title}</DrawerTitle>
        <AnimatePresence mode='wait'>{open && CoreContent}</AnimatePresence>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          'sm:max-w-[850px] p-0 overflow-hidden border-0 gap-0',
          'h-[560px] flex'
        )}
        hideCloseButton={isCloseButton}
      >
        <DialogTitle className='sr-only'>{currentConfig.title}</DialogTitle>
        <div className='w-1/2 h-full relative'>
          <Image
            src={isMobile ? currentConfig.mobileImage : currentConfig.image}
            alt={currentConfig.alt}
            layout='fill'
            objectFit='cover'
            priority
          />
          {/* <div className='absolute inset-0 bg-gradient-to-b from-black/20 to-black/40' /> */}
        </div>
        <AnimatePresence mode='wait'>{open && CoreContent}</AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
