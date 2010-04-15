$(document).ready(function() {
	$seesaw = $('#seesaw');
	$leftbox = $("#left");
	$rightbox = $("#right");
	$angle = 5;
	$radius = 180;
	offset = 40;
	$chord = chordlength($radius, $angle);
	$high = $chord + offset;
	$low = - $high + offset;
	$('#seesaw').toggle(function() { see(); }, function() { saw(); });
	
	$("#right textarea").focus(function() {
		see();
	});
	$("#left textarea").focus(function() {
		saw();
	});
	$(document).keydown(function (event) {
		if ($(event.target).hasClass("weight"))
			return;
		switch (event.keyCode) {
			case 37: // left
				saw();
				break;	
			case 38:
				break;	
			case 39:
				see();
				break;	
			case 40:
				break;
		}
	});
	
	$converter = $("#converter");
	$input = $("#converter textarea");
	$input_select = $("#input_format");
	$output_select = $("#output_format");
	$input_text = $("#input_text");
	$output_text = $("#output_text");

	$converter.ajaxForm({
		beforeSubmit: function(arr, $form, options) {
			
		},
		success: function(responseText, statusText, xhr, $form) {
			$output_text.val(responseText.toString());
			$output_text.animate({opacity:1}, 300);
		},
		error: function(responseText, statusText, xhr, $form) {
			
		}
	});
	
	$(".control a").click(function() {
		return false;
	})
});

function see() {
	$seesaw.see(5);
	$leftbox.stop().animate({top:$low});
	$output_text.stop().animate({opacity:0}, 500);
	$rightbox.stop().animate({top:$high}, 500, function() { convert(); });
}

function saw() {
	$seesaw.saw(5);
	$leftbox.stop().animate({top:$high});
	$output_text.stop().animate({opacity:1}, 500);
	$rightbox.stop().animate({top:$low}, 500, function() { convert(); });
}

function convert() {
	$input_select.val("textile");
	$output_select.val("html");
	$input.val($input_text.val());
	$converter.submit();
}

function chordlength(r, angle) {
	return r + r * Math.sin(angle);
}