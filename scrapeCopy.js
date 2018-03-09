const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const express = require('express');
const request = require('request');
const SearchQuery = 'iphone 6 16g';
var app = express();
let scrape = async (resolve,reject) => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    const keyboard = page.keyboard;
    await page.goto('https://www.kijiji.ca/');
    // Scrape
       await page.type('#SearchKeyword', SearchQuery);
//   await page.goBack();

    // await page.waitFor(1000);
    // await page.click('#SearchKeyword');

    // await page.keyboard.down('KeyA');
    // await page.keyboard.type('akdslfjsklfjlkfsjdlflsdjfslkf');
    //     await page.screenshot({path: 'kjiji.png'});
    
    await page.click('#MainContainer > div:nth-child(1) > div > header > div.headerContainer-640323838.headerContainer__on-3459900220 > div.searchBarWrapper-3699875736 > form > button');
    await page.waitForSelector('#FesLoaderTop');
    return page.url();
}

    // const result = await page.evaluate(() => {
    //     // return something
    //     let title = document.querySelector('h1').innerText;
    //     let price = document.querySelector('.price_color').innerText
    //     return {title,price};
    // })


    // await page.setViewport({width: 2000, height: 2000})
    //  await page.waitFor(2000);
    
   let count = 0;
//    let childCount = 13;
//   //  #MainContainer > div.layout-3 > div.col-2 > div > div:nth-child(19) > div > div.info > div > div.title > a
// for (let count = 0; count < 20; count++){
//   await page.waitForSelector('#MainContainer > div.layout-3 > div.col-2 > div > div.bottom-bar > div >a:nth-child(' + childCount + ')');
 
//     // this whole evaluate thing is just to query the page using javascript dom tools.
//   const results = await page.evaluate(()=> {
//     const anchors = Array.from(document.querySelectorAll('#MainContainer > div.layout-3 > div.col-2 > div > div'));
                                                        
//     let prices = [];
//     anchors.forEach((element) =>{
//         if (element.getAttributeNames().indexOf('data-vip-url') > -1) {
//             if (element.classList.contains('regular-ad') && !(element.classList.contains('third-party'))) {
//                                                                     //  PRICE       // 
//                 let price = element.children[0].children[1].children[0].children[0].innerHTML.trim().replace('$','');
//                     if (price.indexOf('Contact') === - 1){
//                     prices.push(price);
//                    } 
//             }
//         } 
//     })
//     return prices;
//     // return anchors.length
// });
// await page.click('#MainContainer > div.layout-3 > div.col-2 > div > div.bottom-bar > div > a:nth-child(' + childCount + ')');
//     console.log(results);
//     if ( count === 0){
//         childCount++;

//     }
    
// }
//    console.log(results[6].className);
//console.log(prom.length);

// // 0 - 19 is real ads. 'top ads', 19 - 35 are the ads on the page 
//  for (let i = 20; i < 35; i++){
    // await page.click('#MainContainer > div.layout-3 > div.col-2 > div > div:nth-child(20)') 
    // await page.click('#MainContainer > div.layout-3 > div.col-2 > div > div:nth-child(' + i + ')');
    // const result = await page.evaluate(() => {
        // let price = document.querySelector('#ViewItemPage > div.itemTitleWrapper-2315792072 > div.mainColumn-849890995 > div > div > span > span');
        //  jsonInfo.prices.push(price);
        //  //x   page.goBack();
        // })
        // }
        
        
        //  browser.close();
        
        //    return jsonInfo.prices;
        // Actual Scraping goes Here...
        
        // Return a new_url
        
        let pageNumber = 2;
        const limit = 2;
        let new_url;
        scrape().then((value) => {
            new_url = value;
            console.log('done');
            
            // newSearchQuery = SearchQuery.replace(' ', '-')
            // //while (pageNumber != limit){
                
                //     new_url = (new_url.substring(0,new_url.indexOf(newSearchQuery)+ newSearchQuery.length + 1) + 'page-' + pageNumber
    //     + new_url.substring(new_url.indexOf(newSearchQuery)+ newSearchQuery.length));
        
    //     console.log(new_url); // Success!

    

}).catch((error)=> {
    console.log('error', error);
});



let globalPromises = [];
let findPricesPromise;
let global_prices = [];
function findPrices(err,response,html) {
  
findPricesPromise = new Promise((resolve,reject) => {
    let prices = [];
        if (!err){
            var $ = cheerio.load(html);
            let children = $('#MainContainer > div.layout-3 > div.col-2 > div').children('.regular-ad');

            children.each(function(i, elem){
                let toPrint = $(elem).children('.clearfix').children('.info').children('.info-container').children('.price');
                let price = toPrint.html().trim().replace('$','');
                if (price.indexOf('Contact') === -1 && price.indexOf('Swap') === -1){
                    prices.push(price);
                    
                }
            })
            //     console.log(children);
        }
       
        global_prices.push(prices);
       if (response.statusCode == 200){
           console.log('here in response.status');
           resolve(prices);
           // async_count++;
       }
})
  globalPromises.push(findPricesPromise);
    
    }
    


app.get('/scrape', function(req,res){


    
    const limit = 5;
    let test = request(new_url,findPrices);
  

    newSearchQuery = SearchQuery.replace(' ', '-')
    //console.log(test);
    //page number
    let i = 2;
    new_url = (new_url.substring(0,new_url.indexOf(newSearchQuery)+ newSearchQuery.length + 1) + 'page-' + i
    + new_url.substring(new_url.indexOf(newSearchQuery)+ newSearchQuery.length));
    
    let pricePromise;
    //looping over the differnet pages., adding 1 for the next page 
    for (i = i + 1; i < limit; i++){
        
        (request(new_url,findPrices ));
             
       
        // 6 is the  length of (page-x);

        new_url = (new_url.substring(0,new_url.indexOf(newSearchQuery)+ newSearchQuery.length + 6) + i
        + new_url.substring(new_url.indexOf(newSearchQuery)+ newSearchQuery.length + 7 ));
    }
   
    console.log('global promises:',globalPromises);  
 
       // setTimeout(myFunc, 5000);
    // pricePromise.then((success) => {
    //     console.log('Promise:',success);
    // })
    console.log('now!!',global_prices);

    // setTimeout(myFunc, 5000);
  

})
function myFunc(){
    console.log('\n\n\n\n', global_prices);
    console.log('lol');
}





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

app.use(express.static('public'));

app.listen('8080');
console.log('magic on port 8080');
