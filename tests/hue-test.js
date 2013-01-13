var hue = hue || window.hue,
	onState = { on: true },
	offState = { on: false };

module( "turnOnAll" );
test("test return data", function() {
	var data = hue.turnOnAll();
	deepEqual(data, onState);
});

module( "turnOffAll" );
test("test return data", function() {
	var data = hue.turnOffAll();
	deepEqual(data, offState);
});