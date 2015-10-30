var Ractive = require('ractive');

function onrender() {
	console.log('Rendering pageHeader');
}

module.exports = Ractive.extend({
  		isolated: false,
	  	onrender: onrender,
  		template: require('../html/pageHeader.html')
});
