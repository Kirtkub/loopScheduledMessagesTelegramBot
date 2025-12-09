import { NextResponse } from 'next/server';

const TELEGRAM_API = 'https://api.telegram.org/bot';

export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!token) {
    return NextResponse.json({ 
      success: false, 
      error: 'TELEGRAM_BOT_TOKEN not configured' 
    });
  }
  
  try {
    const response = await fetch(`${TELEGRAM_API}${token}/getMe`);
    const result = await response.json();
    
    if (result.ok) {
      return NextResponse.json({
        success: true,
        bot: {
          id: result.result.id,
          first_name: result.result.first_name,
          username: result.result.username,
        },
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.description || 'Failed to get bot info' 
      });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Error connecting to Telegram API' 
    });
  }
}
