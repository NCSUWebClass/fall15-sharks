var count = 0;
var maxCount = 1;
var measurements = [];

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
	
