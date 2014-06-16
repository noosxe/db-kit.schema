"use strict";

var YamlReader = require('./readers/yaml.reader.js');

/**
 * Schema class constructor
 * @constructor
 */
var Schema = function() {};

/**
 * Returns an instance of Schema
 * @returns {Schema.prototype}
 */
Schema.instance = function() {
	var schema = Object.create(Schema.prototype);
	return Schema.apply(schema, arguments) || schema;
};

/**
 * Returns an instance of YamlReader
 * @returns {YamlReader}
 * @constructor
 */
Schema.prototype.YamlReader = function() {
	return YamlReader.instance();
};

module.exports = Schema;