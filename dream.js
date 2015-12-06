'use strict';

var
  _ = require('lodash'),
  RandExp = require('randexp'),
  chance = require('chance').Chance(),
  djson = require('describe-json');

var _schemas = [];
var _customTypes = [
  {
    name: 'number',
    customType: function () {
      return chance.natural();
    }
  },
  {
    name: 'boolean',
    customType: function () {
      return chance.bool();
    }
  },
  {
    name: 'null',
    customType: function () {
      return null;
    }
  }
];

var _dreamHelper = {
  chance: chance,
  oneOf: function (collection) {
    return _.sample(collection);
  }
};

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

  //this._selectedSchema;
  //this._output;
  this._dreamHelper = _dreamHelper;
  //this._input;

  this.defaultSchema = function (schema) {
    _genericSchema = validateAndReturnSchema(schema);
    return this;
  }.bind(this);

  this.useSchema = function useSchema(schema) {
    var
      schemaToUse,
      dreamInstance;

    schemaToUse = validateAndReturnSchema(schema);
    dreamInstance = new Dream();
    dreamInstance.schema(schemaToUse);
    dreamInstance._selectedSchema = schemaToUse;

    return dreamInstance;
  }.bind(this);

  this.input = function input(input) {
    this._dreamHelper.input = input;
    return (this);
  }.bind(this);

  this.generateSchema = function () {
    var
      describedJson,
      schemaName = '',
      jsonInput = '',
      validatedJsonInput,
      guessProperties = false,
      newSchema,
      args = [];

    Array.prototype.push.apply(args, arguments);

    args.forEach(function (argument) {
      switch (typeof (argument)) {
        case 'string':
          schemaName = argument;
          break;
        case 'object':
          jsonInput = argument;
          break;
        case 'boolean':
          guessProperties = argument;
          break;
      }
    });

    validatedJsonInput = _.first(_.flatten([jsonInput]));
    describedJson = djson.describe(validatedJsonInput || {});

    newSchema = {
      name: schemaName || 'generic',
      schema: describedJson
    };

    if (guessProperties === true) {
      newSchema.schema = guessCustomTypes(describedJson);
    }
    addOrReplace(_schemas, newSchema);
    return this;
  }.bind(this);

  this.customType = function (typeName, customType) {
    var
      newCustomType = {},
      validTypeName;

    validTypeName = typeof (typeName) === 'string' ? typeName : 'generic';

    if (customType.constructor === RegExp) {
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
    }

    addOrReplace(_customTypes, newCustomType);

    return this;
  }.bind(this);

  this.cleanse = function () {
    this._output = null;
    this._selectedSchema = null;
  }.bind(this);

  this.output = function output(callback) {
    var output;

    output = this._output || generateOutput();
    this.cleanse();

    if (typeof (callback) === 'function') {
      callback(null, output);
      return this;
    } else {
      return output;
    }

  }.bind(this);

  //this.flushSchemas = function () {
  //  _schemas = [];
  //  return this;
  //}.bind(this);

  this.schema = function schema(schema) {
    var
      validatedSchema,
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

    if (validatedSchema.name === 'generic') {
      this._selectedSchema = validatedSchema;
    } else {

      addOrReplace(_schemas, validatedSchema);

      if (_schemas.length === 1) {
        this._selectedSchema = validatedSchema;
      }
    }

    return this;
  }.bind(this);

  this.generate = function generate(amount, generateRandomData) {
    var
      outputItem,
      iterations = amount || 1,
      outputArray = [],
      i = 0;

    for (; i < iterations; i++) {
      outputItem = generateOutputFromSchema(selectAvailableSchema(), generateRandomData);
      outputArray.push(outputItem);
    }

    this._output = outputArray.length === 1 ? outputArray[0] : outputArray;
    return this;
  }.bind(this);

  this.generateRnd = function generateRnd(amount) {
    return this.generate(amount, true);
  };

  var addOrReplace = function addOrReplace(collection, item) {
    var
      index;

    index = _.indexOf(collection, _.find(collection, {name: item.name}));
    if (index >= 0) {
      collection.splice(index, 1, item);
    } else {
      collection.push(item);
    }

    return collection;
  };

  var guessCustomTypes = function guessCustomTypes(schemaObject) {
    var
      customTypeExists,
      temporaryList = [];

    _.forIn(schemaObject, function (value, key) {
      if (typeof (value) === 'object') {
        if (Array.isArray(value)) {
          value.forEach(function (item) {
            if (typeof (item) === 'object') {
              temporaryList.push(guessCustomTypes(item));
            } else {
              temporaryList.push(item.toString());
            }
          });
          schemaObject[key] = temporaryList;
        } else {
          schemaObject[key] = guessCustomTypes(value);
        }
      } else {

        customTypeExists = _.find(_customTypes, {name: key.toString()});

        if (typeof (chance[key.toString()]) === 'function' || customTypeExists !== undefined) {
          schemaObject[key] = key.toString();
        }
      }
    });

    return schemaObject;
  };

  var validateAndReturnSchema = function (schema) {
    if (isValidSchema(schema)) return schema;

    if (typeof (schema) === 'string') {
      var foundSchema = _.findWhere(_schemas, {name: schema});
      return isValidSchema(foundSchema) ? foundSchema : _genericSchema;
    }

    if (typeof (schema) === 'object') {
      return {
        name: 'generic',
        schema: schema
      };
    }

    return _genericSchema;
  }.bind(this);

  var selectAvailableSchema = function () {
    if (this._selectedSchema) {
      return this._selectedSchema;
    }

    if (thereIsSchema() && _schemas.length === 1) {
      return _schemas[0];
    }

    return _genericSchema;
  }.bind(this);

  var generateOutput = function () {

    if (this._selectedSchema) {
      return generateOutputFromSchema(this._selectedSchema);
    } else {
      return _defaultOutput;
    }

  }.bind(this);

  var generateOutputFromSchema = function (schema, generateValues) {
    var
      outputObject = {},
      schemaToUse = validateAndReturnSchema(schema);
    _.forIn(schemaToUse.schema, function (value, key) {
      outputObject[key] = getValueFromType(value, generateValues);
    });
    return outputObject;
  }.bind(this);

  var getValueFromType = function getValueFromType(propertyType, generateValues) {
    var
      value,
      temporaryList = [],
      temporaryObject = {},
      temporaryValue,
      customTypeIndex,
      customTypeNeedle,
      context = this,
      types = {
        'number': Number,
        'string': String,
        'boolean': Boolean,
        'array': Array,
        'object': Object,
        'function': Function,
        'date': Date
      };

    if (propertyType.constructor === RegExp) {
      if (generateValues) {
        return new RandExp(propertyType).gen();
      } else {
        return types[typeof (new RandExp(propertyType).gen())]();
      }
    }

    switch (typeof (propertyType)) {
      case 'string':
        customTypeNeedle = _.find(_customTypes, {name: propertyType});
        customTypeIndex = _.indexOf(_customTypes, customTypeNeedle);

        if (customTypeIndex >= 0) {
          temporaryValue = customTypeNeedle.customType(this._dreamHelper);
        } else {
          if (propertyType === 'array') {
            temporaryValue = [];
          } else {
            temporaryValue = (typeof (chance[propertyType]) === 'function') ? chance[propertyType]() : '[Unknown Custom Type]';
          }
        }

        if (generateValues) {
          value = temporaryValue;
        } else {
          value = types[typeof (temporaryValue)]();
        }

        break;
      case 'function':

        temporaryValue = propertyType();

        if (propertyType === Date) {
          value = new Date(temporaryValue);
        } else {

          if (generateValues) {
            value = isNative(propertyType) ? chance[typeof (temporaryValue)]() : temporaryValue;
          } else {
            value = Array.isArray(temporaryValue) ? types['array']() : types[typeof (temporaryValue)]();
          }

        }

        break;
      case 'object':

        if (Array.isArray(propertyType)) {
          propertyType.forEach(function (item) {
            temporaryList.push(getValueFromType.call(context, item, generateValues));
          });

          value = temporaryList;
        } else {
          _.forIn(propertyType, function (value, key) {
            temporaryObject[key] = getValueFromType.call(context, value, generateValues);
          });

          value = temporaryObject;
        }

        break;
      default:
        value = '[Invalid Property]';
    }

    return value;
  }.bind(this);

  var isValidSchema = function isValidSchema(schema) {
    return _.has(schema, 'name') && _.has(schema, 'schema');
  };

  var thereIsSchema = function thereIsSchema() {
    return _schemas.length > 0;
  };

  var isNative = function isNative(func) {
    return !('prototype' in func);
  };

}

module.exports = new Dream();
