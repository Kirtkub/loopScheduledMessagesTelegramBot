/**
 * MESSAGE 1 CONFIGURATION
 * 
 * This file contains all settings for Message 1.
 * Modify the values below to customize what gets sent, when, and to whom.
 * 
 * IMPORTANT: The cron runs once per day at 9:00 AM Madrid time.
 * Messages scheduled for that day will be sent at that time.
 */

import { MessageConfig } from '@/types';

const message1: MessageConfig = {
  id: 'message1',

  text_it: `<b>Messaggio 1</b>

Questo è il testo del messaggio in italiano.
Puoi usare <b>grassetto</b>, <i>corsivo</i>, e <a href="https://example.com">link</a>.`,

  text_es: `<b>Mensaje 1</b>

Este es el texto del mensaje en español.
Puedes usar <b>negrita</b>, <i>cursiva</i>, y <a href="https://example.com">enlaces</a>.`,

  text_en: `<b>Message 1</b>

This is the message text in English.
You can use <b>bold</b>, <i>italic</i>, and <a href="https://example.com">links</a>.`,

  media_it: ["BAACAgQAAxkBAAIe4Wa7F7OtLw7fpM_Iovzn4saeGREPAAL8FAACHR7YUajfZz7Dts8rNQQ"],
  media_es: [],
  media_en: [],

  // Array of Telegram video file_ids to send as album
  // You can mix photos and videos in the same album
  video_it: [],
  video_es: [],
  video_en: [],

  protect_content: true,

  buttons: [
    {
      text_it: 'Scopri di più',
      text_es: 'Descubre más',
      text_en: 'Learn more',
      url: 'https://example.com',
    },
  ],

  // ============================================================================
  // SCHEDULE (Day-based patterns - messages sent at configured time)
  // See src/config/setHour.ts to change the daily execution time
  // 
  // PATTERN FORMATS:
  // 
  // "SUNDAY"      = Every Sunday
  // "MONDAY"      = Every Monday
  // "TUESDAY"     = Every Tuesday
  // etc.
  // 
  // "SUNDAY-1"    = First Sunday of every month
  // "MONDAY-2"    = Second Monday of every month
  // "FRIDAY-3"    = Third Friday of every month
  // etc.
  // 
  // "MONTHLY-07"  = 7th day of every month
  // "MONTHLY-15"  = 15th day of every month
  // "MONTHLY-01"  = 1st day of every month
  // etc.
  // ============================================================================
  schedule: [
    // Example: send every Monday
    // 'MONDAY',
  ],

  // ============================================================================
  // MESSAGE LIFE HOURS
  // Hours after which the message auto-deletes
  // Set to 0 to never delete the message
  // Default: 24 hours
  // ============================================================================
  messageLifeHours: 24,
};

export default message1;
