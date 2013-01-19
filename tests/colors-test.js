var colors = colors || window.colors,
    hexRGBRed = 'FF0000',
    cieRGBRed = [0.4124, 0.2126];
    hexRGBGreen = '00FF00',
    cieRGBGreen = [0.3576, 0.7152],
    hexRGBBlue = '0000FF',
    cieRGBBlue = [0.1805, 0.0722];

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