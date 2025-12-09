import { TelegramUser, MessageConfig, SendResult, SendReport, Language } from '@/types';
import adminConfig from '@/config/adminUserId.json';

const TELEGRAM_API = 'https://api.telegram.org/bot';

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN environment variable is not set');
  }
  return token;
}

// Get text in user's language
function getLocalizedText(config: MessageConfig, lang: Language): string {
  switch (lang) {
    case 'it': return config.text_it;
    case 'es': return config.text_es;
    default: return config.text_en;
  }
}

// Get media in user's language
function getLocalizedMedia(config: MessageConfig, lang: Language): string[] {
  switch (lang) {
    case 'it': return config.media_it;
    case 'es': return config.media_es;
    default: return config.media_en;
  }
}

// Get button text in user's language
function getLocalizedButtonText(button: { text_it: string; text_es: string; text_en: string }, lang: Language): string {
  switch (lang) {
    case 'it': return button.text_it;
    case 'es': return button.text_es;
    default: return button.text_en;
  }
}

// Build inline keyboard from buttons
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

// Send a simple text message
async function sendMessage(
  chatId: number,
  text: string,
  replyMarkup?: object,
  protectContent: boolean = false
): Promise<boolean> {
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
      }),
    });
    
    const result = await response.json();
    return result.ok;
  } catch (error) {
    console.error(`Error sending message to ${chatId}:`, error);
    return false;
  }
}

// Send a media group (album)
async function sendMediaGroup(
  chatId: number,
  mediaIds: string[],
  caption: string,
  protectContent: boolean = false
): Promise<boolean> {
  try {
    const media = mediaIds.map((fileId, index) => ({
      type: 'photo',
      media: fileId,
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
    return result.ok;
  } catch (error) {
    console.error(`Error sending media group to ${chatId}:`, error);
    return false;
  }
}

// Send message with optional buttons after media group
async function sendButtonsAfterMedia(
  chatId: number,
  replyMarkup: object,
  protectContent: boolean = false
): Promise<boolean> {
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
    return result.ok;
  } catch (error) {
    console.error(`Error sending buttons to ${chatId}:`, error);
    return false;
  }
}

// Send configured message to a user
export async function sendConfiguredMessage(
  user: TelegramUser,
  config: MessageConfig,
  lang: Language
): Promise<SendResult> {
  const text = getLocalizedText(config, lang);
  const media = getLocalizedMedia(config, lang);
  const keyboard = buildInlineKeyboard(config, lang);
  
  let success = false;
  
  if (media.length > 0) {
    // Send as album with caption
    success = await sendMediaGroup(user.id, media, text, config.protect_content);
    
    // Send buttons in a separate message if needed
    if (success && keyboard) {
      await sendButtonsAfterMedia(user.id, keyboard, config.protect_content);
    }
  } else {
    // Send as regular text message
    success = await sendMessage(user.id, text, keyboard, config.protect_content);
  }
  
  return {
    userId: user.id,
    username: user.username,
    success,
    language: lang,
    error: success ? undefined : 'Failed to send message',
  };
}

// Send report to admin
export async function sendReportToAdmin(report: SendReport): Promise<void> {
  const adminId = adminConfig.adminUserId;
  
  const reportText = `
<b>Message Delivery Report</b>
<b>Message ID:</b> ${report.messageId}
<b>Sent at:</b> ${report.timestamp}

<b>Total Users:</b> ${report.totalUsers}
<b>Successfully Reached:</b> ${report.successCount} (${report.successPercentage.toFixed(1)}%)
<b>Failed:</b> ${report.failedCount}

<b>Language Breakdown:</b>
Italian: ${report.italianReached} (${report.italianPercentage.toFixed(1)}%)
Spanish: ${report.spanishReached} (${report.spanishPercentage.toFixed(1)}%)
Other: ${report.otherReached} (${report.otherPercentage.toFixed(1)}%)
`;
  
  await sendMessage(adminId, reportText);
  
  // Send JSON file with reached users
  const jsonContent = JSON.stringify(report.reachedUsers, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  
  const formData = new FormData();
  formData.append('chat_id', String(adminId));
  formData.append('document', blob, `reached_users_${report.messageId}_${Date.now()}.json`);
  formData.append('caption', `Users reached for message ${report.messageId}`);
  
  try {
    await fetch(`${TELEGRAM_API}${getBotToken()}/sendDocument`, {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    console.error('Error sending JSON file to admin:', error);
  }
}

// Send test message to admin
export async function sendTestMessageToAdmin(config: MessageConfig, lang: Language): Promise<boolean> {
  const adminId = adminConfig.adminUserId;
  const adminUser: TelegramUser = {
    id: adminId,
    languageCode: lang,
  };
  
  const result = await sendConfiguredMessage(adminUser, config, lang);
  return result.success;
}
