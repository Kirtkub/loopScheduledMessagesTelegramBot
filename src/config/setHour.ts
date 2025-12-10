/**
 * Daily Execution Time Configuration
 * 
 * Configure the time at which scheduled messages are sent each day.
 * The time is in Madrid timezone (Europe/Madrid).
 * 
 * Format: "HH:MM" (24-hour format)
 * 
 * Examples:
 * - "09:00" = 9:00 AM
 * - "14:30" = 2:30 PM
 * - "21:00" = 9:00 PM
 */

export const DAILY_EXECUTION_TIME = "15:00";

export const TIMEZONE = "Europe/Madrid";

export function getExecutionHour(): number {
  const [hours] = DAILY_EXECUTION_TIME.split(':').map(Number);
  return hours;
}

export function getExecutionMinute(): number {
  const [, minutes] = DAILY_EXECUTION_TIME.split(':').map(Number);
  return minutes;
}
