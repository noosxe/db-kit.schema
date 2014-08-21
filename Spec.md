db-kit schema definition spec
==================

db-kit schema definitions are written in special YAML files with `.yml` extension.

Schema definition may include collection definitions and relation definitions.

Collections
-----------

Every table in db-kit is defined as collection. Collections have fields and options.

Here is an example of collection definition that should be used in `.yml` files

```
User:
	type: collection
	fields:
		email: string
		firstName: string
    	lastName: string
    options:
    	timestamps: true
```
Each YAML file can contain multiple collection definitions.

Here `User` is the name of the collection and a table with the same name will be created to store collection items. If you need to use other name for the table, please specify `tableName` option inside `options` block.

** Fields **

Collection fields are specified in special `fields` block.
Each field is a key-value pair where key is the name of the field and value is the description of the field.

Keys are used as table column names and also as accessor names on collection items.

Values in their simplest form can be just a string naming the data type that defined field will have.

```
email: string
```

Complex definition of a field is represented as an object where key is the option name and value is the option value.

```
email:
	type: string
	length: 255
```

Field definition can have following options

| option name   | possible values | default        | description
| ------------- | --------------- | -------------- | ---------------------------------
| type          | data type       | N/A            | field data type
| primary       | true/false      | false          | is the field primary key
| autoIncrement | true/false      | false          | is the field auto incrementing
| optional      | true/false      | true           | will use "NOT NULL" if false
| readOnly      | true/false      | false          | value can not be changed
| hidden        | true/false      | false          | value will not be fetched from db until explicitly requested during #find() and #findOne() method calls
| length        | true/false      | type dependent | length of the field value
| multilang     | true/false      | false          | multilingual text support
| default       | type dependent  | N/A            | default value for the field


** Data types **

Listing of available data types and respective MySQL counterparts.

| type      | MySQL type | default length 
| --------- | ---------- | --------------
| string    | VARCHAR    | 255
| text      | TEXT       | N/A
| int       | INT        | N/A
| double    | DOUBLE     | N/A
| bool      | BOOL       | N/A
| date      | DATE       | N/A
| timestamp | TIMESTAMP  | N/A

** Options **

Options block allows configuration of collection. Possible options are presented in the table below.

| option name | possible values | default         | description
| ----------- | --------------- | --------------- | -----------
| tableName   | table name      | collection name | table name to use
| timestamps  | true/false      | false           | weather to track create and update time
| createdAt   | field name      | createdAt       | createdAt field name
| updatedAt   | field name      | updatedAt       | updatedAt field name

Relations
---------

** Many to one **

To define a collection field that points to an object from other collection you simply need to use that collection's name prefixed for dollar sign `($OtherCollection)`

```
Schedule:
	type: collection
	fields:
    	startDate: date
        endDate: date

Employee:
	type: collection
	fields:
    	firstName: string
        lastName: string
        schedule: $Schedule

```

This allows to link an employee to any single schedule.

** Many to many **

If you need to link a single object to multiple objects from the same or other collection you need to use `connection` definition.

```
Schedule:
	type: collection
	fields:
    	startDate: date
        endDate: date

Employee:
	type: collection
	fields:
    	firstName: string
        lastName: string

EmployeeSchedule:
	type: connection
    parent: $Employee
    child: $Schedule
    accessor: schedules

```

Here `EmployeeSchedule` is a definition of connection between `Employee` and `Schedule` collections. You need to specify which one of that collections is the parent and which one is the child.

Also you need to specify the accessor name `(schedules)` which will be added to parent collection items to access child items.