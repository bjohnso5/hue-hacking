# hue-hacking: Hue Control Library #
***
hue-hacking is a javascript library designed to control the Philips Hue smart LED bulb system.

For more information on the Philips Hue bulbs and wireless bridge system, visit [meethue.com](http://meethue.com).

_Initial concept and startup work inspired by [Ross McKillop's post](http://rsmck.co.uk/hue)._

## Getting Started ##
Once you've followed the instructions with your Hue starter kit and you have your lamps working through the web interface or smartphone app, it's time to configure your copy of hue.js.

For a full breakdown of what the Philips Hue API/SDK offers, check out the [official developer site](http://developers.meethue.com/). Full details about how to register a new 'user' with the wireless bridge can be found at the SDK [getting started page](http://developers.meethue.com/gettingstarted.html).

1. Generate and save your MD5 hash (any [MD5 generator](http://www.miraclesalad.com/webtools/md5.php) will do).
Be sure to save your hash and the passphrase used to generate it in a safe place.

2. __Optional:__Find the IP address of your Hue wireless bridge. This can be gathered in a number of ways, including the meethue.com control panel, https://www.meethue.com/en-US/user/preferencessmartbridge, by clicking on the "Show me more" link. See [screenshot](http://imgur.com/yDhCp) for an example. This can be automatically determined using UPnP, see next step.

3. Run `grunt init:<hash from step 1>` to automatically preprocess the test suite files. Make sure you've completed the new user set up step [here](http://developers.meethue.com/gettingstarted.html) with your hash.Verify everything is set up correctly by running `grunt test`.

4. To use the Hue library in a web application, make sure to call the `setIpAndApiKey(ipAddress, apiKey)` function, passing in the IP address and the API key value generated and registered with the hub. These should now be saved in the .api-key and .discovered-ip files generated in step 3.

5. __Optional:__ If you have more than 3 bulbs (the number included in the Hue starter kit), call the setNumberOfLamps() function, passing in the total number of lamps available, prior to using the lamp control functions.

## Included Files ##

### src/colors.js ###
Provides convenience functions to convert between CSS-style hex color values, their corresponding RGB color values, and the CIE 1931 X,Y color coordinates supported by the Hue lamp system.

### src/hue.js ###
Provides control functions to control either single lamps, groups of lamps, or all available lamps. Lamps can be toggled (on/off), flashed for a short or long time, and have their color changed. See code for API documentation.

### tests/** ###
QUnit test suites for colors.js and hue.js. Each test is contained within an html page; simply open the page locally in a browser to run tests. __Note:__ Setup detailed above must be completed in the hue.js file to have tests run.

### Gruntfile.js & package.json ###
NPM & Grunt configuration for easy build and minification. Requires [Node.js + NPM](http://nodejs.org/) and [Grunt](http://gruntjs.com/). Running `grunt` or `grunt default` will lint, test (via qunit), concat and minify colors.js and hue.js for distribution. Running `grunt test` will lint and test without building.

&copy; 2013 Bryan Johnson; Licensed MIT.
