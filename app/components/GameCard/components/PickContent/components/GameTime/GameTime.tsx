import {format, isToday, isYesterday, addDays} from 'date-fns';

export interface GameTimeProps {
  start: string;
}

function isWithinNextSixDays(date: Date) {
  const sixDaysFromNow = addDays(new Date(), 6);
  return date > new Date() && date <= sixDaysFromNow;
}

function customDateFormat(date: Date) {
  if (isToday(date)) {
    // Format as 'Today at 8:00 PM' if the date is today
    return format(date, "'Today at' p");
  } else if (isYesterday(date)) {
    // Format as 'Yesterday at 8:00 PM' if the date was yesterday
    return format(date, "'Yesterday at' p");
  } else if (isWithinNextSixDays(date)) {
    // Format as 'Sunday at 8:00 PM' if within the next 6 days
    return format(date, "iiii 'at' p");
  } else {
    // Format as 'Monday Jan 18th at 8:00 PM' if more than 6 days away
    return format(date, "iiii MMM do 'at' p");
  }
}

export function GameTime({start}: GameTimeProps) {
  return <p>{customDateFormat(new Date(start))}</p>;
}
