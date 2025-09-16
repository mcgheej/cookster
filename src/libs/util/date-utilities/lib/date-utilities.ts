import { differenceInMinutes, isSameMinute, set, startOfDay } from 'date-fns';

export function getDateToLastHour(date: Date): Date {
  return set(date, { minutes: 0, seconds: 0, milliseconds: 0 });
}

export function isDifferentMinute(date1: Date, date2: Date): boolean {
  return !isSameMinute(date1, date2);
}

export function getMinutesSinceMidnight(date: Date): number {
  return differenceInMinutes(date, startOfDay(date));
}
