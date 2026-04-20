import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  isBefore,
  isSameDay,
  parse,
} from 'date-fns';
import { DateBookedResult, Inventory } from 'date-type';

export const addMonthsToDate = (date: Date, months: number) => {
  const result = new Date(date);
  result?.setMonth(date?.getMonth() + months);
  return result;
};
export const disableMinimumStays = (
  date: Date,
  checkInDate: Date | null,
  availabilityList: Inventory[]
) => {
  if (!checkInDate) {
    return false;
  }

  const availability = availabilityList.find((inventory) => {
    const inventoryDate = parse(inventory.date || '', 'yyyy-MM-dd', new Date());
    const checkInDateParsed = checkInDate;

    if (isSameDay(inventoryDate, checkInDateParsed)) {
      return inventory;
    }
  });

  if (!availability) {
    return false;
  }

  const { minimumStay = 1, stopSell } = availability;

  if (checkInDate) {
    const daysDifference = differenceInCalendarDays(date, checkInDate);

    if (daysDifference > 0 && daysDifference < minimumStay) {
      return true;
    }
  }

  return false;
};

export const filterUnavailableDates = (
  availabilityList: Inventory[],
  checkInDate: string | null = null,
  setValidateCheckoutOnlyDate: any
) => {
  const unavailableDates: string[] = [];

  availabilityList?.forEach((inventory) => {
    if (checkInDate === null || !inventory.checkoutOnly) {
      if (inventory.quantity === 0) {
        unavailableDates.push(inventory.date);
      }
    } else if (checkInDate !== null) {
      if (inventory.quantity === 0) {
        unavailableDates.push(inventory.date);
      }
    }
  });

  if (checkInDate != null) {
    const latestUnavailableDate = unavailableDates
      .filter((date) => new Date(date) > new Date(checkInDate))
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .slice(0, 1)[0];
    if (latestUnavailableDate) {
      setValidateCheckoutOnlyDate(latestUnavailableDate);
      const index = unavailableDates.indexOf(latestUnavailableDate);
      if (index !== -1) {
        unavailableDates.splice(index, 1);
      }
    }
  }

  return unavailableDates;
};

export function isDateBooked(
  dateRange: { from?: Date | null; to?: Date | null },
  unavailableDates: string[]
): DateBookedResult {
  const result: DateBookedResult = {
    isBooked: false,
    bookedDates: [],
  };

  if (dateRange.from && dateRange.to) {
    const selectedDatesArray = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    }).map((d) => format(d, 'yyyy-MM-dd'));

    const bookedDates = selectedDatesArray.filter((d) =>
      unavailableDates.includes(d)
    );

    if (bookedDates.length > 0) {
      result.isBooked = true;
      result.bookedDates = bookedDates;
    }
  }

  return result;
}

export const isDateDisabled = (
  date: Date,
  { from }: { from: Date },
  validateCheckoutDate?: string | '',
  isFilterbar?: boolean
) => {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  return date < yesterday || date < previousMonth;

  // return isFilterbar
  //   ? date < yesterday ||
  //       date < previousMonth ||
  //       (validateCheckoutDate && date > new Date(validateCheckoutDate))
  //   : date < yesterday ||
  //       date < previousMonth ||
  //       (validateCheckoutDate && date > new Date(validateCheckoutDate));
};

export const calculateNights = (
  checkin: string | Date,
  checkout: string | Date
): number => {
  const checkinDate = typeof checkin === 'string' ? new Date(checkin) : checkin;
  const checkoutDate =
    typeof checkout === 'string' ? new Date(checkout) : checkout;
  if (isNaN(checkinDate?.getTime()) || isNaN(checkoutDate.getTime())) {
    throw new Error('Invalid date format. Please provide valid dates.');
  }
  if (checkinDate >= checkoutDate) {
    throw new Error('Check-out date must be after check-in date.');
  }
  const timeDifference = checkoutDate.getTime() - checkinDate.getTime();
  const numberOfNights = timeDifference / (1000 * 60 * 60 * 24);
  return numberOfNights;
};
