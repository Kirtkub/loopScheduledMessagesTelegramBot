import { NextResponse } from 'next/server';
import { allMessages } from '@/config/messages';

// API endpoint to get all message configurations
export async function GET() {
  return NextResponse.json({
    messages: allMessages,
  });
}
