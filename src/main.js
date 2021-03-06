//test params ?key=1iTB3A14lnsKiSnCbaJTsFwS_sPEFXvwk5RoLMaRUKbs&colour=culture&page-title=%22TV%20Review%20of%20the%20Year%202015%22
//<figure class="element element-interactive interactive" data-alt="1ATUPYNT-OrwuxZ1uqk6omJmxXqGLKaPo5kupbkk_gQ4"></figure>
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
var getDataAltVariable = require('./js/utils/getDataAltVariable');

var sectionIds = ['A', 'B', 'C', 'D', 'E', 'F','G','H','I','J'];
var sectionTitles = {
    'A': '1-10',
    'B': '11-20',
    'C': '21-30',
    'D': '31-40',
    'E': '41-50',
    'F': '51-60',
    'G': '61-70',
    'H': '71-80',
    'I': '81-90',
    'J': '91-100'
};

var requiredSections;

function boot(el) {

	var app = new Ractive({
		el: el,
		template: require('./html/base.html'),
		data: {
			// entries: require('./data/data.json')
		},
		components: {
			filters: require('./js/filters'),
			filterFeature: require('./js/filterFeature'),
			fixedFilters: require('./js/fixedFilters'),
			subView: require('./js/subView'),
			backToTop:  require('./js/backToTop')
		},
		updateView: function (data) {
			copyData = data.sheets.standfirstAndTitle;
			baseColor = setBaseColor(copyData);		
			dataset = modelData(data.sheets.listEntries);
			requiredSections = Math.ceil(dataset.length/10);
			app.set('entries', dataset);
			app.set('copyEntries', copyData);
			sliceGlobalArrays();
			app.set('sectionIds', sectionIds);
			buildView();
			addListeners();
			
		}
	});

	var key = getDataAltVariable();//'"';
	var url = "https://interactive.guim.co.uk/docsdata/"  + key + ".json";

	var baseLum = 0.075;
	var typeSizeRange;
	var prevDetailRef; // used to store reference to open detail in function setNewRowView

	var pageTitle; //keep it global for social sharing functions

	var scrollShim;

	getJSON(url, app.updateView);

	function sliceGlobalArrays(){
		sectionIds = sectionIds.slice(0, requiredSections);
	}


	function getQueryVariable(variable){

	       var query = window.location.search.substring(1);
	       var vars = query.split("&");

	       for (var i=0;i<vars.length;i++) {
	               var pair = vars[i].split("=");
	               if(pair[0] == variable){return pair[1];}
	       }

	       return (false); 
	}

	function setPageFurniture(a){
        a.forEach(item => {

            if(item.Type === 'PageHeader'){
                  globalTitle = item.Title;
                  document.getElementById("gvPageHead").innerHTML = item.Title;
            }

            if(item.Type === 'Standfirst'){
                  document.getElementById("standfirstHolder").innerHTML = item.Copy;
            }

            if(item.Type === 'GlobalSection'){
                  setColorScheme(setBaseColor(item.Title));
            }

            if(item.Type === 'Section'){
                var s = getSubTitleHTML(item);
                document.getElementById("gvPageSectionHead").innerHTML = s;    
            }

        });

}



function getSubTitleHTML(item){
    return "<a href='"+item.Link+"'>"+item.Title+"</a>";
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

					if (item.Type == "Standfirst"){
						
						document.getElementById("standfirstHolder").innerHTML = item.Copy;
					}
				})
				
				
				
				
	}	

	function setBaseColor(copyData){

		
		var c = "#194377";
				_.each(copyData, function(item,i){
					var v = item.Title;
					
					if(item.Type == "GlobalSection"){
						
						if (v == "culture"){ c = "#951c55"}
						if (v == "comment"){ c = "#c05303"}
						if (v == "multimedia"){ c = "#484848"}
						if (v == "sport"){ c = "#1C4A00"}
					}
				
				})

				return c;
						
	}	


	function returnTextColor(clip){
				var color = (clip.attr("style"));
				color = color.split(";");
				color = color[1];
				color = color.split(":");
				color = color[1];
				return color;

	}



	// function addPageHeader(pageTitle){
	// 		console.log(pageTitle)
	// 		document.getElementById("gvPageHead").innerHTML = "pageTitle";
	// }

	function modelData(rawData){	
					var topPosTemp = 0;

						_.each(rawData, function(item, i){
							item.displaycount = i+1;
							item.rankResize = ((rawData.length + 1 ) - item.number);
							item.bandInfo = getBandInfo(item.number, rawData.length);
							item.numSize = (item.typeSize * 0.75);
							item.imgPath = item.imagePath;
							item.socialTwitter = encodeURIComponent("Guardian review "+item.number+" "+item.title)
							item.detailImgPath = item.imagePath;
							topPosTemp += item.lineH;
							item.positioner = topPosTemp;
							item.imageBoolean = item.imgPath === "";
						})

				//rawData.reverse();
				return rawData;

	}

	function addScrollListener(){
		var el = document.getElementById("fixedFiltersDIV")

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

		
		setColorScheme();

		setPageFurniture(copyData)

	}

	function getBandInfo(a, max){

		var bandNum = getBandNumber(max)

		var n = Math.ceil((a/10));
		var maxN = Math.ceil((max/bandNum));
		var maxSteps = n + 1;
		var typeSizeStep = setTypeSizeStep(maxSteps);
			typeSizeRange = _.range (1, 4.25, 0.25); // (min val, max val, step)
			typeSizeRange.reverse();

		var multiplier = (maxN + 1)-n;	

		return {
			typeSize:(typeSizeRange[n-1]),
			colorBand:ColorLuminance(baseColor, (max-a)*0.025)
		}

	}
	
	function setTypeSizeStep(n){


		if (n > 11){
			return 0.25;
		}
		if (n > 30){
			return 0.1;
		}
		if (n > 50){
			return 0.1;
		}

		

		return 2
	}


	function getBandNumber(max){
		//max=31;
		if (max > 11){
			return 2;
		}
		if (max > 30){
			return 5;
		}
		if (max > 50){
			return 10;
		}
		return 10;
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

		addScrollListener(); 
		addSocialListeners(); 
		addNavListeners();

	}

	

	function addNavListeners(){

		var filterEl = document.getElementsByClassName('js-filter')
		
		 _.each(filterEl, function(item) {
	        	item.addEventListener('click', function(evt) {
	        		var sectionId = item.getAttribute('data-section');

		            evt.preventDefault();
		            scrollTo(document.getElementById("row_" + (sectionId)));
		            console.log(("row_" + (sectionId)));




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
