require(["domReady!", "jquery", "jquery-ui", "hue/hue"], function(doc, $, ui, hue) {
	
	hue.setTransitionTime(2);
	
	function updateBrightness() {
		var brightness = $('#brightness').slider('value');
		hue.setAllBrightness(brightness);
		$('#brightnessValue').html(brightness);
	}
	
	// set up event handlers for buttons
	$('#turnOnAll').on('click', function(e) {
		hue.turnOnAll();
	});
	
	$('#turnOffAll').on('click', function(e) {
		hue.turnOffAll();
	});
	
	$('#allRed').on('click', function(e) {
		hue.setAllColors('FF0000');
	});
	
	$('#allBlue').on('click', function(e) {
		hue.setAllColors('0000FF');
	});
	
	$('#allGreen').on('click', function(e) {
		hue.setAllColors('00FF00');
	});
	
	$('#allWhite').on('click', function(e) {
		hue.setAllColors('FFFFFF');
	});
	
	$('#brightness').slider({
		animate: "fast",
		orientation: "horizontal",
		range: "min",
		max: 254,
		value: 170,
		change: updateBrightness
	});
	
	// Update label and set brightness to default immediately
	$('#brightnessValue').html($('#brightness').slider('value'));
	updateBrightness();

});