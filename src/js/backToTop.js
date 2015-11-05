var Ractive = require('ractive');

function onrender() {
	console.log('Rendering backToTop');
}

module.exports = Ractive.extend({
  		isolated: false,
	  	onrender: onrender,
  		template: require('../html/backToTop.html')
});
