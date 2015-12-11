var chai = require('chai');
var expect = require('chai').expect;
var dream = require('../dream.js');

dream.schema('PreviousItem', {id: 'incrementalId'});

dream.customType('incrementalId', function(helper){
	return helper.previousItem ? helper.previousItem.id+1 : 1;
});

describe('Dream', function () {
  describe('previousItem', function () {
    it('should have access to the previous items in the chain', function () {
      expect(dream.useSchema('PreviousItem').generateRnd(2).output()[1].id).to.equal(2);
    });
  });
});
