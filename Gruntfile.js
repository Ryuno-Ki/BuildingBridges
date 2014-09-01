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
        tasks: ['jshint','jsdoc', 'jasmine:pivotal:build'],
      },
    },
    jshint: {
      all: ['Gruntfile.js'],
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
	  keepRunner: true
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
  grunt.registerTask('dev', ['notify_hooks','jshint', 'jasmine','watch']);
  grunt.registerTask('test', ['jshint', 'jasmine']);
};
