import { isSameMinute, set } from 'date-fns';

export function getDateToLastHour(date: Date): Date {
  return set(date, { minutes: 0, seconds: 0, milliseconds: 0 });
}

export function isDifferentMinute(date1: Date, date2: Date): boolean {
  return !isSameMinute(date1, date2);
}
