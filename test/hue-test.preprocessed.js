var hue = hue || window.hue,
    onState = { on: true },
    offState = { on: false },
    fullBrightness = { bri: 254 },
    IPAddress = '/* @echo IPAddress */' || '127.0.0.1',
    connectedLampCount = /* @echo connectedLampCount */ || 3,
    APIKey = '/* @echo APIKey */' || 'API key';

// set Hue bridge IP address and API key to use for test suite
hue.setIpAndApiKey(IPAddress, APIKey);

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
    var data = hue.dim(connectedLampCount);
    deepEqual(data, { bri: 244 });
});

module( "brighten" );
test("test return data", function() {
    hue.setBrightness(3, 254);
    hue.dim(3, 50);
    var data = hue.brighten(3, 50);
    deepEqual(data, fullBrightness);
});