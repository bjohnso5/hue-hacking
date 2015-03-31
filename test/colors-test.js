var colors = colors || window.colors;
var hexRGBRed = 'FF0000';
var cieRGBRed = [0.6484272236872118, 0.330856101472778];
var hexRGBGreen = '00FF00';
var cieRGBGreen = [0.4091, 0.518];
var hexRGBBlue = '0000FF';
var cieRGBBlue = [0.167, 0.04];

module( "getCIEColor" );
test("test null param value returns random color", function() {
	notDeepEqual(colors.getCIEColor(null), null);
});
test("known parameter returns known coordinates", function() {
	deepEqual(colors.getCIEColor(hexRGBRed), cieRGBRed);
});

module( "rgbToCIE1931" );
test("known parameter returns known coordinates (full red)", function() {
	deepEqual(colors.rgbToCIE1931(255, 0, 0), cieRGBRed);
});
test("known parameter returns known coordinates (full green)", function() {
	deepEqual(colors.rgbToCIE1931(0, 255, 0), cieRGBGreen);
});
test("known parameter returns known coordinates (full blue)", function() {
	deepEqual(colors.rgbToCIE1931(0, 0, 255), cieRGBBlue);
});

module( "hexToCIE1931" );
test("known parameter returns known coordinates (full red)", function() {
	deepEqual(colors.hexToCIE1931(hexRGBRed), cieRGBRed);
});
test("known parameter returns known coordinates (full green)", function() {
	deepEqual(colors.hexToCIE1931(hexRGBGreen), cieRGBGreen);
});
test("known parameter returns known coordinates (full blue)", function() {
	deepEqual(colors.hexToCIE1931(hexRGBBlue), cieRGBBlue);
});

// The resulting hex values from CIE1931 => RGB color spaces are imprecise, but close.
module( "CIE1931ToHex" );
test("known parameter returns known coordinates (full red)", function() {
	deepEqual(colors.CIE1931ToHex.apply(null, cieRGBRed), 'ff6c22');
});
test("known parameter returns known coordinates (full green)", function() {
	deepEqual(colors.CIE1931ToHex.apply(null, cieRGBGreen), 'fffe50');
});
test("known parameter returns known coordinates (full blue)", function() {
	deepEqual(colors.CIE1931ToHex.apply(null, cieRGBBlue), '3639ff');
});
