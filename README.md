# hue-hacking: Hue Control Library #
***
hue-hacking is a javascript library designed to control the Philips Hue smart LED bulb system.

For more information on the Philips Hue bulbs and wireless bridge system, visit [meethue.com](http://meethue.com).

_Initial concept and startup work inspired by [Ross McKillop's post](http://rsmck.co.uk/hue)._

## Getting Started ##
Once you've followed the instructions with your Hue starter kit and you have your lamps working through the web interface or smartphone app, it's time to configure your copy of hue.js.

1. Generate and save your MD5 hash (any [MD5 generator](http://www.miraclesalad.com/webtools/md5.php) will do).
Be sure to save your hash and the passphrase used to generate it in a safe place.

2. Set the value of the ```` apiKey ```` variable in hue.js to your generated MD5 hash from step 1.

3. Find the IP address of your Hue wireless bridge. This can be gathered in a number of ways, including the
meethue.com control panel, https://www.meethue.com/en-US/user/preferencessmartbridge, by clicking on the "Show me more" link. See bridge_address.png for an example.

4. Replace the section of the ```` baseURL ```` variable in hue.js delimted by angle brackets (&lt;bridge IP address>) with the IP address discovered in step 3.

5. __Optional:__ If you have more than 3 bulbs (the number included in the Hue starter kit), update the value of the ```` numberOfLamps ```` variable in hue.js to match your bulb count.

## Included Files ##
***

### colors.js ###
Provides convenience functions to convert between CSS-style hex color values, their corresponding RGB color values, and the CIE 1931 X,Y color coordinates supported by the Hue lamp system.

### hue.js ###
Provides control functions to control either single lamps, groups of lamps, or all available lamps. Lamps can be toggled (on/off), flashed for a short or long time, and have their color changed. See code for API documentation.


&copy; 2013 Bryan Johnson; Licensed MIT.
