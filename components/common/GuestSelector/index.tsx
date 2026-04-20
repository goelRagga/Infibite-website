import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui';
import {
  AlertTriangle,
  ChevronDown,
  ChevronDownIcon,
  ChevronUpIcon,
  Minus,
  Plus,
  User,
  Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import Children from '@/assets/children.svg';
import { GuestsData } from '@/contexts';
import useIsMobile from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

interface GuestSelectorProps {
  guestsData: GuestsData;
  onChange: (newData: GuestsData) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  pageType?: string;
  children?: React.ReactNode;
  isBooking?: boolean;

  displayLabel?: string;
  showGuestBreakdown?: boolean;
}

const GUEST_CONFIGS = {
  numberOfGuests: {
    label: 'Adults',
    description: '13 years & above',
    icon: User,
    min: 1,
    maxKey: 'max_adults' as keyof GuestsData,
  },
  numberOfChildren: {
    label: 'Children',
    description: 'Below 12 years',
    icon: Children,
    min: 0,
    maxKey: 'max_children' as keyof GuestsData,
  },
} as const;

const Counter: React.FC<{
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min: number;
  max: number;
  disableIncrement?: boolean;
  disableDecrement?: boolean;
}> = ({
  value,
  onIncrement,
  onDecrement,
  min,
  max,
  disableIncrement = false,
  disableDecrement = false,
}) => {
  const prevValue = useRef(value);
  const isIncrementing = value > prevValue.current;
  prevValue.current = value;

  const buttonClasses =
    'h-8 w-8 rounded-full border-accent-red-900 text-accent-red-900 dark:border-[var(--accent-background)] dark:text-[var(--accent-background)] dark:bg-background text-2xl disabled:border-primary-200 disabled:text-primary-200 dark:disabled:border-secondary-950 dark:disabled:text-secondary-950';

  return (
    <div className='flex items-center gap-3'>
      <Button
        variant='outline'
        size='icon'
        className={buttonClasses}
        onClick={onDecrement}
        disabled={disableDecrement || value <= min}
      >
        <Minus className='w-4 h-4' />
      </Button>
      <span
        key={value}
        className={cn(
          'w-6 text-center inline-block dark:text-[var(--accent-background)]',
          isIncrementing ? 'animate-slide-up' : 'animate-slide-down'
        )}
      >
        {value}
      </span>
      <Button
        variant='outline'
        size='icon'
        className={buttonClasses}
        onClick={onIncrement}
        disabled={disableIncrement || value >= max}
      >
        <Plus className='w-4 h-4' />
      </Button>
    </div>
  );
};

const ErrorAlert: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className='flex justify-center items-center gap-2 bg-accent-red-50 border border-accent-red-200 rounded-md text-accent-red-600 p-1 m-3'>
      <AlertTriangle className='w-4 h-4 text-accent-red-00' />
      <span className='text-xs font-medium'>{message}</span>
    </div>
  );
};

const GuestFields: React.FC<{
  guestsData: GuestsData;
  onChange: (newData: GuestsData) => void;
  pageType?: string;
}> = ({ guestsData, onChange, pageType }) => {
  const [exceedsMaxOccupancy, setExceedsMaxOccupancy] = useState(false);
  const [extraAdult, setExtraAdult] = useState(false);
  const [extraChild, setExtraChild] = useState(false);
  const [extraChildLessAdult, setExtraChildLessAdult] = useState(false);

  const {
    numberOfGuests = 1,
    numberOfChildren = 0,
    max_adults = 10,
    max_children = 5,
    max_occupancy = 15,
    standard_guests = 2,
  } = guestsData;

  const totalGuests = numberOfGuests + numberOfChildren;

  useEffect(() => {
    setExceedsMaxOccupancy(false);
    setExtraAdult(false);
    setExtraChild(false);
    setExtraChildLessAdult(false);

    if (numberOfGuests > max_adults) {
      setExtraAdult(true);
    }

    if (numberOfChildren > max_children) {
      setExtraChild(true);
    }

    const adultRemainingCapacity = max_adults - numberOfGuests;

    if (adultRemainingCapacity === 0 && numberOfChildren > max_children) {
      setExtraChild(true);
    } else if (adultRemainingCapacity > 0) {
      if (numberOfChildren - adultRemainingCapacity > max_children) {
        setExtraChild(false);
        setExtraChildLessAdult(true);
      } else {
        setExtraChild(false);
        setExtraChildLessAdult(false);
      }
    } else {
      setExtraChildLessAdult(false);
    }

    if (totalGuests >= max_occupancy) {
      setExceedsMaxOccupancy(true);
    }
  }, [
    numberOfGuests,
    numberOfChildren,
    max_adults,
    max_children,
    max_occupancy,
    totalGuests,
  ]);

  const updateGuestCount = (
    field: keyof typeof GUEST_CONFIGS,
    increment: boolean
  ) => {
    const config = GUEST_CONFIGS[field];
    const currentValue = guestsData[field] || 0;
    const maxValue = (guestsData[config.maxKey] as number) || 100;

    let newValue = currentValue;

    if (field === 'numberOfGuests') {
      if (
        increment &&
        numberOfGuests < max_adults &&
        totalGuests < max_occupancy
      ) {
        newValue = currentValue + 1;
      } else if (
        !increment &&
        (numberOfGuests > 1 || (numberOfGuests === 1 && numberOfChildren > 0))
      ) {
        newValue = currentValue - 1;
      }
    } else if (field === 'numberOfChildren') {
      if (
        increment &&
        numberOfChildren < max_children &&
        totalGuests < max_occupancy
      ) {
        newValue = currentValue + 1;
      } else if (!increment && numberOfChildren > 0) {
        newValue = currentValue - 1;
      } else if (!increment && numberOfGuests > 1) {
        onChange({ ...guestsData, numberOfGuests: numberOfGuests - 1 });
        return;
      }
    }

    if (newValue !== currentValue) {
      onChange({ ...guestsData, [field]: newValue });
    }
  };

  const disableIncrement = totalGuests >= max_occupancy;

  return (
    <div className='overflow-hidden rounded-xl'>
      {Object.entries(GUEST_CONFIGS).map(([field, config]) => {
        const Icon = config.icon;
        const value = guestsData[field as keyof GuestsData] || 0;
        const maxValue = (guestsData[config.maxKey] as number) || 100;

        const disableIncrementLogic =
          field === 'numberOfGuests'
            ? disableIncrement || numberOfGuests >= max_adults
            : disableIncrement || numberOfChildren >= max_children;

        const disableDecrementLogic =
          field === 'numberOfGuests'
            ? !(
                numberOfGuests > 1 ||
                (numberOfGuests === 1 && numberOfChildren > 0)
              )
            : field === 'numberOfChildren'
              ? !(numberOfChildren > 0 || numberOfGuests > 1)
              : false;

        return (
          <div
            key={field}
            className='w-full flex items-center p-4 justify-between border-b border-primary-50 dark:bg-background dark:border-primary-800 last:border-b-0'
          >
            <div className='flex items-center'>
              <Icon className='w-4 h-4 mr-2 text-primary-800 fill-primary-800' />
              <div>
                <p className='font-medium text-primary-950 dark:text-accent-yellow-950'>
                  {config.label}
                </p>
                <p className='text-sm text-secondary-800 dark:text-white'>
                  {config.description}
                </p>
              </div>
            </div>
            <Counter
              value={value}
              onIncrement={() =>
                updateGuestCount(field as keyof typeof GUEST_CONFIGS, true)
              }
              onDecrement={() =>
                updateGuestCount(field as keyof typeof GUEST_CONFIGS, false)
              }
              min={config.min}
              max={maxValue}
              disableIncrement={disableIncrementLogic}
              disableDecrement={disableDecrementLogic}
            />
          </div>
        );
      })}

      {exceedsMaxOccupancy && (
        <ErrorAlert
          message={`Maximum guest occupancy reached ${max_occupancy}`}
        />
      )}
    </div>
  );
};

const getGuestDisplayText = (
  guestsData: GuestsData,
  showBreakdown: boolean = true
): string => {
  const {
    numberOfGuests = 1,
    numberOfChildren = 0,
    numberOfPets = 0,
  } = guestsData;
  const totalGuests = numberOfGuests + numberOfChildren;

  if (!showBreakdown) {
    return `${totalGuests} Guest${totalGuests !== 1 ? 's' : ''}`;
  }

  const parts = [];
  if (numberOfGuests > 0) {
    parts.push(`${numberOfGuests} Adult${numberOfGuests !== 1 ? 's' : ''}`);
  }
  if (numberOfChildren > 0) {
    parts.push(
      `${numberOfChildren} Child${numberOfChildren !== 1 ? 'ren' : ''}`
    );
  }
  if (numberOfPets > 0) {
    parts.push(`${numberOfPets} Pet${numberOfPets !== 1 ? 's' : ''}`);
  }

  return parts.join(', ');
};

const GuestSelector: React.FC<GuestSelectorProps> = ({
  guestsData,
  onChange,
  open,
  onOpenChange,
  pageType = 'home',
  children,
  isBooking = false,
  displayLabel,
  showGuestBreakdown = true,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isMobile = useIsMobile();

  const isControlled = open !== undefined;
  const openState = isControlled ? open : internalOpen;
  const setOpenState = isControlled ? onOpenChange! : setInternalOpen;

  const totalGuests =
    (guestsData.numberOfGuests || 1) + (guestsData.numberOfChildren || 0);
  const iconClasses = pageType === 'home' ? 'text-white' : 'text-primary';
  const textClasses = pageType === 'home' ? 'text-white' : 'text-gray-700';

  const defaultTriggerContent = (
    <div
      className={cn(
        'flex items-center justify-between w-full px-4 py-4',
        textClasses
      )}
    >
      <div className='flex items-center flex-1'>
        <Users className={cn('w-4 h-4 mr-2', iconClasses)} />
        <span>
          {displayLabel || getGuestDisplayText(guestsData, showGuestBreakdown)}
        </span>
      </div>
      <div className='flex-shrink-0'>
        <ChevronDown className={cn('w-4 h-4', iconClasses)} />
      </div>
    </div>
  );

  const guestSelectorContent = isBooking ? (
    <div className='flex flex-row justify-between items-center px-4 w-full'>
      <div className='flex flex-col'>
        <span className='text-sm text-accent-red-900 dark:text-[var(--prive2)]'>
          GUESTS
        </span>
        <span className='text-md font-semibold text-primary-950 dark:text-white'>
          {totalGuests} Guests
        </span>
        <span className='text-sm text-muted-foreground'>
          {getGuestDisplayText(guestsData, true)}
        </span>
      </div>
      {openState ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </div>
  ) : (
    <div className='flex flex-row justify-between items-center px-4 w-full'>
      <div className='flex items-center gap-2 flex-1'>
        <div className='flex flex-col'>
          <span className={cn('text-primary-400', 'text-sm')}>Guests</span>
          <span className='text-sm typography-label-semibold'>
            {getGuestDisplayText(guestsData, true)}
          </span>
        </div>
      </div>
      <div className='flex-shrink-0'>
        <ChevronDown className='h-5 w-5 text-accent-red-900 dark:text-accent-yellow-950' />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <GuestFields
        guestsData={guestsData}
        onChange={onChange}
        pageType={pageType}
      />
    );
  }

  return (
    <Popover open={openState} onOpenChange={setOpenState}>
      <PopoverTrigger asChild className='w-full'>
        <div className='w-full cursor-pointer'>
          {children ||
            (pageType === 'availability'
              ? guestSelectorContent
              : defaultTriggerContent)}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className='w-80 bg-white border-primary rounded-xl p-0'
        align='center'
        sideOffset={12}
        alignOffset={20}
        side='bottom'
      >
        <GuestFields
          guestsData={guestsData}
          onChange={onChange}
          pageType={pageType}
        />
      </PopoverContent>
    </Popover>
  );
};

export default GuestSelector;
