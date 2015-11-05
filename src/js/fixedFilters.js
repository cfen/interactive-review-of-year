var Ractive = require('ractive');

function onrender() {
	console.log('Rendering fixedFilters');
}

module.exports = Ractive.extend({
  		isolated: false,
	  	onrender: onrender,
  		template: require('../html/fixedFilters.html')
});
