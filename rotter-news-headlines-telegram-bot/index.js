const https = require('https');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const iconv = require('iconv-lite');
const dotenv = require('dotenv');

dotenv.config();
// telegram bot token
const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: false});
// chat id number
const chatId = process.env.CHAT_ID;
const interval = 60 * 1000; // 1 minute polling interval
let time;

setInterval(() => {
  if (time) {
    let req = https.get("https://rotter.net/rss/rotternews.xml", (res) => {
      res.setEncoding('binary'); 
      let resBuf = new Buffer.alloc(102400);
      let resIdx = 0;
      res.on('data', function(stream) {
        resIdx += resBuf.write(stream, resIdx, 'binary');
      });
      res.on('error', (e) => {
        console.error(e);
      });
      res.on('end', () => {
        const xml = iconv.decode(resBuf, 'win1255');
        const regex = /<item>(.*?)<\/item>/g;
        const results = Array.from(xml.matchAll(regex), x=>x[1]);
        const last = Date.parse(results[0].match(/<pubDate>(.*?)<\/pubDate>/g)[0].replace(/<\/?pubDate>/g,'')) / 1000;
        if (time < last){
          results.reverse(); // start from older news
          for (const result of results) {
            const matchTitle = result.match(/<title>(.*?)<\/title>/g);
            const title = matchTitle[0].replace(/<\/?title>/g,'');
            const matchDate = result.match(/<pubDate>(.*?)<\/pubDate>/g);
            const date = matchDate[0].replace(/<\/?pubDate>/g,'');
            const matchLink = result.match(/<link>(.*?)<\/link>/g);
            const articleLink = matchLink[0].replace(/<\/?link>/g,'');
            const timestamp = Date.parse(date) / 1000;
            if (last >= timestamp && timestamp > time){
              displayTime = new Date(timestamp * 1000);
              let h = displayTime.getHours();
              let m = displayTime.getMinutes();
              bot.sendMessage(chatId, `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m} - <a href='${articleLink}'>${title}</a>`, {parse_mode : "HTML"});
            }
          }
          time = last;
        }
      });
    });
  } else {
    time = Date.now() / 1000;
  }
}, interval);
