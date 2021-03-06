/*global module */
module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        name: grunt.file.readJSON("package.json").name || "grunt-ovh-translation",
        nodeunit: {
            tests: ['test/test_*.js']
        },
        // To release
        bump: {
            options: {
                pushTo: "origin",
                files: [
                    "package.json"
                ],
                updateConfigs: ["pkg"],
                commitFiles: ["-a"]
            }
        }
    });

    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.registerTask('test', [
        'nodeunit'
    ]);


    grunt.registerTask('default', ['test']);

    // Increase version number. Type = minor|major|patch
    grunt.registerTask("release", "Release", function () {
        var type = grunt.option("type");

        if (type && ~["patch", "minor", "major"].indexOf(type)) {
            grunt.task.run(["bump-only:" + type]);
        } else {
            grunt.verbose.or.write("You try to release in a weird version type [" + type + "]").error();
            grunt.fail.warn("Please try with --type=patch|minor|major");
        }
    });

};
