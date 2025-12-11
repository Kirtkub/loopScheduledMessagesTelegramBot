/**
 * MESSAGE 4 CONFIGURATION
 * 
 * This file contains all settings for Message 4.
 * Modify the values below to customize what gets sent, when, and to whom.
 * 
 * IMPORTANT: The cron runs once per day at 9:00 AM Madrid time.
 * Messages scheduled for that day will be sent at that time.
 */

import { MessageConfig } from '@/types';

const message4: MessageConfig = {
  id: 'message4',

  text_it: `Guarda come sono brava a fare la tua puttana 😏
scrivi:
<b>/photo</b>`,

  text_es: `Mira lo buena que soy haciendo de puta tuya 😏
escribe:
<b>/photo</b>`,

  text_en: `Look how good I am at being your little whore 😏
type:
<b>/photo</b>`,

  media_it: [],
  media_es: [],
  media_en: [],

  video_it: [],
  video_es: [],
  video_en: [],

  protect_content: true,

  buttons: [],

  // ============================================================================
  // SCHEDULE (Day-based patterns - messages sent at configured time)
  // See src/config/setHour.ts to change the daily execution time
  // 
  // "SUNDAY"      = Every Sunday
  // "MONDAY-2"    = Second Monday of every month
  // "MONTHLY-15"  = 15th day of every month
  // ============================================================================
  schedule: ["TUESDAY"],

  // Hours after which the message auto-deletes (0 = never delete)
  messageLifeHours: 23,
};

export default message4;
