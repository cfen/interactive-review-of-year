var shareURL = setShortURL();// TODO: short url
var hashTag = '#GuardianReviewOfTheYear';

const twitterBaseUrl = 'https://twitter.com/intent/tweet?text=';
const facebookBaseUrl = 'https://www.facebook.com/sharer/sharer.php?ref=responsive&u=';
const googleBaseUrl = 'https://plus.google.com/share?url=';

function setShortURL(){
	var v = encodeURIComponent('http://gu.com'); 
	if(window.guardian){
		v = encodeURIComponent(window.guardian.config.page.shortUrl)
	}
	return v;
}

function globalShare(network, pageTitle) {

	var twitterMessage = decodeURIComponent(pageTitle)+" @guardian ";
	    var shareWindow;

	    if (network === 'twitter') {
	        shareWindow = twitterBaseUrl + encodeURIComponent(twitterMessage + ' ') + shareURL;
	    } else if (network === 'facebook') {
	        shareWindow = facebookBaseUrl + shareURL;
	    } else if (network === 'email') {
	        shareWindow = 'mailto:?subject=' + encodeURIComponent(pageTitle) + '&body=' + shareURL;
	    } else if (network === 'google') {
	        shareWindow = googleBaseUrl + shareURL;
	    }
	
	//console.log(data)
    window.open(shareWindow, network + 'share', 'width=640,height=320');
  
}




module.exports = globalShare;
