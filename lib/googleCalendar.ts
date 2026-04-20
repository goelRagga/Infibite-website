import { formatDateWithFullYear } from '@/components/common/Shared/FormatDate';

interface GoogleCalendarParams {
  checkinDate: string;
  checkoutDate: string;
  propertyName: string;
  propertyLocation?: string;
}
const formatDateISTtoUTC = (
  date: string,
  hour: number,
  minute: number
): string => {
  const dateObj = new Date(date);
  const utcTimestamp = Date.UTC(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate(),
    hour - 5,
    minute - 30,
    0
  );

  const utcDate = new Date(utcTimestamp);
  const year = utcDate.getUTCFullYear();
  const month = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(utcDate.getUTCDate()).padStart(2, '0');
  const hh = String(utcDate.getUTCHours()).padStart(2, '0');
  const mm = String(utcDate.getUTCMinutes()).padStart(2, '0');

  return `${year}${month}${day}T${hh}${mm}00Z`;
};

export const generateGoogleCalendarUrl = ({
  checkinDate,
  checkoutDate,
  propertyName,
  propertyLocation = '',
}: GoogleCalendarParams): string => {
  const startDateTime = formatDateISTtoUTC(checkinDate, 14, 0);
  const endDateTime = formatDateISTtoUTC(checkoutDate, 10, 0);

  const title = encodeURIComponent('ELIVAAS BOOKING');
  const details = encodeURIComponent(
    `Your booking at ${propertyName}\n\nCheck-in: ${formatDateWithFullYear(checkinDate)} 2:00 PM (IST)\nCheck-out: ${formatDateWithFullYear(checkoutDate)} 11:00 AM (IST)`
  );
  const location = encodeURIComponent(propertyLocation);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${startDateTime}%2F${endDateTime}&text=${title}&details=${details}&location=${location}&trp=false`;
};
