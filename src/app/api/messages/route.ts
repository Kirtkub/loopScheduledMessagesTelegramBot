import { NextRequest, NextResponse } from 'next/server';
import { allMessages } from '@/config/messages';

const TELEGRAM_API = 'https://api.telegram.org/bot';

function getBotToken(): string {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error('TELEGRAM_BOT_TOKEN environment variable is not set');
  }
  return token;
}

function getAllConfiguredFileIds(): Set<string> {
  const fileIds = new Set<string>();
  for (const message of allMessages) {
    message.media_it.forEach(id => fileIds.add(id));
    message.media_es.forEach(id => fileIds.add(id));
    message.media_en.forEach(id => fileIds.add(id));
    message.video_it.forEach(id => fileIds.add(id));
    message.video_es.forEach(id => fileIds.add(id));
    message.video_en.forEach(id => fileIds.add(id));
  }
  return fileIds;
}

function isConfiguredFileId(fileId: string): boolean {
  const configuredIds = getAllConfiguredFileIds();
  return configuredIds.has(fileId);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');
  const fileId = searchParams.get('fileId');

  if (action === 'getFile' && fileId) {
    if (!isConfiguredFileId(fileId)) {
      return NextResponse.json({
        success: false,
        error: 'File ID not found in configuration',
      }, { status: 403 });
    }

    try {
      const response = await fetch(`${TELEGRAM_API}${getBotToken()}/getFile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_id: fileId }),
      });
      
      const result = await response.json();
      
      if (result.ok && result.result.file_path) {
        return NextResponse.json({
          success: true,
          hasFile: true,
          fileType: result.result.file_path.includes('.mp4') || result.result.file_path.includes('.mov') ? 'video' : 'photo',
          file_size: result.result.file_size,
        });
      }
      
      return NextResponse.json({
        success: false,
        error: result.description || 'Failed to get file info',
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  if (action === 'proxyFile' && fileId) {
    if (!isConfiguredFileId(fileId)) {
      return NextResponse.json({
        success: false,
        error: 'File ID not found in configuration',
      }, { status: 403 });
    }

    try {
      const getFileResponse = await fetch(`${TELEGRAM_API}${getBotToken()}/getFile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_id: fileId }),
      });
      
      const getFileResult = await getFileResponse.json();
      
      if (!getFileResult.ok || !getFileResult.result.file_path) {
        return NextResponse.json({
          success: false,
          error: getFileResult.description || 'Failed to get file',
        }, { status: 404 });
      }
      
      const filePath = getFileResult.result.file_path;
      const fileUrl = `https://api.telegram.org/file/bot${getBotToken()}/${filePath}`;
      
      const fileResponse = await fetch(fileUrl);
      
      if (!fileResponse.ok) {
        return NextResponse.json({
          success: false,
          error: 'Failed to download file',
        }, { status: 500 });
      }
      
      const fileBuffer = await fileResponse.arrayBuffer();
      const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';
      
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400',
        },
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 });
    }
  }

  const sanitizedMessages = allMessages.map(msg => ({
    id: msg.id,
    text_it: msg.text_it,
    text_es: msg.text_es,
    text_en: msg.text_en,
    media_it_count: msg.media_it.length,
    media_es_count: msg.media_es.length,
    media_en_count: msg.media_en.length,
    video_it_count: msg.video_it.length,
    video_es_count: msg.video_es.length,
    video_en_count: msg.video_en.length,
    protect_content: msg.protect_content,
    buttons: msg.buttons,
    schedule: msg.schedule,
    messageLifeHours: msg.messageLifeHours,
  }));

  return NextResponse.json({
    messages: sanitizedMessages,
  });
}
