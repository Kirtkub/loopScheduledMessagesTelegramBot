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

  text_it: `<b>Messaggio 4</b>

Questo è il quarto messaggio in italiano.`,

  text_es: `<b>Mensaje 4</b>

Este es el cuarto mensaje en español.`,

  text_en: `<b>Message 4</b>

This is the fourth message in English.`,

  media_it: [],
  media_es: [],
  media_en: [],

  protect_content: true,

  buttons: [],

  // ============================================================================
  // SCHEDULE (Day-based patterns - messages sent at 9:00 AM Madrid time)
  // 
  // "SUNDAY"      = Every Sunday
  // "MONDAY-2"    = Second Monday of every month
  // "MONTHLY-15"  = 15th day of every month
  // ============================================================================
  schedule: [],
};

export default message4;
