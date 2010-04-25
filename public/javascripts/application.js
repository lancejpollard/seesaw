$(document).ready(function() {
	
	$conversion_map = {
		"textile": 	["html", "haml"],
		"markdown": ["html", "haml", "textile"],
		"html": 		["haml", "textile", "markdown", "beautified"],
		"haml": 		["html", "textile"],
		"xml": 			["beautified"],
		"js": 			["minified", "beautified"],
		"css": 			["minified", "beautified", "sass"],
		"sass": 		["css"],
		"tlf": 			["html", "textile", "haml", "beautified"]
	}
	
	$links = $("#links");
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
	$window = $(window);
	$is_full_screen = false;
		
	$converter = $("#converter");
	$input = $("#converter textarea");
	$input_select = $("#input_format");
	$output_select = $("#output_format");
	$input_text = $("#input_text");
	$output_text = $("#output_text");
	$full_screen = $("#full_screen");
	$focused = null;
	$left_controls = $("#left_controls a");
	$right_controls = $("#right_controls a");
	
	// tooltips
	$(".tooltip").easyTooltip();
	$(".close").click(function() { $("#ie_warning").hide(300); return false; })
	
	// links
	$("#tab").toggle(function() {
		$links.slideDown(function() {
			
		});
	}, function() {
		$links.slideUp();
	})
	
	// not part of tab order
	$(".controls a").each(function(index, element) {
		$(element).attr("tabindex", 0);
	})
	
	$seesaw.toggle(function() { $output_text.focus(); }, function() { $input_text.focus(); });
	
	// validate on focus
	$output_text.focus(function() { $focused = $output_text; see(); });
	$("#header a").click(function() {
		output = $output_text.val();
		if ($is_full_screen || output == "") {
			return false;
		}
		$is_full_screen = true;
		$("textarea", $full_screen).val(output);
		$full_screen.css("display", "inline-block");
		$full_screen.width(0);
		$full_screen.height(0);
		$full_screen.stop().animate({
			opacity:1,
			left:"5%",
			right:"5%",
			top:130,
			width:"88%",
			height:"70%"
		});
		var full_screen_handler = function(event) {
			if ($(event.target).is("textarea")) {
				return;
			}
			$is_full_screen = false;
			$window.unbind("click", full_screen_handler);
			$full_screen.stop().animate({
				opacity:0,
				left:"30%",
				right:"30%",
				top:130,
				width:"10%",
				height:"10%"
			}, function() {
				$full_screen.css("display", "none");
			});
		}
		$window.bind("click", full_screen_handler);
		return false;
	})
	$input_text.focus(function() { $focused = $input_text; saw(); });
	
	$(document).keydown(function (event) {
		// if tab, toggle textinput
		if (event.keyCode == 9) {
			if ($focused == $input_text) {
				$output_text.focus();
			} else {
				$input_text.focus();
			}
			return false;
		}
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
			render_output(responseText.toString());
		},
		error: function(responseText, statusText, xhr, $form) {
			
		}
	});
	
	$left_controls.click(function() {
		var input_type = $(this).attr("rel");
		var output_types = $conversion_map[input_type];
		$input_select.val(input_type);
		$right_controls.each(function(index, element) {
			var $right_control = $(element);
			if (output_types.indexOf($right_control.attr("rel")) == -1) {
				$right_control.hide(500);
			} else {
				$right_control.show(500);
			}
		})
		return false;
	});
	
	$right_controls.click(function(event) {
		var output_type = $(this).attr("rel");
		$output_select.val(output_type);
		invalidateParsing();
		see();
		return false;
	});
	
	$("a.lesson").click(function() {
		url = "/lessons/" + $(this).attr("rel");
		$.ajax({
			url: url,
			success: function(data) {
				$input_text.focus();
				$input_text.stop().animate({opacity:0}, 300, function() {
					$input_text.val(data);
				}).animate({opacity:1}, 500, function() { invalidateParsing(); });
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

function see(callback) {
	if (!callback)
		callback = convert;
	$seesaw.see(5);
	$leftbox.stop().animate({top:$low});
	if ($ready_to_render) {
		$output_text.stop().animate({opacity:0}, 500);
	}
	$rightbox.stop().animate({top:$high}, 500, callback);
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
		input_type = $input_select.val();
		output_type = $output_select.val();
		if (output_type == "beautified") {
			var output = $input_text.val();
			if (input_type == "css") {
				output = css_beautify(output);
			} else if (input_type == "js") {
				output = js_beautify(output);
			}
			render_output(output);
		} else {
			$converter.submit();
		}
	}
}

function chordlength(r, angle) {
	return r + r * Math.sin(angle);
}

function invalidateParsing() {
	$ready_to_render = true;
}

function render_output(output) {
	$output_text.val(output);
	$output_text.animate({opacity:1}, 300);
}

/* INTRO */

var intro_played = false;
function intro() {
	return; // not yet
	if (intro_played)
	
	intro_played = true;
	var intro = "h1. Welcome to SeeSaw\n\nSee...";
	$input_text.focus();
	animateText(intro, $input_text, 50, function() {
		invalidateParsing();
		$output_text.focus();
		var timeout = setTimeout(function() {
			$input_text.focus();
			clearTimeout(timeout);
			timeout = setTimeout(function() {
				clearTimeout(timeout);
				intro = "It's easy to convert.\n\nClick around!";
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