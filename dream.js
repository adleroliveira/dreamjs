var _ = require('lodash');
var RandExp = require('randexp');
var generateRnd = require('./generateRnd').generateRnd;

var Dream = (function () {

    var d = this;

    d._input;
    d._output;
    d._useSchema;
    d._selectedSchema;
    
    d._genericSchema = {
        name: 'generic',
        schema: {}
    };
    
    d.defaultOutput = {
        dream: 'Hello World!'
    };

    Dream.schemas = [];
    Dream.customTypes = [];

    Dream.input = function (i) {
        d._input = i || d.defaultOutput;
        return this;
    };

    Dream.output = function (cb) {
        var output = d._output || generateOutput();
        if(typeof(cb) === 'function'){
            cb(output);
            return this;
        }else{
            return output;
        }
    };

    Dream.schema = function (schemaName, schema) {
        var sch;
        var args = [];
        Array.prototype.push.apply(args, arguments);

        sch = {
            name: typeof (args[0]) === 'string' ? args.shift() : 'generic',
            schema: args.length ? args.shift() : {}
        };

        Dream.schemas.push(sch);
        selectSchemaIfPossible();

        return this;
    };

    Dream.useSchema = function (schema) {
        var sch = validateAndReturnSchema(schema);
        // TODO  verify if a generic schema already exists and then replace it
        Dream.schemas.push(sch);
        d._selectedSchema = sch;
        return this;
    };

    Dream.generate = function (c) {
        var count = c || 1;
        var outputArray = [];
        selectSchemaIfPossible();
        for (var i = 0; i < count; i++) {
            outputArray.push(generateOutputFromSchema(d._selectedSchema));
        };
        d._output = outputArray;
        return this;
    };
    
    Dream.generateRnd = function (c) {
        var count = c || 1;
        var outputArray = [];
        selectSchemaIfPossible();
        for (var i = 0; i < count; i++) {
            outputArray.push(generateOutputFromSchema(d._selectedSchema, true));
        };
        d._output = outputArray;
        return this;
    };
    
    Dream.genericSchema = function(schema){
        d._genericSchema = validateAndReturnSchema(schema);
        return this;
    };
    
    Dream.CustomType = function(customType){
        Dream.customTypes.push(customType);
        return this;
    };
    
    
    var generateOutput = function () {

        d._output = d._input;
        
        if(d._selectedSchema){
            d._output = generateOutputFromSchema(d._selectedSchema);
        }
        
        return d._output || d.defaultOutput;
    };
    
    var selectSchemaIfPossible = function(){
        if(!d._selectedSchema && schemaExists()){
            d._selectedSchema = Dream.schemas.length === 1 ? Dream.schemas[0] : d._genericSchema;
        };
        
        if(Dream.schemas.length > 1) d._selectedSchema = d._genericSchema;
    };

    var generateOutputFromSchema = function (schema, genValues) {
        var outputObject = {};
        var generateValue = genValues || false;
        
        var sch = validateAndReturnSchema(schema);
        _.forIn(sch.schema, function (value, key) {
            outputObject[key] = getValueFromType(value, generateValue);
        });
        return outputObject;
    };
    
    var schemaExists = function(){
        return Dream.schemas.length > 0;
    };

    var getValueFromType = function (t, genValue) {
        var generateValue = genValue || false;
        
        var tp = {
            'number' : Number,
            'string' : String,
            'bool' : Boolean,
            'array' : Array,
            'object' : Object,
            'function' :  Function
        };
        
        if(typeof(t) === 'string' && !_.has(generateRnd, t)) t = 'string';
        
        if(generateValue){
            return typeof(t) === 'string' ? generateRnd[t]() : generateRnd[typeof(t())]();
        }else{
            return typeof(t) === 'string' ? tp[typeof(generateRnd[t]())]() : t();
        }
    };
    
    var validateAndReturnSchema = function(schema){
        if(typeof (schema) === 'string'){
            var foundSchema = _.findWhere(Dream.schemas, {name: schema});
            return isValidSchema(foundSchema) ? foundSchema : d._genericSchema;
        };
        
        if(isValidSchema(schema)) return schema;
        
        return {
            name: 'generic',
            schema: schema
        };
    };
    
    var isValidSchema = function(schema){
        return _.has(schema, 'name') && _.has(schema, 'schema');
    };
    

    function Dream() {

    };

    return Dream;

})();

module.exports = Dream;

