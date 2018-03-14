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

app.listen('8080');
console.log('magic on port 8080');
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




 

//app.use(express.static('public'));


