'use client';

import Cookies from 'js-cookie';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useClient } from 'urql';

import DetailsForm from '@/components/common/DetailsForm';
import HeaderWithIcon from '@/components/common/HeaderWithIcon/HeaderWithIcon';
import { Spinner } from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { usePhoneContext, useUserContext } from '@/contexts/SharedProvider';
import useIsMobile from '@/hooks/useIsMobile';
import { USER_SIGNUP } from '@/lib/queries';
import { normalizeSalutation, validateField } from '@/lib/utils';
import { toast } from 'sonner';
import { infoFields, UserDetailsTypes } from './PersonalDetails';

const getDefaultUserData = (): UserDetailsTypes => ({
  id: '',
  firstName: '',
  lastName: '',
  salutation: '',
  email: '',
  phone: '',
  dob: '',
  countryCode: '',
  imageUrl: '',
});

// Helper function to ensure phone number has country code only once
const formatPhoneWithCountryCode = (
  phone: string,
  countryCode: string
): string => {
  if (!phone) return '';

  // If phone already starts with country code, return as is
  if (phone.startsWith(countryCode)) {
    return phone;
  }

  // If phone starts with +, it might have a different country code, return as is
  if (phone.startsWith('+')) {
    return phone;
  }

  // Otherwise, add the country code
  return `${countryCode}${phone}`;
};

export default function PersonalDetails() {
  const client = useClient();
  const isMobile = useIsMobile();

  const { phoneNumber, countryCode, setPhoneNumber, setCountryCode } =
    usePhoneContext();
  const { userData, setUserData, refreshUserData } = useUserContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [mutationError, setMutationError] = useState<any | null>(null);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const [localUserData, setLocalUserData] =
    useState<UserDetailsTypes>(getDefaultUserData());

  useEffect(() => {
    if (userData) {
      const mergedUser = {
        ...getDefaultUserData(),
        ...userData,
        imageUrl: userData.picture || userData.imageUrl || '',
        salutation: normalizeSalutation(userData.salutation),
        dob: userData.dob || '',
      };

      setLocalUserData(mergedUser);
      setPhoneNumber(mergedUser.phone || '');
      setCountryCode(userData.countryCode || '+91');
    } else {
      refreshUserData();
    }
    setIsLoading(false);
  }, [userData, setPhoneNumber, setCountryCode, refreshUserData]);

  const handleInformationChange = (updatedInfo: Partial<UserDetailsTypes>) => {
    setLocalUserData((prev) => ({
      ...prev,
      ...updatedInfo,
    }));
  };

  const validateAllFields = () => {
    const newErrors: Record<string, string | null> = {};
    for (const field of infoFields) {
      const value =
        field.name === 'phone'
          ? phoneNumber
          : (localUserData[field.name as keyof UserDetailsTypes] as string);

      // Skip validation for phone if it's empty (make it optional)
      if (field.name === 'phone' && (!value || value.trim() === '')) {
        continue;
      }

      const error = validateField(field.name, value);
      if (error) newErrors[field.name] = error;
    }
    return newErrors;
  };

  const allFieldsFilled = infoFields
    .filter((field) => field.name !== 'phone') // Exclude phone from required fields
    .every((field) => {
      const value = localUserData[field.name as keyof UserDetailsTypes];
      return value && value.toString().trim() !== '';
    });

  const handleUpdateMutation = async (variables: UserDetailsTypes) => {
    const existingUserData = Cookies.get('userData');
    const parsedExistingData = existingUserData
      ? JSON.parse(existingUserData)
      : {};

    try {
      setIsMutating(true);
      setMutationError(null);

      const mutationVariables = {
        ...variables,
        firstName: variables.firstName || parsedExistingData.firstName || '',
        lastName: variables.lastName || parsedExistingData.lastName || '',
        email: variables.email || parsedExistingData.email || '',
        phone:
          variables.phone ||
          formatPhoneWithCountryCode(phoneNumber, countryCode) ||
          parsedExistingData.phone ||
          '',
        countryCode:
          variables.countryCode ||
          countryCode ||
          parsedExistingData.countryCode ||
          '+91',
      };

      const result = await client.mutation(USER_SIGNUP, mutationVariables);

      if (result.data && result.data.user) {
        const mergedUserData = {
          ...parsedExistingData,
          ...mutationVariables,
        };

        Cookies.set('userData', JSON.stringify(mergedUserData), {
          expires: 30,
        });
        setUserData(mergedUserData);
        toast.success('Your details have been saved successfully!');
      } else if (result.error) {
        throw result.error;
      } else {
        toast.error('An unknown error occurred. Please try again.');
      }
    } catch (error: any) {
      setMutationError(error);
      toast.error(
        `Failed to save details: ${
          error.graphQLErrors?.[0]?.message ||
          error.message ||
          'Unexpected error.'
        }`
      );
    } finally {
      setIsMutating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateAllFields();
    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some(Boolean);
    if (hasErrors) return;

    const saved = Cookies.get('userData');
    const parsed = saved ? JSON.parse(saved) : null;
    const firstLoginIntent = parsed?.firstLoginIntent;

    const mutationVariables: UserDetailsTypes = {
      id: localUserData.id,
      firstName: localUserData.firstName,
      lastName: localUserData.lastName,
      salutation: localUserData.salutation,
      dob: localUserData.dob,
      imageUrl: localUserData.imageUrl,
    };

    if (firstLoginIntent !== 'phone') {
      // Format phone number with country code (avoiding duplicates)
      const fullPhoneNumber = formatPhoneWithCountryCode(
        phoneNumber,
        countryCode
      );
      mutationVariables.phone = fullPhoneNumber;
      mutationVariables.countryCode = countryCode;
    }

    if (firstLoginIntent !== 'email') {
      mutationVariables.email = localUserData.email;
    }

    await handleUpdateMutation(mutationVariables);
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <Spinner size='lg' className='text-gray-600' />
      </div>
    );
  }

  return (
    <div className='w-full mx-auto md:px-6 md:py-6 px-0 py-0 md:bg-[var(--primary-10)] shadow-none rounded-2xl'>
      <form onSubmit={handleSubmit} className='flex flex-col'>
        <HeaderWithIcon
          icon={<ArrowLeft className='text-black !h-6 !w-6' />}
          title='Personal Details'
          onIconClick={() => window.history.back()}
          titleClassName='text-[var(--secondary-950)] text-2xl font-dm-serif typography-title-regular md:mb-6 w-full text-center md:text-left'
        />

        <hr className='border-t border--primary-400 -mx-4 md:mx-0' />

        <div className='bg-[var(--primary-10)] rounded-xl py-6 mt-6 px-4 md:px-0'>
          <DetailsForm<UserDetailsTypes>
            data={localUserData}
            fields={infoFields}
            onChange={handleInformationChange}
            sectionTitle='Personal Information'
            columns={2}
            errors={errors}
          />
        </div>

        <div className='flex justify-start fixed md:relative bottom-0 left-0 w-full p-4 md:p-0 md:mt-6 bg-white md:bg-[var(--primary-10)] border-t border-primary-10 md:border-0'>
          <Button
            type='submit'
            className={`w-full md:w-52 h-12 rounded-3xl text-white flex items-center justify-center space-x-2 ${
              allFieldsFilled
                ? 'bg-[var(--color-accent-red-900)] hover:bg-[var(--color-accent-red-900)]'
                : 'bg-[var(--color-secondary-600)] cursor-not-allowed'
            }`}
            disabled={!allFieldsFilled || isMutating}
          >
            {isMutating ? (
              <>
                <Spinner size='sm' className='text-white' />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
