/*global module */
module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/**/*.js',
                'test/**/*.js'
            ]
        },
        nodeunit: {
            tests: ['test/test_*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', [
        'jshint',
        'nodeunit'
    ]);


    grunt.registerTask('default', ['test']);
};