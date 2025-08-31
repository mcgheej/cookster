import { set } from 'date-fns';

export function getDateToLastHour(date: Date): Date {
  return set(date, { minutes: 0, seconds: 0, milliseconds: 0 });
}
