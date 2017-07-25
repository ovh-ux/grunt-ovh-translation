/*global module, require*/
module.exports = function(grunt) {
    'use strict';

    grunt.registerMultiTask('ovhTranslation', 'Transform XML to JSON', function() {

        var self = this;
        var Xml2json = require('../lib/ovh-translation.js');
        var path = require('path');
        var translationParser = new Xml2json({
            gruntInstance:grunt,
            keepEntities: true
        });

        /**
         * Extend destFilename json with the content of srcFilename json
         * @param destFilename
         * @param srcFilename
         * @return {boolean} true if changes on destination
         */
        var extendJson = function(destFilename, srcFilename) {
            var changes = false;
            var dest = grunt.file.readJSON(destFilename);
            var src = grunt.file.readJSON(srcFilename);
            for (var key in src) {
                if ((src.hasOwnProperty(key)) && (!dest.hasOwnProperty(key))) {
                    dest[key] = src[key];
                    changes = true;
                }
            }
            if (changes) {
                grunt.verbose.ok('Extending translation ' + destFilename + ' with ' + path.basename(srcFilename));
                grunt.file.write(destFilename, JSON.stringify(dest));
            }
            return changes;
        };

        /**
         * Generate JSON translation files from XML
         */
        var task_generateTranslation = function() {
            grunt.verbose.subhead('Writing translations => ' + self.target);
            self.files.forEach(function (d) {

                var jsonFile = translationParser.changeExtension(d.dest, 'json');
                var xmlFiles = d.src;

                grunt.verbose.ok('Writing translation ' + jsonFile);

                var str = '';
                for (var i=0; i<xmlFiles.length; i++) {
                    str += translationParser.xmlFileToJson(xmlFiles[i]);
                }

                grunt.file.write(jsonFile, str);
            });
        };

        /**
         * Extend the translations
         * field extendFrom must by an array of languages (ie. ['en_GB', 'fr_FR'])
         */
        var task_extendTranslation = function() {
            grunt.verbose.subhead('Extending translations => ' + self.target);
            self.files.forEach(function (d) {
                var jsonFile = translationParser.changeExtension(d.dest, 'json');
                if (d.extendFrom) {
                    d.extendFrom.forEach(function(lang) {
                        var sourceFile= jsonFile.replace(/_[a-z]{2}_[A-Z]{2}/, '_' + lang);
                        if (grunt.file.exists(sourceFile)) {
                            extendJson(jsonFile, sourceFile);
                        } else {
                            grunt.verbose.error(lang + ' could not be found in ' + sourceFile);
                        }
                    });
                }
            });
        };

        /**
         * Lint translations files
         */
        var task_lintTranslation = function () {
            var xmlParser = require("node-xml-lite");

            self.files.forEach(function (d) {
                if (d.lint === false) {
                    return;
                }

                var xmlFiles = d.src;
                var str = '';

                for (var i=0; i<xmlFiles.length; i++) {

                    var xmlFileContent = grunt.file.read(xmlFiles[i]);

                    if (Array.isArray(d.lint) && /Messages_(\w+)\.xml$/.test(xmlFiles[i]) && !~d.lint.indexOf(xmlFiles[i].match(/Messages_(\w+)\.xml$/)[1])) {
                        return;
                    }

                    // Check file globally

                    // Must not be indented with tabs
                    if (/^\t+<translation[^s]/gm.test(xmlFileContent)) {
                        grunt.fail.warn("Your translation must not be indented with <tab>, use spaces instead (file: " + xmlFiles[i] + ").");
                    }

                    // CR at the end of the file
                    if (!/<\/translations>\n/gm.test(xmlFileContent)) {
                        grunt.fail.warn("Your translation file must have a linebreak at the end of the file (file: " + xmlFiles[i] + ").");
                    }

                    // CR into a translation tag
                    if (/<translation[^>]+\n+[^>]+>/gm.test(xmlFileContent)) {
                        grunt.fail.warn("The translation tag must not have linebreak (file: " + xmlFiles[i] + ").");
                    }

                    var parsedData;
                    try {
                        var strToParse = xmlFileContent.replace(/&/g, '&amp;');
                        parsedData = xmlParser.parseString(strToParse);
                    } catch (e) {
                        var pointingError;
                        var matcher = ("" + e).match(/line:\s*(\d*),\s*col:\s*(\d*)/);
                        if (matcher) {
                            var line = parseInt(matcher[1], 10);
                            var col = parseInt(matcher[2], 10);
                            var lines = strToParse.split("\n");
                            pointingError = "\n     " + lines[line];
                            pointingError += "\n" + new Array(col+6).join("-") + "^\nLine: " + (line + 1) + "\tCol: " + (col + 1) + "\n";
                        }
                        return grunt.fail.warn("Error while parsing XML (file: " + xmlFiles[i] + ").\n" + (pointingError || e));
                    }

                    if ((parsedData) && (parsedData.name === 'translations') && parsedData.childs) {
                        for (var j=0; j<parsedData.childs.length; j++) {
                            var entry = parsedData.childs[j];
                            // the child nodes must be 'translation' and must have an attribute 'id'
                            if ((entry.name === 'translation') && (entry.attrib) && (entry.attrib.id) && (entry.childs)) {
                                var value = translationParser.parsedDataToString(entry.childs);

                                // Check ID
                                if (!/^[\w\.+-]+$/.test(entry.attrib.id)) {
                                    grunt.fail.warn("The translation ID \"" + entry.attrib.id + "\" is malformed (file: " + xmlFiles[i] + ").");
                                }

                                // Check value
                                if (!/^[^*]*$/.test(value)) {
                                    console.log(value);
                                    grunt.fail.warn("The value of the translation with ID \"" + entry.attrib.id + "\" contain an asterisk (*) (file: " + xmlFiles[i] + ").");
                                }
                            }
                        }
                    }
                }
            });
        };

        /******************************************************/
        /**  Performing actions on files                      */
        /******************************************************/

        // Lint translations files
        task_lintTranslation();

        // translate xml to json
        task_generateTranslation();

        // extending translations
        task_extendTranslation();

    });
};
