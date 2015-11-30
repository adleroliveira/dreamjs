'use strict'

var
  _ = require('lodash'),
  RandExp = require('randexp'),
  chance = require('chance').Chance(),
  djson = require('describe-json');

var _schemas = [];
var _customTypes = [];

var _defaultOutput = {
  Dream: 'Hello World'
};

var _genericSchema = {
  name: 'generic',
  schema: {
    default: String
  }
};

function Dream() {

  this._selectedSchema;
  this._output;

  this.defaultSchema = function defaultSchema(schema) {
    _genericSchema = validateAndReturnSchema(schema);
    return this;
  }.bind(this);

  this.useSchema = function useSchema(schema) {
    var schemaToUse;
    schemaToUse = validateAndReturnSchema(schema);
    var dreamInstance = new Dream();
    dreamInstance.schema(schemaToUse)
    dreamInstance._selectedSchema = schemaToUse;
    return dreamInstance;
  }.bind(this);

  this.customType = function customType(typeName, customType) {
    var
      newCustomType = {},
      validTypeName,
      customTypeIndex;

    validTypeName = typeof (typeName) === 'string' ? typeName : 'generic';

    if (customType.constructor == RegExp) {
      newCustomType = {
        name: validTypeName,
        customType: function () {
          return new RandExp(customType).gen();
        }
      };
    } else if (typeof (customType) === 'function') {
      newCustomType = {
        name: validTypeName,
        customType: customType
      };
    } else {
      newCustomType = {
        name: validTypeName,
        customType: function () {
          return '[Invalid Custom Type]';
        }
      };
    };

    customTypeIndex = _.indexOf(_customTypes, _.find(_customTypes, { name: validTypeName }));
    if (customTypeIndex >= 0) {
      _customTypes.splice(customTypeIndex, 1, newCustomType);
    } else {
      _customTypes.push(newCustomType);
    };

    return this;
  }.bind(this);

  this.output = function output(callback) {
    var output;

    output = this._output || generateOutput();

    if (typeof (callback) === 'function') {
      callback(null, output);
      return Dream;
    } else {
      return output;
    }

  }.bind(this);

  this.schema = function schema(schema) {
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
    schemaIndex = _.indexOf(_schemas, _.find(_schemas, { name: validatedSchema.name }));

    if (schemaIndex >= 0) {
      _schemas.splice(schemaIndex, 1, validatedSchema);
    } else {
      _schemas.push(validatedSchema);
    };

    return this;
  }.bind(this);

  this.generate = function generate(amount, generateRandomData) {
    var
      outputItem,
      iterations = amount || 1,
      outputArray = [],
      i = 0;

    for (; i < iterations; i++) {
      outputItem = generateOutputFromSchema(selectAvailableSchema(), generateRandomData)
      outputArray.push(outputItem);
    };

    this._output = outputArray;
    return this;
  }.bind(this);

  this.generateRnd = function generateRnd(amount) {
    return this.generate(amount, true);
  };

  var validateAndReturnSchema = function validateAndReturnSchema(schema) {
    if (isValidSchema(schema)) return schema;

    if (typeof (schema) === 'string') {
      var foundSchema = _.findWhere(_schemas, { name: schema });
      return isValidSchema(foundSchema) ? foundSchema : _genericSchema;
    };

    if (typeof (schema) === 'object') {
      return {
        name: 'generic',
        schema: schema
      };
    };

    return _genericSchema;
  }.bind(this);

  var selectAvailableSchema = function selectAvailableSchema() {
    if (this._selectedSchema) {
      return this._selectedSchema;
    };

    if (thereIsSchema() && _schemas.length === 1) {
      return _schemas[0];
    };

    return _genericSchema;
  }.bind(this);

  var generateOutput = function generateOutput() {
    var schemaToUse;

    if (thereIsSchema()) {
      schemaToUse = selectAvailableSchema();
      this._output = generateOutputFromSchema(schemaToUse);
    } else {
      this._output = _defaultOutput;
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
      customTypeIndex,
      customTypeNeedle,
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

    switch (typeof (propertyType)) {
      case 'string':
        customTypeNeedle = _.find(_customTypes, { name: propertyType });
        customTypeIndex = _.indexOf(_customTypes, customTypeNeedle);
        
        if (customTypeIndex >= 0) {
          temporaryValue = customTypeNeedle.customType();
        }else{
          temporaryValue = (typeof (chance[propertyType]) === 'function') ? chance[propertyType]() : '[Unknown Custom Type]';
        }
        
        if (generateValues) {
          value = temporaryValue;
        } else {
          value = types[typeof (temporaryValue)]();
        }

        break;
      case 'function':

        temporaryValue = propertyType();

        if (isValueAdate(temporaryValue)) {
          value = new Date(temporaryValue);
        } else {

          if (generateValues) {
            value = temporaryValue;
          } else {
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
    return _schemas.length > 0;
  };

};

module.exports = new Dream();