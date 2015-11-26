var chance = require('chance').Chance();

module.exports.generateRnd = {
	bool: function(){
		return this.boolean();
	},
	
	boolean: function(){
		return chance.bool();
	},
	
	char: function(){
		return this.character();
	},
	
	character: function(){
		return chance.character();
	},
	
	float: function(){
		return this.floating();
	},
	
	floating: function(){
		return chance.floating();
	},
	
	number: function(){
		return chance.natural();
	},
	
	int: function(){
		return chance.integer();
	},
	
	integer: function(){
		return chance.integer();
	},
	
	string: function(){
		return chance.string();
	},
	
	age: function(){
		return chance.age();
	},
	
	name: function(){
		return chance.first();
	},
	
	birthday: function(){
		return chance.birthday({string: true, american: false});	
	},
	
	gender: function(){
		return chance.gender();
	},
	
	fullname: function(){
		return chance.name();
	},
	
	address: function(){
		return chance.address();
	},
	
	phone: function(){
		return chance.phone();
	},
	
	dollar: function(){
		return chance.dollar();
	},
	
	paragraph : function(){
		return chance.paragraph();
	}
}