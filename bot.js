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

console.log(`Bot has started!`)
tweetIt(`The subgap is currently ${subGap().toLocaleString('en')}! \n\n#PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);

//All async functions called
alertGap();
negativeAlert();
tweetSubCount();
reply('pewdiepie');
replyToSummons();
resetConstraints();

function subGap()
{
    let pewdsSubCount = getChannelData('pewdiepie');
    let tseriesSubCount = getChannelData('tseries');
    return (pewdsSubCount - tseriesSubCount);
}

async function alertGap()
{
    let previous = subGap();
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
        else if(subgap > dangerZone && previous < dangerZone)
        {
            tweetIt(`No alert right now. The subgap is now back above ${dangerZone.toLocaleString()} thanks to all you nine year olds! ${subgap.toLocaleString()}! \n\n#PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`)
        }
        previous = subgap;
    }, 1000*60*60);
}

async function negativeAlert()
{
    let previousGap = 1;
    setInterval(function(){
        let subgap = subGap();
        if(subgap < 0 && previousGap > 0)
        {
            tweetIt(`🚨🚨ALERT! ALERT!🚨🚨 THE SUBGAP IS NOW NEGATIVE! ${subgap.toLocaleString('en')}! \n\nT-SERIES HAS PASSED PEWDS! THIS IS NOT THE END! \nEVERYONE SUBSCRIBE TO GET PEWDIEPIE BACK! ${selectMessage().toUpperCase()} LETS GET #Sub2Pewds TRENDING! \n\n#PewDiePie #TSeries #MemeReview #Subgap`);
        }
        else if(subgap < -15000 && previousGap > -15000)
        {
            tweetIt(`🆘🆘🆘🆘🆘🆘🆘🆘SUBGAP < -15,000!🆘🆘🆘🆘🆘🆘🆘🆘\n\n${subgap.toLocaleString('en')}! SOMEONE DO SOMETHING! SAVE US!\n\n#PewDiePie #TSeries #MemeReview #Subgap`);
        }
        else if(subgap > 0 && previousGap < 0)
        {
            tweetIt(`🚨🚨ALERT! ALERT!🚨🚨 THE GAP IS POSITIVE AGAIN! \n\n${subgap.toLocaleString('en')}! \nWE WILL KEEP FIGHTING! \n\n#PewDiePie #TSeries #MemeReview #Subgap`);
        }
        previousGap = subgap;
    }, 1000*60*5)
}

async function tweetSubCount()
{
    setInterval(function(){
        let pewdsCount = getChannelData('pewdiepie');
        let tCount = getChannelData('tseries')
        let subgap = pewdsCount - tCount;

        tweetIt(`PewDiePie currently has ${pewdsCount.toLocaleString('en')}. \n\nT-Series currently has ${tCount.toLocaleString('en')}. \n\nThe subgap is currenly at ${subgap.toLocaleString('en')}. \n\n#PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
    }, 1000*60*60*6)
}

async function resetConstraints()
{
    setInterval(function(){
        tweetsInHour = 0;
    }, 1000*60*60)
}

async function replyToSummons()
{
    let replyToId;
    let previousReplyId = [];
    setInterval(function(){
        T.get('search/tweets', { q: '@PewDieB0t the #SubGap', count: 1 }, function(err, data, response) {
            replyToId = data.statuses[0].id_str;
            let user = data.statuses[0].user

            if(replyToId !== null && !previousReplyId.includes(replyToId))
            {
                let subgap = subGap();
                if(!isNaN(subgap))
                {
                    var opts = {
                        in_reply_to_status_id: replyToId,
                        status: `@${user.screen_name} The subgap is currenly at ${subgap.toLocaleString('en')}! #PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`
                    }

                    T.post('statuses/update', opts, function(err, data, response){
                        if(err) console.log(`Something went horribly wrong!: ${err}`)
                        else { console.log(`Tweeted: 'The subgap is currenly at ${subgap.toLocaleString('en')}! \n\n#PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds' in response to: ${user.screen_name}.`); previousReplyId.push(replyToId); replyToId = null; likeTweet(replyToId); likeTweet(data.id_str); };
                    });
                }
                else console.log(`Sorry, we have sent too many requests to the youtube API. Please wait until 2 am CST for the quota to reset.`);
            }
        });
    }, 1000*15)
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
async function reply(screenName)
{
    let replyToId;
    let previousReplyId;
    setInterval(function(){
        T.get('statuses/user_timeline', { screen_name: screenName, count: 1 }, function(err, data, response) {
            replyToId = data[0].id_str;

            if(replyToId !== null && replyToId !== previousReplyId)
            {
                let subgap = subGap();
                if(!isNaN(subgap))
                {
                    var opts = {
                        in_reply_to_status_id: replyToId,
                        status: `@${screenName} The subgap is currenly at ${subgap.toLocaleString('en')}! #PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`
                    }

                    T.post('statuses/update', opts, function(err, data, response){
                        if(err) console.log(`Something went horribly wrong!: ${err}`)
                        else { console.log(`Tweeted: 'The subgap is currenly at ${subgap.toLocaleString('en')}! \n\n#PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds' in response to: ${screenName}`); previousReplyId = replyToId; replyToId = null; likeTweet(replyToId); likeTweet(data.id_str); };
                    });
                }
                else console.log(`Sorry, we have sent too many requests to the youtube API. Please wait until 2 am CST for the quota to reset.`);
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
        else { console.log(`Deleted tweet with id: ${id_str}`) }
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
    else if(isNaN(subGap()))
    {
        console.log(`Sorry, we have sent too many requests to the youtube API. Please wait until 2 am CST for the quota to reset.`);
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
