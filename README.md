# Telegram Scheduled Messages Bot

A Next.js application for scheduling and sending Telegram messages in multiple languages (Italian, Spanish, English) with automated daily delivery and admin reporting.

## Live Dashboard

https://loop-scheduled-messages-telegram-bo.vercel.app/

## Features

- **5 Configurable Messages** - Each with multilingual text, media attachments, CTA buttons, and schedule patterns
- **Photos & Videos Support** - Send albums with mixed photos and videos, displayed with correct proportions
- **Web Dashboard** - Preview messages with media thumbnails, test sending, and see bot status
- **Configurable Execution Time** - Set daily sending time in `src/config/setHour.ts`
- **Auto-Delete Messages** - Configure message lifetime (messageLifeHours) to auto-delete after specified hours
- **Daily Automated Sending** - Messages sent at configured time (default 9:00 AM Madrid time) based on schedule patterns
- **Admin Reports** - Receive delivery statistics and reached user lists after each broadcast
- **Content Protection** - Option to prevent forwarding/saving of messages

## How Scheduling Works

The cron job runs **once per day at the configured time** (default: 9:00 AM Madrid time, compatible with Vercel Hobby plan). All messages scheduled for that day are sent when the cron runs.

### Configuring Execution Time

Edit `src/config/setHour.ts` to change when messages are sent:

```typescript
export const DAILY_EXECUTION_TIME = "09:00";  // Format: "HH:MM" (24-hour)
export const TIMEZONE = "Europe/Madrid";
```

### Schedule Pattern Formats

| Pattern | Description |
|---------|-------------|
| `SUNDAY` | Every Sunday |
| `MONDAY` | Every Monday |
| `TUESDAY` | Every Tuesday |
| ... | etc. |
| `SUNDAY-1` | First Sunday of every month |
| `MONDAY-2` | Second Monday of every month |
| `FRIDAY-3` | Third Friday of every month |
| `MONTHLY-01` | 1st day of every month |
| `MONTHLY-15` | 15th day of every month |
| `MONTHLY-28` | 28th day of every month |

## Deployment Guide

### Prerequisites

1. A Telegram Bot (create one via [@BotFather](https://t.me/botfather))
2. An Upstash Redis database
3. A Vercel account
4. A GitHub account

### Step 1: Fork/Clone the Repository

```bash
git clone https://github.com/Kirtkub/loopScheduledMessagesTelegramBot.git
cd loopScheduledMessagesTelegramBot
```

### Step 2: Set Up Upstash Redis

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### Step 3: Configure Your Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Create a new bot with `/newbot`
3. Copy the bot token

### Step 4: Add Users to Redis

Users should be stored in Redis sets by language:
- `users:it` - Italian users
- `users:es` - Spanish users
- `users:en` - English/other users

Each user is stored as JSON:
```json
{"id": 123456789, "username": "john_doe", "languageCode": "en"}
```

### Step 5: Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/) and import your repository
3. Add the following environment variables:

| Variable | Description |
|----------|-------------|
| `KV_REST_API_URL` | Upstash Redis REST API URL |
| `KV_REST_API_READ_ONLY_TOKEN` | Upstash Redis read-only token |
| `TELEGRAM_BOT_TOKEN` | Your Telegram bot token |
| `CRON_SECRET` | A secret string to secure the cron endpoint (recommended) |

4. Deploy!

### Step 6: Configure Messages

Edit the message files directly on GitHub:
- [message1.ts](https://github.com/Kirtkub/loopScheduledMessagesTelegramBot/edit/main/src/config/message1.ts)
- [message2.ts](https://github.com/Kirtkub/loopScheduledMessagesTelegramBot/edit/main/src/config/message2.ts)
- [message3.ts](https://github.com/Kirtkub/loopScheduledMessagesTelegramBot/edit/main/src/config/message3.ts)
- [message4.ts](https://github.com/Kirtkub/loopScheduledMessagesTelegramBot/edit/main/src/config/message4.ts)
- [message5.ts](https://github.com/Kirtkub/loopScheduledMessagesTelegramBot/edit/main/src/config/message5.ts)

Each message supports:
- Multilingual text (Italian, Spanish, English)
- Photo attachments (media_it, media_es, media_en - Telegram file_ids)
- Video attachments (video_it, video_es, video_en - Telegram file_ids)
- Mixed photo/video albums with correct aspect ratios
- CTA buttons with URLs
- Content protection
- Auto-delete timer (messageLifeHours: 24 = delete after 24h, 0 = never delete)
- Day-based schedule patterns

## Admin Configuration

Set the admin Telegram user ID in `src/config/adminUserId.json`:

```json
{
  "adminUserId": YOUR_TELEGRAM_USER_ID
}
```

The admin receives:
- Test messages from the dashboard
- Delivery reports after each broadcast
- JSON files with reached user lists

## Development

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard with media previews
│   └── api/
│       ├── cron/route.ts     # Daily cron job
│       ├── test-send/route.ts # Test messages
│       ├── bot-info/route.ts  # Bot info API
│       └── messages/route.ts  # Message configs & file preview
├── config/
│   ├── message1-5.ts         # Message configurations
│   ├── setHour.ts            # Daily execution time config
│   └── adminUserId.json      # Admin ID
├── lib/
│   ├── redis.ts              # Redis connection
│   ├── telegram.ts           # Telegram API (photos, videos, auto-delete)
│   ├── scheduler.ts          # Schedule parsing
│   └── sender.ts             # Broadcasting
└── types/
    └── index.ts              # TypeScript types
```

## License

MIT
