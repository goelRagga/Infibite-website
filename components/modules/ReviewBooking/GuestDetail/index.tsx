'use client';

import Autocomplete from '@/components/common/AutoComplete';
import PhoneNumberInput from '@/components/common/PhoneInputField';
import { Spinner } from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useUserContext } from '@/contexts/SharedProvider';
import { fetchIndianCityData } from '@/lib/api/clientServices';
import {
  CHECK_AUTHENTICATION,
  GET_USER_DETAILS,
  USER_SIGNUP,
} from '@/lib/queries';
import { cn, detectGuestDetailsChanges } from '@/lib/utils';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import { Pencil } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useClient } from 'urql';
import GuestLoginModal from './GuestLoginModal';
import { trackEvent } from '@/lib/mixpanel';

interface GuestDetailsFormProps {
  guest: GuestData;
  onGuestDataChange: (guestData: GuestData) => void;
  isEdit: boolean;
  onEditToggle: (editMode: boolean) => void;
  errors: Partial<Record<keyof GuestData, string>>;
  setErrors: React.Dispatch<
    React.SetStateAction<Partial<Record<keyof GuestData, string>>>
  >;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  validateGuestDetails: () => boolean;
}

interface GuestData {
  id: string;
  salutation: 'Mr.' | 'Mrs.' | 'Ms.';
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  countryCode: string;
  phoneVerified: boolean;
}

interface CityOption {
  id: string;
  label: string;
  sublabel?: string;
}

function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export default function GuestDetailsForm({
  guest,
  onGuestDataChange,
  isEdit,
  onEditToggle,
  errors,
  setErrors,
  validateGuestDetails,
  isLoginModalOpen,
  setIsLoginModalOpen,
}: GuestDetailsFormProps) {
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const isCorporateChannel = Cookies.get('isCorporateChannel');

  const client = useClient();
  const { userData, setUserData } = useUserContext();

  useEffect(() => {
    if (userData?.city && selectedCity !== userData.city) {
      setSelectedCity(userData.city);
    }
  }, [userData?.city]);

  const debouncedCitySearch = useCallback(
    debounce(async (searchValue: string) => {
      if (searchValue.length < 3) {
        setCityOptions([]);
        return;
      }

      setIsLoadingCities(true);
      try {
        const cities = await fetchIndianCityData({ client, searchValue });
        if (cities) {
          const cityOptions: CityOption[] = cities.map((city, index) => ({
            id: `city-${index}`,
            label: city,
          }));
          setCityOptions(cityOptions);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCityOptions([]);
      } finally {
        setIsLoadingCities(false);
      }
    }, 300),
    [client]
  );

  const handleChange = (field: keyof GuestData, value: string) => {
    const newGuestData = { ...guest, [field]: value };
    onGuestDataChange(newGuestData);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleCityChange = (value: string, option: CityOption | null) => {
    setSelectedCity(value);
    setUserData((prev: any) => ({ ...prev, city: value }));

    if (!option) {
      debouncedCitySearch(value);
    }
  };

  const saveCityToUserData = async (city: string) => {
    try {
      if (!userData) {
        return;
      }
      const updatedUserData = {
        ...userData,
        city,
      };
      Cookies.set('userData', JSON.stringify(updatedUserData), { expires: 30 });
      setUserData(updatedUserData as any);
    } catch (error) {
      console.error('Failed to save city:', error);
    }
  };

  async function refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const result = await client
        .query(
          CHECK_AUTHENTICATION,
          { refreshToken },
          {
            fetchOptions: {
              headers: {
                'Channel-Id': isCorporateChannel
                  ? isCorporateChannel
                  : process.env.NEXT_PUBLIC_CHANNEL_ID || '',
              },
            },
          }
        )
        .toPromise();

      if (result.error) {
        throw new Error(result.error.message);
      }

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
    accessToken: string,
    refreshToken: string = ''
  ) {
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
        throw result.error;
      }

      if (result.data?.me) {
        return result.data.me;
      } else {
        throw new Error('Failed to fetch user details: No user data received.');
      }
    } catch (error: any) {
      if (
        refreshToken &&
        (error?.networkError?.statusCode === 401 ||
          error?.message?.includes('access token expired'))
      ) {
        try {
          const newAccessToken = await refreshAccessToken(refreshToken);

          const retryResult = await client
            .query(
              GET_USER_DETAILS,
              {},
              {
                fetchOptions: {
                  headers: {
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                },
              }
            )
            .toPromise();

          if (retryResult.error) {
            throw retryResult.error;
          }

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

  const handleSignupError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleSignupMutation = async (signupData: {
    id: string;
    salutation?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    countryCode?: string;
  }) => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    if (!guest?.id) {
      throw new Error('User ID not found');
    }

    try {
      setIsSignupLoading(true);

      const result = await client
        .mutation(
          USER_SIGNUP,
          {
            id: signupData.id,
            salutation: signupData.salutation,
            firstName: signupData.firstName,
            lastName: signupData.lastName,
            ...(signupData.email && { email: signupData.email }),
            ...(signupData.phoneNumber && {
              phone: `${signupData.countryCode}${signupData.phoneNumber}`,
            }),
          },
          {
            fetchOptions: {
              headers: {
                'Channel-Id': isCorporateChannel
                  ? isCorporateChannel
                  : process.env.NEXT_PUBLIC_CHANNEL_ID || '',
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
              },
            },
          }
        )
        .toPromise();

      if (result.error) {
        throw new Error(result.error.message || 'Signup failed');
      }

      const updatedUserData = {
        ...userData,
        salutation: signupData.salutation,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        email: signupData.email,
        ...(signupData.phoneNumber && {
          phone: signupData.phoneNumber,
          countryCode: signupData.countryCode,
        }),
        ...result.data?.userSignup,
      };

      Cookies.set('userData', JSON.stringify(updatedUserData), { expires: 30 });

      if (accessToken && fetchUserDetails) {
        try {
          const freshUserDetails = await fetchUserDetails(
            accessToken,
            refreshToken || ''
          );

          const syncedUserData = {
            ...updatedUserData,
            ...freshUserDetails,
          };

          Cookies.set('userData', JSON.stringify(syncedUserData), {
            expires: 30,
          });
          setUserData(syncedUserData);

          if (freshUserDetails.city && freshUserDetails.city !== selectedCity) {
            setSelectedCity(freshUserDetails.city);
          }

          onEditToggle(false);
        } catch (fetchError) {
          console.warn('Failed to fetch fresh user details:', fetchError);
        }
      }

      return updatedUserData;
    } catch (error: any) {
      console.error('Signup mutation error:', error);

      const message = error instanceof Error ? error.message : 'Signup failed';

      toast.error('Signup Failed', {
        description: message,
      });

      if (handleSignupError) {
        handleSignupError(message);
      }

      throw error;
    } finally {
      setIsSignupLoading(false);
    }
  };

  const handleSave = async () => {
    trackEvent('guest_details_saved', {
      page_name: 'booking_details',
    });
    if (!validateGuestDetails()) return;

    const accessToken = Cookies.get('accessToken');
    if (
      !accessToken ||
      (!guest.phoneVerified && userData?.firstLoginIntent != 'email')
    ) {
      setIsLoginModalOpen(true);
      return;
    }

    if (selectedCity) {
      await saveCityToUserData(selectedCity);
    }

    const guestDetailsChange = detectGuestDetailsChanges(userData, guest);

    if (
      (guest.phoneVerified || userData?.firstLoginIntent == 'email') &&
      guestDetailsChange.hasChanges &&
      guestDetailsChange.signupPayload
    ) {
      try {
        await handleSignupMutation(guestDetailsChange.signupPayload);
      } catch (error) {
        console.error('Signup process failed:', error);
        onEditToggle(false);
      }
    } else {
      // Even if no signup is needed, exit edit mode
      onEditToggle(false);
    }
  };

  const handleEdit = () => {
    trackEvent('edit_guest_details_clicked', {
      page_name: 'booking_details',
    });
    onEditToggle(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    onEditToggle(false);
  };

  const renderField = (
    field: keyof GuestData,
    placeholder: string,
    type = 'text',
    className = 'placeholder-primary-500! placeholder:font-normal font-semibold border-[var(--border)] hover:border-[var(--border)] shadow-none! py-2 h-13 rounded-xl bg-white text-foreground! dark:bg-[var(--grey6)] dark:border-[var(--prive2)]',
    prefix?: string
  ) => (
    <div className='space-y-1 relative'>
      <div className={clsx('flex', prefix && 'rounded-md overflow-hidden')}>
        {prefix && (
          <div className='flex items-center px-3 border-r border-gray-300 bg-muted'>
            {prefix}
          </div>
        )}
        <Input
          type={type}
          placeholder={placeholder}
          value={guest[field] as string}
          onChange={(e) => handleChange(field, e.target.value)}
          className={clsx(
            prefix && 'rounded-l-none',
            className,
            errors[field] && 'border-accent-red-500 focus-visible:ring-red-500'
          )}
        />
      </div>
      {errors[field] && (
        <p className='text-xs text-accent-red-500 absolute -bottom-3'>
          {errors[field]}
        </p>
      )}
    </div>
  );

  return (
    <div>
      <div
        className={cn(
          'flex items-center justify-between mb-6',
          !isEdit && '-mt-12'
        )}
      >
        <div />
        {!isEdit && (
          <Button
            variant='outline'
            size='icon'
            className='cursor-pointer border-primary border rounded-full p-1 dark:bg-[var(--gray8)] dark:border-[var(--prive2)]'
            onClick={handleEdit}
          >
            <Pencil className='w-8 h-8 text-primary dark:text-[var(--prive2)]' />
          </Button>
        )}
      </div>

      {isEdit ? (
        <form className='space-y-6 mb-2'>
          <RadioGroup
            defaultValue={guest.salutation || 'Mr.'}
            className='flex gap-6'
            onValueChange={(val) => handleChange('salutation', val)}
          >
            {['Mr.', 'Mrs.', 'Ms.'].map((val) => (
              <div key={val} className='flex items-center space-x-2'>
                <RadioGroupItem
                  className={cn(
                    'mt-0 h-5 w-5 rounded-full border-2 relative after:content-[""] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:h-2.5 after:w-2.5 after:rounded-full after:bg-transparen dark:bg-background',
                    'data-[state=checked]:border-accent-red-900 dark:data-[state=checked]:border-accent-yellow-950 data-[state=checked]:after:bg-accent-red-900   dark:data-[state=unchecked]:border-primary-800 dark:data-[state=checked]:after:bg-accent-yellow-950 dark:data-[state=unchecked]:after:bg-background '
                  )}
                  value={val}
                  id={val}
                />
                <Label className='cursor-pointer!' htmlFor={val}>
                  {val}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {renderField('firstName', 'First Name')}
            {renderField('lastName', 'Last Name')}
            <PhoneNumberInput
              phoneNumber={guest.mobile}
              setPhoneNumber={(val) => handleChange('mobile', val)}
              countryCode={guest.countryCode}
              setCountryCode={(val) => handleChange('countryCode', val)}
              error={errors.mobile}
              isVerified={guest.phoneVerified}
            />
            {renderField('email', 'Email Address', 'email')}

            {/* City Autocomplete Field */}
            <div className='space-y-1 relative'>
              <Autocomplete
                options={cityOptions}
                value={selectedCity}
                onChange={handleCityChange}
                label='City'
                placeholder='Search for a city...'
                isLoading={isLoadingCities}
              />
            </div>
          </div>

          <p className='text-muted-foreground text-sm'>
            Booking details will be sent to this Mobile Number & Email Address
          </p>

          <Button
            size='lg'
            className='cursor-pointer w-40 bg-accent-red-900 hover:bg-accent-red-950 text-white py-3 text-base font-medium rounded-3xl dark:bg-[var(--prive5)]'
            type='button'
            disabled={isSignupLoading}
            onClick={handleSave}
          >
            {isSignupLoading ? <Spinner size='sm' /> : 'Save'}
          </Button>
        </form>
      ) : (
        <div className='grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 text-sm mb-3'>
          {(
            ['salutation', 'firstName', 'lastName', 'mobile', 'email'] as const
          ).map((field) => (
            <div key={field}>
              <p className='text-primary-500 text-xs'>
                {field.charAt(0).toUpperCase() +
                  field.slice(1).replace(/([A-Z])/g, ' $1')}
              </p>
              <p className='font-semibold truncate'>
                {field === 'mobile'
                  ? `${guest.countryCode} ${guest[field]}`
                  : guest[field]}
              </p>
            </div>
          ))}
          <div>
            <p className='text-primary-500 text-xs'>City</p>
            <p className='font-semibold'>{selectedCity || ''}</p>
          </div>

          <p className='col-span-2 md:col-span-3 text-xs mt-2'>
            Booking details will be sent to this Mobile Number & Email Address
          </p>
        </div>
      )}

      <GuestLoginModal
        open={isLoginModalOpen}
        setOpen={setIsLoginModalOpen}
        initialPhoneNumber={guest.mobile}
        initialCountryCode={guest.countryCode}
        onLoginSuccess={handleLoginSuccess}
        startWithOtp={true}
      />
    </div>
  );
}
