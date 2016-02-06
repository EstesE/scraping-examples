var prompt = require('prompt');
var colors = require('colors');

var examples = require('./examples');



console.log('\n\nSelect which test you would like to run:\n'.underline.white.bold);
console.log('-- Test 1: Using request & cheerio');
console.log('-- Test 2: Simple scraping with request & cheerio');
console.log('-- Test 3: Using Nightmare & cheerio\n');


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
        default:
            console.log('Errrrr');
    }
});

function onErr(err) {
    console.log(err);
    return 1;
}