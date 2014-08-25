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
								bio: 'text',
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
								bio: 'text',
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
									bio: 'text',
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
									bio: 'text',
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
							parent: '$User',
							child: '$Project',
							accessor: 'projects',
							tableName: 'link_user_projects'
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
										service: true,
										multilang: false,
										default: undefined,
										length: undefined
									},
									email: {
										type: 'STRING',
										primary: false,
										autoIncrement: false,
										optional: true,
										readOnly: false,
										hidden: false,
										service: false,
										multilang: false,
										default: undefined,
										length: 255
									},
									password: {
										type: 'STRING',
										length: 50,
										primary: false,
										autoIncrement: false,
										optional: true,
										readOnly: false,
										hidden: false,
										service: false,
										multilang: false,
										default: undefined
									},
									birthdate: {
										type: 'DATE',
										primary: false,
										autoIncrement: false,
										optional: true,
										readOnly: false,
										hidden: false,
										service: false,
										multilang: false,
										default: undefined,
										length: undefined
									},
									active: {
										type: 'BOOL',
										primary: false,
										autoIncrement: false,
										optional: true,
										readOnly: false,
										hidden: false,
										service: false,
										multilang: false,
										default: undefined,
										length: undefined
									},
									firstName: {
										type: 'STRING',
										primary: false,
										autoIncrement: false,
										optional: true,
										readOnly: false,
										hidden: false,
										service: false,
										multilang: false,
										default: undefined,
										length: 255
									},
									lastName: {
										type: 'STRING',
										primary: false,
										autoIncrement: false,
										optional: true,
										readOnly: false,
										hidden: false,
										service: false,
										multilang: false,
										default: undefined,
										length: 255
									},
									bio: {
										type: 'TEXT',
										primary: false,
										autoIncrement: false,
										optional: true,
										readOnly: false,
										hidden: false,
										service: false,
										multilang: false,
										default: undefined,
										length: undefined
									},
									balance: {
										type: 'DOUBLE',
										primary: false,
										autoIncrement: false,
										optional: true,
										readOnly: false,
										hidden: false,
										service: false,
										multilang: false,
										default: undefined,
										length: undefined
									},
									createdAt: {
										type: 'TIMESTAMP',
										primary: false,
										autoIncrement: false,
										optional: false,
										readOnly: true,
										hidden: false,
										service: true,
										multilang: false,
										default: undefined,
										length: undefined
									},
									updatedAt: {
										type: 'TIMESTAMP',
										primary: false,
										autoIncrement: false,
										optional: false,
										readOnly: true,
										hidden: false,
										service: true,
										multilang: false,
										length: undefined,
										default: 'CURRENT_TIMESTAMP',
										onUpdate: 'CURRENT_TIMESTAMP'
									}
								},
								options: {
									timestamps: true,
									collectionName: 'User',
									tableName: 'User',
									createdAt: 'createdAt',
									updatedAt: 'updatedAt',
									isTree: false
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
						service: true,
						multilang: false,
						default: undefined,
						length: undefined
					},
					type: {
						type: "STRING",
						autoIncrement: false,
						hidden: false,
						optional: true,
						primary: false,
						readOnly: false,
						service: false,
						multilang: false,
						default: undefined,
						length: 255
					},
					startDate: {
						type: "DATE",
						autoIncrement: false,
						hidden: false,
						optional: true,
						primary: false,
						readOnly: false,
						service: false,
						multilang: false,
						default: undefined,
						length: undefined
					},
					endDate: {
						type: "DATE",
						autoIncrement: false,
						hidden: false,
						optional: true,
						primary: false,
						readOnly: false,
						service: false,
						multilang: false,
						default: undefined,
						length: undefined
					},
					repeated: {
						type: "BOOL",
						autoIncrement: false,
						hidden: false,
						optional: true,
						primary: false,
						readOnly: false,
						service: false,
						multilang: false,
						default: undefined,
						length: undefined
					},
					createdAt: {
						type: 'TIMESTAMP',
						primary: false,
						autoIncrement: false,
						optional: false,
						readOnly: true,
						hidden: false,
						service: true,
						multilang: false,
						default: undefined,
						length: undefined
					},
					updatedAt: {
						type: 'TIMESTAMP',
						primary: false,
						autoIncrement: false,
						optional: false,
						readOnly: true,
						hidden: false,
						service: true,
						multilang: false,
						length: undefined,
						default: 'CURRENT_TIMESTAMP',
						onUpdate: 'CURRENT_TIMESTAMP'
					}
				},
				options: {
					timestamps: true,
					collectionName: 'Schedule',
					tableName: 'Schedule',
					createdAt: 'createdAt',
					updatedAt: 'updatedAt',
					isTree: false
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
						service: true,
						multilang: false,
						default: undefined,
						length: undefined
					},
					email: {
						type: 'STRING',
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined,
						length: 255
					},
					password: {
						type: 'STRING',
						length: 50,
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined
					},
					birthdate: {
						type: 'DATE',
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined,
						length: undefined
					},
					active: {
						type: 'BOOL',
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined,
						length: undefined
					},
					firstName: {
						type: 'STRING',
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined,
						length: 255
					},
					lastName: {
						type: 'STRING',
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined,
						length: 255
					},
					bio: {
						type: 'TEXT',
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined,
						length: undefined
					},
					balance: {
						type: 'DOUBLE',
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined,
						length: undefined
					},
					schedule: {
						type: 'INT',
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined,
						length: undefined,
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
						service: true,
						multilang: false,
						default: undefined,
						length: undefined
					},
					updatedAt: {
						type: 'TIMESTAMP',
						primary: false,
						autoIncrement: false,
						optional: false,
						readOnly: true,
						hidden: false,
						service: true,
						multilang: false,
						length: undefined,
						default: 'CURRENT_TIMESTAMP',
						onUpdate: 'CURRENT_TIMESTAMP'
					}
				},
				options: {
					timestamps: true,
					collectionName: 'User',
					tableName: 'User',
					createdAt: 'createdAt',
					updatedAt: 'updatedAt',
					isTree: false
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

			var User = {
				fields: {
					email: {
						type: 'STRING',
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined,
						length: 255
					},
					password: {
						type: 'STRING',
						length: 50,
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined
					},
					birthdate: {
						type: 'DATE',
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined,
						length: undefined
					},
					active: {
						type: 'BOOL',
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined,
						length: undefined
					},
					firstName: {
						type: 'STRING',
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined,
						length: 255
					},
					lastName: {
						type: 'STRING',
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined,
						length: 255
					},
					bio: {
						type: 'TEXT',
						optional: true,
						primary: false,
						autoIncrement: false,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined,
						length: undefined
					},
					balance: {
						type: 'DOUBLE',
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined,
						length: undefined
					},
					id: {
						type: 'INT',
						primary: true,
						autoIncrement: true,
						optional: false,
						readOnly: true,
						hidden: false,
						service: true,
						multilang: false,
						default: undefined,
						length: undefined
					},
					createdAt: {
						type: 'TIMESTAMP',
						primary: false,
						autoIncrement: false,
						optional: false,
						readOnly: true,
						hidden: false,
						service: true,
						multilang: false,
						default: undefined,
						length: undefined
					},
					updatedAt: {
						type: 'TIMESTAMP',
						primary: false,
						autoIncrement: false,
						optional: false,
						readOnly: true,
						hidden: false,
						service: true,
						multilang: false,
						length: undefined,
						default: 'CURRENT_TIMESTAMP',
						onUpdate: 'CURRENT_TIMESTAMP'
					}
				},
				options: {
					timestamps: true,
					collectionName: 'User',
					tableName: 'User',
					createdAt: 'createdAt',
					updatedAt: 'updatedAt',
					isTree: false
				},
				primaryKey: 'id'
			};

			var Project = {
				fields: {
					name: {
						type: 'STRING',
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						default: undefined,
						multilang: false,
						length: 255
					},
					importance: {
						type: 'INT',
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined,
						length: undefined
					},
					complete: {
						type: 'DOUBLE',
						primary: false,
						autoIncrement: false,
						optional: true,
						readOnly: false,
						hidden: false,
						service: false,
						multilang: false,
						default: undefined,
						length: undefined
					},
					id: {
						type: 'INT',
						primary: true,
						autoIncrement: true,
						optional: false,
						readOnly: true,
						hidden: false,
						service: true,
						multilang: false,
						default: undefined,
						length: undefined
					},
					createdAt: {
						type: 'TIMESTAMP',
						primary: false,
						autoIncrement: false,
						optional: false,
						readOnly: true,
						hidden: false,
						service: true,
						multilang: false,
						default: undefined,
						length: undefined
					},
					updatedAt: {
						type: 'TIMESTAMP',
						primary: false,
						autoIncrement: false,
						optional: false,
						readOnly: true,
						hidden: false,
						service: true,
						multilang: false,
						length: undefined,
						default: 'CURRENT_TIMESTAMP',
						onUpdate: 'CURRENT_TIMESTAMP'
					}
				},
				options: {
					timestamps: true,
					collectionName: 'Project',
					tableName: 'Project',
					createdAt: 'createdAt',
					updatedAt: 'updatedAt',
					isTree: false
				},
				primaryKey: 'id'
			};

			return expect(r.readFile(p).then(r.filterDoc).then(function (doc) {
				return r.normalizeDoc(doc).connections;
			})).to.eventually.be.deep.equal({
						UserProject: {
							parent: User,
							child: Project,
							accessor: 'projects',
							tableName: 'link_user_projects'
						}
					});
		});
	});
});