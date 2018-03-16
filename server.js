const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const express = require('express');
const request = require('request');
const rp = require('request-promise');
const fs = require('fs');
const https = require('https');


const bodyParser = require('body-parser');
const path = require('path');



var app = express();

app.listen((process.env.PORT || 8080));
console.log('magic on port 8080 or you know, something else');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// const path = require('path');





        // Return a new_url
        
    


   

    const router = express.Router();

    router.use(function(req, res, next) {
        // // res.header("Access-Control-Allow-Methods", "PUT")
            res.header('Access-Control-Allow-Origin', '*');
        res.header('Content-type', 'application/json');
        // // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            // res.json({message: 'write worked'});
        next(); // make sure we go to the next routes and don't stop here
    });
    
    app.use('/', router);        




router.post('/scrape', function(req,res){

  
    let jsonToSend = {};

    // get the user search  query from the AJAX request;
    const SearchQuery = req.body.search.toLocaleLowerCase().trim();
    
    // filthy hack... this is basically due to me flailing around with string.indexOf
    // I'm pretty sure its related to how kijiji processes spaces as dashes



    console.log(SearchQuery);
    let newSearchQuery = SearchQuery.replace(/ /g, '-');    
    console.log(newSearchQuery);
    


    //launching a third party app to scrape data.
    // literally opens a chrome tab and google searches for the correct kijiji location;
    let scrape = async (resolve,reject) => {
        
        const browser = await puppeteer.launch({args: ['--no-sandbox','--process-per-site', '--disable-setuid-sandbox']});
        const page = await browser.newPage();
        const keyboard = page.keyboard;
        
        let location = req.body.location
        let locationString = 'kijiji ' + location;

        await page.goto('https://www.google.com/');
        // Scrape
        await keyboard.type(locationString);


        //im feeling lucky button
        await page.focus('#tsf > div.tsf-p > div.jsb > center > input[type="submit"]:nth-child(2)');
        await page.click('#tsf > div.tsf-p > div.jsb > center > input[type="submit"]:nth-child(2)');

        let options = {waitUntil:"networkidle0" }
        await page.waitForNavigation(options);
        
        // if its not a kijiji url reject
        if (page.url().indexOf('kijiji') == -1){
            reject(page.url())
        } 
        
    //     page.once('load', () => {
            
    //         console.log('Page loaded!')
    //          page.type('#SearchKeyword', SearchQuery);
    
    // });
    waitForNavigation(options);
    //search bar on kijiji
    await page.waitForSelector('#SearchKeyword');
    await page.waitFor(1000);
      await page.type('#SearchKeyword', SearchQuery);

         
      

      //search button
      // await page.click('#MainContainer > div:nth-child(1) > div > header > div.headerContainer-640323838.headerContainer__on-3459900220 > div.searchBarWrapper-3699875736 > form > button');
      await keyboard.press('Enter');
      await page.waitFor(500);
      //waiting for load
     try{ await page.waitForSelector('#FesLoaderTop');
    }
    catch(err){
        console.log(err);
    }
      //await page.waitForNavigation();
      // await page.waitForNavigation({waitUntil : 'load'});
      // await page.waitForFunction('document.readyState == "complete"');
      let pageURL = page.url();
      //console.log(pageURL);
      //   await page.waitForSelector('#SearchKeyword')

        
        browser.close();
        return pageURL;
    }

    scrape().then((value) => {
        let new_url;
        new_url = value;
        console.log('done');

        
    

 let  limit = 100;
 let options = {
    uri: new_url,
    transform: function (body) {
        return cheerio.load(body);
    }
};

rp(options)
    .then(function ($) {
        
        let fullString = $('.showing').html();
        // no results for query

        if (fullString === null){
            res.status(500).json({error: 'NO RESULTS FOR QUERY'});
        }
        // no idea why i put 3 here

        let numberIndex = fullString.indexOf('of') + 3;
        let numberIndexEnd = fullString.indexOf('Ads')  
        let numberString = fullString.substring(numberIndex,numberIndexEnd).replace(',','');

        
        console.log(numberString);
        
        let pageNumbers = parseInt(numberString) / 20;
        if (pageNumbers < 100){
            limit = Math.floor(pageNumbers);
        }

        //console.log(limit);
    
 promisesList = [];
 promisesList.push(getPrices(new_url ))
    
   
// console.log ('first url',new_url);
    let latterURL = new_url.substring(new_url.indexOf(newSearchQuery)+ newSearchQuery.length);
//console.log(latterURL);

    let i = 2 ;   
    //  console.log(new_url);
    //     console.log('whitespace'+searchQueryFirst + 'whitespace');
    //  console.log('new searchuery:',new_url.indexOf(searchQueryFirst));
      new_url = (new_url.substring(0,new_url.indexOf(newSearchQuery)+ newSearchQuery.length + 1) + 'page-' + i
     + latterURL);
    
        //limit = 3;
 for (i = i + 1; i < limit + 1; i++){
     //console.log(new_url);
      promisesList.push(getPrices(new_url));
//         // 6 is the  length of (/page-);
    
   let pageDigitCount = Math.floor(Math.log10(i)) + 1;

    new_url = (new_url.substring(0,new_url.indexOf(newSearchQuery)+ newSearchQuery.length + 6) + i
    + latterURL)
//     console.log('newer url: ',new_url);
    
     }

     Promise.all(promisesList).then((values) => {
         let allPricesRaw =[].concat.apply([],values);

        let allPrices = allPricesRaw.map(x => {
            let newPrice = x.replace(',','');
            // console.log("new: %s old %s",newPrice,x);
            return (Math.ceil(parseFloat(newPrice)));

        })
      

         let sum = allPrices.reduce((a,b) => {
 
            return  (a + b);
            }, 0);
        //    let sortedPrices = allPrices.sort;
         let sortedPrices =allPrices.sort(function(a,b){return a - b});
            let dataLen = allPrices.length;
            let medianVar ;
                
                let index = Math.floor(dataLen / 2);
                console.log('median index', index);
                medianVar =  sortedPrices[index];
          
            console.log('median is ' , medianVar);
            console.log('average out of ', dataLen);
            console.log(SearchQuery);
          
            let averageVar = sum / allPrices.length;
            console.log('average', averageVar );



            jsonToSend.average = averageVar;
            jsonToSend.median = medianVar;
            jsonToSend.adAmount = dataLen;
            jsonToSend.pricesList = sortedPrices;
            jsonToSend.allPrices = allPricesRaw;
            res.json(jsonToSend);
        }).catch(err => console.log(err));






}).catch((error)=> {
console.log('error', error);
});


//   parsePrices();
// for testing
    
    }).catch((err)=>{
        console.log('ERROR WITH URL', err);
    })
})


// i is index
function getPrices(url_var){
    
    let pricesPromise = new Promise((resolve,reject) =>{
    let options = {
        uri: url_var,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    
    rp(options)
        .then(function ($) {

            let prices = [];
            let children = $('#MainContainer > div.layout-3 > div.col-2 > div').children('.regular-ad');



        

            children.each(function(i, elem) {
                let toPrint = $(elem).children('.clearfix').children('.info').children('.info-container').children('.price');
                let price = toPrint.html().trim().replace('$','');
                if (price.indexOf('Contact') === -1 && price.indexOf('Swap') === -1 && price.indexOf('Free') === -1){
                    prices.push(price);
                   

                    //mabye push other things later
          //          obj.prices.push(price);
                }
            })
          //  let json = {prices : prices};
           
        resolve(prices);
          
    
            
     
            // Process html like you would with jQuery...
        })
        .catch(function (err) {
            // Crawling failed or Cheerio choked...
            console.log('ehre where error' ,err);
        });
    })
    return pricesPromise;
    }
    




 

//app.use(express.static('public'));


