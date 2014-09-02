module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
        files: ['js/*.js','test/spec/*.js'],
        tasks: ['jshint','jsdoc','jasmine:coverage','jasmine:pivotal:build'],
      },
    },
    jshint: {
      all: ['Gruntfile.js','js/*.js'],
      force: 'true',
      jshintrc: 'true'
    },
    jsdoc: {
      dist : {
        src: ['js/*.js', 'test/*.js'], 
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
        src: 'js/*.js',
        options: {
	  specs: 'test/spec/*Spec.js',
	  helpers: 'test/spec/*Helper.js',
	  outfile: 'test/SpecRunner.html',
	  keepRunner: true,
	  display: 'full'
        }
      },
      coverage: {
        src: 'js/*.js',
	files: ['js/*.js','!js/modernizr-2.6.2-respond-1.1.0.min.js'],
	options: {
	  specs: 'test/spec/*Spec.js',
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
  grunt.registerTask('test', ['jshint', 'jasmine']);
  grunt.registerTask('test:coverage', ['jasmine:coverage']);
};
