import { NextRequest, NextResponse } from 'next/server';
import { getMessageById } from '@/config/messages';
import { sendTestMessageToAdmin } from '@/lib/telegram';
import { Language } from '@/types';

// API endpoint to send test message to admin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, language } = body as { messageId: string; language: Language };
    
    if (!messageId) {
      return NextResponse.json({ error: 'messageId is required' }, { status: 400 });
    }
    
    const message = getMessageById(messageId);
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }
    
    const lang: Language = language || 'en';
    const success = await sendTestMessageToAdmin(message, lang);
    
    return NextResponse.json({
      success,
      messageId,
      language: lang,
      sentTo: 'admin',
    });
  } catch (error) {
    console.error('Error sending test message:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send test message' },
      { status: 500 }
    );
  }
}
