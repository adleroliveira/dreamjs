var chai = require('chai');
var expect = require('chai').expect;
var dream = require('../dream.js');

describe('Dream', function () {
  describe('genericSchema', function () {
    it('should display an instance of generic schema', function () {
      expect(dream.schema({
        foo: String,
        bar: Number,
        bool: Boolean
      }).output()).to.deep.equal({
        foo: '',
        bar: 0,
        bool: false
      });
    });
  });
});
