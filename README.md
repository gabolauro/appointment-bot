# Appointments Monitor

Small Node.js + TypeScript poller that watches a government appointments API and emails you when availability appears.

## Prerequisites
- Node.js 18+ (for native `fetch`)
- npm

## Setup
1. Clone or download this folder.
2. Copy `.env.example` to `.env` and fill in values.
3. Install dependencies:
   ```bash
   npm install
   ```

## Environment variables
| Name | Description |
| --- | --- |
| `API_URL` | Full URL of the appointments endpoint. |
| `API_FIELD_PATH` | (Reserved) Not used in the current logic. |
| `API_AVAILABLE_VALUE` | (Reserved) Not used in the current logic. |
| `POLL_TIMEOUT_MS` | (Optional) Request timeout in ms. Default 8000. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | SMTP credentials for Nodemailer. |
| `EMAIL_FROM` | From address for notifications. |
| `EMAIL_TO` | Recipient address. |

## Run in development
```bash
npm run dev
```

## Build and run in production
```bash
npm run build
npm start
```

## How it works
- Two cron schedules:
  - Every 5 minutes between 08:00–20:59.
  - Every hour otherwise.
- Heartbeat email every day at 08:00 confirming the bot is running.
- Fetches the API with basic retries and timeout.
- Evaluates `API_FIELD_PATH` and compares to `API_AVAILABLE_VALUE`.
- Sends one email when status flips from "unavailable" to "available" during runtime; avoids duplicates while status stays the same.

## Reasonable defaults
- Treats any non-2xx response as a failure.
- Logs concise messages for poll attempts, status changes, and errors.
