var dream = require('./dream');

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
	
	
console.log(data1);
console.log(data2);