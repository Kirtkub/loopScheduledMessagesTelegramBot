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

  text_it: `Hey amore ❤️🥰
Come stai?

<b>Per parlare con Cleo puoi</b>:
🔹Iscriverti alla <a href="https://onlyfans.com/cleoyleo"><b>pagina OnlyFans</b></a> e usare la chat privata
🔹Usare i messaggi privati nel <a href="https://t.me/+onqHnd30AFA5ZDVk"><b>Canale telegram di Cleo y Leo</b></a> (spendendo delle stelle telegram)`,

  text_es: `Hey amor ❤️🥰
¿Cómo estás?

<b>Para hablar con Cleo puedes</b>:
🔹 Suscribirte a la <a href="https://onlyfans.com/cleoyleo"><b>página de OnlyFans</b></a> y usar el chat privado
🔹 Usar los mensajes privados en el <a href="https://t.me/+onqHnd30AFA5ZDVk"><b>Canal de Telegram de Cleo y Leo</b></a> (utilizando estrellas de Telegram)`,

  text_en: `Hey love ❤️🥰
How are you?

<b>To talk with Cleo you can</b>:
🔹 Subscribe to the <a href="https://onlyfans.com/cleoyleo"><b>OnlyFans page</b></a> and use the private chat
🔹 Use private messages in the <a href="https://t.me/+onqHnd30AFA5ZDVk"><b>Cleo and Leo Telegram Channel</b></a> (using Telegram stars)`,

  media_it: [],
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
    text_it: '✨ Vieni su OnlyFans',
    text_es: '✨ Ven a OnlyFans',
    text_en: '✨ Come to OnlyFans',
    url: 'https://onlyfans.com/cleoyleo',
  },
  {
    text_it: '💬 Vieni su Telegram',
    text_es: '💬 Ven a Telegram',
    text_en: '💬 Come to Telegram',
    url: 'https://t.me/+onqHnd30AFA5ZDVk',
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
  messageLifeHours: 23,
};

export default message1;
