export const LOYALTY_CAPTION =
  'Start enjoying exclusive offers, upgrades, and curated experiences crafted for our members.';

export const brandNames = ['ELIVAAS', 'PRIVE', 'ALAYASTAYS'];

export const emptyStates = {
  all: {
    title: 'Uh-oh.',
    description: 'Create a booking to start earning Elicash.',
    buttonText: 'Book Now',
  },
  upcoming: {
    title: 'No upcoming transactions',
    description:
      "You don't have any upcoming transactions at the moment. Create a new booking to see future earnings.",
    buttonText: 'Book More',
  },
  expired: {
    title: 'No expired transactions',
    description:
      "You don't have any expired transactions. Keep earning Elicash and use them before they expire!",
    buttonText: 'Book Again',
  },
};

export enum MESSAGE_TYPE {
  USER = 'USER',
  AI = 'AI',
  SUGGESTIONS = 'SUGGESTIONS',
  COUPON = 'COUPON',
  GREETING = 'GREETING',
}

export enum WALLET_STATUS {
  EARNED = 'EARNED',
  UPCOMING = 'UPCOMING',
  EXPIRED = 'EXPIRED',
  USED = 'USED',
}

export const fallbackFooterData = {
  company: {
    title: 'COMPANY',
    links: [
      { name: 'About Us', href: '/explore/about-us' },
      { name: 'Blogs', href: '/explore/blogs' },
      { name: 'Our Team', href: '/explore/team' },
      { name: 'Contact Us', href: '/explore/contact' },
      { name: 'Press Release', href: '/explore/press-release' },
      { name: 'Partner with us', href: '/explore/partner' },
      { name: 'Corporate Offsites', href: '/explore/corporate-offsite' },
      { name: 'Events', href: '/explore/event' },
      { name: 'Sitemap', href: '/sitemap' },
      { name: 'Careers', href: 'http://careers.elivaas.com', target: 'blank' },
    ],
  },
  domesticDestinations: { title: 'EXPLORE VILLAS', regions: [] },
  social: { title: 'SOCIAL' },
};

export const blueMemberSvg = `${process.env.IMAGE_DOMAIN}/Blue_5b69a1cdb4.svg`;

export const silverMemberSvg = `${process.env.IMAGE_DOMAIN}/Silver_2e7cf38e76.svg`;

export const goldMemberSvg = `${process.env.IMAGE_DOMAIN}/Gold_1ccc8c11f4.svg`;

export const diamondMemberSvg = `${process.env.IMAGE_DOMAIN}/Diamond_0c3bc602bb.svg`;

export const ReservePlusTierMemberSvg = `${process.env.IMAGE_DOMAIN}/Trial_21eb5b6493.svg`;

export const colorClasses = {
  blue: 'var(--blue17)',
  silver: 'var(--silver7)',
  gold: 'var(--gold14)',
  diamond: 'var(--diamond7)',
};

export const glowColorClasses = {
  blue: {
    className: 'bg-[var(--blue4)]',
    borderGradient:
      'linear-gradient(to bottom left, #11395E 21.13%, #1F5A99 34.61%, #7CAEFF 71.4%)',
    boxShadow: '0px 4px 10px 4px #5D83AE4D',
  },
  silver: {
    className: 'bg-[var(--grey2)]',
    borderGradient:
      'linear-gradient(to bottom left, #151515 16.15%, #373737 49.38%, #DFDFDF 69.86%)',
    boxShadow: '0px 4px 10px 4px #404040',
  },
  gold: {
    className: 'bg-[var(--gold3)]',
    borderGradient:
      'linear-gradient(to bottom left,#442C11 30.04%, #6D4E1F 40.66%,#BF933C 62.07%,rgba(247, 239, 218, 0.8) 81.81%)',
    boxShadow: '3px 4px 10px 4px #65441A66',
  },
  diamond: {
    className: 'bg-[var(--diamond1)]',
    borderGradient:
      'linear-gradient(to bottom left,#2C1942 30.04%,#7E469F 40.66%,#AC5CCC 62.07%,#E7DAFF 81.81%)',
    boxShadow: '0px 4px 10px 4px #492A6A66',
  },
};

export const SecurityRefundDetails = {
  content:
    'Below are the details “Security Deposit” paid & damages found along with (photo proof) during your stay at our villa and we levy repair cost from the Security Amount deposited by you.',
  refundAmountTypo: 'Refund amount',
  amountToPayTypo: 'Amount to pay',
  acknowledgementRefund:
    'I acknowledge the mentioned damages are done by guest (me).',
  securityDepositTypo: 'Security deposit paid',
  remarkContent:
    'Refilled all the items in the standard refill all the items in the standard inventory, items in the standard inventory View More',
};

export const includesTaxLine = 'includes taxes and platform fee';
export const platformFeeLine = 'and platform fee';
export const toolTipInfoText = 'Total includes taxes ';

export const DEFAULT_IMAGE =
  'https://cpjlcwamma.cloudimg.io/Hospitality_4a9668a2e8.jpg?width=1000&height=380&func=boundmin&force_format=webp&q=40';

export const securityDeposit = {
  title: 'Security Deposit',
  caption:
    'Any damages caused by the guest will be subject to charge penalty from this amount.',
  payCash: 'Pay in cash',
  payOnline: 'Pay online',
  payCashCaption:
    'Do you want to pay the “Security Deposit” in cash during check-in?',

  payInstruction: {
    title: 'Instructions on where and when to pay',
    instructionsList: [
      'Pay at the Villa on check-in date',
      'An executive will be assigned to collect the cash',
      'Your cash payment will reflect on the system within 24 hours payment collection by our executives',
    ],
  },
  payAgreement: 'of ELIVAAS for security deposit paying in cash.',
  terms: 'Terms and Conditions',
  paymentStatus: {
    deposit: {
      success: {
        title: 'Payment Successful',
        caption: 'against Security Deposit has been successful.',
      },
      failure: {
        title: 'Oh no, your payment failed!',
        caption: 'Please use different payment mode or try again later.',
      },
    },
  },
};
// Suggested questions for property-related queries
export const SUGGESTED_QUESTIONS = [
  'What amenities are available at this property?',
  'What are the check-in and check-out times?',
  'Is there parking available?',
  'Are pets allowed?',
  'Is WiFi available?',
  "What's the best way to reach this property?",
];

import { Facebook, Instagram, Twitter, User } from 'lucide-react';
export const refund = {
  noDamage:
    'Thank you for staying with us and treating the villa with such care!',
  refundProcessing:
    'Refund processing might take 3-5 business days to reflect in your bank account.',
  acknowledgment: 'I acknowledge the mentioned damages are done by guest (me).',
  refundStatus: {
    success: {
      title: 'Refund Successful',
      caption:
        'has been successfully processed and it will reflect to your bank account in 3-5 business days.',
    },
    failure: {
      title: 'Oh no, refund failed!',
      caption: 'has been failed to process. Please try again',
    },
    settle: {
      title: 'Settle balance',
      proceedSettlement:
        'Proceed settlement as there is no balance left to refund against your Security deposit and damage deductions.',
    },
  },
};
export const DepositStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
};
export const DepositMode = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
};
export const RefundStatus = {
  PROCESSED: 'PROCESSED',
  PROCESSING: 'PROCESSING',
  FAILED: 'FAILED',
  PENDING: 'PENDING',
  SETTLED: 'SETTLED',
  DECUCTIONS_COLLECTED: 'DECUCTIONS_COLLECTED',
};
// Key-Value Store Keys
export const KEY_VALUE_KEYS = {
  HOMEPAGE_CONTENT: 'elivaasHomePageContent',
  PARTNER_LOGOS_CONTENT: 'partnerLogosContent',
  ALLIANCES_LOGOS_CONTENT: 'alliancesLogosContent',
  PARTNER_SECTION_CONTENT: 'partnerSectionContent',
  STATS_CONTENT: 'statsContent',
  EVENTS_SECTION_CONTENT: 'eventsSectionContent',
  STAR_STAYS_CONTENT: 'starStaysContent',
  STAYS_STORY_CONTENT: 'staysStoryContent',
  SPECIAL_CARD_CONTENT: 'specialCardContent',
  PRIVE_CARD_CONTENT: 'priveCardContent',
  SPOTLIGHT_CONTENT: 'spotlightContent',
  OFFERS_SECTION_CONTENT: 'offersSectionContent',
  ENCHANTING_AUTUMN_ESCAPES_CONTENT: 'enchantingAutumnEscapesContent',
  DISCOVER_NEWEST_GEMS_CONTENT: 'discoverNewestGemsContent',
  PRIVE_PROPERTIES_CONTENT: 'privePropertiesContent',
  PRIVE_ESCAPE_CURATION_CONTENT: 'priveEscapeCurationContent',
  PRIVE_SERVICES_SECTION_CONTENT: 'priveServicesSectionContent',
  PRIVE_HERO_SECTION_CONTENT: 'priveHeroSectionContent',
  PRIVE_SELECTION_CONTENT: 'priveSelectionContent',
  PRIVE_FEATURES_CONTENT: 'priveFeaturesContent',
  LOYALTY_FAQ: 'LoyaltyFAQ',
  EVENTS_LISTING_PAGE_CONTENT: 'eventListingData',
  RED_CARPET_PAGE_CONTENT: 'redCarpetPageContent',
  CORPORATE_OFFSITE_LISTING_PAGE_CONTENT: 'corporateOffsiteListingData',
  VILLA_LISTING_PAGE_CONTENT: 'VillaListingData',
  LOYALTY_MODAL_CARD_CONTENT: 'loyaltyModalCardContent',
  LOYALTY_EXPIRING_CARD_CONTENT: 'loyaltyExpiringCardContent',
} as const;
export const SECURITY_DEPOSIT_CONTENT =
  ' per villa to ensure the property is maintained in excellent condition for every guest. This amount is collected 48 hours prior to check-in via UPI, credit/debit card, or bank transfer. The deposit is fully refundable and will be returned within 5–7 working days after check-out, provided there are no damages to the property, violations of house rules, or delays in check-out procedures. In case of any deductions, guests will receive a detailed breakdown. Please note that the deposit amount may vary for premium properties or high-value bookings, and for group stays, a consolidated deposit may be applicable.';
export const PROPERTIES_LIST_ROUTE = '/villas';
export const STEP_CONFIG = {
  login: {
    title: 'Your Key to Exclusive Stays',
    description: 'Sign up or log in for a seamless villa booking experience.',
    image: `${process.env.IMAGE_DOMAIN}/Web_786dbac8a9.svg`,
    mobileImage: `${process.env.IMAGE_DOMAIN}/Mobile_2_1_808a2ab3f6.svg`,
    alt: 'Login',
  },
  otp: (phone: string, code: string) => ({
    title: 'Verify Your Number',
    description: `Enter the OTP sent via SMS/WhatsApp to ${code} ${phone}`,
    image: `${process.env.IMAGE_DOMAIN}/Web_786dbac8a9.svg`,
    mobileImage: `${process.env.IMAGE_DOMAIN}/Mobile_1_3ad030c198.svg`,
    alt: 'OTP verification',
  }),
  signup: {
    title: 'Complete Your Profile',
    description:
      'Enter your details to personalise your experience and complete your sign-up.',
    image: `${process.env.IMAGE_DOMAIN}/Web_2_2_1d9be85f86.svg`,
    mobileImage: `${process.env.IMAGE_DOMAIN}/Mobile_1_3ad030c198.svg`,
    alt: 'Signup',
  },
};
export const phoneNumber = '+91 7969469950';
export const whatsAppNumber = '919220832244';
export const corporateOffsitePhoneNumber = '+918065911700';
export const delhiPhoneNumber = '+917428006966';
export const maharashtraPhoneNumber = '+918527392121';
export const uttarakhandPhoneNumber = '+917303932445';
export const goaPhoneNumber = '+919205122276';
export const visaPhoneNumber = '+917969469968';
export const propertyDetailTabs = [
  { name: 'Overview', id: 'overview' },
  { name: 'About Home', id: 'about' },
  { name: 'Cancellation', id: 'cancellation' },
  { name: 'Reviews', id: 'reviews' },
  { name: 'Amenities', id: 'amenities' },
  { name: 'Services', id: 'services' },
  { name: 'Spaces', id: 'spaces' },
  { name: 'Location', id: 'location' },
];
export const SEARCH_PARAM = {
  CANCELLATION_PLAN: 'cancellationPlan',
  BANK_OFFER: 'bankOfferCode',
  COUPON_CODE: 'couponCode',
  MEAL_PLAN: 'mealPlan',

  FILTERS: {
    SORT: 'sort',
    PRICE: {
      MIN: 'price_min',
      MAX: 'price_max',
    },
    ROOM: 'room',
    PET_FRIENDLY: 'isPetFriendly',
    IS_PRIVE: 'propertyBrand',
    PROPERTY_TYPE: 'propertyType',
    PROPERTY_BRAND: 'propertyBrand',
    IS_STRESSED: 'isSt',
  },
  BOOKING_STATUS: 'bookingStatus',
};

export const PRIVE_PROPERTIES_LIST_ROUTE = `${PROPERTIES_LIST_ROUTE}?${SEARCH_PARAM.FILTERS.IS_PRIVE}=PRIVE`;

export const FOOTER_DATA = {
  domesticDestinations: {
    title: 'DOMESTIC DESTINATIONS',
    regions: [
      {
        name: 'NORTH',
        cities: ['Delhi', 'NCR', 'Kasauli', 'Shimla', 'Nainital'],
      },
      {
        name: 'WEST',
        cities: ['Mumbai', 'Goa', 'Ahmedabad'],
      },
      {
        name: 'EAST',
        cities: ['Darjeeling', 'Ghantok'],
      },
      {
        name: 'SOUTH',
        cities: ['Varkala', 'Kochi', 'Kovalam', 'Ooty', 'Munnar'],
      },
    ],
  },
  internationalDestinations: {
    title: 'INTERNATIONAL DESTINATIONS',
    regions: [
      {
        name: 'ASIA',
        cities: ['Ho Chi Min', 'Koh Phi Phi', 'Bali'],
      },
      {
        name: 'AMERICAS',
        cities: ['Brazil', 'Mexico'],
      },
      {
        name: 'OCEANIA',
        cities: ['Sydney', 'Wellington'],
      },
      {
        name: 'EUROPE',
        cities: ['Amsterdam'],
      },
    ],
  },
  company: {
    title: 'COMPANY',
    links: [
      'About Us',
      'Blogs',
      'Our Team',
      'Contact Us',
      'Press Release',
      'Partner with us',
      'Corporate Offsites',
      'Events',
      'Sitemap',
    ],
  },
  social: {
    title: 'SOCIAL',
    platforms: [
      {
        name: 'Facebook',
        icon: Facebook,
        link: 'https://www.facebook.com/stay.elivaas/',
      },
      {
        name: 'Instagram',
        icon: Instagram,
        link: 'https://www.instagram.com/stay.elivaas/',
      },
      { name: 'Twitter', icon: Twitter, link: 'https://x.com/StayElivaas/' },
    ],
  },
  copyright: {
    text: 'Copyright Ishanee Villas Tech Private Limited. All Rights Reserved',
    links: [
      { text: 'Privacy Policy', url: '/explore/privacy-policy' },
      { text: 'Terms & Conditions', url: '/explore/terms-and-conditions' },
    ],
  },
};

export const guestIcon = `${process.env.IMAGE_DOMAIN}/guests_3179a6ea86.svg`;
export const bedsIcon = `${process.env.IMAGE_DOMAIN}/beds_23721bf828.svg`;
export const bathsIcon = `${process.env.IMAGE_DOMAIN}/baths_dda4df1dac.svg`;

export const ERROR = {
  INVALID_COUPON: 'Please enter a valid coupon code',
};

export const dinersClubOffer = {
  __typename: 'Offer',
  code: 'ESZYDINER',
  description: 'Get 20% off upto INR 10,000 on redeeming 5,000 EazyPoints',
  endDateTime: '2025-11-30',
  termsAndConditions:
    '<ul>\n' +
    '       <li>Offer is exclusively for EazyDiner Members & can be availed on redeeming 5000 EazyPoints via EazyDiner App</li>\n' +
    '       <li>Applicable on ELIVAAS website rates & can be availed via website only</li>\n' +
    '       <li>Offer is valid till 30-Nov-25 for stays till 31-Dec-25</li>\n' +
    '       <li>No minimum number of nights & transaction/booking amount is applicable</li>\n' +
    '       <li>Offer is clubbable with running website offers & not payment offers</li>\n' +
    ' </ul>',
  maximumDiscountAllowed: 300000,
  title: 'EazyDiner Exclusive',
  discountPercentage: null,
  discountMethod: 'BANK',
  icon: `${process.env.IMAGE_DOMAIN}/image_8_6c535b4859.webp`,
};

export const bajajFinserv = {
  __typename: 'Offer',
  code: 'Bajaj Finserv Exclusive No Cost EMI Offer',
  description: 'Enjoy interest-free payments with Bajaj Finserv No Cost EMI.',
  endDateTime: '2026-03-17',
  termsAndConditions:
    '<ul>\n' +
    '       <li>No Cost EMI applicable only on BAJAJ FINSERV Cards.</li>\n' +
    '       <li>Offer Period: 17-Mar-25 to 17-Mar-26, for stays until 31-Jul-26.</li>\n' +
    '       <li>Can be availed multiple times during the Offer period.</li>\n' +
    '       <li>Max EMI amount for 3 months & 6 months - INR 2 lakhs.</li>\n' +
    '       <li>Can be availed online via website or through Reservation Desk.</li>\n' +
    '       <li>The offer cannot be clubbed with any other running Payment/Bank offers.</li>\n' +
    ' </ul>',
  maximumDiscountAllowed: 300000,
  title: 'Bajaj Finserv Exclusive No Cost EMI Offer',
  discountPercentage: null,
  discountMethod: 'BANK',
  icon: `${process.env.IMAGE_DOMAIN}/image_9_4e084e7738.webp`,
};

export const sortByOptions = [
  // { value: 'best-value', label: 'Best Value' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  // { value: 'ratings', label: 'Ratings' },
];

// My Bookings
export const bookingStatusType = [
  {
    label: 'Upcoming Stay',
    code: 'CONFIRMED',
  },
  {
    label: 'Completed',
    code: 'COMPLETED',
  },
  {
    label: 'Cancelled',
    code: 'CANCELLED',
  },
];

export const BASE64 =
  'data:image/webp;base64,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';

export const priveFeatureMap: Record<
  string,
  { label: string; icon?: string; lucideIcon?: React.ComponentType<any> }
> = {
  Guests: { label: 'guests', lucideIcon: User },
  Beds: { label: 'beds', icon: bedsIcon },
  Bathrooms: { label: 'baths', icon: bathsIcon },
};

export const normalFeatureMap: Record<string, { label: string }> = {
  Guests: { label: 'guests' },
  Bathrooms: { label: 'bathrooms' },
  Bedrooms: { label: 'bedrooms' },
};

export const DEFAULT_SEARCH_PANEL_OFFSET = 285;

export const FAQ = {
  header: {
    name: 'ELIVAAS',
    desc: 'Property AI Assistant',
  },
};

export const LOYALTY_HOME_PAGE_CONTENT = {
  congratulations: ' Congratulations!',
  joinThe: 'Join the',
  elivaasElite: 'ELIVAAS RESERVE',
  program: 'program',
  content:
    'Every journey with ELIVAAS comes with rewards. Sign in or join to unlock your Blue Membership and enjoy exclusive offers, perks, and curated experiences.',
  ctaName: 'Become a Member',
  LoggedIn: {
    elivaasLoyalty: 'ELIVAAS RESERVE',
    mobileContent:
      'Book your next trip to reach the next tier and unlock more rewards.',
    webConteht:
      'Your membership unlocks special rates, perks, and experiences. Keep booking and exploring to reach the next tier and enjoy even more rewards.',
    ctaName: 'View Benefits',
    defaultMember: 'Blue',
    keepThisTier: 'Keep this tier',
  },
};

export const LOYALTY_LISTING_CONTENT = {
  elivaasEliteName: 'ELIVAAS RESERVE',
  title: 'Stay More. Earn More',
  description: 'Become a member to start earning Elicash on every stay.',
  ctaNamePropertyListing: 'Become a Member',
};

export const PARTNER_PAGE = {
  benefitsSectionHeading: 'What You Get with ELIVAAS',
  benefitsSectionDescription:
    'From dynamic pricing to full guest support — we handle the details so you can earn more and stress less.',
  travelPlatformsTitle:
    'We help you earn more by listing your villa on all major platforms.',
  SingleModalFormTitle: 'Ready to List Your Villa with ELIVAAS?',
  SingleModalFormDescription:
    'Let’s help you earn more, host better, and unlock your property’s full potential — start the conversation today.',
  SingleModalFormCtaTitle: 'Become a Partner',
  SingleModalFormFormTitle: "Let's Get Started",
  excellenceAwardsTitle: 'Recognized for Excellence',
};

// AI Chat HubSpot Configuration
export const AI_CHAT_HUBSPOT = {
  ENDPOINT: `https://api.hsforms.com/submissions/v3/integration/submit/44221819/e24ac1fb-c473-4ebe-9b88-43d5c465749a`,
};

// AI Chat Bot Messages
export const AI_CHAT_MESSAGES = {
  // Registration flow messages
  ASK_PHONE:
    'Before I assist you, could you please share your **mobile number**. This helps us serve you better.\n\n*(Format: 10-digit number, e.g., 9876543210)*',
  INVALID_PHONE:
    'Please enter a valid mobile number of 10 digits.\n\n *(Format: 9876543210)*',
  ASK_NAME:
    'Thank you! Could you please share your **name**? \n\n *(Optional - type "skip" to continue)',
  SKIP_NAME_RESPONSE: `No problem! 😊\n\nI'm now processing your question. Please wait...`,
  PROCESSING_QUESTION: `I'm now processing your question. Please wait...`,

  // Error messages
  ERROR_PROCESSING:
    'I apologize, but I encountered an issue processing your request. Please try again.',
  ERROR_WITH_MESSAGE: () =>
    'I apologize, but I encountered an error processing your request. Please try again.',

  // Greeting templates
  GREETING_WITH_NAME: (firstName: string) => `Thank you, **${firstName}**! 😊`,
  GREETING_WITHOUT_NAME: 'Thank you! 😊',

  WELCOME_MESSAGE: (firstName: string) =>
    `Hi ${firstName}! 👋 How can I help you plan your perfect stay?`,

  // Registration Form texts
  REGISTRATION: {
    GREETING_TITLE_1: 'Hey there, ',
    GREETING_TITLE_2: 'I am eli',
    GREETING_SUBTITLE:
      "Your AI assistant for this property, ask any questions or details you'd like to know.",
    PROMO_MESSAGE:
      "Before we go ahead — I've found a special limited-time saving on this property.",
    PROMO_TITLE: 'Limited time offer - Upto 10% off',
    PROMO_DESCRIPTION: 'Unlock your exclusive discount in seconds!',
    COUPON_DESCRIPTION: 'Use the code at checkout to enjoy the benefits',
    COUPON_CODE: 'SPECIALOFFER',
    BUTTON_REGISTER: 'Register Now',
    BUTTON_GET_COUPON: 'Get My Coupon',
    BUTTON_REGISTERING: 'Unlocking Discount...',
    BUTTON_CONTINUE: 'Continue to Chat',
    LABEL_NAME: 'Your Name',
    LABEL_PHONE: 'Phone Number',
    PLACEHOLDER_NAME: 'Enter your name',
    ERROR_NAME_REQUIRED: 'Name is required',
    ERROR_NAME_INVALID: 'Name should only contain letters',
    ERROR_PHONE_REQUIRED: 'Phone number is required',
    ERROR_PHONE_INVALID: 'Please enter a valid 10-digit phone number',
    // Welcome messages
    WELCOME_BACK_WITH_NAME: (firstName: string) =>
      `Welcome back, ${firstName}! How can I help you plan your perfect stay at this property?`,
    WELCOME_BACK: 'Welcome back! How can I assist you with this property?',
    WELCOME_FIRST_TIME: (firstName: string) =>
      `Hi ${firstName}! How can I help you plan your perfect stay at this property?`,
  },
};

// Local Storage Keys
export const LOCAL_STORAGE_KEYS = {
  CAPTURED_LEAD: 'captured_lead',
};

export const RED_CARPET_PAGE_CONTENT = {
  bannerSectionCta: 'Exclusive Offer for You',
  bannerSectionContent:
    'Thank you for sharing your feedback.We’ve reflected, corrected, and would love to welcome you back with more care.',
  errorMessage: {
    title: 'Unable to Access Booking',
    content:
      "Please ensure you're logged in with the correct account and try again.",
  },
  bookingCardSection: {
    title: 'Your booking & feedback',
    thankYouForFeedback: 'Thank you for your feedback',
    CHECK_IN_OUT: 'CHECK IN - OUT',
    PAID_AMOUNT: 'PAID AMOUNT',
  },
  benefitCard: {
    unlockThis: 'Unlock This',
    tAndCApply: 'T&C apply',
  },
  complementarySection: {
    title: 'Complimentary Benefits Just For You',
    successMessage:
      'Your complimentary appreciation has been activated and sent to the email you used to sign in.',
    selectAnyOne: 'SELECT ANY ONE',
  },
  benefitUnlockedSection: {
    title: 'Complimentary Benefit Unlocked',
    content:
      'Your complimentary appreciation has been successfully activated and will be sent to your registered email shortly.',
    cta: 'Explore more!',
  },
};
