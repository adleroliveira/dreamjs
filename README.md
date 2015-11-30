# [![Dream Logo](http://www.bodamarket.cl/small_dream_logo.png)](https://github.com/adleroliveira/dreamjs)
#### A lightweight json data generator.



This library can output random data from a Json Schema using standard types like String, Number, Date, Boolean, Array, or with the 60+ built-in custom types like Name, Age, Address, Word, Sentence, paragraph, gender, (RGB) color etc.

The built-in Custom Types are mostly provided by the module [Chance][Chance] but the library also allows you to create your own Custom Types.

It can be used with multple Schemas that can be selected before usage and the it is also chainable, meaning that you can chain several configurations before finaly output the processed json.

## Instalation
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
Currently there is two ways you can get the output from DreamJS. By storing it in a variable or by passing a callback to it to receive the result. In the future it will also be possible to use it with Promises and Streams.

Storing in a variable:
```js
var helloword = dream.output();
```
Passing a callback:
```js
dream.output(function(err, result){
	console.log(result);
});
```

### Generic Schema / Named Schema
The simplest way to use DreamJS is by defining a generic schema. If any other generic Schema is created after that it will replace the previous one.
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

It is also posible to create named Schemas and use them when necessary

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
```

### Generate() and GenerateRnd()
The methods Generate() and GenerateRnd() will generate a given amount of instances of the selected Schema respecting the data types specified on the Schema. The method Generate() will bring empty values and the method GenerateRnd() will bring values with random data.


```js
dream.schema('User',{
	name: String,
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

The variable data1 and data2 now contains:
```js
//data1
[ { name: '' }, { name: '' }, { name: '' } ]

//data2
[ { name: 'Jlxokrs' }, { name: 'oHiklkss' }, { name: 'mNeiOlsaa' } ]
```


### Custom Types
DreamJS comes with the power of the [Chance][Chance] library integrated with it and allow you to use their 60+ random generator as built-in Custom Types. It is also posible to create your own Custom Types by just passing a function or a RegularExpression statement as the Type on the Schema.

A full list of all the posible Custom Types provided by chance can be found on their website: http://chancejs.com/
```js
dream
	.schema({
		name: 'name',
		age: 'age',
		address: 'address',
		contact: {
			phone: 'phone',
			servicePhone: /^(800[1-9]{6})$/,
		},
		foo: function(){
			return 'bar';
		}
	})
	.generateRnd(2)
	.output(function(err, result){		
		console.log(result);		
	});
```

result is:
```js
[
	{ 
		name: 'John',
		age: 50,
		address: '335 Ozda Highway',
		contact: {
			phone: '(823) 962-2040',
			servicePhone: '800858523'
		},
		foo: 'bar'
	},
	{ 
		name: 'Mary',
		age: 37,
		address: '681 Vasfih Road',
		contact: {
			phone: '(339) 869-1952',
			servicePhone: '800458292'
		},
		foo: 'bar'
	}
]
```

### TODO
The next step is to update DreamJS to allow the use with promises and streams.
[Chance]: http://chancejs.com/