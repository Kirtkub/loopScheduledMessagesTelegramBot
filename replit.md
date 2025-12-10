# Telegram Scheduled Messages Application

## Overview
A Next.js 14 application for scheduling and sending Telegram messages in multiple languages (Italian, Spanish, English) to users stored in Upstash Redis. The app includes a web dashboard for previewing messages and testing, plus automated cron-based message delivery with admin reporting.

## Project Structure
```
src/
├── app/
│   ├── page.tsx              # Web dashboard with message previews
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── api/
│       ├── cron/route.ts     # Cron endpoint for scheduled sending
│       ├── test-send/route.ts # Test message to admin endpoint
│       └── messages/route.ts  # Get all message configs
├── config/
│   ├── message1.ts           # Message 1 configuration
│   ├── message2.ts           # Message 2 configuration
│   ├── message3.ts           # Message 3 configuration
│   ├── message4.ts           # Message 4 configuration
│   ├── message5.ts           # Message 5 configuration
│   ├── messages.ts           # Export all messages
│   └── adminUserId.json      # Admin Telegram user ID
├── lib/
│   ├── redis.ts              # Upstash Redis connection
│   ├── telegram.ts           # Telegram Bot API integration
│   ├── scheduler.ts          # Schedule pattern parsing
│   └── sender.ts             # Message broadcasting logic
└── types/
    └── index.ts              # TypeScript type definitions
```

## Configuration

### Message Files (src/config/message1.ts - message5.ts)
Each message file contains:
- `id`: Unique message identifier
- `text_it`, `text_es`, `text_en`: Localized message text (HTML supported)
- `media_it`, `media_es`, `media_en`: Telegram photo file_id arrays
- `video_it`, `video_es`, `video_en`: Telegram video file_id arrays (can be mixed with photos)
- `protect_content`: Prevent forwarding/saving
- `buttons`: CTA buttons with localized text and URLs
- `schedule`: Array of schedule patterns
- `messageLifeHours`: Hours after which the message auto-deletes (0 = never)

### Execution Time Configuration (src/config/setHour.ts)
Configure the daily execution time for scheduled messages:
- `DAILY_EXECUTION_TIME`: Time in "HH:MM" format (e.g., "09:00")
- `TIMEZONE`: Timezone for execution (default: "Europe/Madrid")

### Schedule Pattern Formats (Day-based)
The cron runs once daily at the configured time (default 9:00 AM Madrid time). Messages scheduled for that day are sent when the cron runs.

- `SUNDAY`: Every Sunday
- `MONDAY-2`: Second Monday of month
- `MONTHLY-15`: 15th day of month

### Admin Configuration (src/config/adminUserId.json)
Contains the Telegram user ID for receiving reports and test messages.

## Environment Variables

### Required for Production (Vercel)
- `KV_REST_API_URL`: Upstash Redis REST API URL
- `KV_REST_API_READ_ONLY_TOKEN`: Upstash Redis read-only token
- `TELEGRAM_BOT_TOKEN`: Telegram Bot API token

### Optional
- `CRON_SECRET`: Secret for securing the cron endpoint (recommended for production)

## Redis Data Structure
The app expects users stored in Redis sets by language:
- `users:it`: Italian users
- `users:es`: Spanish users
- `users:en`: English users

Each user is stored as JSON: `{"id": 123456789, "username": "john_doe", "languageCode": "en"}`

## Features

### Web Dashboard
- Preview all 5 messages with language tabs
- View schedule patterns, media attachments, and CTA buttons
- Send test messages to admin in any language
- Visual indicators for protected content and media

### Automated Sending
- Cron job runs every minute (configured in vercel.json)
- Checks all message schedules against current Madrid time
- Broadcasts matching messages to all users by language
- Sends delivery report to admin with statistics

### Admin Reports
After each broadcast, admin receives:
- Total users, success/failure counts
- Language breakdown with percentages
- JSON file with list of reached users

## Development

### Run locally
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

## Deployment to Vercel
1. Connect repository to Vercel
2. Add environment variables (KV_REST_API_URL, KV_REST_API_READ_ONLY_TOKEN, TELEGRAM_BOT_TOKEN, CRON_SECRET)
3. Deploy
4. Cron job will automatically run every minute

## Recent Changes
- Initial project setup with Next.js 14, TypeScript, Tailwind CSS
- Created 5 message configuration files with detailed comments
- Implemented Redis integration for user management
- Implemented Telegram Bot API for sending messages and albums
- Created schedule pattern parser with Madrid timezone support
- Built web dashboard with message previews and test functionality
- Configured Vercel cron job for automated message delivery

### December 2024 Updates
- Added `src/config/setHour.ts` for configurable daily execution time
- Added video support: `video_it`, `video_es`, `video_en` fields for video file_ids
- Photos and videos can now be mixed in albums with correct aspect ratios
- Added `messageLifeHours` field for auto-message deletion (default: 24 hours, 0 = never)
- Dashboard now shows photo/video previews with correct proportions
- Dashboard displays message lifetime information for each message
