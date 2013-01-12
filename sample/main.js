/**
 * Philips Hue Smart LED helper sample page.
 * Dependencies:
 *     - jQuery 1.8.3
 *     - jQuery UI 1.9.2
 *     - hue.js
 * https://github.com/bjohnso5/hue-hacking
 * Copyright (c) 2013 Bryan Johnson; Licensed MIT */
 
require(["domReady!", "jquery", "jquery-ui", "hue/hue"], function(doc, $, ui, hue) {
	'use strict';
	
	// set transition time to 2 milliseconds
	hue.setTransitionTime(2);
	
	/**
	 * Updates brightness in response to a change event on the slider.
	 */
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
	
	// init slider
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