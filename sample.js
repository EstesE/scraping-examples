var async = require('async');
var Nightmare = require('nightmare');
var cheerio = require('cheerio');
var vo = require('vo');


var urls = [{
	'url':'http://www.apartmentratings.com/nv/tonopah/sierra-vista-apartments_775482536889049/'
}, {
	'url':'http://www.apartmentratings.com/nv/tonopah/tonopah-apartments_775482938689049/'
}, {
	'url':'http://www.apartmentratings.com/nv/tonopah/belmont-apartments_9199332346275156323/'	
}, {
	'url': 'http://www.apartmentratings.com/nv/tonopah/desert-apartments_775482307789049/'
}, {
	'url': 'http://www.apartmentratings.com/fl/tallahassee/the-oasis-at-1800-formerly-banyan-bay-apartments_850671111732308/'
}, {
	'url': 'http://www.apartmentratings.com/fl/tallahassee/parkway-square-formerly-palms-of-apalachee_850877976232301/'
}, {
	'url': 'http://www.apartmentratings.com/fl/palm-bay/the-pavilions-at-monterey-formerly-landings-at-palm-bay-sunpointe-bay_407676134132905/'
}, {
	'url': 'http://www.apartmentratings.com/fl/orlando/pendelton-park-villas_407273714132822/'
}, {
	'url': 'http://www.apartmentratings.com/ak/anchorage/greenbriar-apartments_907333962499508/'
}, {
	'url': 'http://www.apartmentratings.com/hi/ewa-beach/kapilina-apartments-formerly-the-waterfront-at-puuloa_808441999996706/'
}, {
	'url': 'http://www.apartmentratings.com/la/baton-rouge/bristol-place-apartments_225448513270809/'
}, {
	'url': 'http://www.apartmentratings.com/id/boise/edgewater-formerly-landing-at-lakeharbor_208853525383703/'
}];



// var count = 0;


// var q = async.queue(function (task, callback) {

// 	vo(run)(function(err, results) {
// 		if(err) throw err;
// 	});

// 	function *run() {
	
// 		var x = Date.now();
// 		var nightmare = Nightmare();
// 		Promise.resolve(nightmare
// 			// .goto('http://www.apartmentratings.com/fl/tallahassee/studio-green-formerly-seminole-oaks-private-residence-hall-formerly-college-park-cash-hall_850222067432304/')
// 			// .goto('http://www.apartmentratings.com/nc/charlotte/davis-commons_704599290828269/')
// 			.goto(task)
// 			.evaluate(function() {
// 			return document.getElementsByTagName('html')[0].innerHTML;
// 		})).then(function(html) {
// 			count++;
// 			console.log("\nFinished in " + (Date.now()-x) + "ms");
// 			// process.process(html);

// 			var $ = cheerio.load(html);
// 			var name = ($('h1').first().text()).replace($('.heading .formerly').text(), '').trim();
			
// 			return name;
// 		}).then(function(result) {
// 			console.log('RESULT: ', result);
// 			// nightmare.end();
// 			// if(count === urls.length) {
// 			// 	console.log('exiting');
				
// 			// 	// process.exit();
// 			// 	return;
// 			// }
// 			nightmare.end();
// 			callback();
// 		}, function(err) {
// 			console.error(err);
// 		});
// 	}
// // callback();
// }, 1);


// // assign a callback
// q.drain = function() {
//     console.log('All items have been added to the queue');
// }


// urls.forEach(function(item) {
// 	q.push(item.url, function(err) {
// 		console.log('Added ' + item.url + ' to the queue');
// 	});
// });








async.eachSeries(urls, function iteratee(item, callback) {

	vo(function* () {
	  var nightmare = Nightmare({ show: true });
	  var link = yield nightmare
	    .goto(item.url)
	    .wait(2000)
	    .evaluate(function () {
	      return document.getElementsByTagName('html')[0].innerHTML;
	    });
	  yield nightmare.end();
	  return link;
	})(function (err, result) {
	  	if (err) return console.log(err);
	  

	  	var formerNames = [];
	  	var $ = cheerio.load(result);
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
	    var complexAvg = $('.complexAverage strong').text().trim();
	    var cityAvg = $('.cityAverage strong').text().trim();
	    var numReviews = $('.numReviews strong').text().trim();
	    var currentDate = new Date();
	    // Get similar properties.
	    var similarProperties = [];
	    var simlen = $('.ARCWSimilarCommunities li h4').length;
	    $('.ARCWSimilarCommunities li').each(function(index) {
	        if(index < simlen/2) {
	            // var $x = cheerio.load($(this).value());
	            var $x = cheerio.load($(this)[0]);
	            var similar = {
	                name: $x('h4 .complexName').text().trim(),
	                complexAvg: $x('h4 .number').text().trim(),
	                address: $x('address').text().trim()
	            };
	            similarProperties.push(similar);
	        }
	    });
	    var reviews = [];
	    var revs = $('#mainReviewList div.review');
	    for(var i = 0; i < revs.length; i++) {
	    	if(i == 3) break;
	    	var $y = cheerio.load(revs[i]);
	    	var mydate = $y('.reviewDate').text();
	    	var rate = $y('.reviewRating').attr('class');
	    	var myreview = $y('p').text().trim();
	    	var newreview = {
	    		date: mydate,
	    		review: myreview.replace('Full Review ▶', ''),
	    		rating: rate.replace('reviewRating', '').replace('sprite', '').replace('smallGreenStarRating', '').trim()
	    	}
	    	reviews.push(newreview);
	    }

	    var labels = $('.summaryStats label').text().split(':');
	    var ratings = [];
	    var x = $('.summaryStats span').find('div');
	    if(x.length >= 0 && labels.length > 0) {
		    x.each(function(i, val) {
		    	var r = {
		    		// rating: $(val).attr('class'),
		    		rating: $(val).attr('class').toString().replace('sprite','').replace('greenStarRating', '').trim(),
		    		label: labels[i]
		    	};

		    	ratings.push(r);
		    });
		}

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

	    // If there are reviews, add them to the json.
	    if(reviews.length > 0) {
	    	json.propReviews = reviews;
	    }

	    if(ratings.length > 0) {
	    	json.ratings = ratings;
	    }

	    console.log(JSON.stringify(json, null, 4));
		

		callback();
	});

});