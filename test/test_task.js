/*global require, exports*/
(function() {
    'use strict';

    var grunt = require('grunt');
    var Xml2json = require('../lib/ovh-translation.js');
    var fs = require('fs');

    exports.xml2json = {
        setUp: function (done) {
            // setup here if necessary
            done();
        },
        load: function(test) {
            var actual = require('../tasks/ovh-translation');
            var expected = 'function';
            test.equal(typeof actual, expected, 'Should export a function');
            test.done();
        },
        toObject: function (test) {
            var xml2json = new Xml2json(grunt);
            var fixture = fs.readFileSync(__dirname + '/fixture.xml').toString();

            var obj = xml2json.toObject(fixture);

            test.equal(Object.prototype.toString.call(obj), '[object Object]', 'Should return an object');
            test.equal(Object.keys(obj).length, 47, 'Should find the correct number of elements');

            test.equal(obj.hello_world, 'hello&nbsp;world', 'Should keep the xml entities');
            test.equal(obj.hello_world_again, '<a href="http://www.hello.world.com" class="my class">hello world</a>', 'Should keep the xml entities');

            test.done();
        },
        extension: function(test) {
            var xml2json = new Xml2json(grunt);
            test.equal(xml2json.changeExtension('/home/hello.world/i-am-here.xml', 'json'), '/home/hello.world/i-am-here.json', 'Should change the extension');
            test.done();
        }
    };
})();