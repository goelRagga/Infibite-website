// types/userDetailsTypes.ts

import { FieldConfig } from '@/components/common/DetailsForm/DetailsFormTypes';

export interface LocationChangeTypes {
  city: string;
}

export interface UserDetailsTypes {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  dob?: string;
  salutation?: string;
  // city: string;
  imageUrl?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  active?: boolean;
  createdAt?: string;
  externalIdpId?: string | null;
  firstLoginIntent?: string;
  name?: string;
  phoneNumber?: string;
  picture?: string | null;
  profile?: any;
  username?: string | null;
  city?: string | null | undefined;
}

export interface SingleBlogPageFormTypes {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  countryCode?: string;
  phone?: string;
  checkin?: string;
  check_out?: string;
  location?: string;
  guests?: number;
}

export interface ContactPageFormTypes {
  id: string;
  fullName?: string;
  company?: string;
  countryCode?: string;
  phone?: string;
  email?: string;
  message?: string;
}

export interface CorporatePageFormTypes {
  id: string;
  firstname?: string;
  lastname?: string;
  countryCode?: string;
  phone?: string;
  email?: string;
  company?: string;
  city?: string;
  message?: string;
}

export interface EYPageFormTypes {
  id: string;
  email?: string;
}

export interface PartnerPageFormTypes {
  id: string;
  fullName?: string;
  countryCode?: string;
  phone?: string;
  email?: string;
  location?: string;
}

export interface RedCarpentPageFormTypes {
  id: string;
  phone?: string;
  email?: string;
}

export interface EventListingPageFormTypes {
  id: string;
  firstname?: string;
  email?: string;
  phone?: string;
  number_of_guest?: string;
  checkin?: string;
  check_out?: string;
  city?: string;
  daterange?: string;
  company?: string;
}

export interface LeadFormTypes {
  id: string;
  firstname?: string;
  email?: string;
  phone?: string;
  city?: string;
}

export const infoFields: FieldConfig<UserDetailsTypes>[] = [
  {
    name: 'salutation',
    label: 'Salutation',
    type: 'radio',
    options: ['Mr.', 'Mrs.', 'Ms.'],
    value: '',
    disablePastDates: false,
  },
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    value: '',
    disablePastDates: false,
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    value: '',
    disablePastDates: false,
  },
  // { name: 'dob', label: 'Date of Birth', type: 'dob' },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    value: '',
    disablePastDates: false,
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'phone',
    value: '',
    disablePastDates: false,
  },
];

// Blog Single Page Form
export const blogFormFieldsPersonalDetails: FieldConfig<SingleBlogPageFormTypes>[] =
  [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      value: '',
      disablePastDates: false,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      value: '',
      disablePastDates: false,
    },
    {
      name: 'phone',
      label: 'Phone Number',
      type: 'phone',
      value: '',
      disablePastDates: false,
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      value: '',
      disablePastDates: false,
    },
  ];
export const blogFormFieldsLocation: FieldConfig<SingleBlogPageFormTypes>[] = [
  {
    name: 'location',
    label: 'Location',
    type: 'text',
    value: '',
    disablePastDates: false,
  },
];
export const blogFormFieldsBookingDetails: FieldConfig<SingleBlogPageFormTypes>[] =
  [
    {
      name: 'checkin',
      label: 'Check In',
      type: 'daterange',
      value: '',
      disablePastDates: true,
    },
  ];
export const blogFormFieldsGuests: FieldConfig<SingleBlogPageFormTypes>[] = [
  {
    name: 'guests',
    label: 'Guests',
    type: 'number',
    value: '',
    disablePastDates: false,
  },
];

// Contact Page Form
export const contactFormFields: FieldConfig<ContactPageFormTypes>[] = [
  {
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
    value: '',
    disablePastDates: false,
  },
  {
    name: 'company',
    label: 'Company',
    type: 'text',
    value: '',
    disablePastDates: false,
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'phone',
    value: '',
    disablePastDates: false,
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    value: '',
    disablePastDates: false,
  },
];
export const contactFormFieldsMessage: FieldConfig<ContactPageFormTypes>[] = [
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    value: '',
    disablePastDates: false,
  },
];

// Partner Page Form
export const partnerFormFields: FieldConfig<PartnerPageFormTypes>[] = [
  {
    name: 'fullName',
    label: 'Full Name',
    type: 'text',
    value: '',
    disablePastDates: false,
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    value: '',
    disablePastDates: false,
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'phone',
    value: '',
    disablePastDates: false,
  },
  {
    name: 'location',
    label: 'Location',
    type: 'text',
    value: '',
    disablePastDates: false,
  },
];

export const redCarpentFormFields: FieldConfig<RedCarpentPageFormTypes>[] = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    value: '',
    disablePastDates: false,
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'phone',
    value: '',
    disablePastDates: false,
  },
];

// Event Listing Page Form
export const eventListingFormFields: FieldConfig<EventListingPageFormTypes>[] =
  [
    {
      name: 'firstname',
      label: 'Full Name',
      type: 'text',
      value: '',
      disablePastDates: false,
    },
    {
      name: 'email',
      label: 'Official Email Address',
      type: 'email',
      value: '',
      disablePastDates: false,
    },
    {
      name: 'phone',
      label: 'Mobile Number',
      type: 'phone',
      value: '',
      disablePastDates: false,
    },

    {
      name: 'number_of_guest',
      label: 'No of Guests',
      type: 'number',
      value: '',
      disablePastDates: false,
    },
    {
      name: 'city',
      label: 'Preferred Location ',
      type: 'text',
      value: '',
      disablePastDates: false,
    },
  ];

export const eventListingCompanyField: FieldConfig<EventListingPageFormTypes>[] =
  [
    {
      name: 'company',
      label: 'Company Name',
      type: 'text',
      value: '',
      disablePastDates: false,
    },
  ];

export const eventListingLocationField: FieldConfig<EventListingPageFormTypes>[] =
  [
    {
      name: 'city',
      label: 'Preferred Location ',
      type: 'text',
      value: '',
      disablePastDates: false,
    },
  ];

export const LeadFormFields: FieldConfig<LeadFormTypes>[] = [
  {
    name: 'firstname',
    label: 'Full Name',
    type: 'text',
    value: '',
    disablePastDates: false,
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    value: '',
    disablePastDates: false,
  },
  {
    name: 'phone',
    label: 'Mobile Number',
    type: 'phone',
    value: '',
    disablePastDates: false,
  },
  {
    name: 'city',
    label: 'Preferred Location ',
    type: 'text',
    value: '',
    disablePastDates: false,
  },
];

// Event Listing page
export const eventListingFromAndTo: FieldConfig<EventListingPageFormTypes>[] = [
  // {
  //   name: 'daterange',
  //   label: 'Event Dates',
  //   type: 'daterange',
  //   value: '',
  //   disablePastDates: true,
  //   fromField: 'checkin',
  //   toField: 'check_out',
  // },
  {
    name: 'checkin',
    label: 'Check In',
    type: 'daterange',
    value: '',
    disablePastDates: true,
  },
  // {
  //   name: 'check_out',
  //   label: 'Check Out',
  //   type: 'daterange',
  //   value: '',
  //   disablePastDates: true,
  // },
];

// Corporate Page Form
export const corporateFields: FieldConfig<CorporatePageFormTypes>[] = [
  {
    name: 'firstname',
    label: 'First Name',
    type: 'text',
    value: '',
    disablePastDates: false,
  },
  {
    name: 'lastname',
    label: 'Last Name',
    type: 'text',
    value: '',
    disablePastDates: false,
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'phone',
    value: '',
    disablePastDates: false,
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    value: '',
    disablePastDates: false,
  },
];
export const corporateFieldsCompanyName: FieldConfig<CorporatePageFormTypes>[] =
  [
    {
      name: 'company',
      label: 'Company Name',
      type: 'text',
      value: '',
      disablePastDates: false,
    },
    {
      name: 'city',
      label: 'Preferred Location',
      type: 'text',
      value: '',
      disablePastDates: false,
    },
  ];
export const corporateFieldsMessage: FieldConfig<CorporatePageFormTypes>[] = [
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    value: '',
    disablePastDates: false,
  },
];

// EY form
export const eyFormEmailField: FieldConfig<EYPageFormTypes>[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'textarea',
    value: '',
    disablePastDates: false,
  },
];
