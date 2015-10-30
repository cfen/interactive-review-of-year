//test params ?key=1iTB3A14lnsKiSnCbaJTsFwS_sPEFXvwk5RoLMaRUKbs&colour=culture

/**
* Boot the app.
* @param {object:dom} el - <figure> element on the page. 
*/

var Ractive = require('ractive');
var getJSON = require('./js/utils/getjson');
var _ = require('underscore')

 
function boot(el) {
	var app = new Ractive({
		el: el,
		template: require('./html/base.html'),
		data: {
			entries: require('./data/data.json')
		},
		components: {
			pageHeader: require('./js/pageHeader'),
			filters: require('./js/filters'),
			subView: require('./js/subView')
		},
		updateView: function (data) {
			dataset = modelData(data.sheets.Sheet1);
			app.set('entries', dataset);
			setColorScheme();
			addListeners();
		}
	});

	var key = getQueryVariable("key");//'"';
	var url = "https://interactive.guim.co.uk/docsdata/"  + key + ".json";
	var baseColorSelector = getQueryVariable("colour");
	var baseColor = getBaseColor(baseColorSelector);

	var previousColor = baseColor;
	var baseLum = 0.175;
	var typeSizeRange;


		getJSON(url, app.updateView);

	function getQueryVariable(variable)
			{
			       var query = window.location.search.substring(1);
			       var vars = query.split("&");

			       for (var i=0;i<vars.length;i++) {
			               var pair = vars[i].split("=");
			               if(pair[0] == variable){return pair[1];}
			       }

			       return (false); 
			}

	function returnTextColor(clip){
				var color = (clip.attr("style"));
				color = color.split(";");
				color = color[1];
				color = color.split(":");
				color = color[1];
				return color;

	}

	function getBaseColor(v){

				if (v == "culture"){ return "#951c55"}
				if (v == "comment"){ return "#c05303"}
				if (v == "multimedia"){ return "#484848"}

				else {return "#194377"};

	}

	function setColorScheme(){
				var filterArea = document.getElementById("filterArea").style.background = baseColor;
				var filterAreaBG = document.getElementById("filterAreaBG").style.background = baseColor;
				

				var filterButtonIcon = document.getElementsByClassName("dig-filters__filter__link__circle");
				 _.each(filterButtonIcon, function(item) {
			        	item.style.color = baseColor;
			       });

				//

	}

	function modelData(rawData){	
					var topPosTemp = 0;

						_.each(rawData, function(item, i){
							item.displaycount = i+1;
							item.rankResize = ((rawData.length + 1 ) - item.Rank);
							item.bandInfo = getBandInfo(item.Rank, rawData.length);
							item.numSize = (item.typeSize * 0.75);
							item.imgPath = item["Thumb image URL 500x500px"];
							item.detailImgPath = item["Main Image URL landscape 900 x 506px"];
							topPosTemp += item.lineH;
							item.positioner = topPosTemp;
							item.imageBoolean = item.imgPath === "";
						})

				//rawData.reverse();
				return rawData;

	}


	function getBandInfo(a, max){
		var n = Math.ceil((a/10));
		var maxN = Math.ceil((max/10));
		var maxSteps = n + 1;

		var typeSizeStep = 0.3

			typeSizeRange = _.range (1, maxSteps, 1); // (min val, max val, step)
			typeSizeRange.reverse();

		var multiplier = (maxN+1)-n;	

		return {
			typeSize:(multiplier*typeSizeStep)+1,
			colorBand:ColorLuminance(baseColor, n*baseLum)
		}

	}
	
	
	function ColorLuminance(hex, lum) {
				
				hex = String(hex).replace(/[^0-9a-f]/gi, ''); // validate hex string

				if (hex.length < 6) {
					hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
				}
				lum = lum || 0;
				
				// convert to decimal and change luminosity
				var rgb = "#", c, i;
				for (i = 0; i < 3; i++) {
					c = parseInt(hex.substr(i*2,2), 16);
					c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
					rgb += ("00"+c).substr(c.length);
				}
				return rgb;
			}




	function addListeners(){
		var clickCell = document.getElementsByClassName("entry-main-row");
		 _.each(clickCell, function(item) {
	        	document.getElementById(item.id).addEventListener("click", function() {  rowClick(this.id); });
	       });

	}

	function rowClick(a) { 
	     var b = a.split("_");
	     n = b[1];

	     setNewRowView(n-1);
	}

var prevRef;

	function setNewRowView(n){
		var prevRow = document.getElementById("EntryDetail_"+prevRef);
		
		if(prevRow){
			removeClass(prevRow, 'gv-show-row')
		    addClass(prevRow, 'gv-hide-row')
		}

		var targetRow = document.getElementById("EntryDetail_"+n);
		
		removeClass(targetRow, 'gv-hide-row')
		addClass(targetRow, 'gv-show-row')
		 
		prevRef = n;
	
	}


	function hasClass(el, className) {
		  if (el.classList)
		    return el.classList.contains(className)
		  else
		    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
	}

	function addClass(el, className) {
		  if (el.classList)
		    el.classList.add(className)
		  else if (!hasClass(el, className)) el.className += " " + className
	}

	function removeClass(el, className) {
			  if (el.classList)
			    el.classList.remove(className)
			  else if (hasClass(el, className)) {
			    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
			    el.className=el.className.replace(reg, ' ')
		  }
	}

	 
}

module.exports = { boot: boot };
