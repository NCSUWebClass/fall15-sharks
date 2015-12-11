var count = 0;
var maxCount = 14;
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


$(function() {
	var teethStr = getCookie("teeth");
	console.log(teethStr);
	var teethArray = JSON.parse(teethStr);
	for (var i = 0; i < teethArray.length; i++) {
		var fileName = teethArray[i].imgfilename;
		var img = $('<img class="tooth" id="tooth' + i + '" src="../static/img/ProcessedTeethPics/' + fileName + '"></img>');
		img.attr("width", teethArray[i].measurement*8);
		img.attr("height", teethArray[i].measurement*8)
		$("#toothContainer").prepend(img);
		if (i != 0){
			$('#tooth' + i).hide();
		}
	}
	$(".tooth").draggable();

	$(".measure").droppable({
		drop: function(event, ui) {
			$(this)
			.addClass("ui-state-highlight");

		}
	});
	
	$("#measureButton").click(function(){
		var value = $("#selectSize").val();
		if (value == teethArray[count].measurement){
			$("#tooth" + count).hide();
			count++;
			if (count > maxCount){
				window.location.href = "/stats";
			} else {
				$("#tooth" + count).show();
			}
		} else {
			alert("Error: Incorrect Measurement");
		}

	});


});