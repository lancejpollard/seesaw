$(document).ready(function() {
	$seesaw = $('#seesaw');
	$leftbox = $("#left");
	$rightbox = $("#right");
	$angle = 5;
	$radius = 180;
	$start = $leftbox.position().top;
	offset = 40;
	$chord = chordlength($radius, $angle);
	$high = $chord + offset;
	$low = - $high + offset;
	$ready_to_render = false;
	
	$converter = $("#converter");
	$input = $("#converter textarea");
	$input_select = $("#input_format");
	$output_select = $("#output_format");
	$input_text = $("#input_text");
	$output_text = $("#output_text");
	
	$seesaw.toggle(function() { see(); }, function() { saw(); });
	
	// validate on focus
	$output_text.focus(function() { see(); });
	$input_text.focus(function() { saw(); });
	
	$(document).keydown(function (event) {
		if ($(event.target).hasClass("text")) {
			invalidateParsing();
			return;
		}
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
	
	$("#left_controls a").click(function() {
		$input_select.val($(this).attr("title"));
		invalidateParsing();
		see();
		return false;
	});
	$("#right_controls a").click(function() {
		$output_select.val($(this).attr("title"));
		invalidateParsing();
		see();
		return false;
	});
	$("a.lesson").click(function() {
		url = "/lessons/" + $(this).attr("title");
		$.ajax({
			url: url,
			success: function(data) {
				invalidateParsing();
				$input_text.val(data);
			}
		})
		return false;
	})
	
	$("#seesaw_post").click(function() {
		$seesaw.saw(0);
		$leftbox.stop().animate({top:$start});
		$rightbox.stop().animate({top:$start});
		$input_text.stop().animate({opacity:0}, 300, function() {
			$input_text.val("");
			$input_text.css("opacity", 1);
		});
		$output_text.stop().animate({opacity:0}, 300, function() {
			$output_text.val("");
			$output_text.css("opacity", 1);
		});		
	});
	
	$("#header h1").click(function() {
		intro();
	})
});

var intro_played = false;
function intro() {
	if (intro_played)
		return;
	
	intro_played = true;
	var intro = "h1. Welcome to SeeSaw\n\nSee...";
	animateText(intro, $input_text, 50, function() {
		invalidateParsing();
		$output_text.focus();
		var timeout = setTimeout(function() {
			$input_text.focus();
			clearTimeout(timeout);
			timeout = setTimeout(function() {
				clearTimeout(timeout);
				intro = "Saw.\n\n\"Text Converting\":http://en.wikipedia.org/wiki/Parsing";
				animateText(intro, $input_text, 50, function() {
					invalidateParsing();
					$output_text.focus();
				});
			}, 1000);
		}, 1500);
	})
}

function animateText(string, receiver, interval, callback) {
	var array = string.split("");
	var built = "";
	var i = 0;
	var reference = setInterval(function() {
		built += array[i];
		i++;
		if (i >= array.length) {
			clearInterval(reference);
			if (callback != null)
				callback();
		}
		receiver.val(built);
	}, interval)
}

function see() {
	$seesaw.see(5);
	$leftbox.stop().animate({top:$low});
	if ($ready_to_render) {
		$output_text.stop().animate({opacity:0}, 500);
	}
	$rightbox.stop().animate({top:$high}, 500, function() { convert(); });
}

function saw() {
	$seesaw.saw(5);
	$leftbox.stop().animate({top:$high});
	if ($ready_to_render) {
		$output_text.stop().animate({opacity:1}, 500);
	}
	$rightbox.stop().animate({top:$low}, 500, function() { convert(); });
}

function convert() {
	if ($ready_to_render) {
		$ready_to_render = false;
		$input.val($input_text.val());
		$converter.submit();
	}
}

function chordlength(r, angle) {
	return r + r * Math.sin(angle);
}

function invalidateParsing() {
	$ready_to_render = true;
}