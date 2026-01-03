import { NextRequest, NextResponse } from 'next/server';
import { allMessages } from '@/config/messages';
import { shouldSendToday } from '@/lib/scheduler';
import { sendMessageToAllUsers } from '@/lib/sender';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const results: { messageId: string; sent: boolean; error?: string }[] = [];
  
  for (const message of allMessages) {
    if (shouldSendToday(message.schedule)) {
      try {
        await sendMessageToAllUsers(message);
        results.push({ messageId: message.id, sent: true });
      } catch (error) {
        console.error(`Error sending ${message.id}:`, error);
        results.push({ 
          messageId: message.id, 
          sent: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    } else {
      results.push({ messageId: message.id, sent: false });
    }
  }
  
  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    results,
  });
}
