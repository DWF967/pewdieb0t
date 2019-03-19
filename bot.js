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
var previousGap;

tweetIt(`Bot has started. \n\nThe subgap is currently ${subGap()}! \n\n#PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);

alertGap();
negativeAlert();
tweetSubCount();
reply('pewdiepie', `The subgap is currenly at ${(getChannelData('pewdiepie') - getChannelData('tseries')).toLocaleString('en')}! #PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
resetConstraints();

function subGap()
{
    let pewdsSubCount = getChannelData('pewdiepie');
    let tseriesSubCount = getChannelData('tseries');
    return (pewdsSubCount - tseriesSubCount);
}

async function alertGap()
{
    setInterval(function(){
        let subgap = subGap();
        if(subgap < 5000)
        {
            tweetIt(`🚨🚨ALERT! SUBGAP < 5,000 ALERT!🚨🚨 \n\nTHE SUBGAP IS NOW ${subgap.toLocaleString('en')}! \nWE NEED TO DO SOMETHING! THIS CANNOT BE THE END! \n\n#PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
        }
        else if(subgap < 1000)
        {
            tweetIt(`🚨🚨ALERT! SUBGAP < 1,000 ALERT!🚨🚨 \n\nTHE SUBGAP IS NOW ${subgap.toLocaleString('en')}! \nWE NEED TO DO SOMETHING! THIS CANNOT BE THE END! \n\n#PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
        }
        else if(subgap < 500)
        {
            tweetIt(`🚨🚨ALERT! SUBGAP < 500 ALERT!🚨🚨 \n\nTHE SUBGAP IS NOW ${subgap.toLocaleString('en')}! \nWE NEED TO DO SOMETHING! THIS CANNOT BE THE END! \n\n#PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
        }
        else if(subgap < dangerZone)
        {
            tweetIt(`🚨🚨ALERT! ALERT!🚨🚨 \n\nTHE SUBGAP IS NOW ${subgap.toLocaleString('en')}! \nWE NEED TO DO SOMETHING! THIS CANNOT BE THE END! \n\n#PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
        }
    }, 1000*60*30);
}

async function negativeAlert()
{
    setInterval(function(){
        let subgap = subGap();
        if(subgap < 0)
        {
            tweetIt(`🚨🚨ALERT! ALERT!🚨🚨 THE SUBGAP IS NOW NEGATIVE! \n\nT-SERIES HAS PASSED PEWDS! ${subgap.toLocaleString('en')}! \nEVERYONE SUBSCRIBE TO GET PEWDIEPIE BACK! THIS IS NOT THE END! LETS GET \n\n#Sub2Pewds TRENDING! #PewDiePie #TSeries #MemeReview #Subgap`);
            previousGap = subgap;
        }
        else if(subgap > 0 && previousGap < 0)
        {
            tweetIt(`🚨🚨ALERT! ALERT!🚨🚨 THE GAP IS POSITIVE AGAIN! \n\n${subgap.toLocaleString('en')}! \nWE WILL NOT STOP FIGHTING! \n\n#PewDiePie #TSeries #MemeReview #Subgap`);
            previousGap = subgap;
        }
    }, 1000*60*2)
}

async function tweetSubCount()
{
    setInterval(function(){
        let subgap = subGap().toLocaleString('en');
        let pewdsCount = getChannelData('pewdiepie').toLocaleString('en');
        let tCount = getChannelData('tseries').toLocaleString('en');

        tweetIt(`PewDiePie currently has ${pewdsCount}. T-Series currently has ${tCount}. The subgap is currenly at ${subgap}. #PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
    }, 1000*60*60*5)
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
