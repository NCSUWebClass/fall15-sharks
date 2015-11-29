// Wait for document to finish loading DOM content before trying to execute JS on its elements
document.addEventListener('DOMContentLoaded', init);

function init() {
	// generate random teeth from database
	json = jQuery.getJSON("/getTeeth");
	// generate json string for cookie
	jsonString = JSON.stringify(json);
	// generate expiration
	var d = new Date();
    d.setTime(d.getTime() + (7*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
	document.cookie = "teeth=" + jsonString + ";" + expires;
}
