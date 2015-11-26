var dream = require('./dream');

dream.schema('User',{
	name: String,
	age: Number,
	address: String,
	houses: Array,
	phone: 'chileanPhone'
});

dream.schema('Vehicle',{
	license_plate: String,
	kms: Number,
	model: String
});

dream.CustomType({
	name: 'chileanPhone',
	pattern: /^(\+569 [6-9][0-9]{7})$/
});


dream.genericSchema({
	message: String
});


var helloworld = dream
	//.input([{bla: 'ble'}])
	//.schema('User', {name: String, age: Number})
	//.schema('Vehicle', {chassis: String, kms: Number})
	//.schema({nombre: String, edad: Number})
	.useSchema('Vehicle')
	.generate(14)
	.output();

console.log(helloworld);