var hue = hue || window.hue,
    onState = { on: true },
    offState = { on: false },
    fullBrightness = { bri: 254 };

// set Hue bridge IP address and API key to use for test suite
hue.setIpAndApiKey('IP address', 'apiKey');

module( "turnOffAll" );
test("test return data", function() {
    var data = hue.turnOffAll();
    deepEqual(data, offState);
});

module( "turnOnAll" );
test("test return data", function() {
    var data = hue.turnOnAll();
    deepEqual(data, onState);
});

module( "dim" );
test("test return data", function() {
    var data = hue.dim(3);
    deepEqual(data, { bri: 244 });
});

module( "raise" );
test("test return data", function() {
    hue.setBrightness(3, 254);
    var data = hue.raise(3);
    deepEqual(data, fullBrightness);
});