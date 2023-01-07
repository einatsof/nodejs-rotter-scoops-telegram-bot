const https = require('https');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const cheerio = require('cheerio');
const dotenv = require('dotenv');

dotenv.config();
const token = process.env.TOKEN;
const url=`https://www.alljobs.co.il/SearchResultsGuest.aspx?${process.env.SEARCH}`;

const bot = new TelegramBot(token, {polling: true});
let chatId;
let jobsData = [];

// Try reading chat id from file
try{
  idData = fs.readFileSync('chatid.txt');
  chatId = parseInt(idData);
  init();
} catch (err) {
  console.log(err);
}

// On start save chat id in 'chatid.txt' file and send a welcome message
bot.onText(/\/start/, (msg) => {
  chatId = msg.chat.id;
  fs.writeFileSync('chatid.txt', chatId.toString());
  console.log('chat id saved');
  // Welcome message
  bot.sendMessage(chatId, "Welcome!");
  init();
});

// Initialize data array from file and start periodic checks
function init() {
  try{
    rawJsonData = fs.readFileSync('data.txt');
    jobsData = JSON.parse(rawJsonData);
  } catch (err) {
    fs.writeFileSync('data.txt', JSON.stringify(jobsData));
  }
  
  // Check for jobs every hour
  checkForJobs();
  setInterval(checkForJobs, 1000 * 60 * 60);
}

function checkForJobs() {
  const options = {headers:{'Cache-Control':'no-cache', 'Cookie': 'sort={"ID":"1"%2C"longitude":0%2C"latitude":0}'}}
  https.get(
    url+"&ie="+(new Date()).getTime(),
    options,
    (res) => {
      const dataBuffers = []
      res.on('data', (data) => {
        dataBuffers.push(data.toString('utf8'));
      });
      res.on('end', () => {
        html = dataBuffers.join('');
        const $ = cheerio.load(html);

        const jobsList = $('div[class="job-content-top-title"], div[class="job-content-top-title-ltr"]')
        .find('div > a')
        .toArray();
        for (let i = 0; i < jobsList.length; i++){
          if (!jobsList[i].attribs.href.startsWith("/Search/UploadSingle.aspx?JobID=")){
            continue;
          }
          const jobid = jobsList[i].attribs.href.substring(jobsList[i].attribs.href.lastIndexOf('=')+1);
          if (jobsData.includes(jobid)){
            continue;
          }
          jobsData.push(jobid);
          const jobLink = 'https://www.alljobs.co.il' + jobsList[i].attribs.href;
          const jobTitle = jobsList[i].children[0].children[0].data;
          console.log(jobTitle, jobLink);
          bot.sendMessage(chatId, `<a href='${jobLink}'>${jobTitle}</a>`, {parse_mode : "HTML"});	
        }

        const jobsHighlightList = $('div[class="job-content-top-title-highlight"], div[class="job-content-top-title-highligh-ltr"]')
          .find('div > a')
          .toArray();
        for (let i = 0; i < jobsHighlightList.length; i++) {
          if (!jobsHighlightList[i].attribs.href.startsWith("/Search/UploadSingle.aspx?JobID=")) {
            continue;
          }
          const jobid = jobsHighlightList[i].attribs.href.substring(jobsHighlightList[i].attribs.href.lastIndexOf('=')+1);
          if (jobsData.includes(jobid)) {
            continue;
          }
          jobsData.push(jobid);
          const jobLink = 'https://www.alljobs.co.il' + jobsHighlightList[i].attribs.href;
          const jobTitle = jobsHighlightList[i].children[0].children[0].children[0].data;
          console.log(jobTitle, jobLink);
          bot.sendMessage(chatId, `<a href='${jobLink}'>${jobTitle}</a>`, {parse_mode : "HTML"});	
        }

        fs.writeFileSync('data.txt', JSON.stringify(jobsData));
      });
    }
  ).on('error', (error) => {
    console.log(error);
  });
}
