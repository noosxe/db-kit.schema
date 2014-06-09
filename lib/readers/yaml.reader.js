"use strict";

var fs = require('fs');
var yaml = require('js-yaml');
var _ = require('lodash');

/**
 * YamlReader
 * @constructor
 */
var YamlReader = function() {

};

/**
 * Creates an instance of YamlReader with default properties
 * @returns {YamlReader}
 */
YamlReader.instance = function() {
	return new YamlReader();
};

/**
 *
 * Asynchronously reads a yaml file with the path specified
 * @param {string} path
 * @param {function} done
 */
YamlReader.prototype.readFile = function(path, done) {
	fs.exists(path, function (exists) {
		if (!exists) {
			done(new Error('File not found'), null);
		} else {
			fs.readFile(path, 'utf8', function(err, data) {
				if (err) {
					done(err);
					return;
				}
				var doc = yaml.safeLoad(data);
				done(null, doc);
			});
		}
	});
};

YamlReader.prototype.filterDoc = function(doc) {
	var result = {};

	_.forEach(doc, function(obj, name) {
		switch (obj.type) {
			case 'collection': {
				delete obj.type;
				result.collections = result.collections || {};
				result.collections[name] = obj;
			}
				break;
		}
	});

	return result;
};

module.exports = YamlReader;