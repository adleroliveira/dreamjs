var dream = require('./dream');

// 
// dream.schema('User', {
// 	nome: String,
// 	idade: Number
// });
// 
// dream.schema('Post', {
// 	comentario: String,
// 	criado: Date
// });
// 


// 
// var helloworld = dream
// 	.schema({
// 		name: 'fullname',
// 		birthday: 'birthday',
// 		address: 'address',
// 		phone: 'phone'
// 	})
// 	.generateRnd(10)
// 	.output();
// 
// console.log(helloworld);

dream
.schema({
	name: 'fullname',
	birthday: 'birthday',
	gender: 'gender',
	address: 'address',
	phone: 'phone',
	description: 'paragraph',
	sallary: 'dollar'
})
.generateRnd(5)
.output(function(result){
	console.log(result);
});