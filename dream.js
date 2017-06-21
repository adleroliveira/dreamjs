'use strict';

var _ = require('lodash');
var RandExp = require('randexp');
var chance = require('chance').Chance();
var djson = require('describe-json');

var _schemas = [];
var _customTypes = [
  {
    name: 'number',
    customType: function() {
      return chance.natural();
    }
  },
  {
    name: 'boolean',
    customType: function() {
      return chance.bool();
    }
  },
  {
    name: 'null',
    customType: function() {
      return null;
    }
  },
  {
    name: 'string',
    customType: function() {
      return chance.string();
    }
  },
  {
    name: 'array',
    customType: function() {
      return [];
    }
  },
  {
    name: 'object',
    customType: function() {
      return {};
    }
  },
  {
    name: 'function',
    customType: function() {
      return function() { };
    }
  }
];

var _dreamHelper = {
  chance: chance,
  oneOf: function(collection) {
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
  var self = this;
  self._dreamHelper = _dreamHelper;

  self.defaultSchema = function(schema) {
    _genericSchema = validateAndReturnSchema(schema);
    return self;
  };

  self.useSchema = function useSchema(schema) {
    var schemaToUse;
    var dreamInstance;

    schemaToUse = validateAndReturnSchema(schema);
    dreamInstance = new Dream();
    dreamInstance.schema(schemaToUse);
    dreamInstance._selectedSchema = schemaToUse;

    return dreamInstance;
  };

  self.input = function input(value) {
    self._dreamHelper.input = value;
    return (self);
  };

  self.generateSchema = function() {
    var describedJson;
    var schemaName = '';
    var jsonInput = '';
    var validatedJsonInput;
    var guessProperties = false;
    var newSchema;
    var args = [];

    Array.prototype.push.apply(args, arguments);

    args.forEach(function(argument) {
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
    return self;
  };

  self.customType = function(typeName, customType) {
    var newCustomType = {};
    var validTypeName;

    validTypeName = typeof (typeName) === 'string' ? typeName : 'generic';

    if (customType.constructor === RegExp) {
      newCustomType = {
        name: validTypeName,
        customType: function() {
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
        customType: function() {
          return '[Invalid Custom Type]';
        }
      };
    }

    addOrReplace(_customTypes, newCustomType);

    return self;
  };

  self.cleanse = function() {
    self._output = null;
    self._selectedSchema = null;
  };

  self.output = function output(callback) {
    var output;

    output = self._output || generateOutput();
    self.cleanse();

    if (typeof (callback) === 'function') {
      callback(null, output);
      return self;
    } else {
      return output;
    }

  };

  self.schema = function schema(value) {
    var validatedSchema;
    var newSchema;
    var args = [];

    Array.prototype.push.apply(args, arguments);

    if (args.length > 1) {
      newSchema = {
        name: typeof (args[0]) === 'string' ? args.shift() : 'generic',
        schema: typeof (args[0]) === 'object' ? args.shift() : {}
      };
    } else {
      newSchema = value;
    }

    validatedSchema = validateAndReturnSchema(newSchema);

    if (validatedSchema.name === 'generic') {
      self._selectedSchema = validatedSchema;
    } else {

      addOrReplace(_schemas, validatedSchema);

      if (_schemas.length === 1) {
        self._selectedSchema = validatedSchema;
      }
    }

    return self;
  };

  self.generate = function generate(amount, generateRandomData) {
    var outputItem;
    var iterations = amount || 1;
    var outputArray = [];

    self._currentRecord = null;

    for (var i = 0; i < iterations; i++) {
      outputItem = generateOutputFromSchema(selectAvailableSchema(), generateRandomData);
      outputArray.push(outputItem);
      self._currentRecord = outputItem;
    }

    self._output = outputArray.length === 1 ? outputArray[0] : outputArray;
    return self;
  };

  self.generateRnd = function generateRnd(amount) {
    return self.generate(amount, true);
  };

  function addOrReplace(collection, item) {
    var index;

    index = _.indexOf(collection, _.find(collection, { name: item.name }));
    if (index >= 0) {
      collection.splice(index, 1, item);
    } else {
      collection.push(item);
    }

    return collection;
  };

  function guessCustomTypes(schemaObject) {
    var customTypeExists;
    var temporaryList = [];

    _.forIn(schemaObject, function(value, key) {
      if (typeof (value) === 'object') {
        if (Array.isArray(value)) {
          value.forEach(function(item) {
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
        customTypeExists = _.find(_customTypes, { name: key.toString() });

        if (typeof (chance[key.toString()]) === 'function' || customTypeExists !== undefined) {
          schemaObject[key] = key.toString();
        }
      }
    });

    return schemaObject;
  };

  function validateAndReturnSchema(schema) {
    if (isValidSchema(schema)) return schema;

    if (typeof (schema) === 'string') {
      var foundSchema = _.find(_schemas, { name: schema });
      return isValidSchema(foundSchema) ? foundSchema : _genericSchema;
    }

    if (typeof (schema) === 'object') {
      return {
        name: 'generic',
        schema: schema
      };
    }

    return _genericSchema;
  };

  function selectAvailableSchema() {
    if (self._selectedSchema) {
      return self._selectedSchema;
    }

    if (thereIsSchema() && _schemas.length === 1) {
      return _schemas[0];
    }

    return _genericSchema;
  };

  function generateOutput() {
    if (self._selectedSchema) {
      return generateOutputFromSchema(self._selectedSchema);
    } else {
      return _defaultOutput;
    }

  };

  function generateOutputFromSchema(schema, generateValues) {
    var outputObject = {};
    var schemaToUse = validateAndReturnSchema(schema);

    _.forIn(schemaToUse.schema, function(value, key) {
      outputObject[key] = getValueFromType(value, generateValues);
    });

    return outputObject;
  };

  function getValueFromType(propertyType, generateValues) {
    var temporaryList = [];
    var temporaryObject = {};
    var temporaryValue;
    var customTypeIndex;
    var customTypeNeedle;
    var context = self;
    var types = {
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

    var typesHandle = {
      'string': stringHandle,
      'function': functionHandle,
      'object': objHandle,
      'default': defaultHandle
    };

    return (typesHandle[typeof (propertyType)] || typesHandle['default'])();

    function stringHandle() {
      var value;
      customTypeNeedle = _.find(_customTypes, { name: propertyType });
      customTypeIndex = _.indexOf(_customTypes, customTypeNeedle);

      if (customTypeIndex >= 0) {
        self._dreamHelper.previousItem = self._currentRecord;
        temporaryValue = customTypeNeedle.customType(self._dreamHelper);
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

      return value;
    }

    function functionHandle() {
      var value;
      temporaryValue = propertyType();

      if (propertyType === Date) {
        value = new Date(temporaryValue);
      } else {

        if (generateValues) {
          customTypeNeedle = _.find(_customTypes, { name: typeof (temporaryValue) });
          value = isNative(propertyType) ? customTypeNeedle.customType() : temporaryValue;
        } else {
          value = Array.isArray(temporaryValue) ? types['array']() : types[typeof (temporaryValue)]();
        }

      }
      return value
    }

    function objHandle() {
      var value;
      if (Array.isArray(propertyType)) {
        propertyType.forEach(function(item) {
          temporaryList.push(getValueFromType.call(context, item, generateValues));
        });

        value = temporaryList;
      } else {
        _.forIn(propertyType, function(value, key) {
          temporaryObject[key] = getValueFromType.call(context, value, generateValues);
        });

        value = temporaryObject;
      }
      return value;
    }

    function defaultHandle() {
      return '[Invalid Property]';
    }

  };

  function isValidSchema(schema) {
    return _.has(schema, 'name') && _.has(schema, 'schema');
  };

  function thereIsSchema() {
    return _schemas.length > 0;
  };

  function isNative(fn) {
    return (/^function\s*[a-z0-9_\$]*\s*\([^)]*\)\s*\{\s*\[native code\]\s*\}/i).test('' + fn);
  }

}

module.exports = new Dream();
