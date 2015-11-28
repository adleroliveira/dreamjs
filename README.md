# Dream
#### A lightweight json data generator.
This library can output random data from a Json Schema using standard types like String, Number, Date, Boolean, Array, or with the 30+ built in custom types like Name, Age, Address, Word, Sentence, paragraph, gender, (RGB) color etc.

The build in custom types are mostly provided by the module [Chance][Chance] but the library also allows you to create your own custom types.

The library allows for the creation of multple Schemas that can be selected before usage. It is also chainable, meaning that you can chain several configurations before finaly output the processed json.

## Usage

### Hello World

```js
var dream = require('./dream');

var helloword = dream.output();
```
The variable helloword now contains:
```js
{ Dream: 'Hello World' }
```

### Generic Schema / Named Schema
The simplest way to use Dream is by defining a generic schema. If any other generic Schema is created after that it will replace the previous one.
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

It is also posible to create named Schemas and calling them when necessary

```js

dream.schema('User',{
	name: String,
	age: Number
});

dream.schema('Location',{
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

### Generate and GenerateRnd
The methods Generate and GenerateRnd will generate a given amount of instances of the selected Schema respecting the data types specified on the Schema. The method Genrate will bring empty values and the method Generate will bring values with random data.
```js

dream.schema('User',{
	name: String,
});

var data1 = dream
	.useSchema('user')
	.generate(3)
	.output();
	
var data2 = dream
	.useSchema('user')
	.generateRnd(3)
	.output();
```
The variable data1 and data2 now contains:
```js

//data1
[ { name: ''}, { name: '' }, { name: '' } ]

//data2
[ { name: 'Jlxokrs'}, { name: 'oHiklkss'}, { name: 'mNeiOlsaa' } ]


[Chance]: http://chancejs.com/