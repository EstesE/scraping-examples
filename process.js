var cheerio = require('cheerio');

exports.process = function(value, callback) {
	var $ = cheerio.load(value);
    var formerNames = [];
    var similarProperties = [];

    var name = ($('h1').first().text()).replace($('.heading .formerly').text(), '').trim();

    // Get former names.
    $('h1 .formerly').first().each(function(index) {
        var items = $(this).text().split('(');
        for(var j = 0; j < items.length; j++) {
            if(items[j].trim().length > 0) {
                formerNames.push(items[j].replace(')', '').replace('formerly', '').replace('Formerly', '').replace('known as', '').trim());
            }
        }
    });

    // var complexAvg = $('.complexAverage strong').text().trim(); // Old site
    var complexAvg = $('#propertyAverage .score').text();
    // var cityAvg = $('.cityAverage strong').text().trim(); // Old site
    var cityAvg = $('.ARCityWCityScorePieChart .score').text();
    // var numReviews = $('.numReviews strong').text().trim(); // Old site
    var str = $('.viewAllReviews .viewAll').text();
    var numReviews = str.replace(/\D/g, '');
    var currentDate = new Date();

    // // Get similar properties.
    // var similarProperties = [];
    // var simlen = $('.ARCWSimilarCommunities li h4').length;
    // $('.ARCWSimilarCommunities li').each(function(index) {
    //     if(index < simlen/2) {
    //         // var $x = cheerio.load($(this).value());
    //         var $x = cheerio.load($(this)[0]);
    //         var similar = {
    //             name: $x('h4 .complexName').text().trim(),
    //             complexAvg: $x('h4 .number').text().trim(),
    //             address: $x('address').text().trim()
    //         };
    //         similarProperties.push(similar);
    //     }
    // });

    // Build our JSON.
    var json = {
        name: name,
        complexAvg: complexAvg,
        cityAvg: cityAvg,
        numReviews: numReviews,
        lastUpdated: currentDate.getFullYear() + '/' + currentDate.getMonth() + '/' + currentDate.getDate() + ' @ ' + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds()
    };

    // If there are former names add them to the json.
    if(formerNames.length > 0) {
        json.formerNames = formerNames;
    }

    // If there are similar properties add them to the json.
    if(similarProperties.length > 0) {
        json.similarProperties = similarProperties;
    }

    // Display our JSON
 	console.log(JSON.stringify(json, null, 4));

    // return json;
    process.exit();
}