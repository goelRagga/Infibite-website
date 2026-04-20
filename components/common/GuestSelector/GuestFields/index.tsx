import Children from '@/assets/children.svg';
import { Button } from '@/components/ui';
import { GuestsData } from '@/contexts';
import { useGuests } from '@/hooks/filters';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PawPrint, User } from 'lucide-react';
import { useMemo } from 'react';

interface GuestFieldsProps {
  onChange: (newData: GuestsData) => void;
  isPrive?: boolean;
}

type GuestType = 'numberOfGuests' | 'numberOfChildren' | 'numberOfPets';

// Define guest types configuration for better maintainability
const GUEST_TYPES = {
  numberOfGuests: {
    label: 'Adults',
    description: '13 years & above',
    icon: User,
    minLimit: 1,
    iconFill: true,
  },
  numberOfChildren: {
    label: 'Children',
    description: 'Below 12 years',
    icon: Children,
    minLimit: 0,
    iconFill: true,
  },
  numberOfPets: {
    label: 'Pet',
    description: 'Bringing furry friends',
    icon: PawPrint,
    minLimit: 0,
    iconFill: true,
  },
};

const GuestFields = ({ onChange, isPrive }: GuestFieldsProps) => {
  const { guestsData } = useGuests();

  const iconBtnClasses = useMemo(
    () =>
      isPrive
        ? 'h-8 w-8 rounded-full border-[var(--prive5)] text-[var(--prive5)] text-2xl disabled:border-gray-600 disabled:text-gray-600 bg-transparent hover:bg-[var(--prive5)]/10 dark:bg-background dark:border-[var(--accent-text)] dark:text-[var(--accent-text)] dark:hover:bg-background/10'
        : 'h-8  w-8 rounded-full font-semibold border-accent-red-900 text-accent-red-900 hover:text-accent-red-900 text-2xl disabled:border-primary-200 disabled:text-primary-200 dark:bg-background dark:border-[var(--accent-text)] dark:text-[var(--accent-text)] dark:hover:bg-background/10 ',
    [isPrive]
  );

  const updateGuestCount = (type: GuestType, increment: boolean) => {
    const newGuestData = { ...guestsData };

    const maxLimit =
      type === 'numberOfGuests'
        ? (guestsData.max_adults ?? 100)
        : type === 'numberOfChildren'
          ? (guestsData.max_children ?? 100)
          : (guestsData.max_pets ?? 10);

    const minLimit = GUEST_TYPES[type].minLimit;

    if (increment) {
      if (newGuestData[type] < maxLimit) {
        newGuestData[type] += 1;
      }
    } else {
      if (newGuestData[type] > minLimit) {
        newGuestData[type] -= 1;
      }
    }

    onChange(newGuestData);
  };

  const renderGuestCounter = (type: GuestType, isLast: boolean = false) => {
    const config = GUEST_TYPES[type];
    const Icon = config.icon;
    const count =
      type === 'numberOfPets' ? guestsData.numberOfPets || 0 : guestsData[type];
    const minLimit = config.minLimit;

    return (
      <div
        className={cn(
          'flex items-center py-4 justify-between',
          !isLast &&
            (isPrive
              ? 'border-b border-[var(--prive5)]/20 '
              : 'border-b border-primary-50 dark:border-primary-800')
        )}
        key={type}
      >
        <div className='flex items-center'>
          <Icon
            className={cn(
              'w-6 h-6 mr-2',
              isPrive
                ? 'text-[var(--prive5)]'
                : 'text-primary-800 dark:text-[var(--accent-text)]',
              config.iconFill &&
                (isPrive
                  ? 'fill-[var(--prive5)]'
                  : 'fill-primary-800 dark:fill-[var(--accent-text)]')
            )}
          />
          <div>
            <p
              className={cn(
                'font-medium text-sm',
                isPrive ? 'text-white ' : 'text-primary-950 dark:text-white'
              )}
            >
              {config.label}
            </p>
            <p
              className={cn(
                'text-xs',
                isPrive
                  ? 'text-white/70'
                  : 'text-primary-400 dark:text-[var(--white6)]/70 '
              )}
            >
              {config.description}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-3 '>
          <Button
            variant='outline'
            size='icon'
            className={iconBtnClasses}
            onClick={() => updateGuestCount(type, false)}
            disabled={count <= minLimit}
          >
            <Minus className='w-4 h-4' />
          </Button>
          <span
            className={cn(
              'w-6 text-center',
              isPrive ? 'text-white' : 'text-primary-950 dark:text-white'
            )}
          >
            {count}
          </span>
          <Button
            variant='outline'
            size='icon'
            className={iconBtnClasses}
            onClick={() => updateGuestCount(type, true)}
          >
            <Plus className='w-4 h-4' />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderGuestCounter('numberOfGuests')}
      {renderGuestCounter('numberOfChildren')}
      {/* {renderGuestCounter('numberOfPets', true)} */}
    </div>
  );
};

export default GuestFields;
