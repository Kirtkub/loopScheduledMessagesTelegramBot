/**
 * MESSAGE 3 CONFIGURATION
 * 
 * This file contains all settings for Message 3.
 * Modify the values below to customize what gets sent, when, and to whom.
 * 
 * IMPORTANT: The cron runs once per day at 9:00 AM Madrid time.
 * Messages scheduled for that day will be sent at that time.
 */

import { MessageConfig } from '@/types';

const message3: MessageConfig = {
  id: 'message3',

  text_it: `Hey amore ❤️🥰
Come stai?

Per ascoltare la mia voce, scrivi:
/audio`,

  text_es: `Hey amor ❤️🥰
¿Cómo estás?

Para escuchar mi voz, escribe:
/audio`,

  text_en: `Hey love ❤️🥰
How are you?

To hear my voice, type:
/audio`,

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
  schedule: ["MONDAY", "THURSDAY",],

  // Hours after which the message auto-deletes (0 = never delete)
  messageLifeHours: 23,
};

export default message3;
