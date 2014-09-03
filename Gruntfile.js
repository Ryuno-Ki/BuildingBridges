module.exports = function(grunt) {
'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      src: 'js/*.js',
      specs: 'test/specs/*Spec.js',
      helpers: 'test/helpers/*Helper.js',
      fixtures: 'test/fixtures/*Helper.js'
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      },
    },
    watch: {
      scripts: {
        files: ['<%= meta.src %>','<%= meta.specs %>'],
        tasks: ['jshint','jsdoc','jasmine:coverage','jasmine:pivotal:build'],
      },
    },
    jshint: {
      all: ['Gruntfile.js','<%= meta.src %>'],
      force: 'true',
      jshintrc: 'true'
    },
    jsdoc: {
      dist : {
        src: ['<%= meta.src %>'], 
        options: {
          destination: 'doc/',
	  private: true
        }
      }
    },
    notify_hooks: {
      options: {
        enabled: true,
	title: 'Grunt for Bridges'
      }
    },
    jasmine: {
      pivotal: {
        src: '<%= meta.src %>',
        options: {
	  specs: '<%= meta.specs %>',
	  helpers: '<%= meta.helpers %>',
	  outfile: 'test/SpecRunner.html',
	  keepRunner: true,
	  display: 'full'
        },
        vendor: ['node_modules/jquery/dist/jquery.min.js']
      },
      coverage: {
        src: '<%= meta.src %>',
	files: ['<%= meta.src %>','!js/modernizr-2.6.2-respond-1.1.0.min.js'],
	options: {
	  specs: '<%= meta.specs %>',
	  display: 'full',
          template: require('grunt-template-jasmine-istanbul'),
	  templateOptions: {
	    coverage: 'bin/coverage/coverage.json',
	    report: [
              {
                type: 'html',
                options: {
                  dir: 'bin/coverage/html'
                }
              },
	      {
	        type: 'cobertura',
		options: {
		  dir: 'bin/coverage/cobertura'
                }
              },
              {
                type: 'text-summary'
              }
            ]
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-notify');

  // Default task(s).
  grunt.registerTask('default', ['jshint','uglify','watch']);
  grunt.registerTask('dev', ['notify_hooks','watch']);
  grunt.registerTask('doc', ['jsdoc']);
  grunt.registerTask('test', ['jshint', 'jasmine']);
  grunt.registerTask('test:coverage', ['jasmine:coverage']);
};
