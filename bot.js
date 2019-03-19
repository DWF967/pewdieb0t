console.log('Bot is starting!');
const Twit = require('twit');
const Config = require('./config');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const $ = jQuery = require('jquery')(window);

const KEY = process.env.YT_KEY;
var T = new Twit(Config);

const dangerZone = 10000;
const maxTweetsInHour = 10;
var tweetsInHour = 0;
var replyToId;
var previousReplyId;

tweetIt(`The subgap is currently ${subGap()}! #PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);

tweetSubCount();
alertGap();
negativeAlert();
reply('pewdiepie', `The subgap is currenly at ${(getChannelData('pewdiepie') - getChannelData('tseries')).toLocaleString('en')}. #PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
resetConstraints();

function subGap()
{
    let pewdsSubCount = getChannelData('pewdiepie');
    let tseriesSubCount = getChannelData('tseries');
    return (pewdsSubCount - tseriesSubCount).toLocaleString('en');
}

async function alertGap()
{
    setInterval(function(){
        let subgap = subGap();
        if(subgap < dangerZone)
        {
            tweetIt(`🚨🚨ALERT! ALERT!🚨🚨 THE SUBGAP IS NOW ${subgap}! WE NEED TO DO SOMETHING! THIS CANNOT BE THE END! #PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
        }
        else if(subgap < (dangerZone / 2))
        {
            tweetIt(`🚨🚨ALERT! SUBGAP < ${(dangerZone / 2).toLocaleString('en')} ALERT!🚨🚨 THE SUBGAP IS NOW ${subgap}! WE NEED TO DO SOMETHING! THIS CANNOT BE THE END! #PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
        }
        else if(subgap < (dangerZone / 10))
        {
            tweetIt(`🚨🚨ALERT! SUBGAP < ${(dangerZone / 10).toLocaleString('en')} ALERT!🚨🚨 THE SUBGAP IS NOW ${subgap}! WE NEED TO DO SOMETHING! THIS CANNOT BE THE END! #PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
        }
        else if(subgap < (dangerZone / 20))
        {
            tweetIt(`🚨🚨ALERT! SUBGAP < ${(dangerZone / 20).toLocaleString('en')} ALERT!🚨🚨 THE SUBGAP IS NOW ${subgap}! WE NEED TO DO SOMETHING! THIS CANNOT BE THE END! #PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
        }
    }, 1000*60*15);
}

async function negativeAlert()
{
    setInterval(function(){
        let subgap = subGap();
        if(subgap < 0)
        {
            tweetIt(`🚨🚨ALERT! ALERT!🚨🚨 THE SUBGAP IS NOW NEGATIVE! T-SERIES HAS PASSED PEWDS! ${subgap}! EVERYONE SUBSCRIBE TO GET PEWDIEPIE BACK! THIS IS NOT THE END! LETS GET #Sub2Pewds TRENDING! #PewDiePie #TSeries #MemeReview #Subgap`);
        }
    }, 1000*60*2);
}

async function tweetSubCount()
{
    setInterval(function(){
        let subgap = subGap();
        let pewdsCount = getChannelData('pewdiepie').toLocaleString('en');
        let tCount = getChannelData('tseries').toLocaleString('en');

        tweetIt(`PewDiePie currently has ${pewdsCount}. T-Series currently has ${tCount}. The subgap is currenly at ${subgap}. #PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
    }, 1000*60*60*4)
}

async function resetConstraints()
{
    setInterval(function(){
        tweetsInHour = 0;
    }, 1000*60*60)
}

/**
  * Replies to the latest tweet from a person.
  * @param {string} screenName - Who you're replying to.
  * @param {string} tweet - What you're tweeting.
  */
async function reply(screenName, tweet)
{
    setInterval(function(){
        T.get('statuses/user_timeline', { screen_name: screenName, count: 1 }, function(err, data, response) {
            replyToId = data[0].id_str;

            var opts = {
                in_reply_to_status_id: replyToId
              , status: `@${screenName} ${tweet}`
            }

            if(replyToId !== null && replyToId !== previousReplyId)
            {
                T.post('statuses/update', opts, function(err, data, response){
                        if(err) console.log(`Something went horribly wrong!: ${err}`)
                        else { console.log(`Tweeted: '${tweet}' in response to: ${screenName}`); previousReplyId = replyToId; replyToId = null; };
                    }
                )
            }
        });
    }, 1000*15)
}

/**
  * Tweets something out.
  * @param {string} statusText - What you're tweeting.
  */
function tweetIt(statusText)
{
    if(tweetsInHour == maxTweetsInHour) 
    { 
        console.log(`Sorry, we have already reached our limit of tweets in an hour: ${maxTweetsInHour}`); 
        return;
    }
    else 
    {
        T.post('statuses/update', { status: statusText }, function(err, data, response) {
            if(err) console.log(`Something went horribly wrong!: ${err}`)
            else { console.log(`Tweeted: '${statusText}'`); tweetsInHour++; }
        });
    }
}
 
/**
  * Tweets something out.
  * @param {string} channel - The channel you are trying to get the sub count of.
  */
function getChannelData(channel)
{
    var ytApiUrl = 'https://www.googleapis.com/youtube/v3/channels?part=statistics&forUsername=' + channel + '&key=' + KEY;
    var subsVar;
     
    $.ajaxSetup({
        async: false
    });
 
    $.getJSON(ytApiUrl, function(result){
       subsVar = +result['items'][0]['statistics'].subscriberCount;
    });    
     
    return subsVar;
}
