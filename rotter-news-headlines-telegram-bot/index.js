const https = require('https');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const iconv = require('iconv-lite');

// telegram bot token
const token = 'XXXXXXXXXX:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const bot = new TelegramBot(token, {polling: true});
// chat id number
const chatId = XXXXXXXXX;
const interval = 60 * 1000; // 1 minute polling interval
var date;

setInterval(() => {
  if (date) {
    let req = https.get("https://rotter.net/rss/rotternews.xml", (res) => {
      res.setEncoding('binary'); 
      var resBuf = new Buffer.alloc(102400);
      var resIdx = 0;
      res.on('data', function(stream) {
        resIdx += resBuf.write(stream, resIdx, 'binary');
      });
      res.on('end', () => {
        var xml = iconv.decode(resBuf, 'win1255');
        const regex = /<item>(.*?)<\/item>/g;
        const results = Array.from(xml.matchAll(regex), x=>x[1]);
        results.reverse(); // start from older news
        for (const result of results) {
          const matchTitle = result.match(/<title>(.*?)<\/title>/g);
          const title = matchTitle[0].replace(/<\/?title>/g,'').replace('&amp;#1524;', '"');
          const matchTime = result.match(/<pubDate>(.*?)<\/pubDate>/g);
          const time = matchTime[0].replace(/<\/?pubDate>/g,'');
          const matchLink = result.match(/<link>(.*?)<\/link>/g);
          const articleLink = matchLink[0].replace(/<\/?link>/g,'');
          const timestamp = Date.parse(time) / 1000;
          if (timestamp > date){
            displayTime = new Date(timestamp * 1000);
            let h = displayTime.getHours();
            let m = displayTime.getMinutes();
            bot.sendMessage(chatId, (h < 10 ? '0' + h : h) + ":" + (m < 10 ? '0' + m : m) + " - <a href='" + articleLink + "'>" + title + "</a>", {parse_mode : "HTML"});
          }
        }
        date = Date.now() / 1000;
      });
    });
  } else {
    date = Date.now() / 1000;
  }
}, interval);

bot.onText(/\/start/, (msg) => {
  console.log(msg.chat.id);
});