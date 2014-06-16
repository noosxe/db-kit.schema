"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var expect = chai.expect;
var reader = require('../lib/readers/yaml.reader.js');
var path = require('path');

describe('yaml.reader', function () {

	describe('#instance()', function () {

		it('should return an instance of YamlReader', function () {
			expect(reader.instance()).to.be.an.instanceof(reader);
		});

	});

	describe('#readFile()', function () {

		it('should resolve promise when done', function () {
			return reader.instance().readFile(path.join(__dirname, 'schemas/schema-single.yml'));
		});

		it('should return en error if the file is not found', function () {
			return expect(reader.instance().readFile('')).to.be.rejected;
		});

		it('should return proper js object', function () {
			return expect(reader.instance().readFile(path.join(__dirname, 'schemas/schema-single.yml')))
				.to.eventually.be.deep.equal({
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
							balance: 'double'
						},
						options: {
							timestamps: true
						}
					}
				});
		});

		it('should return proper js object for multi definition files', function () {
			return expect(reader.instance().readFile(path.join(__dirname, 'schemas/schema-relations.yml')))
				.to.eventually.be.deep.equal({
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
		});
	});

	describe('#filterDoc()', function () {

		it('should split collection type objects from doc', function () {
			var p = path.join(__dirname, 'schemas/schema-single.yml');
			var r = reader.instance();
			return expect(r.readFile(p).then(r.filterDoc))
				.to.eventually.be.deep.equal({
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
		});

		it('should split multiple collection type objects from doc', function () {
			var p = path.join(__dirname, 'schemas/schema-relations.yml');
			var r = reader.instance();

			return expect(r.readFile(p).then(r.filterDoc))
				.to.eventually.be.deep.equal({
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
		});

		it('should split connection type objects', function () {
			var p = path.join(__dirname, 'schemas/schema-relations-many.yml');
			var r = reader.instance();
			return expect(r.readFile(p).then(r.filterDoc).then(function (doc) {
				return doc.connections;
			}))
				.to.eventually.deep.equal({
					UserProject: {
						manyToMany: true,
						from: 'User',
						to: 'Project',
						tableName: 'user_project'
					}
				});
		});

	});

	describe('#normalizeDoc()', function () {

		it('should properly normalize collection type objects', function () {
			var p = path.join(__dirname, 'schemas/schema-single.yml');
			var r = reader.instance();

			return expect(r.readFile(p).then(r.filterDoc).then(r.normalizeDoc))
				.to.eventually.be.deep.equal({
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
		});

		it('should properly normalize collection type objects with references', function () {
			var p = path.join(__dirname, 'schemas/schema-relations.yml');
			var r = reader.instance();

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

			return expect(r.readFile(p).then(r.filterDoc).then(r.normalizeDoc))
				.to.eventually.be.deep.equal({
					collections: {
						User: User,
						Schedule: Schedule
					}
				});
		});

		it('should properly normalize connection type objects', function () {
			var p = path.join(__dirname, 'schemas/schema-relations-many.yml');
			var r = reader.instance();

			var User = { fields: { email: { type: 'STRING',
				primary: false,
				autoIncrement: false,
				optional: false,
				readOnly: false,
				hidden: false,
				service: false },
				password: { type: 'STRING',
					length: 50,
					primary: false,
					autoIncrement: false,
					optional: false,
					readOnly: false,
					hidden: false,
					service: false },
				birthdate: { type: 'DATE',
					primary: false,
					autoIncrement: false,
					optional: false,
					readOnly: false,
					hidden: false,
					service: false },
				active: { type: 'BOOL',
					primary: false,
					autoIncrement: false,
					optional: false,
					readOnly: false,
					hidden: false,
					service: false },
				firstName: { type: 'STRING',
					primary: false,
					autoIncrement: false,
					optional: false,
					readOnly: false,
					hidden: false,
					service: false },
				lastName: { type: 'STRING',
					primary: false,
					autoIncrement: false,
					optional: false,
					readOnly: false,
					hidden: false,
					service: false },
				bio: { type: 'TEXT',
					optional: true,
					primary: false,
					autoIncrement: false,
					readOnly: false,
					hidden: false,
					service: false },
				balance: { type: 'DOUBLE',
					primary: false,
					autoIncrement: false,
					optional: false,
					readOnly: false,
					hidden: false,
					service: false },
				id: { type: 'INT',
					primary: true,
					autoIncrement: true,
					optional: false,
					readOnly: true,
					hidden: false,
					service: true },
				createdAt: { type: 'TIMESTAMP',
					primary: false,
					autoIncrement: false,
					optional: false,
					readOnly: true,
					hidden: false,
					service: true },
				updatedAt: { type: 'TIMESTAMP',
					primary: false,
					autoIncrement: false,
					optional: false,
					readOnly: true,
					hidden: false,
					service: true,
					default: 'CURRENT_TIMESTAMP',
					onUpdate: 'CURRENT_TIMESTAMP' } },
				options: { timestamps: true, collectionName: 'User' },
				primaryKey: 'id' };

			var Project = { fields: { name: { type: 'STRING',
				primary: false,
				autoIncrement: false,
				optional: false,
				readOnly: false,
				hidden: false,
				service: false },
				importance: { type: 'INT',
					primary: false,
					autoIncrement: false,
					optional: false,
					readOnly: false,
					hidden: false,
					service: false },
				complete: { type: 'DOUBLE',
					primary: false,
					autoIncrement: false,
					optional: false,
					readOnly: false,
					hidden: false,
					service: false },
				id: { type: 'INT',
					primary: true,
					autoIncrement: true,
					optional: false,
					readOnly: true,
					hidden: false,
					service: true },
				createdAt: { type: 'TIMESTAMP',
					primary: false,
					autoIncrement: false,
					optional: false,
					readOnly: true,
					hidden: false,
					service: true },
				updatedAt: { type: 'TIMESTAMP',
					primary: false,
					autoIncrement: false,
					optional: false,
					readOnly: true,
					hidden: false,
					service: true,
					default: 'CURRENT_TIMESTAMP',
					onUpdate: 'CURRENT_TIMESTAMP' } },
				options: { timestamps: true, collectionName: 'Project' },
				primaryKey: 'id'};

			return expect(r.readFile(p).then(r.filterDoc).then(function (doc) {
				return r.normalizeDoc(doc).connections;
			})).to.eventually.be.deep.equal({
					UserProject: {
						manyToMany: true,
						from: User,
						to: Project,
						tableName: 'user_project'
					}
				});
		});
	});
});