var dream = require('./dream');

dream.schema('User',{
	name: String,
	address: 'address'
});

var data1 = dream
	.useSchema('User')
	.generate(3)
	.output();
	
var data2 = dream
	.useSchema('User')
	.generateRnd(3)
	.output();
	
	
//console.log(data1);
console.log(data2);