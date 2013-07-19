module.exports = function(grunt) {

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
						IPAddress: grunt.file.readJSON('.discovered-ip').internalipaddress,
						APIKey: grunt.file.isFile('.api-key') ? grunt.file.readJSON('.api-key').apiKey : ""
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
	grunt.registerTask('test', ['jshint', 'qunit']);
	
	// test, concat and uglify for distribution
	grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

	grunt.registerTask('getBridgeIP', 'Get connected Hue bridge IP via upnp', function() {
		this.async();
		var needle = require('needle');
		needle.get('http://www.meethue.com/api/nupnp', function(error, response, body) {
			var responseJson = JSON.parse(body);
			grunt.log.writeln("Found IP: " + responseJson[0].internalipaddress);
			grunt.file.write('.discovered-ip', JSON.stringify(responseJson[0]));
		});
	});

	grunt.registerTask('setAPIKey', 'Set API key for test run', function(apiKey) {
		grunt.log.writeln("Saved api key: " + apiKey);
		grunt.file.write('.api-key', JSON.stringify({ "apiKey": apiKey }));
	});

	// init library
	grunt.registerTask('init', 'Initialize library with api key for tests', function(apiKey) {
		grunt.log.writeln('Initializing with api key: ' + apiKey);
		grunt.config.set('config.apiKey', apiKey);
		grunt.task.run(['setAPIKey:' + apiKey, 'getBridgeIP', 'preprocess']);
	});
};