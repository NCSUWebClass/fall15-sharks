// Wait for document to finish loading DOM content before trying to execute JS on its elements
document.addEventListener('DOMContentLoaded', init);

function init() {
	// generate random teeth from database
	//json = jQuery.getJSON("/getTeeth");
    var json = [
        {"measurement":"1", "lastName":"Doe"}, 
        {"measurement":"2", "lastName":"Smith"}, 
        {"measurement":"3", "lastName":"Jones"},
        {"measurement":"1", "lastName":"Doe"}, 
        {"measurement":"2", "lastName":"Smith"}, 
        {"measurement":"3", "lastName":"Jones"},
        {"measurement":"1", "lastName":"Doe"}, 
        {"measurement":"2", "lastName":"Smith"}, 
        {"measurement":"3", "lastName":"Jones"},
        {"measurement":"1", "lastName":"Doe"}, 
        {"measurement":"2", "lastName":"Smith"}, 
        {"measurement":"3", "lastName":"Jones"},
        {"measurement":"1", "lastName":"Doe"}, 
        {"measurement":"2", "lastName":"Smith"}, 
        {"measurement":"3", "lastName":"Jones"}
    ];
	// generate json string for cookie
	jsonString = JSON.stringify(json);
	// generate expiration
	var d = new Date();
    d.setTime(d.getTime() + (7*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
	document.cookie = "teeth=" + jsonString + ";" + expires;
}
