declare module 'navbar-types' {
  interface NavbarProps {
    variant?: NavbarVariant;
    behavior?: NavbarBehavior;
    logo?: React.ReactNode;
    userInitials?: string;
    location?: string;
    dateRange?: string;
    guestCount?: string;
    onSearch?: () => void;
    className?: string;
    middleContent?: React.ReactNode;
    isPrive?: boolean;
    isTransparent?: boolean;
  }
}
