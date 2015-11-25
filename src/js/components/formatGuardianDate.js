

function formatGuardianDate(){
	n = 1;
	if(window.guardian){
		n = window.guardian.config.page.webPublicationDate;
	}

    var n = new Date(n); 
    

    var locale = "en-gb",
    d = n.toLocaleString(locale, { weekday: "long", year: "numeric", month: "long",
        day: "numeric", hour: "numeric", minute: "numeric"});

    d=d.split(",").join("");
    d=d.split(":").join(".");
    d=d+" GMT";
    
    return d;
}


module.exports = formatGuardianDate;



