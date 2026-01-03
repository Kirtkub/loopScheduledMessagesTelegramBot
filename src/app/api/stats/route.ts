import { NextRequest, NextResponse } from 'next/server';
import { getReports } from '@/lib/redis';

export async function GET(request: NextRequest) {
  const reports = await getReports(90);
  return NextResponse.json({ success: true, reports });
}
