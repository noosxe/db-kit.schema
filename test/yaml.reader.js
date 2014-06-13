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

		it('should return proper js object for multi definition files', function(done) {
			var r = reader.instance();
			r.readFile(path.join(__dirname, 'schemas/schema-relations.yml'), function(err, doc) {
				expect(doc).to.be.deep.equal({
					User: {
						type: 'collection',
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
							balance: 'double',
							schedule: '$Schedule'
						},
						options: {
							timestamps: true
						}
					},
					Schedule: {
						type: 'collection',
						fields: {
							type: 'string',
							startDate: 'date',
							endDate: 'date',
							repeated: 'bool'
						},
						options: {
							timestamps: true
						}
					}
				});
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

		it('should split multiple collection type objects from doc', function(done) {
			var r = reader.instance();
			r.readFile(path.join(__dirname, 'schemas/schema-relations.yml'), function(err, doc) {
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
								balance: 'double',
								schedule: '$Schedule'
							},
							options: {
								timestamps: true
							}
						},
						Schedule: {
							fields: {
								type: 'string',
								startDate: 'date',
								endDate: 'date',
								repeated: 'bool'
							},
							options: {
								timestamps: true
							}
						}
					}
				});
				done();
			});
		});

	});

	describe('#normalizeDoc()', function() {

		it('should properly normalize collection type objects', function(done) {
			var r = reader.instance();
			r.readFile(path.join(__dirname, 'schemas/schema-single.yml'), function(err, doc) {
				var filtered = r.filterDoc(doc);
				var normalized = r.normalizeDoc(filtered);
				expect(normalized).to.be.deep.equal({
					collections: {
						User: {
							fields: {
								id: {
									type: "INT",
									autoIncrement: true,
									hidden: false,
									optional: false,
									primary: true,
									readOnly: true,
									service: true
								},
								email: {
									type: 'STRING',
									primary: false,
									autoIncrement: false,
									optional: false,
									readOnly: false,
									hidden: false,
									service: false
								},
								password: {
									type: 'STRING',
									length: 50,
									primary: false,
									autoIncrement: false,
									optional: false,
									readOnly: false,
									hidden: false,
									service: false
								},
								birthdate: {
									type: 'DATE',
									primary: false,
									autoIncrement: false,
									optional: false,
									readOnly: false,
									hidden: false,
									service: false
								},
								active: {
									type: 'BOOL',
									primary: false,
									autoIncrement: false,
									optional: false,
									readOnly: false,
									hidden: false,
									service: false
								},
								firstName: {
									type: 'STRING',
									primary: false,
									autoIncrement: false,
									optional: false,
									readOnly: false,
									hidden: false,
									service: false
								},
								lastName: {
									type: 'STRING',
									primary: false,
									autoIncrement: false,
									optional: false,
									readOnly: false,
									hidden: false,
									service: false
								},
								bio: {
									type: 'TEXT',
									primary: false,
									autoIncrement: false,
									optional: true,
									readOnly: false,
									hidden: false,
									service: false
								},
								balance: {
									type: 'DOUBLE',
									primary: false,
									autoIncrement: false,
									optional: false,
									readOnly: false,
									hidden: false,
									service: false
								},
								createdAt: {
									type: 'TIMESTAMP',
									primary: false,
									autoIncrement: false,
									optional: false,
									readOnly: true,
									hidden: false,
									service: true
								},
								updatedAt: {
									type: 'TIMESTAMP',
									primary: false,
									autoIncrement: false,
									optional: false,
									readOnly: true,
									hidden: false,
									service: true,
									default: 'CURRENT_TIMESTAMP',
									onUpdate: 'CURRENT_TIMESTAMP'
								}
							},
							options: {
								timestamps: true,
								collectionName: 'User'
							},
							primaryKey: 'id'
						}
					}
				});
				done();
			});
		});

		it('should properly normalize collection type objects with references', function(done) {
			var r = reader.instance();
			r.readFile(path.join(__dirname, 'schemas/schema-relations.yml'), function(err, doc) {
				var filtered = r.filterDoc(doc);
				var normalized = r.normalizeDoc(filtered);

				var Schedule = {
					fields: {
						id: {
							type: "INT",
							autoIncrement: true,
							hidden: false,
							optional: false,
							primary: true,
							readOnly: true,
							service: true
						},
						type: {
							type: "STRING",
							autoIncrement: false,
							hidden: false,
							optional: false,
							primary: false,
							readOnly: false,
							service: false
						},
						startDate: {
							type: "DATE",
							autoIncrement: false,
							hidden: false,
							optional: false,
							primary: false,
							readOnly: false,
							service: false
						},
						endDate: {
							type: "DATE",
							autoIncrement: false,
							hidden: false,
							optional: false,
							primary: false,
							readOnly: false,
							service: false
						},
						repeated: {
							type: "BOOL",
							autoIncrement: false,
							hidden: false,
							optional: false,
							primary: false,
							readOnly: false,
							service: false
						},
						createdAt: {
							type: 'TIMESTAMP',
							primary: false,
							autoIncrement: false,
							optional: false,
							readOnly: true,
							hidden: false,
							service: true
						},
						updatedAt: {
							type: 'TIMESTAMP',
							primary: false,
							autoIncrement: false,
							optional: false,
							readOnly: true,
							hidden: false,
							service: true,
							default: 'CURRENT_TIMESTAMP',
							onUpdate: 'CURRENT_TIMESTAMP'
						}
					},
					options: {
						timestamps: true,
						collectionName: 'Schedule'
					},
					primaryKey: 'id'
				};

				var User = {
					fields: {
						id: {
							type: "INT",
							autoIncrement: true,
							hidden: false,
							optional: false,
							primary: true,
							readOnly: true,
							service: true
						},
						email: {
							type: 'STRING',
							primary: false,
							autoIncrement: false,
							optional: false,
							readOnly: false,
							hidden: false,
							service: false
						},
						password: {
							type: 'STRING',
							length: 50,
							primary: false,
							autoIncrement: false,
							optional: false,
							readOnly: false,
							hidden: false,
							service: false
						},
						birthdate: {
							type: 'DATE',
							primary: false,
							autoIncrement: false,
							optional: false,
							readOnly: false,
							hidden: false,
							service: false
						},
						active: {
							type: 'BOOL',
							primary: false,
							autoIncrement: false,
							optional: false,
							readOnly: false,
							hidden: false,
							service: false
						},
						firstName: {
							type: 'STRING',
							primary: false,
							autoIncrement: false,
							optional: false,
							readOnly: false,
							hidden: false,
							service: false
						},
						lastName: {
							type: 'STRING',
							primary: false,
							autoIncrement: false,
							optional: false,
							readOnly: false,
							hidden: false,
							service: false
						},
						bio: {
							type: 'TEXT',
							primary: false,
							autoIncrement: false,
							optional: true,
							readOnly: false,
							hidden: false,
							service: false
						},
						balance: {
							type: 'DOUBLE',
							primary: false,
							autoIncrement: false,
							optional: false,
							readOnly: false,
							hidden: false,
							service: false
						},
						schedule: {
							type: 'INT',
							primary: false,
							autoIncrement: false,
							optional: false,
							readOnly: false,
							hidden: false,
							service: false,
							reference: {
								collection: 'Schedule',
								field: 'id'
							}
						},
						createdAt: {
							type: 'TIMESTAMP',
							primary: false,
							autoIncrement: false,
							optional: false,
							readOnly: true,
							hidden: false,
							service: true
						},
						updatedAt: {
							type: 'TIMESTAMP',
							primary: false,
							autoIncrement: false,
							optional: false,
							readOnly: true,
							hidden: false,
							service: true,
							default: 'CURRENT_TIMESTAMP',
							onUpdate: 'CURRENT_TIMESTAMP'
						}
					},
					options: {
						timestamps: true,
						collectionName: 'User'
					},
					primaryKey: 'id',
					dependencies: [ Schedule ]
				};

				expect(normalized).to.be.deep.equal({
					collections: {
						User: User,
						Schedule: Schedule
					}
				});
				done();
			});
		});

	});

});