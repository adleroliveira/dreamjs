# Dream
#### A lightweight json data generator.
This library can output random data from a Json Schema, either using standard types like String, Number, Date, Boolean, Array, Object as with the 30+ built in custom types like Name, Age, Address, Word, Sentence, paragraph, gender, (RGB) color etc.
The build int custom types are mostly provided by the module [Chance][Chance] but the library also allows you to create your own custom types.

## Usage

### Hello World

```js
var dream = require('./dream');

var helloword = dream.output();
```
Results with:
```js
{ Dream: 'Hello World' }
```


[Chance]: http://chancejs.com/