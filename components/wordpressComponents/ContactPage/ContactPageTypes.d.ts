declare module 'contact-page' {
  interface ContactPageProps {
    contactPageBanner?: string;
  }
  interface LeftSideContentSectionProps {
    contactPageHeading?: string;
    contactPageSubHeading?: string;
    customerSupportDescription?: string;
    customerSupportEmailAddress?: string;
    customerSupportPhoneNumber?: string;
    customerSupportTitle?: string;
    mediaEnquiriesDescription?: string;
    mediaEnquiriesEmailAddress?: string;
    mediaEnquiriesTitle?: string;
  }
  interface MapSectionProps {
    addressMapLink?: string;
  }
  interface ContactAddressSectionProps {
    officeAddressTitle?: string;
    officeAddress?: string;
  }
}
