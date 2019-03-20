console.log('Bot is starting!');

const Twit = require('twit');
const Config = require('./config');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
const $ = jQuery = require('jquery')(window);

const T = new Twit(Config);
const KEY = process.env.YT_KEY;
const dangerZone = 10000;
const maxTweetsInHour = 10;
const messages = [
    'We will not stop fighting!', 
    'This is not the end!', 
    'Everyone subscribe!',
    'This cannot be the end!',
    'We need to do something!',
    'A sub audit could screw us over!'
];

var tweetsInHour = 0;
var replyToId;
var previousReplyId;
var previousGap = 1;

console.log(`Bot has started!`)
tweetIt(`The subgap is currently ${subGap()}! \n\n#PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);

//All async functions called
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
        if(subgap < 500 && subgap > 0)
        {
            tweetIt(`🚨🚨ALERT! SUBGAP < 500 ALERT!🚨🚨 \n\nTHE SUBGAP IS NOW ${subgap.toLocaleString('en')}! \n${selectMessage().toUpperCase()} \n\n#PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
        }
        else if(subgap < 1000 && subgap > 0)
        {
            tweetIt(`🚨🚨ALERT! SUBGAP < 1,000 ALERT!🚨🚨 \n\nThe subgap is now ${subgap.toLocaleString('en')}! \n${selectMessage()} \n\n#PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
        }
        else if(subgap < 5000 && subgap > 0)
        {
            tweetIt(`🚨🚨ALERT! SUBGAP < 5,000 ALERT!🚨🚨 \n\nThe subgap is now ${subgap.toLocaleString('en')}! \n${selectMessage()} \n\n#PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
        }        
        else if(subgap < dangerZone && subgap > 0)
        {
            tweetIt(`🚨🚨ALERT! ALERT!🚨🚨 \n\nThe subgap is now ${subgap.toLocaleString('en')}! \n${selectMessage()} \n\n#PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
        }
    }, 1000*60*60);
}

async function negativeAlert()
{
    setInterval(function(){
        let subgap = subGap();
        if(subgap < 0 && previousGap > 0)
        {
            tweetIt(`🚨🚨ALERT! ALERT!🚨🚨 THE SUBGAP IS NOW NEGATIVE! ${subgap.toLocaleString('en')}! \n\nT-SERIES HAS PASSED PEWDS! THIS IS NOT THE END! \nEVERYONE SUBSCRIBE TO GET PEWDIEPIE BACK! ${selectMessage().toUpperCase()} LETS GET #Sub2Pewds TRENDING! \n\n#PewDiePie #TSeries #MemeReview #Subgap`);
            previousGap = subgap;
        }
        else if(subgap > 0 && previousGap < 0)
        {
            tweetIt(`🚨🚨ALERT! ALERT!🚨🚨 THE GAP IS POSITIVE AGAIN! \n\n${subgap.toLocaleString('en')}! \nWE WILL KEEP FIGHTING! \n\n#PewDiePie #TSeries #MemeReview #Subgap`);
            previousGap = subgap;
        }
    }, 1000*60*1)
}

async function tweetSubCount()
{
    setInterval(function(){
        let subgap = subGap().toLocaleString('en');
        let pewdsCount = getChannelData('pewdiepie').toLocaleString('en');
        let tCount = getChannelData('tseries').toLocaleString('en');

        tweetIt(`PewDiePie currently has ${pewdsCount}. T-Series currently has ${tCount}. The subgap is currenly at ${subgap}. #PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
    }, 1000*60*60*6)
}

async function resetConstraints()
{
    setInterval(function(){
        tweetsInHour = 0;
    }, 1000*60*60)
}

function selectMessage()
{
    let r = Math.floor(Math.random()*messages.length);

    return messages[r];
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
                in_reply_to_status_id: replyToId,
                status: `@${screenName} ${tweet}`
            }

            if(replyToId !== null && replyToId !== previousReplyId)
            {
                T.post('statuses/update', opts, function(err, data, response){
                    if(err) console.log(`Something went horribly wrong!: ${err}`)
                    else { console.log(`Tweeted: '${tweet}' in response to: ${screenName}`); previousReplyId = replyToId; replyToId = null; likeTweet(replyToId); likeTweet(data.id_str); };
                });
            }
        });
    }, 1000*15)
}

/**
  * Deletes a tweet.
  * @param {string} id_str - The tweet you're deleting.
  */
function deleteTweet(id_str)
{
    T.post('statuses/destroy/:id', { id: id_str }, function(err, data, response){
        if(err) console.log(`Something went horribly wrong!: ${err}`)
        else {  }
    });
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
            else { console.log(`Tweeted: '${statusText}'`); tweetsInHour++; likeTweet(data.id_str); }
        });
    }
}

/**
  * Likes a tweet.
  * @param {string} id_str - The string id of the tweet you are liking.
  */
function likeTweet(id_str)
{
    T.post('favorites/create', { id: id_str }, function(err, data, response){
        if(err) console.log(`Something went horribly wrong!: ${err}`)
        else { console.log(`Liked a tweet with id: ${id_str}`); };
    });
}
 
/**
  * Gets the sub count of a channel.
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
