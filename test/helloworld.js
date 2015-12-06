var chai = require('chai');
var expect = require('chai').expect;
var Dream = require('../dream.js');

describe('Dream', function () {
	describe('default output', function () {
		it('should display Hello World output', function(){
			expect(Dream.output()).to.deep.equal({ Dream: 'Hello World' });
		});
	});
});
