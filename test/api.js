"use strict";

var expect = require("chai").expect;
var Schema = require('../index.js');
var YamlReader = require('../lib/readers/yaml.reader.js');

describe('db-kit.schema', function() {

	describe('#instance()', function() {

		it('should return an instance of Schema', function() {

			expect(Schema.instance())
				.to.be.an.instanceof(Schema);

		});

	});

	describe('#YamlReader()', function() {

		it('should return an instance of YamlReader', function() {

			expect(Schema.instance().YamlReader())
				.to.be.an.instanceof(YamlReader);

		});

	});

});