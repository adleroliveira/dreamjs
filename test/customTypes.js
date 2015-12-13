var chai = require('chai');
var expect = require('chai').expect;
var dream = require('../dream.js');

var rexp = /hello{1,3} (world|to you)/;

dream.customType('pi', function () {
  return Math.PI;
});

dream.customType('overwriteCustomType', function(){
  return 'firstResult';
});
dream.customType('overwriteCustomType', function(){
  return 'secondResult';
});

dream.schema('customTypes', {
  namedCustomType: 'pi',
  genericCustomType: function () {
    return 'genericCustomType';
  },
  builtInCustomType: 'name',
  regExpCustomType: rexp,
  overwriteResult: 'overwriteCustomType'
});

describe('Dream', function () {
  describe('customTypes', function () {
    var result = dream.useSchema('customTypes').generateRnd().output();
    it('should display correctly generated values for the custom types', function () {
      expect(result.namedCustomType).to.equal(3.141592653589793);
      expect(result.genericCustomType).to.equal('genericCustomType');
      expect(result.builtInCustomType).to.be.a('string');
      expect(rexp.test(result.regExpCustomType)).to.equal(true);
    });

    it("the same custom type should be overwrite", function(){
      expect(result.overwriteResult).to.equal("secondResult");
    });
  });
});
