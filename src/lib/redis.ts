import { Redis } from '@upstash/redis';
import { TelegramUser, Language } from '@/types';

// Initialize Redis client with environment variables
// These should be set in Vercel:
// - KV_REST_API_URL
// - KV_REST_API_READ_ONLY_TOKEN (used as token)
const redis = new Redis({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_READ_ONLY_TOKEN || '',
});

// Redis set keys for different language groups
const REDIS_KEYS = {
  IT: 'users:lang:it',
  ES: 'users:lang:es',
  EN: 'users:lang:en',
  ALL: 'users:all',
};

// Get all user IDs from a set
async function getUserIdsFromSet(key: string): Promise<string[]> {
  try {
    const members = await redis.smembers(key);
    return members.map(m => String(m));
  } catch (error) {
    console.error(`Error fetching users from ${key}:`, error);
    return [];
  }
}

// Get user data by ID
async function getUserById(userId: string): Promise<TelegramUser | null> {
  try {
    const userData = await redis.get(`user:${userId}`);
    if (userData) {
      return typeof userData === 'string' ? JSON.parse(userData) : userData as TelegramUser;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    return null;
  }
}

// Get all Italian users
export async function getItalianUsers(): Promise<TelegramUser[]> {
  const userIds = await getUserIdsFromSet(REDIS_KEYS.IT);
  const users: TelegramUser[] = [];
  
  for (const id of userIds) {
    const user = await getUserById(id);
    if (user) {
      users.push(user);
    }
  }
  
  return users;
}

// Get all Spanish users
export async function getSpanishUsers(): Promise<TelegramUser[]> {
  const userIds = await getUserIdsFromSet(REDIS_KEYS.ES);
  const users: TelegramUser[] = [];
  
  for (const id of userIds) {
    const user = await getUserById(id);
    if (user) {
      users.push(user);
    }
  }
  
  return users;
}

// Get all English/other users (users in EN set or in ALL but not in IT/ES)
export async function getEnglishUsers(): Promise<TelegramUser[]> {
  const userIds = await getUserIdsFromSet(REDIS_KEYS.EN);
  const users: TelegramUser[] = [];
  
  for (const id of userIds) {
    const user = await getUserById(id);
    if (user) {
      users.push(user);
    }
  }
  
  return users;
}

// Get all users
export async function getAllUsers(): Promise<TelegramUser[]> {
  const userIds = await getUserIdsFromSet(REDIS_KEYS.ALL);
  const users: TelegramUser[] = [];
  
  for (const id of userIds) {
    const user = await getUserById(id);
    if (user) {
      users.push(user);
    }
  }
  
  return users;
}

// Get users grouped by language
export async function getUsersByLanguage(): Promise<{
  italian: TelegramUser[];
  spanish: TelegramUser[];
  other: TelegramUser[];
}> {
  const [italian, spanish, allUsers] = await Promise.all([
    getItalianUsers(),
    getSpanishUsers(),
    getAllUsers(),
  ]);
  
  const italianIds = new Set(italian.map(u => u.id));
  const spanishIds = new Set(spanish.map(u => u.id));
  
  // Other users are those not in Italian or Spanish sets
  const other = allUsers.filter(u => !italianIds.has(u.id) && !spanishIds.has(u.id));
  
  return { italian, spanish, other };
}

// Determine user's language group
export function getUserLanguage(user: TelegramUser): Language {
  const lang = user.languageCode?.toLowerCase() || '';
  if (lang.startsWith('it')) return 'it';
  if (lang.startsWith('es')) return 'es';
  return 'en';
}
