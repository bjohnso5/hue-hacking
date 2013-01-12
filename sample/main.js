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
	
	// enable jQuery UI button and button set widgets
	$('button').button();
	$('#toggle').buttonset();
	
	// enable jQuery UI slider widgets
	$('#red, #green, #blue').slider({
		orientation : 'horizontal',
		range : 'min',
		max : 255,
		value : 127,
		slide : refreshSwatch,
		change : refreshSwatchAndLamps
	 });
	 $('#red').slider('value', 255);
	 $('#green').slider('value', 140);
	 $('#blue').slider('value', 60);
	 
	 $('#brightness').slider({
		animate: 'fast',
		orientation: 'horizontal',
		range: 'min',
		max: 254,
		value: 170,
		change: updateBrightness
	});
	
	// set transition time to 2 milliseconds
	hue.setTransitionTime(2);
	
	/**
	 * Updates the brightness of all lamps based on the slider value.
	 */
	function updateBrightness() {
		var brightness = $('#brightness').slider('value');
		hue.setAllBrightness(brightness);
		$('#brightnessValue').html(brightness);
	}
	
	/**
	 * Return the hex color code corresponding to the provided RGB values.
	 *
	 * @param {number} r Integer value between 0 and 255.
	 * @param {number} g Integer value between 0 and 255.
	 * @param {number} b Integer value between 0 and 255.
	 */
	function hexFromRGB(r, g, b) {
		var hex = [
			r.toString(16),
			g.toString(16),
			b.toString(16)
		];
		$.each(hex, function (nr, val) {
			if (val.length === 1) {
				hex[nr] = '0' + val;
			}
		});
		return hex.join('').toUpperCase();
	}
	
	/**
	 * Update the background color of the on-screen swatch div with the hex 
	 * color code corresponding to the RGB sliders.
	 */
	function refreshSwatch() {
		var red = $( '#red' ).slider( 'value' ),
			green = $( '#green' ).slider( 'value' ),
			blue = $( '#blue' ).slider( 'value' ),
			hex = hexFromRGB( red, green, blue );
		$('#swatch').css( 'background-color', '#' + hex );
		return hex;
	}
	
	/**
	 * Update the on-screen swatch, and then update the color of all connected
	 * lamps.
	 */
	function refreshSwatchAndLamps() {
		var hex = refreshSwatch();
		hue.setAllColors(hex);
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
	
	$('#toggle input[type="checkbox"]').on('click', function(e) {
		var val = $(this).val();
		var on = $(this).is(':checked');
		on ? hue.turnOff(val) : hue.turnOn(val);
	});
	
	// Update label and set brightness to default immediately
	$('#brightnessValue').html($('#brightness').slider('value'));
	updateBrightness();

});