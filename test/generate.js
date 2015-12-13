var chai = require('chai');
var expect = require('chai').expect;
var dream = require('../dream.js');

dream.schema('NamedSchema', {name: String});

describe('Dream', function () {
  describe('namedSchema', function () {
    it('should display an instance of a named schema', function () {
      var instance = dream.useSchema('NamedSchema').generate().output();
      expect(instance).to.deep.equal({name: ''});
    });

    it('should generate an array of instances', function(){
      var instanceArray = dream.useSchema('NamedSchema').generate(2).output();
      expect(Array.isArray(instanceArray)).to.equal(true);
      expect(instanceArray.length).to.equal(2);
    });
  });
});
