# Node.js Projects

## [AllJobs telegram bot](https://github.com/einatsof/nodejs-projects/tree/main/alljobs-telegram-bot)
A telegram bot using [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api).  
Node.js scraper for [alljobs.co.il](https://www.alljobs.co.il) using [cheerio](https://github.com/cheeriojs/cheerio) to parse the html.  
A database ensures only new jobs are sent as a message to the user.

## [Rotter news headlines telegram bot](https://github.com/einatsof/nodejs-projects/tree/main/rotter-news-headlines-telegram-bot)
A telegram bot using [node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api).  
RSS feed is taken from [rotter.net](https://rotter.net/scoopscache.html) scoops forum in fixed intervals, decoded from windows-1255 with [iconv-lite](https://github.com/ashtuchkin/iconv-lite), parsed and new headlines are sent as messages to chat.

## [Twitter translator bot](https://github.com/einatsof/nodejs-projects/tree/main/twitter-translator-bot)
A twitter bot using [twitter-api-v2](https://github.com/plhery/node-twitter-api-v2).  
Quote retweet with translation new tweets of specific users only if they are written in a specific language.  
Language detection is done with [languagedetect](https://github.com/FGRibreau/node-language-detect) and translation is done with [google-translate-api-x](https://github.com/AidanWelch/google-translate-api).
