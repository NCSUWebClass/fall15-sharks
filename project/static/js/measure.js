var count = 0;

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
	});
	
