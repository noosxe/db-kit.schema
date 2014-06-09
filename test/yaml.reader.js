"use strict";

var expect = require('chai').expect;
var reader = require('../lib/readers/yaml.reader.js');
var path = require('path');

describe('yaml.reader', function() {

	describe('#instance()', function() {

		it('should return an instance of YamlReader', function() {
			expect(reader.instance()).to.be.an.instanceof(reader);
		});

	});

	describe('#readFile()', function() {

		it('should call the callback function when done', function(done) {
			reader.instance().readFile(path.join(__dirname, 'schemas/schema-single.yml'), done);
		});

		it('should return en error if the file is not found', function(done) {
			var r = reader.instance();
			r.readFile('', function(err, doc) {
				expect(err.message).to.be.equal('File not found');
				done();
			});
		});

		it('should return proper js object', function(done) {
			var r = reader.instance();
			r.readFile(path.join(__dirname, 'schemas/schema-single.yml'), function(err, doc) {
				expect(doc).to.be.deep.equal({ User:
				{ type: 'collection',
					fields:
					{ email: 'string',
						password: {
							type: 'string',
							length: 50
						},
						birthdate: 'date',
						active: 'bool',
						firstName: 'string',
						lastName: 'string',
						bio: {
							type: 'text',
							optional: true
						},
						balance: 'double' },
					options: { timestamps: true } } });
				done();
			});
		});

	});

	describe('#filterDoc()', function() {

		it('should split collection type objects from doc', function(done) {
			var r = reader.instance();
			r.readFile(path.join(__dirname, 'schemas/schema-single.yml'), function(err, doc) {
				var filtered = r.filterDoc(doc);
				expect(filtered).to.be.deep.equal({
					collections: {
						User: {
							fields: {
								email: 'string',
								password: {
									type: 'string',
									length: 50
								},
								birthdate: 'date',
								active: 'bool',
								firstName: 'string',
								lastName: 'string',
								bio: {
									type: 'text',
									optional: true
								},
								balance: 'double'
							},
							options: { timestamps: true }
						}
					}
				});
				done();
			});
		});

	});

});