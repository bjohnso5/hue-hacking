/**
 * Color utility functions, exposed as an AMD module.
 * No external dependencies.
 * Special thanks for the RGB to CIE conversion code goes out to the Q42 team 
 * for their Q42.HueApi work. Dank u!
 * More info: https://github.com/Q42/Q42.HueApi.
 *
 * https://github.com/bjohnso5/hue-hacking
 * Copyright (c) 2013 Bryan Johnson; Licensed MIT */
var colors = function () {
    'use strict';
    
    /**
     * Represents a CIE 1931 XY coordinate pair. 
     */
    var XYPoint = function (x, y) {
        this.x = x;
        this.y = y;
    };
    
    var Red = new XYPoint(0.675, 0.322);
    var Lime = new XYPoint(0.4091, 0.518);
    var Blue = new XYPoint(0.167, 0.04);
    
    
    var hexToRed = function (hex) {
        return parseInt( hex.substring(0, 2), 16 );
    };
    
    var hexToGreen = function (hex) {
        return parseInt( hex.substring(2, 4), 16 );
    };
    
    var hexToBlue = function (hex) {
        return parseInt( hex.substring(4, 6), 16 );
    };
    
    var hexToRGB = function (h) {
        var rgb = [hexToRed(h), hexToGreen(h), hexToBlue(h)];
        return rgb;
    };
    
    /**
     * Generates a random number between 'from' and 'to'.
     *
     * @param {Number} Number representing the start of a range.
     * @param {Number} Number representing the end of a range.
     */
    var randomFromInterval = function (from /* Number */, to /* Number */) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    };
    
    /**
     * Return a random Integer in the range of 0 to 255, representing an RGB
     * color value.
     *
     * @return {number} Integer between 0 and 255.
     */
    var randomRGBValue = function () {
        return randomFromInterval(0, 255);
    };
    
    /**
     * Returns the cross product of two XYPoints.
     *
     * @param {XYPoint} Point 1.
     * @param {XYPoint} Point 2.
     * @return {Number} Cross-product of the two XYPoints provided.
     */
    var crossProduct = function (p1, p2) {
        return (p1.x * p2.y - p1.y * p2.x);
    };
    
    /**
     * Check if the provided XYPoint can be recreated by a Hue lamp.
     *
     * @param {XYPoint} XYPoint to check.
     * @return {boolean} Flag indicating if the point is within reproducible range.
     */
    var checkPointInLampsReach = function (p) {
        var v1 = new XYPoint(Lime.x - Red.x, Lime.y - Red.y);
        var v2 = new XYPoint(Blue.x - Red.x, Blue.y - Red.y);
        
        var q = new XYPoint(p.x - Red.x, p.y - Red.y);
        
        var s = crossProduct(q, v2) / crossProduct(v1, v2);
        var t = crossProduct(v1, q) / crossProduct(v1, v2);
        
        return (s >= 0.0) && (t >= 0.0) && (s + t <= 1.0);
    };
    
    /**
     * Find the closest point on a line. This point will be reproducible by a Hue lamp.
     *
     * @param {XYPoint} The point where the line starts.
     * @param {XYPoint} The point where the line ends.
     * @param {XYPoint} The point which is close to the line.
     * @return {XYPoint} A point that is on the line, and closest to the XYPoint provided.
     */
    var getClosestPointToPoint = function (A, B, P) {
        var AP = new XYPoint(P.x - A.x, P.y - A.y);
        var AB = new XYPoint(B.x - A.x, B.y - A.y);
        var ab2 = AB.x * AB.x + AB.y * AB.y;
        var ap_ab = AP.x * AB.x + AP.y * AB.y;
        
        var t = ap_ab / ab2;
        
        if (t < 0.0) {
            t = 0.0;
        } else if (t > 1.0) {
            t = 1.0;
        }
        
        return new XYPoint(A.x + AB.x * t, A.y + AB.y * t);
    };
    
    /**
     * Returns the distance between two XYPoints.
     *
     * @param {XYPoint} The first point.
     * @param {XYPoint} The second point.
     * @param {Number} The distance between points one and two.
     */
    var getDistanceBetweenTwoPoints = function (one, two) {
        var dx = one.x - two.x; // horizontal difference
        var dy = one.y - two.y; // vertical difference
        
        return Math.sqrt(dx * dx + dy * dy);
    };
    
    /**
     * Returns an XYPoint object containing the closest available CIE 1931
     * coordinates based on the RGB input values.
     *
     * @param {Number} RGB red value, integer between 0 and 255.
     * @param {Number} RGB green value, integer between 0 and 255.
     * @param {Number} RGB blue value, integer between 0 and 255.
     * @return {XYPoint} CIE 1931 XY coordinates, corrected for reproducibility.
     */
    var getXYPointFromRGB = function (red, green, blue) {
        
        var r = (red > 0.04045) ? Math.pow((red + 0.055) / (1.0 + 0.055), 2.4) : (red / 12.92);
        var g = (green > 0.04045) ? Math.pow((green + 0.055) / (1.0 + 0.055), 2.4) : (green / 12.92);
        var b = (blue > 0.04045) ? Math.pow((blue + 0.055) / (1.0 + 0.055), 2.4) : (blue / 12.92);
        
        var X = r * 0.4360747 + g * 0.3850649 + b * 0.0930804;
        var Y = r * 0.2225045 + g * 0.7168786 + b * 0.0406169;
        var Z = r * 0.0139322 + g * 0.0971045 + b * 0.7141733;
        
        var cx = X / (X + Y + Z);
        var cy = Y / (X + Y + Z);
        
        cx = isNaN(cx) ? 0.0 : cx;
        cy = isNaN(cy) ? 0.0 : cy;
        
        //Check if the given XY value is within the colourreach of our lamps.
        var xyPoint = new XYPoint(cx, cy);
        var inReachOfLamps = checkPointInLampsReach(xyPoint);
        
        if (!inReachOfLamps) {
            //It seems the colour is out of reach
            //let's find the closes colour we can produce with our lamp and send this XY value out.
            
            //Find the closest point on each line in the triangle.
            var pAB = getClosestPointToPoint(Red, Lime, xyPoint);
            var pAC = getClosestPointToPoint(Blue, Red, xyPoint);
            var pBC = getClosestPointToPoint(Lime, Blue, xyPoint);
            
            //Get the distances per point and see which point is closer to our Point.
            var dAB = getDistanceBetweenTwoPoints(xyPoint, pAB);
            var dAC = getDistanceBetweenTwoPoints(xyPoint, pAC);
            var dBC = getDistanceBetweenTwoPoints(xyPoint, pBC);
            
            var lowest = dAB;
            var closestPoint = pAB;
            
            if (dAC < lowest) {
                lowest = dAC;
                closestPoint = pAC;
            }
            if (dBC < lowest) {
                lowest = dBC;
                closestPoint = pBC;
            }
            
            //Change the xy value to a value which is within the reach of the lamp.
            cx = closestPoint.x;
            cy = closestPoint.y;
        }
        
        return new XYPoint(cx, cy);
    };
    
    return {
        /**
         * Converts hexadecimal colors represented as a String to approximate
         * CIE 1931 coordinates. May not produce accurate values.
         *
         * @param {String} Value representing a hexadecimal color value
         * @return {Array{Number}} Approximate CIE 1931 x,y coordinates.
         */
        hexToCIE1931 : function (h) {
            var rgb = hexToRGB(h);
            return this.rgbToCIE1931(rgb[0], rgb[1], rgb[2]);
        },
        /**
         * Converts red, green and blue integer values to approximate CIE 1931
         * x and y coordinates. Algorithm from: 
         * http://www.easyrgb.com/index.php?X=MATH&H=02#text2. May not produce
         * accurate values.
         *
         * @param {Number} red Integer in the 0-255 range.
         * @param {Number} green Integer in the 0-255 range.
         * @param {Number} blue Integer in the 0-255 range.
         * @return {Array{Number}} Approximate CIE 1931 x,y coordinates.
         */
        rgbToCIE1931 : function (red, green, blue) {
            var point = getXYPointFromRGB(red, green, blue);
            
            return [point.x, point.y];
        },
        /**
         * Returns the approximate CIE 1931 x,y coordinates represented by the 
         * supplied hexColor parameter, or of a random color if the parameter
         * is not passed.
         *
         * @param {String} hexColor String representing a hexidecimal color value.
         * @return {Array{Number}} Approximate CIE 1931 x,y coordinates.
         */
        getCIEColor : function (hexColor /* String */) {
            var hex = hexColor || null;
            var xy = [];
            if (null !== hex) {
                xy = this.hexToCIE1931(hex);
            } else {
                var r = randomRGBValue();
                var g = randomRGBValue();
                var b = randomRGBValue();
                xy = this.rgbToCIE1931(r, g, b);
            }
            return xy;
        }
    };
};

if(typeof(define) !== 'undefined' && typeof(define.amd) !== 'undefined') {
    define(colors);
} else {
    window.colors = colors();
}
