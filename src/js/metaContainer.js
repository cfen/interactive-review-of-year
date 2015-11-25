var Ractive = require('ractive');

function onrender() {
	console.log('Rendering metaContainer');
}

module.exports = Ractive.extend({
  		isolated: false,
	  	onrender: onrender,
  		template: require('../html/metaContainer.html')
});
