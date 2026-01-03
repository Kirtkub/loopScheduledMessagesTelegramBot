import { TelegramUser, MessageConfig, SendResult, SendReport, Language, MediaItem } from '@/types';
import adminConfig from '@/config/adminUserId.json';

const TELEGRAM_API = 'https://api.telegram.org/bot';

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN environment variable is not set');
  }
  return token;
}

function getLocalizedText(config: MessageConfig, lang: Language): string {
  switch (lang) {
    case 'it': return config.text_it;
    case 'es': return config.text_es;
    default: return config.text_en;
  }
}

function getLocalizedMedia(config: MessageConfig, lang: Language): MediaItem[] {
  const photos = lang === 'it' ? config.media_it : lang === 'es' ? config.media_es : config.media_en;
  const videos = lang === 'it' ? config.video_it : lang === 'es' ? config.video_es : config.video_en;
  
  const mediaItems: MediaItem[] = [];
  
  for (const fileId of photos) {
    mediaItems.push({ type: 'photo', file_id: fileId });
  }
  
  for (const fileId of videos) {
    mediaItems.push({ type: 'video', file_id: fileId });
  }
  
  return mediaItems;
}

function getLocalizedButtonText(button: { text_it: string; text_es: string; text_en: string }, lang: Language): string {
  switch (lang) {
    case 'it': return button.text_it;
    case 'es': return button.text_es;
    default: return button.text_en;
  }
}

function buildInlineKeyboard(config: MessageConfig, lang: Language): object | undefined {
  const validButtons = config.buttons.filter(btn => 
    btn.url && (btn.text_it || btn.text_es || btn.text_en)
  );
  
  if (validButtons.length === 0) return undefined;
  
  return {
    inline_keyboard: validButtons.map(btn => [{
      text: getLocalizedButtonText(btn, lang),
      url: btn.url,
    }]),
  };
}

async function sendMessage(
  chatId: number,
  text: string,
  replyMarkup?: object,
  protectContent: boolean = false
): Promise<{ success: boolean; messageId?: number; error?: string }> {
  try {
    const response = await fetch(`${TELEGRAM_API}${getBotToken()}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        reply_markup: replyMarkup,
        protect_content: protectContent,
        disable_web_page_preview: true,
      }),
    });
    
    const result = await response.json();
    if (result.ok) {
      return { success: true, messageId: result.result.message_id };
    }
    return { success: false, error: result.description };
  } catch (error) {
    console.error(`Error sending message to ${chatId}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function sendMediaGroup(
  chatId: number,
  mediaItems: MediaItem[],
  caption: string,
  protectContent: boolean = false
): Promise<{ success: boolean; messageIds?: number[]; error?: string }> {
  try {
    const media = mediaItems.map((item, index) => ({
      type: item.type,
      media: item.file_id,
      caption: index === 0 ? caption : undefined,
      parse_mode: index === 0 ? 'HTML' : undefined,
    }));
    
    const response = await fetch(`${TELEGRAM_API}${getBotToken()}/sendMediaGroup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        media,
        protect_content: protectContent,
      }),
    });
    
    const result = await response.json();
    if (result.ok) {
      const messageIds = result.result.map((msg: { message_id: number }) => msg.message_id);
      return { success: true, messageIds };
    }
    return { success: false, error: result.description };
  } catch (error) {
    console.error(`Error sending media group to ${chatId}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function sendButtonsAfterMedia(
  chatId: number,
  replyMarkup: object,
  protectContent: boolean = false
): Promise<{ success: boolean; messageId?: number; error?: string }> {
  try {
    const response = await fetch(`${TELEGRAM_API}${getBotToken()}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '.',
        reply_markup: replyMarkup,
        protect_content: protectContent,
      }),
    });
    
    const result = await response.json();
    if (result.ok) {
      return { success: true, messageId: result.result.message_id };
    }
    return { success: false, error: result.description };
  } catch (error) {
    console.error(`Error sending buttons to ${chatId}:`, error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function deleteMessage(chatId: number, messageId: number): Promise<boolean> {
  try {
    const response = await fetch(`${TELEGRAM_API}${getBotToken()}/deleteMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
      }),
    });
    
    const result = await response.json();
    return result.ok;
  } catch (error) {
    console.error(`Error deleting message ${messageId} from ${chatId}:`, error);
    return false;
  }
}

async function scheduleMessageDeletion(
  chatId: number, 
  messageIds: number[], 
  hoursDelay: number
): Promise<void> {
  if (hoursDelay <= 0) return;
  
  const delayMs = hoursDelay * 60 * 60 * 1000;
  
  // NOTE: On Vercel, setTimeout might not complete if the request finishes.
  // We use waitUntil if available or just execute immediately for short delays.
  // For long delays, a proper cleanup cron is better.
  setTimeout(async () => {
    try {
      for (const messageId of messageIds) {
        await deleteMessage(chatId, messageId);
      }
    } catch (e) {
      console.error('Auto-delete failed:', e);
    }
  }, delayMs).unref?.();
}

export async function sendConfiguredMessage(
  user: TelegramUser,
  config: MessageConfig,
  lang: Language
): Promise<SendResult> {
  const text = getLocalizedText(config, lang);
  const mediaItems = getLocalizedMedia(config, lang);
  const keyboard = buildInlineKeyboard(config, lang);
  
  let success = false;
  let error: string | undefined;
  const sentMessageIds: number[] = [];
  
  if (mediaItems.length > 0) {
    const mediaResult = await sendMediaGroup(user.id, mediaItems, text, config.protect_content);
    success = mediaResult.success;
    error = mediaResult.error;
    if (mediaResult.messageIds) {
      sentMessageIds.push(...mediaResult.messageIds);
    }
    
    if (success && keyboard) {
      const buttonResult = await sendButtonsAfterMedia(user.id, keyboard, config.protect_content);
      if (buttonResult.messageId) {
        sentMessageIds.push(buttonResult.messageId);
      }
    }
  } else {
    const messageResult = await sendMessage(user.id, text, keyboard, config.protect_content);
    success = messageResult.success;
    error = messageResult.error;
    if (messageResult.messageId) {
      sentMessageIds.push(messageResult.messageId);
    }
  }
  
  if (success && config.messageLifeHours > 0 && sentMessageIds.length > 0) {
    scheduleMessageDeletion(user.id, sentMessageIds, config.messageLifeHours);
  }
  
  return {
    userId: user.id,
    username: user.username,
    success,
    language: lang,
    error,
  };
}

export async function sendReportToAdmin(report: SendReport): Promise<void> {
  const adminId = adminConfig.adminUserId;
  
  const reportText = `
✅ <b>Message Delivery Report</b>
<b>Message ID:</b> ${report.messageId}
<b>Sent at:</b> ${report.timestamp}

<b>Total Users Attempted:</b> ${report.totalUsers}
<b>Successfully Reached:</b> ${report.successCount} (${report.successPercentage.toFixed(1)}%)
<b>Failed/Blocked:</b> ${report.failedCount}

<b>Language Breakdown:</b>
🇮🇹 Italian: ${report.italianReached} (${report.italianPercentage.toFixed(1)}%)
🇪🇸 Spanish: ${report.spanishReached} (${report.spanishPercentage.toFixed(1)}%)
🇬🇧 English/Other: ${report.otherReached} (${report.otherPercentage.toFixed(1)}%)
`;
  
  await sendMessage(adminId, reportText);
}

export async function sendUsersJsonToAdmin(report: SendReport): Promise<void> {
  const adminId = adminConfig.adminUserId;
  const now = new Date();
  const format = (n: number) => n.toString().padStart(2, '0');
  const dateStr = `${now.getFullYear()}_${format(now.getMonth() + 1)}_${format(now.getDate())}_${format(now.getHours())}_${format(now.getMinutes())}`;
  
  const fileName = `${dateStr}_report_01.json`;

  const jsonContent = JSON.stringify(report.reachedUsers, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  
  const formData = new FormData();
  formData.append('chat_id', String(adminId));
  formData.append('document', blob, fileName);
  formData.append('caption', `JSON report for message ${report.messageId}`);
  
  try {
    await fetch(`${TELEGRAM_API}${getBotToken()}/sendDocument`, {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    console.error('Error sending JSON file to admin:', error);
  }
}


export async function sendTestMessageToAdmin(config: MessageConfig, lang: Language): Promise<boolean> {
  const adminId = adminConfig.adminUserId;
  const adminUser: TelegramUser = {
    id: adminId,
    languageCode: lang,
  };
  
  const result = await sendConfiguredMessage(adminUser, config, lang);
  return result.success;
}
