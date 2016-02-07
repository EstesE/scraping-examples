var prompt = require('prompt');
var colors = require('colors');
// var Nightmare = require('nightmare');
var http = require('http');
// var Promise = require('q');
// var fs = require('fs');
// var cheerio = require('cheerio');
var Promise = require('q');

var examples = require('./examples');



console.log('\n\nSelect which test you would like to run:\n'.underline.white.bold);
console.log('-- Test 1: Using request & cheerio');
console.log('-- Test 2: Simple scraping with request & cheerio');
console.log('-- Test 3: Using Nightmare & cheerio, scrape content off of an Angular site');
console.log('-- Test 4: Take screenshots as you programmatically interact with website\n');


prompt.start();

prompt.get(['test'], function (err, result) {
if (err) { return onErr(err); }
    
    
    switch (result.test) {
        case '1':
            examples.first();
            break;
        case '2':
            examples.second();
            break;
        case '3':
            examples.third();
            break;
        case '4':
            examples.fourth();
            break;
        default:
            console.log('\nExiting\n');
    }

});

function onErr(err) {
    console.log(err);
    return 1;
}