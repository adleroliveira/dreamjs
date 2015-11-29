'use strict'

var
  _ = require('lodash'),
  RandExp = require('randexp'),
  generateRnd = require('./generateRnd').generateRnd,
  djson = require('describe-json');

var Dream = (function () {

  this._selectedSchema;

  this._output;

  this._schemas = [];

  this._defaultOutput = {
    Dream: 'Hello World'
  };

  this._genericSchema = {
    name: 'generic',
    schema: {
      default: String
    }
  };

  Dream.defaultSchema = function defaultSchema(schema) {
    this._genericSchema = validateAndReturnSchema(schema);
    return Dream;
  }.bind(this);

  Dream.useSchema = function useSchema(schema) {
    var schemaToUse;
    schemaToUse = validateAndReturnSchema(schema);
    Dream.schema(schemaToUse);
    this._selectedSchema = schemaToUse;
    return Dream;
  }.bind(this);

  Dream.output = function output(callback) {
    var output;

    output = this._output || generateOutput();

    if (typeof (callback) === 'function') {
      callback(null, output);
      return Dream;
    } else {
      return output;
    }

  }.bind(this);

  Dream.schema = function schema(schema) {
    var
      validatedSchema,
      schemaIndex,
      newSchema,
      args = [];

    Array.prototype.push.apply(args, arguments);

    if (args.length > 1) {
      newSchema = {
        name: typeof (args[0]) === 'string' ? args.shift() : 'generic',
        schema: typeof (args[0]) === 'object' ? args.shift() : {}
      };
    } else {
      newSchema = schema;
    }

    validatedSchema = validateAndReturnSchema(newSchema);
    schemaIndex = _.indexOf(this._schemas, _.find(this._schemas, { name: validatedSchema.name }));

    if (schemaIndex >= 0) {
      this._schemas.splice(schemaIndex, 1, validatedSchema);
    } else {
      this._schemas.push(validatedSchema);
    };

    return Dream;
  }.bind(this);

  Dream.generate = function generate(amount, generateRandomData) {
    var
      outputItem,
      itarations = amount || 1,
      outputArray = [],
      i = 0;

    for (; i < itarations; i++) {
      outputItem = generateOutputFromSchema(selectAvailableSchema(), generateRandomData)
      outputArray.push(outputItem);
    };

    this._output = outputArray;
    return Dream;
  }.bind(this);

  Dream.generateRnd = function generateRnd(amount) {
    return Dream.generate(amount, true);
  };

  var validateAndReturnSchema = function validateAndReturnSchema(schema) {
    if (isValidSchema(schema)) return schema;

    if (typeof (schema) === 'string') {
      var foundSchema = _.findWhere(this._schemas, { name: schema });
      return isValidSchema(foundSchema) ? foundSchema : this._genericSchema;
    };

    if (typeof (schema) === 'object') {
      return {
        name: 'generic',
        schema: schema
      };
    };

    return this._genericSchema;
  }.bind(this);

  var selectAvailableSchema = function selectAvailableSchema() {
    if (this._selectedSchema) {
      return this._selectedSchema;
    };

    if (thereIsSchema() && this._schemas.length === 1) {
      return this._schemas[0];
    };

    return this.defaultSchema;
  }.bind(this);

  var generateOutput = function generateOutput() {
    var schemaToUse;

    if (thereIsSchema()) {
      schemaToUse = selectAvailableSchema();
      this._output = generateOutputFromSchema(schemaToUse);
    } else {
      this._output = this._defaultOutput;
    }

    return this._output;
  }.bind(this);

  var generateOutputFromSchema = function generateOutputFromSchema(schema, generateValues) {
    var outputObject = {};
    var schemaToUse = validateAndReturnSchema(schema);
    _.forIn(schemaToUse.schema, function (value, key) {
      outputObject[key] = getValueFromType(value, generateValues);
    });
    return outputObject;
  };

  var getValueFromType = function getValueFromType(propertyType, generateValues) {
    var
      value,
      temporaryList = [],
      temporaryObject = {},
      temporaryValue,
      types = {
        'number': Number,
        'string': String,
        'bool': Boolean,
        'array': Array,
        'object': Object,
        'function': Function,
        'date': Date
      };

    if (propertyType.constructor == RegExp) {
      if (generateValues) {
        return new RandExp(propertyType).gen();
      } else {
        return types[typeof (RandExp(propertyType).gen())]();
      };
    };

    if (typeof (propertyType) === 'string' && !_.has(generateRnd, propertyType)) {
      propertyType = 'string';
    };

    switch (typeof (propertyType)) {
      case 'string':

        if (generateValues) {
          value = generateRnd[propertyType]();
        } else {
          value = types[typeof (generateRnd[propertyType]())]();
        }

        break;
      case 'function':

        temporaryValue = propertyType();
        
        if(isValueAdate(temporaryValue)){
          value = new Date(temporaryValue);
        }else{
          
          if(generateValues){
            value = temporaryValue;
          }else{
            value = types[typeof (temporaryValue)]();
          }
          
        }

        break;
      case 'object':

        if (Array.isArray(propertyType)) {
          propertyType.forEach(function (item) {
            temporaryList.push(getValueFromType(item, generateValues));
          });

          value = temporaryList;
        } else {
          _.forIn(propertyType, function (value, key) {
            temporaryObject[key] = getValueFromType(value, generateValues);
          });

          value = temporaryObject;
        };

        break;
      default:
        value = '[Invalid Property]';
    }

    return value;
  };

  var isValidSchema = function isValidSchema(schema) {
    return _.has(schema, 'name') && _.has(schema, 'schema');
  };

  var isValueAdate = function (value) {
    var temporaryDate;
    temporaryDate = new Date(value);
    return !isNaN(temporaryDate.valueOf());
  };

  var thereIsSchema = function thereIsSchema() {
    return this._schemas.length > 0;
  }.bind(this);

  function Dream() {

  };

  return Dream;

}.bind(this))();

module.exports = Dream;