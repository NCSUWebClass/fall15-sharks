var count = 0;
var maxCount = 1;
var measurements = [];

function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
            }
            return "";
        };
		var teethStr = getCookie("teeth");
		console.log(teethStr);
		var teethArray = JSON.parse(teethStr);

$(function() {
		$(".tooth").draggable();
		$(".measure").droppable({
			drop: function(event, ui) {
				$(this)
				.addClass("ui-state-highlight");
				
			}
		});
		$("img").hide();
		$("#tooth" + count).show();
		
		$("#measureButton").click(function(){
			measurements.push($("#selectSize").val());
			console.log(measurements);
			$("#tooth" + count).hide();
			count++;
			if (count > maxCount){
				//go to stats page
			} else {
				$("#tooth" + count).show();
			}
		});
		
		
	});
	
function createMeasurementCookie() {
    jsonString = JSON.stringify(measurement);
    var d = new Date();
    d.setTime(d.getTime() + (2*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = "mesurements="+jsonString+";"+expires;
}
