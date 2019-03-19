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

const dangerZone = 20000;

tweetIt(`The subgap is currently ${subGap()}! #PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);

tweetSubCount();
alertGap();

/**
  * Tweets something out.
  * @param {string} statusText - What you're tweeting.
  */
function tweetIt(statusText)
{
    T.post('statuses/update', { status: statusText }, function(err, data, response) {
        if(err) console.log("Something went horribly wrong!")
        else console.log(`Tweeted: '${statusText}'`);
    });
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
        else if(subgap < 0)
        {
            tweetIt(`🚨🚨ALERT! ALERT!🚨🚨 THE SUBGAP IS NOW NEGATIVE! ${subgap}! EVERYONE SUBSCRIBE TO GET PEWDIEPIE BACK! THIS IS NOT THE END! LETS GET #Sub2Pewds TRENDING! #PewDiePie #TSeries #MemeReview #Subgap`);
        }
    }, 1000*60*15);
}

async function tweetSubCount()
{
    setInterval(function(){
        let subgap = subGap();
        let pewdsCount = getChannelData('pewdiepie').toLocaleString('en');
        let tCount = getChannelData('tseries').toLocaleString('en');

        tweetIt(`PewDiePie currently has ${pewdsCount}. T-Series currently has ${tCount}. The subgap is currenly at ${subgap}. #PewDiePie #TSeries #MemeReview #Subgap #Sub2Pewds`);
    }, 1000*60*60)
}
