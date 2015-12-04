$(function() {
		$(".tooth").draggable();
		$(".measure").droppable({
			drop: function(event, ui) {
				$(this)
				.addClass("ui-state-highlight");
				
			}
		});
	});