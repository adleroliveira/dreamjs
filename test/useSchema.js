var chai = require('chai');
var expect = require('chai').expect;
var dream = require('../dream.js');

dream.schema('Schema1', {schema1: String});
dream.schema('Schema2', {schema2: Number});

describe('Dream', function () {
  describe('useSchema', function () {
    it('should display the corresponding instance of schema', function () {
      expect(dream.useSchema('Schema1').output()).to.deep.equal({schema1: ''});
      expect(dream.useSchema('Schema2').output()).to.deep.equal({schema2: 0});
    });
  });
});
