var chai = require('chai');
var expect = require('chai').expect;
var dream = require('../dream.js');

dream.schema('NamedSchema',{name: String});

describe('Dream', function () {
	describe('namedSchema', function () {
		it('should display an instance of a named schema', function(){
			expect(dream.useSchema('NamedSchema').generate().output()).to.deep.equal({ name: '' });
		});
	});
});
