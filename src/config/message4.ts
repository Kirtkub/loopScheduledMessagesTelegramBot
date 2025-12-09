/**
 * MESSAGE 4 CONFIGURATION
 * 
 * This file contains all settings for Message 4.
 * Modify the values below to customize what gets sent, when, and to whom.
 * 
 * IMPORTANT: All times use Madrid timezone (Europe/Madrid)
 */

import { MessageConfig } from '@/types';

const message4: MessageConfig = {
  // ============================================================================
  // MESSAGE IDENTIFIER
  // Unique ID for this message (used in reports and logs)
  // ============================================================================
  id: 'message4',

  // ============================================================================
  // MESSAGE TEXT
  // HTML-formatted text for each language
  // Supported HTML tags: <b>, <i>, <u>, <s>, <code>, <pre>, <a href="">
  // ============================================================================
  
  // Italian version of the message
  text_it: `<b>Messaggio 4</b>

Questo è il quarto messaggio in italiano.`,

  // Spanish version of the message
  text_es: `<b>Mensaje 4</b>

Este es el cuarto mensaje en español.`,

  // English version (also used for all other languages)
  text_en: `<b>Message 4</b>

This is the fourth message in English.`,

  // ============================================================================
  // MEDIA ATTACHMENTS
  // Array of Telegram file_id strings to send as an album
  // Leave empty [] to send as text-only message
  // ============================================================================
  
  media_it: [],
  media_es: [],
  media_en: [],

  // ============================================================================
  // CONTENT PROTECTION
  // Set to true to prevent users from forwarding/saving the message
  // ============================================================================
  protect_content: true,

  // ============================================================================
  // CTA BUTTONS
  // Buttons displayed under the message
  // ============================================================================
  buttons: [],

  // ============================================================================
  // SCHEDULE
  // Array of patterns defining when to send this message
  // Leave empty [] to never send automatically
  // ============================================================================
  schedule: [],
};

export default message4;
