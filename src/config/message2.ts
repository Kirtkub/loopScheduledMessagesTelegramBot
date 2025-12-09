/**
 * MESSAGE 2 CONFIGURATION
 * 
 * This file contains all settings for Message 2.
 * Modify the values below to customize what gets sent, when, and to whom.
 * 
 * IMPORTANT: The cron runs once per day at 9:00 AM Madrid time.
 * Messages scheduled for that day will be sent at that time.
 */

import { MessageConfig } from '@/types';

const message2: MessageConfig = {
  id: 'message2',

  text_it: `<b>Messaggio 2</b>

Questo è il secondo messaggio in italiano.`,

  text_es: `<b>Mensaje 2</b>

Este es el segundo mensaje en español.`,

  text_en: `<b>Message 2</b>

This is the second message in English.`,

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

export default message2;
