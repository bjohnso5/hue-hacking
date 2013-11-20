module.exports = function(grunt) {

	function countLamps(jsonObj) {
		var i = 0;
		for(var prop in jsonObj) {
			i++;
		}
		return i;
	}

	// Project config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['src/**/*.js'],
				dest: 'dist/<%= pkg.name %>.concat.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %>.js <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %>, Copyright 2013 Bryan Johnson, Licensed MIT */'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		qunit: {
			files: ['test/**/*.html']
		},
		jshint: {
			files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
			options: {
				ignores: ['**/*.preprocessed.js'],
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true
				}
			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint', 'qunit']
		},
		preprocess: {
			js: {
				src: 'test/hue-test.preprocessed.js',
				dest: 'test/hue-test.js',
				options: {
					context: {
						IPAddress: grunt.file.isFile('.discovered-ip') ? grunt.file.readJSON('.discovered-ip').internalipaddress : "",
						APIKey: grunt.file.isFile('.api-key') ? grunt.file.readJSON('.api-key').apiKey : "",
						connectedLampCount: grunt.file.isFile('.lights') ? countLamps(grunt.file.readJSON('.lights')) : 3
					}
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	
	// test-only task
	grunt.registerTask('test', ['preprocess', 'jshint', 'qunit']);
	
	// test, concat and uglify for distribution
	grunt.registerTask('default', ['preprocess', 'jshint', 'qunit', 'concat', 'uglify']);

	grunt.registerTask('setAPIKey', 'Set API key for test run', function(apiKey) {
		grunt.log.writeln("Saved api key: " + apiKey);
		grunt.file.write('.api-key', JSON.stringify({ "apiKey": apiKey }));
	});

	grunt.registerTask('getBridgeIP', 'Get connected Hue bridge IP via upnp', function() {
		var done = this.async();
		var needle = require('needle');
		needle.get('http://www.meethue.com/api/nupnp', function(error, response, body) {
			var responseJson = JSON.parse(body);
			var ip = responseJson[0].internalipaddress;
			grunt.log.writeln("Found IP: " + ip);
			grunt.config.set('config.bridgeIP', ip);
			grunt.file.write('.discovered-ip', JSON.stringify(responseJson[0]));
			done();
		});
	});

	grunt.registerTask('discoverLampCount', 'Set number of lamps from a query of the Hue API', function() {
		var ip = grunt.file.isFile('.discovered-ip') ? grunt.file.readJSON('.discovered-ip').internalipaddress : "",
			apiKey = grunt.file.isFile('.api-key') ? grunt.file.readJSON('.api-key').apiKey : "",
			url = 'http://' + ip + '/api/' + apiKey + '/lights',
			done = this.async();
		grunt.log.writeln('URL: ' + url);
		var needle = require('needle');
		var jsonObj = null;
		needle.get(url, function(error, response, body) {
			jsonObj = JSON.parse(body);
			grunt.log.writeln("Found " + countLamps(jsonObj) + " connected lamps");
			grunt.file.write('.lights', JSON.stringify(jsonObj));
			done();
		});
	});

	// init library
	grunt.registerTask('init', 'Initialize library with api key for tests', function(apiKey) {
		grunt.log.writeln('Initializing with api key: ' + apiKey);
		grunt.config.set('config.apiKey', apiKey);
		var queuedTasks = [
			'setAPIKey:' + apiKey, 
			'getBridgeIP', 
			'discoverLampCount'
		];
		grunt.log.writeln("Queued tasks: " + queuedTasks);
		grunt.task.run(queuedTasks);
	});
};