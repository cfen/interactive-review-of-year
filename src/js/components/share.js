
var shareURL = encodeURIComponent('http://gu.com/p/4bft3'); // TODO: short url
var hashTag = '#100ToryDays';

const twitterBaseUrl = 'https://twitter.com/intent/tweet?text=';
const facebookBaseUrl = 'https://www.facebook.com/sharer/sharer.php?ref=responsive&u=';
const googleBaseUrl = 'https://plus.google.com/share?url=';

function share(network, pageTitle, data) {

		var numStr = data.Rank;
		var headStr = data.Heading

	    var twitterMessage = "@guardian "+decodeURIComponent(pageTitle)+" - number "+numStr+" "+headStr;
	    var shareWindow;

	    if (network === 'twitter') {
	        shareWindow = twitterBaseUrl + encodeURIComponent(twitterMessage + ' ') + shareURL + "#row_" +numStr;
	    } else if (network === 'facebook') {
	        shareWindow = facebookBaseUrl + shareURL;
	    } else if (network === 'email') {
	        shareWindow = 'mailto:?subject=' + encodeURIComponent(pageTitle) + '&body=' + shareURL+ "#row_" +numStr;
	    } else if (network === 'google') {
	        shareWindow = googleBaseUrl + shareURL+ "#row_" +numStr;
	    }
	

    window.open(shareWindow, network + 'share', 'width=640,height=320');



    
}




module.exports = share;
