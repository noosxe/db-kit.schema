"use strict";

var fs = require('fs');
var yaml = require('js-yaml');
var _ = require('lodash');
var Promise = require("bluebird");
var dataTypes = require('./../dataTypes.js');

Promise.promisifyAll(fs);

/**
 * YamlReader
 * @constructor
 */
var YamlReader = function() {};

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
 */
YamlReader.prototype.readFile = function(path) {
	return fs.readFileAsync(path, 'utf8').then(yaml.safeLoad);
};

/**
 * Filters doc objects by their type
 * @param doc
 * @returns {{}}
 */
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
			case 'connection': {
				delete obj.type;
				result.connections = result.connections || {};
				result.connections[name] = obj;
			}
				break;
		}
	});

	return result;
};

/**
 * Normalize doc objects
 * @param doc
 * @returns {*}
 */
YamlReader.prototype.normalizeDoc = function(doc) {
	_.forEach(doc.collections, function(collection, collectionName) {
		_.forEach(collection.fields, function(field, name) {
			var pField = field;

			if (_.isString(field)) {
				if (field.indexOf('$') === 0) {
					return;
				} else {
					pField = { type: field };
				}
			}

			pField.type = pField.type.toUpperCase();
			pField = _.defaults(pField, {
				primary: false,
				autoIncrement: false,
				optional: false,
				readOnly: false,
				hidden: false,
				service: false,
				default: null,
				multilang: false,
				length: dataTypes[pField.type].length
			});

			if (pField.primary) {
				collection.primaryKey = name;
			}

			collection.fields[name] = pField;
		});

		_.defaults(collection.options, {
			timestamps: false,
			collectionName: collectionName,
			tableName: collectionName,
			createdAt: collection.options.timestamps ? 'createdAt' : null,
			updatedAt: collection.options.timestamps ? 'updatedAt' : null
		});

		_.defaults(collection, {
			primaryKey: 'id'
		});

		if (!collection.fields[collection.primaryKey]) {
			collection.fields[collection.primaryKey] = {
				type: 'INT',
				primary: true,
				autoIncrement: true,
				optional: false,
				readOnly: true,
				hidden: false,
				service: true,
				default: null,
				multilang: false,
				length: null
			};
		}

		if (collection.options.timestamps) {
			collection.fields[collection.options.createdAt] = {
				type: 'TIMESTAMP',
				primary: false,
				autoIncrement: false,
				optional: false,
				readOnly: true,
				hidden: false,
				service: true,
				default: null,
				multilang: false,
				length: null
			};

			collection.fields[collection.options.updatedAt] = {
				type: 'TIMESTAMP',
				primary: false,
				autoIncrement: false,
				optional: false,
				readOnly: true,
				hidden: false,
				service: true,
				multilang: false,
				length: null,
				default: 'CURRENT_TIMESTAMP',
				onUpdate: 'CURRENT_TIMESTAMP'
			};
		}
	});

	_.forEach(doc.collections, function(collection) {
		_.forEach(collection.fields, function(field, name) {
			var pField = field;

			if (_.isString(field) && field.indexOf('$') === 0) {
				var refName = field.replace('$', '');
				var refCollection = doc.collections[refName];
				var refPk = refCollection.primaryKey;
				var refPkField = refCollection.fields[refPk];

				pField = {
					type: refPkField.type,
					primary: false,
					autoIncrement: false,
					optional: false,
					readOnly: false,
					hidden: false,
					service: false,
					multilang: false,
					default: null,
					length: null,
					reference: {
						collection: refName,
						field: refPk
					}
				};

				collection.dependencies = collection.dependencies || [];
				collection.dependencies.push(refCollection);
			} else {
				return;
			}

			collection.fields[name] = pField;
		});
	});

	_.forEach(doc.connections, function(connection, name) {
		if (!connection.parent) throw new Error('no parent specified in connection');
		if (!connection.child) throw new Error('no child specified in connection');
		if (!connection.accessor) throw new Error('no accessor property specified in connection');
		if (connection.parent.charAt(0) != '$') throw new Error('connection parent name should start from $ sign');
		if (connection.child.charAt(0) != '$') throw new Error('connection child name should start from $ sign');

		connection.parent = doc.collections[connection.parent.slice(1)];
		connection.child = doc.collections[connection.child.slice(1)];
		connection.tableName = connection.tableName || name;
	});

	return doc;
};

module.exports = YamlReader;