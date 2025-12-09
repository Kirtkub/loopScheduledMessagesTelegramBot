import { MessageConfig, SendResult, SendReport, TelegramUser, Language } from '@/types';
import { getUsersByLanguage, getUserLanguage } from './redis';
import { sendConfiguredMessage, sendReportToAdmin } from './telegram';

// Send a message to all users and generate report
export async function sendMessageToAllUsers(config: MessageConfig): Promise<SendReport> {
  const { italian, spanish, other } = await getUsersByLanguage();
  
  const results: SendResult[] = [];
  const reachedUsers: TelegramUser[] = [];
  
  // Send to Italian users
  for (const user of italian) {
    const result = await sendConfiguredMessage(user, config, 'it');
    results.push(result);
    if (result.success) {
      reachedUsers.push(user);
    }
  }
  
  // Send to Spanish users
  for (const user of spanish) {
    const result = await sendConfiguredMessage(user, config, 'es');
    results.push(result);
    if (result.success) {
      reachedUsers.push(user);
    }
  }
  
  // Send to other users (English default)
  for (const user of other) {
    const result = await sendConfiguredMessage(user, config, 'en');
    results.push(result);
    if (result.success) {
      reachedUsers.push(user);
    }
  }
  
  // Calculate statistics
  const totalUsers = results.length;
  const successCount = results.filter(r => r.success).length;
  const failedCount = totalUsers - successCount;
  
  const italianReached = results.filter(r => r.success && r.language === 'it').length;
  const spanishReached = results.filter(r => r.success && r.language === 'es').length;
  const otherReached = results.filter(r => r.success && r.language === 'en').length;
  
  const report: SendReport = {
    messageId: config.id,
    timestamp: new Date().toISOString(),
    totalUsers,
    successCount,
    failedCount,
    successPercentage: totalUsers > 0 ? (successCount / totalUsers) * 100 : 0,
    italianReached,
    italianPercentage: successCount > 0 ? (italianReached / successCount) * 100 : 0,
    spanishReached,
    spanishPercentage: successCount > 0 ? (spanishReached / successCount) * 100 : 0,
    otherReached,
    otherPercentage: successCount > 0 ? (otherReached / successCount) * 100 : 0,
    reachedUsers,
  };
  
  // Send report to admin
  await sendReportToAdmin(report);
  
  return report;
}
