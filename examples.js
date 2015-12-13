// example in dream.js

'use strict';

var dream = require('./dream');

// default Hello World
console.log("*** default Hello World");
var result1 = dream.output();
console.log(result1);

// default callback Hello World
console.log("\n*** default callback Hello World");
dream.output(function(err, data){
  console.log(data);
});

// Generic Schema
console.log("\n*** Generic Schema");
var result2 = dream.schema({
  str: String,
  number: Number
}).output();
console.log(result2);

// Named Schema
console.log("\n*** Named Schema");
dream.schema('UserSchema', {
  name: 'name',
  age: 'age'
});
var result3 = dream.useSchema('UserSchema').output();
console.log(result3);

// Generate
console.log("\n*** Generate");
var result4 = dream.useSchema('UserSchema').generate(2).output();
console.log(result4);

// GenerateRnd
console.log("\n*** GenerateRnd");
var result5 = dream.useSchema('UserSchema').generateRnd(2).output();
console.log(result5);

/**
 * Custom Types
 */
 console.log("\n*** Custom Types");
// create custom type by function
dream.customType('pi', function(){
  return Math.PI;
});

// create custom type by Rexp statement
dream.customType('hello', /hello{1,3} (world|to you)/);

var result6 = dream.schema({
  // chance lib build-in custom type
  name: 'name',
  age: 'age',

  // Rexp statement
  phone: /^(800[1-9]{6})$/,

  // function
  foo: function(){
    return 'bar';
  },

  // already defined custom type
  pi: 'pi',
  hello: 'hello'
}).generateRnd(2).output();
console.log(result6);

/**
 * Dream Helper
 */

// Chance Instance
console.log("\n*** Chance Instance");
dream.customType('5wordsSentence', function(helper){
  return helper.chance.sentence({words: 5});
});

var result7 = dream.schema({
  sentence: '5wordsSentence'
}).generateRnd(2).output();
console.log(result7);

// input
console.log("\n*** Input Helper");
dream.customType('customTypeWithInput', function(helper){
  return helper.input.value;
});

var result8 = dream
  .input({
    value: 'I am the input value'
  })
  .schema({
    result: 'customTypeWithInput'
  })
  .generateRnd()
  .output();
console.log(result8);

// oneOf()
console.log("\n*** oneOf helper");
dream.customType('iceCreamTruckDay', function(helper){
  var businessDays = ['Monday', 'Wednesday', 'Friday'];
  return helper.oneOf(businessDays);
});

var result9 =
dream
  .schema({
    iceCreamDay: 'iceCreamTruckDay'
  })
  .generateRnd(2)
  .output();
console.log(result9);

// Previous Item
dream.schema('UserWithId', {
	id: 'incrementalId',
	name: 'name',
	age: 'age'
});

dream.customType('incrementalId', function(helper){
	return helper.previousItem ? helper.previousItem.id+1 : 1;
});

dream
	.useSchema('UserWithId')
	.generateRnd(5)
	.output(function(err, result){
		console.log(result);
	});