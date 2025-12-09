/**
 * MESSAGE 1 CONFIGURATION
 * 
 * This file contains all settings for Message 1.
 * Modify the values below to customize what gets sent, when, and to whom.
 * 
 * IMPORTANT: All times use Madrid timezone (Europe/Madrid)
 */

import { MessageConfig } from '@/types';

const message1: MessageConfig = {
  // ============================================================================
  // MESSAGE IDENTIFIER
  // Unique ID for this message (used in reports and logs)
  // ============================================================================
  id: 'message1',

  // ============================================================================
  // MESSAGE TEXT
  // HTML-formatted text for each language
  // Supported HTML tags: <b>, <i>, <u>, <s>, <code>, <pre>, <a href="">
  // ============================================================================
  
  // Italian version of the message
  text_it: `<b>Messaggio 1</b>

Questo è il testo del messaggio in italiano.
Puoi usare <b>grassetto</b>, <i>corsivo</i>, e <a href="https://example.com">link</a>.`,

  // Spanish version of the message
  text_es: `<b>Mensaje 1</b>

Este es el texto del mensaje en español.
Puedes usar <b>negrita</b>, <i>cursiva</i>, y <a href="https://example.com">enlaces</a>.`,

  // English version (also used for all other languages)
  text_en: `<b>Message 1</b>

This is the message text in English.
You can use <b>bold</b>, <i>italic</i>, and <a href="https://example.com">links</a>.`,

  // ============================================================================
  // MEDIA ATTACHMENTS
  // Array of Telegram file_id strings to send as an album
  // Leave empty [] to send as text-only message
  // If not empty, message will be sent as a media group (album)
  // ============================================================================
  
  // Media for Italian users
  media_it: [],
  
  // Media for Spanish users
  media_es: [],
  
  // Media for English/other users
  media_en: [],

  // ============================================================================
  // CONTENT PROTECTION
  // Set to true to prevent users from forwarding/saving the message
  // Set to false to allow normal sharing
  // ============================================================================
  protect_content: true,

  // ============================================================================
  // CTA BUTTONS
  // Buttons displayed under the message
  // Each button needs text in all 3 languages and a URL
  // Leave array empty [] for no buttons
  // Leave text/url empty strings to hide a specific button
  // ============================================================================
  buttons: [
    {
      text_it: 'Scopri di più',      // Italian button text
      text_es: 'Descubre más',        // Spanish button text
      text_en: 'Learn more',          // English button text
      url: 'https://example.com',     // Button URL
    },
    // Add more buttons here if needed:
    // {
    //   text_it: '',
    //   text_es: '',
    //   text_en: '',
    //   url: '',
    // },
  ],

  // ============================================================================
  // SCHEDULE
  // Array of patterns defining when to send this message
  // Leave empty [] to never send automatically
  // 
  // PATTERN FORMATS (all times in Madrid timezone):
  // 
  // "SUNDAY-21:00"     = Every Sunday at 21:00
  // "MONDAY-12:00"     = Every Monday at 12:00
  // "TUESDAY-09:30"    = Every Tuesday at 09:30
  // etc.
  // 
  // "SUNDAY-1-19:00"   = First Sunday of every month at 19:00
  // "MONDAY-2-10:00"   = Second Monday of every month at 10:00
  // "FRIDAY-3-18:00"   = Third Friday of every month at 18:00
  // etc.
  // 
  // "MONTHLY-07-06:00" = 7th day of every month at 06:00
  // "MONTHLY-15-12:00" = 15th day of every month at 12:00
  // "MONTHLY-01-09:00" = 1st day of every month at 09:00
  // etc.
  // ============================================================================
  schedule: [
    // Example: send every Monday at noon
    // 'MONDAY-12:00',
  ],
};

export default message1;
