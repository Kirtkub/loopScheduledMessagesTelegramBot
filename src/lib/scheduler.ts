import { toZonedTime } from 'date-fns-tz';
import { getDay, getDate, startOfMonth, addDays } from 'date-fns';
import { TIMEZONE, DAILY_EXECUTION_TIME } from '@/config/setHour';

export { TIMEZONE, DAILY_EXECUTION_TIME };

export function getMadridTime(): Date {
  return toZonedTime(new Date(), TIMEZONE);
}

function getNthWeekdayOccurrence(date: Date, targetWeekday: number): number {
  const dayOfMonth = getDate(date);
  const monthStart = startOfMonth(date);
  
  let firstOccurrence = monthStart;
  const startDayOfWeek = getDay(monthStart);
  
  let daysToAdd = targetWeekday - startDayOfWeek;
  if (daysToAdd < 0) {
    daysToAdd += 7;
  }
  firstOccurrence = addDays(monthStart, daysToAdd);
  
  const firstOccurrenceDay = getDate(firstOccurrence);
  
  if (dayOfMonth < firstOccurrenceDay) {
    return 0;
  }
  
  return Math.floor((dayOfMonth - firstOccurrenceDay) / 7) + 1;
}

export function shouldSendToday(schedulePatterns: string[]): boolean {
  if (!schedulePatterns || schedulePatterns.length === 0) {
    return false;
  }
  
  const now = getMadridTime();
  const currentDayOfWeek = getDay(now);
  const currentDayOfMonth = getDate(now);
  
  const dayNameToNumber: { [key: string]: number } = {
    'SUNDAY': 0,
    'MONDAY': 1,
    'TUESDAY': 2,
    'WEDNESDAY': 3,
    'THURSDAY': 4,
    'FRIDAY': 5,
    'SATURDAY': 6,
  };
  
  for (const pattern of schedulePatterns) {
    const parts = pattern.split('-');
    
    if (parts[0] === 'MONTHLY') {
      const dayOfMonth = parseInt(parts[1], 10);
      if (currentDayOfMonth === dayOfMonth) {
        return true;
      }
    } else if (dayNameToNumber[parts[0]] !== undefined) {
      const targetDay = dayNameToNumber[parts[0]];
      
      if (currentDayOfWeek !== targetDay) {
        continue;
      }
      
      if (parts.length === 1) {
        return true;
      } else if (parts.length === 2) {
        const targetOccurrence = parseInt(parts[1], 10);
        const actualOccurrence = getNthWeekdayOccurrence(now, targetDay);
        if (actualOccurrence === targetOccurrence) {
          return true;
        }
      }
    }
  }
  
  return false;
}

export function formatSchedulePattern(pattern: string): string {
  const parts = pattern.split('-');
  
  if (parts[0] === 'MONTHLY') {
    return `Every month on day ${parts[1]}`;
  }
  
  const dayNames: { [key: string]: string } = {
    'SUNDAY': 'Sunday',
    'MONDAY': 'Monday',
    'TUESDAY': 'Tuesday',
    'WEDNESDAY': 'Wednesday',
    'THURSDAY': 'Thursday',
    'FRIDAY': 'Friday',
    'SATURDAY': 'Saturday',
  };
  
  const dayName = dayNames[parts[0]] || parts[0];
  
  if (parts.length === 1) {
    return `Every ${dayName}`;
  } else if (parts.length === 2) {
    const ordinals = ['', '1st', '2nd', '3rd', '4th', '5th'];
    const occurrence = ordinals[parseInt(parts[1], 10)] || parts[1];
    return `${occurrence} ${dayName} of each month`;
  }
  
  return pattern;
}
