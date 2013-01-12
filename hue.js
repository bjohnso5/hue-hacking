/**
 * Philips Hue Smart LED helper, exposed as an AMD module.
 * Dependencies:
 * 		- jQuery 1.8.3
 *		- color.js (packaged alongside this file)
 * https://github.com/bjohnso5/hue-hacking
 * Copyright (c) 2013 Bryan Johnson; Licensed MIT */
 
var hue = function($, colors) { 
	
	/**
	 * 1. MD5 hash used for the initial authentication connection should be set 
	 *    as the value of apiKey
	 * 2. Your Hue bridge's IP address should be substituted for the 
	 *    "<bridge IP address>" section of baseUrl. You can obtain this at 
	 *    https://www.meethue.com/en-US/user/preferencessmartbridge (after 
	 *    you've created your account and connected your bridge).
	 * 3. TODO: set up a discovery feature to find and set the number of active
	 *    lamps available.
	 */
	var apiKey = '', // your MD5 hash here
		baseUrl = 'http://<bridge IP address>/api', // use your Hue bridge's IP address here
		baseApiUrl = baseUrl + '/' + apiKey,
		lastResult = null,
		numberOfLamps = 3, // set to the # of lamps included in the starter kit, update if you've connected additional bulbs
		offState = { on: false },
		onState = { on: true },
		shortFlashType = 'select',
		longFlashType = 'lselect',
		shortFlashState = { alert: shortFlashType },
		longFlashState = { alert: longFlashType },
		transitionTime = null;
	
	/**
	 * Sets the response to the lastResult member for use.
	 * TODO: Flesh out success/failure callback mechanism to make it actually
	 * useful.
	 *
	 * @param {String} Response data as a String
	 * @param {String} Status text
	 * @param {jqXHR} jQuery XmlHttpResponse object
	 */
	var apiSuccess = function(data, successText, jqXHR) {
		lastResult = data;
	};
	
	/**
	 * Convenience function to perform an asynchronous HTTP PUT with the
	 * provided JSON data.
	 *
	 * @param {String} url The URL to send the PUT request to.
	 * @param {function} callback The function to invoke on a successful response.
	 * @param {Object} data The JSON data.
	 */
	var putJSON = function(url, callback, data) {
		var config = {
			type: 'PUT',
			url: url,
			success: callback,
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(data)
		};
		$.ajax(config);
	};
	
	/**
	 * Convenience function used to query the state of a Hue lamp or other
	 * bridge-administered resource.
	 *
	 * @param {String} destination URL to send HTTP GET request to.
	 * @param {function} success Callback function to invoke on successful response.
	 */
	var get = function(destination, success) {
		var callback = success || null;
		callback = null === callback ? apiSuccess : success;
		$.getJSON(destination, success);
	};
	
	/**
	 * Convenience function used to initiate an HTTP PUT request to modify 
	 * state.
	 *
	 * @param {number} lampIndex 1-based index of the Hue lamp to modify.
	 * @param {String} data String containing the JSON state object to commit to the lamp.
	 * @param {function} success Callback function to invoke on successful response.
	 */
	var put = function(lampIndex, data, success) {
		var callback = success || null;
		callback = null === callback ? apiSuccess : success;
		putJSON(buildStateURL(lampIndex), callback, data);
	};
	
	/**
	 * Convenience function used to initiate an HTTP PUT request to modify state of a group of lamps.
	 *
	 * @param {number} Index of the lamp group to modify
	 * @param {Object} Object containing desired lamp state
	 */
	var putGroupAction = function(groupIndex /* {number} */, action /* String */) {
		var callback = apiSuccess;
		putJSON(buildGroupActionURL(groupIndex), callback, action);
	};
	
	/**
	 * Convenience function used to initiate HTTP PUT requests to modify state
	 * of all connected Hue lamps.
	 *
	 * @param {String} data String containing the JSON state object to commit to the lamps.
	 * @param {function} success Callback function to invoke on successful response.
	 */
	var putAll = function(data, success) {
		var callback = success || null;
		callback = null === callback ? apiSuccess : success;
		
		for(var i = 0; i < numberOfLamps; ++i) {
			putJSON(buildStateURL(i+1), callback, data);
		}
	};
	
	/**
	 * Convenience function used to build a state URL for a provided Hue lamp
	 * index.
	 *
	 * @param {number} lampIndex 1-based index of the Hue lamp.
	 */
	var buildStateURL = function(lampIndex /* number */) {
		return baseApiUrl + '/lights/' + lampIndex + '/state';
	};
	
	/**
	 * Convenience function used to build a state URL for a provided Hue lamp
	 * group.
	 *
	 * @param {number} groupIndex 0-based index of the lamp group.
	 */
	var buildGroupActionURL = function(groupIndex /* {number} */) {
		return baseApiUrl + '/groups/' + groupIndex + '/action';
	};
	
	/** 
	 * Builds a JSON state object for the CIE 1931 color coordinates provided.
	 * If the transitionTime property has been set, it is also included in the
	 * JSON object.
	 *
	 * @param {Array{number}} CIE 1931 X,Y color coordinates.
	 */
	var getXYState = function(xyCoords /* Array<number> */) {
		var stateObj = { xy: xyCoords };
		
		if(typeof(transitionTime) === 'number' ) {
			stateObj.transitiontime = transitionTime;
		}
		
		return stateObj;
	};
	
	/**
	 * Builds a JSON state object used to set the brightness of a Hue lamp to
	 * the value of the brightness parameter.
	 *
	 * @param {number} brightness Integer value between 0 and 254. Note that 0
	 * is not equivalent to the lamp's off state.
	 */
	var getBrightnessState = function(brightness) {
		var stateObj = { bri: brightness };
		return stateObj;
	};
	
	return {
		/** 
		 * Flash the lamp at lampIndex for a short time. 
		 *	
		 * @param lampIndex 1-based index of the Hue lamp to flash.
		 */
		flash: function(lampIndex /* number */) {
			put(lampIndex, shortFlashState);
		},
		/** 
		 * Flash all connected lamps for a short time.
		 */
		flashAll: function() {
			putAll(shortFlashState);
		},
		/** 
		 * Flash the lamp at lampIndex for a long time.
		 *
		 * @param lampIndex 1-based index of the Hue lamp to flash.
		 */
		longFlash: function(lampIndex /* number */) {
			put(lampIndex, longFlashState);
		},
		/** 
		 * Flash all connected lamps for a long time.
		 */
		longFlashAll: function() {
			putAll(longFlashState);
		},
		/** 
		 * Set the lamp at lampIndex to the approximate CIE x,y equivalent of 
		 * the provided hex color.
		 *
		 * @param lampIndex 1-based index of the Hue lamp to colorize.
		 * @param color String representing a hexadecimal color value.
		 */
		setColor: function(lampIndex /* number */, color /* String */) {
			var state = getXYState(colors.getCIEColor(color));
			put(lampIndex, state);
		},
		/**
		 * Sets all connected lamps to the approximate CIE x,y equivalent of 
		 * the provided hex color.
		 *
		 * @param color String representing a hexadecimal color value.
		 */
		setAllColors: function(color /* String */) {
			var state = getXYState(colors.getCIEColor(color));
			putGroupAction(0, state); // not as fluid as a simple for loop. setting group state seems to react slower than lamp-by-lamp.
			//putAll(state);
		},
		/**
		 * Turn off the lamp at lampIndex.
		 *
		 * @param lampIndex 1-based index of the Hue lamp to turn off.
		 */
		turnOff: function(lampIndex /* number */) {
			put(lampIndex, offState);
		},
		/** 
		 * Turn on the lamp at lampIndex.
		 *
		 * @param lampIndex 1-based index of the Hue lamp to turn on.
		 */
		turnOn: function(lampIndex /* number */) {
			put(lampIndex, onState);
		},
		/** 
		 * Turn off all connected lamps.
		 */
		turnOffAll: function() {
			putGroupAction(0, offState);
			//putAll(offState);
		},
		/** 
		 * Turn on all connected lamps.
		 */
		turnOnAll: function() {
			putGroupAction(0, onState);
			//putAll(onState);
		},
		/**
		 * Set the brightness of the lamp at lampIndex.
		 *
		 * @param {number} lampIndex 1-based index of the Hue lamp to modify.
		 * @param {number} brightness Integer value between 0 and 254.
		 */
		setBrightness: function(lampIndex /* number */, brightness /* number */) {
			var state = getBrightnessState(brightness);
			put(lampIndex, state);
		},
		/**
		 * Set the brightness of all connected lamps.
		 *
		 * @param {number} brightness Integer value between 0 and 254.
		 */
		setAllBrightness: function(brightness /* number */) {
			var state = getBrightnessState(brightness);
			putGroupAction(0, state);
			//putAll(state);
		},
		/**
		 * Set the brightness of an indexed group of lamps.
		 *
		 * @param {number} groupIndex 0-based lamp group index.		 
		 * @param {number} brightness Integer value between 0 and 254.
		 */
		setGroupBrightness: function(groupIndex /* number */, brightness /* number */) {
			var state = getBrightnessState(brightness);
			putGroupAction(groupIndex, brightness);
		},
		/** 
		 * Return the json data from the last HTTP request to the Hue bridge.
		 *
		 * @return {String} JSON response from the Hue bridge for the last HTTP request.
		 */
		getLastResult: function() {
			return lastResult;
		},
		/** 
		 * Return the value of the configured transitionTime property.
		 *
		 * @return {number} Value of the transitionTime property. Null by default if not
		 * set.
		 */
		getTransitionTime: function() {
			return transitionTime;
		},
		/**
		 * Set the value of the transitionTime property.
		 *
		 * @param {number} time Lamp color transition time in approximate milliseconds.
		 */
		setTransitionTime: function(time /* number */) {
			transitionTime = time;
		}
	};
};

if(typeof(define) !== 'undefined' && typeof(define.amd) !== 'undefined') {
	define(["jquery", "./colors"], hue);
} else {
	// window.colors is defined by the color.js file; if AMD is not used, it must be included BEFORE hue.js
	window.hue = hue(window.jQuery, window.colors);
}
