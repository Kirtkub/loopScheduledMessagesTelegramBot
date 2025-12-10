// Types for the Telegram scheduled messaging application

// User stored in Upstash Redis
export interface TelegramUser {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  languageCode: string;
  startedAt?: string;
  lastActiveAt?: string;
}

// Supported languages
export type Language = 'it' | 'es' | 'en';

// CTA Button configuration with multilingual text
export interface CTAButton {
  // Italian text for the button
  text_it: string;
  // Spanish text for the button
  text_es: string;
  // English text for the button (used for all other languages)
  text_en: string;
  // URL the button links to
  url: string;
}

// Media item with type specification (photo or video)
export interface MediaItem {
  type: 'photo' | 'video';
  file_id: string;
}

// Message configuration structure
export interface MessageConfig {
  // Unique identifier for the message
  id: string;
  
  // HTML-formatted text in Italian
  text_it: string;
  // HTML-formatted text in Spanish
  text_es: string;
  // HTML-formatted text in English (used for all other languages)
  text_en: string;
  
  // Array of Telegram photo file_ids to send as album (Italian users)
  media_it: string[];
  // Array of Telegram photo file_ids to send as album (Spanish users)
  media_es: string[];
  // Array of Telegram photo file_ids to send as album (English/other users)
  media_en: string[];
  
  // Array of Telegram video file_ids to send as album (Italian users)
  video_it: string[];
  // Array of Telegram video file_ids to send as album (Spanish users)
  video_es: string[];
  // Array of Telegram video file_ids to send as album (English/other users)
  video_en: string[];
  
  // Whether to protect content from forwarding/saving
  protect_content: boolean;
  
  // Array of CTA buttons to show under the message
  buttons: CTAButton[];
  
  // Schedule patterns for when to send the message
  // Format examples:
  // "SUNDAY-21:00" - Every Sunday at 21:00
  // "SUNDAY-1-19:00" - First Sunday of month at 19:00
  // "MONTHLY-07-06:00" - 7th of every month at 06:00
  // "MONDAY-12:00" - Every Monday at 12:00
  schedule: string[];
  
  // Hours after which the message auto-deletes (0 = never delete)
  // Default is 24 hours
  messageLifeHours: number;
}

// Result of sending message to a user
export interface SendResult {
  userId: number;
  username?: string;
  success: boolean;
  language: Language;
  error?: string;
}

// Report statistics after sending messages
export interface SendReport {
  messageId: string;
  timestamp: string;
  totalUsers: number;
  successCount: number;
  failedCount: number;
  successPercentage: number;
  italianReached: number;
  italianPercentage: number;
  spanishReached: number;
  spanishPercentage: number;
  otherReached: number;
  otherPercentage: number;
  reachedUsers: TelegramUser[];
}
