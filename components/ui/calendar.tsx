'use client';

import { format } from 'date-fns';
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import * as React from 'react';
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  dayContent,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant'];
  dayContent?: (day: { date: Date }) => React.ReactNode;
}) {
  const defaultClassNames = getDefaultClassNames();

  const iconStyles = {
    stroke: 'accent-red-900',
    strokeWidth: 2.5,
    height: 20,
    width: 20,
  };

  return (
    <div className='flex flex-col relative'>
      <div className='flex w-full sticky top-0 bg-white z-20 pb-4 border-b border-gray-200 lg:hidden dark:bg-background dark:border-secondary-950'>
        {DAYS.map((day, index) => (
          <div
            key={day}
            className={cn(
              'text-muted-foreground w-full font-semibold text-sm text-center',
              (index === 5 || index === 6) && 'text-accent-red-500'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className='pt-0 lg:pt-1'>
        <DayPicker
          ISOWeek
          showOutsideDays={showOutsideDays}
          className={cn('p-1', className)}
          captionLayout={captionLayout}
          formatters={{
            formatMonthDropdown: (date) =>
              date.toLocaleString('default', { month: 'short' }),
            formatWeekdayName: (day) => format(day, 'EEE'),
            ...formatters,
          }}
          classNames={{
            root: cn('w-full', defaultClassNames.root),
            months: cn(
              'flex flex-col lg:flex-row space-y-4 lg:space-x-4 lg:space-y-0 lg:overflow-x-auto',
              defaultClassNames.months
            ),
            month: cn('flex flex-col gap-4', defaultClassNames.month),
            nav: cn('space-x-1 flex items-start', defaultClassNames.nav),
            button_previous: cn(
              'z-49 size-8 border border-accent-red-900 text-accent-red-900 dark:border-[var(--accent-background)] dark:text-[var(--accent-background)] flex items-center justify-center bg-transparent hover:bg-none cursor-pointer transition rounded-full absolute left-5 hidden lg:flex',
              defaultClassNames.button_previous
            ),
            button_next: cn(
              'z-49 size-8 border border-accent-red-900 text-accent-red-900 dark:border-[var(--accent-background)] dark:text-[var(--accent-background)]  flex items-center justify-center bg-transparent hover:bg-none cursor-pointer transition rounded-full absolute right-5 hidden lg:flex',
              defaultClassNames.button_next
            ),
            month_caption: cn(
              'flex justify-center pt-1 relative items-center w-full px-12',
              defaultClassNames.month_caption
            ),
            dropdowns: cn(
              'w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5',
              defaultClassNames.dropdowns
            ),
            dropdown_root: cn(
              'relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md',
              defaultClassNames.dropdown_root
            ),
            dropdown: cn(
              'absolute inset-0 opacity-0',
              defaultClassNames.dropdown
            ),
            caption_label: cn(
              'text-center font-medium text-md',
              defaultClassNames.caption_label
            ),
            table: cn(
              'w-full border-collapse space-y-1'
              // defaultClassNames.table
            ),
            weekdays: cn('flex hidden lg:flex', defaultClassNames.weekdays),
            weekday: cn(
              'text-secondary-600 dark:text-white w-full font-medium text-sm text-center text-justify text-center border-t dark:border-primary-800 pt-3 [&:nth-child(6)]:text-accent-red-500 [&:nth-child(7)]:text-accent-red-500', // Removed ternary
              defaultClassNames.weekday
            ),
            week: cn('flex w-full mt-1 lg:mt-2 gap-0', defaultClassNames.week),
            week_number_header: cn(
              'select-none w-(--cell-size)',
              defaultClassNames.week_number_header
            ),
            week_number: cn(
              'text-[0.8rem] select-none text-muted-foreground',
              defaultClassNames.week_number
            ),
            day: cn(
              'relative p-0 text-center w-full text-sm focus-within:relative focus-within:z-15 [&:has([aria-selected])]:bg-blue100 [&:has([aria-selected].day-outside)]:bg-blue100/50  dark:text-[var(--prive-dawnpink)]',
              defaultClassNames.day
            ),
            range_start: cn(
              'day-range-start border border-transparent   rounded-r-none!',
              defaultClassNames.range_start
            ),
            range_middle: cn(
              'aria-selected:bg-primary-50 dark:aria-selected:bg-[var(--grey6)] aria-selected:text-accent-foreground  dark:text-[var(--prive6)] aria-selected:rounded-none!',
              defaultClassNames.range_middle
            ),
            range_end: cn(
              'day-range-end border border-transparent   rounded-l-none!',
              defaultClassNames.range_end
            ),
            today: cn(
              'border-solid text-accent-foreground dark:text-[var(--accent-background)] dark:border-[var(--accent-background)] border border-accent-red-900 [&:disabled]:border-muted-foreground rounded-lg',
              defaultClassNames.today
            ),
            outside: cn(
              'day-outside text-muted-foreground opacity-50 invisible pointer-events-none',
              defaultClassNames.outside
            ),
            disabled: cn(
              'text-muted-foreground   opacity-50',
              defaultClassNames.disabled
            ),
            hidden: cn('invisible', defaultClassNames.hidden),
            ...classNames,
          }}
          components={{
            Root: ({ className, rootRef, ...props }) => {
              return (
                <div
                  data-slot='calendar'
                  ref={rootRef}
                  className={cn(className)}
                  {...props}
                />
              );
            },
            Chevron: ({ className, orientation, ...props }) => {
              if (orientation === 'left') {
                return (
                  <ChevronLeftIcon
                    style={iconStyles}
                    className={cn('size-4', className)}
                    {...props}
                  />
                );
              }

              if (orientation === 'right') {
                return (
                  <ChevronRightIcon
                    style={iconStyles}
                    className={cn('size-4', className)}
                    {...props}
                  />
                );
              }

              return (
                <ChevronDownIcon
                  className={cn('size-4', className)}
                  {...props}
                />
              );
            },
            DayButton: CalendarDayButton,
            WeekNumber: ({ children, ...props }) => {
              return (
                <td {...props}>
                  <div className='flex size-(--cell-size) items-center justify-center text-center'>
                    {children}
                  </div>
                </td>
              );
            },
            ...(dayContent && {
              DayContent: (day: any) => <>{dayContent(day)}</>,
            }),
            ...components,
          }}
          {...props}
        />
      </div>
    </div>
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);

  return (
    <Button
      ref={ref}
      variant='ghost'
      size='icon'
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'h-[40px] w-full flex items-center justify-center p-0 text-[14px] leading-4 font-normal aria-selected:opacity-100 cursor-pointer rounded-md lg:h-[45px] lg:w-[45px]',
        // Selection styling to match file 1
        ' data-[selected-single=true]:bg-accent-red-900 dark:data-[selected-single=true]:bg-[var(--accent-background)] data-[selected-single=true]:text-white  data-[selected-single=true]:hover:bg-accent-red-950 data-[selected-single=true]:hover:text-white data-[selected-single=true]:focus:bg-accent-red-900 data-[selected-single=true]:focus:text-white',
        // Range styling
        'data-[range-start=true]:bg-accent-red-900 dark:data-[range-start=true]:bg-[var(--accent-background)] data-[range-start=true]:text-white  data-[range-start=true]:hover:bg-accent-red-950  data-[range-start=true]:hover:text-white data-[range-start=true]:focus:bg-accent-red-900  data-[range-start=true]:focus:text-white ',
        'data-[range-end=true]:bg-accent-red-900 dark:data-[range-end=true]:bg-[var(--accent-background)] data-[range-end=true]:text-white dark:data-[range-end=true]:text-white data-[range-end=true]:hover:bg-accent-red-950 data-[range-end=true]:hover:text-white data-[range-end=true]:focus:bg-accent-red-900 data-[range-end=true]:focus:text-white ',
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
