var csvModule = require("read-csv-json")
const axios = require('axios');

if (process.argv.length === 2) {
    console.error('key is not present.!');
    process.exit(1);
}
if (process.argv[2] && process.argv[2] === '-key') {
    
} else {
console.log('key is not present.');
process.exit(1);
}
const apiKey = process.argv[3];

var domains = [
    'http://akimboclub.com/',
    'http://www.skysper.com',
    'http://myprorenal.com',
    'http://shop.crumbtheband.com',
    'http://www.woodchuckusa.com',
    'http://store.mirandalambert.com',
    'http://heatheredboho.com',
    'http://nashvillepack.com',
]

function makeHttpRequest(url) {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => {
                resolve(response.data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function callPageSpeed(url, strategy) {
    var pageSpeedUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=' + url + '&key=' + apiKey + '&strategy=' + strategy + '&category=accessibility&category=performance&category=pwa&category=best-practices&category=seo';
    return makeHttpRequest(pageSpeedUrl);
}

async function fetchPageSpeedForDomain(domain) {
    await Promise.all([
        callPageSpeed(domain, 'desktop'),
        callPageSpeed(domain, 'mobile'),
    ])
    .then(([desktop, mobile]) => {
        //console.log("Results for ", domain)
        //console.log('Response from desktop:', desktop.lighthouseResult.categories.performance.score * 100);
        //console.log('Response from mobile:', mobile.lighthouseResult.categories.performance.score * 100);
        // Your logic to handle both responses
        var response=[
            //Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd HH:mm:ss'),
            domain,
            desktop.lighthouseResult.categories.performance.score * 100,
            desktop.lighthouseResult.categories.accessibility.score * 100,
            desktop.lighthouseResult.categories.seo.score * 100,
            desktop.lighthouseResult.categories['best-practices']['score']*100,
            desktop.lighthouseResult.categories.pwa.score * 100,
            //desktop.lighthouseResult.audits['server-response-time']['numericValue'] / 1000,
            desktop.lighthouseResult.audits['interactive']['numericValue'] / 1000,
            desktop.lighthouseResult.audits['speed-index']['numericValue'] / 1000,
            //desktop.lighthouseResult.audits['speed-index']['score'] * 100,
            desktop.lighthouseResult.audits['first-contentful-paint']['numericValue'] / 1000,
            
            desktop.lighthouseResult.audits['largest-contentful-paint']['numericValue'] / 1000,
            desktop.lighthouseResult.audits['cumulative-layout-shift']['score'] * 100,
            desktop.lighthouseResult.audits['total-blocking-time']['numericValue']/1000,
            //desktop.lighthouseResult.audits['max-potential-fid']['numericValue'],
            //desktop.lighthouseResult.audits['first-meaningful-paint']['numericValue'] / 1000,
            mobile.lighthouseResult.categories.performance.score * 100,
            mobile.lighthouseResult.categories.accessibility.score * 100,       
            mobile.lighthouseResult.categories.seo.score * 100,       
            mobile.lighthouseResult.categories['best-practices']['score']*100,       
            mobile.lighthouseResult.categories.pwa.score * 100,       
            //mobile.lighthouseResult.audits['server-response-time']['numericValue'] / 1000,
            mobile.lighthouseResult.audits['interactive']['numericValue'] / 1000,
            mobile.lighthouseResult.audits['speed-index']['numericValue'] / 1000,
            //mobile.lighthouseResult.audits['speed-index']['score'] * 100,
            mobile.lighthouseResult.audits['first-contentful-paint']['numericValue'] / 1000,
           
            mobile.lighthouseResult.audits['largest-contentful-paint']['numericValue'] / 1000,
            mobile.lighthouseResult.audits['cumulative-layout-shift']['score'] * 100,      
            mobile.lighthouseResult.audits['total-blocking-time']['numericValue']/1000,
            //mobile.lighthouseResult.audits['max-potential-fid']['numericValue'],
            // mobile.lighthouseResult.audits['first-meaningful-paint']['numericValue'] / 1000
         ]
         console.log(response.join(","));
    })
    .catch(error => {
        console.error('Error:', error.message);
    });
}
async function processDomains(domains){
    for (var index=0;index<domains.length;index++){
        await fetchPageSpeedForDomain(domains[index].url);
    }
}
var _filePath = './input.csv';
var fieldsName = ['url'];

var csvRead = new csvModule(_filePath, fieldsName);

csvRead.getCSVJson().then(function(result){
    processDomains(result);
},function(err){
  console.log('err: ', err)
});
//