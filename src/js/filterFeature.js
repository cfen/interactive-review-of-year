var Ractive = require('ractive');

function onrender() {
	console.log('Rendering pageFilterfeature');
}

module.exports = Ractive.extend({
  		isolated: false,
	  	onrender: onrender,
  		template: require('../html/filterFeature.html')
});
