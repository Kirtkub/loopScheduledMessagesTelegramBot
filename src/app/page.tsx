'use client';

import { useState, useEffect } from 'react';
import { allMessages } from '@/config/messages';
import { MessageConfig, Language } from '@/types';
import { formatSchedulePattern, DAILY_EXECUTION_TIME, TIMEZONE } from '@/lib/scheduler';

type TabLanguage = 'it' | 'es' | 'en';

const GITHUB_BASE_URL = 'https://github.com/Kirtkub/loopScheduledMessagesTelegramBot/edit/main/src/config';

interface BotInfo {
  id: number;
  first_name: string;
  username: string;
}

interface MediaPreview {
  type: 'photo' | 'video';
  file_id: string;
  url?: string;
}

function MessageCard({ message }: { message: MessageConfig }) {
  const [selectedLang, setSelectedLang] = useState<TabLanguage>('en');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);
  const [mediaPreviews, setMediaPreviews] = useState<MediaPreview[]>([]);
  const [loadingPreviews, setLoadingPreviews] = useState(false);

  const messageNumber = message.id.replace('message', '');
  const githubEditUrl = `${GITHUB_BASE_URL}/message${messageNumber}.ts`;

  const getText = () => {
    switch (selectedLang) {
      case 'it': return message.text_it;
      case 'es': return message.text_es;
      default: return message.text_en;
    }
  };

  const getPhotos = () => {
    switch (selectedLang) {
      case 'it': return message.media_it;
      case 'es': return message.media_es;
      default: return message.media_en;
    }
  };

  const getVideos = () => {
    switch (selectedLang) {
      case 'it': return message.video_it;
      case 'es': return message.video_es;
      default: return message.video_en;
    }
  };

  const getButtonText = (btn: { text_it: string; text_es: string; text_en: string }) => {
    switch (selectedLang) {
      case 'it': return btn.text_it;
      case 'es': return btn.text_es;
      default: return btn.text_en;
    }
  };

  useEffect(() => {
    const loadPreviews = async () => {
      const photos = getPhotos();
      const videos = getVideos();
      
      if (photos.length === 0 && videos.length === 0) {
        setMediaPreviews([]);
        return;
      }

      setLoadingPreviews(true);
      
      const previews: MediaPreview[] = [];
      
      for (const fileId of photos) {
        try {
          const response = await fetch(`/api/messages?action=getFile&fileId=${encodeURIComponent(fileId)}`);
          const data = await response.json();
          if (data.success && data.hasFile) {
            previews.push({
              type: 'photo',
              file_id: fileId,
              url: `/api/messages?action=proxyFile&fileId=${encodeURIComponent(fileId)}`
            });
          } else {
            previews.push({ type: 'photo', file_id: fileId });
          }
        } catch {
          previews.push({ type: 'photo', file_id: fileId });
        }
      }
      
      for (const fileId of videos) {
        try {
          const response = await fetch(`/api/messages?action=getFile&fileId=${encodeURIComponent(fileId)}`);
          const data = await response.json();
          if (data.success && data.hasFile) {
            previews.push({
              type: 'video',
              file_id: fileId,
              url: `/api/messages?action=proxyFile&fileId=${encodeURIComponent(fileId)}`
            });
          } else {
            previews.push({ type: 'video', file_id: fileId });
          }
        } catch {
          previews.push({ type: 'video', file_id: fileId });
        }
      }
      
      setMediaPreviews(previews);
      setLoadingPreviews(false);
    };
    
    loadPreviews();
  }, [selectedLang]);

  const sendTestMessage = async (lang: Language) => {
    setSending(true);
    setSendResult(null);
    try {
      const response = await fetch('/api/test-send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: message.id, language: lang }),
      });
      const result = await response.json();
      setSendResult({
        success: result.success,
        message: result.success 
          ? `Test message sent successfully (${lang.toUpperCase()})` 
          : `Failed to send: ${result.error}`,
      });
    } catch (error) {
      setSendResult({
        success: false,
        message: 'Error sending test message',
      });
    }
    setSending(false);
  };

  const photos = getPhotos();
  const videos = getVideos();
  const totalMedia = photos.length + videos.length;
  const validButtons = message.buttons.filter(btn => btn.url && (btn.text_it || btn.text_es || btn.text_en));

  const formatMessageLife = (hours: number) => {
    if (hours === 0) return 'Never deleted';
    if (hours < 24) return `Deleted after ${hours} hour${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) return `Deleted after ${days} day${days > 1 ? 's' : ''}`;
    return `Deleted after ${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">{message.id.toUpperCase()}</h2>
          <a
            href={githubEditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-800 text-white text-xs rounded hover:bg-gray-700"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            Edit
          </a>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className={`px-2 py-1 text-xs rounded ${message.protect_content ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
            {message.protect_content ? 'Protected' : 'Not Protected'}
          </span>
          {photos.length > 0 && (
            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
              {photos.length} Photo{photos.length > 1 ? 's' : ''}
            </span>
          )}
          {videos.length > 0 && (
            <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800">
              {videos.length} Video{videos.length > 1 ? 's' : ''}
            </span>
          )}
          {totalMedia === 0 && (
            <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">
              No Media
            </span>
          )}
          <span className={`px-2 py-1 text-xs rounded ${message.messageLifeHours === 0 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
            {message.messageLifeHours === 0 ? 'Permanent' : `${message.messageLifeHours}h life`}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex border-b">
          {(['en', 'it', 'es'] as TabLanguage[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-4 py-2 text-sm font-medium ${
                selectedLang === lang
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {lang === 'en' ? 'English' : lang === 'it' ? 'Italiano' : 'Español'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Message Preview:</h3>
        <div 
          className="text-gray-800 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: getText().replace(/\n/g, '<br/>') }}
        />
        
        {validButtons.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {validButtons.map((btn, index) => (
              <a
                key={index}
                href={btn.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 transition-colors"
              >
                {getButtonText(btn)}
              </a>
            ))}
          </div>
        )}
      </div>

      {totalMedia > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Media Attachments:</h3>
          {loadingPreviews ? (
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              Loading previews...
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {mediaPreviews.map((preview, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square">
                  {preview.url ? (
                    preview.type === 'photo' ? (
                      <img 
                        src={preview.url} 
                        alt={`Media ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <video 
                        src={preview.url}
                        className="w-full h-full object-contain"
                        controls
                        muted
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                      {preview.type === 'photo' ? (
                        <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-10 h-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                      <span className="text-xs">{preview.type === 'photo' ? 'Photo' : 'Video'} #{index + 1}</span>
                    </div>
                  )}
                  <div className={`absolute top-1 right-1 px-2 py-0.5 text-xs rounded ${preview.type === 'photo' ? 'bg-blue-500' : 'bg-purple-500'} text-white`}>
                    {preview.type === 'photo' ? 'Photo' : 'Video'}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-2 text-xs text-gray-500">
            File IDs: {[...photos, ...videos].map(id => id.substring(0, 15) + '...').join(', ')}
          </div>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Schedule:</h3>
        {message.schedule.length > 0 ? (
          <ul className="list-disc list-inside text-sm text-gray-700">
            {message.schedule.map((pattern, index) => (
              <li key={index}>{formatSchedulePattern(pattern)}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 italic">No schedule configured (message will not be sent automatically)</p>
        )}
      </div>

      <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
        <h3 className="text-sm font-semibold text-orange-800 mb-1">Message Lifetime:</h3>
        <p className="text-sm text-orange-700">
          {formatMessageLife(message.messageLifeHours)}
        </p>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Send Test to Admin:</h3>
        <div className="flex gap-2">
          {(['en', 'it', 'es'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => sendTestMessage(lang)}
              disabled={sending}
              className="px-4 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
            >
              {sending ? 'Sending...' : `Test ${lang.toUpperCase()}`}
            </button>
          ))}
        </div>
        {sendResult && (
          <div className={`mt-2 p-2 rounded text-sm ${sendResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {sendResult.message}
          </div>
        )}
      </div>
    </div>
  );
}

function BotInfoHeader() {
  const [botInfo, setBotInfo] = useState<BotInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBotInfo() {
      try {
        const response = await fetch('/api/bot-info');
        const result = await response.json();
        if (result.success) {
          setBotInfo(result.bot);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch bot info');
      }
      setLoading(false);
    }
    fetchBotInfo();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-lg p-3 mb-4 animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-48"></div>
      </div>
    );
  }

  if (error || !botInfo) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-yellow-800">
          <span className="font-semibold">Bot not connected:</span> {error || 'Configure TELEGRAM_BOT_TOKEN to see bot info'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-3">
      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
        {botInfo.first_name.charAt(0)}
      </div>
      <div>
        <p className="font-semibold text-green-800">{botInfo.first_name}</p>
        <p className="text-sm text-green-600">@{botInfo.username}</p>
      </div>
      <div className="ml-auto">
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Connected
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Telegram Message Dashboard</h1>
          <p className="text-gray-600 mt-2">Preview and test scheduled Telegram messages</p>
        </div>

        <BotInfoHeader />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-blue-800 mb-2">Configuration Info</h2>
          <ul className="text-sm text-blue-700 list-disc list-inside">
            <li>Click the <strong>Edit</strong> button on each message to modify it on GitHub</li>
            <li>Messages are sent daily at <strong>{DAILY_EXECUTION_TIME} {TIMEZONE}</strong></li>
            <li>Modify <code className="bg-blue-100 px-1 rounded">src/config/setHour.ts</code> to change the execution time</li>
            <li>Admin reports are sent after each broadcast</li>
          </ul>
        </div>

        {allMessages.map((message) => (
          <MessageCard key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
