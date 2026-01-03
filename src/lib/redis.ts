import { Redis } from '@upstash/redis';
import { TelegramUser, Language, SendReport } from '@/types';

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
  try {
    const userIds = await getUserIdsFromSet(REDIS_KEYS.ALL);
    const users: TelegramUser[] = [];
    
    // Using pipeline for faster fetching
    const pipeline = redis.pipeline();
    for (const id of userIds) {
      pipeline.get(`user:${id}`);
    }
    const results = await pipeline.exec();
    
    for (const userData of results) {
      if (userData) {
        users.push(typeof userData === 'string' ? JSON.parse(userData) : userData as TelegramUser);
      }
    }
    
    return users;
  } catch (error) {
    console.error('Error fetching all users:', error);
    return [];
  }
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

// Delete user from all sets and their data
export async function deleteUser(userId: string): Promise<void> {
  try {
    const pipeline = redis.pipeline();
    pipeline.del(`user:${userId}`);
    pipeline.srem(REDIS_KEYS.ALL, userId);
    pipeline.srem(REDIS_KEYS.IT, userId);
    pipeline.srem(REDIS_KEYS.ES, userId);
    pipeline.srem(REDIS_KEYS.EN, userId);
    await pipeline.exec();
    console.log(`User ${userId} deleted from database (bot blocked).`);
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
  }
}

// Save report for statistics
export async function saveReport(report: Omit<SendReport, 'reachedUsers'>): Promise<void> {
  try {
    const reportId = `report:${report.timestamp.replace(/[:.]/g, '-')}`;
    await redis.set(reportId, JSON.stringify(report));
    await redis.lpush('reports:list', reportId);
    // Keep only last 100 reports for speed/storage
    await redis.ltrim('reports:list', 0, 99);
  } catch (error) {
    console.error('Error saving report:', error);
  }
}

export async function getReports(limit: number = 90): Promise<Omit<SendReport, 'reachedUsers'>[]> {
  try {
    const reportIds = await redis.lrange('reports:list', 0, limit - 1);
    const reports: Omit<SendReport, 'reachedUsers'>[] = [];
    for (const id of reportIds) {
      const data = await redis.get(id as string);
      if (data) {
        reports.push(typeof data === 'string' ? JSON.parse(data) : data);
      }
    }
    return reports;
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
}
