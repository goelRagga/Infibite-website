declare module 'date-type' {
  export interface DateRangeSelector {
    placement?: 'availability' | 'filterbar';
    className?: string;
    date: DateRange;
    handleDateChange: (date: DateRange) => void;
    isCalendarOpen: boolean;
    setIsCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleClearDates: (shouldClearParams?: any) => void;
    handleSelectGuestsClick: () => void;
    children?: React.ReactNode;
    propertyID?: string;
    isPopover?: boolean;
    handlePopoverClose?: Function;
    handleGuestDrawerOpen?: Function;
    handleGuestDrawerClose?: Function;
    dayContent?: any;
    handleBackClick?: any;
    sideOffset?: number;
    popoverContentClassName?: string;
    onConfirm?: () => void;
  }

  export interface Inventory {
    date: string;
    quantity: number;
    minimumStay?: number | undefined;
    maximumStay?: number | undefined;
    checkoutOnly?: boolean | undefined;
    stopSell?: boolean | undefined;
    __typename: string;
  }
  export interface DateBookedResult {
    isBooked: boolean;
    bookedDates: string[];
  }
}
