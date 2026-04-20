import {
  GuestData,
  GuestDetailsChangeResult,
  SignupPayload,
} from '@/components/modules/ReviewBooking/ReviewBooking.types';
import { clsx, type ClassValue } from 'clsx';
import Cookies from 'js-cookie';
import { twMerge } from 'tailwind-merge';
import { Offer } from 'villa-types';

type PropertyType = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

type FilterType = {
  name: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>) => {
    lastArgs = args;
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          func(...lastArgs);
        }
      }, limit);
    }
  };
};

export const generateRandomString = (length: number = 8): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const mapPropertyFiltersToTypes = (
  filters: FilterType[],
  propertyTypes: PropertyType[]
): PropertyType[] => {
  return filters
    .map((filter) => {
      const matched = propertyTypes.find(
        (type) => type.label.toLowerCase() === filter.name.toLowerCase()
      );

      if (!matched) return null;

      return {
        label: matched.label,
        value: matched.value,
        icon: matched.icon,
      };
    })
    .filter(Boolean) as PropertyType[];
};

export function formatCityName(city: string): string {
  let formattedCity = city?.replace(/---+/g, ' - ');

  formattedCity = formattedCity
    ?.split(' ')
    ?.map((word) => {
      return word?.charAt(0).toUpperCase() + word?.slice(1);
    })
    .join(' ');

  return formattedCity;
}

export function formatParamsCityName(city: string, server = false) {
  const parts = city.split('-in');

  if (parts.length > 1) {
    if (server) {
      const cityName = parts[1]
        .split('-')
        .map((word) => word.trim())
        .filter((word) => word)
        .join('-');

      return cityName;
    } else {
      const cityName = parts[1]
        .split('-')
        .map((word) => word.trim())
        .filter((word) => word)
        .join(' ');

      return cityName;
    }
  }
  return '';
}

export const getCitySlugByName = (
  cityName: string | null,
  locations: { name: string; slug: string }[]
): string | null => {
  if (!cityName) return null;

  const normalize = (str: string) =>
    str.toLowerCase().replace(/,/g, '').replace(/\s+/g, ' ').trim();

  const normalizedCityName = normalize(cityName);

  const location = locations.find((loc) =>
    normalize(loc.name).includes(normalizedCityName)
  );

  return location ? location.slug : null;
};

export const getCitySlug = (
  cityName: string | null,
  cities: any
): string | null => {
  if (cityName) {
    const formattedCityName = cityName.replace(/-/g, ' ');
    const city = cities.find(
      (city: any) =>
        city.name.toLowerCase().replace(/-/g, ' ') ===
        formattedCityName.toLowerCase()
    );

    return city ? city.slug : null;
  } else return null;
};

export const formatCityNameLowerCase = (city: string) => {
  return city ? city.replace(/ /g, '-').toLowerCase()?.toLowerCase() : '';
};

export function capitalizeInitials(str: string): string {
  return str?.replace(/\b\w/g, (char) => char.toUpperCase());
}

export const formatPrice = (price: any) => {
  return `${Number(price).toLocaleString('en-IN')}`;
};

export const truncateText = (text: string, wordLimit: number): string => {
  const words = text?.split(' ');
  return words?.length > wordLimit
    ? words?.slice(0, wordLimit).join(' ') + '...'
    : text;
};

export function getUserInitials(firstName = '', lastName = ''): string {
  const firstInitial = firstName?.trim()[0]?.toUpperCase() || '';
  const lastInitial = lastName?.trim()[0]?.toUpperCase() || '';
  return `${firstInitial}${lastInitial}`;
}

export function validateField(name: string, value: string): string | null {
  switch (name) {
    case 'firstName':
    case 'lastName':
      if (!value.trim()) return 'This field is required';
      if (value.length < 2) return 'Must be at least 2 characters';
      return null;

    case 'email':
      if (!value.trim()) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Invalid email address';
      return null;

    case 'phone':
      if (!value.trim()) return 'Phone number is required';
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(value)) return 'Invalid phone number';
      return null;

    case 'dob':
      if (!value.trim()) return 'Date of birth is required';
      const date = new Date(value);
      if (isNaN(date.getTime())) return 'Invalid date';
      return null;

    default:
      return null;
  }
}
export const sortByExactMatchThenDescending =
  (target: number) => (a: number, b: number) => {
    if (a === target) return -1;
    if (b === target) return 1;
    return b - a;
  };

export const sortByExactMatchThenDescendingWithHighValuesLast =
  (target: number) => (a: number, b: number) => {
    if (a === target) return -1;
    if (b === target) return 1;

    const isALessOrEqual = a <= target;
    const isBLessOrEqual = b <= target;

    if (isALessOrEqual !== isBLessOrEqual) return isALessOrEqual ? -1 : 1;

    return b - a;
  };

export function findCouponByCode(
  coupons: Offer[],
  code: string | null | undefined
) {
  const coupon = coupons.find((coupon) => coupon.code === code);

  return coupon ? coupon : false;
}

// Helper function to get query parameters

export const getQueryParam = (param: string): any => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  return null;
};

export const clearCouponState = () => ({
  code: '',
  description: '',
  discountMethod: '',
  discountPercentage: 0,
  maximumDiscountAllowed: 0,
  endDateTime: '',
  icon: '',
  termsAndConditions: '',
  title: '',
  __typename: '',
});

// utils/tiers.ts
import {
  blueMemberSvg,
  diamondMemberSvg,
  goldMemberSvg,
  silverMemberSvg,
  ReservePlusTierMemberSvg,
} from '@/lib/constants';
import { Booking, BookingStatus } from 'booking-types';

export type Tier = 'blue' | 'silver' | 'gold' | 'diamond' | 'Reserve Plus';
export type MembershipLevel = Tier | string;

export const normalizeTier = (tier: unknown): Tier => {
  const raw = typeof tier === 'string' ? tier : '';
  const normalized = raw
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (normalized === 'reserve plus' || normalized === 'reserveplus') {
    return 'Reserve Plus';
  }

  if (
    normalized === 'blue' ||
    normalized === 'silver' ||
    normalized === 'gold' ||
    normalized === 'diamond'
  ) {
    return normalized;
  }

  return 'blue';
};

export const tiersConfig: Record<
  Tier,
  {
    svg?: string;
    gradient?: { from: string; to: string };
    fullGradient?: string;
    textGradient?: { from: string; to: string };
    progresscolor?: string;
    progressGradient?: { from: string; to: string };
    badgeBg?: string;
    badgeText?: string;
    profileCardBg?: string;
    cardBg?: string;
    cardBorder?: string;
    ctaBg?: string;
    membershipTierBorder?: string;
    membershipBoxShadow?: string;
  }
> = {
  blue: {
    svg: blueMemberSvg,
    textGradient: {
      from: 'var(--blue16)',
      to: 'var(--blue15)',
    },
    gradient: { from: 'var(--background)', to: 'var(--blue5)' },
    fullGradient:
      'linear-gradient(to left, rgba(176, 222, 245, 0.4) 17.03%, #FFFFFF 99.65%)',
    progresscolor: 'var(--secondary-300)',
    progressGradient: { from: 'var(--blue6)', to: 'var(--blue5)' },
    badgeBg: 'bg-[var(--blue9)]',
    badgeText: 'text-[var(--blue10)]',
    profileCardBg: 'var(--blue5)',
    cardBg: 'bg-gradient-to-r from-[var(--blue5)] to-white',
    cardBorder: 'border-primary-50',
    ctaBg: 'var(--blue17)',
    membershipTierBorder:
      'linear-gradient(to bottom, #11395E 21.13%, #1F5A99 34.61%, #A5B4BE 71.4%)',
    membershipBoxShadow: '0px 4px 10px 4px #5D83AE4D',
  },
  silver: {
    svg: silverMemberSvg,
    textGradient: {
      from: 'var(--silver6)',
      to: 'var(--silver5)',
    },
    gradient: { from: 'var(--background)', to: 'var(--black4)' },
    fullGradient:
      'linear-gradient(to left, rgba(191, 194, 209, 0.4) 17.03%, #FFFFFF 99.65%)',
    progresscolor: 'var(--secondary-300)',
    progressGradient: { from: 'var(--black5)', to: 'var(--black6)' },
    badgeBg: 'bg-[var(--grey11)]',
    badgeText: 'text-[var(--grey10)]',
    profileCardBg: 'var(--silver4)',
    cardBg: 'bg-gradient-to-r from-[var(--color-secondary-300)] to-white',
    cardBorder: 'border-primary-50',
    ctaBg: 'var(--silver7)',
    membershipTierBorder:
      'linear-gradient(to bottom left, #151515 16.15%, #373737 49.38%, #DFDFDF 69.86%)',
    membershipBoxShadow: '0px 4px 10px 4px #404040',
  },
  gold: {
    svg: goldMemberSvg,
    textGradient: {
      from: 'var(--gold13)',
      to: 'var(--gold12)',
    },
    gradient: { from: 'var(--white)', to: 'var(--gold10)' },
    fullGradient:
      'linear-gradient(to left, rgba(152, 123, 2, 0.2) -28.26%, #FFFFFF 99.63%)',
    progresscolor: 'var(--secondary-300)',
    progressGradient: { from: 'var(--gold2)', to: 'var(--gold3)' },
    badgeBg: 'bg-[var(--gold4)]',
    badgeText: 'text-[var(--gold5)]',
    profileCardBg: 'var(--gold15)',
    cardBg: 'bg-gradient-to-r from-[var(--accent-yellow-100)] to-white',
    cardBorder: 'border-primary-50',
    ctaBg: 'var(--gold14)',
    membershipTierBorder:
      'linear-gradient(to bottom left, #442C11 30.04%, #6D4E1F 40.66%, #BF933C 62.07%, rgba(247, 239, 218, 0.8) 81.81%)',
    membershipBoxShadow: '3px 4px 10px 4px #65441A66',
  },
  diamond: {
    svg: diamondMemberSvg,
    textGradient: {
      from: 'var(--diamond8)',
      to: 'var(--diamond7)',
    },
    gradient: { from: 'var(--background)', to: 'var(--pink5)' },
    fullGradient:
      'linear-gradient(to left, rgba(111, 51, 159, 0.1) -36.46%, #FFFFFF 99.82%)',
    progresscolor: 'var(--secondary-300)',
    progressGradient: { from: 'var(--pink6)', to: 'var(--pink7)' },
    badgeBg: 'bg-[var(--diamond2)]',
    badgeText: 'text-[var(--diamond3)]',
    profileCardBg: 'var(--diamond1)',
    cardBg: 'bg-gradient-to-r from-[var(--primary-100)] to-white',
    cardBorder: 'border-primary-50',
    ctaBg: 'var(--diamond7)',
    membershipTierBorder:
      'linear-gradient(to bottom left, #2C1942 30.04%, #7E469F 40.66%, #AC5CCC 62.07%, #E7DAFF 81.81%)',
    membershipBoxShadow: '0px 4px 10px 4px #492A6A66',
  },
  'Reserve Plus': {
    svg: ReservePlusTierMemberSvg,
    textGradient: {
      from: '#c04565',
      to: '#c04565',
    },
    gradient: { from: 'var(--background)', to: 'var(--pink5)' },
    fullGradient:
      'linear-gradient(to left, rgba(111, 51, 159, 0.1) -36.46%, #FFFFFF 99.82%)',
    progresscolor: 'var(--secondary-300)',
    progressGradient: { from: 'var(--pink6)', to: 'var(--pink7)' },
    badgeBg: 'bg-[var(--diamond2)]',
    badgeText: 'text-[var(--diamond3)]',
    profileCardBg: 'var(--diamond1)',
    cardBg: 'bg-gradient-to-r from-[var(--primary-100)] to-white',
    cardBorder: 'border-primary-50',
    ctaBg: 'var(--diamond7)',
    membershipTierBorder:
      'linear-gradient(to bottom left, #2C1942 30.04%, #c04565 40.66%, #28091b 62.07%, #E7DAFF 81.81%)',
    membershipBoxShadow: '0px 4px 10px 4px #492A6A66',
  },
};

export const getTierConfig = (tier: MembershipLevel) =>
  tiersConfig[normalizeTier(tier)] || tiersConfig.blue;

export interface QueryParams {
  checkin?: string;
  checkout?: string;
  adults?: number | string;
  children?: number | string;
  [key: string]: string | number | boolean | undefined;
}

export const generateQueryString = (params: QueryParams): string => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : '';
};

export const getFilenameFromUrl = (url: string) => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.split('/').pop() || '';
  } catch {
    // If URL parsing fails, try to extract filename from path
    return url.split('/').pop() || '';
  }
};

export const detectGuestDetailsChanges = (
  userData: any | null,
  guestData: GuestData
): GuestDetailsChangeResult => {
  if (!userData) {
    return {
      hasChanges: false,
      changedFields: [],
      signupPayload: null,
    };
  }

  const changedFields: string[] = [];
  const signupPayload: SignupPayload = {
    id: guestData.id,
    firstName: guestData.firstName,
    lastName: guestData.lastName,
  };

  const trimmedFirstName = guestData.firstName.trim();
  if (userData.firstName !== trimmedFirstName) {
    changedFields.push('firstName');
    signupPayload.firstName = trimmedFirstName;
  }

  const trimmedLastName = guestData.lastName.trim();
  if (userData.lastName !== trimmedLastName) {
    changedFields.push('lastName');
    signupPayload.lastName = trimmedLastName;
  }

  const trimmedEmail = guestData.email.trim();
  if (userData.email !== trimmedEmail) {
    changedFields.push('email');
    signupPayload.email = trimmedEmail;
  }

  if (userData.salutation !== guestData.salutation) {
    changedFields.push('salutation');
    signupPayload.salutation = guestData.salutation || 'Mr.';
  }

  const trimmedMobile = guestData.mobile.trim();
  const currentPhone = userData.phoneNumber || userData.phone;

  if (trimmedMobile && currentPhone !== trimmedMobile) {
    changedFields.push('phoneNumber');
    signupPayload.phoneNumber = trimmedMobile;
    signupPayload.countryCode = guestData.countryCode;
  }

  const hasChanges = changedFields.length > 0;

  return {
    hasChanges,
    changedFields,
    signupPayload: hasChanges ? signupPayload : null,
  };
};

export const clearAuthCookies = () => {
  Cookies.remove('accessToken');
  Cookies.remove('userData');
  Cookies.remove('loyalty_dialog_shown');
};

export function getGraphQLErrorMessage(error: unknown): string {
  if (!error) return 'Something went wrong. Please try again.';

  const fallback = 'Something went wrong. Please try again.';

  if (typeof error === 'object' && error !== null && 'graphQLErrors' in error) {
    const gqlErrors = (error as any).graphQLErrors;
    if (Array.isArray(gqlErrors) && gqlErrors.length > 0) {
      return gqlErrors
        .map((e: any) => e.message)
        .join(', ')
        .replace(/^\[?GraphQL\]?:?\s*/i, '')
        .trim();
    }
  }

  const msg =
    error instanceof Error
      ? error.message
      : typeof error === 'object' && error !== null && 'message' in error
        ? String((error as any).message)
        : typeof error === 'string'
          ? error
          : fallback;

  return msg.replace(/^\[?GraphQL\]?:?\s*/i, '').trim();
}

type BankColor = {
  light: { borderColor: string; backgroundColor: string };
  dark: { borderColor: string; backgroundColor: string };
};

export const createOfferCardBg = (
  borderColor: string,
  lightBG: string,
  darkBG: string
): BankColor => ({
  light: { borderColor, backgroundColor: lightBG },
  dark: { borderColor, backgroundColor: darkBG },
});

export const normalizeSalutation = (salutation: string | undefined): string => {
  if (!salutation) return '';

  const normalized = salutation.toLowerCase();
  if (normalized === 'mr' || normalized === 'mr.') return 'Mr.';
  if (normalized === 'mrs' || normalized === 'mrs.') return 'Mrs.';
  if (normalized === 'ms' || normalized === 'ms.') return 'Ms.';

  return salutation;
};

export const getBookingStatusByDates = (booking: Booking): BookingStatus => {
  if (booking.bookingStatus !== 'CONFIRMED') {
    return booking.bookingStatus;
  }

  const now = new Date();
  const checkoutDate = new Date(booking.checkoutDate);

  if (checkoutDate < now) {
    return 'COMPLETED';
  }

  return 'CONFIRMED';
};
