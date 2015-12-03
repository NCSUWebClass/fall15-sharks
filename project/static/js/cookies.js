// Wait for document to finish loading DOM content before trying to execute JS on its elements
document.addEventListener('DOMContentLoaded', init);

function init() {
    var jsonString = '';
	// generate random teeth from database
	$.getJSON("/getTeeth", function(data){
        jsonString = JSON.stringify(data);
        var d = new Date();
        d.setTime(d.getTime() + (2*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = "teeth="+jsonString+";"+expires;
    });
}
