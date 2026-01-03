import { MessageConfig, SendResult, SendReport, TelegramUser, Language } from '@/types';
import { getAllUsers, deleteUser, saveReport } from './redis';
import { sendConfiguredMessage, sendReportToAdmin, sendUsersJsonToAdmin } from './telegram';

export function getUserLanguage(user: TelegramUser): Language {
  const lang = user.languageCode?.toLowerCase() || '';
  if (lang.startsWith('it')) return 'it';
  if (lang.startsWith('es')) return 'es';
  return 'en';
}

// Send a message to all users and generate report
export async function sendMessageToAllUsers(config: MessageConfig): Promise<SendReport> {
  const allUsers = await getAllUsers();
  
  const results: SendResult[] = [];
  const reachedUsers: TelegramUser[] = [];
  
  for (const user of allUsers) {
    const lang = getUserLanguage(user);
    const result = await sendConfiguredMessage(user, config, lang);
    results.push(result);
    
    if (result.success) {
      reachedUsers.push(user);
    } else if (result.error === 'Forbidden: bot was blocked by the user' || result.error?.includes('bot was blocked')) {
      await deleteUser(user.id.toString());
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
  
  // Save report to database (without the huge user list to save space)
  const { reachedUsers: _, ...statsReport } = report;
  await saveReport(statsReport);
  
  // Send report to admin
  await sendReportToAdmin(report);
  
  // Send JSON file to admin
  await sendUsersJsonToAdmin(report);
  
  return report;
}
