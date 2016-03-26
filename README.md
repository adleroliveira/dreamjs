[![Build Status](https://travis-ci.org/adleroliveira/dreamjs.svg?branch=master)](https://travis-ci.org/adleroliveira/dreamjs)

# [![Dream Logo](http://www.bodamarket.cl/small_dream_logo.png)](https://github.com/adleroliveira/dreamjs)

#### A lightweight json data generator.

This library can output random data from a Json Schema using standard types like String, Number, Date, Boolean, Array,
or with the 60+ built-in custom types like Name, Age, Address, Word, Sentence, paragraph, gender, (RGB) color etc.

The built-in Custom Types are mostly provided by the module [Chance][Chance] but the library also allows you to create
your own Custom Types.

It can be used with multiple Schemas that can be selected before usage and the it is also chainable, meaning that you
can chain several configurations before finally output the processed json.

## Installation

```js
npm install --save dreamjs
```

## Usage

### Hello World

```js
var dream = require('dreamjs');

var helloworld = dream.output();
```

The variable helloworld now contains:
```js
{ Dream: 'Hello World' }
```

### Callbacks

Currently there is two ways you can get the output from DreamJS. By storing it in a variable or by passing a callback
to it to receive the result. In the future it will also be possible to use it with Promises and Streams.

Storing in a variable:
```js
var helloword = dream.output();
```

Passing a callback:
```js
dream.output(function (err, result) {
  console.log(result);
});
```

### Generic Schema / Named Schema

The simplest way to use DreamJS is by defining a generic schema.
If any other generic Schema is created after that it will replace the previous one.

```js
var data = dream
  .schema({
    name: String
  })
  .output();
```

The variable data now contains:
```js
{ name: '' }
```

It is also possible to create named Schemas and use them when necessary.

```js
dream.schema('User', {
  name: String,
  age: Number
});

dream.schema('Location', {
  address: String,
  postcode: Number
});

var data = dream
  .useSchema('Location')
  .output();
```

The variable data now contains:
```js
{ address: '', postcode: 0 }
```

### Generate() and GenerateRnd()

The methods `Generate()` and `GenerateRnd()` will generate a given amount of instances of the selected Schema
respecting the data types specified on the Schema.
The method `Generate()` will bring empty values and the method `GenerateRnd()` will bring values with random data.

```js
dream.schema('User', {
  name: String
});

var data1 = dream
  .useSchema('User')
  .generate(3)
  .output();

var data2 = dream
  .useSchema('User')
  .generateRnd(3)
  .output();
```

The variable **data1** and **data2** now contains:
```js
// data1
[ { name: '' }, { name: '' }, { name: '' } ]

// data2
[ { name: 'Jlxokrs' }, { name: 'oHiklkss' }, { name: 'mNeiOlsaa' } ]
```

### Custom Types

DreamJS comes with the power of the [Chance][Chance] library integrated with it and allow you to use their 60+ random
generator as built-in Custom Types.
It is also possible to create your own Custom Types or just just pass a function or a RegularExpression statement to
use a generic Custom Type.

A full list of all the possible built-in Custom Types provided by chance can be found on their website: http://chancejs.com

```js

dream.customType('pi', function () {
  return Math.PI;
});

dream.customType('hello', /hello+ (world|to you)/);

dream
  .schema({
    name: 'name',
    age: 'age',
    address: 'address',
    contact: {
      phone: 'phone',
      servicePhone: /^(800[1-9]{6})$/
    },
    foo: function () {
      return 'bar';
    },
    pi: 'pi',
    hello: 'hello'
  })
  .generateRnd(2)
  .output(function (err, result) {
    console.log(result);
  });
```

Result:
```js
[
  {
    name: 'Dorothy Conner',
    age: 32,
    address: '702 Kimes Extension',
    contact: {
      phone: '(985) 255-2142',
      servicePhone: '800493159'
    },
    foo: 'bar',
    pi: 3.141592653589793,
    hello: 'hellooooooooooo world'
  },
  {
    name: 'Nathaniel Payne',
    age: 50,
    address: '1811 Bani Manor',
    contact: {
      phone: '(212) 389-6644',
      servicePhone: '800157977'
    },
    foo: 'bar',
    pi: 3.141592653589793,
    hello: 'hellooooooooooooooooooooooo to you'
  }
]
```

## Dream Helper

Whenever you build your own Custom Type, DreamJS provides to your Custom Type callback a helper object that contains
some useful tools like:

### Chance Instance

An instance of the library chance, that allows you to make full use of their methods with custom configuration.

```js
dream.customType('FiveWordsSentence', function (helper) {
  return helper.chance.sentence({words: 5});
});

dream
  .schema({
    phrase: 'FiveWordsSentence'
  })
  .generateRnd(2)
  .output(function (err, result) {
    console.log(result);
  });
```

Result:
```js
[
  { phrase: 'Laf woelimev vu vazpazap upecu.' },
  { phrase: 'Batunwa ziti laralsuc ve rudeoze.' }
]
```

### Input

It is possible to define an input to the DreamJS data flow, that will be available through the helper so you can use
this data to interact with your Custom Type.

```js
dream.customType('customTypeWithInput', function (helper) {
  return helper.input.value;
});

dream
  .input({value: 'Provided by an input'})
  .schema({
    result: 'customTypeWithInput'
  })
  .generateRnd()
  .output(function (err, result) {
    console.log(result);
  });
```

Result:
```js
{ result: 'Provided by an input' }
```

### oneOf()

A method that allows you to pick a single random value from a provided array. This way you can explicitly specify the
scope of what is being returned from your Custom Type.

```js
dream.customType('iceCreamTruckDay', function (helper) {
  var businessDays = ['Monday', 'Wednesday', 'Friday'];
  return helper.oneOf(businessDays);
});

dream
  .schema({
    iceCreamDay: 'iceCreamTruckDay'
  })
  .generateRnd(2)
  .output(function (err, result) {
    console.log(result);
  });
```

Result:
```js
[
  { iceCreamDay: 'Wednesday' },
  { iceCreamDay: 'Friday' }
]
```

### Previous Item

The helper also exposes the previous generated item to the current one. This way, you will always have access to previous generated values if you need them to generate the next ones, like for example an incremental id.

```js
dream.schema('User', {
	id: 'incrementalId',
	name: 'name',
	age: 'age'
});

dream.customType('incrementalId', function(helper){
	return helper.previousItem ? helper.previousItem.id+1 : 1;
});

dream
	.useSchema('User')
	.generateRnd(5)
	.output(function(err, result){
		console.log(result);
	});
```

Result:
```js
[ 
  { id: 1, name: 'Bess Franklin', age: 60 },
  { id: 2, name: 'Verna Brown', age: 45 },
  { id: 3, name: 'Travis Poole', age: 42 },
  { id: 4, name: 'Theresa Sanchez', age: 29 },
  { id: 5, name: 'Ruth Lane', age: 33 } 
]
```

## From CLI
Dreamjs can be used from CLI generating data from a `schema.js` in the current directory

### Install globally
```
sudo npm install -g dreamjs
```
now you can call 

```
dream <schema_name> <repetitions> -f
```

### usage 
- recommended have `NODE_PATH` set so you can include global modules
- dreamjs can take 3 parameter in any order
	- schema name
	- repetitions
	- and `-f` flag to fill fields or generate empty fields
- Create a new `schema.js` file somewhere 
	- define define your schemas and custome fields in this file

```javascript
// schema.js

// This will include the globally installed dreamjs which required NODE_PATH to be set
// or include from local install
var dream = require('dreamjs'); 

dream.customType('pi', function () {
  return Math.PI;
});

dream.customType('incrementalId', function(helper){
    return helper.previousItem ? helper.previousItem.id+1 : 1;
});

dream.schema('user', {
	id: 'incrementalId',
	name: 'name',
	age: 'age',
	piField: 'pi'
});
```

now in the same directoy as your schema.js

```
$ dream user 4 -f

[
    {
        "id": 1,
        "name": "Marie Lloyd",
        "age": 20
    },
    {
        "id": 2,
        "name": "Isabella Page",
        "age": 44
    },
    {
        "id": 3,
        "name": "Evan Barrett",
        "age": 21
    },
    {
        "id": 4,
        "name": "David Dawson",
        "age": 41
    }
]
```

without `-f` flag

```
$ dream user 4
[
    {
        "id": 0,
        "name": "",
        "age": 0
    },
    {
        "id": 0,
        "name": "",
        "age": 0
    },
    {
        "id": 0,
        "name": "",
        "age": 0
    },
    {
        "id": 0,
        "name": "",
        "age": 0
    }
]
```

## TODO

The next step is to update DreamJS to allow the use with promises and streams.

[Chance]: http://chancejs.com/
