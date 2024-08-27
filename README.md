# Rotter News Headlines Telegram Bot

This Node.js application is a Telegram bot that retrieves news headlines from the [Rotter.net](https://rotter.net/scoopscache.html) Scoops Forum via an RSS feed and sends new headlines as messages to a specified Telegram chat.

It uses [`node-telegram-bot-api`](https://github.com/yagop/node-telegram-bot-api) and [`iconv-lite`](https://github.com/ashtuchkin/iconv-lite).

## Features

- Fetches RSS feed from Rotter.net at regular intervals (default: every 1 minute).
- Decodes the RSS feed from Windows-1255 encoding using `iconv-lite`.
- Parses the RSS feed to extract new headlines.
- Sends new headlines to a Telegram chat with clickable links.

## Prerequisites

- Node.js installed on your machine.
- A Telegram bot token. You can get this by creating a bot on Telegram using BotFather.
- A Telegram chat ID where the bot will send the messages.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/rotter-telegram-bot.git
   cd rotter-telegram-bot
   ```

2. Install the dependencies:

  ```bash
  npm install
  ```

3. Create a .env file with the following contents:

  ```dosini
  TOKEN=your-telegram-bot-token
  CHAT_ID=your-telegram-chat-id
  ```

4. Run the bot:

  ```bash
  node app.js
  ```

## Configuration

- **`TOKEN`:** Your Telegram bot token.
- **`CHAT_ID`:** The ID of the Telegram chat where the bot will send messages.
- **`INTERVAL`:** (Optional) The polling interval in milliseconds (default is 60000, or 1 minute).

