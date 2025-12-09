/**
 * Messages index file
 * Exports all message configurations for easy access
 */

import message1 from './message1';
import message2 from './message2';
import message3 from './message3';
import message4 from './message4';
import message5 from './message5';
import { MessageConfig } from '@/types';

// Array of all messages for iteration
export const allMessages: MessageConfig[] = [
  message1,
  message2,
  message3,
  message4,
  message5,
];

// Get message by ID
export function getMessageById(id: string): MessageConfig | undefined {
  return allMessages.find(m => m.id === id);
}

// Export individual messages
export { message1, message2, message3, message4, message5 };
