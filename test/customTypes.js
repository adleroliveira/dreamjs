var chai = require('chai');
var expect = require('chai').expect;
var dream = require('../dream.js');

dream.customType('pi', function(){
	return Math.PI;
});

dream.schema('customTypes', {
	namedCustomType: 'pi',
	genericCustomType: function(){
		return 'genericCustomType';
	},
	builtInCustomType: 'name',
	regExpCustomType: /REcustomType/
});

describe('Dream', function () {
	describe('customTypes', function () {
		it('should display correctly generated values for the custom types', function(){
			expect(dream.useSchema('customTypes').generateRnd().output().namedCustomType).to.equal(3.141592653589793);
			expect(dream.useSchema('customTypes').generateRnd().output().genericCustomType).to.equal('genericCustomType');
			expect(dream.useSchema('customTypes').generateRnd().output().builtInCustomType).to.be.a('string');
			expect(dream.useSchema('customTypes').generateRnd().output().regExpCustomType).to.equal('REcustomType');
		});
	});
});