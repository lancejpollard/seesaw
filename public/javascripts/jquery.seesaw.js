(function ($) {
	$.fn.tilt = function(direction, by)
	{
		var value = direction == "left" ? "-" : "";
		value += by.toString() + "deg";
		return $(this).stop().animate({rotate: value}, 500);
	}
	$.fn.see = function (by)
	{
		return $(this).tilt("right", by);
	}
	$.fn.saw = function (by)
	{
		return $(this).tilt("left", by);
	}
})(jQuery);