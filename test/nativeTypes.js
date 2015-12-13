var chai = require('chai');
var expect = require('chai').expect;
var dream = require('../dream.js');

dream.schema('String', {result: String});
dream.schema('Number', {result: Number});
dream.schema('Boolean', {result: Boolean});
dream.schema('Array', {result: Array});
dream.schema('Object', {result: Object});
dream.schema('Function', {result: Function});
dream.schema('Date', {result: Date});

describe('Dream', function () {
  describe('nativeTypes', function () {
    it('should display a type corresponding with the Native Type Specified', function () {
      expect(dream.useSchema('String').output().result).to.be.a('string');
      expect(dream.useSchema('String').output().result).to.equal('');

      expect(dream.useSchema('Number').output().result).to.be.a('number');
      expect(dream.useSchema('Number').output().result).to.equal(0);

      expect(dream.useSchema('Boolean').output().result).to.be.a('boolean');
      expect(dream.useSchema('Boolean').output().result).to.equal(false);

      expect(dream.useSchema('Array').output().result).to.be.a('array');
      expect(dream.useSchema('Array').output().result).to.deep.equal([]);

      expect(dream.useSchema('Object').output().result).to.be.a('object');
      expect(dream.useSchema('Object').output().result).to.deep.equal({});

      expect(dream.useSchema('Function').output().result).to.be.a('function');
      expect(dream.useSchema('Date').output().result).to.be.a('date');
    });
  });
});
