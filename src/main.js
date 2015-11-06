//test params ?key=1iTB3A14lnsKiSnCbaJTsFwS_sPEFXvwk5RoLMaRUKbs&colour=culture&page-title=%22TV%20Review%20of%20the%20Year%202015%22

/**
* Boot the app.
* @param {object:dom} el - <figure> element on the page. 
*/

var Ractive = require('ractive');
var getJSON = require('./js/utils/getjson');
var _ = require('underscore')
var share  = require('./js/components/share');
var scrollTo  = require('./js/utils/scroll-to');
var detect = require('./js/utils/detect');
var iframeMessenger = require('./js/utils/iframeMessenger');

 
function boot(el) {
	var app = new Ractive({
		el: el,
		template: require('./html/base.html'),
		data: {
			// entries: require('./data/data.json')
		},
		components: {
			pageHeader: require('./js/pageHeader'),
			filters: require('./js/filters'),
			filterFeature: require('./js/filterFeature'),
			fixedFilters: require('./js/fixedFilters'),
			subView: require('./js/subView'),
			backToTop:  require('./js/backToTop')
		},
		updateView: function (data) {
			dataset = modelData(data.sheets.Sheet1);
			copyData = data.sheets.SheetCopy;
			app.set('entries', dataset);
			app.set('copyEntries', copyData);
			buildView();
			addListeners();
			iframeMessenger.enableAutoResize();
		}
	});

	var key = getQueryVariable("key");//'"';
	var url = "https://interactive.guim.co.uk/docsdata/"  + key + ".json";
	var baseColor = getBaseColor();

	var previousColor = baseColor;
	var baseLum = 0.075;
	var typeSizeRange;
	var prevDetailRef; // used to store reference to open detail in function setNewRowView

	var pageTitle; //keep it global for social sharing functions

	var scrollShim;


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

	function getBaseColor(){

				_.each(copyData, function(item,i){
					if (item.Type == "Section"){
						if (item.Type == "culture"){ return "#951c55"}
						if (item.Type == "comment"){ return "#c05303"}
						if (item.Type == "multimedia"){ return "#484848"}
						if (item.Type == "sport"){ return "#1C4A00"}
					}
				})

				

				return "#194377";

	}

	function setColorScheme(){
				document.getElementById("filterArea").style.background = baseColor;
				document.getElementById("filterAreaBG").style.background = baseColor;
				document.getElementById("fixedFilters").style.background = baseColor;
				document.getElementById("fixedFiltersBG").style.background = baseColor;
				document.getElementById("featureAreaBG").style.background = ColorLuminance(baseColor, baseLum);
				document.getElementById("featureArea").style.background = ColorLuminance(baseColor, baseLum);

				var filterButtonIcon = document.getElementsByClassName("dig-filters__filter__link__circle");
				 _.each(filterButtonIcon, function(item) {
			        	item.style.color = baseColor;
			       });
	}

	function setBaseCopy(){
				
				_.each(copyData, function(item,i){
					if (item.Type == "PageHeader"){
						pageTitle = String(item.Title);
						document.getElementById("gvPageHead").innerHTML = pageTitle;
					}
				})
				

				
				
	}	

	// function addPageHeader(pageTitle){
	// 		console.log(pageTitle)
	// 		document.getElementById("gvPageHead").innerHTML = "pageTitle";
	// }

	function modelData(rawData){	
					var topPosTemp = 0;

						_.each(rawData, function(item, i){
							item.displaycount = i+1;
							item.rankResize = ((rawData.length + 1 ) - item.Rank);
							item.bandInfo = getBandInfo(item.Rank, rawData.length);
							item.numSize = (item.typeSize * 0.75);
							item.imgPath = item["Thumb image URL 500x500px"];
							item.socialTwitter = encodeURIComponent("Guardian review "+item.Rank+" "+item.Heading)
							item.detailImgPath = item["Main Image URL landscape 900 x 506px"];
							topPosTemp += item.lineH;
							item.positioner = topPosTemp;
							item.imageBoolean = item.imgPath === "";
						})

				//rawData.reverse();
				return rawData;

	}

	function addScrollListener(){
		var el = document.getElementById("fixedFiltersDIV")


		console.log()
		//console.log(el.scrollTop)
		// var el = .style.display = 'none';

		
		window.onscroll=function(){ checkElScroll(el) };
	}

	function checkElScroll(el)
	{
		
	    var docViewTop = document.body.scrollTop;
	    var docViewBottom = docViewTop + window.height;
	    var backTop = document.getElementById("backToTop");

	       	if(isElementVisible(document.getElementById("featureAreaBG")))
	    	{
	    		hideElement(el);
	    		
	    		//unfixElement(backTop);
	    	}else{
	    		
	    		showElement(el);
	    		
	    	}

	    	if(isElementVisible(document.getElementById("filterArea"))){
				hideElement(backTop);
	    	}else{
				fixElement(backTop);
				showElement(backTop);
	    	}

	    
	}

	function hideElement(el){
		 el.classList.remove("showing");
		 el.classList.add("hiding");

		}

	function showElement(el){
		 el.classList.remove("hiding");
		 el.classList.add("showing");
		}

	function fixElement(el){
		 var fixPos = document.getElementById("fixedFilters").offsetHeight;	
		 el.classList.remove("dig-slice_relative");
		 el.classList.add("dig-slice_fixed");
		 el.style.top = fixPos+'px';
		}

	function unfixElement(el)
		{
		 el.classList.remove("dig-slice_fixed");
		 el.classList.add("dig-slice_relative");
		}	

	function isElementVisible(el) {
    	var rect = el.getBoundingClientRect(),
        vWidth = window.innerWidth || doc.documentElement.clientWidth,
        vHeight = window.innerHeight || doc.documentElement.clientHeight,
        efp = function (x, y) { return document.elementFromPoint(x, y) };     

        return(rect.height * -1 < rect.top)

		    // // Return false if it's not in the viewport
		    // if (rect.right < 0 || rect.bottom < 0 
		    //         || rect.left > vWidth || rect.top > vHeight)
		    //     return false;

		    // // Return true if any of its four corners are visible
		    // return (
		    //       el.contains(efp(rect.left,  rect.top))
		    //   ||  el.contains(efp(rect.right, rect.top))
		    //   ||  el.contains(efp(rect.right, rect.bottom))
		    //   ||  el.contains(efp(rect.left,  rect.bottom))
		    // );
	}


	function buildView(){
		setBaseCopy();
		setColorScheme();

		console.log( detect.isAndroid() );

	}

	function getBandInfo(a, max){
		var n = Math.ceil((a/10));
		var maxN = Math.ceil((max/10));
		var maxSteps = n + 1;

		var typeSizeStep = 0.25

			typeSizeRange = _.range (1, maxSteps/2, 0.5); // (min val, max val, step)
			typeSizeRange.reverse();

		var multiplier = (maxN + 1)-n;	




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
	        	document.getElementById(item.id).addEventListener("click", function(evt) {  
	        		rowClick(this.id); 
	        		evt.preventDefault();

	        		var i = this.id;
	        		var a = i.split("_")
	        		var n = (Math.floor(a[1]-1));
		            evt.preventDefault();
		            scrollTo(document.getElementById("row_" + n));
		            //scrollTo(document.getElementById(this.id));

	        	});
	       });

		addScrollListener(); -2
		addSocialListeners(); 
		addNavListeners();

	}

	

	function addNavListeners(){

		var filterEl = document.getElementsByClassName('js-filter')
		
		 _.each(filterEl, function(item) {
	        	item.addEventListener('click', function(evt) {
	        		var sectionId = item.getAttribute('data-section');
		            evt.preventDefault();
		            scrollTo(document.getElementById("row_" + (sectionId-2)));
		        });
	       });

		 var backTopBtns = document.getElementsByClassName('backToTop');

		 _.each(backTopBtns, function(backTopBtn){
					backTopBtn.addEventListener('click', function(evt){
						evt.preventDefault();
						scrollTo(document.getElementById("pageTop"));
		 		}
		 	)
		


		}) 
		
	}

	function addSocialListeners(){
		var socialDetail = document.getElementsByClassName("js-share-detail");

		_.each(socialDetail, function(item) {
	        	document.getElementById(item.id).addEventListener("click", function() {  socialDetailClick(this); });
	       }); 
	}

	function socialDetailClick(shareEl) { 
		 var a = shareEl.id;
		 var network = shareEl.getAttribute('data-network');

	     var b = a.split("_");
	     n = b[1];
	     share(network, pageTitle, dataset[n]);
	}

	function rowClick(a) { 
	     var b = a.split("_");
	     n = b[1];

	     setNewRowView(n-1);
	}

	function setNewRowView(n){
		var prevRow = document.getElementById("EntryDetail_"+prevDetailRef);
		
		if(prevRow){
			removeClass(prevRow, 'gv-show-row')
		    addClass(prevRow, 'gv-hide-row')
		}

		var targetRow = document.getElementById("EntryDetail_"+n);
		
		removeClass(targetRow, 'gv-hide-row')
		addClass(targetRow, 'gv-show-row')
		 
		prevDetailRef = n;
	
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
