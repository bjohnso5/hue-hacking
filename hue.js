/**
 * Philips Hue Smart LED helper, exposed as an AMD module.
 * Dependencies:
 *		- RequireJS (or another compatible AMD loader providing define(...) and require(...))
 * 		- jQuery 1.8.3 (see RequireJS documentation: http://requirejs.org/docs/jquery.html)
 *		- color.js (packaged alongside this file)
 */
define(["../jquery", "./color"], function($, colors) {
	
	/**
	 *	1. MD5 hash used for the initial authentication connection should be set 
	 *	   as the value of apiKey
	 *  2. Your Hue bridge's IP address should be substituted for the 
	 *	   "<bridge IP address>" section of baseUrl. You can obtain this at 
	 *	   https://www.meethue.com/en-US/user/preferencessmartbridge (after 
	 *	   you've created your account and connected your bridge).
	 *	3. TODO: set up a discovery feature to find and set the number of active
	 *	   lamps available.
	 */
	var apiKey = '', // your MD5 hash here
		baseUrl = 'http://<bridge IP address>/api', // use your Hue bridge's IP address here
		baseApiUrl = baseUrl + '/' + apiKey,
		lastResult = null,
		numberOfLamps = 3, // set to the # of lamps included in the starter kit
		offState = '{"on": false}',
		onState = '{"on": true}',
		shortFlashType = 'select',
		longFlashType = 'lselect',
		shortFlashState = '{"alert":"' + shortFlashType + '"}',
		longFlashState = '{"alert":"' + longFlashType + '"}',
		transitionTime = null;
	
	/**
	 *	Sets the response to the lastResult member for use.
	 *	TODO: Flesh out success/failure callback mechanism to make it actually
	 *	useful.
	 */
	var apiSuccess = function(data, successText, jqXHR) {
		lastResult = data;
	};
	
	/**
	 *	Convenience function to perform an asynchronous HTTP PUT with the
	 *	provided JSON data.
	 *
	 *	@param url The URL to send the PUT request to.
	 *	@param callback The function to invoke on a successful response.
	 *	@param data The JSON data as a String.
	 */
	var putJSON = function(url, callback, data) {
		var config = {
			type: 'PUT',
			url: url,
			success: callback,
			dataType: 'json',
			contentType: 'application/json',
			data: data
		};
		$.ajax(config);
	};
	
	/**
	 *	Convenience function used to query the state of a Hue lamp or other
	 *	bridge-administered resource.
	 *
	 *	@param destination URL to send HTTP GET request to.
	 *	@param success Callback function to invoke on successful response.
	 */
	var get = function(destination, success) {
		var callback = success || null;
		callback = null === callback ? apiSuccess : success;
		$.getJSON(destination, success);
	};
	
	/**
	 *	Convenience function used to initiate an HTTP PUT request to modify 
	 *	state.
	 *
	 *	@param lampIndex 1-based index of the Hue lamp to modify.
	 *	@param data String containing the JSON state object to commit to the 
	 *	lamp.
	 *	@param success Callback function to invoke on successful response.
	 */
	var put = function(lampIndex, data, success) {
		var callback = success || null;
		callback = null === callback ? apiSuccess : success;
		putJSON(buildStateURL(lampIndex), callback, data);
	};
	
	/**
	 *	Convenience function used to initiate HTTP PUT requests to modify state
	 *	of all connected Hue lamps.
	 *
	 *	@param data String containing the JSON state object to commit to the lamps.
	 *	@param success Callback function to invoke on successful response.
	 */
	var putAll = function(data, success) {
		var callback = success || null;
		callback = null === callback ? apiSuccess : success;
		
		for(var i = 0; i < numberOfLamps; ++i) {
			putJSON(buildStateURL(i+1), callback, data);
		}
	};
	
	/**
	 *	Convenience function used to build a state URL for a provided Hue lamp
	 *	index.
	 *
	 *	@param lampIndex 1-based index of the Hue lamp.
	 */
	var buildStateURL = function(lampIndex /* Number */) {
		return baseApiUrl + '/lights/' + lampIndex + '/state';
	};
	
	/** 
	 *	Builds a JSON state string for the CIE 1931 color coordinates provided.
	 *	If the transitionTime property has been set, it is also included in the
	 *	JSON string.
	 */
	var getXYStateString = function(xyCoords /* Array<Number> */) {
		var state = '{"xy": [' + xyCoords[0] + ',' + xyCoords[1] + ']';
		if(typeof(transitionTime) === 'number' ) {
			state += ', "transitiontime":' + transitionTime;
		}
		state += '}';
		return state;
	};
	
	return {
		/** 
		 *	Flash the lamp at lampIndex for a short time. 
		 *	
		 *	@param lampIndex 1-based index of the Hue lamp to flash.
		 */
		flash: function(lampIndex /* Number */) {
			put(lampIndex, shortFlashState);
		},
		/** 
		 *	Flash all connected lamps for a short time.
		 */
		flashAll: function() {
			putAll(shortFlashState);
		},
		/** 
		 *	Flash the lamp at lampIndex for a long time.
		 *
		 *	@param lampIndex 1-based index of the Hue lamp to flash.
		 */
		longFlash: function(lampIndex /* Number */) {
			put(lampIndex, longFlashState);
		},
		/** 
		 *	Flash all connected lamps for a long time.
		 */
		longFlashAll: function() {
			putAll(longFlashState);
		},
		/** 
		 *	Set the lamp at lampIndex to the approximate CIE x,y equivalent of 
		 *	the provided hex color.
		 *
		 *	@param lampIndex 1-based index of the Hue lamp to colorize.
		 *	@param color String representing a hexadecimal color value.
		 */
		setColor: function(lampIndex /* Number */, color /* String */) {
			var state = getXYStateString(colors.getCIEColor(color));
			put(lampIndex, state);
		},
		/**
		 *	Sets all connected lamps to the approximate CIE x,y equivalent of 
		 *	the provided hex color.
		 *
		 *	@param color String representing a hexadecimal color value.
		 */
		setAllColors: function(color /* String */) {
			var state = getXYStateString(colors.getCIEColor(color));
			putAll(state);
		},
		/**
		 *	Turn off the lamp at lampIndex.
		 *
		 *	@param lampIndex 1-based index of the Hue lamp to turn off.
		 */
		turnOff: function(lampIndex /* Number */) {
			put(lampIndex, offState);
		},
		/** 
		 *	Turn on the lamp at lampIndex.
		 *
		 *	@param lampIndex 1-based index of the Hue lamp to turn on.
		 */
		turnOn: function(lampIndex /* Number */) {
			put(lampIndex, onState);
		},
		/** 
		 *	Turn off all connected lamps.
		 */
		turnOffAll: function() {
			putAll(offState);
		},
		/** 
		 *	Turn on all connected lamps.
		 */
		turnOnAll: function() {
			putAll(onState);
		},
		/** 
		 *	Return the json data from the last HTTP request to the Hue bridge.
		 *
		 *	@return JSON response from the Hue bridge for the last HTTP request.
		 */
		getLastResult: function() {
			return lastResult;
		},
		/** 
		 *	Return the value of the configured transitionTime property.
		 *
		 *	@return Value of the transitionTime property. Null by default if not
		 *	set.
		 */
		getTransitionTime: function() {
			return transitionTime;
		},
		/**
		 *	Set the value of the transitionTime property.
		 *
		 *	@param time Lamp color transition time in approximate milliseconds.
		 */
		setTransitionTime: function(time /* Number */) {
			transitionTime = time;
		}
	};
});
