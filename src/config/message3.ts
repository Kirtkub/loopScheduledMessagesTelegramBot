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

  text_it: `<b>Messaggio 3</b>

Questo è il terzo messaggio in italiano.`,

  text_es: `<b>Mensaje 3</b>

Este es el tercer mensaje en español.`,

  text_en: `<b>Message 3</b>

This is the third message in English.`,

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

export default message3;
