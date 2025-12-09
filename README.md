# Telegram Scheduled Messages Bot

A Next.js application for scheduling and sending Telegram messages in multiple languages (Italian, Spanish, English) with automated delivery and admin reporting.

## Live Dashboard

**[loopScheduledMessagesTelegramBot.vercel.app](https://loopScheduledMessagesTelegramBot.vercel.app)**

## Features

- **5 Configurable Messages** - Each with multilingual text, media attachments, CTA buttons, and schedule patterns
- **Web Dashboard** - Preview messages, test sending, and see bot status
- **Automated Scheduling** - Messages sent automatically based on Madrid timezone schedules
- **Admin Reports** - Receive delivery statistics and reached user lists after each broadcast
- **Content Protection** - Option to prevent forwarding/saving of messages

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
- Media attachments (Telegram file_ids)
- CTA buttons with URLs
- Content protection
- Multiple schedule patterns

### Schedule Pattern Formats

All times use Madrid timezone (Europe/Madrid):

| Pattern | Description |
|---------|-------------|
| `SUNDAY-21:00` | Every Sunday at 21:00 |
| `MONDAY-2-10:00` | Second Monday of the month at 10:00 |
| `MONTHLY-15-12:00` | 15th day of every month at 12:00 |

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
│   ├── page.tsx              # Dashboard
│   └── api/
│       ├── cron/route.ts     # Automated sending
│       ├── test-send/route.ts # Test messages
│       ├── bot-info/route.ts  # Bot info API
│       └── messages/route.ts  # Message configs
├── config/
│   ├── message1-5.ts         # Message configurations
│   └── adminUserId.json      # Admin ID
├── lib/
│   ├── redis.ts              # Redis connection
│   ├── telegram.ts           # Telegram API
│   ├── scheduler.ts          # Schedule parsing
│   └── sender.ts             # Broadcasting
└── types/
    └── index.ts              # TypeScript types
```

## License

MIT
