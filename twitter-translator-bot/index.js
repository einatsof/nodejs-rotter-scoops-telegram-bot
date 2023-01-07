// Tool to get bot token: https://github.com/smaeda-ks/tw-oob-oauth-cli
const { TwitterApi } = require('twitter-api-v2');
const LanguageDetect = require('languagedetect');
const translate = require('google-translate-api-x');
const dotenv = require('dotenv');

dotenv.config();
const client = new TwitterApi({
  appKey: process.env.APP_KEY,
  appSecret: process.env.APP_SECRET,
  accessToken: process.env.ACCESS_TOKEN, // bot account access token
  accessSecret: process.env.ACCESS_SECRET  // bot account access secret
});

const lngDetector = new LanguageDetect();

const interval = 60 * 60 * 1000; // 1 hour polling interval

const users = {
  '12': 'jack' // 'twitter id': 'name'
};

const FROM_LANGUAGE = 'dutch';  // From languagedetect supported languages
const FROM_LANGUAGE_ISO = 'nl'; // language iso code
const TO_LANGUAGE_ISO = 'en';   // language iso code

/**
 * Get 10 recents tweets of the specified user,
 * find if there are new tweets from the past hour,
 * if the detected language is the wanted language translate and quote retweet with translation
 */
async function checkTweets(user, time) {

  const { _realData: { data: tweetsArray }} = await client.v2.userTimeline(user, {
    exclude: ['replies', 'retweets']
  });
  tweetsArray.reverse(); // Start with older tweets
  for (let i = 0; i < tweetsArray.length; i++) {
    // Get tweet time
    const { data: tweet } = await client.v2.singleTweet(tweetsArray[i].id, {
      'tweet.fields': [
        'created_at'
      ]
    });
    const date = new Date(tweet.created_at);
    const timestamp = date.getTime() / 1000;
    if (time - timestamp < 60 * 60) {
      let tweetText = tweetsArray[i].text;
      // Remove image links
      tweetText = tweetText.split(/\shttp?s/)[0];
      // Language detection
      const lang = lngDetector.detect(tweetText, 1);
      if (lang.length == 1 && lang[0][0] == FROM_LANGUAGE) {
        // Retweet with translation
        const translated = await translate(tweetText, {from: FROM_LANGUAGE_ISO, to: TO_LANGUAGE_ISO});
        const { data: createdTweet } = await client.v2.tweet(translated.text, {
          'quote_tweet_id': tweetsArray[i].id
        });
      }
    }
  }

}

setInterval(() => {
	const now = Date.now() / 1000;
  for (const user in users) {
    checkTweets(`${user}`, now);
  }
}, interval);
