import { toZonedTime, format } from 'date-fns-tz';
import { getDay, getDate } from 'date-fns';

// Madrid timezone
const TIMEZONE = 'Europe/Madrid';

// Get current time in Madrid
export function getMadridTime(): Date {
  return toZonedTime(new Date(), TIMEZONE);
}

// Parse schedule pattern and check if current time matches
// Patterns:
// - "SUNDAY-21:00" - Every Sunday at 21:00
// - "MONDAY-12:00" - Every Monday at 12:00
// - "SUNDAY-1-19:00" - First Sunday of month at 19:00
// - "MONTHLY-07-06:00" - 7th of every month at 06:00
export function shouldSendNow(schedulePatterns: string[]): boolean {
  if (!schedulePatterns || schedulePatterns.length === 0) {
    return false;
  }
  
  const now = getMadridTime();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentDayOfWeek = getDay(now); // 0 = Sunday, 1 = Monday, etc.
  const currentDayOfMonth = getDate(now);
  
  // Calculate which occurrence of the weekday this is in the month
  const weekOccurrence = Math.ceil(currentDayOfMonth / 7);
  
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
      // Format: MONTHLY-DD-HH:MM
      const dayOfMonth = parseInt(parts[1], 10);
      const [hour, minute] = parts[2].split(':').map(n => parseInt(n, 10));
      
      if (currentDayOfMonth === dayOfMonth && 
          currentHour === hour && 
          currentMinute === minute) {
        return true;
      }
    } else if (dayNameToNumber[parts[0]] !== undefined) {
      const targetDay = dayNameToNumber[parts[0]];
      
      if (parts.length === 2) {
        // Format: DAY-HH:MM (every week)
        const [hour, minute] = parts[1].split(':').map(n => parseInt(n, 10));
        
        if (currentDayOfWeek === targetDay && 
            currentHour === hour && 
            currentMinute === minute) {
          return true;
        }
      } else if (parts.length === 3) {
        // Format: DAY-N-HH:MM (Nth occurrence of day in month)
        const occurrence = parseInt(parts[1], 10);
        const [hour, minute] = parts[2].split(':').map(n => parseInt(n, 10));
        
        if (currentDayOfWeek === targetDay && 
            weekOccurrence === occurrence && 
            currentHour === hour && 
            currentMinute === minute) {
          return true;
        }
      }
    }
  }
  
  return false;
}

// Get next scheduled time for display purposes
export function getNextScheduledTime(schedulePatterns: string[]): string | null {
  if (!schedulePatterns || schedulePatterns.length === 0) {
    return null;
  }
  
  // For simplicity, return the first pattern formatted nicely
  const pattern = schedulePatterns[0];
  return formatSchedulePattern(pattern);
}

// Format a schedule pattern for human-readable display
export function formatSchedulePattern(pattern: string): string {
  const parts = pattern.split('-');
  
  if (parts[0] === 'MONTHLY') {
    return `Every month on day ${parts[1]} at ${parts[2]} (Madrid time)`;
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
  
  if (parts.length === 2) {
    return `Every ${dayName} at ${parts[1]} (Madrid time)`;
  } else if (parts.length === 3) {
    const ordinals = ['', '1st', '2nd', '3rd', '4th', '5th'];
    const occurrence = ordinals[parseInt(parts[1], 10)] || parts[1];
    return `${occurrence} ${dayName} of each month at ${parts[2]} (Madrid time)`;
  }
  
  return pattern;
}
